import React, { useState, useEffect, useRef} from "react";
import { Container, Row, Col, Form, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { db, storage } from "../../config/firebase";
import {  collection, addDoc, doc, updateDoc  } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDropzone } from "react-dropzone"; // Dropzone for image upload

import Swal from "sweetalert2";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import AddressInput from '../Address';
import MapWidgetFormGroup from "../map/MapLocator"; // Adjust the import path as needed
import HeaderImageDropzone from '../HeaderImageDropzone';
import LogoImageDropzone from "../LogoImageDrop";
import SelectionFieldWidget from "../SelectionField";
import TextGroupInputField from "../TextGroupInputField";
import MultiImageDropzone from "../MultiImageDropzone";
import RichTextEditor from '../TextEditor'; // adjust the path as needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faCirclePlay, faCirclePlus, faCancel} from '@fortawesome/free-solid-svg-icons';
import {
  geoOptions,
  accessibilityOptions,
} from '../../datamodel/accommodation_model';

import {
  attractionsCategoryOptions,
} from '../../datamodel/attractions_model';
import AttractionFormData from "../../datamodel/attractions_model"; 
import { setDataInElement } from "ckeditor5";

const BodyMediaDropzone = ({
  index,
  section,
  onBodyMediaDrop,
  dropzoneName = "dropzone-container-small",
  previewName = "dropzone-uploaded-media-small"
}) => {
  const { getRootProps, getInputProps } = useDropzone({
      onDrop: (acceptedFiles) => onBodyMediaDrop(acceptedFiles, index),
      accept: "image/png, image/jpeg, image/jpg, video/mp4, video/webm, video/ogg",
  });

  // Use the new uploaded media if available
  const mediaPreview = section.media
      ? URL.createObjectURL(section.media)
      : null;

  return (
      <Container
          {...getRootProps()}
          className={`${dropzoneName} text-center w-100 ${mediaPreview ? "border-success" : ""}`}
      >
          <input {...getInputProps()} accept="image/*,video/*" />
          {mediaPreview ? (
              section.media.type.startsWith("video/") ? (
                  <video controls className={previewName}>
                      <source src={mediaPreview} type={section.media.type} />
                      Your browser does not support the video tag.
                  </video>
              ) : (
                  <img
                      src={mediaPreview}
                      alt="Body Media Preview"
                      className={previewName}
                  />
              )
          ) : (
              <p className="text-muted">
                  Drag & Drop Image/Video Here or {" "}
                  <span className="text-primary text-decoration-underline">Choose File</span>
              </p>
          )}
      </Container>
  );
};



  


