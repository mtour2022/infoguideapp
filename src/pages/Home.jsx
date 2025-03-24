import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"; // Import necessary icons
import Slideshow from "../components/slideshow/SlideShowComponent";
import HomeButtons from "../components/homeButtons";
import AttractionsSlide from "../components/AttractionsSlide";

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

    // Function to update state when screen resizes
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Container fluid className="main-container">
            {/* Conditionally render sidebar */}
            {!isSmallScreen && (
                <div className={`customized-sidebar ${isSidebarOpen ? "open" : "closed"} pt-5`} onClick={toggleSidebar}>
                    <Button className="customized-toggle-btn" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={isSidebarOpen ? faChevronLeft : faChevronRight} />
                    <span className="customized-toggle-text mt-2">QUICK CHECK</span>
                    </Button>
                    {isSidebarOpen && <p>Sidebar Content</p>}
                </div>
            )}

            {/* Main Content */}
            <div className={`customized-main-content ${isSidebarOpen ? "shrink" : "expand"} pt-4 ${!isSmallScreen ? "ps-4" : ""}`}>
                {/* Slideshow Component */}
                <Slideshow />
                {/* Button Components */}
                <HomeButtons></HomeButtons>
                {/* attractions */}
<AttractionsSlide></AttractionsSlide>
            </div>
        </Container>
    );
}
