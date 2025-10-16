import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faFacebookMessenger,
  faFacebookSquare,
  faInstagram,
  faLinkedinIn,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

import worldtravellogo from "../../assets/boracay_award_6.png";
import condenastlogo from "../../assets/boracay_award_3.png";
import travelleisurelogo from "../../assets/boracay_award_5.png";
import philawardlogo from "../../assets/boracay_award_7.png";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const FooterCustomized = ({ scrollToId = "page-top" }) => {
  const position = { lat: 11.968365518006667, lng: 121.91986877595986 };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB12zV70G4pEPERWnWPiC69_BZhw_5Af9k", // Replace with your actual API key
  });

  const handleScroll = () => {
    const el = document.getElementById(scrollToId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      className="footer-component"
      style={{
        backgroundColor: "#fff",
        color: "#000",
        // borderTop: "1px solid #e0e0e0",
      }}
    >
      <Container>
        {/* Scroll to Top */}
        <Row>
          <Col md={12}>
            <hr className="border-gray" />
            <div
              className="text-center mb-2"
              onClick={handleScroll}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faArrowUp} className="me-2" />
              <small style={{ fontWeight: 300 }}>Return to top</small>
            </div>
            <hr className="border-gray" />
          </Col>
        </Row>

        {/* Main Footer Content */}
        <Row className="gy-4 px-2 px-md-4">
          {/* MAP SECTION */}
          <Col lg={6} md={12} sm={12}>
            <Row>
              {/* LOCATION SECTION (appears first on small screens) */}
              <Col
                md={6}
                sm={12}
                className="order-1 order-md-2 text-center text-md-start d-flex flex-column align-items-center align-items-md-start"
              >
                <div className="px-1 px-md-3 px-lg-5"

                  style={{ lineHeight: "1.8", fontWeight: 300, maxWidth: "600px" }}
                >
                  <h5
                    className="fw-semibold text-uppercase mb-3"
                    style={{
                      color: "#1b1b1bff",
                      letterSpacing: "1px",
                      fontWeight: 600,
                    }}
                  >
                    Office Address
                  </h5>
                  <p className="mb-2" style={{ fontWeight: 300 }}>
                    <strong>Boracay Office</strong>: 2nd Floor, Municipal Tourism Office,
                    Municipal Hall - Boracay Annex, Brgy. Balabag, Malay, Aklan 5608,
                    Philippines
                  </p>

                  <h5
                    className="fw-semibold text-uppercase mt-4 mb-2"
                    style={{
                      color: "#1b1b1bff",
                      letterSpacing: "1px",
                      fontWeight: 600,
                    }}
                  >
                    Contact
                  </h5>

                  <p className="mb-2" style={{ fontWeight: 300 }}>
                    <strong>Business Email</strong>: lgumalaytourism@yahoo.com
                  </p>
                  <p className="mb-2" style={{ fontWeight: 300 }}>
                    <strong>Telephone</strong>: (036) 288-8827, (036) 288-2493
                  </p>
                </div>
              </Col>

              {/* MAP SECTION (appears second on small screens) */}
              <Col
                md={6}
                sm={12}
                className="order-2 order-md-1 d-flex justify-content-center"
              >
                <div style={{ height: "330px", width: "100%" }}>
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{
                        height: "100%",
                        width: "100%",
                      }}
                      center={position}
                      zoom={16}
                    >
                      <Marker position={position} />
                    </GoogleMap>
                  ) : (
                    <p>Loading map...</p>
                  )}
                </div>
              </Col>
            </Row>
          </Col>


          {/* SUBSCRIBE + LOGOS SECTION */}
          <Col lg={6} md={12} sm={12}>
            <div className="px-1 px-md-2">

              <Form className="d-flex mb-5 subscribe-form">
                <Form.Control
                  type="email"
                  placeholder="Subscribe for Real-time Updates!"
                  className="rounded-0 form-control-lg custom-input"
                />
                <Button variant="dark" className="rounded-0 px-4 custom-button">
                  SUBSCRIBE
                </Button>
              </Form>

              {/* Awards Logos */}
              <div
                className="d-flex align-items-center flex-wrap mb-3 awards-wrapper justify-content-lg-end justify-content-center gap-4"
              >
                <img src={worldtravellogo} alt="World Travel Award 2025" height="150" className="award-logo" />
                <img src={condenastlogo} alt="Conde Nast Traveller Readers' Choice Awards 2025" height="150" className="award-logo" />
                <img src={philawardlogo} alt="Philippine Tourism Awards 2025" height="150" className="award-logo" />
                <img src={travelleisurelogo} alt="Travel + Leisure Readers' Choice Awards 2024" height="150" className="award-logo" />

              </div>
            </div>
          </Col>


        </Row>

        <hr className="border-gray" />


        <Row className="align-items-center justify-content-between text-center text-md-start px-5">
          {/* Left Side: Copyright */}
          <Col md="6" className="mb-3 mb-md-0">
            <small style={{ fontWeight: 300 }}>
              © {new Date().getFullYear()} LGU Malay Tourism. All rights reserved.
            </small>
          </Col>

          {/* Right Side: Social Links */}
          <Col
            md="6"
            className="d-flex justify-content-center justify-content-md-end"
          >
            <div className="d-flex gap-3">
              <a
                href="https://facebook.com/malaytourism"
                className="text-dark"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebookSquare} size="lg" />
              </a>

              <a
                href="https://m.me/malaytourism"
                className="text-dark"
                aria-label="Messenger"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebookMessenger} size="lg" />
              </a>


            </div>
          </Col>
        </Row>

      </Container>
    </footer>
  );
};

export default FooterCustomized;
