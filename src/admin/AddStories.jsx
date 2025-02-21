import React, { useState, useCallback, useEffect, useRef } from "react";
import { db, storage } from "../config/firebase";
import {  collection, addDoc, doc, updateDoc  } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone"; // Dropzone for image upload
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus} from '@fortawesome/free-solid-svg-icons';

export default function StoryForm() {
    const [formData, setFormData] = useState({
        id:"",
        title: "",
        classification: "",
        purpose: "",
        date: "",
        headerImage: null,
        body: [{ subtitle: "", body: "", image: null }],
        tags: [],
        references: [],
        name: "",
        email: "",
        social: "",
    });

    const classificationOptions = ["Informative", "Inspirational", "Promotional and Marketing", "Educational", "Opinions and Review"];
    
    const purposeOptions = {
        Informative: ["Statistical Reports", "News", "Awards and Recognitions", "Tourism Projects", "Tourism Trends", "Popularity Ranking", "Technology"],
        "Promotional and Marketing": ["Travel Deals and Promotions", "Itinerary-Based", "Cultural Exploration", "Events or Festival Coverage", "Destination Highlight"],
        Inspirational: ["Story-Telling", "Sustainable Tourism", "Biography"],
        Educational: ["Travel Tips", "Practical or How-To", "Budgeting and Financial Planning", "Safety and Health"],
        "Opinions and Review": ["Product and Service Reviews", "Case Study"]
    };

    const [headerImageURL, setHeaderImageURL] = useState("");
    const [bodyImages, setBodyImages] = useState([]);

    // Handle change for form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle change for body sections
    const handleBodyChange = (index, key, value) => {
        const updatedBody = [...formData.body];
        updatedBody[index][key] = value;
        setFormData((prev) => ({ ...prev, body: updatedBody }));
    };

    const addBodySection = () => {
        setFormData((prev) => ({
            ...prev,
            body: [...prev.body, { subtitle: "", body: "", image: null }],
        }));
    };

        // Delete body section
    const deleteBodySection = (index) => {
        const updatedBody = formData.body.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, body: updatedBody }));
    };

    // Handle file change for header image (store only, no upload)
    const handleHeaderImageChange = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setFormData((prev) => ({ ...prev, headerImage: file }));
        const previewURL = URL.createObjectURL(file);
        setHeaderImageURL(previewURL);
    };

    // Handle file change for body image (store only, no upload)
    const handleBodyImageChange = (index, acceptedFiles) => {
        const file = acceptedFiles[0];
        const updatedBody = [...formData.body];
        updatedBody[index].image = file;
        setFormData((prev) => ({ ...prev, body: updatedBody }));

        const previewURL = URL.createObjectURL(file);
        setBodyImages((prev) => {
            const updatedImages = [...prev];
            updatedImages[index] = previewURL;
            return updatedImages;
        });
    };

    // Upload image to Firebase Storage (only when submit is clicked)
    const uploadImageToFirebase = async (imageFile, path) => {
        const imageRef = ref(storage, path);
        await uploadBytes(imageRef, imageFile);
        return await getDownloadURL(imageRef);
    };

    const storyCollectionRef = collection(db, "stories");

    // Submit the form data
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Upload header image if available
            let headerImageURL = "";
            if (formData.headerImage) {
                headerImageURL = await uploadImageToFirebase(formData.headerImage, `stories/${formData.headerImage.name}`);
            }

            // Upload body images if available
            const bodyImagesURLs = await Promise.all(
                formData.body.map(async (section, index) => {
                    if (section.image) {
                        const imageURL = await uploadImageToFirebase(section.image, `stories/${section.image.name}`);
                        return imageURL;
                    }
                    return "";
                })
            );

            // Prepare the story object to send to Firebase Firestore
            const story = {
                id: "",
                classification: formData.classification,
                purpose: formData.purpose,
                title: formData.title,
                headerImage: headerImageURL,
                date: formData.date,
                body: formData.body.map((section, index) => ({
                    subtitle: section.subtitle,
                    body: section.body,
                    image: bodyImagesURLs[index] || "",
                })),
                tags: formData.tags,
                references: formData.references,
                name: formData.name,
                email: formData.email,
                social: formData.social,
            };

            // Add the story to Firestore
            // await addDoc(collection(db, "stories"), story);
            const docRef = await addDoc(collection(db, "stories"), story);
            const storyDoc = doc(db, "stories", docRef.id);
            await updateDoc(storyDoc, { id: docRef.id });

            Swal.fire({
                title: "Story Submitted",
                text: "Your story has been submitted successfully!",
                icon: "success",
            });

            // Reset form data after successful submission
            setFormData({
                title: "",
                classification: "",
                purpose: "",
                date: "",
                headerImage: null,
                body: [{ subtitle: "", body: "", image: null }],
                tags: [],
                references: [],
                name: "",
                email: "",
                social: "",
            });
            setHeaderImageURL("");
            setBodyImages([]);
        } catch (error) {
            console.error("Error submitting story:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your story. Please try again.",
                icon: "error",
            });
        }
    };

    const { getRootProps: getHeaderImageRootProps, getInputProps: getHeaderImageInputProps } = useDropzone({
        onDrop: handleHeaderImageChange,
        accept: "image/*",
    });

    const { getRootProps: getBodyImageRootProps, getInputProps: getBodyImageInputProps } = useDropzone({
        onDrop: (acceptedFiles, index) => handleBodyImageChange(index, acceptedFiles),
        accept: "image/*",
    });
    
    // Create a ref and function to auto-resize the textarea
    const textareaRef = useRef(null);

    const handleAutoResize = () => {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';  // Reset the height
        textarea.style.height = `${textarea.scrollHeight}px`;  // Set the height to the scrollHeight
    };

    useEffect(() => {
        handleAutoResize();  // Initialize the textarea size when the component mounts
    }, []);

    return (
        <Container className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md body-container">
            <h2 className="text-2xl font-bold mb-4">Submit an Article</h2>
            <Form className="custom-form body-container" onSubmit={handleSubmit}>
                {/* Classification and Purpose */}
                <Row className="d-flex flex-md-row flex-column">
                
                    <Col className="col me-lg-2 me-md-1">
                        <Form.Group className="mb-3">
                            <Form.Label>Classification</Form.Label>
                            <Form.Control
                                as="select"
                                name="classification"
                                value={formData.classification}
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
                                <Form.Label>Purpose</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.classification}  // Disable until classification is selected
                                    placeholder={formData.classification ? "Select Purpose" : "Select Classification First"}
                                >
                                    <option value="">{formData.classification ? "Select Purpose" : "Select Classification First"}</option>
                                    {formData.classification && purposeOptions[formData.classification]?.map((option) => (
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
                        {/* Date */}
                            <Form.Group className="mb-3">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                    </Col>
                </Row>

                

                {/* Title */}
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter title"
                        required
                    />
                </Form.Group>

                

                {/* Header Image Upload */}
                <Form.Group className="my-2">
                    <Form.Label>Upload Header Image</Form.Label>
                    <Container {...getHeaderImageRootProps()} className={`dropzone-container text-center w-100 ${headerImageURL ? "border-success" : ""}`}>
                        <input {...getHeaderImageInputProps()} accept="image/*" />
                        {headerImageURL ? (
                            <img src={headerImageURL} alt="Header Image Preview" className="img-fluid mt-2" style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain" }} />
                        ) : (
                            <p className="text-muted">Drag & Drop your header image here or choose a file</p>
                        )}
                    </Container>
                </Form.Group>
                <Container className="empty-container"></Container>
                <hr></hr>

                {/* Body Sections */}
                {formData.body.map((section, index) => (
                    <Row key={index} className="mb-4">
                        <Container className="empty-container"></Container>
                        <Col className="col me-lg-2 me-md-1">
                            <Form.Group className="mb-3">
                                <Form.Label>Image (Optional)</Form.Label>
                                <Container {...getBodyImageRootProps(index)} className={`dropzone-container text-center w-100 ${bodyImages[index] ? "border-success" : ""}`}>
                                    <input {...getBodyImageInputProps(index)} accept="image/*" />
                                    {bodyImages[index] ? (
                                        <img src={bodyImages[index]} alt="Body Image Preview" className="img-fluid mt-2" style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain" }} />
                                    ) : (
                                        <p className="text-muted">Drag & Drop image here or choose a file</p>
                                    )}
                                </Container>
                            </Form.Group>
                        </Col>
                        <Col className="col ms-lg-2 ms-md-1">
                            <Form.Group className="mb-3">
                                <Form.Label>Subtitle (Optional)</Form.Label>
                                <Form.Control
                                    type="text"
                                    
                                    value={section.subtitle}
                                    onChange={(e) => handleBodyChange(index, "subtitle", e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Body</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    ref={textareaRef}
                                    value={section.body}
                                    onChange={(e) => handleBodyChange(index, "body", e.target.value)}
                                    onInput={handleAutoResize}  // Trigger resizing on input
                                    style={{ resize: 'none' }}  // Disable manual resizing
                                />
                            </Form.Group>
                            <Button
                                variant="danger"
                                type="button"
                                onClick={() => deleteBodySection(index)} // Delete button functionality
                                className="mt-3 w-full"
                            >
                                Delete Section
                            </Button>
                        </Col>
                        
                    </Row>
                ))}

                <Button variant="success" type="button" onClick={addBodySection} className="w-full mb-3">
                    Add Section
                </Button>
                <hr></hr>

                {/* Other form fields */}
                <Container className="empty-container"></Container>
                <Row className="d-flex flex-md-row flex-column">
                    <Col className="col me-lg-2 me-md-1">
                        <Form.Group className="mb-3">
                            <Form.Label>Tags (comma-separated)</Form.Label>
                            <Form.Control
                                rows = {4}
                                as="textarea"
                                name="tags"
                                placeholder="e.g: world class beach, white beach, tourist destination, award-winning"
                                value={formData.tags.join(", ")}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map(tag => tag.trim()) })}
                            />
                        </Form.Group>
                    </Col>
                    <Col className="col ms-lg-2 ms-md-1">
                        <Form.Group className="mb-3">
                            <Form.Label>References (comma-separated)</Form.Label>
                            <Form.Control
                                rows = {4}
                                as="textarea"
                                name="references"
                                placeholder="e.g: www.articleabcd.com/boracay+world+best+beach, www.data.com/boracay+tourist+arrival"
                                value={formData.references.join(", ")}
                                onChange={(e) => setFormData({ ...formData, references: e.target.value.split(",").map(ref => ref.trim()) })}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Container className="empty-container"></Container>
                <Container className="empty-container"></Container>
                <Form.Group className="mb-3">
                            <Form.Label>Your Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                required
                            />
                        </Form.Group>
                <Row className="d-flex flex-md-row flex-column">
                    <Col className="col me-lg-2 me-md-1">
                        <Form.Group className="mb-3">
                            <Form.Label>Social Media Link</Form.Label>
                            <Form.Control
                                type="social"
                                name="social"
                                value={formData.social}
                                onChange={handleChange}
                                placeholder="Social Link"
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col className="col ms-lg-2 ms-md-1">
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Container className="empty-container"></Container>
                <Container className="empty-container"></Container>
                <Button variant="primary" type="submit" className="w-full">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}
