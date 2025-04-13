import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import DOTlogo from "../../assets/images/DepartmentOfTourismAccreditationLogo.png"; // DOT Accreditation Logo
import { useNavigate } from 'react-router-dom';

import { parseISO, format } from 'date-fns';

const ListCard = ({ data, collectionName }) => {
  const navigate = useNavigate();

   
  const handleReadMore = (collectionName, dataId) => {
    const readCollections = ["stories", "incomingEvents", "deals", "updates"];
  
    const path = readCollections.includes(collectionName)
      ? `/infoguideapp/read/${collectionName}/${dataId}`
      : `/infoguideapp/view/${collectionName}/${dataId}`;
  
    console.log(collectionName);
    console.log(dataId);
    navigate(path);
  };
  
  const DefaultImage =
    "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/default.jpg?alt=media&token=06da7bc3-0eb2-4256-8b47-df0eb1087c74";

  // Destructure and provide default values for missing data
  const {
    title="",
    name = "",
    category = "",
    subcategory = "",
    classification = "",
    address = { street: "", barangay: "", town: "", province: "" },
    logo = "", // Logo fallback path, not replaced
    headerImage,
    accreditation = "",
    ratings = "",
    date="",
    dateTimeStart="",
    dateTimeEnd="",
    origin=[],
    id, // Ensure there's an id property to use for navigation
  } = data;

     // Parse and format dates
     const dateStartParsed = dateTimeStart ? parseISO(dateTimeStart) : null;
     const dateEndParsed = dateTimeEnd ? parseISO(dateTimeEnd) : null;
     const dateParsed = date ? parseISO(date) : null;
   
     const formattedDateStart = dateStartParsed ? format(dateStartParsed, 'MMMM dd, yyyy') : null;
     const formattedDateEnd = dateEndParsed ? format(dateEndParsed, 'MMMM dd, yyyy') : null;
     const formattedDate = dateParsed ? format(dateParsed, 'MMMM dd, yyyy') : null;
   
  

  // Use default image only for headerImage fallback
  const backgroundImageUrl =
    headerImage && headerImage.trim() !== "" ? headerImage : DefaultImage;
    const displayCategory = (() => {
      const cat = Array.isArray(category)
        ? category[0]
        : category;
    
      if (cat && cat !== "N/A") return cat.toUpperCase();
      if (subcategory && subcategory !== "N/A") return subcategory.toUpperCase();
      if (classification && classification !== "N/A") return classification.toUpperCase();
      return "UNCATEGORIZED";
    })();
    
  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-4 list-card-tile">
      <Card
        className="rounded shadow-sm overflow-hidden list-card-card"
        onClick={() => handleReadMore(collectionName, id)} // Handle card click
      >
        <div
          className="card-image"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {logo && (
              <img src={logo} alt="logo" className="card-logo list-card-logo" />
            )}


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
            {
              title && (
                <Card.Title className="font-weight-bold list-card-title fw-bold mb-3">
                  {title}
                </Card.Title>
              )
            }

          <Card.Title className="font-weight-bold card-button-caption fw-bold mb-4">
            {origin.join(', ')}
          </Card.Title>

          <Card.Title className={`${collectionName === "stories" ? "card-button-caption" : "list-card-title"} fw-bold mb-3`}>
            {name}
          </Card.Title>

          
          <Card.Subtitle className="mb-2 card-button-caption fw-bold">
            {displayCategory}
          </Card.Subtitle>

          {formattedDate && (
              <Card.Title className="card-button-caption">
                {formattedDate}
              </Card.Title>
            )}

            {formattedDateStart && (
              <Card.Title className="card-button-caption">
                {formattedDateStart}
                {formattedDateEnd && ` - ${formattedDateEnd}`}
              </Card.Title>
            )}




          <Card.Text className="text-muted list-card-text">
            {[address.street, address.barangay, address.town, address.province]
              .filter(Boolean)
              .join(", ")}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ListCard;
