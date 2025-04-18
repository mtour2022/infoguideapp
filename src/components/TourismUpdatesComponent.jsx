import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { parseISO, format, isWithinInterval, addDays, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Spinner, Badge } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const DUalCarousel = ({ collectionName, title, caption }) => {
    const navigate = useNavigate();
    const [updates, setUpdates] = useState([]);
    const [filteredIndex, setFilteredIndex] = useState(0);

    useEffect(() => {
        const fetchUpdates = async () => {
            const snapshot = await getDocs(collection(db, collectionName));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const sortedData = data.sort((a, b) => {
                const dateA = parseISO(a.dateTimeStart || a.dateStart || a.date);
                const dateB = parseISO(b.dateTimeStart || b.dateStart || b.date);
                return dateA - dateB;
            });
            setUpdates(sortedData);
        };
        fetchUpdates();
    }, [collectionName]);


    const filteredUpdates = updates.filter(update => {
        const dateField = update.dateTimeStart || update.dateStart || update.date;
        if (!dateField) return false;
        const date = parseISO(dateField);
        const today = new Date();
    
        if (collectionName === "incomingEvents") {
            return isWithinInterval(date, {
                start: today,
                end: addDays(today, 7),
            });
        } else {
            return isWithinInterval(date, {
                start: subDays(today, 5),
                end: addDays(today, 1),
            });
        }
    });

    

    const navigateTo = (collectionName, id) => navigate(`/read/${collectionName}/${id}`);
    return (
        <div className="home-section">
          <h2 className="home-section-title mb-1">{title}</h2>
          <p className="home-section-subtitle mb-1">{caption}</p>
      
          {filteredUpdates && filteredUpdates.length > 0 ? (
            <Row>
              {/* Left Side - Slideshow */}
              <Col md={6}>
                <h3 className="card-button-name mt-3 mb-3 fs-5">
                  {collectionName === "incomingEvents"
                    ? "EVENTS IN THE NEXT 7 DAYS!"
                    : `RECENT ${collectionName.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase()}`}
                </h3>
      
                <Slideshow collectionName={collectionName} slides={filteredUpdates} />
              </Col>
      
              {/* Right Side - Carousel Card */}
              <Col md={6}>
                <h3 className="card-button-name mt-3 mb-3 fs-5 d-none d-md-block">
                  ALL {collectionName.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase()}
                </h3>
      
                {updates.length > 0 && (
                  <div>
                    <div className="d-none d-md-block">
                      <UpdateCard
                        collectionName={collectionName}
                        update={updates[filteredIndex]}
                        onClick={() => navigateTo(collectionName, updates[filteredIndex].id)}
                      />
                    </div>
                    <div className="d-none d-md-block">
                      <Row className="pt-3">
                        <Col className="d-flex justify-content-start ms-0 ps-0">
                          <NavLink to={`/update/${collectionName}`} className="discover-more-btn ms-0 fw-bold">
                            View All
                          </NavLink>
                        </Col>
                        <Col className="d-flex justify-content-end">
                          <FontAwesomeIcon
                            icon={faChevronLeft}
                            className="nav-icon left"
                            onClick={() => setFilteredIndex(prev => (prev - 1 + updates.length) % updates.length)}
                          />
                          <div className="me-4"></div>
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className="nav-icon right"
                            onClick={() => setFilteredIndex(prev => (prev + 1) % updates.length)}
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="d-flex d-md-none justify-content-center mt-2">
                      <NavLink to={`/update/${collectionName}`} className="discover-more-btn ms-0 fw-bold">
                        View All {collectionName.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase()}
                      </NavLink>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          ) : (
            // Center only the right column if no filtered updates
            <Row className="justify-content-center">
              <Col md={6}>
                <h3 className="card-button-name mt-3 mb-3 fs-5 text-center">
                  ALL {collectionName.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase()}
                </h3>
      
                {updates.length > 0 && (
                  <div className="text-center">
                    <UpdateCard
                      collectionName={collectionName}
                      update={updates[filteredIndex]}
                      onClick={() => navigateTo(collectionName, updates[filteredIndex].id)}
                    />
                    <Row className="pt-3">
                        <Col className="d-flex justify-content-start ms-0 ps-0">
                          <NavLink to={`/update/${collectionName}`} className="discover-more-btn ms-0 fw-bold">
                            View All
                          </NavLink>
                        </Col>
                        <Col className="d-flex justify-content-end">
                          <FontAwesomeIcon
                            icon={faChevronLeft}
                            className="nav-icon left"
                            onClick={() => setFilteredIndex(prev => (prev - 1 + updates.length) % updates.length)}
                          />
                          <div className="me-4"></div>
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className="nav-icon right"
                            onClick={() => setFilteredIndex(prev => (prev + 1) % updates.length)}
                          />
                        </Col>
                      </Row>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </div>
      );}
      

const Slideshow = ({ slides, collectionName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const handleReadMore = (id) => {
        navigate(`/read/${collectionName}/${id}`);
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [slides.length]);
    const dateStart = slides[currentIndex].dateTimeStart ? parseISO(slides[currentIndex].dateTimeStart) : null;
    const dateEnd = slides[currentIndex].dateTimeEnd ? parseISO(slides[currentIndex].dateTimeEnd) : null;
    const formattedDateStart = dateStart ? format(dateStart, 'MMMM dd, yyyy') : null;
    const formattedDateEnd = dateEnd ? format(dateEnd, 'MMMM dd, yyyy') : null;
    return (
        <div className="slideshow rounded" style={{
            height: "350px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
        }}>
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`slide ${index === currentIndex ? "active" : ""}`}
                    style={{
                        opacity: index === currentIndex ? 1 : 0,
                        transition: "opacity 1s ease-in-out", 
                    }}>
                    <div
                        className="slide-image"
                        style={{
                            backgroundImage: `url(${slide.headerImage})`,
                            height: "300px", 
                            objectFit: "cover", 
                        }}>
                        <div className="upper-row">
                            <div className="dots">
                                {slides.map((_, dotIndex) => (
                                    <span
                                        key={dotIndex}
                                        className={`dot ${dotIndex === currentIndex ? "active" : ""}`}
                                        onClick={() => setCurrentIndex(dotIndex)}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="home-button-content text-background-solid-color">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p className="card-button-name">{slide.title}</p>
                                <p className="card-button-caption d-none d-sm-block">
                                    {Array.isArray(slide.origin) ? slide.origin.join(", ") : ""}
                                </p>
                                <div className="d-flex align-items-start">
                                    <p className="card-button-caption d-none d-sm-block mb-0">
                                        {slide.name}
                                        {formattedDateStart && (
                                            <>
                                                {" - "}
                                                {collectionName === "updates"
                                                    ? formattedDateStart
                                                    : formattedDateStart && formattedDateEnd
                                                        ? `${formattedDateStart} - ${formattedDateEnd}`
                                                        : formattedDateStart}
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <NavLink
                            to={`/read/${collectionName}/${slide.id}`}
                            className="discover-more-btn ms-0 fw-bold"
                            style={{ textDecoration: "none" }}>
                            Read
                            </NavLink>

                            
                        </div>
                    </div>
                </div>
            ))}
            <button
                className="nav-button left"
                onClick={() => setCurrentIndex((currentIndex - 1 + slides.length) % slides.length)}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
                className="nav-button right"
                onClick={() => setCurrentIndex((currentIndex + 1) % slides.length)}>
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </div>
    );
};
const UpdateCard = ({ update, onClick, collectionName }) => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const img = new Image();
        img.src = update.headerImage;
        img.onload = () => setIsLoading(false);
    }, [update.headerImage]);
    const dateStart = update.dateTimeStart ? parseISO(update.dateTimeStart) : null;
    const dateEnd = update.dateTimeEnd ? parseISO(update.dateTimeEnd) : null;
    const formattedDateStart = dateStart ? format(dateStart, 'MMMM dd, yyyy') : null;
    const formattedDateEnd = dateEnd ? format(dateEnd, 'MMMM dd, yyyy') : null;
    return (
        <Card onClick={onClick} className="shadow-sm border-0" style={{ cursor: "pointer", height: "300px", display: "flex", flexDirection: "column" }}>
            <div className="position-relative" style={{ height: "200px", overflow: "hidden" }}>
                {isLoading && (
                    <div className="position-absolute top-50 start-50 translate-middle">
                        <Spinner animation="border" size="sm" />
                    </div>
                )}
                <Card.Img
                    variant="top"
                    src={update.headerImage}
                    style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                        opacity: isLoading ? 0 : 1,
                    }}
                />
            </div>

            <Card.Body className="text-background-solid-color" style={{ flex: "1 1 auto", overflowY: "auto", padding: "1rem" }}>
                <div className="home-button-content text-background-solid-color">
                    <p className="card-button-name">{update.title}</p>
                    <p className="card-button-caption d-none d-sm-block">{Array.isArray(update.origin) ? update.origin.join(", ") : ""}</p>
                    <p className="card-button-caption d-none d-sm-block">{update.name}</p>
                    {formattedDateStart && (
                        <p className="card-button-caption d-none d-sm-block">
                            {collectionName === "updates"
                                ? formattedDateStart
                                : formattedDateStart && formattedDateEnd
                                    ? `${formattedDateStart} - ${formattedDateEnd}`
                                    : formattedDateStart}
                        </p>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};


export default DUalCarousel;
