import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass, faBiking } from "@fortawesome/free-solid-svg-icons";

const fallbackImage =
  "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/homeButtons%2Fwhitebach_backdrop.jpg?alt=media&token=2d712ede-915f-4ca5-ba1d-b650bce45cf7";

const TwoSectionButtons = () => {
  const cardData = [
    {
      name: "ATTRACTIONS",
      caption: "Instagrammable places!",
      link: "/enterprises/attractions",
      color: "#B0E0E6", // Green
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/attractions.png?alt=media&token=84f0cbf2-4986-4fa3-ae02-80a52319534f",
      icon: faCompass,
    },
    {
      name: "ACTIVITIES",
      caption: "For thrill seekers!",
      link: "/enterprises/activities",
      color: "#0D1B2A", // Blue
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/activities.jpg?alt=media&token=bc2a2009-b794-47b6-8f36-93c9394e24aa",
      icon: faBiking,
    },
  ];

  return (
    <div className="home-section">
      <h2 className="home-section-title mb-1">EXPLORE MORE!</h2>
      <p className="home-section-subtitle mb-0">Discover Attractions and Activities in Boracay</p>
      <div className="row">
        {cardData.map((card, index) => (
          <div className="col-6 p-1 p-md-2" key={index}>
            <NavLink to={card.link} className="group">
              <div
                className="home-button-card"
                style={{ "--button-color": card.color }}
              >
                <div
                  className="home-button-bg"
                  style={{
                    backgroundImage: `url(${card.image})`,
                  }}
                ></div>
                <div className="home-button-gradient"></div>
                <FontAwesomeIcon icon={card.icon} className="home-button-icon" />
                <div className="home-button-content">
                  <p className="home-button-name">{card.name}</p>
                  <p className="home-button-caption">{card.caption}</p>
                </div>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TwoSectionButtons;
