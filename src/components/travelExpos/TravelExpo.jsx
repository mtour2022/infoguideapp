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

import TravelExposFormData from "../../datamodel/travelExpos_model"; 
import {travelExposCategoryOptions, travelExposClassificationOptions}from "../../datamodel/travelExpos_model"; 


export default function TravelExposForm({}) {
  const [resetKey, setResetKey] = useState(0); // Reset trigger
  const [travelExposFormData, setTravelExposFormData] = useState(new TravelExposFormData());
    const [selectedClassficication, setSelectedClassficication] = useState("");

  // Generic change handler for form fields.
  const handleChange = (e, field) => {
    if (Array.isArray(e)) {
        // If `e` is an array, it's coming from TextGroupInputField
        setTravelExposFormData((prev) => ({
            ...prev,
            [field]: e, // Directly set the array value
        }));
    } else if (typeof e === "string") {
        // If `e` is a string, it's from ReactQuill (rich text editor)
        setTravelExposFormData((prev) => ({
            ...prev,
            [field]: e,
        }));
    } else {
        // Standard form fields
        const { name, value } = e.target;
        setTravelExposFormData((prev) => ({
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
            text: "Please wait while we submit your travel expos.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Upload header image if available
            let headerImageURL = travelExposFormData.headerImage
                ? await uploadImageToFirebase(travelExposFormData.headerImage, `travelExpos/${Date.now()}_${travelExposFormData.headerImage.name}`)
                : null;
            
                    
            // Upload images if available
            const imagesURLs = await Promise.all(
              travelExposFormData.images.map(async (image) => {
                    return image ? await uploadImageToFirebase(image, `travelExpos/${Date.now()}_${image.name}`) : "";
                })
            );

            // Create an instance of travelExpos and populate it
            const travelExposData = new TravelExposFormData();
            travelExposData.id = ""; // Firestore will generate this
            travelExposData.title = travelExposFormData.title;
            travelExposData.dateStart = travelExposFormData.dateStart;
            travelExposData.dateEnd = travelExposFormData.dateEnd;
            travelExposData.category = travelExposFormData.category || [];
            travelExposData.classification = travelExposFormData.classification || selectedClassficication;
            travelExposData.description = travelExposFormData.description;
            travelExposData.headerImage = headerImageURL;
            travelExposData.images = imagesURLs;
            travelExposData.references = travelExposFormData.references || [];;
    
            // Save travelExpos data to Firestore
            const docRef = await addDoc(collection(db, "travelExpos"), travelExposData.toJSON());
            const travelExposDoc = doc(db, "travelExpos", docRef.id);
            await updateDoc(travelExposDoc, { id: docRef.id });
    
            Swal.fire({
                title: "Travel Expos Links Submitted",
                text: "Your Travel Expos Links has been submitted successfully!",
                icon: "success",
            });
            // Reset form data after successful submission
            resetForm();
        } catch (error) {
            console.error("Error submitting travelExpos And Recognitions Links:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your Travel Expos Links. Please try again.",
                icon: "error",
            });
        }
    };

    
  const resetForm = () => {
    setTravelExposFormData({
      id : "",
      title : "",
      category : [],

      classification : "",
      dateStart: "",
      dateEnd: "",
      description : "",
      headerImage : null,
      images: [],
      references : [],
    });
    setSelectedClassficication("");
    setResetKey(prevKey => prevKey + 1); // Change key to trigger reset    setSelectedCategory("");

  };

  return (
    
      <Form className="custom-form body-container" onSubmit={handleSubmit}  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
        
        <Row >
          <Col  md={12}>
            <Form.Group controlId="headerImage" className="mb-3">
                <Form.Label className="label">Cover Photo</Form.Label>
                <HeaderImageDropzone
                      storyForm={travelExposFormData}
                      setStoryForm={setTravelExposFormData}
                      dropzoneName="dropzone-container-big"
                      previewName="dropzone-uploaded-image-big"
                      />
              </Form.Group>
            </Col>
            
        </Row>
        <Row className="mt-2" > 
          <Col md={6}>
          <SelectionFieldWidget
              onChange={(value) => handleChange(value, "category")}
              options={travelExposCategoryOptions}
              resetKey={resetKey} // Pass reset trigger
              editingItems={travelExposFormData.category}
              label="Categories"
            />
          </Col>
          <Col md={6}>
                                <Form.Group controlId="classification" className="mb-3">
                                            <Form.Label className="label">Class Level</Form.Label>
                                            <Form.Select
                                              name="classification"
                                              value={travelExposCategoryOptions.classification}
                                              onChange={handleChange}
                                            >
                                              <option value="classification" disabled>Select Class Level</option>
                                              {travelExposClassificationOptions.map((option, index) => (
                                                <option key={index} value={option}>
                                                  {option}
                                                </option>
                                              ))}
                                            </Form.Select>
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
                value={travelExposFormData.dateStart}
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
                value={travelExposFormData.dateEnd}
                onChange={handleChange}
                min={travelExposFormData.dateStart} // Prevents selecting an earlier date
                disabled={!travelExposFormData.dateStart} // Disable if Start Date is empty
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
                  value={travelExposFormData.title}
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
                           value={travelExposFormData.description || ""} 
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
                  dataForm={travelExposFormData}
                  setDataForm={setTravelExposFormData}
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
                editingItems={travelExposFormData.references}
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
                                  Submit Travel Expo
                              </Button>
                          </Container>
        </Row>
        <Container className="empty-container"></Container>

      </Form>
      

  );
}
