import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FooterCustomized from "../components/footer/Footer";
import HomeButtons from "../components/homeButtons";
import TwoSectionButtons from "../components/homebutton2";
import { useNavigate } from 'react-router-dom';

export default function ExperiencesPage() {
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

    return (
        <Container fluid className="main-container  mt-5">
            <div className="home-section pt-0 pb-5">
              <a
                className="text-decoration-none d-block mb-0"
                style={{ cursor: "pointer", color: "grey" }}>
                <span
                  onClick={() => navigate(`/experiences`)}
                  style={{ color: "grey", marginRight: "5px", fontSize: "0.90rem" }}>
                  home
                </span>
                <span
                  onClick={() => navigate(`/experiences`)}
                  style={{ color: "grey", margin: "0 5px", fontSize: "0.90rem" }}>
                  / experiences
                </span>
              </a>
          </div>
            <div className={`customized-main-content`}>
               <h2 className="home-section-title ">FOR YOUR BORACAY BUCKETLIST!</h2>

                <p className="home-section-subtitle">
                    Attractions, Activities, and Must-do Experiences.
                </p>

                <div id="activities">
                        <TwoSectionButtons></TwoSectionButtons>
                </div>
               
            </div>
            <div className="home-section">
                <FooterCustomized></FooterCustomized>
            </div>


        </Container>
    );
}
