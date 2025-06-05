import React, { useEffect, useState  } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Container, Row, Col, Card, Button, Image, Badge, Toast, ToastContainer, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus, faShareAlt, faStar, faGlobe, faMapMarkerAlt, faCopy, faX, faWalking } from "@fortawesome/free-solid-svg-icons";
import ImageModal from "../components/imageview/ImageViewComponent";
import FooterCustomized from "../components/footer/Footer";
import facebooklogo from "../assets/images/logos/facebooklogo.png";
import instagramlogo from "../assets/images/logos/instagramlogo.png";
import tiktoklogo from "../assets/images/logos/tiktoklogo.png";
import xtwitterlogo from "../assets/images/logos/xtwitterlogo.png";
import youtubelogo from "../assets/images/logos/youtubelogo.png";
import tripadvisorlogo from "../assets/images/logos/tripadvisorlogo.png";
import googlemaplogo from "../assets/images/logos/googlemaplogo.png";
import DOTlogo from "../assets/images/DepartmentOfTourismAccreditationLogo.png";

import {
  faWheelchair,
  faDog,
  faUserClock,
  faChild,
  faMosque,
  faTransgender,
  faWallet,
  faLeaf,
  faHandHoldingMedical,
  faPersonPregnant,
} from "@fortawesome/free-solid-svg-icons";
import { faWifi, faShower, faTv, faSnowflake, faCoffee, faTaxi, faLuggageCart, faUtensils, faCar, faGolfBall, faConciergeBell, faTshirt, faBed } from '@fortawesome/free-solid-svg-icons';
import { faUser, faCameraRetro, faDumbbell, faSpa, faSwimmingPool, faUmbrellaBeach, faGlassMartiniAlt, faCocktail, faGamepad, faGavel, faBusinessTime, faMusic, faMountain } from '@fortawesome/free-solid-svg-icons';
import { faRoad, faTree, faWater } from '@fortawesome/free-solid-svg-icons'; // Example icons
import { FacebookShareButton, TwitterShareButton } from 'react-share';

import { useNavigate } from "react-router-dom";

