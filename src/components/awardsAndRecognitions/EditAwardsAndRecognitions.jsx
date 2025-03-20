import React, { useState, useEffect, useCallback  } from "react";
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

import AwardsAndRecognitionsFormData from "../../datamodel/awardsAndRecognitions_model"; 
import {awardsAndRecognitionCategoryOptions}from "../../datamodel/awardsAndRecognitions_model"; 

import SelectionFieldWidget from "../SelectionField";

import { deleteImageFromFirebase } from "../../config/firestorage";
import TravelExposFormData, { travelExposCategoryOptions } from "../../datamodel/travelExpos_model";


export default function EditAwardsAndRecognitionsForm({editingItem, toAddForm}) {
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

  useEffect(() => {
    if (editingItem) {
      setAwardsAndRecognitionsFormData(prevState => ({
        ...prevState,
        id: editingItem.id || "",
        title: editingItem.title || "",
        rank: editingItem.rank || "",
        year: editingItem.year || "",
        category:editingItem.category|| [],
        description: editingItem.description || "", // Default category if not provided
        headerImage: editingItem.headerImage || "",
        references: editingItem.references || [],
      }));

    }
  }, [editingItem]); // Dependency array includes editingItem

  const [headerImage, setHeaderImage] = useState(null);
  const [headerImageURL, setHeaderImageURL] = useState("");

  // Logo Dropzone 
      const onHeaderImageDrop = useCallback((acceptedFiles) => {
          if (acceptedFiles.length > 0) {
              setHeaderImage(acceptedFiles[0]);
          }
      }, []);
  
      const { getRootProps: getHeaderImageRootProps, getInputProps: getHeaderImageInputProps } = useDropzone({
          onDrop: onHeaderImageDrop,
          accept: "image/*",
          disabled: !!headerImageURL, // Disable dropzone after upload
      });
  
      const resetHeaderImage = () => {
          setAwardsAndRecognitionsFormData((prev) => ({
              ...prev,
              headerImage: null,
          }));
      };

  // When submitting, upload the data to Firebase Firestore.
  // Upload image to Firebase Storage (only when submit is clicked)
    const uploadImageToFirebase = async (imageFile, path) => {
        const imageRef = ref(storage, path);
        await uploadBytes(imageRef, imageFile);
        return await getDownloadURL(imageRef);
    };

        // const deleteImageFromFirebase = async (imageUrl) => {
        //     if (!imageUrl) return;
        //     const storageRef = ref(storage, imageUrl);
        //     try {
        //       await deleteObject(storageRef);
        //     } catch (error) {
        //       console.error("Error deleting image:", error);
        //     }
        //   };
    
       

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Show SweetAlert2 loading screen
        Swal.fire({
            title: "Submitting...",
            text: "Please wait while we submit your Awards And Recognitions.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
          
          let headerImageURL = awardsAndRecognitionsFormData.headerImage;
          // Handle header image replacement
          if (awardsAndRecognitionsFormData.headerImage instanceof File) {
            // If a new header image is provided, delete the old one (if it exists)
            if (editingItem && editingItem.headerImage) {
              await deleteImageFromFirebase(editingItem.headerImage);
            }
            headerImageURL = await uploadImageToFirebase(
              awardsAndRecognitionsFormData.headerImage,
              `awardsAndRecognitions/${Date.now()}_${awardsAndRecognitionsFormData.headerImage.name}`
            );
          } else {
            headerImageURL = awardsAndRecognitionsFormData.headerImage;
          }

           const awardsAndRecognitionsData = {
            id: editingItem ? editingItem.id : "", // Use existing ID for updates
            title: awardsAndRecognitionsFormData.title,
            rank: awardsAndRecognitionsFormData.rank,
            year: awardsAndRecognitionsFormData.year,
            category: awardsAndRecognitionsFormData.category || [],
            description: awardsAndRecognitionsFormData.description,
            headerImage: headerImageURL,
            references: awardsAndRecognitionsFormData.references || [],
          };
           
    
            // Update the existing document using the accommodation's id
           const awardsAndRecognitionsDocRef = doc(db, "awardsAndRecognitions", awardsAndRecognitionsFormData.id);
             try {
                           await updateDoc(awardsAndRecognitionsDocRef, awardsAndRecognitionsData);
                           Swal.fire({
                             title: "Awards And Recognitions Updated",
                             text: "Your Awards And Recognitions has been updated successfully!",
                             icon: "success",
                           });
                           resetHeaderImage();
                           resetForm();
                           toAddForm();
                         } catch (error) {
                           console.error("Error updating hotlines:", error);
                           Swal.fire({
                             title: "Update Failed",
                             text: "There was an error updating the Awards And Recognitions.",
                             icon: "error",
                           });
                         }
            // Reset form data after successful submission
   
        } catch (error) {
            console.error("Error submitting Awards And Recognitions:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your Awards And Recognitions. Please try again.",
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
    setResetKey(prevKey => prevKey + 1); // Change key to trigger reset
  };

  return (
    
      <Form className="custom-form body-container" onSubmit={handleSubmit}  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
        
        <Row>
                    <Col md={12}>
                    <Form.Group className="my-2">
                        <Form.Label className="label">
                            Upload Header Image (800x400)
                        </Form.Label>
                        <HeaderImageDropzone
                        storyForm={awardsAndRecognitionsFormData}
                        setStoryForm={setAwardsAndRecognitionsFormData}
                        editingItem={awardsAndRecognitionsFormData}
                        dropzoneName="dropzone-container-big"
                        previewName="dropzone-uploaded-image-big"
                        
                        />
                        <Container className="d-flex justify-content-between mt-2">
                                <p className='subtitle'>Supported File: PNG, JPEG, and JPG</p>
                                <p className='subtitle'>Maximum size: 25MB</p>
                        </Container>

                        {/* Upload & Camera Buttons */}
                        <Container className="d-flex justify-content-end">
                            {headerImage && (
                                            !headerImageURL ? (
                                                <Button className="my-2" variant="outline-danger" onClick={resetHeaderImage}>
                                                            <FontAwesomeIcon className="button-icon" icon={faCancel} size="xs" fixedWidth /> Remove Image
                                                </Button>
                                            ) : (
                                                null
                                            )
                                        )}
                            
                        </Container>
                        
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
            <Form.Group controlId="name" className="mb-3">
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
                                  Submit Update
                              </Button>
                          </Container>
        </Row>
        <Container className="empty-container"></Container>

      </Form>
      

  );
}