export default function AttractionsForm({}) {
  const [resetKey, setResetKey] = useState(0); // Reset trigger
  const [attractionFormData, setAttractionFormData] = useState(new AttractionFormData());


    // Local state for selections
    const [selectedCategory, setSelectedCategory] = useState("");

  // Generic change handler for form fields.
  const handleChange = (e, field) => {
    if (Array.isArray(e)) {
        // If `e` is an array, it's coming from TextGroupInputField
        setAttractionFormData((prev) => ({
            ...prev,
            [field]: e, // Directly set the array value
        }));
    } else if (typeof e === "string") {
        // If `e` is a string, it's from ReactQuill (rich text editor)
        setAttractionFormData((prev) => ({
            ...prev,
            [field]: e,
        }));
    } else {
        // Standard form fields
        const { name, value } = e.target;
        setAttractionFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
  };

  
  const handleBodyChange = (index, field, value) => {
    setAttractionFormData((prev) => {
    const newBody = [...prev.body];
    newBody[index] = { ...newBody[index], [field]: value };
    return { ...prev, body: newBody };
    });
};

const handleImageDrop = (acceptedFiles, index) => {
    const file = acceptedFiles[0]; // Take the first file

    if (file) {
      setAttractionFormData((prevState) => {
            const updatedBody = [...prevState.body];
            updatedBody[index] = {
                ...updatedBody[index],
                image: file, // Store file for upload
                imageUrl: URL.createObjectURL(file), // Preview new image
            };
            return {
                ...prevState,
                body: updatedBody,
            };
        });
    }
}

const addBodySection = () => {
  setAttractionFormData((prev) => ({
    ...prev,
    body: [...prev.body, { subtitle: "", body: "", image: null, image_source: ""}],
    }));
};

const deleteBodySection = (index) => {
  setAttractionFormData((prev) => {
    const newBody = prev.body.filter((_, i) => i !== index);
    return { ...prev, body: newBody };
    });
};



  const handleLocationSelect = (position, link) => {
    if (!position) {
      console.warn("handleLocationSelect received null position.");
      return;
    }
  
    setAttractionFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        lat: position.lat || "", // Ensure it doesn't break if position is missing
        long: position.lng || "",
      },
      link: link || "", // Ensure link is never undefined
    }));
  };
  

  

  // When submitting, upload the data to Firebase Firestore.
  // Upload image to Firebase Storage (only when submit is clicked)
    const uploadImageToFirebase = async (imageFile, path) => {
        const imageRef = ref(storage, path);
        await uploadBytes(imageRef, imageFile);
        return await getDownloadURL(imageRef);
    };
  

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Show SweetAlert2 loading screen
        Swal.fire({
            title: "Submitting...",
            text: `Please wait while we submit your attractions data.`,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    
        try {
            // Upload header image if available
            let headerImageURL = attractionFormData.headerImage
                ? await uploadImageToFirebase(attractionFormData.headerImage, `attractions/${Date.now()}_${attractionFormData.headerImage.name}`)
                : null;

    
            // Upload images if available
            const imagesURLs = await Promise.all(
              attractionFormData.images.map(async (image) => {
                    return image ? await uploadImageToFirebase(image, `attractions/${Date.now()}_${image.name}`) : "";
                })
            );

            // Upload body images if available
            const bodyImagesURLs = await Promise.all(
              attractionFormData.body.map(async (section, index) => {
                  if (section.image) {
                      const imageURL = await uploadImageToFirebase(section.image, `attractions/${Date.now()}_${section.image.name}`);
                      return imageURL;
                  }
                  return "";
              })
          );

    
            const attractionData = new AttractionFormData();
            attractionData.id = ""; // Firestore will generate this
            attractionData.name = attractionFormData.name;
            attractionData.category = attractionFormData.category || selectedCategory;
            attractionData.body = attractionFormData.body.map((section, index) => ({
              subtitle: section.subtitle || "",
              body: section.body || "",
              image: bodyImagesURLs[index] || "",
              image_source: section.image_source || "",
            })); 
            attractionData.images = imagesURLs;
            attractionData.operatinghours = attractionFormData.operatinghours || [];
            attractionData.accessibility = attractionFormData.accessibility || [];
            attractionData.headerImage = headerImageURL;
            attractionData.address = { ...attractionFormData.address };
            attractionData.link = attractionFormData.link;
            attractionData.geo = attractionFormData.geo;
            attractionData.note = attractionFormData.note;
            attractionData.howToGetThere = attractionFormData.howToGetThere;
            attractionData.tags = attractionFormData.tags;
            attractionData.thingsToDo = attractionFormData.thingsToDo;
    
            // Save accommodation data to Firestore
            const docRef = await addDoc(collection(db, `attractions`), attractionData.toJSON());
            const enterpriseDoc = doc(db, `attractions`, docRef.id);
            await updateDoc(enterpriseDoc, { id: docRef.id });
    
            Swal.fire({
                title: `Attractions Submitted`,
                text: "Your data has been submitted successfully!",
                icon: "success",
            });
    
            // Reset form data after successful submission
            resetForm();
            resetHeaderImage();
        } catch (error) {
            console.error("Error submitting data:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your data. Please try again.",
                icon: "error",
            });
        }
    };

  const resetHeaderImage = () => {
    setAttractionFormData((prev) => ({
        ...prev,
        headerImage: null,
    }));
  };

  const resetForm = () => {
    setAttractionFormData({
      id : "",
      name : "",
      category : "",
      body: [{ subtitle: "", body: "", image: null, image_source: ""}],
      images : [],
      operatinghours : [],
      accessibility : [],
      headerImage : null,
      address: {
        street: "",
        barangay: "",
        town: "",
        region: "",
        province: "",
        country: "",
        lat: "",
        long: "",
      },
      link : "",
      geo : "",
      note : "",
      thingsToDo: [],
      tags: [],
      howToGetThere: "",
    });
    setResetKey(prevKey => prevKey + 1); // Change key to trigger reset
    setSelectedCategory("");
  };

  const removeBodyImage = (index) => {
    setAttractionFormData((prev) => {
    const newBody = [...prev.body];
    if (!newBody[index]) return prev;
    newBody[index] = { ...newBody[index], image: null };
    return { ...prev, body: newBody };
    });
  };


  return (
    
      <Form className="custom-form body-container" onSubmit={handleSubmit}  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
        <Row>
                            <Col md={6}>
                                <Form.Group controlId="category" className="mb-3">
                                            <Form.Label className="label">Category</Form.Label>
                                            <Form.Select
                                              name="category"
                                              value={attractionFormData.category}
                                              onChange={handleChange}
                                            >
                                              <option value="" disabled>Select Category</option>
                                              {attractionsCategoryOptions.map((option, index) => (
                                                <option key={index} value={option}>
                                                  {option}
                                                </option>
                                              ))}
                                            </Form.Select>
                                          </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Container className="empty-container"></Container>
                            </Col>
        </Row>
        <Container className="empty-container"></Container>
        <hr></hr>
        <Container className="empty-container"></Container>

        <Row className="mt-2" > 
          <Col md={12}>
            <Form.Group controlId="name" className="mb-3">
                <Form.Label className="label">Attraction Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter attraction name"
                  name="name"
                  value={attractionFormData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
          </Col>
        </Row>
           {/* Body Sections */}
           <Container className="empty-container"></Container>

                
           <Row>
                <Col md={12}>
                    <p className="label mb-2">Body Sections</p>
                    {attractionFormData.body.map((section, index) => (
                                <Row key={index} className="d-flex flex-md-row flex-column">
                                <Container className="empty-container"></Container>
                                <Form.Group className="mb-3 m-0 p-0">
                                    <Form.Label className="label">Subtitle (Optional)</Form.Label>
                                    <Form.Control
                                    type="text"
                                    className="fw-bold"
                                    value={section.subtitle}
                                    onChange={(e) => handleBodyChange(index, "subtitle", e.target.value)}
                                    />
                                </Form.Group>
                                <Col className="col me-lg-2 me-md-1">
                                    <Form.Group className="mb-3">
                                    <Form.Label className="label">Image (Optional)</Form.Label>
                                    <BodyMediaDropzone 
                                        index={index} 
                                        section={section} 
                                        onBodyImageDrop={handleImageDrop} 
                                        dropzoneName="dropzone-container-small"
                                        previewName="dropzone-uploaded-image-small"
                                    />

                                    {section.image && (
                                        <Container className="d-flex justify-content-end">
                                            <Button
                                            className="mt-2 mb-1"
                                            variant="outline-danger"
                                            onClick={() => removeBodyImage(index)}
                                            >
                                            <FontAwesomeIcon icon={faCancel} size="xs" fixedWidth /> Remove Image
                                            </Button>
                                        </Container>
                                    )}
                                    </Form.Group>
                                    <Form.Group className="mb-3 m-0 p-0">
                                        <Form.Label className="label">Image Source (Optional)</Form.Label>
                                        <Form.Control
                                        placeholder="e.g. @boracayphotos or /islanders or #trivago or www.trivago.com"
                                        type="text"
                                        value={section.image_source}
                                        onChange={(e) => handleBodyChange(index, "image_source", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col className="col ms-lg-2 ms-md-1">
                                    <Form.Group className="mb-5">
                                    <Form.Label className="label">Body</Form.Label>
                                        <RichTextEditor
                                            index={index}
                                            section={section}
                                            handleBodyChange={handleBodyChange}
                                            />
                                    </Form.Group>
                                </Col>
                                {attractionFormData.body.length > 1 && (
                                    <Container className="mb-4 d-flex justify-content-end">
                                        <Button
                                        variant="outline-danger"
                                        type="button"
                                        onClick={() => deleteBodySection(index)}
                                        className="mt-3 w-full"
                                        >
                                        <FontAwesomeIcon icon={faTrash} size="xs" fixedWidth /> Delete Section
                                        </Button>
                                    </Container>
                                    )}
                                </Row>
                            ))}
                    <hr></hr>
                    <Container className="empty-container"></Container>
                    <Container className="d-flex justify-content-end">
                        <Button variant="outline-success" type="button" onClick={addBodySection} className="mb-3">
                            <FontAwesomeIcon icon={faCirclePlus} size="xs" fixedWidth /> Add Section
                        </Button>
                    </Container>
                </Col>
               </Row>
                <Container className="empty-container"></Container>
        <Row className="mt-2">
          <Col md={12} >
            <AddressInput groupData={attractionFormData} setGroupData={setAttractionFormData} resetKey={resetKey}></AddressInput>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
          <MapWidgetFormGroup
            onLocationSelect={handleLocationSelect}
             name={attractionFormData.name || ""}
             resetKey={resetKey}
          />
          </Col>
        </Row>
        <Row className="mt-2">
            <Col md={12}>
                <Form.Group controlId="link" className="mb-3">
                <Form.Label className="label">Google Map Link</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Select Location First"
                    name="link"
                    value={attractionFormData.link}
                    onChange={handleChange}
                    readOnly
                />
                </Form.Group>
            </Col>
        </Row>
        <Row className="mt-2">
            <Col md={6}>
                <Form.Group controlId="lat" className="mb-3">
                <Form.Label className="label">Lattitude</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Select Location First"
                    name="lat"
                    value={attractionFormData.address.lat}
                    onChange={handleChange}
                    readOnly
                />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group controlId="long" className="mb-3">
                <Form.Label className="label">Longitude</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Select Location First"
                    name="long"
                    value={attractionFormData.address.long}
                    onChange={handleChange}
                    readOnly
                />
                </Form.Group>
            </Col>
        </Row>
        <Row className="mt-2">
        <Col md={6}>
          <Form.Group controlId="accessibility" className="mb-3">
            <Form.Label className="label">Geographical Location</Form.Label>
            <Form.Select
              name="geo"
              value={attractionFormData.geo}
              onChange={handleChange}
            >
              <option value="" disabled>Select Geo Location</option>
              {geoOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="accessibility" className="mb-3">
            <Form.Label className="label">Accessibility</Form.Label>
            <Form.Select
              name="accessibility"
              value={attractionFormData.accessibility}
              onChange={handleChange}
            >
              <option value="" disabled>Select Accessibility</option>
              {accessibilityOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
          
        </Row>
        <Container className="empty-container"></Container>
        <hr></hr>
        <Container className="empty-container"></Container>

        <Row className="mt-2">
            <Col  md={12}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label className="label">Cover Photo</Form.Label>
              <HeaderImageDropzone
                    storyForm={attractionFormData}
                    setStoryForm={setAttractionFormData}
                    dropzoneName="dropzone-container-big"
                    previewName="dropzone-uploaded-image-big"
                    />
            </Form.Group>
            </Col>
        </Row>
        <Row className="mt-2">
            <Col  md={12}>
            <Form.Group controlId="name" >
              <Form.Label className="label me-2">Promotional & Marketing Photos</Form.Label>
              <MultiImageDropzone
                  dataForm={attractionFormData}
                  setDataForm={setAttractionFormData}
                  caption="Drag & drop images or click to select (Max: 10)"
                  dropzoneName="dropzone-container-small"
                  previewName="dropzone-uploaded-image-small"
                />
            </Form.Group>
            </Col>
        </Row>
        <Container className="empty-container"></Container>


        <Row className="mt-2">
          <Col md={12}>
            <TextGroupInputField
              onChange={(value) => handleChange(value, "operatinghours")}
              label={"Operating Hours (Type & Enter)"}
              editingItems={attractionFormData.operatinghours}
              resetKey={resetKey} 
              caption="format: hh:mm A  | e.g. 08:00 AM"
            />
          </Col>
        </Row>
        
        <Row className="mt-2">
          <Col md={6}>
            <TextGroupInputField
              onChange={(value) => handleChange(value, "tags")}
              label={"Tags (Type & Enter)"}
              editingItems={attractionFormData.tags}
              resetKey={resetKey} 
            />
          </Col>
          <Col md={6}>
            <TextGroupInputField
              onChange={(value) => handleChange(value, "thingsToDo")}
              label={"Things To Do (Type & Enter)"}
              editingItems={attractionFormData.thingsToDo}
              resetKey={resetKey} 
            />
          </Col>
        </Row>
        <Container className="empty-container"></Container>
        <hr></hr>
        <Container className="empty-container"></Container>
        <Row className="mt-2">
          <Col md={12}>
            <Form.Group controlId="howToGetThere" className="mb-5 mt-2">
                <Form.Label className="label">How To Get There?</Form.Label>
                <ReactQuill
                    theme="snow"
                    value={attractionFormData.howToGetThere || ""} 
                    onChange={(value) => handleChange(value, "howToGetThere")} // Pass value and field name
                    required
                    style={{ height: '300px' }} 
                />
                </Form.Group>
          </Col>
        </Row>
        <Container className="empty-container"></Container>

        <Row className="mt-2">
          <Col md={12}>
            <Form.Group controlId="note" className="mb-5 mt-2">
                <Form.Label className="label">Notes, Reminders, Remarks, and Other Details</Form.Label>
                <ReactQuill
                    theme="snow"
                    value={attractionFormData.note || ""} 
                    onChange={(value) => handleChange(value, "note")} // Pass value and field name
                    required
                    style={{ height: '300px' }} 
                />
                </Form.Group>
          </Col>
        </Row>
        <Container className="empty-container"></Container>

        <Row className="mt-2">
          <Container className="d-flex justify-content-between">
                              <Button variant="outline-danger" className="ms-3" onClick={resetForm}>Reset Form</Button>
                              <Button 
                                  variant="outline-primary" 
                                  type="submit" 
                                  className="w-full me-3" 
                                  onClick={handleSubmit}
                              >
                                  Submit Attraction
                              </Button>
                          </Container>
        </Row>

        <Container className="empty-container"></Container>

      </Form>
      

  );
}
