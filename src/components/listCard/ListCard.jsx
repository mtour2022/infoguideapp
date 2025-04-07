import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import DOTlogo from "../../assets/images/DepartmentOfTourismAccreditationLogo.png"; // Import the image

const ListCard = ({ accommodation }) => {
  // Destructure and provide default values for missing data
  const {
    name = "No Name Available",
    category = "N/A",
    subcategory = "N/A",
    classification = "N/A",
    address = { street: "N/A", barangay: "N/A", town: "N/A", province: "N/A" },
    logo = "/path/to/default-logo.png", // Fallback logo path
    headerImage = "/path/to/default-image.jpg", // Fallback image path
    accreditation = "No Accreditation",
    ratings = "N/A",
  } = accommodation;

  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-4 list-card-tile">
      <Card className="rounded shadow-sm overflow-hidden list-card-card">
        <div
          className="card-image"
          style={{
            backgroundImage: `url(${headerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <img src={logo} alt="logo" className="card-logo list-card-logo" />

          {accreditation && accreditation !== "No Accreditation" && (
            <div className="card-accreditation">
              <img src={DOTlogo} alt="DOT Accreditation Logo" className="dot-logo" />
              {accreditation}
            </div>
          )}

          {ratings && ratings > 0 && (
            <div className="card-ratings">
              <FontAwesomeIcon icon={faStar} className="me-1 list-card-star-icon" />
              <small>{ratings}</small>
            </div>
          )}
        </div>

        <Card.Body className="list-card-body">
          <Card.Title className="font-weight-bold list-card-title fw-bold mb-3">{name}</Card.Title>

          <Card.Subtitle className=" mb-2 list-card-subtitle">
            {classification && classification !== "N/A" ? classification.toUpperCase() : (subcategory || category).toUpperCase()}
          </Card.Subtitle>

          <Card.Text className="text-muted list-card-text">
            {[address.street, address.barangay, address.town, address.province]
              .filter(Boolean) // Filters out empty values (falsy values)
              .join(', ')} {/* Join remaining values with a comma and space */}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ListCard;
