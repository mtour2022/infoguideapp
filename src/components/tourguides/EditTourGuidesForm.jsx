import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { db, storage } from "../../config/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Swal from "sweetalert2";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import AddressInput from '../Address';
import MapWidgetFormGroup from "../map/MapLocator"; // Adjust the import path as needed
import HeaderImageDropzone from '../HeaderImageDropzone';
import LogoImageDropzone from "../LogoImageDrop";
import SelectionFieldWidget from "../SelectionField";
import TextGroupInputField from "../TextGroupInputField";
import MultiImageDropzone from "../MultiImageDropzone";
import GoogleMapComponent from "../map/MapLocation";
import { deleteImageFromFirebase } from "../../config/firestorage";



import {
  geoOptions,
  accessibilityOptions,
  classificationOptions,
} from '../../datamodel/accommodation_model';

import TourGuideFormData from "../../datamodel/tourguide_model";
import { setDataInElement } from "ckeditor5";

export default function EditingTourGuideForm({ editingItem, toAddForm }) {
  const [resetKey, setResetKey] = useState(0); // Reset trigger
  const [tourGuideFormData, setTourGuideFormData] = useState(new TourGuideFormData());

  // Local state for selections
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedClassification, setSelectedClassification] = useState("");

  // Generic change handler for form fields.
  const handleChange = (e, field) => {
    if (Array.isArray(e)) {
      // If `e` is an array, it's coming from TextGroupInputField
      setTourGuideFormData((prev) => ({
        ...prev,
        [field]: e, // Directly set the array value
      }));
    } else if (typeof e === "string") {
      // If `e` is a string, it's from ReactQuill (rich text editor)
      setTourGuideFormData((prev) => ({
        ...prev,
        [field]: e,
      }));
    } else {
      // Standard form fields
      const { name, value } = e.target;
      setTourGuideFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  // Handle category change and reset subcategory.
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setTourGuideFormData((prev) => ({
      ...prev,
      category: value,
      subcategory: "",
    }));
  };

  const handleLocationSelect = (position, link) => {
    if (!position) {
      console.warn("handleLocationSelect received null position.");
      return;
    }

    setTourGuideFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        lat: position.lat || "", // Ensure it doesn't break if position is missing
        long: position.lng || "",
      },
      link: link || "", // Ensure link is never undefined
    }));
  };



  useEffect(() => {
    if (editingItem) {
      // Update tourguidedata with properties from editingItem
      setTourGuideFormData(prevState => ({
        ...prevState,
        id: editingItem.id || "",
        name: editingItem.name || "",

        category: editingItem.category || "", // Default category if not provided
        subcategory: editingItem.subcategory || "",
        classification: editingItem.classification || "",
        designation: editingItem.designation || "",


        nationalityType: editingItem.nationalityType || "",
        nationality: editingItem.nationality || "",
        birthday: editingItem.birthday || "",
        sex: editingItem.sex || "",
        description: editingItem.description || "",

        height: editingItem.height || "",
        weight: editingItem.weight || "",

        language: editingItem.language || [],

        images: editingItem.images || [],
        logo: editingItem.logo || "",
        headerImage: editingItem.headerImage || "",
        website: editingItem.website || "",
        email: editingItem.email || "",

        address: {
          street: editingItem.address.street || "",
          barangay: editingItem.address.barangay || "",
          town: editingItem.address.town || "",
          region: editingItem.address.region || "",
          province: editingItem.address.province || "",
          country: editingItem.address.country || "",
          lat: editingItem.address.lat || "",
          long: editingItem.address.long || "",
        },
        link: editingItem.link || "",
        geo: editingItem.geo || "",
        awards: editingItem.awards || [],
        memberships: editingItem.memberships || [],

        socials: editingItem.socials || [],
        note: editingItem.note || "",
      }));

      // Update selected category if editingItem has a category
      if (editingItem.category) {
        setSelectedCategory(editingItem.category || "");
        setSelectedSubcategory(editingItem.subcategory || "");
        setSelectedClassification(editingItem.classification || "");
      } else {
        setSelectedCategory("Tourism & Leisure");
        setSelectedSubcategory("tourguides");
      }
    }
  }, [editingItem]); // Dependency array includes editingItem




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
      text: "Please wait while we submit your accommodation data.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Initialize URLs
      let headerImageURL = tourGuideFormData.headerImage;
      let logoURL = tourGuideFormData.logo;

      // Handle header image replacement
      if (tourGuideFormData.headerImage instanceof File) {
        // If a new header image is provided, delete the old one (if it exists)
        if (editingItem && editingItem.headerImage) {
          await deleteImageFromFirebase(editingItem.headerImage);
        }
        headerImageURL = await uploadImageToFirebase(
          tourGuideFormData.headerImage,
          `tourguides/${Date.now()}_${tourGuideFormData.headerImage.name}`
        );
      }

      // Handle logo replacement
      if (tourGuideFormData.logo instanceof File) {
        // If a new logo is provided, delete the old one (if it exists)
        if (editingItem && editingItem.logo) {
          await deleteImageFromFirebase(editingItem.logo);
        }
        logoURL = await uploadImageToFirebase(
          tourGuideFormData.logo,
          `tourguides/${Date.now()}_${tourGuideFormData.logo.name}`
        );
      }

      // Handle images replacement
      const imagesURLs = await Promise.all(
        tourGuideFormData.images.map(async (image, index) => {
          if (image instanceof File) {
            // If a new image is provided, delete the old one (if it exists)
            if (editingItem && editingItem.images && editingItem.images[index]) {
              await deleteImageFromFirebase(editingItem.images[index]);
            }
            return await uploadImageToFirebase(
              image,
              `tourguides/${Date.now()}_${image.name}`
            );
          }
          return image; // If the image is not a File, keep the existing URL
        })
      );

      // Create an instance of tourguide and populate it
      // Prepare accommodation data
      const updateAccommodationData = {
        id: editingItem ? editingItem.id : "", // Use existing ID for updates
        name: tourGuideFormData.name,
        category: tourGuideFormData.category || selectedCategory,
        subcategory: tourGuideFormData.subcategory || selectedSubcategory,
        classification: tourGuideFormData.classification || selectedClassification,
        designation: tourGuideFormData.designation,
        nationalityType: tourGuideFormData.nationalityType,
        description: tourGuideFormData.description,
        birthday: tourGuideFormData.birthday,
        sex: tourGuideFormData.sex,
        images: imagesURLs,
        height: tourGuideFormData.height,
        weight: tourGuideFormData.weight,
        logo: logoURL,
        language: tourGuideFormData.language || [],
        accreditation: tourGuideFormData.accreditation,
        headerImage: headerImageURL,
        email: tourGuideFormData.email,
        website: tourGuideFormData.website,
        address: { ...tourGuideFormData.address },
        link: tourGuideFormData.link,
        geo: tourGuideFormData.geo,
        awards: tourGuideFormData.awards || [],
        memberships: tourGuideFormData.memberships || [],
        socials: tourGuideFormData.socials || [],
        note: tourGuideFormData.note,
      };
      // Update the existing document using the accommodation's id
      const accommodationDocRef = doc(db, "tourguides", tourGuideFormData.id);
      try {
        await updateDoc(accommodationDocRef, updateAccommodationData);
        Swal.fire({
          title: "Tour Guide Updated",
          text: "Your Tour Guide has been updated successfully!",
          icon: "success",
        });
      } catch (error) {
        console.error("Error updating tour guide:", error);
        Swal.fire({
          title: "Update Failed",
          text: "There was an error updating the tour guide.",
          icon: "error",
        });
      }
      // Reset form data after successful submission
      resetForm();
      resetHeaderImage();
      toAddForm();

    } catch (error) {
      console.error("Error submitting tour guide:", error);
      Swal.fire({
        title: "Error",
        text: "There was an issue submitting your tour guide. Please try again.",
        icon: "error",
      });
    }
  };



  const resetLogo = () => {
    setTourGuideFormData((prev) => ({
      ...prev,
      logo: null,
    }));
  };

  const resetHeaderImage = () => {
    setTourGuideFormData((prev) => ({
      ...prev,
      headerImage: null,
    }));
  };

  const resetForm = () => {
    setTourGuideFormData({
      id: "",
      name: "",
      designation: "",
      category: "",
      subcategory: "",
      classification: "",
      nationalityType: "",
      nationality: "",
      birthday: "",
      sex: "",
      description: "",
      height: "",
      weight: "",
      language: [],
      images: [],
      logo: null,
      headerImage: null,
      website: "",
      email: "",

      address: {
        street: "",
        barangay: "",
        town: "",
        region: "",
        province: "",
        country: "",
        lat: "",
        long: "",
      },
      link: "",
      memberships: "",
      awards: "",
      geo: "",
      socials: [],
      note: [],
    });
    setResetKey(prevKey => prevKey + 1); // Change key to trigger reset
    setSelectedCategory("");
    setSelectedClassification("");
    setSelectedSubcategory("");
  };

  

  // Initialize the isEditing state to false
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Function to handle the Edit button click
  const handleEditAddressClick = () => {
    setIsEditingAddress(!isEditingAddress); // Toggle the isEditing state
  };

  // Initialize the isEditing state to false
  const [isEditingMap, setIsEditingMap] = useState(false);

  // Function to handle the Edit button click
  const handleEditMapClick = () => {
    setIsEditingMap(!isEditingMap); // Toggle the isEditing state
  };



  return (

    <Form className="custom-form body-container" onSubmit={handleSubmit} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
      <Row className="row mb-4">
        <Col md={6}>
          <Form.Group controlId="category" className="mb-3">
            <Form.Label className="label">Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Category"
              name="category"
              value={tourGuideFormData.category || "Tourism & Leisure"}
              onChange={handleChange}
              readOnly
            />
          </Form.Group>

        </Col>
        <Col md={6}>
          <Form.Group controlId="subcategory" className="mb-3">
            <Form.Label className="label">Sub Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Subcategory"
              name="subcategory"
              value={tourGuideFormData.subcategory || "tourguides"}
              onChange={handleChange}
              readOnly
            />
          </Form.Group>
          {selectedSubcategory && classificationOptions[selectedSubcategory] && (
            <Form.Group controlId="formClassification" className="mb-3">
              <Form.Label className="label">Classification</Form.Label>
              <Form.Select
                value={tourGuideFormData.classification || ""}
                onChange={(e) => {
                  const newClassification = e.target.value;
                  setSelectedClassification(newClassification);

                  // Update tourGuideFormData
                  setTourGuideFormData((prev) => ({
                    ...prev,
                    classification: newClassification,
                  }));
                }}
              >
                <option value="">Select Classification</option>
                {classificationOptions[selectedSubcategory]?.map((classification, index) => (
                  <option key={index} value={classification}>{classification}</option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
        </Col>
      </Row >
      <Container className="empty-container"></Container>
      <hr></hr>
      <Container className="empty-container"></Container>
      <Row className="mt-2">
        <Col md={12}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label className="label">Cover Photo</Form.Label>
            <HeaderImageDropzone
              storyForm={tourGuideFormData}
              setStoryForm={setTourGuideFormData}
              dropzoneName="dropzone-container-big"
              previewName="dropzone-uploaded-image-big"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row >
        <Col md={6}>
          <Form.Group controlId="logo" className="mb-3">
            <Form.Label className="label">Profile</Form.Label>
            <LogoImageDropzone
              storyForm={tourGuideFormData}
              setStoryForm={setTourGuideFormData}
              dropzoneName="dropzone-container-small"
              previewName="dropzone-uploaded-image-small"
              caption="Drag & Drop Logo here"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Container></Container>
        </Col>

      </Row>

      <Row className="mt-2" >
        <Col md={12}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label className="label">Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter full name"
              name="name"
              value={tourGuideFormData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group controlId="designation" className="mb-3">
            <Form.Label className="label">Current Designation</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter current designation"
              name="designation"
              value={tourGuideFormData.designation}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group controlId="nationalityType" className="mb-3">
            <Form.Label className="label">Nationality</Form.Label>
            <Form.Select
              name="nationalityType"
              value={tourGuideFormData.nationalityType || ''}
              onChange={(e) => {
                const value = e.target.value;
                setTourGuideFormData((prev) => ({
                  ...prev,
                  nationalityType: value,
                  nationality: value === 'Local' ? 'Filipino' : '', // Automatically set Filipino if Local
                }));
              }}
              required
            >
              <option value="">Select nationality type</option>
              <option value="Local">Local</option>
              <option value="Foreign">Foreign</option>
            </Form.Select>
          </Form.Group>

          {tourGuideFormData.nationalityType === 'Foreign' && (
            <Form.Group controlId="nationality" className="mb-3">
              <Form.Label className="label">Enter Nationality</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter nationality"
                name="nationality"
                value={tourGuideFormData.nationality || ''}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}
        </Col>
        <Col md={12}>
          <Form.Group controlId="birthday" className="mb-3">
            <Form.Label className="label">Birthday</Form.Label>
            <Form.Control
              type="date"
              name="birthday"
              value={tourGuideFormData.birthday || ''}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>

        <Col md={12}>
          <Form.Group controlId="sex" className="mb-3">
            <Form.Label className="label">Sex</Form.Label>
            <Form.Select
              name="sex"
              value={tourGuideFormData.sex}
              onChange={handleChange}
              required
            >
              <option value="">Select sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other or Non-binary">Other or Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group controlId="height" className="mb-3">
            <Form.Label className="label">Height</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter height in meters (m)"
              name="height"
              value={tourGuideFormData.height}
              onChange={handleChange}

            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group controlId="weight" className="mb-3">
            <Form.Label className="label">Weight</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter height in kilogram (kg)"
              name="weight"
              value={tourGuideFormData.weight}
              onChange={handleChange}

            />
          </Form.Group>
        </Col>
        <Row className="mt-2">
          <Col md={12} >

           
              {isEditingAddress ? (
                <AddressInput groupData={tourGuideFormData} setGroupData={settourGuideFormData} resetKey={resetKey}></AddressInput>
              ) : (
                <Form.Group className="mt-3 mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <Form.Label className="label mb-2">Local Business Address</Form.Label>
                  <Button variant="outline-danger" className="mb-2" onClick={handleEditAddressClick}>
                    {isEditingAddress ? 'Cancel' : 'Edit Address'}
                  </Button>
                </div>
                <>
                  <Form.Control
                    className="mb-3"
                    type="text"
                    name="address.country"
                    placeholder="Country"
                    value={tourGuideFormData.address.country}
                    readOnly
                  />
                  <Form.Control
                    className="my-3"
                    type="text"
                    name="address.region"
                    placeholder="Region"
                    value={tourGuideFormData.address.region}
                    readOnly
                  />
                  <Form.Control
                    className="my-3"
                    type="text"
                    name="address.province"
                    placeholder="Province"
                    value={tourGuideFormData.address.province}
                    readOnly
                  />
                  <Form.Control
                    className="my-3"
                    type="text"
                    name="address.city"
                    placeholder="City/Municipality/Town"
                    value={tourGuideFormData.address.town}
                    readOnly
                  />
                  <Form.Control
                    className="my-3"
                    type="text"
                    name="address.barangay"
                    placeholder="Barangay"
                    value={tourGuideFormData.address.barangay}
                    readOnly
                  />
                  <Form.Control
                    className="my-3"
                    type="text"
                    name="address.street"
                    placeholder="Street Name / Zone (Optional)"
                    value={tourGuideFormData.address.street}
                    readOnly
                  />
                </>
                </Form.Group>
              )}
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={12}>
              {isEditingMap ? (
                  <MapWidgetFormGroup
                  onLocationSelect={handleLocationSelect}
                  name={tourGuideFormData.name || ""}
                  resetKey={resetKey}
                  editingItems={tourGuideFormData.address}
                />
              ) : (
                <Form.Group className="mt-3 mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <Form.Label className="label mb-2">Local Business Address</Form.Label>
                  <Button variant="outline-danger" className="mb-2" onClick={handleEditMapClick}>
                    {isEditingMap ? 'Cancel' : 'Edit Map Location'}
                  </Button>
                </div>
                <GoogleMapComponent latitude={tourGuideFormData.address.lat} longitude={tourGuideFormData.address.long} />
                </Form.Group>
              )}
          </Col>
        </Row>
        
        <Row className="mt-2">
          <Col md={12}>
            <Form.Group controlId="link" className="mb-3">
              <Form.Label className="label">Google Map Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="Select Location First"
                name="link"
                value={tourGuideFormData.link}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={6}>
            <Form.Group controlId="lat" className="mb-3">
              <Form.Label className="label">Lattitude</Form.Label>
              <Form.Control
                type="text"
                placeholder="Select Location First"
                name="lat"
                value={tourGuideFormData.address.lat}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="long" className="mb-3">
              <Form.Label className="label">Longitude</Form.Label>
              <Form.Control
                type="text"
                placeholder="Select Location First"
                name="long"
                value={tourGuideFormData.address.long}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>
        <Col md={6}>
          <TextGroupInputField
            onChange={(value) => handleChange(value, "language")}
            label={"Language Proficiency (Type & Enter)"}
            editingItems={tourGuideFormData.language}
            resetKey={resetKey}
          />
        </Col>
      </Row>

      <Col md={12}>
        <Form.Group controlId="geo" className="mb-3">
          <Form.Label className="label">Geographical Location</Form.Label>
          <Form.Select
            name="geo"
            value={tourGuideFormData.geo}
            onChange={handleChange}
          >
            <option value="" disabled>Select Geo Location</option>
            {geoOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Row className="mt-2">
        <Col md={12}>
          <Form.Group controlId="description" className="mb-5 mt-2">
            <Form.Label className="label">Brief Description</Form.Label>
            <ReactQuill
              theme="snow"
              value={tourGuideFormData.description || ""}
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


      <Row className="mt-2 ">
            <Col  md={12}>
            <Form.Group controlId="name" >
              <Form.Label className="label">Promotional & Marketing Photos</Form.Label>
              <MultiImageDropzone
                  dataForm={tourGuideFormData}
                  setDataForm={setTourGuideFormData}
                  caption="Drag & drop images or click to select (Max: 10)"
                  dropzoneName="dropzone-container-small"
                  previewName="dropzone-uploaded-image-small"
                />
            </Form.Group>
            </Col>
        </Row>

      <Row className="mt-2" >
        <Col md={12}>
          <Form.Group controlId="accreditation" className="mb-3">
            <Form.Label className="label">Department of Tourism (DOT) Accreditation No.</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter DOT Accreditation No."
              name="accreditation"
              value={tourGuideFormData.accreditation}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label className="label">Official Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Email"
              name="email"
              value={tourGuideFormData.email}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="website" className="mb-3">
            <Form.Label className="label">Official Website Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter website link"
              name="website"
              value={tourGuideFormData.website}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <TextGroupInputField
            onChange={(value) => handleChange(value, "socials")}
            label={"Social Media Links (Type & Enter)"}
            editingItems={tourGuideFormData.socials}
            resetKey={resetKey}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col md={6}>
          <TextGroupInputField
            onChange={(value) => handleChange(value, "awards")}
            label={"Awards, Accreditations, and Certifications (Type & Enter)"}
            editingItems={tourGuideFormData.awards}
            resetKey={resetKey}
            caption="format: hh:mm A  | e.g. 08:00 AM"
          />
        </Col>
        <Col md={6}>
          <TextGroupInputField
            onChange={(value) => handleChange(value, "memberships")}
            label={"Memberships (Type & Enter)"}
            editingItems={tourGuideFormData.memberships}
            resetKey={resetKey}
            caption="format: hh:mm A  | e.g. 08:00 AM"
          />
        </Col>
      </Row>


      <Container className="empty-container"></Container>
      <hr></hr>
      <Container className="empty-container"></Container>
      <Row className="mt-2">
        <Col md={12}>
          <Form.Group controlId="note" className="mb-5 mt-2">
            <Form.Label className="label">Notes, Reminders, Remarks, and Other Details</Form.Label>
            <ReactQuill
              theme="snow"
              value={tourGuideFormData.note || ""}
              onChange={(value) => handleChange(value, "note")} // Pass value and field name
              required
              style={{ height: '300px' }}
            />
          </Form.Group>
        </Col>
      </Row>
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
            Submit Tour Guide
          </Button>
        </Container>
      </Row>

      <Container className="empty-container"></Container>

    </Form>


  );
}