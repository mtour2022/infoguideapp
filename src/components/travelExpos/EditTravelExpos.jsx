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


import SelectionFieldWidget from "../SelectionField";

import { deleteImageFromFirebase } from "../../config/firestorage";
import MultiImageDropzone from "../MultiImageDropzone";
import TravelExposFormData from "../../datamodel/travelExpos_model"; 
import {travelExposCategoryOptions, travelExposClassificationOptions}from "../../datamodel/travelExpos_model"; 

export default function EditTravelExposForm({editingItem, toAddForm}) {
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

  useEffect(() => {
    if (editingItem) {
      setTravelExposFormData(prevState => ({
        ...prevState,
        id: editingItem.id || "",
        title: editingItem.title || "",
        category:editingItem.category|| [],
        classification: editingItem.classification || "",
        dateStart: editingItem.dateStart || "",
        dateEnd: editingItem.dateEnd || "",
        description: editingItem.description || "", // Default category if not provided
        headerImage: editingItem.headerImage || "",
        images: editingItem.images || [],
        references: editingItem.references || [],

        
      }

    
    )


    
    
    );

      // Update selected category if editingItem has a category
      if (editingItem.classification) {
        setSelectedClassficication(editingItem.classification || "");
      } else {
        setSelectedClassficication(selectedClassficication);
      }

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
          setTravelExposFormData((prev) => ({
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
            text: "Please wait while we submit your Travel Expos.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
          
          let headerImageURL = travelExposFormData.headerImage;
          // Handle header image replacement
          if (travelExposFormData.headerImage instanceof File) {
            // If a new header image is provided, delete the old one (if it exists)
            if (editingItem && editingItem.headerImage) {
              await deleteImageFromFirebase(editingItem.headerImage);
            }
            headerImageURL = await uploadImageToFirebase(
              travelExposFormData.headerImage,
              `travelExpos/${Date.now()}_${travelExposFormData.headerImage.name}`
            );
          } else {
            headerImageURL = travelExposFormData.headerImage;
          }

          // Handle images replacement
                  const imagesURLs = await Promise.all(
                    travelExposFormData.images.map(async (image, index) => {
                      if (image instanceof File) {
                        // If a new image is provided, delete the old one (if it exists)
                        if (editingItem && editingItem.images && editingItem.images[index]) {
                          await deleteImageFromFirebase(editingItem.images[index]);
                        }
                        return await uploadImageToFirebase(
                          image,
                          `travelExpos/${Date.now()}_${image.name}`
                        );
                      }
                      return image; // If the image is not a File, keep the existing URL
                    })
                  );
              

           const travelExposData = {
            id: editingItem ? editingItem.id : "", // Use existing ID for updates
            title: travelExposFormData.title,
            category: travelExposFormData.category || [],
            classification: travelExposFormData.classification,
            dateStart: travelExposFormData.dateStart,
            dateEnd: travelExposFormData.dateEnd,
            description: travelExposFormData.description,
            headerImage: headerImageURL,
            images: imagesURLs,
            references: travelExposFormData.references || [],
          };
           
    
            // Update the existing document using the travel expos id
           const travelExposDocRef = doc(db, "travelExpos", travelExposFormData.id);
             try {
                           await updateDoc(travelExposDocRef, travelExposData);
                           Swal.fire({
                             title: "Travel Expos Updated",
                             text: "Your Travel Expos has been updated successfully!",
                             icon: "success",
                           });
                           resetHeaderImage();
                           resetForm();
                           toAddForm();
                         } catch (error) {
                           console.error("Error updating hotlines:", error);
                           Swal.fire({
                             title: "Update Failed",
                             text: "There was an error updating the Travel Expos.",
                             icon: "error",
                           });
                         }
            // Reset form data after successful submission
   
        } catch (error) {
            console.error("Error submitting Travel Expos:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your Travel Expos. Please try again.",
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
      images : [],
      references : [],
    });
    setResetKey(prevKey => prevKey + 1); // Change key to trigger reset
    setSelectedClassficication("");
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
                        storyForm={travelExposFormData}
                        setStoryForm={setTravelExposFormData}
                        editingItem={travelExposFormData}
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
        
        </Row>
        <Row>
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
                                                                              <Form.Label className="classification">Class Level</Form.Label>
                                                                              <Form.Select
                                                                                name="classification"
                                                                                value={travelExposFormData.classification}
                                                                                onChange={handleChange}
                                                                              >
                                                                                <option value="classification" disabled>Select Category</option>
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
            <Form.Group controlId="name" className="mb-3">
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
                                  Submit Update
                              </Button>
                          </Container>
        </Row>
        <Container className="empty-container"></Container>

      </Form>
      

  );
}
