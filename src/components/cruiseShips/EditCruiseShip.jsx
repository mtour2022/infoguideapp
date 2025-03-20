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



import { deleteImageFromFirebase } from "../../config/firestorage";
import MultiImageDropzone from "../MultiImageDropzone";
import CruiseShipsFormData from "../../datamodel/cruiseShips_model"; 


export default function EditCruiseShipsForm({editingItem, toAddForm}) {
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

  useEffect(() => {
    if (editingItem) {
      setCruiseShipsFormData(prevState => ({
        ...prevState,
        id: editingItem.id || "",
        title: editingItem.title || "",
        country:editingItem.country|| "",
        total:editingItem.total|| 0,
        dateStart: editingItem.dateStart || "",
        dateEnd: editingItem.dateEnd || "",
        description: editingItem.description || "", // Default category if not provided
        headerImage: editingItem.headerImage || "",
        images: editingItem.images || [],
        references: editingItem.references || [],

        
      }

    
    )


    
    
    );

    
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
          setCruiseShipsFormData((prev) => ({
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
            text: "Please wait while we submit your cruise Ships.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
          
          let headerImageURL = cruiseShipsFormData.headerImage;
          // Handle header image replacement
          if (cruiseShipsFormData.headerImage instanceof File) {
            // If a new header image is provided, delete the old one (if it exists)
            if (editingItem && editingItem.headerImage) {
              await deleteImageFromFirebase(editingItem.headerImage);
            }
            headerImageURL = await uploadImageToFirebase(
              cruiseShipsFormData.headerImage,
              `cruiseShips/${Date.now()}_${cruiseShipsFormData.headerImage.name}`
            );
          } else {
            headerImageURL = cruiseShipsFormData.headerImage;
          }

          // Handle images replacement
                  const imagesURLs = await Promise.all(
                    cruiseShipsFormData.images.map(async (image, index) => {
                      if (image instanceof File) {
                        // If a new image is provided, delete the old one (if it exists)
                        if (editingItem && editingItem.images && editingItem.images[index]) {
                          await deleteImageFromFirebase(editingItem.images[index]);
                        }
                        return await uploadImageToFirebase(
                          image,
                          `cruiseShips/${Date.now()}_${image.name}`
                        );
                      }
                      return image; // If the image is not a File, keep the existing URL
                    })
                  );
              

           const cruiseShipsData = {
            id: editingItem ? editingItem.id : "", // Use existing ID for updates
            title: cruiseShipsFormData.title,
            country: cruiseShipsFormData.country,
            total: cruiseShipsFormData.total,
            dateStart: cruiseShipsFormData.dateStart,
            dateEnd: cruiseShipsFormData.dateEnd,
            description: cruiseShipsFormData.description,
            headerImage: headerImageURL,
            images: imagesURLs,
            references: cruiseShipsFormData.references || [],
          };
           
    
            // Update the existing document using the cruise Ships id
           const cruiseShipsDocRef = doc(db, "cruiseShips", cruiseShipsFormData.id);
             try {
                           await updateDoc(cruiseShipsDocRef, cruiseShipsData);
                           Swal.fire({
                             title: "Cruise Ships Updated",
                             text: "Your Cruise Ships has been updated successfully!",
                             icon: "success",
                           });
                           resetHeaderImage();
                           resetForm();
                           toAddForm();
                         } catch (error) {
                           console.error("Error updating hotlines:", error);
                           Swal.fire({
                             title: "Update Failed",
                             text: "There was an error updating the Cruise Ships.",
                             icon: "error",
                           });
                         }
            // Reset form data after successful submission
   
        } catch (error) {
            console.error("Error submitting Cruise Ships:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your Cruise Ships. Please try again.",
                icon: "error",
            });
        }
    };

    
  const resetForm = () => {
    setCruiseShipsFormData({
      id : "",
      title : "",
      country : "",
      total : "",
      dateStart: "",
      dateEnd: "",
      description : "",
      headerImage : null,
      images : [],
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
                        storyForm={cruiseShipsFormData}
                        setStoryForm={setCruiseShipsFormData}
                        editingItem={cruiseShipsFormData}
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
            <Form.Group controlId="name" className="mb-3">
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
                                  Submit Update
                              </Button>
                          </Container>
        </Row>
        <Container className="empty-container"></Container>

      </Form>
      

  );
}
