import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FooterCustomized from "../components/footer/Footer";
import HomeButtons from "../components/homeButtons";
import { useNavigate } from 'react-router-dom';

export default function EnterprisePage() {
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
        <Container fluid className="main-container mt-5">
            <div className="home-section pb-0 pt-0">
              <a
                className="text-decoration-none d-block mb-0"
                style={{ cursor: "pointer", color: "grey" }}>
                <span
                  onClick={() => navigate(`/experience`)}
                  style={{ color: "grey", marginRight: "5px", fontSize: "0.90rem" }}>
                  home
                </span>
                <span
                  onClick={() => navigate(`/enterprises`)}
                  style={{ color: "grey", margin: "0 5px", fontSize: "0.90rem" }}>
                  / enterprises
                </span>
              </a>
          </div>
            <div className={`customized-main-content`}>
               
               <div id="home-buttons">
                    <HomeButtons />
                </div>
               
            </div>
            <div className="home-section">
                <FooterCustomized></FooterCustomized>
            </div>


        </Container>
    );
}
