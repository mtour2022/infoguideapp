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
import HelpfulLinksFormData from "../../datamodel/helfullinks_model"; 
import HeaderImageDropzone from '../HeaderImageDropzone';
import {helpfulLinksCategoryOptions}from "../../datamodel/helfullinks_model"; 

import SelectionFieldWidget from "../SelectionField";
import { deleteImageFromFirebase } from "../../config/firestorage";



export default function EditHelpfulLinksForm({editingItem, toAddForm}) {
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

  useEffect(() => {
    if (editingItem) {
      setHelpfulLinksFormData(prevState => ({
        ...prevState,
        id: editingItem.id || "",
        title: editingItem.title || "",
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
          setHelpfulLinksFormData((prev) => ({
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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Show SweetAlert2 loading screen
        Swal.fire({
            title: "Submitting...",
            text: "Please wait while we submit your helpful Links.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
          
          let headerImageURL = helpfulLinksFormData.headerImage;
          // Handle header image replacement
          if (helpfulLinksFormData.headerImage instanceof File) {
            // If a new header image is provided, delete the old one (if it exists)
            if (editingItem && editingItem.headerImage) {
              await deleteImageFromFirebase(editingItem.headerImage);
            }
            headerImageURL = await uploadImageToFirebase(
              helpfulLinksFormData.headerImage,
              `helpfulLinks/${Date.now()}_${helpfulLinksFormData.headerImage.name}`
            );
          } else {
            headerImageURL = helpfulLinksFormData.headerImage;
          }

           const helpfulLinkData = {
            id: editingItem ? editingItem.id : "", // Use existing ID for updates
            title: helpfulLinksFormData.title,
            category: helpfulLinksFormData.category || [],
            description: helpfulLinksFormData.description,
            headerImage: headerImageURL,
            references: helpfulLinksFormData.references || [],
          };
           
    
            // Update the existing document using the accommodation's id
           const helpfulLinkDocRef = doc(db, "helpfulLinks", helpfulLinksFormData.id);
             try {
                           await updateDoc(helpfulLinkDocRef, helpfulLinkData);
                           Swal.fire({
                             title: "Helpful Links Updated",
                             text: "Your Helpful Links has been updated successfully!",
                             icon: "success",
                           });
                           resetHeaderImage();
                           resetForm();
                           toAddForm();
                         } catch (error) {
                           console.error("Error updating hotlines:", error);
                           Swal.fire({
                             title: "Update Failed",
                             text: "There was an error updating the Helpful Links.",
                             icon: "error",
                           });
                         }
            // Reset form data after successful submission
   
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
                        storyForm={helpfulLinksFormData}
                        setStoryForm={setHelpfulLinksFormData}
                        editingItem={helpfulLinksFormData}
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
              options={helpfulLinksCategoryOptions}
              resetKey={resetKey} // Pass reset trigger
              editingItems={helpfulLinksFormData.category}

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
                                  Submit Update
                              </Button>
                          </Container>
        </Row>
        <Container className="empty-container"></Container>

      </Form>
      

  );
}
