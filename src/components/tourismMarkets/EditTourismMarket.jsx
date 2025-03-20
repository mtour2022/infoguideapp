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

import TourismMarketsFormData from "../../datamodel/tourismMarkets_model"; 


// const BodyImageDropzone = ({
//   index,
//   section,
//   onBodyImageDrop,
//   dropzoneName = "dropzone-container-small",
//   previewName = "dropzone-uploaded-image-small"
// }) => {
//   const { getRootProps, getInputProps } = useDropzone({
//       onDrop: (acceptedFiles) => onBodyImageDrop(acceptedFiles, index),
//       accept: "image/png, image/jpeg, image/jpg, video/mp4, video/webm, video/ogg",
//   });

//   // Handle both File objects and URLs
//   const imagePreview = section.image 
//       ? section.image instanceof File 
//           ? URL.createObjectURL(section.image) 
//           : section.image  // If it's a URL, use it directly
//       : null;

//   return (
//       <Container
//           {...getRootProps()}
//           className={`${dropzoneName} text-center w-100 ${imagePreview ? "border-success" : ""}`}
//       >
//           <input {...getInputProps()} accept="image/*,video/*" />
//           {imagePreview ? (
//               section.image instanceof File && section.image.type.startsWith("video/")
//               ? (
//                   <video controls className={previewName}>
//                       <source src={imagePreview} type={section.image.type} />
//                       Your browser does not support the video tag.
//                   </video>
//               ) : (
//                   <img
//                       src={imagePreview}
//                       alt="Body Image Preview"
//                       className={previewName}
//                   />
//               )
//           ) : (
//               <p className="text-muted">
//                   Drag & Drop Image/Video Here or{" "}
//                   <span className="text-primary text-decoration-underline">Choose File</span>
//               </p>
//           )}
//       </Container>
//   );
// };


const BodyImageDropzone = ({
  index,
  section,
  onBodyImageDrop,
  dropzoneName = "dropzone-container-small",
  previewName = "dropzone-uploaded-image-small"
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => onBodyImageDrop(acceptedFiles, index),
    accept: "image/png, image/jpeg, image/jpg, video/mp4, video/webm, video/ogg",
  });

  const isFile = section.image instanceof File;
  
  // Improved regex to detect video URLs even with query parameters
  const isVideoUrl = typeof section.image === "string" && /\.(mp4|webm|ogg)(\?.*)?$/i.test(section.image);
  const isImageUrl = typeof section.image === "string" && !isVideoUrl;

  // Separate file and URL previews
  const filePreview = isFile ? URL.createObjectURL(section.image) : null;
  const imageUrlPreview = isImageUrl ? section.image : null;
  const videoUrlPreview = isVideoUrl ? section.image : null;

  return (
    <Container
      {...getRootProps()}
      className={`${dropzoneName} text-center w-100 ${
        filePreview || imageUrlPreview || videoUrlPreview ? "border-success" : ""
      }`}
    >
      <input {...getInputProps()} accept="image/*,video/*" />
      
      {filePreview ? (
        section.image.type.startsWith("video/") ? (
          <video controls className={previewName}>
            <source src={filePreview} type={section.image.type} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={filePreview} alt="Uploaded File Preview" className={previewName} />
        )
      ) : videoUrlPreview ? (
        <video controls className={previewName}>
          <source src={videoUrlPreview} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : imageUrlPreview ? (
        <img src={imageUrlPreview} alt="Image URL Preview" className={previewName} />
      ) : (
        <p className="text-muted">
          Drag & Drop Image/Video Here or{" "}
          <span className="text-primary text-decoration-underline">Choose File</span>
        </p>
      )}
    </Container>
  );
};


