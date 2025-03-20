import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { db, storage } from "../../config/firebase";
import {  collection, addDoc, doc, updateDoc  } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import 'react-quill-new/dist/quill.snow.css';
import TextGroupInputField from "../TextGroupInputField";
import HeaderImageDropzone from '../HeaderImageDropzone';
import RichTextEditor from '../TextEditor'; // adjust the path as needed

import TariffRatesFormData from "../../datamodel/tariff_model"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faCirclePlay, faCirclePlus, faCancel} from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from "react-dropzone"; // Dropzone for image upload



const BodyImageDropzone = ({
  index,
  section,
  onBodyImageDrop,
  dropzoneName = "dropzone-container-small",
  previewName = "dropzone-uploaded-image-small"
}) => {
  const { getRootProps, getInputProps } = useDropzone({
      onDrop: (acceptedFiles) => onBodyImageDrop(acceptedFiles, index),
      accept: "image/png, image/jpeg, image/jpg, video/mp4, video/webm, video/ogg",
  });

  // Handle both File objects and URLs
  const imagePreview = section.image 
      ? section.image instanceof File 
          ? URL.createObjectURL(section.image) 
          : section.image  // If it's a URL, use it directly
      : null;

  return (
      <Container
          {...getRootProps()}
          className={`${dropzoneName} text-center w-100 ${imagePreview ? "border-success" : ""}`}
      >
          <input {...getInputProps()} accept="image/*,video/*" />
          {imagePreview ? (
              section.image instanceof File && section.image.type.startsWith("video/")
              ? (
                  <video controls className={previewName}>
                      <source src={imagePreview} type={section.image.type} />
                      Your browser does not support the video tag.
                  </video>
              ) : (
                  <img
                      src={imagePreview}
                      alt="Body Image Preview"
                      className={previewName}
                  />
              )
          ) : (
              <p className="text-muted">
                  Drag & Drop Image/Video Here or{" "}
                  <span className="text-primary text-decoration-underline">Choose File</span>
              </p>
          )}
      </Container>
  );
};

  


