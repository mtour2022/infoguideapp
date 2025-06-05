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
    const readCollections = ["stories", "incomingEvents", "deals", "updates", "lifeStyles", "helpfulLinks", "cruiseShips", "travelExpos", "tourismProjects", "awardsAndRecognitions", "tourismMarkets"];

    const path = readCollections.includes(collectionName)
      ? `/read/${collectionName}/${dataId}`
      : `/view/${collectionName}/${dataId}`;

    console.log(collectionName);
    console.log(dataId);
    navigate(path);
  };

  const DefaultImage =
    "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/default.jpg?alt=media&token=06da7bc3-0eb2-4256-8b47-df0eb1087c74";

  // Destructure and provide default values for missing data
  const {
    title = "",
    name = "",
    category = "",
    subcategory = "",
    classification = "",
    address = { street: "", barangay: "", town: "", province: "" },
    logo = "", // Logo fallback path, not replaced
    headerImage,
    accreditation = "",
    ratings = "",
    date = "",
    dateTimeStart = "",
    dateTimeEnd = "",
    dateStart = "",
    dateEnd = "",
    origin = [],
    total = "",
    id, // Ensure there's an id property to use for navigation
  } = data;

  const isValidDate = (d) => d instanceof Date && !isNaN(d);

  const startRaw = dateTimeStart || dateStart;
  const endRaw = dateTimeEnd || dateEnd;

  const dateStartParsed = startRaw ? parseISO(startRaw) : null;
  const dateEndParsed = endRaw ? parseISO(endRaw) : null;
  const dateParsed = date ? parseISO(date) : null;

  const formattedDateStart = isValidDate(dateStartParsed) ? format(dateStartParsed, 'MMMM dd, yyyy') : null;
  const formattedDateEnd = isValidDate(dateEndParsed) ? format(dateEndParsed, 'MMMM dd, yyyy') : null;
  const formattedDate = isValidDate(dateParsed) ? format(dateParsed, 'MMMM dd, yyyy') : null;




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
    return "";
  })();

  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex">
      <Card
        className="rounded shadow-sm overflow-hidden list-card-card d-flex flex-column w-100"
        onClick={() => handleReadMore(collectionName, id)}
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

        <Card.Body className="list-card-body d-flex flex-column justify-content-between">
          {
            title && (
              <Card.Title className="font-weight-bold list-card-title fw-bold mb-3">
                {title}
              </Card.Title>
            )
          }

          {origin && (
            <Card.Title className="font-weight-bold card-button-caption fw-bold mb-4">
              {origin.join(', ')}
            </Card.Title>
          )}


          {name && (
            <Card.Title
              className={`${collectionName === "stories" ? "card-button-caption" : "list-card-title"} fw-bold mb-0`}
            >
              {name}
            </Card.Title>
          )}


          {classification && classification !== "No Classification" && (
            <div className="card-classification mb-3">
              <small>{classification}</small>

            </div>
          )}





          {total && (
            <Card.Subtitle className="mb-2 card-button-caption fw-bold">
              Total Visitors: {total}
            </Card.Subtitle>
          )}


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

          {address && (
            <Card.Text className="text-muted list-card-text">
              {[address.street, address.barangay, address.town, address.province]
                .filter(Boolean)
                .join(", ")}
            </Card.Text>
          )}





        </Card.Body>
      </Card>
    </Col>
  );
};

export default ListCard;
