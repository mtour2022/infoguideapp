import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FooterCustomized from "../components/footer/Footer";
import HomeButtons from "../components/homeButtons";
import { useNavigate } from 'react-router-dom';
import DUalCarousel from "../components/TourismUpdatesComponent";
import SocialFeed from "../components/facebookEmbed/FacebookEmbed";

export default function UpdatePage() {
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
                        onClick={() => navigate(`/home`)}
                        style={{ color: "grey", marginRight: "5px", fontSize: "0.90rem" }}>
                        home
                    </span>
                    <span
                        onClick={() => navigate(`/updates`)}
                        style={{ color: "grey", margin: "0 5px", fontSize: "0.90rem" }}>
                        / updates
                    </span>
                </a>
            </div>
            <div className={`customized-main-content`}>

                <div id="updates">
                    <DUalCarousel collectionName="updates" title="Tourism Updates"
                        caption="Stay informed with the latest news and announcements."></DUalCarousel>

                </div>
                <div id="tourism-incomingevents">
                    <DUalCarousel collectionName="incomingEvents" title="Incoming Events"
                        caption="Get excited and participate on these incoming events!"></DUalCarousel>

                </div>
                <div id="tourism-deals">
                    <DUalCarousel collectionName="deals" title="Deals, Promos, Games, & Giveaways"
                        caption="Get excited and participate on these incoming events!"></DUalCarousel>

                </div>

                <div id="tourism-stories">
                    <DUalCarousel collectionName="stories" title="Tourism Stories"
                        caption="Read, Be inspired and you might find the one!"></DUalCarousel>

                </div>

            </div>
            <div id="social-feed" className="text-center">
                <SocialFeed collectionName="facebook_posts" />
            </div>


            <div className="home-section">
                <FooterCustomized></FooterCustomized>
            </div>


        </Container>
    );
}