export default function TariffRatesForm({}) {
  const [resetKey, setResetKey] = useState(0); // Reset trigger
  const [tariffRatesFormData, setTariffRatesFormData] = useState(new TariffRatesFormData());


  // Generic change handler for form fields.
  const handleChange = (e, field) => {
    if (Array.isArray(e)) {
        // If `e` is an array, it's coming from TextGroupInputField
        setTariffRatesFormData((prev) => ({
            ...prev,
            [field]: e, // Directly set the array value
        }));
    } else if (typeof e === "string") {
        // If `e` is a string, it's from ReactQuill (rich text editor)
        setTariffRatesFormData((prev) => ({
            ...prev,
            [field]: e,
        }));
    } else {
        // Standard form fields
        const { name, value } = e.target;
        setTariffRatesFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
  };

  const resetHeaderImage = () => {
    setTariffRatesFormData((prev) => ({
        ...prev,
        headerImage: null,
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
            text: "Please wait while we submit your requirement data.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    
        try {

            // Upload header image if available
            let headerImageURL = tariffRatesFormData.headerImage
                ? await uploadImageToFirebase(tariffRatesFormData.headerImage, `tariffs/${Date.now()}_${tariffRatesFormData.headerImage.name}`)
                : null;
            // Create an instance of AccommodationFormData and populate it
            const tariffData = new TariffRatesFormData();
            tariffData.id = ""; // Firestore will generate this
            tariffData.title = tariffRatesFormData.title;
            tariffData.ordinance = tariffRatesFormData.ordinance;
            tariffData.implementor = tariffRatesFormData.implementor;
            tariffData.body = tariffRatesFormData.body.map((section, index) => ({
              subtitle: section.subtitle || "",
              body: section.body || "",
              image: bodyImagesURLs[index] || "",
              image_source: section.image_source || "",
            })); 
            tariffData.headerImage = headerImageURL;
            tariffData.serviceProviders = tariffRatesFormData.serviceProviders || [];;
            tariffData.references = tariffRatesFormData.references || [];
    
            // Save accommodation data to Firestore
            const docRef = await addDoc(collection(db, "tariffs"), tariffData.toJSON());
            const tariffDoc = doc(db, "tariffs", docRef.id);
            await updateDoc(tariffDoc, { id: docRef.id });
    
            Swal.fire({
                title: "Tariff Submitted",
                text: "Your Tariff has been submitted successfully!",
                icon: "success",
            });
            // Reset form data after successful submission
            resetForm();
            resetHeaderImage();
        } catch (error) {
            console.error("Error submitting Tariff:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your Tariff. Please try again.",
                icon: "error",
            });
        }
    };

  const resetForm = () => {
    setTariffRatesFormData({
      id : "",
      title : "",
      ordinance : "",
      implementor: [],
      body: [{ subtitle: "", body: "", image: null, image_source: ""}],
      headerImage : null,
      serviceProviders : [],
      references : [],
    });
    setResetKey(prevKey => prevKey + 1); // Change key to trigger reset
  };

  const handleBodyChange = (index, field, value) => {
    setTariffRatesFormData((prev) => {
    const newBody = [...prev.body];
    newBody[index] = { ...newBody[index], [field]: value };
    return { ...prev, body: newBody };
    });
};

const handleImageDrop = (acceptedFiles, index) => {
    const file = acceptedFiles[0]; // Take the first file

    if (file) {
      setTariffRatesFormData((prevState) => {
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
  setTariffRatesFormData((prev) => ({
    ...prev,
    body: [...prev.body, { subtitle: "", body: "", image: null, image_source: ""}],
    }));
};

const deleteBodySection = (index) => {
  setTariffRatesFormData((prev) => {
    const newBody = prev.body.filter((_, i) => i !== index);
    return { ...prev, body: newBody };
    });
};

const removeBodyImage = (index) => {
  setTariffRatesFormData((prev) => {
  const newBody = [...prev.body];
  if (!newBody[index]) return prev;
  newBody[index] = { ...newBody[index], image: null };
  return { ...prev, body: newBody };
  });
};

  return (
    
      <Form className="custom-form body-container" onSubmit={handleSubmit}  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
     
        <Row className="mt-2">
            <Col  md={12}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label className="label">Cover Photo</Form.Label>
              <HeaderImageDropzone
                    storyForm={tariffRatesFormData}
                    setStoryForm={setTariffRatesFormData}
                    dropzoneName="dropzone-container-big"
                    previewName="dropzone-uploaded-image-big"
                    />
            </Form.Group>
            </Col>
        </Row>
        <Row className="mt-2" > 
          <Col md={12}>
            <Form.Group controlId="name" className="mb-3">
                <Form.Label className="label">Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter business name"
                  name="title"
                  value={tariffRatesFormData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
          </Col>
        </Row>
        <Row className="mt-2" > 
          <Col md={12}>
            <Form.Group controlId="ordinance" className="mb-3">
                <Form.Label className="label">Ordinance No. (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter odinance no."
                  name="ordinance"
                  value={tariffRatesFormData.ordinance}
                  onChange={handleChange}
                />
              </Form.Group>
          </Col>
        </Row>
        <Row className="mt-2" > 
          <Col md={12}>
            <TextGroupInputField
                onChange={(value) => handleChange(value, "implementor")}
                label={"Implementing Office (Type & Enter)"}
                editingItems={tariffRatesFormData.implementor}
                resetKey={resetKey} 
                required
              />
          </Col>
        </Row>
        {/* Body Sections */}
        <Container className="empty-container"></Container>

                
        <Row>
            <Col md={12}>
                <p className="label mb-2">Body Sections</p>
                {tariffRatesFormData.body.map((section, index) => (
                            <Row key={index} className="d-flex flex-md-row flex-column">
                            <Container className="empty-container"></Container>
                            <Form.Group className="mb-3 m-0 p-0">
                                <Form.Label className="label">Subtitle (Optional)</Form.Label>
                                <Form.Control
                                type="text"
                                className="fw-bold"
                                placeholder="Enter Section Title Here"
                                value={section.subtitle}
                                onChange={(e) => handleBodyChange(index, "subtitle", e.target.value)}
                                />
                            </Form.Group>
                            <Col className="col me-lg-2 me-md-1">
                                <Form.Group className="mb-3">
                                <Form.Label className="label">Image (Optional)</Form.Label>
                                <BodyImageDropzone 
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
                            {tariffRatesFormData.body.length > 1 && (
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
        <hr></hr>
        <Container className="empty-container"></Container>
        <Row className="mt-2" > 
          <Col md={6}>
            <TextGroupInputField
                onChange={(value) => handleChange(value, "serviceProviders")}
                label={"Service Providers (Type & Enter)"}
                editingItems={tariffRatesFormData.serviceProviders}
                resetKey={resetKey} 
              />
          </Col>
          <Col md={6}>
            <TextGroupInputField
                onChange={(value) => handleChange(value, "references")}
                label={"References and Links (Type & Enter)"}
                editingItems={tariffRatesFormData.references}
                resetKey={resetKey} 
              />
          </Col>
        </Row>
        <Container className="empty-container"></Container>
        <hr></hr>
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
                                  Submit Tariff Rate
                              </Button>
                          </Container>
        </Row>
        <Container className="empty-container"></Container>

      </Form>
      

  );
}
