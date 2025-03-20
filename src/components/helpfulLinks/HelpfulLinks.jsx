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
import HelpfulLinksFormData from "../../datamodel/helfullinks_model"; 
import HeaderImageDropzone from '../HeaderImageDropzone';
import {helpfulLinksCategoryOptions}from "../../datamodel/helfullinks_model"; 

import SelectionFieldWidget from "../SelectionField";

  


export default function HelpfulLinksForm({}) {
  const [resetKey, setResetKey] = useState(0); // Reset trigger
  const [helpfulLinksFormData, setHelpfulLinksFormData] = useState(new HelpfulLinksFormData());


  // Generic change handler for form fields.
  const handleChange = (e, field) => {
    if (Array.isArray(e)) {
        // If `e` is an array, it's coming from TextGroupInputField
        setHelpfulLinksFormData((prev) => ({
            ...prev,
            [field]: e, // Directly set the array value
        }));
    } else if (typeof e === "string") {
        // If `e` is a string, it's from ReactQuill (rich text editor)
        setHelpfulLinksFormData((prev) => ({
            ...prev,
            [field]: e,
        }));
    } else {
        // Standard form fields
        const { name, value } = e.target;
        setHelpfulLinksFormData((prev) => ({
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
            text: "Please wait while we submit your helpful links.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Upload header image if available
            let headerImageURL = helpfulLinksFormData.headerImage
                ? await uploadImageToFirebase(helpfulLinksFormData.headerImage, `helpfulLinks/${Date.now()}_${helpfulLinksFormData.headerImage.name}`)
                : null;
              
            console.log(headerImageURL);

            // Create an instance of HelpfulLinksFormData and populate it
            const helpfulLinkData = new HelpfulLinksFormData();
            helpfulLinkData.id = ""; // Firestore will generate this
            helpfulLinkData.title = helpfulLinksFormData.title;
            helpfulLinkData.category = helpfulLinksFormData.category || [];
            helpfulLinkData.description = helpfulLinksFormData.description;
            helpfulLinkData.headerImage = headerImageURL;
            helpfulLinkData.references = helpfulLinksFormData.references || [];;
    
            // Save HelpfulLinksFormData data to Firestore
            const docRef = await addDoc(collection(db, "helpfulLinks"), helpfulLinkData.toJSON());
            const helpfulLinksDoc = doc(db, "helpfulLinks", docRef.id);
            await updateDoc(helpfulLinksDoc, { id: docRef.id });
    
            Swal.fire({
                title: "Helpful Links Submitted",
                text: "Your Helpful Links has been submitted successfully!",
                icon: "success",
            });
            // Reset form data after successful submission
            resetForm();
        } catch (error) {
            console.error("Error submitting Helpful Links:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your Helpful Links. Please try again.",
                icon: "error",
            });
        }
    };

    
  const resetForm = () => {
    setHelpfulLinksFormData({
      id : "",
      title : "",
      category : "",
      description : "",
      headerImage : null,
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
                      storyForm={helpfulLinksFormData}
                      setStoryForm={setHelpfulLinksFormData}
                      dropzoneName="dropzone-container-big"
                      previewName="dropzone-uploaded-image-big"
                      />
              </Form.Group>
            </Col>
            
        </Row>
        <Row className="mt-2" > 
          <Col md={12}>
          <SelectionFieldWidget

              onChange={(value) => handleChange(value, "category")}
              options={helpfulLinksCategoryOptions}
              resetKey={resetKey} // Pass reset trigger
              editingItems={helpfulLinksFormData.category}

              label="Categories"
            />
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
                  value={helpfulLinksFormData.title}
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
                           value={helpfulLinksFormData.description || ""} 
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
                editingItems={helpfulLinksFormData.references}
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
                                  Submit HelpfulLink
                              </Button>
                          </Container>
        </Row>
        <Container className="empty-container"></Container>

      </Form>
      

  );
}
