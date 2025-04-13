import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faMapLocationDot, faPersonSwimming } from "@fortawesome/free-solid-svg-icons";

const AttractionsActivitiesShowcase = () => {


  const cards = [
    {
      title: "Tourist Hot Spots",
      image:
        "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/AgnagaMiniFalls%26%20ColdSpring.jpg?alt=media&token=ac261bd1-6d49-49a2-8f37-56fb6db645ab",
      link: "attractions",
    },
    {
      title: "Tourist Activities",
      image:
        "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/DSC_4919-min.JPG?alt=media&token=80d6dc7a-6878-456c-bb6b-b6ff9990046f",
      link: "activities",
    },
  ];

  return (
    <div className="home-section">
      <h2 className="home-section-title">EXPLORE THE WORLD'S BEST BEACH</h2>
      <p className="home-section-subtitle">
        Explore scenic spots and join exciting tourist activities!
      </p>

      <div className="row g-4">
        {cards.map((card, index) => (
          <ImageCard key={index} card={card} />
        ))}
      </div>
    </div>
  );
};

const ImageCard = ({ card, onClick }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = card.image;
    img.onload = () => setIsLoading(false);
  }, [card.image]);

  const isAttractions = card.link === "/attractions";
  const isActivities = card.link === "/activities";


  return (
    <div className="col-md-6" style={{ cursor: "pointer" }}  onClick={() => navigate(`/infoguideapp/enterprises/${card.link}`)}>
      <div className="pagination-component-card">
        <div className="image-slider-container">
          {isLoading && (
            <div className="image-loader">
              <div className="spinner"></div>
            </div>
          )}
          <div
            className="image-slider"
            style={{
              backgroundImage: `url(${card.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
              width: "100%",
              opacity: isLoading ? 0 : 1,
            }}
          />
        </div>
        <div className="home-button-content text-background-gradient">
          <p className="card-button-name">
          {isAttractions && <FontAwesomeIcon icon={faCamera} className="me-2" />}
          {isActivities && <FontAwesomeIcon icon={faPersonSwimming} className="me-2" />}
            {card.title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttractionsActivitiesShowcase;
