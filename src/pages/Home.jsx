import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Slideshow from "../components/slideshow/SlideShowComponent";
import HomeButtons from "../components/homeButtons";
import AttractionsSlide from "../components/AttractionsSlide";
import ActivitiesSlide from "../components/ActivitiesSlide";
import UpdatesCarousel from "../components/QuickCheckSlides";
import { updatesCategoryOptions } from "../datamodel/updates_model";
import { storiesClassificationOptions } from "../datamodel/stories_model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBuilding,
    faBell,
    faBook,
    faFire,
    faBinoculars,
    faGlasses,
    faPersonSwimming,
    faBookBible,
    faBookMedical,
    faBookOpen,
    faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { incomingEventsCategoryOptions } from "../datamodel/incommingEvents_model";
import FooterCustomized from "../components/footer/Footer";
import TwoSectionButtons from "../components/homebutton2";
import { dealsAndPromotionsCategoryOptions } from "../datamodel/deals_model";
import DUalCarousel from "../components/TourismUpdatesComponent";
import IncomingEventsComponent from "../components/IncomingEventsComponent";
import SocialFeed from "../components/facebookEmbed/FacebookEmbed";
import FacebookLiveStream from "../components/facebookstream";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

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

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <Container fluid className="">
                     

            <div className={`customized-main-content`}>
                <Slideshow />
                                
                <p className="home-section-subtitle text-center mt-4">Quick Links</p>

                {/* Navigation Buttons */}
                <div className="text-center mb-4">
                    <button onClick={() => scrollToSection("home-buttons")} className="discover-more-btn my-2 fw-bold" >
                        <FontAwesomeIcon icon={faBuilding} className="me-2" />Enterprises</button>
                    <button onClick={() => scrollToSection("tourism-activities")} className="discover-more-btn my-2 fw-bold" >
                        <FontAwesomeIcon icon={faBinoculars} className="me-2" />Attractions</button>
                    <button onClick={() => scrollToSection("tourism-activities")} className="discover-more-btn my-2 fw-bold">
                        <FontAwesomeIcon icon={faPersonSwimming} className="me-2" />Activities</button>
                    <button onClick={() => scrollToSection("updates")} className="discover-more-btn my-2 fw-bold" >
                        <FontAwesomeIcon icon={faBell} className="me-2" />Updates</button>
                    <button onClick={() => scrollToSection("tourism-deals")} className="discover-more-btn my-2 fw-bold" >
                        <FontAwesomeIcon icon={faFire} className="me-2" />Deals and Promos</button>
                    <button onClick={() => scrollToSection("tourism-incomingevents")} className="discover-more-btn my-2 fw-bold" >
                        <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />Events</button>
                    <button onClick={() => scrollToSection("tourism-stories")} className="discover-more-btn my-2 fw-bold">
                        <FontAwesomeIcon icon={faBookOpen} className="me-2" />Stories</button>
                    <button onClick={() => scrollToSection("social-feed")} className="discover-more-btn my-2 fw-bold">
                        <FontAwesomeIcon icon={faFacebook} className="me-2" />Social Highlights</button>

                </div>
                 <div className="text-center mt-4">

                                    <FacebookLiveStream videoUrl="https://www.facebook.com/malay.mdrrmc/videos/1326837815488475" />

                </div>
                <div id="home-buttons">
                    <HomeButtons />
                </div>
                
            </div>
           
            <div>
                
                <div id="tourism-activities">
                    <h2 className="home-section-title mb-1">EXPLORE MORE!</h2>

                    {/* <AttractionsActivitiesShowcase></AttractionsActivitiesShowcase> */}
                    <TwoSectionButtons></TwoSectionButtons>
                </div>
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
                <div id="social-feed" className="text-center">
                <SocialFeed collectionName="facebook_posts" />
            </div>


                {/* <div id="tourism-updates">
                    <UpdatesCarousel
                        collectionName="updates"
                        categoryOptions={updatesCategoryOptions}
                        title="Tourism Updates"
                        caption="Stay informed with the latest news and announcements."
                        filterType="category"
                    />
                </div>
                <div id="tourism-deals">
                    <UpdatesCarousel
                        collectionName="deals"
                        categoryOptions={dealsAndPromotionsCategoryOptions}
                        title="Deals and Promos"
                        caption="Get your chance for these promos and deals!"
                        filterType="category"
                    />
                </div>
                <div id="tourism-incomingevents">
                    <UpdatesCarousel
                        collectionName="incomingEvents"
                        categoryOptions={incomingEventsCategoryOptions}
                        title="Incomming Events"
                        caption="Get excited and participate on these incoming events!"
                        filterType="category"
                    />
                </div>
                <div id="tourism-stories">
                    <UpdatesCarousel
                        collectionName="stories"
                        classificationOptions={storiesClassificationOptions}
                        title="Tourism Stories"
                        caption="Read, Be inspired and you might find the one!"
                        filterType="classification"
                    />
                </div> */}
            </div>
            <div className="home-section">
                <FooterCustomized></FooterCustomized>
            </div>


        </Container>
    );
}
