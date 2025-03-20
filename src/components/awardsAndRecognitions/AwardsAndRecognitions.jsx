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


import SelectionFieldWidget from "../SelectionField";

import AwardsAndRecognitionsFormData from "../../datamodel/awardsAndRecognitions_model"; 
import {awardsAndRecognitionCategoryOptions}from "../../datamodel/awardsAndRecognitions_model"; 


export default function AwardsAndRecognitionsForm({}) {
  const [resetKey, setResetKey] = useState(0); // Reset trigger
  const [awardsAndRecognitionsFormData, setAwardsAndRecognitionsFormData] = useState(new AwardsAndRecognitionsFormData());


  // Generic change handler for form fields.
  const handleChange = (e, field) => {
    if (Array.isArray(e)) {
        // If `e` is an array, it's coming from TextGroupInputField
        setAwardsAndRecognitionsFormData((prev) => ({
            ...prev,
            [field]: e, // Directly set the array value
        }));
    } else if (typeof e === "string") {
        // If `e` is a string, it's from ReactQuill (rich text editor)
        setAwardsAndRecognitionsFormData((prev) => ({
            ...prev,
            [field]: e,
        }));
    } else {
        // Standard form fields
        const { name, value } = e.target;
        setAwardsAndRecognitionsFormData((prev) => ({
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
            text: "Please wait while we submit your awards and recognitions.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Upload header image if available
            let headerImageURL = awardsAndRecognitionsFormData.headerImage
                ? await uploadImageToFirebase(awardsAndRecognitionsFormData.headerImage, `awardsAndRecognitions/${Date.now()}_${awardsAndRecognitionsFormData.headerImage.name}`)
                : null;
              
            console.log(headerImageURL);

            // Create an instance of Awards And Recognitions and populate it
            const awardsAndRecognitionData = new AwardsAndRecognitionsFormData();
            awardsAndRecognitionData.id = ""; // Firestore will generate this
            awardsAndRecognitionData.title = awardsAndRecognitionsFormData.title;
            awardsAndRecognitionData.rank = awardsAndRecognitionsFormData.rank;
            awardsAndRecognitionData.year = awardsAndRecognitionsFormData.year;
            awardsAndRecognitionData.category = awardsAndRecognitionsFormData.category || [];
            awardsAndRecognitionData.description = awardsAndRecognitionsFormData.description;
            awardsAndRecognitionData.headerImage = headerImageURL;
            awardsAndRecognitionData.references = awardsAndRecognitionsFormData.references || [];;
    
            // Save AwardsAndRecognitionsFormData data to Firestore
            const docRef = await addDoc(collection(db, "awardsAndRecognitions"), awardsAndRecognitionData.toJSON());
            const awardsAndRecognitionsDoc = doc(db, "awardsAndRecognitions", docRef.id);
            await updateDoc(awardsAndRecognitionsDoc, { id: docRef.id });
    
            Swal.fire({
                title: "Awards And Recognitions Links Submitted",
                text: "Your Awards And Recognitions Links has been submitted successfully!",
                icon: "success",
            });
            // Reset form data after successful submission
            resetForm();
        } catch (error) {
            console.error("Error submitting Awards And Recognitions Links:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your Awards And Recognitions Links. Please try again.",
                icon: "error",
            });
        }
    };

    
  const resetForm = () => {
    setAwardsAndRecognitionsFormData({
      id : "",
      title : "",
      rank : "",
      year : "",
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
                      storyForm={awardsAndRecognitionsFormData}
                      setStoryForm={setAwardsAndRecognitionsFormData}
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
              options={awardsAndRecognitionCategoryOptions}
              resetKey={resetKey} // Pass reset trigger
              editingItems={awardsAndRecognitionsFormData.category}

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
                  value={awardsAndRecognitionsFormData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={6}>
            <Form.Group controlId="rank" className="mb-3">
                  <Form.Label className="label">Ranking ('0' if N/A)</Form.Label>
                  <Form.Control
                      type="text"
                      placeholder="e.g.: 2000"
                      name="rank"
                      required
                      value={awardsAndRecognitionsFormData.rank}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          handleChange(e); // Only update state if input is valid
                        }
                      }}
                  />
              </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="year" className="mb-3">
                  <Form.Label className="label">Year Received</Form.Label>
                  <Form.Control
                      type="text"
                      placeholder="e.g.: 2000"
                      name="year"
                      required
                      value={awardsAndRecognitionsFormData.year}
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
                           value={awardsAndRecognitionsFormData.description || ""} 
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
                editingItems={awardsAndRecognitionsFormData.references}
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
                                  Submit Awards And Recognition
                              </Button>
                          </Container>
        </Row>
        <Container className="empty-container"></Container>

      </Form>
      

  );
}
