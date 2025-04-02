import React, { useState, useCallback, useEffect, useRef } from "react";
import { db, storage } from "../../config/firebase";
import {  collection, addDoc, doc, updateDoc  } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone"; // Dropzone for image upload
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faCirclePlay, faCirclePlus, faCancel} from '@fortawesome/free-solid-svg-icons';
import RichTextEditor from '../TextEditor'; // adjust the path as needed
import HeaderImageDropzone from '../HeaderImageDropzone';
import TextGroupInputField from "../TextGroupInputField";
import TourismStoriesFormData from "../../datamodel/stories_model";
import { storiesClassificationOptions, storiesPurposeOptions } from "../../datamodel/stories_model";

import { deleteImageFromFirebase } from "../../config/firestorage";




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

  // Handle both File objects and URLs
  const imagePreview = section.image 
      ? section.image instanceof File 
          ? URL.createObjectURL(section.image) 
          : section.image  // If it's a URL, use it directly
      : null;

  return (
      <Container
          {...getRootProps()}
          className={`${dropzoneName} text-center w-100 ${imagePreview ? "border-success" : ""}`}
      >
          <input {...getInputProps()} accept="image/*,video/*" />
          {imagePreview ? (
              section.image instanceof File && section.image.type.startsWith("video/")
              ? (
                  <video controls className={previewName}>
                      <source src={imagePreview} type={section.image.type} />
                      Your browser does not support the video tag.
                  </video>
              ) : (
                  <img
                      src={imagePreview}
                      alt="Body Image Preview"
                      className={previewName}
                  />
              )
          ) : (
              <p className="text-muted">
                  Drag & Drop Image/Video Here or{" "}
                  <span className="text-primary text-decoration-underline">Choose File</span>
              </p>
          )}
      </Container>
  );
};
  
  
export default function EditStoryForm({editingItem, toAddForm}) {

       const [storyFormData, setStoryFormData] = useState(new TourismStoriesFormData);
   
                // Local state for selections
                const [selectedCategory, setSelectedCategory] = useState("");
                const [selectedSubcategory, setSelectedSubcategory] = useState("");
    // Populate form data if exists
    useEffect(() => {
        if (editingItem) {
          setStoryFormData({
            id: editingItem.id || "",
            title: editingItem.title || "",
            classification: editingItem.classification || "",
            purpose: editingItem.purpose || "",
            date: editingItem.date || "",
            headerImage: editingItem.headerImage || null,
            body: editingItem.body.map(section => ({
              ...section,
              image: section.image || null, // Only use the image property
            })),
            tags: editingItem.tags || [],
            references: editingItem.references || [],
            name: editingItem.name || "",
            email: editingItem.email || "",
            social: editingItem.social || "",
          });

          
            if (editingItem.category) {
                setSelectedCategory(editingItem.classification || "");
                setSelectedSubcategory(editingItem.purpose || "");
            } 
        } else {
          setStoryFormData({
            id: "",
            title: "",
            classification: "",
            purpose: "",
            date: "",
            headerImage: null,
            body: [{ subtitle: "", body: "", image: null, image_source: "" }],
            tags: [],
            references: [],
            name: "",
            email: "",
            social: "",
          });
        }


      }, [editingItem]);
      



   
    const [bodyImages, setBodyImages] = useState([]);

     const [resetKey, setResetKey] = useState(0); // Reset trigger
    
        const resetForm = () => {
            setStoryFormData({
                id:"",
                title: "",
                classification: "",
                purpose: "",
                date: "",
                headerImage: null,
                body: [{ subtitle: "", body: "", image: null, image_source: ""}],
                tags: [],
                references: [],
                name: "",
                email: "",
                social: "",
            });
            setResetKey(prevKey => prevKey + 1); // Change key to trigger reset    setSelectedCategory("");
    
        };

     // Generic change handler for form fields.
     const handleChange = (e, field) => {
        if (Array.isArray(e)) {
            // If `e` is an array, it's coming from TextGroupInputField
            setStoryFormData((prev) => ({
                ...prev,
                [field]: e, // Directly set the array value
            }));
        } else if (typeof e === "string") {
            // If `e` is a string, it's from ReactQuill (rich text editor)
            setStoryFormData((prev) => ({
                ...prev,
                [field]: e,
            }));
        } else {
            // Standard form fields
            const { name, value } = e.target;
            setStoryFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    const handleBodyChange = (index, field, value) => {
        setStoryFormData((prev) => {
        const newBody = [...prev.body];
        newBody[index] = { ...newBody[index], [field]: value };
        return { ...prev, body: newBody };
        });
    };
    
    const handleImageDrop = (acceptedFiles, index) => {
        const file = acceptedFiles[0]; // Take the first file

        if (file) {
            setStoryFormData((prevState) => {
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
        setStoryFormData((prev) => ({
        ...prev,
        body: [...prev.body, { subtitle: "", body: "", image: null, image_source: ""}],
        }));
    };

    const deleteBodySection = (index) => {
        setStoryFormData((prev) => {
        const newBody = prev.body.filter((_, i) => i !== index);
        return { ...prev, body: newBody };
        });
    };


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
        setStoryFormData((prev) => ({
            ...prev,
            headerImage: null,
        }));
    };

    const resetBodyImage = () => {
        setStoryFormData((prev) => ({
            ...prev,
            body: [{ subtitle: "", body: "", image: null, image_source: ""}],
        }));
    };



    


    // Handler for dropping an image into a specific body section
    const onBodyImageDrop = (acceptedFiles, index) => {
        if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
            setStoryFormData((prev) => {
            const newBody = [...prev.body];
            if (!newBody[index]) return prev;
            newBody[index] = { ...newBody[index], image: file };
            return { ...prev, body: newBody };
            });
        } else {
            Swal.fire({
            icon: "error",
            title: "Invalid File Type",
            text: "Only PNG, JPG, and JPEG files are allowed.",
            });
        }
        }
    };

    const removeBodyImage = (index) => {
        setStoryFormData((prev) => {
        const newBody = [...prev.body];
        if (!newBody[index]) return prev;
        newBody[index] = { ...newBody[index], image: null };
        return { ...prev, body: newBody };
        });
    };

    // Upload image to Firebase Storage (only when submit is clicked)
    const uploadImageToFirebase = async (imageFile, path) => {
        const imageRef = ref(storage, path);
        await uploadBytes(imageRef, imageFile);
        return await getDownloadURL(imageRef);
    };



    // Update the story data
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        // Show SweetAlert2 loading screen for update
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait while we update your story.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
      
        try {
          // Handle header image replacement
          let headerImageURL;
          if (storyFormData.headerImage instanceof File) {
            // If a new header image is provided, delete the old one (if it exists)
            if (editingItem && editingItem.headerImage) {
              await deleteImageFromFirebase(editingItem.headerImage);
            }
            headerImageURL = await uploadImageToFirebase(
              storyFormData.headerImage,
              `stories/${Date.now()}_${storyFormData.headerImage.name}`
            );
          } else {
            headerImageURL = storyFormData.headerImage;
          }
      
          // Handle body images replacement
          const bodyImagesURLs = await Promise.all(
            storyFormData.body.map(async (section, index) => {
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
                  `stories/${Date.now()}_${section.image.name}`
                );
              }
              return section.image;
            })
          );
      
          // Prepare the updated story object for Firestore
          const updatedStory = {
            classification: storyFormData.classification,
            purpose: storyFormData.purpose,
            title: storyFormData.title,
            headerImage: headerImageURL,
            date: storyFormData.date,
            body: storyFormData.body.map((section, index) => ({
              subtitle: section.subtitle,
              body: section.body,
              image: bodyImagesURLs[index] || "",
              image_source: section.image_source,
            })),
            tags: storyFormData.tags,
            references: storyFormData.references,
            name: storyFormData.name,
            email: storyFormData.email,
            social: storyFormData.social,
          };
      
          // Update the existing document using the story's id
          const storyDocRef = doc(db, "stories", storyFormData.id);
          await updateDoc(storyDocRef, updatedStory);
      
          Swal.fire({
            title: "Story Updated",
            text: "Your story has been updated successfully!",
            icon: "success",
          });
      
          // Optionally reset form data after a successful update
          setBodyImages([]);
          resetHeaderImage();
          toAddForm();
        } catch (error) {
          console.error("Error updating story:", error);
          Swal.fire({
            title: "Error",
            text: "There was an issue updating your story. Please try again.",
            icon: "error",
          });
        }
      };
      

    const textareaRef = useRef(null);

    return (
              <Form className="custom-form body-container"  onSubmit={handleSubmit}  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
                <h1 className="mb-4">Edit Tourism Story Form</h1>
                <Row className="d-flex flex-md-row flex-column">
                    <Col className="col me-lg-2 me-md-1">
                        <Form.Group className="mb-3">
                            <Form.Label className="label">Classification</Form.Label>
                            <Form.Control
                                as="select"
                                name="classification"
                                value={storyFormData.classification}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Classification</option>
                                {storiesClassificationOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col className="col ms-lg-2 ms-md-1">
                            <Form.Group className="mb-3">
                                <Form.Label className="label">Purpose</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="purpose"
                                    value={storyFormData.purpose}
                                    onChange={handleChange}
                                    required
                                    disabled={!storyFormData.classification}  // Disable until classification is selected
                                    placeholder={storyFormData.classification ? "Select Purpose" : "Select Classification First"}
                                >
                                    <option value="">{storyFormData.classification ? "Select Purpose" : "Select Classification First"}</option>
                                    {storyFormData.classification && storiesPurposeOptions[storyFormData.classification]?.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                    </Col>
                </Row>
                <Container className="empty-container"></Container>
                <Row className="d-flex flex-md-row flex-column">
                    <Col className="col me-lg-2 me-md-1">
                        <Container className="empty-container"></Container>
                    </Col>
                    <Col className="col ms-lg-2 ms-md-1">
                            <Form.Group className="mb-3">
                                <Form.Label className="label">Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={storyFormData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label className="label">Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        className="fw-bold"
                        value={storyFormData.title}
                        onChange={handleChange}
                        placeholder="Enter title"
                        required
                    />
                </Form.Group>
                <Form.Group className="my-2">
                    <Form.Label className="label">
                        Upload Header Image (800x400)
                    </Form.Label>
                    <HeaderImageDropzone
                    storyForm={storyFormData}
                    setStoryForm={setStoryFormData}
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
                <Container className="empty-container"></Container>
                <hr></hr>
                {/* Body Sections */}
                {storyFormData.body.map((section, index) => (
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
                                    editingItem={editingItem}
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
                            {storyFormData.body.length > 1 && (
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
                <Container className="empty-container"></Container>
                <Row className="d-flex flex-md-row flex-column">
                                    <Col className="col me-lg-2 me-md-1">
                                    <TextGroupInputField
                                            onChange={(value) => handleChange(value, "references")}
                                            label={"References and Links (Type & Enter)"}
                                            editingItems={storyFormData.references}
                                            resetKey={resetKey} 
                                        />
                                    </Col>
                                    <Col className="col ms-lg-2 ms-md-1">
                                    <TextGroupInputField
                                            onChange={(value) => handleChange(value, "tags")}
                                            label={"Important Tags (Type & Enter)"}
                                            editingItems={storyFormData.tags}
                                            resetKey={resetKey} 
                                        />
                                    </Col>
                                </Row>
                <Container className="empty-container"></Container>
                <hr></hr>
                <Container className="empty-container"></Container>
                <Form.Group className="mb-3">
                            <Form.Label className="label">Your Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={storyFormData.name}
                                
                                onChange={handleChange}
                                placeholder="Your Name"
                                required
                            />
                        </Form.Group>
                <Row className="d-flex flex-md-row flex-column">
                    <Col className="col me-lg-2 me-md-1">
                        <Form.Group className="mb-3">
                            <Form.Label className="label">Social Media Link</Form.Label>
                            <Form.Control
                                type="social"
                                name="social"
                                value={storyFormData.social}
                                onChange={handleChange}
                                placeholder="Social Link"
                            />
                        </Form.Group>
                    </Col>
                    <Col className="col ms-lg-2 ms-md-1">
                        <Form.Group className="mb-3">
                            <Form.Label className="label">Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={storyFormData.email}
                                onChange={handleChange}
                                placeholder="Email"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Container className="empty-container"></Container>
                <Container className="empty-container"></Container>

                <Container className="d-flex justify-content-end">
                  
                    <Button 
                        variant="outline-primary" 
                        type="submit" 
                        className="w-full" 
                        onClick={handleSubmit}
                    >
                        Submit Update
                    </Button>
                </Container>
            </Form>
    );
}
