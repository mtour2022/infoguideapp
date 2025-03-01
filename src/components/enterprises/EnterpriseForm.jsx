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
  inclusivityOptions,
  facilitiesOptions,
  geoOptions,
  accessibilityOptions,
  classificationOptions,
} from '../../datamodel/accommodation_model';
import TourismEnterprisesFormData from "../../datamodel/enterpises_model"; 
import { setDataInElement } from "ckeditor5";


export default function EnterprisesForm({category, subcategory}) {
  const [resetKey, setResetKey] = useState(0); // Reset trigger
  const [enterpriseFormData, setEnterpriseFormData] = useState(new TourismEnterprisesFormData());


    // Local state for selections
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedClassification, setSelectedClassification] = useState("");

  // Generic change handler for form fields.
  const handleChange = (e, field) => {
    if (Array.isArray(e)) {
        // If `e` is an array, it's coming from TextGroupInputField
        setEnterpriseFormData((prev) => ({
            ...prev,
            [field]: e, // Directly set the array value
        }));
    } else if (typeof e === "string") {
        // If `e` is a string, it's from ReactQuill (rich text editor)
        setEnterpriseFormData((prev) => ({
            ...prev,
            [field]: e,
        }));
    } else {
        // Standard form fields
        const { name, value } = e.target;
        setEnterpriseFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
  };


  // Handle category change and reset subcategory.
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setEnterpriseFormData((prev) => ({
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
  
    setEnterpriseFormData((prev) => ({
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
    if (!enterpriseFormData.accreditation) {
      setEnterpriseFormData((prevData) => ({
        ...prevData,
        category: category,
        subcategory: subcategory,
      }));
      setSelectedCategory(category);
      setSelectedSubcategory(subcategory);
    }
  }, [setEnterpriseFormData, category, subcategory]);
  
  const [subcategoryDisplay, setSubcategoryDisplay] = useState("");

  useEffect(() => {
    if (subcategory) {
      const formattedSubcategory = subcategory
        .replace(/([A-Z])/g, " $1") // Insert space before capital letters
        .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
        .trim(); // Remove leading/trailing spaces

      setSubcategoryDisplay(formattedSubcategory);
    }
  }, [subcategory]); // Runs whenever `subcategory` changes

  

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
            text: `Please wait while we submit your ${subcategory} data.`,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    
        try {
            // Upload header image if available
            let headerImageURL = enterpriseFormData.headerImage
                ? await uploadImageToFirebase(enterpriseFormData.headerImage, `${subcategory}/${Date.now()}_${enterpriseFormData.headerImage.name}`)
                : null;
    
            // Upload logo if available
            let logoURL = enterpriseFormData.logo
                ? await uploadImageToFirebase(enterpriseFormData.logo, `${subcategory}/${Date.now()}_${enterpriseFormData.logo.name}`)
                : null;
    
            // Upload images if available
            const imagesURLs = await Promise.all(
              enterpriseFormData.images.map(async (image) => {
                    return image ? await uploadImageToFirebase(image, `${subcategory}/${Date.now()}_${image.name}`) : "";
                })
            );
    
            const enterpriseData = new TourismEnterprisesFormData();
            enterpriseData.id = ""; // Firestore will generate this
            enterpriseData.name = enterpriseFormData.name;
            enterpriseData.category = enterpriseFormData.category || selectedCategory;
            enterpriseData.subcategory = enterpriseFormData.subcategory || selectedSubcategory;
            enterpriseData.classification = enterpriseFormData.classification || selectedClassification;
            enterpriseData.accreditation = enterpriseFormData.accreditation;
            enterpriseData.established = enterpriseFormData.established;
            enterpriseData.lowest = enterpriseFormData.lowest;
            enterpriseData.slogan = enterpriseFormData.slogan;
            enterpriseData.description = enterpriseFormData.description;
            enterpriseData.facilities = enterpriseFormData.facilities || [];
            enterpriseData.activities = enterpriseFormData.activities || [];
            enterpriseData.awards = enterpriseFormData.awards || [];
            enterpriseData.images = imagesURLs;
            enterpriseData.operatinghours = enterpriseFormData.operatinghours || [];
            enterpriseData.inclusivity = enterpriseFormData.inclusivity || [];
            enterpriseData.accessibility = enterpriseFormData.accessibility || [];
            enterpriseData.logo = logoURL;
            enterpriseData.headerImage = headerImageURL;
            enterpriseData.website = enterpriseFormData.website;
            enterpriseData.address = { ...enterpriseFormData.address };
            enterpriseData.link = enterpriseFormData.link;
            enterpriseData.geo = enterpriseFormData.geo;
            enterpriseData.socials = enterpriseFormData.socials || [];;
            enterpriseData.memberships = enterpriseFormData.memberships || [];
            enterpriseData.note = enterpriseFormData.note;
    
            // Save accommodation data to Firestore
            const docRef = await addDoc(collection(db, `${subcategory}`), enterpriseData.toJSON());
            const enterpriseDoc = doc(db, `${subcategory}`, docRef.id);
            await updateDoc(enterpriseDoc, { id: docRef.id });
    
            Swal.fire({
                title: `${subcategory} Submitted`,
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
      
  
  

  const resetLogo = () => {
    setEnterpriseFormData((prev) => ({
        ...prev,
        logo: null,
    }));
  };

  const resetHeaderImage = () => {
    setEnterpriseFormData((prev) => ({
        ...prev,
        headerImage: null,
    }));
  };

  const resetForm = () => {
    setEnterpriseFormData({
      id : "",
      name : "",
      category : "",
      subcategory : "",
      classification : "",
      accreditation : "",
      established : "",
      lowest : "",
      slogan : "",
      description : "",
      facilities : [],
      activities : [],
      awards : [],
      images : [],
      operatinghours : [],
      inclusivity : [],
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
      memberships : [],
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
                value={enterpriseFormData.category || "Hospitality & Lodging"}
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
                value={enterpriseFormData.subcategory}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            {selectedSubcategory && classificationOptions[selectedSubcategory] && (
            <Form.Group controlId="formClassification" className="mb-3">
            <Form.Label className="label">Classification</Form.Label>
            <Form.Select
              value={enterpriseFormData.classification || ""}
              onChange={(e) => {
                const newClassification = e.target.value;
                setSelectedClassification(newClassification);
                setEnterpriseFormData((prev) => ({
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
                    storyForm={enterpriseFormData}
                    setStoryForm={setEnterpriseFormData}
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
                  value={enterpriseFormData.name}
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
                value={enterpriseFormData.slogan}
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
                    value={enterpriseFormData.established}
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
                    value={enterpriseFormData.description || ""} 
                    onChange={(value) => handleChange(value, "description")} // Pass value and field name
                    required
                    style={{ height: '300px' }} 
                />
                </Form.Group>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12} >
            <AddressInput groupData={enterpriseFormData} setGroupData={setEnterpriseFormData} resetKey={resetKey}></AddressInput>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
          <MapWidgetFormGroup
            onLocationSelect={handleLocationSelect}
             name={enterpriseFormData.name || ""}
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
                    value={enterpriseFormData.link}
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
                    value={enterpriseFormData.address.lat}
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
                    value={enterpriseFormData.address.long}
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
              value={enterpriseFormData.geo}
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
              value={enterpriseFormData.accessibility}
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
                    storyForm={enterpriseFormData}
                    setStoryForm={setEnterpriseFormData}
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
                  dataForm={enterpriseFormData}
                  setDataForm={setEnterpriseFormData}
                  caption="Drag & drop images or click to select (Max: 10)"
                  dropzoneName="dropzone-container-small"
                  previewName="dropzone-uploaded-image-small"
                />
            </Form.Group>
            </Col>
        </Row>
        
        <Row className="mt-4">
          <Col md={6}>
            <Form.Group controlId="accreditation" className="mb-3">
              <Form.Label className="label">DOT Accreditation No.</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter accreditation (Optional)"
                name="accreditation"
                value={enterpriseFormData.accreditation}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="ratings" className="mb-3">
              <Form.Label className="label">DOT Rating</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ratings (Optional)"
                name="ratings"
                value={enterpriseFormData.ratings}
                onChange={handleChange}
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
                  value={enterpriseFormData.website}
                  onChange={handleChange}
                />
              </Form.Group>
          </Col>
          <Col md={6}>
            <TextGroupInputField
              onChange={(value) => handleChange(value, "socials")}
              label={"Social Media Links (Type & Enter)"}
              editingItems={enterpriseFormData.socials}
              resetKey={resetKey} 
            />
          </Col>

        </Row>
        
        
        
        
        
        
        <Row className="mt-2">
          <Col md={6}>
            <TextGroupInputField
              onChange={(value) => handleChange(value, "operatinghours")}
              label={"Operating Hours (Type & Enter)"}
              editingItems={enterpriseFormData.operatinghours}
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
              value={enterpriseFormData.lowest}
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
              onChange={(value) => handleChange(value, "inclusivity")}
              options={inclusivityOptions}
              resetKey={resetKey} // Pass reset trigger
              editingItems={enterpriseFormData.inclusivity}

              label="Inclusivity (Search, Select & Enter)"
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <SelectionFieldWidget
              onChange={(value) => handleChange(value, "facilities")}
              label="Facilities (Search, Select & Enter)"
              resetKey={resetKey} // Pass reset trigger
              editingItems={enterpriseFormData.facilities}
              options={facilitiesOptions}
              required
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
              <TextGroupInputField
                  onChange={(value) => handleChange(value, "activities")}
                  editingItems={enterpriseFormData.activities}
                  resetKey={resetKey} 
                  label={"Activities to do (Search, Select & Enter)"}
                />
          </Col>
        </Row>

        <Row className="mt-2">
          <Col md={12}>
          <TextGroupInputField
              label="Organizational Memberships (Type & Enter)"
              onChange={(value) => handleChange(value, "memberships")}
              editingItems={enterpriseFormData.memberships}
              resetKey={resetKey} 
            />

          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <TextGroupInputField
              onChange={(value) => handleChange(value, "awards")}
              editingItems={enterpriseFormData.awards}
              resetKey={resetKey} 
              label={"Awards, Recognitions, Seals and Certifications (Type & Enter)"}
            />
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
                    value={enterpriseFormData.note || ""} 
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
                                  Submit {subcategoryDisplay}
                              </Button>
                          </Container>
        </Row>

        <Container className="empty-container"></Container>

      </Form>
      

  );
}
