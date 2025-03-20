import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { db, storage } from "../../config/firebase";
import {  collection, addDoc, doc, updateDoc  } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import 'react-quill-new/dist/quill.snow.css';
import AddressInput from '../Address';
import MapWidgetFormGroup from "../map/MapLocator"; // Adjust the import path as needed
import LogoImageDropzone from "../LogoImageDrop";
import TextGroupInputField from "../TextGroupInputField";
import { deleteImageFromFirebase } from "../../config/firestorage";



import {
  geoOptions,
} from '../../datamodel/accommodation_model';

import HotlineFormData from "../../datamodel/hotlines_model"; 
import {hotlinesCategoryOptions} from "../../datamodel/hotlines_model"; 

export default function EditHotlinesForm({editingItem, toAddForm}) {
  const [resetKey, setResetKey] = useState(0); // Reset trigger
  const [hotlinesFormData, setHotlinesFormData] = useState(new HotlineFormData());

    // Local state for selections
    const [selectedCategory, setSelectedCategory] = useState("");

  // Generic change handler for form fields.
  const handleChange = (e, field) => {
    if (Array.isArray(e)) {
        // If `e` is an array, it's coming from TextGroupInputField
        setHotlinesFormData((prev) => ({
            ...prev,
            [field]: e, // Directly set the array value
        }));
    } else if (typeof e === "string") {
        // If `e` is a string, it's from ReactQuill (rich text editor)
        setHotlinesFormData((prev) => ({
            ...prev,
            [field]: e,
        }));
    } else {
        // Standard form fields
        const { name, value } = e.target;
        setHotlinesFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
  };

  useEffect(() => {
        if (editingItem) {
          setActivityFormData(prevState => ({
            ...prevState,
            id: editingItem.id || "",
            name: editingItem.name || "",
            category: editingItem.category || "", // Default category if not provided
            mobile: editingItem.mobile || [],
            landline: editingItem.landline || [],
            satellite: editingItem.satellite || "",
            logo: editingItem.logo || "",
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
          }));
      
          // Update selected category if editingItem has a category
          if (editingItem.category) {
            setSelectedCategory(editingItem.category || "");
          } else {
            setSelectedCategory(category);
          }
        }
      }, [editingItem]); // Dependency array includes editingItem



  const handleLocationSelect = (position, link) => {
    if (!position) {
      console.warn("handleLocationSelect received null position.");
      return;
    }
  
    setHotlinesFormData((prev) => ({
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
           text: "Please wait while we submit your hotline data.",
           allowOutsideClick: false,
           didOpen: () => {
             Swal.showLoading();
           },
         });
       
         try {
           // Initialize URLs
           let logoURL = hotlinesFormData.logo;
       
         
       
           // Handle logo replacement
           if (hotlinesFormData.logo instanceof File) {
             // If a new logo is provided, delete the old one (if it exists)
             if (editingItem && editingItem.logo) {
               await deleteImageFromFirebase(editingItem.logo);
             }
             logoURL = await uploadImageToFirebase(
               hotlinesFormData.logo,
               `hotlines/${Date.now()}_${hotlinesFormData.logo.name}`
             );
           }

       
           // Create an instance of hotlinesFormData and populate it
           // Prepare accommodation data
           const updateHotlineData = {
             id: editingItem ? editingItem.id : "", // Use existing ID for updates
             name: hotlinesFormData.name,
             category: hotlinesFormData.category || selectedCategory,
             mobile: hotlinesFormData.mobile || [],
             landline: hotlinesFormData.landline || [],
             socials: hotlinesFormData.socials || [],
             logo: logoURL,
             address: { ...hotlinesFormData.address },
             link: hotlinesFormData.link,
             geo: hotlinesFormData.geo,
             socials: hotlinesFormData.socials || [],
           };
   
   
             // Update the existing document using the accommodation's id
             const hotliteDocRef = doc(db, "hotlines", hotlinesFormData.id);
   
             try {
               await updateDoc(hotliteDocRef, updateHotlineData);
               Swal.fire({
                 title: "Hotlines Updated",
                 text: "Your hotlines has been updated successfully!",
                 icon: "success",
               });
               resetForm();
                toAddForm();
             } catch (error) {
               console.error("Error updating hotlines:", error);
               Swal.fire({
                 title: "Update Failed",
                 text: "There was an error updating the hotlines.",
                 icon: "error",
               });
             }
             
   
       
           // Reset form data after successful submission
           
         } catch (error) {
           console.error("Error submitting hottline:", error);
           Swal.fire({
             title: "Error",
             text: "There was an issue submitting your hotline. Please try again.",
             icon: "error",
           });
         }
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


  const resetForm = () => {
    setHotlinesFormData({
      id : "",
      name : "",
      category : "",
      landline : [],
      mobile : [],
      satellite : [],
      logo : null,
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
    });
    setResetKey(prevKey => prevKey + 1); // Change key to trigger reset
    setSelectedCategory("");
  };


  return (
    
      <Form className="custom-form body-container" onSubmit={handleSubmit}  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
        <Row className="row mb-4">
            <Col md={6}>
            <Form.Group controlId="category" className="mb-3">
                            <Form.Label className="label">Category</Form.Label>
                            <Form.Select
                              name="category"
                              value={hotlinesFormData.category}
                              onChange={(e) => {
                                const newCategory = e.target.value;
                                setHotlinesFormData((prev) => ({
                                  ...prev,
                                  category: newCategory,
                                }));
                              }}
                            >
                              <option value="" disabled>Select Category</option>
                              {hotlinesCategoryOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                              ))}
                            </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Container></Container>
            </Col>
        </Row >
        <Container className="empty-container"></Container>
        <hr></hr>
        <Container className="empty-container"></Container>

        <Row >
          <Col  md={6}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label className="label">Office Logo</Form.Label>
                    <LogoImageDropzone
                    storyForm={hotlinesFormData}
                    setStoryForm={setHotlinesFormData}
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
                <Form.Label className="label">Office Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter business name"
                  name="name"
                  value={hotlinesFormData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
          </Col>

        </Row>

        <Row className="mt-2">
          <Col md={12} >
            <AddressInput groupData={hotlinesFormData} setGroupData={setHotlinesFormData} resetKey={resetKey}></AddressInput>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
          <MapWidgetFormGroup
            onLocationSelect={handleLocationSelect}
             name={hotlinesFormData.name || ""}
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
                    value={hotlinesFormData.link}
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
                    value={hotlinesFormData.address.lat}
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
                    value={hotlinesFormData.address.long}
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
              value={hotlinesFormData.geo}
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
          <Container></Container>
        </Col>
          
        </Row>
        <Container className="empty-container"></Container>
        <hr></hr>
        <Container className="empty-container"></Container>
        <Row className="mt-2" > 
          <Col md={6}>
            <TextGroupInputField
              onChange={(value) => handleChange(value, "mobile")}
              label={"mobile Number (Type & Enter)"}
              editingItems={hotlinesFormData.socials}
              resetKey={resetKey} 
            />
          </Col>
          <Col md={6}>
            <TextGroupInputField
              onChange={(value) => handleChange(value, "landline")}
              label={"Landline Number (Type & Enter)"}
              editingItems={hotlinesFormData.landline}
              resetKey={resetKey} 
            />
          </Col>
        </Row>
       
        <Row className="mt-2" > 
          <Col md={6}>
            <TextGroupInputField
                onChange={(value) => handleChange(value, "satellite")}
                label={"Satellite (Type & Enter)"}
                editingItems={hotlinesFormData.satellite}
                resetKey={resetKey} 
              />
          </Col>
          <Col md={6}>
            <TextGroupInputField
              onChange={(value) => handleChange(value, "socials")}
              label={"Social Media Links (Type & Enter)"}
              editingItems={hotlinesFormData.socials}
              resetKey={resetKey} 
            />
          </Col>
        </Row>
       

        <Container className="empty-container"></Container>
        <hr></hr>
        <Container className="empty-container"></Container>
       
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
                                  Submit Update
                              </Button>
                          </Container>
        </Row>

        <Container className="empty-container"></Container>

      </Form>
      

  );
}
