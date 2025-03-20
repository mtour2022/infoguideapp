import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Container fluid className="main-container">
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
            <Button className="customized-toggle-btn" onClick={toggleSidebar}>
                    {/* <FontAwesomeIcon icon={isSidebarOpen ? faChevronLeft : faChevronRight} /> */}
                    <p className="customized-toggle-text">TOURISM UPDATES</p>
                    </Button>

                {isSidebarOpen && <p>Sidebar Content</p>}
            </div>

            {/* Main Content */}
            <div className={`main-content ${isSidebarOpen ? "shrink" : "expand"}`}>
                <p>Main Content Area</p>
            </div>
        </Container>
    );
}