export default function EditTourismMarketsForm({editingItem, toAddForm}) {
  const [resetKey, setResetKey] = useState(0); // Reset trigger
  const [tourismMarketsFormData, setTourismMarketsFormData] = useState(new TourismMarketsFormData());


  // Generic change handler for form fields.
  const handleChange = (e, field) => {
    if (Array.isArray(e)) {
        // If `e` is an array, it's coming from TextGroupInputField
        setTourismMarketsFormData((prev) => ({
            ...prev,
            [field]: e, // Directly set the array value
        }));
    } else if (typeof e === "string") {
        // If `e` is a string, it's from ReactQuill (rich text editor)
        setTourismMarketsFormData((prev) => ({
            ...prev,
            [field]: e,
        }));
    } else {
        // Standard form fields
        const { name, value } = e.target;
        setTourismMarketsFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
  };

  useEffect(() => {
    if (editingItem) {
      setTourismMarketsFormData(prevState => ({
        ...prevState,
        id: editingItem.id || "",
        title: editingItem.title || "",
        body: editingItem.body.map((section, index) => ({
          subtitle: section.subtitle || "",
          body: section.body || "",
          image: section.image || "",
          image_source: section.image_source || "", 
      })),
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
          setTourismMarketsFormData((prev) => ({
              ...prev,
              headerImage: null,
          }));
      };

      const handleBodyChange = (index, field, value) => {
        setTourismMarketsFormData((prev) => {
        const newBody = [...prev.body];
        newBody[index] = { ...newBody[index], [field]: value };
        return { ...prev, body: newBody };
        });
    };
    
    const handleImageDrop = (acceptedFiles, index) => {
        const file = acceptedFiles[0]; // Take the first file

        if (file) {
          setTourismMarketsFormData((prevState) => {
                const updatedBody = [...prevState.body];
                updatedBody[index] = {
                    ...updatedBody[index],
                    image: file, // Store file for upload
                    imageUrl: URL.createObjectURL(file), // Preview new image
                };
                return {
                    ...prevState,
                    body: updatedBody,
                };
            });
        }
    }

    const addBodySection = () => {
        setTourismMarketsFormData((prev) => ({
        ...prev,
        body: [...prev.body, { subtitle: "", body: "", image: null, image_source: ""}],
        }));
    };

    const deleteBodySection = (index) => {
      setTourismMarketsFormData((prev) => {
        const newBody = prev.body.filter((_, i) => i !== index);
        return { ...prev, body: newBody };
        });
    };

    const removeBodyImage = (index) => {
      setTourismMarketsFormData((prev) => {
      const newBody = [...prev.body];
      if (!newBody[index]) return prev;
      newBody[index] = { ...newBody[index], image: null };
      return { ...prev, body: newBody };
      });
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
            text: "Please wait while we submit your Tourism Markets.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
          
          let headerImageURL = tourismMarketsFormData.headerImage;
          // Handle header image replacement
          if (tourismMarketsFormData.headerImage instanceof File) {
            // If a new header image is provided, delete the old one (if it exists)
            if (editingItem && editingItem.headerImage) {
              await deleteImageFromFirebase(editingItem.headerImage);
            }
            headerImageURL = await uploadImageToFirebase(
              tourismMarketsFormData.headerImage,
              `tourismMarkets/${Date.now()}_${tourismMarketsFormData.headerImage.name}`
            );
          } else {
            headerImageURL = tourismMarketsFormData.headerImage;
          }

           // Handle body images replacement
                        const bodyImagesURLs = await Promise.all(
                          tourismMarketsFormData.body.map(async (section, index) => {
                            if (section.image instanceof File) {
                              // If a new body image is provided, delete the old one (if it exists)
                              if (
                                editingItem &&
                                editingItem.body &&
                                editingItem.body[index] &&
                                editingItem.body[index].image
                              ) {
                                await deleteImageFromFirebase(editingItem.body[index].image);
                              }
                              return await uploadImageToFirebase(
                                section.image,
                                `tourismMarkets/${Date.now()}_${section.image.name}`
                              );
                            }
                            return section.image;
                          })
                        );

          // Handle images replacement
                  const imagesURLs = await Promise.all(
                    tourismMarketsFormData.images.map(async (image, index) => {
                      if (image instanceof File) {
                        // If a new image is provided, delete the old one (if it exists)
                        if (editingItem && editingItem.images && editingItem.images[index]) {
                          await deleteImageFromFirebase(editingItem.images[index]);
                        }
                        return await uploadImageToFirebase(
                          image,
                          `tourismMarkets/${Date.now()}_${image.name}`
                        );
                      }
                      return image; // If the image is not a File, keep the existing URL
                    })
                  );
              

           const tourismMarketsData = {
            id: editingItem ? editingItem.id : "", // Use existing ID for updates
            title: tourismMarketsFormData.title,
            body: tourismMarketsFormData.body.map((section, index) => ({
              subtitle: section.subtitle,
              body: section.body,
              image: bodyImagesURLs[index] || "",
              image_source: section.image_source,
            })),            headerImage: headerImageURL,
            images: imagesURLs,
            references: tourismMarketsFormData.references || [],
          };
           
    
            // Update the existing document using the tourismMarkets id
           const tourismMarketsDocRef = doc(db, "tourismMarkets", tourismMarketsFormData.id);
             try {
                           await updateDoc(tourismMarketsDocRef, tourismMarketsData);
                           Swal.fire({
                             title: "Tourism Markets Updated",
                             text: "Your Tourism Markets has been updated successfully!",
                             icon: "success",
                           });
                           resetHeaderImage();
                           resetForm();
                           toAddForm();
                         } catch (error) {
                           console.error("Error updating hotlines:", error);
                           Swal.fire({
                             title: "Update Failed",
                             text: "There was an error updating the Tourism Markets.",
                             icon: "error",
                           });
                         }
            // Reset form data after successful submission
   
        } catch (error) {
            console.error("Error submitting Tourism Markets:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your Tourism Markets. Please try again.",
                icon: "error",
            });
        }
    };

    
  const resetForm = () => {
    setTourismMarketsFormData({
      id : "",
      title : "",
      body: [{ subtitle: "", body: "", image: null, image_source: ""}],
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
                        storyForm={tourismMarketsFormData}
                        setStoryForm={setTourismMarketsFormData}
                        editingItem={tourismMarketsFormData}
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

       
        <Row className="mt-2" > 
          <Col md={12}>
            <Form.Group controlId="name" className="mb-3">
                <Form.Label className="label">Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter business name"
                  name="title"
                  value={tourismMarketsFormData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
          </Col>
        </Row>

        {/* Body Sections */}
        <Row>
                <Col md={12}>
                    <p className="label mb-2">Body Sections</p>
                    {tourismMarketsFormData.body.map((section, index) => (
                                <Row key={index} className="d-flex flex-md-row flex-column">
                                <Container className="empty-container"></Container>
                                <Form.Group className="mb-3 m-0 p-0">
                                    <Form.Label className="label">Subtitle (Optional)</Form.Label>
                                    <Form.Control
                                    type="text"
                                    className="fw-bold"
                                    value={section.subtitle}
                                    onChange={(e) => handleBodyChange(index, "subtitle", e.target.value)}
                                    />
                                </Form.Group>
                                <Col className="col me-lg-2 me-md-1">
                                    <Form.Group className="mb-3">
                                    <Form.Label className="label">Image (Optional)</Form.Label>
                                    <BodyImageDropzone 
                                        index={index} 
                                        section={section} 
                                        onBodyImageDrop={handleImageDrop} 
                                        dropzoneName="dropzone-container-small"
                                        previewName="dropzone-uploaded-image-small"
                                    />

                                    {section.image && (
                                        <Container className="d-flex justify-content-end">
                                            <Button
                                            className="mt-2 mb-1"
                                            variant="outline-danger"
                                            onClick={() => removeBodyImage(index)}
                                            >
                                            <FontAwesomeIcon icon={faCancel} size="xs" fixedWidth /> Remove Image
                                            </Button>
                                        </Container>
                                    )}
                                    </Form.Group>
                                    <Form.Group className="mb-3 m-0 p-0">
                                        <Form.Label className="label">Image Source (Optional)</Form.Label>
                                        <Form.Control
                                        placeholder="e.g. @boracayphotos or /islanders or #trivago or www.trivago.com"
                                        type="text"
                                        value={section.image_source}
                                        onChange={(e) => handleBodyChange(index, "image_source", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col className="col ms-lg-2 ms-md-1">
                                    <Form.Group className="mb-5">
                                    <Form.Label className="label">Body</Form.Label>
                                        <RichTextEditor
                                            index={index}
                                            section={section}
                                            handleBodyChange={handleBodyChange}
                                            />
                                    </Form.Group>
                                </Col>
                                {tourismMarketsFormData.body.length > 1 && (
                                    <Container className="mb-4 d-flex justify-content-end">
                                        <Button
                                        variant="outline-danger"
                                        type="button"
                                        onClick={() => deleteBodySection(index)}
                                        className="mt-3 w-full"
                                        >
                                        <FontAwesomeIcon icon={faTrash} size="xs" fixedWidth /> Delete Section
                                        </Button>
                                    </Container>
                                    )}
                                </Row>
                            ))}
                    <hr></hr>
                    <Container className="empty-container"></Container>
                    <Container className="d-flex justify-content-end">
                        <Button variant="outline-success" type="button" onClick={addBodySection} className="mb-3">
                            <FontAwesomeIcon icon={faCirclePlus} size="xs" fixedWidth /> Add Section
                        </Button>
                    </Container>
                </Col>
               </Row>
        <Row className="mt-2">
            <Col  md={12}>
            <Form.Group controlId="name" >
              <Form.Label className="label me-2">Promotional & Marketing Photos</Form.Label>
              <MultiImageDropzone
                  dataForm={tourismMarketsFormData}
                  setDataForm={setTourismMarketsFormData}
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
                editingItems={tourismMarketsFormData.references}
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
