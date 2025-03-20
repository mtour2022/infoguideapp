import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { db, storage } from "../../config/firebase";
import {  collection, addDoc, doc, updateDoc  } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import 'react-quill-new/dist/quill.snow.css';
import TextGroupInputField from "../TextGroupInputField";
import RichTextEditor from '../TextEditor'; // adjust the path as needed

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faCirclePlay, faCirclePlus, faCancel} from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from "react-dropzone"; // Dropzone for image upload
import ReactQuill from 'react-quill-new';
import HeaderImageDropzone from '../HeaderImageDropzone';
import MultiImageDropzone from "../MultiImageDropzone";


import SelectionFieldWidget from "../SelectionField";

import CruiseShipsFormData from "../../datamodel/cruiseShips_model"; 


export default function CruiseShipsForm({}) {
  const [resetKey, setResetKey] = useState(0); // Reset trigger
  const [cruiseShipsFormData, setCruiseShipsFormData] = useState(new CruiseShipsFormData());

  // Generic change handler for form fields.
  const handleChange = (e, field) => {
    if (Array.isArray(e)) {
        // If `e` is an array, it's coming from TextGroupInputField
        setCruiseShipsFormData((prev) => ({
            ...prev,
            [field]: e, // Directly set the array value
        }));
    } else if (typeof e === "string") {
        // If `e` is a string, it's from ReactQuill (rich text editor)
        setCruiseShipsFormData((prev) => ({
            ...prev,
            [field]: e,
        }));
    } else {
        // Standard form fields
        const { name, value } = e.target;
        setCruiseShipsFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
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
            text: "Please wait while we submit your cruise Ships.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Upload header image if available
            let headerImageURL = cruiseShipsFormData.headerImage
                ? await uploadImageToFirebase(cruiseShipsFormData.headerImage, `cruiseShips/${Date.now()}_${cruiseShipsFormData.headerImage.name}`)
                : null;
            
                    
            // Upload images if available
            const imagesURLs = await Promise.all(
              cruiseShipsFormData.images.map(async (image) => {
                    return image ? await uploadImageToFirebase(image, `cruiseShips/${Date.now()}_${image.name}`) : "";
                })
            );

            // Create an instance of cruiseShips and populate it
            const cruiseShipsData = new CruiseShipsFormData();
            cruiseShipsData.id = ""; // Firestore will generate this
            cruiseShipsData.title = cruiseShipsFormData.title;
            cruiseShipsData.dateStart = cruiseShipsFormData.dateStart;
            cruiseShipsData.dateEnd = cruiseShipsFormData.dateEnd;
            cruiseShipsData.country = cruiseShipsFormData.country;
            cruiseShipsData.total = cruiseShipsFormData.total;
            cruiseShipsData.description = cruiseShipsFormData.description;
            cruiseShipsData.headerImage = headerImageURL;
            cruiseShipsData.images = imagesURLs;
            cruiseShipsData.references = cruiseShipsFormData.references || [];;
    
            // Save cruiseShips data to Firestore
            const docRef = await addDoc(collection(db, "cruiseShips"), cruiseShipsData.toJSON());
            const cruiseShipsDoc = doc(db, "cruiseShips", docRef.id);
            await updateDoc(cruiseShipsDoc, { id: docRef.id });
    
            Swal.fire({
                title: "Cruise Ship Submitted",
                text: "Your Cruise Ship has been submitted successfully!",
                icon: "success",
            });
            // Reset form data after successful submission
            resetForm();
        } catch (error) {
            console.error("Error submitting Cruise Ship  And Recognitions Links:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your Cruise Ship  Expos Links. Please try again.",
                icon: "error",
            });
        }
    };

    
  const resetForm = () => {
    setCruiseShipsFormData({
      id : "",
      title : "",
      country : "",
      dateStart: "",
      dateEnd: "",
      total: "",
      description : "",
      headerImage : null,
      images: [],
      references : [],
    });
    setResetKey(prevKey => prevKey + 1); // Change key to trigger reset    setSelectedCategory("");

  };

  return (
    
      <Form className="custom-form body-container" onSubmit={handleSubmit}  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
        
        <Row >
          <Col  md={12}>
            <Form.Group controlId="headerImage" className="mb-3">
                <Form.Label className="label">Cover Photo</Form.Label>
                <HeaderImageDropzone
                      storyForm={cruiseShipsFormData}
                      setStoryForm={setCruiseShipsFormData}
                      dropzoneName="dropzone-container-big"
                      previewName="dropzone-uploaded-image-big"
                      />
              </Form.Group>
            </Col>
            
        </Row>
        <Row className="mt-2" > 
          <Col md={6}>
          <Form.Group controlId="country" className="mb-3">
                <Form.Label className="label">Country Origin</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter country"
                  name="country"
                  value={cruiseShipsFormData.country}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
          </Col>
          <Col md={6}>
  <Form.Group controlId="total" className="mb-3">
    <Form.Label className="label">Total Guest Visited</Form.Label>
    <Form.Control
      type="text"
      placeholder="Enter Total Visitor"
      name="total"
      value={cruiseShipsFormData.total}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Allows only whole numbers (no periods)
          handleChange(e);
        }
      }}
    />
  </Form.Group>
</Col>

        </Row>
        <Row>
    <Col md={6}>
        <Form.Group className="mb-3">
            <Form.Label className="label">Start Date</Form.Label>
            <Form.Control
                type="date"
                name="dateStart"
                value={cruiseShipsFormData.dateStart}
                onChange={handleChange}
                required
            />
        </Form.Group>
    </Col>
    <Col md={6}>
        <Form.Group className="mb-3">
            <Form.Label className="label">End Date</Form.Label>
            <Form.Control
                type="date"
                name="dateEnd"
                value={cruiseShipsFormData.dateEnd}
                onChange={handleChange}
                min={cruiseShipsFormData.dateStart} // Prevents selecting an earlier date
                disabled={!cruiseShipsFormData.dateStart} // Disable if Start Date is empty
                required
            />
        </Form.Group>
    </Col>
</Row>

        <Row className="mt-2" > 
          <Col md={12}>
            <Form.Group controlId="title" className="mb-3">
                <Form.Label className="label">Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter business name"
                  name="title"
                  value={cruiseShipsFormData.title}
                  onChange={handleChange}
                  required
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
                           value={cruiseShipsFormData.description || ""} 
                           onChange={(value) => handleChange(value, "description")} // Pass value and field name
                           required
                           style={{ height: '300px' }} 
                       />
                       </Form.Group>
                 </Col>
        </Row>
        <Row className="mt-2">
            <Col  md={12}>
            <Form.Group controlId="name" >
              <Form.Label className="label me-2">Promotional & Marketing Photos</Form.Label>
              <MultiImageDropzone
                  dataForm={cruiseShipsFormData}
                  setDataForm={setCruiseShipsFormData}
                  caption="Drag & drop images or click to select (Max: 10)"
                  dropzoneName="dropzone-container-small"
                  previewName="dropzone-uploaded-image-small"
                />
            </Form.Group>
            </Col>
        </Row>
        <Container className="empty-container"></Container>
        <hr></hr>
        <Container className="empty-container"></Container>
        <Row className="mt-2" > 
          <Col md={12}>
            <TextGroupInputField
                onChange={(value) => handleChange(value, "references")}
                label={"References and Links (Type & Enter)"}
                editingItems={cruiseShipsFormData.references}
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
                                  Submit Cruise Ship 
                              </Button>
                          </Container>
        </Row>
        <Container className="empty-container"></Container>

      </Form>
      

  );
}
