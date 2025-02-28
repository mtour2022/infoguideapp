import React, { useState } from "react";
import { Container, Row, Col, Form, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import AddressInput from './Address';
import MapWidgetFormGroup from "./MapLocator"; // Adjust the import path as needed
import HeaderImageDropzone from './HeaderImageDropzone';
import LogoImageDropzone from "./LogoImageDrop";
import SelectionFieldWidget from "./SelectionField";
import TextGroupInputField from "./TextGroupInputField";

export default function AccommodationForm({category, subcategory}) {
  const [accommodationFormData, setAccommodationFormData] = useState({
    id: "",
    name: "",
    category: "",
    subcategory: "",
    classification: "",
    accreditation: "",
    ratings: "",
    established: "",
    lowest: "",
    assets: [],
    slogan: "",
    description: "",
    facilities: [],
    amenities: [],
    awards: [],
    images: [],
    roomtypes: [],
    operatinghours: "",
    inclusivity:[],
    accessibility:[],
    logo: "",
    headerImage: "",
    website: "",
    address: { street: "", barangay: "",  town: "", region: "", province: "", country: "", lat: "", long: ""},
    geo: "",
    maplink: "",
    socials: { facebook: "", instagram: "", tiktok: "", youtube: "" },
    memberships: [],
    note: [],
  });

  const availableRoomTypes = ['Single', 'Standard Double', 'Standard Twin Room', 'Deluxe Double Room', 'Studio Room or Apartment', 'Junior Suite', 'Executive Suite', 'Presidential Suite', 'Bunk Bed', 'Villa', 'Triple Room', 'Quad Room', 'Connecting Room', 'Cabana'];

  const geoOptions = [
    "Boracay Island",
    "Mainland Malay",
    "Nearby Town"
  ]
  
  const categoryOptions = [
    "Hospitality & Lodging",
    "Food & Beverages",
    "Tourism & Leisure",
    "Health & Wellness",
    "Transport & Parking",
    "Medical Facilities",
  ];



  const subcategoriesOptions = {
    "Hospitality & Lodging": [
      "Accommodation Establishments",
      "Recreational Resort",
    ],
    "Food & Beverages": [
      "Restaurants",
      "Bars & Party Clubs",
      "Café & Coworking",
    ],
    "Tourism & Leisure": [
      "Tour Guides",
      "Travel & Tour Operators",
      "Tourist Activity Providers",
      "M.I.C.E. Facilities",
      "Events Planning Companies",
      "Tourist & Specialty Shops",
    ],
    "Health & Wellness": [
        "Spa & Wellness Centres", "Gymns & Fitness Clubs"],
    "Transport & Parking": [
      "Tourist Land Transport Operators",
      "Tourist Air Transport Operators",
      "Passenger Ship Lines",
      "Parking Spaces",
    ],
    "Healthcare Facilities": [
      "Hospitals & Clinics",
      "Veterinary Clinics",
      "Dental Clinics",
    ],
  };

  const classificationOptions= {
    "Accommodation Establishments": [ "Resort", "Hotel", "Mabuhay Accommodation", "Apartment Hotel/Apartel"],
    "Recreational Resort": ["Mainland Activity Resort"],
    "Restaurants": [ "Fine Dining", "Buffet", "Casual Dining", "Pop-up", "Fast Foood", "Bistro", "Pub"],
    "Bars & Party Clubs": ["Cocktail Bar", "Live Music Bar", "Lounges", "Sports Bar", "Entertainment Bars", "Dance Clubs", "Rooftop Clubs"],
    "Café & Coworking": ["Classic Café", "Breakfast Café", "Coworking Café", "Brunch Café", "Pub Café", "Open Coworking Space"],
    "Tour Guides": ["Local Tour Guide", "Regional Tour Guide", "Community Guide", "Eco Guide"],
    "Travel & Tour Operators": ["Local", "Foreign"],
    "Tourist Activity Providers": ["Water Activity Provider", "Aqua Sports Provider", "Land Activity Provider", "Aerial Activity Provider", "Food & Beverage Provider", "Transport Provider", ],
    "M.I.C.E. Facilities": ["Convention Center", "Conference Rooms", "Meeting Rooms", "Ballrooms, Exhibition Halls"],
    "Events Planning Companies": ["Wedding Planner", "Corporate Event Planner", "Conference Planner"],
    "Tourist & Specialty Shops": ["Souvenir Shop", "Gift Shop", "Local Market", "Wet Market", "Tattoo Shop"],
    "Spa & Wellness Centres": ["Spa Treatments", "Massage Salon"],
    "Gymns & Fitness Clubs": ["Commercial Gymn", "Boxing Club", "Ballet Club", "Dance Studio", "Yoga Studio"],
    "Tourist Land Transport Operators": ["Shuttle Service", "Car/Van Rental", "Tour Bus Company", "Airport Transfer Service", "Taxi Operator"],
    "Tourist Air Transport Operators": ["Airline Service", "Helicopter Service"],
    "Passenger Ship Lines": ["Ferry Service", "Ocean Liner"],
    "Parking Spaces": ["Parkling Lot"],
    "Hospitals & Clinics": ["General Hospital", "Retail Clinic", "Heath-care Center"],
    "Veterinary Clinics": ["Animal Practice", "General Veterinaryc Care"],
    "Dental Clinics": ["General Dentistry", "Pediatric Destistry", "Cosmetic Dentistry", "Orthodontics"],
    }

    // Local state for selections
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedClassification, setSelectedClassification] = useState("");

  // Generic change handler for form fields.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccommodationFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle category change and reset subcategory.
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setAccommodationFormData((prev) => ({
      ...prev,
      category: value,
      subcategory: "",
    }));
  };

  // Callback to update the address object with the selected lat/long.
  const handleLocationSelect = (position) => {
    setAccommodationFormData((prev) => ({
      ...prev,
      address: { ...prev.address, lat: position.lat, long: position.lng },
    }));
  };

  

  // When submitting, upload the data to Firebase Firestore.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(
        collection(db, "enterprises"),
        accommodationFormData
      );
      console.log("Document written with ID: ", docRef.id);
      Swal.fire("Success", "Enterprise added successfully!", "success");
      // Optionally reset your form here if needed.
    } catch (error) {
      console.error("Error adding document: ", error);
      Swal.fire("Error", "There was an error uploading the enterprise.", "error");
    }
  };

  return (
    
      <Form className="custom-form body-container" onSubmit={handleSubmit}>
        <Row className="row mb-4">
            <Col md={6}>
                <Form.Group controlId="formCategory" className="mb-3">
                    <Form.Label className="label">Category</Form.Label>
                    <Form.Select
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedSubcategory("");
                        setSelectedClassification("");
                    }}
                    >
                    <option value="">Select Category</option>
                    {categoryOptions.map((category, index) => (
                        <option key={index} value={category}>
                        {category}
                        </option>
                    ))}
                    </Form.Select>
                </Form.Group>
            </Col>
            <Col md={6}>
            {selectedCategory && subcategoriesOptions[selectedCategory] && (
                    <Form.Group controlId="formSubcategory" className="mb-3">
                    <Form.Label className="label">Subcategory</Form.Label>
                    <Form.Select
                        value={selectedSubcategory}
                        onChange={(e) => {
                        setSelectedSubcategory(e.target.value);
                        setSelectedClassification("");
                        }}
                    >
                        <option value="">Select Subcategory</option>
                        {subcategoriesOptions[selectedCategory].map((subcat, index) => (
                        <option key={index} value={subcat}>
                            {subcat}
                        </option>
                        ))}
                    </Form.Select>
                    </Form.Group>
                )}
            {selectedSubcategory && classificationOptions[selectedSubcategory] && (
            <Form.Group controlId="formClassification" className="mb-3">
            <Form.Label className="label">Classification</Form.Label>
            <Form.Select
                value={selectedClassification}
                onChange={(e) => setSelectedClassification(e.target.value)}
            >
                <option value="">Select Classification</option>
                {classificationOptions[selectedSubcategory].map(
                (classification, index) => (
                    <option key={index} value={classification}>
                    {classification}
                    </option>
                )
                )}
            </Form.Select>
            </Form.Group>
            )}
            </Col>
        </Row >
        <hr></hr>
        <h1 className="title my-4">Business Details</h1>
        <Row className="mt-2" > 
          <Col md={9}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label className="label">Business Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter business name"
                name="name"
                value={accommodationFormData.name}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="established" className="mb-3">
                <Form.Label className="label">Year Established</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="e.g.: 2000"
                    name="established"
                    value={accommodationFormData.established}
                    onChange={handleChange}
                />
                </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <AddressInput groupData={accommodationFormData} setGroupData={setAccommodationFormData}></AddressInput>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <MapWidgetFormGroup onLocationSelect={handleLocationSelect} />
          </Col>
        </Row>
        <Row>
            <Col md={6}>
                <Form.Group controlId="lat" className="mb-3">
                <Form.Label className="label">Lattitude</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Select Location First"
                    name="lat"
                    value={accommodationFormData.address.lat}
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
                    value={accommodationFormData.address.long}
                    onChange={handleChange}
                    readOnly
                />
                </Form.Group>
            </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="accreditation" className="mb-3">
              <Form.Label className="label">DOT Accreditation No.</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter accreditation (Optional)"
                name="accreditation"
                value={accommodationFormData.accreditation}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="ratings" className="mb-3">
              <Form.Label className="label">DOT Rating</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ratings (Optional)"
                name="ratings"
                value={accommodationFormData.ratings}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <hr></hr>
        <h1 className="title my-4">Business Presentation</h1>
        <Row>
          <Col md={6}>
          <Form.Group controlId="slogan" className="mb-3">
            <Form.Label className="label">Slogan</Form.Label>
            <Form.Control
                as="textarea"
                placeholder="Enter slogan"
                name="slogan"
                value={accommodationFormData.slogan}
                onChange={handleChange}
                rows={8} // Adjust number of rows as needed
            />
            </Form.Group>
          </Col>
          <Col  md={6}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label className="label">Logo</Form.Label>
                    <LogoImageDropzone
                    storyForm={accommodationFormData}
                    setStoryForm={setAccommodationFormData}
                    dropzoneName="dropzone-container-small"
                    previewName="dropzone-uploaded-image-small"
                    />
            </Form.Group>
            </Col>
        </Row>
        <Row className="mt-2">
            <Col  md={12}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label className="label">Cover Photo</Form.Label>
              <HeaderImageDropzone
                    storyForm={accommodationFormData}
                    setStoryForm={setAccommodationFormData}
                    dropzoneName="dropzone-container-big"
                    previewName="dropzone-uploaded-image-big"
                    />
            </Form.Group>
            </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Group controlId="description" className="mb-5 mt-2">
                <Form.Label className="label">Brief Description</Form.Label>
                    <ReactQuill
                          theme="snow"
                          value={accommodationFormData.description}
                          onChange={handleChange}
                          style={{ height: '300px'}}  // adjust height as needed
                    />
                </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={12}>
            <Form.Group controlId="lowest" className="mb-3">
              <Form.Label className="label">Lowest Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Lowest Price"
                name="lowest"
                value={accommodationFormData.lowest}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <SelectionFieldWidget
              onChange={(updatedField) =>
                setAccommodationFormData((prev) => ({ ...prev, roomtypes: updatedField.roomtypes }))
              }
              options={availableRoomTypes}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
          <TextGroupInputField
              label="Organizational Membershps"
              onChange={(updatedField) =>
                setAccommodationFormData((prev) => ({ ...prev, memberships: updatedField.memberships }))
              }
            />

          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <TextGroupInputField
              onChange={(updatedField) =>
                setAccommodationFormData((prev) => ({ ...prev, awards: updatedField.awards }))
              }
              label={"Awards & Recognitions"}
            />
          </Col>
        </Row>
        
        <hr></hr>
        
        
        <Row>
          <Col md={12}>
            <Form.Group controlId="maplink" className="mb-3">
              <Form.Label className="label">Map Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter map link"
                name="maplink"
                value={accommodationFormData.maplink}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="website" className="mb-3">
              <Form.Label className="label">Website</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter website URL"
                name="website"
                value={accommodationFormData.website}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={12}>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>

  );
}
