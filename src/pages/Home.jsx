import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
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
import CustomSwiper from "../components/TourismHorizontalSlideshow";
import backgroundmap from "../assets/map-background.png";
import background2 from "../assets/background2.png";
import backgroundfade from "../assets/backgroundfade.png";
import UpdateSection from "../components/WeatherCard";
import PortScheduleTodayComponent from "../components/portLocationAdmin/portLocationComponent";
import ActivityScheduleTodayComponent from "../components/activityLocationAdmin/activityLocationComponent";
import HolidayTodayComponent from "../components/holidayTodayAdmin/holidayComponent";
import UpcomingEventHighlight from "../components/holidayTodayAdmin/IncommingEventComponent";
import { useNavigate } from 'react-router-dom';


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
    const navigate = useNavigate();

    return (
        <>
            <Container fluid className="">


                {/* <div className={`customized-main-content`}>
                    <Slideshow />
                    

                    <p className="home-section-subtitle text-center mt-4">Quick Links</p>

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

                </div> */}

                {/* <div>

                    <div id="tourism-activities">
                        <h2 className="custom-section-title text-center my-5">
                            EXPLORE MORE WONDERS
                        </h2>
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


                    <div id="tourism-updates">
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
                </div>
                </div> */}


            </Container>
            <div className="text-center mt-4">

                        <FacebookLiveStream videoUrl="https://www.facebook.com/malay.mdrrmc/videos/1326837815488475" />

                    </div>
            <Slideshow />
                
            <div id="tourism-socials">
                <section
                    className="map-section-long d-flex align-items-center justify-content-end position-relative"
                    style={{
                        backgroundImage: `url(${backgroundfade})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: "auto",
                        aspectRatio: "16 / 9",
                    }}
                >

                    <Row className="justify-content-center align-items-center w-100 px-2 text-center">
                        <Col xs={12} md={12}>

                            <div id="home-buttons">
                                <HomeButtons />
                            </div>
                        </Col>

                    </Row>



                </section>
            </div>
                
            <div id="tourism-activities">
                <Row className="justify-content-center align-items-center w-100 px-2 text-center">
                        <Col xs={12} md={12}>

                            <h2 className="custom-section-title text-center my-3">
                            EXPLORE MORE WONDERS
                        </h2>
                        <TwoSectionButtons></TwoSectionButtons>
                        </Col>

                    </Row>
                        
                    </div>

            {/* Quick Links Section */}
            <section className="quick-links-section text-center my-5 px-sm-3 px-4">
                <h5 className="fw-bold mb-4 text-secondary">QUICK LINKS</h5>
                <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3 mx-3 mx-md-0">
                    <button
                        className="read-more-btn view-all-btn mb-2 mb-md-3"
                        onClick={() =>
                            document
                                .getElementById("tourism-updates")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        <span className="d-none d-md-inline">Tourism Updates</span>
                        <span className="d-inline d-md-none">Updates</span> →
                    </button>



                    <button
                        className="read-more-btn view-all-btn mb-2 mb-md-3"
                        onClick={() =>
                            document
                                .getElementById("tourism-weather")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        <span className="d-none d-md-inline">Weather Today</span>
                        <span className="d-inline d-md-none">Weather</span> →
                    </button>

                    <button
                        className="read-more-btn view-all-btn mb-2 mb-md-3"
                        onClick={() =>
                            document
                                .getElementById("tourism-incomingevents")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        <span className="d-none d-md-inline">Incoming Events</span>
                        <span className="d-inline d-md-none">Events</span> →
                    </button>

                    <button
                        className="read-more-btn view-all-btn mb-2 mb-md-3"
                        onClick={() =>
                            document
                                .getElementById("tourism-deals")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        <span className="d-none d-md-inline">Deals, Promos & Giveaways</span>
                        <span className="d-inline d-md-none">Deals</span> →
                    </button>
                    <button
                        className="read-more-btn view-all-btn mb-2 mb-md-3"
                        onClick={() =>
                            document
                                .getElementById("tourism-socials")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        <span className="d-none d-md-inline">Social Media</span>
                        <span className="d-inline d-md-none">Socials</span> →
                    </button>
                    <button
                        className="read-more-btn view-all-btn mb-2 mb-md-3"
                        onClick={() =>
                            document
                                .getElementById("tourism-stories")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        <span className="d-none d-md-inline">Tourism Stories</span>
                        <span className="d-inline d-md-none">Stories</span> →
                    </button>
                </div>
            </section>



            <div id="tourism-broadcast">
                {/* Facebook Live */}

                <FacebookLiveStream videoUrl="https://www.facebook.com/malay.mdrrmc/videos/1326837815488475" />
            </div>


            <div id="tourism-updates">
                <CustomSwiper collectionName="updates" title={"TOURISM UPDATES"} />

            </div>


            <div id="tourism-updates">
                <section
                    className="map-section d-flex align-items-center justify-content-center position-relative"
                    style={{
                        backgroundImage: `url(${backgroundfade})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center bottom",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: "500px",
                        aspectRatio: "16 / 9",
                    }}
                >
                    <Row>
                        <Col md={12}>
                            <Row className="justify-content-center align-items-center w-100 px-2 text-center">
                                <Col xs={12} md={6}>
                                    <HolidayTodayComponent></HolidayTodayComponent>
                                </Col>
                                <Col xs={12} md={6}>
                                    <PortScheduleTodayComponent></PortScheduleTodayComponent>

                                </Col>
                            </Row>
                            <Row className="justify-content-center align-items-center w-100 px-2 text-center">
                                <Col xs={12} md={6}>
                                                                    <ActivityScheduleTodayComponent></ActivityScheduleTodayComponent>

                                </Col>
                                <Col xs={12} md={6}>
                                                                    <UpcomingEventHighlight></UpcomingEventHighlight>

                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </section>
            </div>
            <div id="tourism-incomingevents">
                <CustomSwiper collectionName="incomingEvents" title={"INCOMMING EVENTS"} />
            </div>


            {/* section for weather report */}
            <div id="tourism-weather">
                <UpdateSection></UpdateSection>
            </div>
            <div id="tourism-deals">
                <CustomSwiper collectionName="deals" title={"HOT DEALS"} />
            </div>
            <div id="tourism-socials">
                <section
                    className="map-section d-flex align-items-center justify-content-end position-relative"
                    style={{
                        backgroundImage: `url(${backgroundfade})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: "auto",
                        aspectRatio: "16 / 9",
                    }}
                >

                    <Row className="justify-content-center align-items-center w-100 px-2 text-center">
                        <Col xs={12} md={12}>

                         <script src="https://elfsightcdn.com/platform.js" async></script>
<div class="elfsight-app-7b49c8c7-fb6d-47c6-b472-0dcfde284d47" data-elfsight-app-lazy></div>
                        </Col>

                    </Row>



                </section>
            </div>


            <div id="tourism-stories">
                <CustomSwiper collectionName="stories" title={"TOURISM STORIES"} />
            </div>

            <section
                className="map-section-short d-flex align-items-center justify-content-end position-relative"
                style={{
                    backgroundImage: `url(${backgroundmap})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "auto",
                    aspectRatio: "16 / 9",
                }}
            >
                <div className="map-buttons d-flex flex-column align-items-end pe-3 pe-sm-3 pe-md-5">
                    <p
                        className="text-end text-light mb-xs-2 mb-sm-2 mb-md-5"
                        style={{
                            maxWidth: "320px",
                            fontSize: "0.85rem",
                            fontWeight: 300,
                            lineHeight: 1.4,
                            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                        }}
                    >
                        The world's best beach{" "}
                        <br className="d-block d-md-none" />
                        starts here . . .
                    </p>

                    <button className="read-more-btn mb-3">
                        <span className="d-none d-md-inline">Open Map Guide</span>
                        <span className="d-inline d-md-none">Map</span> →
                    </button>

                    <button className="read-more-btn mb-3">
                        <span className="d-none d-md-inline">Places to Explore</span>
                        <span className="d-inline d-md-none">Explore</span> →
                    </button>

                    <button className="read-more-btn mb-3">
                        <span className="d-none d-md-inline">Things to Experience</span>
                        <span className="d-inline d-md-none">Experience</span> →
                    </button>

                    <button className="read-more-btn mb-3">
                        <span className="d-none d-md-inline">Views to Treasure</span>
                        <span className="d-inline d-md-none">Views</span> →
                    </button>

                    <button className="read-more-btn mb-3">
                        <span className="d-none d-md-inline">Flavors to Savor</span>
                        <span className="d-inline d-md-none">Flavors</span> →
                    </button>
                </div>
            </section>


            <FooterCustomized scrollToId=""></FooterCustomized>

        </>
    );
}
