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

import MainlandMalayHotelsFormData from "../../datamodel/mainlandMalayHotels_model";

import {
  inclusivityOptions,
  roomTypeOptions,
  facilitiesOptions,
  amenitiesOptions,
  geoOptions,
  accessibilityOptions,
  categoryOptions,
  subcategoriesOptions,
  classificationOptions,
} from '../../datamodel/accommodation_model';
import { setDataInElement } from "ckeditor5";

export default function MainlandMalayHotelsForm({}) {
  const [resetKey, setResetKey] = useState(0); // Reset trigger
  const [mainlandMalayHotelsFormData, setMainlandMalayHotelsFormData] = useState(new MainlandMalayHotelsFormData());

    // Local state for selections
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedClassification, setSelectedClassification] = useState("");

  // Generic change handler for form fields.
  const handleChange = (e, field) => {
    if (Array.isArray(e)) {
        // If `e` is an array, it's coming from TextGroupInputField
        setMainlandMalayHotelsFormData((prev) => ({
            ...prev,
            [field]: e, // Directly set the array value
        }));
    } else if (typeof e === "string") {
        // If `e` is a string, it's from ReactQuill (rich text editor)
        setMainlandMalayHotelsFormData((prev) => ({
            ...prev,
            [field]: e,
        }));
    } else {
        // Standard form fields
        const { name, value } = e.target;
        setMainlandMalayHotelsFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
  };


  // Handle category change and reset subcategory.
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setMainlandMalayHotelsFormData((prev) => ({
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
  
    setMainlandMalayHotelsFormData((prev) => ({
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
    if (!mainlandMalayHotelsFormData.accreditation) {
      setMainlandMalayHotelsFormData((prevData) => ({
        ...prevData,
        category: "Hospitality & Lodging",
        subcategory: "Mainland Malay Hotels",
      }));
      setSelectedCategory("Hospitality & Lodging");
      setSelectedSubcategory("Mainland Malay Hotels")
    }
  }, [setMainlandMalayHotelsFormData, mainlandMalayHotelsFormData.category, mainlandMalayHotelsFormData.subcategory]);
  

  

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
            text: "Please wait while we submit your mainland Malay Hotel data.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    
        try {
            // Upload header image if available
            let headerImageURL = mainlandMalayHotelsFormData.headerImage
                ? await uploadImageToFirebase(mainlandMalayHotelsFormData.headerImage, `mainlandMalayHotels/${Date.now()}_${mainlandMalayHotelsFormData.headerImage.name}`)
                : null;
    
            // Upload logo if available
            let logoURL = mainlandMalayHotelsFormData.logo
                ? await uploadImageToFirebase(mainlandMalayHotelsFormData.logo, `mainlandMalayHotels/${Date.now()}_${mainlandMalayHotelsFormData.logo.name}`)
                : null;
    
            // Upload images if available
            const imagesURLs = await Promise.all(
              mainlandMalayHotelsFormData.images.map(async (image) => {
                    return image ? await uploadImageToFirebase(image, `mainlandMalayHotels/${Date.now()}_${image.name}`) : "";
                })
            );
    
            // Create an instance of MainlandMalayHotelsFormData and populate it
            const mainlandMalayHotelsData = new MainlandMalayHotelsFormData();
            mainlandMalayHotelsData.id = ""; // Firestore will generate this
            mainlandMalayHotelsData.name = mainlandMalayHotelsFormData.name;
            mainlandMalayHotelsData.category = mainlandMalayHotelsFormData.category || selectedCategory;
            mainlandMalayHotelsData.subcategory = mainlandMalayHotelsFormData.subcategory || selectedSubcategory;
            mainlandMalayHotelsData.classification = mainlandMalayHotelsFormData.classification || selectedClassification;
            mainlandMalayHotelsData.accreditation = mainlandMalayHotelsFormData.accreditation;
            mainlandMalayHotelsData.ratings = mainlandMalayHotelsFormData.ratings;
            mainlandMalayHotelsData.established = mainlandMalayHotelsFormData.established;
            mainlandMalayHotelsData.lowest = mainlandMalayHotelsFormData.lowest;
            mainlandMalayHotelsData.slogan = mainlandMalayHotelsFormData.slogan;
            mainlandMalayHotelsData.description = mainlandMalayHotelsFormData.description;
            mainlandMalayHotelsData.facilities = mainlandMalayHotelsFormData.facilities || [];
            mainlandMalayHotelsData.amenities = mainlandMalayHotelsFormData.amenities || [];
            mainlandMalayHotelsData.awards = mainlandMalayHotelsFormData.awards || [];
            mainlandMalayHotelsData.images = imagesURLs;
            mainlandMalayHotelsData.roomtypes = mainlandMalayHotelsFormData.roomtypes || [];
            mainlandMalayHotelsData.operatinghours = mainlandMalayHotelsFormData.operatinghours || [];
            mainlandMalayHotelsData.inclusivity = mainlandMalayHotelsFormData.inclusivity || [];
            mainlandMalayHotelsData.accessibility = mainlandMalayHotelsFormData.accessibility || [];
            mainlandMalayHotelsData.logo = logoURL;
            mainlandMalayHotelsData.headerImage = headerImageURL;
            mainlandMalayHotelsData.website = mainlandMalayHotelsFormData.website;
            mainlandMalayHotelsData.address = { ...mainlandMalayHotelsFormData.address };
            mainlandMalayHotelsData.link = mainlandMalayHotelsFormData.link;
            mainlandMalayHotelsData.geo = mainlandMalayHotelsFormData.geo;
            mainlandMalayHotelsData.socials = mainlandMalayHotelsFormData.socials || [];;
            mainlandMalayHotelsData.memberships = mainlandMalayHotelsFormData.memberships || [];
            mainlandMalayHotelsData.note = mainlandMalayHotelsFormData.note;
    
            // Save mainlandMalayHotels data to Firestore
            const docRef = await addDoc(collection(db, "mainlandMalayHotels"), mainlandMalayHotelsData.toJSON());
            const mainlandMalayHotelsDoc = doc(db, "mainlandMalayHotels", docRef.id);
            await updateDoc(mainlandMalayHotelsDoc, { id: docRef.id });
    
            Swal.fire({
                title: "mainlandMalayHotels Submitted",
                text: "Your mainlandMalayHotels has been submitted successfully!",
                icon: "success",
            });
    
            // Reset form data after successful submission
            resetForm();
            resetHeaderImage();
        } catch (error) {
            console.error("Error submitting mainlandMalayHotels:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your mainlandMalayHotels. Please try again.",
                icon: "error",
            });
        }
    };
      
  
  

  const resetLogo = () => {
    setMainlandMalayHotelsFormData((prev) => ({
        ...prev,
        logo: null,
    }));
  };

  const resetHeaderImage = () => {
    setMainlandMalayHotelsFormData((prev) => ({
        ...prev,
        headerImage: null,
    }));
  };

  const resetForm = () => {
    setMainlandMalayHotelsFormData({
      id : "",
      name : "",
      category : "",
      subcategory : "",
      classification : "",
      accreditation : "",
      ratings : "",
      established : "",
      lowest : "",
      slogan : "",
      description : "",
      facilities : [],
      amenities : [],
      awards : [],
      images : [],
      roomtypes : [],
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

  const removeBodyImage = (index) => {
    setMainlandMalayHotelsFormData((prev) => {
    const newBody = [...prev.body];
    if (!newBody[index]) return prev;
    newBody[index] = { ...newBody[index], image: null };
    return { ...prev, body: newBody };
    });
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
                value={mainlandMalayHotelsFormData.category || "Hospitality & Lodging"}
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
                value={mainlandMalayHotelsFormData.subcategory || "Mainland Malay Hotels"}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            {/* {selectedCategory && subcategoriesOptions[selectedCategory] && (
                    <Form.Group controlId="formSubcategory" className="mb-3">
                    <Form.Label className="label">Subcategory</Form.Label>
                    <Form.Select
                      value={MainlandMalayHotelsFormData.subcategory || ""}
                      onChange={(e) => {
                        const newSubcategory = e.target.value;
                        setSelectedSubcategory(newSubcategory);
                        setSelectedClassification(""); // Reset classification when subcategory changes

                        // Update MainlandMalayHotelsFormData
                        setMainlandMalayHotelsFormData((prev) => ({
                          ...prev,
                          subcategory: newSubcategory,
                          classification: "", // Reset classification in form data
                        }));
                      }}
                    >
                      <option value="">Select Subcategory</option>
                      {subcategoriesOptions[selectedCategory]?.map((subcat, index) => (
                        <option key={index} value={subcat}>{subcat}</option>
                      ))}
                    </Form.Select>

                    </Form.Group>
                )} */}
            {selectedSubcategory && classificationOptions[selectedSubcategory] && (
            <Form.Group controlId="formClassification" className="mb-3">
            <Form.Label className="label">Classification</Form.Label>
            <Form.Select
              value={mainlandMalayHotelsFormData.classification || ""}
              onChange={(e) => {
                const newClassification = e.target.value;
                setSelectedClassification(newClassification);

                // Update MainlandMalayHotelsFormData
                setMainlandMalayHotelsFormData((prev) => ({
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
            <Form.Group controlId="logo" className="mb-3">
              <Form.Label className="label">Business Logo</Form.Label>
                    <LogoImageDropzone
                    storyForm={mainlandMalayHotelsFormData}
                    setStoryForm={setMainlandMalayHotelsFormData}
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
                  value={mainlandMalayHotelsFormData.name}
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
                value={mainlandMalayHotelsFormData.slogan}
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
                    value={mainlandMalayHotelsFormData.established}
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
                    value={mainlandMalayHotelsFormData.description || ""} 
                    onChange={(value) => handleChange(value, "description")} // Pass value and field name
                    required
                    style={{ height: '300px' }} 
                />
                </Form.Group>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12} >
            <AddressInput groupData={mainlandMalayHotelsFormData} setGroupData={setMainlandMalayHotelsFormData} resetKey={resetKey}></AddressInput>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
          <MapWidgetFormGroup
            onLocationSelect={handleLocationSelect}
             name={mainlandMalayHotelsFormData.name || ""}
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
                    value={mainlandMalayHotelsFormData.link}
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
                    value={mainlandMalayHotelsFormData.address.lat}
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
                    value={mainlandMalayHotelsFormData.address.long}
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
              value={mainlandMalayHotelsFormData.geo}
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
              value={mainlandMalayHotelsFormData.accessibility}
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
                    storyForm={mainlandMalayHotelsFormData}
                    setStoryForm={setMainlandMalayHotelsFormData}
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
                  dataForm={mainlandMalayHotelsFormData}
                  setDataForm={setMainlandMalayHotelsFormData}
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
                value={mainlandMalayHotelsFormData.accreditation}
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
                value={mainlandMalayHotelsFormData.ratings}
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
                  value={mainlandMalayHotelsFormData.website}
                  onChange={handleChange}
                />
              </Form.Group>
          </Col>
          <Col md={6}>
            <TextGroupInputField
              // onChange={(updatedField) =>
              //   setMainlandMalayHotelsFormData((prev) => ({ ...prev, socials: updatedField.socials }))
              // }
              onChange={(value) => handleChange(value, "socials")}
              label={"Social Media Links (Type & Enter)"}
              editingItems={mainlandMalayHotelsFormData.socials}
              resetKey={resetKey} 
            />
          </Col>

        </Row>
        
        
        
        
        
        
        <Row className="mt-2">
          <Col md={6}>
            <TextGroupInputField
              // onChange={(updatedField) =>
              //   setMainlandMalayHotelsFormData((prev) => ({ ...prev, operatinghours: updatedField.operatinghours }))
              // }
              onChange={(value) => handleChange(value, "operatinghours")}
              label={"Operating Hours (Type & Enter)"}
              editingItems={mainlandMalayHotelsFormData.operatinghours}
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
              value={mainlandMalayHotelsFormData.lowest}
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
              // onChange={(updatedField) =>
              //   setMainlandMalayHotelsFormData((prev) => ({ ...prev, roomtypes: updatedField.roomtypes }))
              // }
              onChange={(value) => handleChange(value, "roomtypes")}
              options={roomTypeOptions}
              resetKey={resetKey} // Pass reset trigger
              editingItems={mainlandMalayHotelsFormData.roomtypes}

              label="Room Types (Search, Select & Enter)"
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <SelectionFieldWidget
              // onChange={(updatedField) =>
              //   setMainlandMalayHotelsFormData((prev) => ({ ...prev, inclusivity: updatedField.inclusivity }))
              // }
              onChange={(value) => handleChange(value, "inclusivity")}
              options={inclusivityOptions}
              resetKey={resetKey} // Pass reset trigger
              editingItems={mainlandMalayHotelsFormData.inclusivity}

              label="Inclusivity (Search, Select & Enter)"
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <SelectionFieldWidget
              // onChange={(updatedField) =>
              //   setMainlandMalayHotelsFormData((prev) => ({ ...prev, facilities: updatedField.facilities }))
              // }
              onChange={(value) => handleChange(value, "facilities")}

              label="Facilities (Search, Select & Enter)"
              resetKey={resetKey} // Pass reset trigger
              editingItems={mainlandMalayHotelsFormData.facilities}

              options={facilitiesOptions}
              required
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <SelectionFieldWidget
              // onChange={(updatedField) =>
              //   setMainlandMalayHotelsFormData((prev) => ({ ...prev, amenities: updatedField.amenities }))
              // }
              onChange={(value) => handleChange(value, "amenities")}
              label="Amenities (Search, Select & Enter)"
              resetKey={resetKey} // Pass reset trigger
              options={amenitiesOptions}
              editingItems={mainlandMalayHotelsFormData.amenities}

              required
            />
          </Col>
        </Row>

        <Row className="mt-2">
          <Col md={12}>
          <TextGroupInputField
              label="Organizational Memberships (Type & Enter)"
              // onChange={(updatedField) =>
              //   setMainlandMalayHotelsFormData((prev) => ({ ...prev, memberships: updatedField.memberships }))
              // }
              onChange={(value) => handleChange(value, "memberships")}
              editingItems={mainlandMalayHotelsFormData.memberships}
              resetKey={resetKey} 
            />

          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <TextGroupInputField
              // onChange={(updatedField) =>
              //   setMainlandMalayHotelsFormData((prev) => ({ ...prev, awards: updatedField.awards }))
              //   // Pass reset trigger
              // }
              onChange={(value) => handleChange(value, "awards")}

              editingItems={mainlandMalayHotelsFormData.awards}
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
                    value={mainlandMalayHotelsFormData.note || ""} 
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
                                  Submit Mainland Malay Hotel
                              </Button>
                          </Container>
        </Row>

        <Container className="empty-container"></Container>

      </Form>
      

  );
}
