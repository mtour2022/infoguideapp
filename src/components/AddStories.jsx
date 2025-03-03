import React, { useState, useCallback, useEffect, useRef } from "react";
import { db, storage } from "../config/firebase";
import {  collection, addDoc, doc, updateDoc  } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone"; // Dropzone for image upload
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faCirclePlay, faCirclePlus, faCancel} from '@fortawesome/free-solid-svg-icons';
import RichTextEditor from './TextEditor'; // adjust the path as needed
import HeaderImageDropzone from './HeaderImageDropzone';


const BodyImageDropzone = ({
    index,
    section,
    onBodyImageDrop,
    dropzoneName = "dropzone-container-small",
    previewName = "dropzone-uploaded-image-small"
  }) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (acceptedFiles) => onBodyImageDrop(acceptedFiles, index),
      accept: "image/png, image/jpeg, image/jpg",
    });
  
    // Use the new uploaded image if available
    const imagePreview = section.image
      ? URL.createObjectURL(section.image)
      : null;
  
    return (
      <Container
        {...getRootProps()}
        className={`${dropzoneName} text-center w-100 ${imagePreview ? "border-success" : ""}`}
      >
        <input {...getInputProps()} accept="image/*" />
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Body Image Preview"
            className={previewName}
          />
        ) : (
          <p className="text-muted">
            Drag & Drop Image Here or{" "}
            <span className="text-primary text-decoration-underline">Choose File</span>
          </p>
        )}
      </Container>
    );
  };
  
export default function StoryForm() {
    const [storyFormData, setStoryFormData] = useState({
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
        
    // Populate form data if exists
    useEffect(() => {
    }, []);

    const classificationOptions = ["Informative", "Inspirational", "Promotional and Marketing", "Educational", "Opinions and Review"];
    
    const purposeOptions = {
        Informative: ["Statistical Reports", "News", "Awards and Recognitions", "Tourism Projects", "Tourism Trends", "Popularity Ranking", "Technology"],
        "Promotional and Marketing": ["Travel Deals and Promotions", "Itinerary-Based", "Cultural Exploration", "Events or Festival Coverage", "Destination Highlight"],
        Inspirational: ["Story-Telling", "Sustainable Tourism", "Biography"],
        Educational: ["Travel Tips", "Practical or How-To", "Budgeting and Financial Planning", "Safety and Health"],
        "Opinions and Review": ["Product and Service Reviews", "Case Study"]
    };

   
    const [bodyImages, setBodyImages] = useState([]);

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
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStoryFormData((prev) => ({ ...prev, [name]: value }));
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



    // Submit the form data
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Show SweetAlert2 loading screen
        Swal.fire({
            title: 'Submitting...',
            text: 'Please wait while we submit your story.',
            allowOutsideClick: false,
            didOpen: () => {
            Swal.showLoading();
            }
        });

        try {
            // Upload header image if available
            let headerImageURL = await uploadImageToFirebase(
                storyFormData.headerImage,
                `stories/${Date.now()}_${storyFormData.headerImage}`
            );

            // Upload body images if available
            const bodyImagesURLs = await Promise.all(
                storyFormData.body.map(async (section, index) => {
                    if (section.image) {
                        const imageURL = await uploadImageToFirebase(section.image, `stories/${Date.now()}_${section.image.name}`);
                        return imageURL;
                    }
                    return "";
                })
            );

            // Prepare the story object to send to Firebase Firestore
            const story = {
                id: "",
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

            const docRef = await addDoc(collection(db, "stories"), story);
            const storyDoc = doc(db, "stories", docRef.id);
            await updateDoc(storyDoc, { id: docRef.id });

            Swal.fire({
                title: "Story Submitted",
                text: "Your story has been submitted successfully!",
                icon: "success",
            });

            // Reset form data after successful submission
            resetForm();
            setBodyImages([]);
            resetHeaderImage();
        } catch (error) {
            console.error("Error submitting story:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your story. Please try again.",
                icon: "error",
            });
        }
    };

    const textareaRef = useRef(null);

    return (
              <Form className="custom-form body-container"  onSubmit={handleSubmit}  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
                <h1 className="mb-4">Add Tourism Story Form</h1>
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
                                {classificationOptions.map((option) => (
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
                                    {storyFormData.classification && purposeOptions[storyFormData.classification]?.map((option) => (
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
                        <Form.Group className="mb-3">
                            <Form.Label className="label">General References</Form.Label>
                            <p className="subtitle">Note: Important sources. Seperate using comma (,)</p>
                            <Form.Control
                                rows = {4}
                                as="textarea"
                                name="references"
                                placeholder="e.g: www.articleabcd.com/boracay+world+best+beach, www.data.com/boracay+tourist+arrival"
                                value={storyFormData.references.join(", ")}
                                onChange={(e) => setStoryFormData({ ...storyFormData, references: e.target.value.split(",").map(ref => ref.trim()) })}
                            />
                        </Form.Group>
                    </Col>
                    <Col className="col ms-lg-2 ms-md-1">
                        <Form.Group className="mb-3">
                            <Form.Label className="label">Tags</Form.Label>
                            <p className="subtitle">Note: Tags for Search Optimization. Seperate using comma (,)</p>
                            <Form.Control
                                rows = {4}
                                as="textarea"
                                name="tags"
                                required
                                placeholder="e.g: world class beach, white beach, tourist destination, award-winning"
                                value={storyFormData.tags.join(", ")}
                                onChange={(e) => setStoryFormData({ ...storyFormData, tags: e.target.value.split(",").map(tag => tag.trim()) })}
                            />
                        </Form.Group>
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

                <Container className="d-flex justify-content-between">
                    <Button variant="outline-danger" onClick={resetForm}>Reset Form</Button>
                    <Button 
                        variant="outline-primary" 
                        type="submit" 
                        className="w-full" 
                        onClick={handleSubmit}
                    >
                        Submit Article
                    </Button>
                </Container>
            </Form>
    );
}
