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
  roomTypeOptions,
  facilitiesOptions,
  amenitiesOptions,
  geoOptions,
  accessibilityOptions,
  categoryOptions,
  subcategoriesOptions,
  classificationOptions,
} from '../../datamodel/accommodation_model';
import RecreationalResortsFormData from "../../datamodel/recreationalresort_model"; 
import { setDataInElement } from "ckeditor5";

export default function AccommodationForm({}) {
  const [resetKey, setResetKey] = useState(0); // Reset trigger
  const [recreationalResortsFormData, setrecreationalResortsFormData] = useState(new RecreationalResortsFormData());

    // Local state for selections
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedClassification, setSelectedClassification] = useState("");

  // Generic change handler for form fields.
  const handleChange = (e, field) => {
    if (Array.isArray(e)) {
        // If `e` is an array, it's coming from TextGroupInputField
        setrecreationalResortsFormData((prev) => ({
            ...prev,
            [field]: e, // Directly set the array value
        }));
    } else if (typeof e === "string") {
        // If `e` is a string, it's from ReactQuill (rich text editor)
        setrecreationalResortsFormData((prev) => ({
            ...prev,
            [field]: e,
        }));
    } else {
        // Standard form fields
        const { name, value } = e.target;
        setrecreationalResortsFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
  };


  // Handle category change and reset subcategory.
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setrecreationalResortsFormData((prev) => ({
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
  
    setrecreationalResortsFormData((prev) => ({
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
    if (!recreationalResortsFormData.accreditation) {
      setrecreationalResortsFormData((prevData) => ({
        ...prevData,
        category: "Hospitality & Lodging",
      }));
      setSelectedCategory("Hospitality & Lodging");
    }
  }, [setrecreationalResortsFormData, recreationalResortsFormData.category]);
  

  

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
            text: "Please wait while we submit your accommodation data.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    
        try {
            // Upload header image if available
            let headerImageURL = recreationalResortsFormData.headerImage
                ? await uploadImageToFirebase(recreationalResortsFormData.headerImage, `accommodations/${Date.now()}_${recreationalResortsFormData.headerImage.name}`)
                : null;
    
            // Upload logo if available
            let logoURL = recreationalResortsFormData.logo
                ? await uploadImageToFirebase(recreationalResortsFormData.logo, `accommodations/${Date.now()}_${recreationalResortsFormData.logo.name}`)
                : null;
    
            // Upload images if available
            const imagesURLs = await Promise.all(
              recreationalResortsFormData.images.map(async (image) => {
                    return image ? await uploadImageToFirebase(image, `accommodations/${Date.now()}_${image.name}`) : "";
                })
            );
    
            // Create an instance of AccommodationFormData and populate it
            const accommodationData = new AccommodationFormData();
            accommodationData.id = ""; // Firestore will generate this
            accommodationData.name = recreationalResortsFormData.name;
            accommodationData.category = recreationalResortsFormData.category || selectedCategory;
            accommodationData.subcategory = recreationalResortsFormData.subcategory || selectedSubcategory;
            accommodationData.classification = recreationalResortsFormData.classification || selectedClassification;
            accommodationData.accreditation = recreationalResortsFormData.accreditation;
            accommodationData.ratings = recreationalResortsFormData.ratings;
            accommodationData.established = recreationalResortsFormData.established;
            accommodationData.lowest = recreationalResortsFormData.lowest;
            accommodationData.slogan = recreationalResortsFormData.slogan;
            accommodationData.description = recreationalResortsFormData.description;
            accommodationData.facilities = recreationalResortsFormData.facilities || [];
            accommodationData.amenities = recreationalResortsFormData.amenities || [];
            accommodationData.awards = recreationalResortsFormData.awards || [];
            accommodationData.images = imagesURLs;
            accommodationData.roomtypes = recreationalResortsFormData.roomtypes || [];
            accommodationData.operatinghours = recreationalResortsFormData.operatinghours || [];
            accommodationData.inclusivity = recreationalResortsFormData.inclusivity || [];
            accommodationData.accessibility = recreationalResortsFormData.accessibility || [];
            accommodationData.logo = logoURL;
            accommodationData.headerImage = headerImageURL;
            accommodationData.website = recreationalResortsFormData.website;
            accommodationData.address = { ...recreationalResortsFormData.address };
            accommodationData.link = recreationalResortsFormData.link;
            accommodationData.geo = recreationalResortsFormData.geo;
            accommodationData.socials = recreationalResortsFormData.socials || [];;
            accommodationData.memberships = recreationalResortsFormData.memberships || [];
            accommodationData.note = recreationalResortsFormData.not;
    
            // Save accommodation data to Firestore
            const docRef = await addDoc(collection(db, "accommodations"), accommodationData.toJSON());
            const accommodationDoc = doc(db, "accommodations", docRef.id);
            await updateDoc(accommodationDoc, { id: docRef.id });
    
            Swal.fire({
                title: "Accommodation Submitted",
                text: "Your accommodation has been submitted successfully!",
                icon: "success",
            });
    
            // Reset form data after successful submission
            resetForm();
            resetHeaderImage();
        } catch (error) {
            console.error("Error submitting accommodation:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your accommodation. Please try again.",
                icon: "error",
            });
        }
    };
      
  
  

  const resetLogo = () => {
    setrecreationalResortsFormData((prev) => ({
        ...prev,
        logo: null,
    }));
  };

  const resetHeaderImage = () => {
    setrecreationalResortsFormData((prev) => ({
        ...prev,
        headerImage: null,
    }));
  };

  const resetForm = () => {
    setrecreationalResortsFormData({
      id : "",
      name : "",
      category : "",
      subcategory : "",
      classification : "",
      accreditation : "",
      ratings : "",
      established : "",
      lowest : "",
      assets : [],
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


  return (
    
      <Form className="custom-form body-container" onSubmit={handleSubmit}  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
        <Row className="row mb-4">
            <Col md={6}>
            <Form.Group controlId="category" className="mb-3">
              <Form.Label className="label">Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter accreditation (Optional)"
                name="accreditation"
                value={recreationalResortsFormData.category || "Hospitality & Lodging"}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>

            </Col>
            <Col md={6}>
            {selectedCategory && subcategoriesOptions[selectedCategory] && (
                    <Form.Group controlId="formSubcategory" className="mb-3">
                    <Form.Label className="label">Subcategory</Form.Label>
                    <Form.Select
                      value={recreationalResortsFormData.subcategory || ""}
                      onChange={(e) => {
                        const newSubcategory = e.target.value;
                        setSelectedSubcategory(newSubcategory);
                        setSelectedClassification(""); // Reset classification when subcategory changes

                        // Update accommodationFormData
                        setrecreationalResortsFormData((prev) => ({
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
                )}
            {selectedSubcategory && classificationOptions[selectedSubcategory] && (
            <Form.Group controlId="formClassification" className="mb-3">
            <Form.Label className="label">Classification</Form.Label>
            <Form.Select
              value={recreationalResortsFormData.classification || ""}
              onChange={(e) => {
                const newClassification = e.target.value;
                setSelectedClassification(newClassification);

                // Update accommodationFormData
                setrecreationalResortsFormData((prev) => ({
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
                    storyForm={recreationalResortsFormData}
                    setStoryForm={setrecreationalResortsFormData}
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
                  value={recreationalResortsFormData.name}
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
                value={recreationalResortsFormData.slogan}
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
                    value={recreationalResortsFormData.established}
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
                    value={recreationalResortsFormData.description || ""} 
                    onChange={(value) => handleChange(value, "description")} // Pass value and field name
                    required
                    style={{ height: '300px' }} 
                />
                </Form.Group>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12} >
            <AddressInput groupData={recreationalResortsFormData} setGroupData={setrecreationalResortsFormData} resetKey={resetKey}></AddressInput>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
          <MapWidgetFormGroup
            onLocationSelect={handleLocationSelect}
             name={recreationalResortsFormData.name || ""}
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
                    value={recreationalResortsFormData.link}
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
                    value={recreationalResortsFormData.address.lat}
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
                    value={recreationalResortsFormData.address.long}
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
              value={recreationalResortsFormData.geo}
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
              value={recreationalResortsFormData.accessibility}
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
                    storyForm={recreationalResortsFormData}
                    setStoryForm={setrecreationalResortsFormData}
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
                  dataForm={recreationalResortsFormData}
                  setDataForm={setrecreationalResortsFormData}
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
                value={recreationalResortsFormData.accreditation}
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
                value={recreationalResortsFormData.ratings}
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
                  value={recreationalResortsFormData.website}
                  onChange={handleChange}
                />
              </Form.Group>
          </Col>
          <Col md={6}>
            <TextGroupInputField
              // onChange={(updatedField) =>
              //   setAccommodationFormData((prev) => ({ ...prev, socials: updatedField.socials }))
              // }
              onChange={(value) => handleChange(value, "socials")}
              label={"Social Media Links (Type & Enter)"}
              items={recreationalResortsFormData.socials}
              resetKey={resetKey} 
            />
          </Col>

        </Row>
        
        
        
        
        
        
        <Row className="mt-2">
          <Col md={6}>
            <TextGroupInputField
              // onChange={(updatedField) =>
              //   setAccommodationFormData((prev) => ({ ...prev, operatinghours: updatedField.operatinghours }))
              // }
              onChange={(value) => handleChange(value, "operatinghours")}
              label={"Operating Hours (Type & Enter)"}
              items={recreationalResortsFormData.operatinghours}
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
              value={recreationalResortsFormData.lowest}
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
              //   setAccommodationFormData((prev) => ({ ...prev, roomtypes: updatedField.roomtypes }))
              // }
              onChange={(value) => handleChange(value, "roomtypes")}
              options={roomTypeOptions}
              resetKey={resetKey} // Pass reset trigger
              
              label="Room Types (Search, Select & Enter)"
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <SelectionFieldWidget
              // onChange={(updatedField) =>
              //   setAccommodationFormData((prev) => ({ ...prev, inclusivity: updatedField.inclusivity }))
              // }
              onChange={(value) => handleChange(value, "inclusivity")}
              options={inclusivityOptions}
              resetKey={resetKey} // Pass reset trigger
              label="Inclusivity (Search, Select & Enter)"
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <SelectionFieldWidget
              // onChange={(updatedField) =>
              //   setAccommodationFormData((prev) => ({ ...prev, facilities: updatedField.facilities }))
              // }
              onChange={(value) => handleChange(value, "facilities")}

              label="Facilities (Search, Select & Enter)"
              resetKey={resetKey} // Pass reset trigger
              options={facilitiesOptions}
              required
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <SelectionFieldWidget
              // onChange={(updatedField) =>
              //   setAccommodationFormData((prev) => ({ ...prev, amenities: updatedField.amenities }))
              // }
              onChange={(value) => handleChange(value, "amenities")}
              label="Amenities (Search, Select & Enter)"
              resetKey={resetKey} // Pass reset trigger
              options={amenitiesOptions}
              required
            />
          </Col>
        </Row>

        <Row className="mt-2">
          <Col md={12}>
          <TextGroupInputField
              label="Organizational Memberships (Type & Enter)"
              // onChange={(updatedField) =>
              //   setAccommodationFormData((prev) => ({ ...prev, memberships: updatedField.memberships }))
              // }
              onChange={(value) => handleChange(value, "memberships")}

              items={recreationalResortsFormData.memberships}
              resetKey={resetKey} 
            />

          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <TextGroupInputField
              // onChange={(updatedField) =>
              //   setAccommodationFormData((prev) => ({ ...prev, awards: updatedField.awards }))
              //   // Pass reset trigger
              // }
              onChange={(value) => handleChange(value, "awards")}

              items={recreationalResortsFormData.awards}
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
                    value={recreationalResortsFormData.note || ""} 
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
                                  Submit Accommodation
                              </Button>
                          </Container>
        </Row>

        <Container className="empty-container"></Container>

      </Form>
      

  );
}
