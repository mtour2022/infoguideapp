import React, { useState, useEffect, useRef} from "react";
import { Container, Row, Col, Form, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { db, storage } from "../../config/firebase";
import {  collection, addDoc, doc, updateDoc  } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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



import {
  geoOptions,
  accessibilityOptions,
  classificationOptions,
} from '../../datamodel/accommodation_model';
import {
  resortActivitiesOptions,
  resortFacilitiesOptions
} from '../../datamodel/recreationalresort_model';
import RecreationalResortsFormData from "../../datamodel/recreationalresort_model"; 
import { setDataInElement } from "ckeditor5";

export default function RecreationalResortsForm({}) {
  const [resetKey, setResetKey] = useState(0); // Reset trigger
  const [recreationalResortFormData, setrecreationalResortFormData] = useState(new RecreationalResortsFormData());

    // Local state for selections
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedClassification, setSelectedClassification] = useState("");

  // Generic change handler for form fields.
  const handleChange = (e, field) => {
    if (Array.isArray(e)) {
        // If `e` is an array, it's coming from TextGroupInputField
        setrecreationalResortFormData((prev) => ({
            ...prev,
            [field]: e, // Directly set the array value
        }));
    } else if (typeof e === "string") {
        // If `e` is a string, it's from ReactQuill (rich text editor)
        setrecreationalResortFormData((prev) => ({
            ...prev,
            [field]: e,
        }));
    } else {
        // Standard form fields
        const { name, value } = e.target;
        setrecreationalResortFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
  };


  // Handle category change and reset subcategory.
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setrecreationalResortFormData((prev) => ({
      ...prev,
      category: value,
      subcategory: "",
    }));
  };

  const handleLocationSelect = (position, link) => {
    if (!position) {
      console.warn("handleLocationSelect received null position.");
      return;
    }
  
    setrecreationalResortFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        lat: position.lat || "", // Ensure it doesn't break if position is missing
        long: position.lng || "",
      },
      link: link || "", // Ensure link is never undefined
    }));
  };
  
  

  useEffect(() => {
    if (!recreationalResortFormData.accreditation) {
      setrecreationalResortFormData((prevData) => ({
        ...prevData,
        category: "Hospitality & Lodging",
        subcategory: "Recreational Resorts",
      }));
      setSelectedCategory("Hospitality & Lodging");
      setSelectedSubcategory("Recreational Resorts")
    }
  }, [setrecreationalResortFormData, recreationalResortFormData.category, recreationalResortFormData.subcategory]);
  

  

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
            text: "Please wait while we submit your resorts data.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    
        try {
            // Upload header image if available
            let headerImageURL = recreationalResortFormData.headerImage
                ? await uploadImageToFirebase(recreationalResortFormData.headerImage, `resorts/${Date.now()}_${recreationalResortFormData.headerImage.name}`)
                : null;
    
            // Upload logo if available
            let logoURL = recreationalResortFormData.logo
                ? await uploadImageToFirebase(recreationalResortFormData.logo, `resorts/${Date.now()}_${recreationalResortFormData.logo.name}`)
                : null;
    
            // Upload images if available
            const imagesURLs = await Promise.all(
              recreationalResortFormData.images.map(async (image) => {
                    return image ? await uploadImageToFirebase(image, `resorts/${Date.now()}_${image.name}`) : "";
                })
            );
    
            // Create an instance of AccommodationFormData and populate it
            const recreationalResortData = new RecreationalResortsFormData();
            recreationalResortData.id = ""; // Firestore will generate this
            recreationalResortData.name = recreationalResortFormData.name;
            recreationalResortData.category = recreationalResortFormData.category || selectedCategory;
            recreationalResortData.subcategory = recreationalResortFormData.subcategory || selectedSubcategory;
            recreationalResortData.classification = recreationalResortFormData.classification || selectedClassification;
            recreationalResortData.established = recreationalResortFormData.established;
            recreationalResortData.lowest = recreationalResortFormData.lowest;
            recreationalResortData.slogan = recreationalResortFormData.slogan;
            recreationalResortData.description = recreationalResortFormData.description;
            recreationalResortData.facilities = recreationalResortFormData.facilities || [];
            recreationalResortData.activities = recreationalResortFormData.activities || [];
            recreationalResortData.images = imagesURLs;
            recreationalResortData.operatinghours = recreationalResortFormData.operatinghours || [];
            recreationalResortData.accessibility = recreationalResortFormData.accessibility || [];
            recreationalResortData.logo = logoURL;
            recreationalResortData.headerImage = headerImageURL;
            recreationalResortData.website = recreationalResortFormData.website;
            recreationalResortData.address = { ...recreationalResortFormData.address };
            recreationalResortData.link = recreationalResortFormData.link;
            recreationalResortData.geo = recreationalResortFormData.geo;
            recreationalResortData.socials = recreationalResortFormData.socials || [];;
            recreationalResortData.note = recreationalResortFormData.note;
    
            // Save accommodation data to Firestore
            const docRef = await addDoc(collection(db, "resorts"), recreationalResortData.toJSON());
            const accommodationDoc = doc(db, "resorts", docRef.id);
            await updateDoc(accommodationDoc, { id: docRef.id });
    
            Swal.fire({
                title: "Recreational Resort Submitted",
                text: "Your resort has been submitted successfully!",
                icon: "success",
            });
    
            // Reset form data after successful submission
            resetForm();
            resetHeaderImage();
        } catch (error) {
            console.error("Error submitting resort:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your resort. Please try again.",
                icon: "error",
            });
        }
    };
      
  
  

  const resetLogo = () => {
    setrecreationalResortFormData((prev) => ({
        ...prev,
        logo: null,
    }));
  };

  const resetHeaderImage = () => {
    setrecreationalResortFormData((prev) => ({
        ...prev,
        headerImage: null,
    }));
  };

  const resetForm = () => {
    setrecreationalResortFormData({
      id : "",
      name : "",
      category : "",
      subcategory : "",
      classification : "",
      established : "",
      lowest : "",
      slogan : "",
      description : "",
      facilities : [],
      activities : [],
      images : [],
      operatinghours : [],
      accessibility : [],
      logo : null,
      headerImage : null,
      website : "",
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
      socials : [],
      note : [],
    });
    setResetKey(prevKey => prevKey + 1); // Change key to trigger reset
    setSelectedCategory("");
    setSelectedClassification("");
    setSelectedSubcategory("");
  };


  return (
    
      <Form className="custom-form body-container" onSubmit={handleSubmit}  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
        <Row className="row mb-4">
            <Col md={6}>
            <Form.Group controlId="category" className="mb-3">
              <Form.Label className="label">Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category"
                name="category"
                value={recreationalResortFormData.category || "Hospitality & Lodging"}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>

            </Col>
            <Col md={6}>
            <Form.Group controlId="subcategory" className="mb-3">
              <Form.Label className="label">Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Subcategory"
                name="subcategory"
                value={recreationalResortFormData.subcategory || "Accommodation Establishments"}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            {selectedSubcategory && classificationOptions[selectedSubcategory] && (
            <Form.Group controlId="formClassification" className="mb-3">
            <Form.Label className="label">Classification</Form.Label>
            <Form.Select
              value={recreationalResortFormData.classification || ""}
              onChange={(e) => {
                const newClassification = e.target.value;
                setSelectedClassification(newClassification);

                // Update accommodationFormData
                setrecreationalResortFormData((prev) => ({
                  ...prev,
                  classification: newClassification,
                }));
              }}
            >
              <option value="">Select Classification</option>
              {classificationOptions[selectedSubcategory]?.map((classification, index) => (
                <option key={index} value={classification}>{classification}</option>
              ))}
            </Form.Select>
            </Form.Group>
            )}
            </Col>
        </Row >
        <Container className="empty-container"></Container>
        <hr></hr>
        <Container className="empty-container"></Container>

        <Row >
          <Col  md={6}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label className="label">Business Logo</Form.Label>
                    <LogoImageDropzone
                    storyForm={recreationalResortFormData}
                    setStoryForm={setrecreationalResortFormData}
                    dropzoneName="dropzone-container-small"
                    previewName="dropzone-uploaded-image-small"
                    caption="Drag & Drop Logo here"
                    required
                    />
            </Form.Group>
            </Col>
          <Col md={6}>
          <Container></Container>
          </Col>
          
        </Row>
        <Row className="mt-2" > 
          <Col md={12}>
            <Form.Group controlId="name" className="mb-3">
                <Form.Label className="label">Business Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter business name"
                  name="name"
                  value={recreationalResortFormData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
          </Col>

        </Row>
       
        <Row className="mt-2" > 
          <Col md={9}>
          <Form.Group controlId="slogan" className="mb-3">
              <Form.Label className="label">Business Slogan/Phrase/Tagline</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter business slogan/phrase/tagline"
                name="slogan"
                value={recreationalResortFormData.slogan}
                onChange={handleChange}
              />
            </Form.Group>
           
          </Col>
          <Col md={3}>
            <Form.Group controlId="established" className="mb-3">
                <Form.Label className="label">Year Established</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="e.g.: 2000"
                    name="established"
                    required
                    value={recreationalResortFormData.established}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        handleChange(e); // Only update state if input is valid
                      }
                    }}
                />
                </Form.Group>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <Form.Group controlId="description" className="mb-5 mt-2">
                <Form.Label className="label">Brief Description</Form.Label>
                <ReactQuill
                    theme="snow"
                    value={recreationalResortFormData.description || ""} 
                    onChange={(value) => handleChange(value, "description")} // Pass value and field name
                    required
                    style={{ height: '300px' }} 
                />
                </Form.Group>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12} >
            <AddressInput groupData={recreationalResortFormData} setGroupData={setrecreationalResortFormData} resetKey={resetKey}></AddressInput>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
          <MapWidgetFormGroup
            onLocationSelect={handleLocationSelect}
             name={recreationalResortFormData.name || ""}
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
                    value={recreationalResortFormData.link}
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
                    value={recreationalResortFormData.address.lat}
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
                    value={recreationalResortFormData.address.long}
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
              value={recreationalResortFormData.geo}
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
              value={recreationalResortFormData.accessibility}
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
                    storyForm={recreationalResortFormData}
                    setStoryForm={setrecreationalResortFormData}
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
                  dataForm={recreationalResortFormData}
                  setDataForm={setrecreationalResortFormData}
                  caption="Drag & drop images or click to select (Max: 10)"
                  dropzoneName="dropzone-container-small"
                  previewName="dropzone-uploaded-image-small"
                />
            </Form.Group>
            </Col>
        </Row>
        <Row className="mt-2" > 
          <Col md={6}>
            <Form.Group controlId="website" className="mb-3">
                <Form.Label className="label">Official Website Link</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter website link"
                  name="website"
                  value={recreationalResortFormData.website}
                  onChange={handleChange}
                />
              </Form.Group>
          </Col>
          <Col md={6}>
            <TextGroupInputField
              onChange={(value) => handleChange(value, "socials")}
              label={"Social Media Links (Type & Enter)"}
              editingItems={recreationalResortFormData.socials}
              resetKey={resetKey} 
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={6}>
            <TextGroupInputField
              onChange={(value) => handleChange(value, "operatinghours")}
              label={"Operating Hours (Type & Enter)"}
              editingItems={recreationalResortFormData.operatinghours}
              resetKey={resetKey} 
              caption="format: hh:mm A  | e.g. 08:00 AM"
            />
          </Col>
          <Col md={6}>
          <Form.Group controlId="lowest" className="mb-3">
            <Form.Label className="label">Lowest Price</Form.Label>
            <p className="subtitle">format: 00000.00 | e.g. 12000.00</p>
            <Form.Control
              type="text"
              placeholder="Enter Lowest Price"
              name="lowest"
              value={recreationalResortFormData.lowest}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  handleChange(e); // Only update state if input is valid
                }
              }}
            />
          </Form.Group>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <SelectionFieldWidget
              onChange={(value) => handleChange(value, "facilities")}
              label="Facilities (Search, Select & Enter)"
              resetKey={resetKey} // Pass reset trigger
              options={resortFacilitiesOptions}
              editingItems={recreationalResortFormData.facilities}
              required
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <SelectionFieldWidget
                onChange={(value) => handleChange(value, "activities")}
                label="Activities To do (Search, Select & Enter)"
                resetKey={resetKey} // Pass reset trigger
                options={resortActivitiesOptions}
                editingItems={recreationalResortFormData.activities}
                required
              />
            {/* <TextGroupInputField
                label="Activities To do"
                onChange={(value) => handleChange(value, "activities")}
                editingItems={recreationalResortFormData.activities}
                resetKey={resetKey} 
              /> */}
          </Col>
        </Row>
        <Container className="empty-container"></Container>
        <hr></hr>
        <Container className="empty-container"></Container>
        <Row className="mt-2">
          <Col md={12}>
            <Form.Group controlId="note" className="mb-5 mt-2">
                <Form.Label className="label">Notes, Reminders, Remarks, and Other Details</Form.Label>
                <ReactQuill
                    theme="snow"
                    value={recreationalResortFormData.note || ""} 
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
                                  Submit Resort
                              </Button>
                          </Container>
        </Row>

        <Container className="empty-container"></Container>

      </Form>
      

  );
}