const ItemViewComponent = () => {

  const [expanded, setExpanded] = useState(false);
  const toggleShareOptions = () => setExpanded(!expanded);

  const navigate = useNavigate();

  const { collectionName, dataId } = useParams();

  const [showModal, setShowModal] = useState(false);
  // Body image modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const openImageModal = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage('');
  };

  const [modalIndex, setModalIndex] = useState(0);
  const [data, setData] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const handleImageClick = (index) => {
    setModalIndex(index);
    setShowModal(true);
  };

  const handlePrev = () => {
    setModalIndex((prev) => (prev === 0 ? data.images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setModalIndex((prev) => (prev === data.images.length - 1 ? 0 : prev + 1));
  };

  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  useEffect(() => {
    const fetchAccommodation = async () => {
      const docRef = doc(db, collectionName, dataId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    };
    fetchAccommodation();
    console.log(data);


  }, [collectionName, dataId]);

  if (!data) return <p>Loading...</p>;

  const {
    logo, name, headerImage, accreditation, ratings, established, lowest, inclusivity,
    slogan, description, roomtypes, facilities, amenities, awards, images, website, geo, note, memberships,
    address, socials, category, subcategory, classification, link, body, thingsToDo, serviceProviders, email,
    operatinghours, accessibility, tags, maxPax, howToGetThere, nationality, nationalityType, height, weight, birthday, sex, language, designation
  } = data;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);  // Hide after 2 seconds
  };


  const inclusivityIcons = {
    "PWD-friendly": faWheelchair,
    "Pet-friendly": faDog,
    "Senior Citizen Friendly": faUserClock,
    "Kid-friendly": faChild,
    "Muslim-friendly": faMosque,
    "Gender-friendly": faTransgender,
    "Budget-friendly": faWallet,
    "Vegan-friendly": faLeaf,
    "Allergen-friendly": faHandHoldingMedical,
    "Pregnant-friendly": faPersonPregnant,
  };

  const amenitiesIcons = {
    'Housekeeping Service': faConciergeBell,
    'Wi-Fi Internet Access': faWifi,
    'Toiletries': faShower,
    'Smart TV & Entertainment': faTv,
    'Air Conditioning': faSnowflake,
    'Minibar & Coffee Maker': faCoffee,
    'Bathrobe & Slippers': faTshirt,
    'In-Room Safe': faBed,
    'Airport Transfers': faTaxi,
    'Shuttle Services': faCar,
    'Pet-Friendly Services': faDog,
    'IT Assistance': faLuggageCart,
    'Complimentary Breakfast': faUtensils,
    'Laundry Services': faTshirt,
    '24/7 Security Guard': faLuggageCart,
    'Golf Course Access': faGolfBall,
    'Room Service': faConciergeBell
  };

  const facilitiesIcons = {
    'Reception & Concierge Desk': faConciergeBell,
    'Parking Area': faCar,
    'CCTV Protected': faCameraRetro,
    'Indoor Dining': faUtensils,
    'Basic Fitness Center': faDumbbell,
    'Spa & Wellness Center': faSpa,
    'Swimming Pool': faSwimmingPool,
    'Sky Deck Pool': faSwimmingPool,
    'Pool Bar': faGlassMartiniAlt,
    'Baggage Storage': faLuggageCart,
    'Rooftop Bar / Lounge': faCocktail,
    'Game Room & Entertainment Areas': faGamepad,
    'Playgrounds & Kids’ Areas': faChild,
    'Private Beach Access': faUmbrellaBeach,
    'Banquet & Event Halls': faGavel,
    'Business & Conference Rooms': faBusinessTime,
    'Indoor Cafe': faCoffee,
    'Function Hall': faMusic,
    'Karaoke Room': faMusic,
    'View Deck': faMountain
  };

  const accessibilityIcons = {
    'Beachfront': faUmbrellaBeach,
    'Beside Main/Commercial Road': faRoad,
    'Beside Access Road': faRoad,
    'Private Road': faRoad,
    'Coastal Area': faWater,
    'Riverside': faWater,
    'Hillside (With Road Access)': faMountain,
    'Forest Area (Trail Walk)': faTree,
    'Forest Area (With Community Guide)': faTree,
    'Walking Distant to Beach': faWalking,

  };



  const roomTypeDetails = {
    'Single': { icon: faUser, capacity: 1 },
    'Standard Room': { icon: faUser, capacity: 1 },
    'Standard Double': { icon: faUser, capacity: 2 }, // 2 person icons for double rooms
    'Standard Twin Room': { icon: faUser, capacity: 2 }, // 2 person icons for twin rooms
    'Deluxe Room': { icon: faUser, capacity: 1 },
    'Deluxe Double Room': { icon: faUser, capacity: 2 }, // 2 person icons for double rooms
    'Deluxe Triple Room': { icon: faUser, capacity: 3 }, // 3 person icons for triple rooms
    'Deluxe Family Room': { icon: faUser, capacity: 4 }, // 4 person icons for family rooms
    'Studio Room or Apartment': { icon: faUser, capacity: 1 },
    'Apartelle': { icon: faUser, capacity: 1 },
    'Suite Room': { icon: faUser, capacity: 2 }, // 2 person icons for suites
    'Penthouse Suite': { icon: faUser, capacity: 2 }, // 2 person icons for suites
    'Ambassador Suite': { icon: faUser, capacity: 2 }, // 2 person icons for suites
    'Mandarin Grand Suite': { icon: faUser, capacity: 2 }, // 2 person icons for suites
    'Junior Suite': { icon: faUser, capacity: 1 },
    'Executive Suite': { icon: faUser, capacity: 2 }, // 2 person icons for suites
    'Loft Suite': { icon: faUser, capacity: 1 },
    'Presidential Suite': { icon: faUser, capacity: 2 }, // 2 person icons for suites
    'Luxury Room': { icon: faUser, capacity: 1 },
    'Superior Room': { icon: faUser, capacity: 1 },
    'Premier Room': { icon: faUser, capacity: 1 },
    'Honeymoon Room': { icon: faUser, capacity: 1 },
    'Family Room': { icon: faUser, capacity: 4 }, // 4 person icons for family rooms
    'Bunk Bed': { icon: faUser, capacity: 2 }, // 2 person icons for bunk beds
    "Bachelor's Pad": { icon: faUser, capacity: 1 },
    'Villa': { icon: faUser, capacity: 4 }, // 4 person icons for villas
    'Triple Room': { icon: faUser, capacity: 3 }, // 3 person icons for triple rooms
    'Quad Room': { icon: faUser, capacity: 4 }, // 4 person icons for quad rooms
    'Queen Bed': { icon: faUser, capacity: 1 },
    'King Bed': { icon: faUser, capacity: 2 },
    'Connecting Room': { icon: faUser, capacity: 2 }, // 2 person icons for connecting rooms
    'Cabana': { icon: faUser, capacity: 1 }
  };


  // Helper function to capitalize the first letter of each word
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };


  const isVideoUrl = (url) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
  const isImageUrl = (url) => !isVideoUrl(url);

  const calculateAge = (birthday) => {
    if (!birthday) return 'N/A';
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };


  return (
    <Container className="my-4">
      <Row className="align-items-center justify-content-center pt-5">

        <Col md={9}>
          <Row>
            <Col md={12}>
              <a
                className="p-decoration-none d-block mb-5"
                style={{ cursor: "pointer", color: "grey" }}
              >
                <span
                  onClick={() => navigate(`/home`)}
                  style={{ color: "grey", marginRight: "5px", fontSize: "0.90rem" }}
                >
                  home
                </span>

                <span
                  onClick={() => navigate(`/enterprises/${collectionName}`)}
                  style={{ color: "grey", margin: "0 5px", fontSize: "0.90rem" }}
                >
                  / {collectionName}
                </span>

                <span style={{ color: "grey", marginLeft: "5px", fontSize: "0.90rem" }}>/ {name}</span>
              </a>

            </Col>
          </Row>
          <Row>
            {/* LEFT COL */}
            <Col md={8}>
              <div className="d-flex">
                {collectionName !== 'tourguides' && logo && (
                  <div className="me-3 d-flex align-items-end">
                    <img
                      src={logo}
                      alt="Logo"
                      style={{
                        maxWidth: '100%',
                        height: '50px',
                        borderRadius: '10px',
                      }}
                    />
                  </div>
                )}


                <div className="d-flex flex-column justify-content-end">
                  <h2 className="mb-0"><strong>{name}</strong></h2>

                  {collectionName === 'tourguides' && classification && (
                    <p className="mb-4" style={{ fontSize: "0.90rem" }}>
                      • {Array.isArray(classification)
                        ? classification.map(item => capitalizeFirstLetter(item)).join(", ")
                        : capitalizeFirstLetter(classification)}
                    </p>
                  )}
                </div>



              </div>





              {collectionName !== 'tourguides' && (
  <div className="d-flex justify-content-start p-start">
    <div className="d-none d-lg-flex">
      {category && (
        <div className="me-3">
          <p style={{ fontSize: "0.90rem" }}>
            • {Array.isArray(category)
              ? category.map(item => capitalizeFirstLetter(item)).join(", ")
              : capitalizeFirstLetter(category)}
          </p>
        </div>
      )}
      {subcategory && (
        <div className="me-3">
          <p style={{ fontSize: "0.90rem" }}>
            • {Array.isArray(subcategory)
              ? subcategory.map(item => capitalizeFirstLetter(item)).join(", ")
              : capitalizeFirstLetter(subcategory)}
          </p>
        </div>
      )}
    </div>

    {classification && (
      <div className="mt-2">
        <p style={{ fontSize: "0.90rem" }}>
          • {Array.isArray(classification)
            ? classification.map(item => capitalizeFirstLetter(item)).join(", ")
            : capitalizeFirstLetter(classification)}
        </p>
      </div>
    )}
  </div>
)}





              {headerImage && (
                <Card className="mb-3">
                  <Card.Img src={headerImage} alt="Header" />
                </Card>
              )}
              {/* accreditation and ratings */}
              {(accreditation || ratings) && (
                <div className="mb-4">
                  <div className="row">
                    {/* Accreditation */}
                    {accreditation && (
                      <div className="col-12 col-md-6  p-0 m-0">
                        <div>
                          Department of Tourism (DOT) Accreditation No.
                          <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                            <img
                              src={DOTlogo}
                              alt="DOT Logo"
                              style={{ height: "16px", marginRight: "6px" }}
                            />
                            {accreditation}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ratings */}
                    {ratings && (
                      <div className="col-12 col-md-6 p-md-end  p-0 m-0">
                        <span className="p-warning">
                          {ratings}{" "}
                          {[...Array(Math.floor(ratings))].map((_, i) => (
                            <FontAwesomeIcon key={i} icon={faStar} />
                          ))}
                        </span>
                        <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                          DOT ratings
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}


              {/* rates and establishment */}
              {(lowest || established) && (
                <div className="mb-4 mt-4">
                  <div className="row">
                    {lowest && (
                      <div className="col-12 col-md-6  p-0 m-0">
                        {(Array.isArray(lowest) ? lowest[0] : lowest) !== 0 &&
                          (Array.isArray(lowest) ? lowest[0] : lowest) !== "0" &&
                          (Array.isArray(lowest) ? lowest[0] : lowest) !== null &&
                          (Array.isArray(lowest) ? lowest[0] : lowest) !== "" &&
                          !isNaN(Array.isArray(lowest) ? lowest[0] : lowest) ? (
                          <div className="p-start">
                            <span>
                              Lowest Rate from{" "}
                              <strong className="fs-4">
                                Php{" "}
                                {new Intl.NumberFormat("en-PH", {
                                  style: "decimal",
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }).format(Array.isArray(lowest) ? lowest[0] : lowest)}
                              </strong>
                            </span>
                            <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                              Lowest rate may change without prior notice.
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {established && (
                      <div className="col-12 col-md-6 p-md-end  p-0 m-0 p-end">
                        <span>
                          Operating since{" "}
                          <strong className="fs-4">{established}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {inclusivity?.length > 0 && (
                <div
                  className="mb-4 mt-4"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "0.75rem",
                  }}
                >
                  {inclusivity.map((item, index) => {
                    const icon = inclusivityIcons[item];
                    return (
                      <div
                        key={index}
                        className="d-flex align-items-center px-2 py-1 rounded"
                      >
                        {icon && (
                          <FontAwesomeIcon
                            icon={icon}
                            className="me-2"
                            style={{ color: "#1F89B2" }}
                          />
                        )}
                        <span>{item}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* body */}
              {collectionName === "tourguides" && body && body.length > 0 && (
                <h5 className="mb-3 mt-4"><strong>About</strong></h5>
              )}
              {body && body.length > 0 && body.map((section, index) => (




                <Row className="mb-5 row" key={index}>
                  {isVideoUrl(section.image) ? (
                    <Col md={12} className="col">
                      <h5 className="mt-4">
                        {section.subtitle}
                      </h5>
                      <video controls fluid className="article-body-video mt-2 mb-4">
                        <source src={section.image} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      {section.image_source && (
                        <small className="p-break d-inline-block p-muted d-block mt-1">Source: {section.image_source}</small>
                      )}
                      <div
                        className="section-body p-break d-inline-block"
                        dangerouslySetInnerHTML={{ __html: section.body }}
                      />
                    </Col>
                  ) : section.image && section.body ? (
                    <>
                      <Col md={12} className="col">
                        <h5>
                          {section.subtitle}
                        </h5>
                        <Image
                          src={section.image}
                          alt="Section"
                          fluid
                          rounded
                          className="article-body-image mt-2 mb-4"
                          onClick={() => openImageModal(section.image)} // Open modal on click
                        />
                        {section.image_source && (
                          <small className="p-break d-inline-block p-muted d-block mt-1 mb-4">Source: {section.image_source}</small>
                        )}
                      </Col>
                      <div
                        className="section-body mx-0 px-0 p-break d-inline-block"
                        dangerouslySetInnerHTML={{ __html: section.body }}
                      />
                    </>
                  ) : section.image ? (
                    <Col md={12} className="col">
                      <h5>
                        {section.subtitle}
                      </h5>
                      <Image
                        src={section.image}
                        alt="Section"
                        fluid
                        rounded
                        className="article-body-image mt-1"
                        onClick={() => openImageModal(section.image)} // Open modal on click
                      />
                      {section.image_source && (
                        <small className="p-break d-inline-block p-muted d-block mt-1 mb-1">Source: {section.image_source}</small>
                      )}
                    </Col>
                  ) : section.body ? (
                    <Col md={12} className="col">
                      <h5>
                        {section.subtitle}
                      </h5>
                      <div
                        className="section-body p-break d-inline-block"
                        dangerouslySetInnerHTML={{ __html: section.body }}
                      />
                    </Col>
                  ) : null}
                </Row>

              ))}

              {howToGetThere && (
                <div className="mb-5">
                  <h5 className="mb-1"><strong>How To Get There?</strong></h5>
                  <div
                    className="section-body"
                    dangerouslySetInnerHTML={{ __html: howToGetThere }}
                  />
                </div>
              )}
              <div className="row justify-content-between">
                {accessibility && (
                  <div className="col-12 col-md-6 mb-5  p-0 m-0">
                    <h5><strong>Accessibility</strong></h5>
                    <div className="d-flex align-items-center px-2 py-1 rounded">
                      {accessibilityIcons[accessibility] && (
                        <FontAwesomeIcon
                          icon={accessibilityIcons[accessibility]}
                          style={{ color: "#1F89B2", verticalAlign: 'middle' }}
                          className="me-2"
                        />
                      )}
                      <p className="mb-0">{accessibility}</p>
                    </div>
                  </div>
                )}

                {operatinghours?.length > 0 && (
                  <div className="col-12 col-md-6 mb-5 p-md-end  p-0 m-0">
                    <h5><strong>Operating Hours</strong></h5>
                    <div className="mb-2" style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                      May change without prior notice.
                    </div>

                    {operatinghours.map((item, index) => (
                      <p className="p-md-end" key={index}><strong>{item.charAt(0).toUpperCase() + item.slice(1)}</strong></p>
                    ))}

                  </div>
                )}
              </div>








              {description && description.trim() !== "" && description.trim() !== "<p><br></p>" && (
                <div>

                  {collectionName !== "tourguides" && (
                    <h5 className="mb-3 mt-4"><strong>About</strong></h5>
                  )}                  {slogan && <h5>“{slogan}”</h5>}
                  <div className="section-body mb-4" dangerouslySetInnerHTML={{ __html: description }} />
                </div>
              )}

              {roomtypes && facilities.length > 0 && (
                <div className="mb-5">
                  <h5 className="mb-1"><strong>Room Types</strong></h5>
                  <div className="mb-2" style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                    Room types, capacity, and policies may vary.
                  </div>
                  <div
                    className="mb-4 mt-4"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    {roomtypes.map((item, index) => {
                      const { icon, capacity } = roomTypeDetails[item] || {};
                      return (
                        <div
                          key={index}
                          className="d-flex align-items-center px-2 py-1 rounded"
                        >
                          {icon && (
                            <>
                              {[...Array(capacity)].map((_, i) => (
                                <FontAwesomeIcon
                                  key={i}
                                  icon={icon}
                                  className="me-2"
                                  style={{ color: "#1F89B2" }}
                                />
                              ))}
                            </>
                          )}
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}



              {facilities && facilities.length > 0 && (
                <div className="mb-5">
                  <h5 className="mb-1"><strong>Facilities</strong></h5>
                  <div className="mb-2" style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                    Facilities may vary.
                  </div>
                  <div
                    className="mb-4 mt-4"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    {facilities.map((item, index) => {
                      const icon = facilitiesIcons[item];
                      return (
                        <div
                          key={index}
                          className="d-flex align-items-center px-2 py-1 rounded"
                        >
                          {icon && (
                            <FontAwesomeIcon
                              icon={icon}
                              className="me-2"
                              style={{ color: "#1F89B2" }}
                            />
                          )}
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {amenities && amenities.length > 0 && (
                <div className="mb-5">
                  <h5 className="mb-1"><strong>Amenities</strong></h5>
                  <div className="mb-2" style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                    Amenities may vary.
                  </div>
                  <div
                    className="mb-4 mt-4"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    {amenities.map((item, index) => {
                      const icon = amenitiesIcons[item];
                      return (
                        <div
                          key={index}
                          className="d-flex align-items-center px-2 py-1 rounded"
                        >
                          {icon && (
                            <FontAwesomeIcon
                              icon={icon}
                              className="me-2"
                              style={{ color: "#1F89B2" }}
                            />
                          )}
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {awards && awards.length > 0 && (
                <div className="mb-5">
                  <h5 className="mb-1"><strong>Awards, Recognitions, and Certifications</strong></h5>
                  <ul>
                    {awards.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {memberships && memberships.length > 0 && (
                <div className="mb-5">
                  <h5 className="mb-1"><strong>Notable Memberships and Partnerships</strong></h5>
                  <ul>
                    {memberships.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {maxPax && (
                <div className="mb-5">
                  <h5 className="mb-1"><strong>Capacity</strong></h5>
                  <div className="mb-2" style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                    Capacity may vary per unit.
                  </div>
                  <p>Up to<strong> {maxPax}</strong> persons per unit.</p>
                </div>
              )}

              {serviceProviders?.length > 0 && (
                <div className="mb-5">
                  <h5 className="mb-3"><strong>Service Providers</strong></h5>
                  <ul>
                    {serviceProviders.map((item, index) => (
                      <li key={index}>{item.charAt(0).toUpperCase() + item.slice(1)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {thingsToDo?.length > 0 && (
                <div className="mb-5">
                  <h5 className="mb-3"><strong>Things to Do</strong></h5>
                  <ul className="p-sm">
                    {thingsToDo.map((item, index) => (
                      <li key={index}>
                        {item
                          .toLowerCase()
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}


              {typeof note === 'string' &&
                note.trim() !== "" &&
                note.trim() !== "<p><br></p>" && (
                  <div>
                    <h5><strong>Notes, Reminders, and Tips</strong></h5>
                    <div className="section-body mb-4" dangerouslySetInnerHTML={{ __html: note }} />
                  </div>
                )}




              {/* Image Modal with Navigation */}
              <ImageModal
                show={showModal}
                onHide={() => setShowModal(false)}
                images={images}
                modalIndex={modalIndex}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            </Col>
            {/* right column */}
            <Col md={4}>



              {collectionName === 'tourguides' && (



                <div className="mb-4 ">
                  <div className="d-block d-lg-none">
                    <h5 className="mt-4 mb-2"><strong>Profile</strong></h5>
                  </div>
                  {collectionName === 'tourguides' && logo && (
                    <>
                      <div className="mt-5 me-3 mb-4 d-flex align-items-end">
                        <img
                          src={logo}
                          alt="Logo"
                          style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                          }}
                        />
                      </div>
                    </>
                  )}
                  <p className="mt-2">
                    <strong>Full Name</strong>: {name}
                  </p>
                  <p className="mt-2">
                    <strong>Designation</strong>: {designation}
                  </p>
                  {email && (
                    <Row className="d-flex justify-content-between align-items-start mt-2">
                      <Col xs="auto" className="col">
                        <strong>Email</strong>:{' '}
                        <a
                          href={`mailto:${email}`}
                          style={{ textDecoration: 'none', color: 'black' }}
                        >
                          {email}
                        </a>
                      </Col>

                      <Col xs="auto" className="col">
                        <FontAwesomeIcon
                          icon={faCopy}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleCopy(email)}
                          title="Copy email"
                          className="p-muted"
                        />
                      </Col>
                    </Row>
                  )}



                  <p className="mt-2">
                    <strong>Nationality</strong>: ({nationalityType}) {nationality}
                  </p>

                  {accreditation && (
                    <p className="mt-2">
                      <strong>DOT Accreditation</strong>: {accreditation}
                    </p>
                  )}
                  <p className="mt-2">
                    <strong>Address</strong>: <>
                      {address.street && <span> {address.street}</span>}
                      {address.street && (address.barangay || address.town || address.region || address.province || address.country) && <span>, </span>}

                      {address.barangay && <span> {address.barangay}</span>}
                      {address.barangay && (address.town || address.region || address.province || address.country) && <span>, </span>}

                      {address.town && <span> {address.town}</span>}
                      {address.town && (address.region || address.province || address.country) && <span>, </span>}

                      {address.region && <span> {address.region}</span>}
                      {address.region && (address.province || address.country) && <span>, </span>}

                      {address.province && <span> {address.province}</span>}
                      {address.province && address.country && <span>, </span>}

                      {address.country && <span> {address.country}</span>}
                    </>
                  </p>
                  <p className="mt-2">
                    <strong>Sex</strong>: {sex}
                  </p>
                  <p className="mt-2">
                    <strong>Age</strong>: {calculateAge(birthday)} years old
                  </p>
                  {height && (
                    <p className="mt-2">
                      <strong>Height</strong>: {height} m
                    </p>
                  )}
                  {weight && (
                    <p className="mt-2">
                      <strong>Weight</strong>: {weight} kg
                    </p>
                  )}
                  {Array.isArray(language) && language.length > 0 && (
                    <p className="mt-2">
                      <strong>Language</strong>: {language.join(', ')}
                    </p>
                  )}

                </div>
              )}

              {collectionName === "tourguides" && (
                <hr className="mt-5 mb-2"></hr>

              )}
              {website && (
                <>
                  <Row className="d-flex justify-content-between align-items-start mb-4 mt-5">
                    {/* Display logo if it exists */}


                    <Col xs="auto" className="col">
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ pDecoration: 'none', color: 'black' }} // Remove underline and set color to black
                      >
                        {website
                          .replace(/^https?:\/\//, '')  // remove http(s)://
                          .split('/')[0]  // keep only the domain (before any '/')
                        }
                      </a>
                    </Col>

                    <Col xs="auto" className="col">
                      <FontAwesomeIcon
                        icon={faCopy}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleCopy(website)}
                        title="Copy email"
                        className="p-muted"
                      />

                    </Col>
                  </Row>
                  <Button
                    className="mb-2 search-button-light"
                    onClick={() => window.open(website, '_blank')} // Opens the website in a new tab
                  >
                    <FontAwesomeIcon icon={faGlobe} className="me-2" />
                    Visit Official Website
                  </Button>

                </>
              )}



              {collectionName !== 'tourguides' && geo && (
                <p>

                  {/* {geo} Display geo */}
                  {address && (
                    <>
                      <br />
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />{geo},
                      {address.street && <span> {address.street}</span>}
                      {address.street && (address.barangay || address.town || address.region || address.province || address.country) && <span>, </span>}

                      {address.barangay && <span> {address.barangay}</span>}
                      {address.barangay && (address.town || address.region || address.province || address.country) && <span>, </span>}

                      {address.town && <span> {address.town}</span>}
                      {address.town && (address.region || address.province || address.country) && <span>, </span>}

                      {address.region && <span> {address.region}</span>}
                      {address.region && (address.province || address.country) && <span>, </span>}

                      {address.province && <span> {address.province}</span>}
                      {address.province && address.country && <span>, </span>}

                      {address.country && <span> {address.country}</span>}
                    </>
                  )}
                </p>
              )}



              {collectionName !== 'tourguides' && address?.lat && address?.long && (
                <div className="mb-3">
                  <iframe
                    title="map"
                    width="100%"
                    height="250"
                    style={{ border: 0, borderRadius: "10px" }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps?q=${address.lat},${address.long}&hl=es;z=14&output=embed`}
                  />
                </div>
              )}

              {collectionName !== 'tourguides' && (

                <div className="d-grid mb-4 mt-4">
                  <Button
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => window.open(link, '_blank')} // Opens the website in a new tab
                    className="me-2 mb-2 search-button-lighter d-flex align-items-center"
                  >
                    <img src={googlemaplogo} alt={"Google Map"} style={{ height: "20px", marginRight: "8px" }} />
                    View In Google Map
                  </Button>
                  <hr></hr>
                </div>

              )}


              {/* SOCIALS */}
              {socials && socials.length > 0 && (
                <div className="mb-4">
                  <h5><strong >Connect Through Social Media</strong></h5>
                  <p>Follow and keep updated through their social media accounts.</p>
                  {socials?.map((social, i) => {
                    let logo = null;
                    let label = "";

                    if (social.includes("facebook.com")) {
                      logo = facebooklogo;
                      label = "Facebook";
                    } else if (social.includes("instagram.com")) {
                      logo = instagramlogo;
                      label = "Instagram";
                    } else if (social.includes("tripadvisor.com")) {
                      logo = tripadvisorlogo;
                      label = "Tripadvisor";
                    } else if (social.includes("tiktok.com")) {
                      logo = tiktoklogo;
                      label = "TikTok";
                    } else if (social.includes("x.com") || social.includes("twitter.com")) {
                      logo = xtwitterlogo;
                      label = "X / Twitter";
                    } else if (social.includes("youtube.com")) {
                      logo = youtubelogo;
                      label = "YouTube";
                    }

                    if (!logo) return null;

                    return (
                      <Button
                        key={i}
                        href={social}
                        target="_blank"
                        rel="noreferrer"
                        className="me-2 mb-2 search-button-lighter d-flex align-items-center"
                      >
                        <img src={logo} alt={label} style={{ height: "20px", marginRight: "8px" }} />
                        {label}
                      </Button>
                    );
                  })}
                </div>
              )}





              <div className="mb-4 mt-2">
                <h5 className="mt-4"><strong>Share With Other People</strong></h5>
                <p>Share your experiences.</p>
                <Button className={`search-button-light ${expanded ? 'hovered' : ''}`}
                  onClick={toggleShareOptions}>
                  <FontAwesomeIcon icon={faShareAlt} className="me-2" />
                  Share This
                </Button>

                {/* Share options */}
                {expanded && (
                  <div className="mt-3">
                    <div className="row justify-content-center">
                      <div className="col-4 d-flex justify-content-center">
                        <FacebookShareButton url={`infoguideapp/view/${collectionName}/${dataId}`}
                          quote={`${name} shared via Boracay Info Guide App`}
                          picture={headerImage} className="w-100"
                        >
                          <Button variant="outline-primary" className="w-100">
                            <img
                              src={facebooklogo}
                              alt="Facebook"
                              style={{ height: "20px", marginRight: "8px", display: "block", marginLeft: "auto", marginRight: "auto" }}
                            />
                          </Button>
                        </FacebookShareButton>
                      </div>

                      <div className="col-4 d-flex justify-content-center">
                        <TwitterShareButton url={`infoguideapp/view/${collectionName}/${dataId}`}
                          quote={`${name} shared via Boracay Info Guide App`}
                          picture={headerImage} className="w-100"
                        >
                          <Button variant="outline-dark" className="w-100">
                            <img
                              src={xtwitterlogo}
                              alt="Twitter"
                              style={{ height: "20px", marginRight: "8px", display: "block", marginLeft: "auto", marginRight: "auto" }}
                            />
                          </Button>
                        </TwitterShareButton>
                      </div>

                      <div className="col-4 d-flex justify-content-center">
                        <a
                          href={`https://www.instagram.com/create/story/?url=${encodeURIComponent(`infoguideapp/view/${collectionName}/${dataId}`)}`}
                          target="_blank"
                          rel="noopener noreferrer" className="w-100"
                        >
                          <Button style={{ borderColor: "#800080", color: "#800080" }} variant="outline-dark" className="w-100">
                            <img
                              src={instagramlogo} // Add your Instagram logo here
                              alt="Instagram"
                              style={{ height: "20px", marginRight: "8px", display: "block", marginLeft: "auto", marginRight: "auto" }}
                            />
                          </Button>
                        </a>
                      </div>


                    </div>
                  </div>
                )}


              </div>

              <div className="mb-4 mt-2">
                <h5 className="mt-4"><strong>Practice Effective Planning</strong></h5>
                <p>Add this to your itinerary.</p>
                <Button className="mb-2 search-button-light" >
                  <FontAwesomeIcon icon={faCalendarPlus} className="me-2" />
                  Add to Calendar
                </Button>
              </div>


              {images?.length > 0 && (
                <div className="d-block d-md-none mt-5">
                  <h5 className="mb-4"><strong>Gallery</strong></h5>
                  <Row>
                    {images.map((img, i) => (
                      <Col xs={6} md={4} key={i} className="mb-4 article-gallery-col">
                        <Image
                          src={img}
                          fluid
                          rounded
                          className="article-gallery"
                          onClick={() => handleImageClick(i)}
                          style={{ cursor: 'pointer' }}
                          thumbnail
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}




              {tags && tags.length > 0 && (

                <div>
                  <h5 className="mt-5"><strong >Tags</strong></h5>
                  <p style={{ fontSize: "0.90rem" }}>{tags.map(tag => tag.toLowerCase()).join(', ')}</p>
                </div>
              )}


            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {images?.length > 0 && (
                <div className="d-none d-md-block mt-5">
                  <h5 className="mb-4"><strong>Gallery</strong></h5>
                  <Row>
                    {images.map((img, i) => (
                      <Col xs={6} md={3} key={i} className="mb-3 px-2 article-gallery-col">
                        <Image
                          src={img}
                          fluid
                          rounded
                          className="article-gallery"
                          onClick={() => handleImageClick(i)}
                          style={{ cursor: 'pointer' }}
                          thumbnail
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Col>
          </Row>


          {/* Toast Notification */}
          <ToastContainer position="bottom-end" className="p-3">
            <Toast
              bg="primary"  // Blue background
              show={showToast}
              onClose={() => setShowToast(false)}
              delay={2000}
              autohide
            >
              <Toast.Body className="p-white">Link copied to clipboard!</Toast.Body>
            </Toast>
          </ToastContainer>

          {/* Full Image Modal for Body Image */}
          <Modal show={showImageModal} onHide={closeImageModal} centered size="lg">
            <Modal.Body className="gallery-modal d-flex justify-content-center align-items-center">
              {imageLoading && (
                <div className="spinner-border p-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}

              <Image
                src={selectedImage}
                alt="Full View"
                fluid
                onLoad={handleImageLoad}
                style={{ display: imageLoading ? 'none' : 'block' }}
              />
            </Modal.Body>
          </Modal>

          {/* Header Image with Gaussian Blur Background */}


          <FooterCustomized />
        </Col>
      </Row>

    </Container>

  );
};

export default ItemViewComponent;
