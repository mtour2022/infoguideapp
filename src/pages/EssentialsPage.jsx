import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import FooterCustomized from "../components/footer/Footer";
import HomeButtons from "../components/homeButtons";
import { useNavigate } from 'react-router-dom';
import {
  PhoneCall, FileText, Gavel, HeartPulse, Link, HelpCircle,
  Ship, Award, Globe, Building2
} from 'lucide-react';
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBagShopping,
  faBan,
  faCloud,
  faGavel,
  faGlobe,
  faHandshake,
  faHandsHelping,
  faHeart,
  faLightbulb,
  faMagnifyingGlass,
  faMedal,
  faPassport,
  faPhone,
  faQuestionCircle,
  faShip,
  faSlash,
  faSun,
  faUmbrellaBeach
} from "@fortawesome/free-solid-svg-icons";
import { faInternetExplorer } from "@fortawesome/free-brands-svg-icons";
export default function EssentialsPage() {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cardData = [
    {
      name: "EMERGENCY HOTLINES",
      caption: "For emergencies and important inquiries",
      link: "/listview/hotlines",
      color: "#DA3C3C", // Green
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/hotlines.jpg?alt=media&token=71fedd52-62b5-4ed1-b026-6b8bc976ccbd",
      icon: faPhone,
    },
    {
      name: "TOURIST REQUIREMENTS",
      caption: "Important things to bring",
      link: "/listview/requirements",
      color: "#2D8B3C", // Blue
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/touristrequirements.jpg?alt=media&token=4d2d0f39-9bbf-4526-bdee-49ac1b2ca9f8",
      icon: faPassport,
    },
    {
      name: "BEACH LAWS",
      caption: "Ordinances to remember",
      link: "/listview/ordinances",
      color: "#263238", // Blue
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/police.jpg?alt=media&token=d77dfea0-c94a-4cfc-ab0e-977b55625702",
      icon: faGavel,
    },
    {
      name: "LIFESTYLES & FACILITIES",
      caption: "Know more about the way of living",
      link: "/update/lifeStyles",
      color: "#A051EE", // Blue
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/facilities.jpg?alt=media&token=31377dac-d19a-432b-b3d5-f1c10ec1a316",
      icon: faSun,
    },
    {
      name: "HELPFUL LINKS",
      caption: "For a seemless travel",
      link: "/update/helpfulLinks",
      color: "#4682B4", // Blue
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/apps.png?alt=media&token=51eb06e4-d876-489b-9e31-2549c0d5afd7",
      icon: faGlobe,
    },
    {
      name: "TOURIST FAQS",
      caption: "For a seemless travel",
      link: "/listview/touristFAQs",
      color: "#FF8A00", // Blue
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/information.jpg?alt=media&token=5d2dd5e0-3f9b-441f-b06d-76b1107042e7",
      icon: faQuestionCircle,
    },
  ];

  const cardData2 = [
    {
      name: "TO SUPPORT",
      caption: "Tourism campaigns to support",
      link: "/slideshow/sustainableTourism",
      color: "#2E7D32", // Green
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/attractions.png?alt=media&token=84f0cbf2-4986-4fa3-ae02-80a52319534f",
      icon: faHeart,
    },
    {
      name: "TO AVOID",
      caption: "Some things to avoid",
      link: "/slideshow/sustainableTourism",
      color: "#B7410E", // Blue
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/activities.jpg?alt=media&token=bc2a2009-b794-47b6-8f36-93c9394e24aa",
      icon: faBan,
    },
    {
      name: "TO BRING",
      caption: "Helpful things to save mother earth",
      link: "/slideshow/sustainableTourism",
      color: "#CD5C5C", // Blue
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/activities.jpg?alt=media&token=bc2a2009-b794-47b6-8f36-93c9394e24aa",
      icon: faBagShopping,
    },
    {
      name: "TO REMEMBER",
      caption: "Things to keep in mind",
      link: "/slideshow/sustainableTourism",
      color: "#FBC02D", // Blue
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/activities.jpg?alt=media&token=bc2a2009-b794-47b6-8f36-93c9394e24aa",
      icon: faLightbulb,
    },
  ];


  const cardData3 = [
    {
      name: "AWARDS, RECONITIONS & CERTIFICATIONS",
      caption: "Excellence You Can Trust",
      link: "/update/awardsAndRecognitions",
      color: "#D6C334", // Green
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/awards-min.jpg?alt=media&token=4332a975-e379-4c40-8f8c-9f9807f771b2",
      icon: faMedal,
    },
    {
      name: "TRAVEL EXPOS",
      caption: "Expo & B2B Particiipations",
      link: "/update/travelExpos",
      color: "#8B4513", // Blue
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/expos-min.jpg?alt=media&token=2b8f0c43-0f2e-4326-b9a1-10ad4cb0fbe2",
      icon: faHandshake,
    },
    {
      name: "TOURISM PROJECTS",
      caption: "Projects for the people in tourism",
      link: "/update/tourismProjects",
      color: "#04D9A4", // Blue
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/projects-min.jpg?alt=media&token=5e0f89c6-f77d-4e3a-a512-bb759c6626f3",
      icon: faHandsHelping,
    },
    {
      name: "TOURISM NICHES",
      caption: "Different people, various offerings",
      link: "/update/tourismMarkets",
      color: "#004D40", // Blue
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/niche-min.jpg?alt=media&token=b8a4947e-5d24-4bb3-b2cb-298a0e43c361",
      icon: faMagnifyingGlass,
    },
  ];

   const cardData4 = [
    {
      name: "CRUISE SHIP ARRIVAL",
      caption: "Award-winning gallery",
      link: "/update/cruiseShips",
      color: "#FFA500", // Green
      image: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/cruiseship.jpg?alt=media&token=0be7c5da-914d-4080-b7e4-2b842d53fb6a",
      icon: faShip,
    },
   
  ];



  const findItem = (title) => essentials.find(e => e.title === title);


  return (
    <Container fluid className="main-container  mt-5">
      <div className="home-section pt-0 pb-5">
        <a
          className="text-decoration-none d-block mb-0"
          style={{ cursor: "pointer", color: "grey" }}>
          <span
            onClick={() => navigate(`/home`)}
            style={{ color: "grey", marginRight: "5px", fontSize: "0.90rem" }}>
            home
          </span>
          <span
            onClick={() => navigate(`/essentials`)}
            style={{ color: "grey", margin: "0 5px", fontSize: "0.90rem" }}>
            / essentials
          </span>
        </a>
      </div>
      <div className={`customized-main-content`}>
        <h2 className="home-section-title ">TOURIST ESSENTIALS</h2>
        <p className="home-section-subtitle">
          Things to know about.
        </p>
        <div id="essentials">
          <ButtonCards cardData={cardData} />
        </div>
      </div>
       <div className={`customized-main-content mt-5`}>
        <h2 className="home-section-title ">SUSTAINABLE TRAVEL</h2>
        <p className="home-section-subtitle">
          Becoming a responsible tourist.
        </p>
        <div id="achievements">
          <ButtonCards cardData={cardData2} />
        </div>
      </div>
      <div className={`customized-main-content mt-5`}>
        <h2 className="home-section-title ">ACHIEVEMENTS AND PROJECTS</h2>
        <p className="home-section-subtitle">
          Things to be proud about.
        </p>
        <div id="achievements">
          <ButtonCards cardData={cardData3} />
        </div>
      </div>
      <div className={`customized-main-content mt-5`}>
        <h2 className="home-section-title ">TOURISM DATA</h2>
        <p className="home-section-subtitle">
          Tourism-related data.
        </p>
        <div id="achievements">
          <ButtonCards cardData={cardData4} />
        </div>
      </div>
      <div className="home-section">
        <FooterCustomized></FooterCustomized>
      </div>



    </Container>
  );
}


const ButtonCards = ({ cardData = [] }) => {
  return (
    <section className="home-section pt-0">
      <div className="row">
        {cardData.map((card, index) => (
          <div className="col-6 col-lg-3 m-0 p-1 p-md-2" key={index}>
            <NavLink to={card.link} className="group text-decoration-none">
              <div
                className="home-button-card mb-0"
                style={{ "--button-color": card.color }}
              >
                <div
                  className="home-button-bg"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
                <div className="home-button-gradient" />

                <FontAwesomeIcon icon={card.icon} className="home-button-icon" />

                <div className="home-button-content">
                  <p className="home-button-name">
                    {card.name}
                  </p>
                  <p className="home-button-caption">
                    {card.caption}
                  </p>
                </div>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </section>
  );
};
