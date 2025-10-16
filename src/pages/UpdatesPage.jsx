import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FooterCustomized from "../components/footer/Footer";
import HomeButtons from "../components/homeButtons";
import { useNavigate } from 'react-router-dom';
import DUalCarousel from "../components/TourismUpdatesComponent";
import SocialFeed from "../components/facebookEmbed/FacebookEmbed";
import FacebookLiveStream from "../components/facebookstream";
import CustomSwiper from "../components/TourismHorizontalSlideshow";
import backgroundmap from "../assets/map-background.png";
import background2 from "../assets/background2.png";
import backgroundfade from "../assets/backgroundfade.png";
import UpdateSection from "../components/WeatherCard";
import PortScheduleTodayComponent from "../components/portLocationAdmin/portLocationComponent";
import ActivityScheduleTodayComponent from "../components/activityLocationAdmin/activityLocationComponent";
import HolidayTodayComponent from "../components/holidayTodayAdmin/holidayComponent";
import UpcomingEventHighlight from "../components/holidayTodayAdmin/IncommingEventComponent";

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
        <>

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


                    {/* <div id="updates">
                        <DUalCarousel collectionName="updates" title="Tourism Updates"
                            caption="Stay informed with the latest news and announcements."></DUalCarousel>

                    </div> */}

                    {/* <div id="tourism-incomingevents">
                        <DUalCarousel collectionName="incomingEvents" title="Incoming Events"
                            caption="Get excited and participate on these incoming events!"></DUalCarousel>

                    </div> */}
                    {/* <div id="tourism-deals">
                        <DUalCarousel collectionName="deals" title="Deals, Promos, Games, & Giveaways"
                            caption="Get excited and participate on these incoming events!"></DUalCarousel>

                    </div> */}

                    {/* <div id="tourism-stories">
                    <DUalCarousel collectionName="stories" title="Tourism Stories"
                        caption="Read, Be inspired and you might find the one!"></DUalCarousel>

                </div> */}


                </div>





            </Container>




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

            <div className="">
                <FooterCustomized></FooterCustomized>
            </div>

        </>
    );
}


{/* <section
                className="map-section d-flex align-items-center justify-content-end position-relative"
                style={{
                    backgroundImage: `url(${background2})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "auto",
                    aspectRatio: "16 / 9",
                }}
            >
                <Row className="justify-content-center w-100 px-2">
                    <Col xs={12} md={12}>
                        <div id="social-feed" className="text-center">
                            <h2 className="home-section-title mb-1 mt-2 mb-5">SOCIAL MEDIA HIGHLIGHTS</h2>
                            <script src="https://elfsightcdn.com/platform.js" async></script>
                            <div class="elfsight-app-7e170490-e60d-48e7-b008-a39a52205baf" data-elfsight-app-lazy></div>
                        </div>
                    </Col></Row>

            </section> */}

{/* <div id="tourism-schedules">
                <section
                    className="map-section d-flex align-items-center justify-content-center position-relative"
                    style={{
                        backgroundImage: `url(${backgroundfade})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center bottom",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: "300px",
                        aspectRatio: "16 / 9",
                    }}
                >
                    <Row className="justify-content-center align-items-center w-100 px-2 text-center">
                        <Col xs={12} md={6}>
                            <PortScheduleTodayComponent></PortScheduleTodayComponent>
                        </Col>
                        <Col xs={12} md={6}>
                            <ActivityScheduleTodayComponent></ActivityScheduleTodayComponent>
                        </Col>
                    </Row>
                </section>
            </div> */}
{/* <div id="social-feed" className="text-center">
                    <SocialFeed collectionName="facebook_posts" />
                </div> */}
{/* <div id="social-feed" className="text-center">
                      <h2 className="home-section-title mb-1 mt-5 mb-3">SOCIAL MEDIA HIGHLIGHTS</h2>
                    <script src="https://elfsightcdn.com/platform.js" async></script>
<div class="elfsight-app-7e170490-e60d-48e7-b008-a39a52205baf" data-elfsight-app-lazy></div>

                </div> */}