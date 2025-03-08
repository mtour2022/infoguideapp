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

import OrdinancesFormData from "../../datamodel/ordinances_model"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faCirclePlay, faCirclePlus, faCancel} from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from "react-dropzone"; // Dropzone for image upload
import ReactQuill from 'react-quill-new';
import LogoImageDropzone from "../LogoImageDrop";


  


export default function OrdinancesForm({}) {
  const [resetKey, setResetKey] = useState(0); // Reset trigger
  const [ordinancesFormData, setOrdinancesFormData] = useState(new OrdinancesFormData());


  // Generic change handler for form fields.
  const handleChange = (e, field) => {
    if (Array.isArray(e)) {
        // If `e` is an array, it's coming from TextGroupInputField
        setOrdinancesFormData((prev) => ({
            ...prev,
            [field]: e, // Directly set the array value
        }));
    } else if (typeof e === "string") {
        // If `e` is a string, it's from ReactQuill (rich text editor)
        setOrdinancesFormData((prev) => ({
            ...prev,
            [field]: e,
        }));
    } else {
        // Standard form fields
        const { name, value } = e.target;
        setOrdinancesFormData((prev) => ({
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
            text: "Please wait while we submit your ordinances.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Upload logo if available
            let logoURL = ordinancesFormData.logo
                ? await uploadImageToFirebase(ordinancesFormData.logo, `ordinances/${Date.now()}_${ordinancesFormData.logo.name}`)
                : null;
            // Create an instance of ordinancesFormData and populate it
            const ordinanceData = new OrdinancesFormData();
            ordinanceData.id = ""; // Firestore will generate this
            ordinanceData.title = ordinancesFormData.title;
            ordinanceData.ordinance = ordinancesFormData.ordinance;
            ordinanceData.description = ordinancesFormData.description;
            ordinanceData.logo = logoURL;
            ordinanceData.references = ordinancesFormData.references || [];;
    
            // Save ordinancesFormData data to Firestore
            const docRef = await addDoc(collection(db, "ordinances"), ordinanceData.toJSON());
            const ordinanceDoc = doc(db, "ordinances", docRef.id);
            await updateDoc(ordinanceDoc, { id: docRef.id });
    
            Swal.fire({
                title: "Ordinance Submitted",
                text: "Your Ordinance has been submitted successfully!",
                icon: "success",
            });
            // Reset form data after successful submission
            resetForm();
        } catch (error) {
            console.error("Error submitting Ordinance:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your Ordinance. Please try again.",
                icon: "error",
            });
        }
    };

    
  const resetForm = () => {
    setOrdinancesFormData({
      id : "",
      title : "",
      ordinance : "",
      description : "",
      logo : null,
      references : [],
    });
    setResetKey(prevKey => prevKey + 1); // Change key to trigger reset
  };

  return (
    
      <Form className="custom-form body-container" onSubmit={handleSubmit}  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
        
        <Row >
          <Col  md={6}>
            <Form.Group controlId="logo" className="mb-3">
              <Form.Label className="label">Logo</Form.Label>
                    <LogoImageDropzone
                    storyForm={ordinancesFormData}
                    setStoryForm={setOrdinancesFormData}
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
                <Form.Label className="label">Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter business name"
                  name="title"
                  value={ordinancesFormData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
          </Col>
        </Row>
        <Row className="mt-2" > 
          <Col md={12}>
            <Form.Group controlId="ordinance" className="mb-3">
                <Form.Label className="label">Municipal Ordinances</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Municipal Ordinance No."
                  name="ordinance"
                  value={ordinancesFormData.ordinance}
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
                           value={ordinancesFormData.description || ""} 
                           onChange={(value) => handleChange(value, "description")} // Pass value and field name
                           required
                           style={{ height: '300px' }} 
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
                editingItems={ordinancesFormData.references}
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
                                  Submit Ordinance
                              </Button>
                          </Container>
        </Row>
        <Container className="empty-container"></Container>

      </Form>
      

  );
}
