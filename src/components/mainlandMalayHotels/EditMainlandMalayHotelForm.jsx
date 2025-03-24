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
import GoogleMapComponent from "../map/MapLocation";
import { deleteImageFromFirebase } from "../../config/firestorage";


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
import MainlandMalayHotelsFormData from "../../datamodel/mainlandMalayHotels_model";
import { setDataInElement } from "ckeditor5";

export default function EditMainlandMalayHotelsForm({editingItem, toAddForm}) {
  const [resetKey, setResetKey] = useState(0); // Reset trigger
  const [mainlandMalayHotelsFormData, setMainlandMalayHotelsFormData] = useState(new MainlandMalayHotelsFormData());

    // Local state for selections
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedClassification, setSelectedClassification] = useState("");

    // Handle category change and reset subcategory.
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setMainlandMalayHotelsFormData((prev) => ({
      ...prev,
      category: value,
      subcategory: "",
    }));
  };


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
    if (editingItem) {
      // Update mainlandMalayHotels with properties from editingItem
      setMainlandMalayHotelsFormData(prevState => ({
        ...prevState,
        id: editingItem.id || "",
        name: editingItem.name || "",
        category: editingItem.category || "", // Default category if not provided
        subcategory: editingItem.subcategory || "",
        classification: editingItem.classification || "",
        accreditation: editingItem.accreditation || "",
        ratings: editingItem.ratings || "",
        established: editingItem.established || "",
        lowest: editingItem.lowest || "",
        slogan: editingItem.slogan || "",
        description: editingItem.description || "",
        facilities: editingItem.facilities || [],
        amenities: editingItem.amenities || [],
        awards: editingItem.awards || [],
        images: editingItem.images || [],
        roomtypes: editingItem.roomtypes || [],
        operatinghours: editingItem.operatinghours || [],
        inclusivity: editingItem.inclusivity || [],
        accessibility: editingItem.accessibility || "",
        logo: editingItem.logo || "",
        headerImage: editingItem.headerImage || "",
        website: editingItem.website || "",
        address: {
          street: editingItem.address.street || "",
          barangay: editingItem.address.barangay || "",
          town: editingItem.address.town || "",
          region: editingItem.address.region || "",
          province: editingItem.address.province || "",
          country: editingItem.address.country || "",
          lat: editingItem.address.lat || "",
          long: editingItem.address.long || "",
        },
        link: editingItem.link || "",
        geo: editingItem.geo || "",
        socials: editingItem.socials || [],
        memberships: editingItem.memberships || [],
        note: editingItem.note || "",
      }));
  
      // Update selected category if editingItem has a category
      if (editingItem.category) {
        setSelectedCategory(editingItem.category || "");
        setSelectedSubcategory(editingItem.subcategory || "");
        setSelectedClassification(editingItem.classification || "");
      } else {
        setSelectedCategory("Hospitality & Lodging");
        setSelectedSubcategory("Mainland Malay Hotels");
      }
    }
  }, [editingItem]); // Dependency array includes editingItem
  
  






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
        text: "Please wait while we submit your mainlandMalayHotels data.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    
      try {
        // Initialize URLs
        let logoURL = mainlandMalayHotelsFormData.logo;
        let headerImageURL = mainlandMalayHotelsFormData.headerImage;

        // Handle header image replacement
        if (mainlandMalayHotelsFormData.headerImage instanceof File) {
          // If a new header image is provided, delete the old one (if it exists)
          if (editingItem && editingItem.headerImage) {
            await deleteImageFromFirebase(editingItem.headerImage);
          }
          headerImageURL = await uploadImageToFirebase(
            mainlandMalayHotelsFormData.headerImage,
            `mainlandMalayHotels/${Date.now()}_${mainlandMalayHotelsFormData.headerImage.name}`
          );
        }
    
        // Handle logo replacement
        if (mainlandMalayHotelsFormData.logo instanceof File) {
          // If a new logo is provided, delete the old one (if it exists)
          if (editingItem && editingItem.logo) {
            await deleteImageFromFirebase(editingItem.logo);
          }
          logoURL = await uploadImageToFirebase(
            mainlandMalayHotelsFormData.logo,
            `mainlandMalayHotels/${Date.now()}_${mainlandMalayHotelsFormData.logo.name}`
          );
        }
    
        // Handle images replacement
        const imagesURLs = await Promise.all(
          mainlandMalayHotelsFormData.images.map(async (image, index) => {
            if (image instanceof File) {
              // If a new image is provided, delete the old one (if it exists)
              if (editingItem && editingItem.images && editingItem.images[index]) {
                await deleteImageFromFirebase(editingItem.images[index]);
              }
              return await uploadImageToFirebase(
                image,
                `mainlandMalayHotels/${Date.now()}_${image.name}`
              );
            }
            return image; // If the image is not a File, keep the existing URL
          })
        );
    
        // Create an instance of mainlandMalayHotels and populate it
        // Prepare mainlandMalayHotels data
        const updatemainlandMalayHotelsData = {
          id: editingItem ? editingItem.id : "", // Use existing ID for updates
          name: mainlandMalayHotelsFormData.name,
          category: mainlandMalayHotelsFormData.category || selectedCategory,
          subcategory: mainlandMalayHotelsFormData.subcategory || selectedSubcategory,
          classification: mainlandMalayHotelsFormData.classification || selectedClassification,
          accreditation: mainlandMalayHotelsFormData.accreditation,
          ratings: mainlandMalayHotelsFormData.ratings,
          established: mainlandMalayHotelsFormData.established,
          lowest: mainlandMalayHotelsFormData.lowest,
          slogan: mainlandMalayHotelsFormData.slogan,
          description: mainlandMalayHotelsFormData.description,
          facilities: mainlandMalayHotelsFormData.facilities || [],
          amenities: mainlandMalayHotelsFormData.amenities || [],
          awards: mainlandMalayHotelsFormData.awards || [],
          images: imagesURLs,
          roomtypes: mainlandMalayHotelsFormData.roomtypes || [],
          operatinghours: mainlandMalayHotelsFormData.operatinghours || [],
          inclusivity: mainlandMalayHotelsFormData.inclusivity || [],
          accessibility: mainlandMalayHotelsFormData.accessibility || [],
          logo: logoURL,
          headerImage: headerImageURL,
          website: mainlandMalayHotelsFormData.website,
          address: { ...mainlandMalayHotelsFormData.address },
          link: mainlandMalayHotelsFormData.link,
          geo: mainlandMalayHotelsFormData.geo,
          socials: mainlandMalayHotelsFormData.socials || [],
          memberships: mainlandMalayHotelsFormData.memberships || [],
          note: mainlandMalayHotelsFormData.note,
        };


          // Update the existing document using the mainlandMalayHotels's id
          const mainlandMalayHotelsDocRef = doc(db, "mainlandMalayHotels", mainlandMalayHotelsFormData.id);

          try {
            await updateDoc(mainlandMalayHotelsDocRef, updatemainlandMalayHotelsData);
            Swal.fire({
              title: "mainlandMalayHotels Updated",
              text: "Your mainlandMalayHotels has been updated successfully!",
              icon: "success",
            });
            // Reset form data after successful submission
            resetForm();
            resetHeaderImage();
            toAddForm();
          } catch (error) {
            console.error("Error updating mainlandMalayHotels:", error);
            Swal.fire({
              title: "Update Failed",
              text: "There was an error updating the mainlandMalayHotels.",
              icon: "error",
            });
          }
          

    
        

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

   // Initialize the isEditing state to false
   const [isEditingAddress, setIsEditingAddress] = useState(false);

   // Function to handle the Edit button click
   const handleEditAddressClick = () => {
     setIsEditingAddress(!isEditingAddress); // Toggle the isEditing state
   };

   // Initialize the isEditing state to false
   const [isEditingMap, setIsEditingMap] = useState(false);

   // Function to handle the Edit button click
   const handleEditMapClick = () => {
    setIsEditingMap(!isEditingMap); // Toggle the isEditing state
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
                placeholder="Enter accreditation (Optional)"
                name="accreditation"
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
            
      
            {selectedSubcategory && classificationOptions[selectedSubcategory] && (
            <Form.Group controlId="formClassification" className="mb-3">
            <Form.Label className="label">Classification</Form.Label>
            <Form.Select
              value={mainlandMalayHotelsFormData.classification || ""}
              onChange={(e) => {
                const newClassification = e.target.value;
                setSelectedClassification(newClassification);

                // Update mainlandMalayHotels
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
            <Form.Group controlId="name" className="mb-3">
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

           
              {isEditingAddress ? (
                <AddressInput groupData={mainlandMalayHotelsFormData} setGroupData={setMainlandMalayHotelsFormData} resetKey={resetKey}></AddressInput>
              ) : (
                <Form.Group className="mt-3 mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <Form.Label className="label mb-2">Local Business Address</Form.Label>
                  <Button variant="outline-danger" className="mb-2" onClick={handleEditAddressClick}>
                    {isEditingAddress ? 'Cancel' : 'Edit Address'}
                  </Button>
                </div>
                <>
                  <Form.Control
                    className="mb-3"
                    type="text"
                    name="address.country"
                    placeholder="Country"
                    value={mainlandMalayHotelsFormData.address.country}
                    readOnly
                  />
                  <Form.Control
                    className="my-3"
                    type="text"
                    name="address.region"
                    placeholder="Region"
                    value={mainlandMalayHotelsFormData.address.region}
                    readOnly
                  />
                  <Form.Control
                    className="my-3"
                    type="text"
                    name="address.province"
                    placeholder="Province"
                    value={mainlandMalayHotelsFormData.address.province}
                    readOnly
                  />
                  <Form.Control
                    className="my-3"
                    type="text"
                    name="address.city"
                    placeholder="City/Municipality/Town"
                    value={mainlandMalayHotelsFormData.address.town}
                    readOnly
                  />
                  <Form.Control
                    className="my-3"
                    type="text"
                    name="address.barangay"
                    placeholder="Barangay"
                    value={mainlandMalayHotelsFormData.address.barangay}
                    readOnly
                  />
                  <Form.Control
                    className="my-3"
                    type="text"
                    name="address.street"
                    placeholder="Street Name / Zone (Optional)"
                    value={mainlandMalayHotelsFormData.address.street}
                    readOnly
                  />
                </>
                </Form.Group>
              )}
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
              {isEditingMap ? (
                  <MapWidgetFormGroup
                  onLocationSelect={handleLocationSelect}
                  name={mainlandMalayHotelsFormData.name || ""}
                  resetKey={resetKey}
                  editingItems={mainlandMalayHotelsFormData.address}
                />
              ) : (
                <Form.Group className="mt-3 mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <Form.Label className="label mb-2">Local Business Address</Form.Label>
                  <Button variant="outline-danger" className="mb-2" onClick={handleEditMapClick}>
                    {isEditingMap ? 'Cancel' : 'Edit Map Location'}
                  </Button>
                </div>
                <GoogleMapComponent latitude={mainlandMalayHotelsFormData.address.lat} longitude={mainlandMalayHotelsFormData.address.long} />
                </Form.Group>
              )}
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
        <Row className="mt-2 ">
            <Col  md={12}>
            <Form.Group controlId="name" >
              <Form.Label className="label">Promotional & Marketing Photos</Form.Label>
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
              //   mainlandMalayHotels((prev) => ({ ...prev, socials: updatedField.socials }))
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
              //   mainlandMalayHotels((prev) => ({ ...prev, operatinghours: updatedField.operatinghours }))
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
              //   mainlandMalayHotels((prev) => ({ ...prev, roomtypes: updatedField.roomtypes }))
              // }
              onChange={(value) => handleChange(value, "roomtypes")}
              options={roomTypeOptions}
              resetKey={resetKey} // Pass reset trigger
              label="Room Types (Search, Select & Enter)"
              editingItems={mainlandMalayHotelsFormData.roomtypes}
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <SelectionFieldWidget
              // onChange={(updatedField) =>
              //   mainlandMalayHotels((prev) => ({ ...prev, inclusivity: updatedField.inclusivity }))
              // }
              onChange={(value) => handleChange(value, "inclusivity")}
              options={inclusivityOptions}
              resetKey={resetKey} // Pass reset trigger
              label="Inclusivity (Search, Select & Enter)"
              editingItems={mainlandMalayHotelsFormData.inclusivity}

            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <SelectionFieldWidget
              // onChange={(updatedField) =>
              //   mainlandMalayHotels((prev) => ({ ...prev, facilities: updatedField.facilities }))
              // }
              onChange={(value) => handleChange(value, "facilities")}

              label="Facilities (Search, Select & Enter)"
              resetKey={resetKey} // Pass reset trigger
              options={facilitiesOptions}
              editingItems={mainlandMalayHotelsFormData.facilities}
              required
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
            <SelectionFieldWidget
              // onChange={(updatedField) =>
              //   mainlandMalayHotels((prev) => ({ ...prev, amenities: updatedField.amenities }))
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
              //   mainlandMalayHotels((prev) => ({ ...prev, memberships: updatedField.memberships }))
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
              //   mainlandMalayHotels((prev) => ({ ...prev, awards: updatedField.awards }))
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
          <Container className="d-flex justify-content-end">
                              {/* <Button variant="outline-danger" className="ms-3" onClick={resetForm}>Reset Form</Button> */}
                              <Button 
                                  variant="outline-primary" 
                                  type="submit" 
                                  className="w-full me-3" 
                                  onClick={handleSubmit}
                              >
                                  Submit Update
                              </Button>
                          </Container>
        </Row>

        <Container className="empty-container"></Container>

      </Form>
      

  );
}
