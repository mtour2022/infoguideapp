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
import CalendarEventsFormData from "../../datamodel/calendarevents_model"; 
import {calendarEventsCategoryOptions} from "../../datamodel/calendarevents_model"; 
import TextGroupInputField from "../TextGroupInputField";


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

  
  
export default function CalendarEventsForm() {
    const [calendarEventsFormData, setCalendarEventsFormData] = useState(new CalendarEventsFormData());
    const [resetKey, setResetKey] = useState(0); // Reset trigger


    // Populate form data if exists
    useEffect(() => {
    }, []);


    const resetForm = () => {
        setCalendarEventsFormData({
            id:"",
            dateTimeStart: "",
            dateTimeEnd: "",
            category: "",
            title: "",
            headerImage: null,
            headerImageSource: [],
            body: [{ subtitle: "", body: "", image: null, image_source: ""}],
            tags: [],
            thingsToDo: [],
        });

        setResetKey(prevKey => prevKey + 1); // Change key to trigger reset

    };

    

    // Generic change handler for form fields.
    const handleChange = (e, field) => {
        if (Array.isArray(e)) {
            // If `e` is an array, it's coming from TextGroupInputField
            setCalendarEventsFormData((prev) => ({
                ...prev,
                [field]: e, // Directly set the array value
            }));
        } else if (typeof e === "string") {
            // If `e` is a string, it's from ReactQuill (rich text editor)
            setCalendarEventsFormData((prev) => ({
                ...prev,
                [field]: e,
            }));
        } else {
            // Standard form fields
            const { name, value } = e.target;
            setCalendarEventsFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleBodyChange = (index, field, value) => {
        setCalendarEventsFormData((prev) => {
        const newBody = [...prev.body];
        newBody[index] = { ...newBody[index], [field]: value };
        return { ...prev, body: newBody };
        });
    };
    
    const handleImageDrop = (acceptedFiles, index) => {
        const file = acceptedFiles[0]; // Take the first file

        if (file) {
            setCalendarEventsFormData((prevState) => {
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
        setCalendarEventsFormData((prev) => ({
        ...prev,
        body: [...prev.body, { subtitle: "", body: "", image: null, image_source: ""}],
        }));
    };

    const deleteBodySection = (index) => {
        setCalendarEventsFormData((prev) => {
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
        setCalendarEventsFormData((prev) => ({
            ...prev,
            headerImage: null,
        }));
    };

    const resetBodyImage = () => {
        setCalendarEventsFormData((prev) => ({
            ...prev,
            body: [{ subtitle: "", body: "", image: null, image_source: ""}],
        }));
    };

    // Handler for dropping an image into a specific body section
    const onBodyImageDrop = (acceptedFiles, index) => {
        if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
            setCalendarEventsFormData((prev) => {
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
        setCalendarEventsFormData((prev) => {
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
            text: 'Please wait while we submit your calendar event.',
            allowOutsideClick: false,
            didOpen: () => {
            Swal.showLoading();
            }
        });

        try {
            // Upload header image if available
            let headerImageURL = await uploadImageToFirebase(
                calendarEventsFormData.headerImage,
                `calendarEvents/${Date.now()}_${calendarEventsFormData.headerImage}`
            );

            // Upload body images if available
            const bodyImagesURLs = await Promise.all(
                calendarEventsFormData.body.map(async (section, index) => {
                    if (section.image) {
                        const imageURL = await uploadImageToFirebase(section.image, `calendarEvents/${Date.now()}_${section.image.name}`);
                        return imageURL;
                    }
                    return "";
                })
            );

            // Prepare the story obje
            // ct to send to Firebase Firestore
            const calendarEvents = {
                id: "",
                dateTimeStart: calendarEventsFormData.dateTimeStart,
                dateTimeEnd: calendarEventsFormData.dateTimeEnd,
                category: calendarEventsFormData.category,
                title: calendarEventsFormData.title,
                headerImage: headerImageURL,
                headerImageSource: calendarEventsFormData.headerImageSource,
                body: calendarEventsFormData.body.map((section, index) => ({
                    subtitle: section.subtitle,
                    body: section.body,
                    image: bodyImagesURLs[index] || "",
                    image_source: section.image_source, 
                })),
                tags: calendarEventsFormData.tags,
                thingsToDo: calendarEventsFormData.thingsToDo,
            };

            const docRef = await addDoc(collection(db, "calendarEvents"), calendarEvents);
            const calendarEventDoc = doc(db, "calendarEvents", docRef.id);
            await calendarEventDoc(calendarEventDoc, { id: docRef.id });

            Swal.fire({
                title: "Calendar Events Submitted",
                text: "Your Calendar Events has been submitted successfully!",
                icon: "success",
            });

            // Reset form data after successful submission
            resetForm();
            resetHeaderImage();
        } catch (error) {
            console.error("Error submitting Calendar Events:", error);
            Swal.fire({
                title: "Error",
                text: "There was an issue submitting your Calendar Events. Please try again.",
                icon: "error",
            });
        }
    };

    const textareaRef = useRef(null);

    return (
              <Form className="custom-form body-container"  onSubmit={handleSubmit}  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
                <Row>
                <Col md={6}>
                    <Form.Group controlId="category" className="mb-3">
                                <Form.Label className="label">Category</Form.Label>
                                <Form.Select
                                    name="category"
                                    value={calendarEventsFormData.category}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Category</option>
                                    {calendarEventsCategoryOptions.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                    ))}
                                </Form.Select>
                                </Form.Group>
                </Col>
                <Col md={6}>
                    <Container className="empty-container"></Container>
                </Col>
            </Row>
                <Row>
                    <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label className="label">Start Date & Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="dateTimeStart"
                            value={calendarEventsFormData.dateTimeStart}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    </Col>
                    <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label className="label">End Date & Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="dateTimeEnd"
                            value={calendarEventsFormData.dateTimeEnd}
                            onChange={handleChange}
                            min={calendarEventsFormData.dateTimeStart} // Prevents selecting an earlier date
                            disabled={!calendarEventsFormData.dateTimeStart} // Disable if Start Date is empty
                            required
                        />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                        <Form.Label className="label">Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            className="fw-bold"
                            value={calendarEventsFormData.title}
                            onChange={handleChange}
                            placeholder="Enter title"
                            required
                        />
                        </Form.Group>                
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                    <Form.Group className="my-2">
                        <Form.Label className="label">
                            Upload Header Image (800x400)
                        </Form.Label>
                        <HeaderImageDropzone
                        storyForm={calendarEventsFormData}
                        setStoryForm={setCalendarEventsFormData}
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
                <Row>
                    <Col md={12}>
                    <TextGroupInputField
                        onChange={(value) => handleChange(value, "headerImageSource")}
                        label={"Header Image Sources (Type & Enter)"}
                        editingItems={calendarEventsFormData.headerImageSource}
                        resetKey={resetKey} 
                        />
                    </Col>
                </Row>

                
                
                <Container className="empty-container"></Container>
                <hr></hr>
                <Container className="empty-container"></Container>

                {/* Body Sections */}
                
               <Row>
                <Col md={12}>
                    <p className="label mb-2">Body Sections</p>
                    {calendarEventsFormData.body.map((section, index) => (
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
                                {calendarEventsFormData.body.length > 1 && (
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
                <Container className="empty-container"></Container>
               
                <Container className="empty-container"></Container>
                <Row>
                    <Col md={12}>
                    <TextGroupInputField
                        onChange={(value) => handleChange(value, "thingsToDo")}
                        label={"Things To Do (Type & Enter)"}
                        caption="notable activities during the event"
                        editingItems={calendarEventsFormData.thingsToDo}
                        resetKey={resetKey} 
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                    <TextGroupInputField
                        onChange={(value) => handleChange(value, "tags")}
                        label={"Tags (Type & Enter)"}
                        editingItems={calendarEventsFormData.tags}
                        resetKey={resetKey} 
                        caption="imporant tags for Optimization"
                        />
                    </Col>
                </Row>
                
                <Container className="empty-container"></Container>
                <hr></hr>
                <Container className="empty-container"></Container>
                <Container className="d-flex justify-content-between">
                    <Button variant="outline-danger" onClick={resetForm}>Reset Form</Button>
                    <Button 
                        variant="outline-primary" 
                        type="submit" 
                        className="w-full" 
                        onClick={handleSubmit}
                    >
                        Submit Event Calendar
                    </Button>
                </Container>
            </Form>
    );
}
