import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useParams, useNavigate } from "react-router-dom";
import FooterCustomized from "../components/footer/Footer";
import { Row, Col} from "react-bootstrap";
import { parseISO, format } from "date-fns";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";



const CarouselListPage = ({ title, caption }) => {
  const navigate = useNavigate();

  const { collectionName } = useParams();

  const handleReadMore = (collectionName, dataId) => {
    navigate(`/read/${collectionName}/${dataId}`);
  };

  const [sustainableData, setSustainableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categorySlideIndex, setCategorySlideIndex] = useState({});

  useEffect(() => {
    const fetchSustainableData = async () => {
      if (!collectionName) return;
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSustainableData(data);

      const uniqueCategories = ["All", ...new Set(data.map(item => item.category))];
      setCategoryOptions(uniqueCategories);
    };
    fetchSustainableData();
  }, [collectionName]);

  useEffect(() => {
    const filtered = selectedCategory === "All"
      ? sustainableData
      : sustainableData.filter((item) => item.category === selectedCategory);
    setFilteredData(filtered);
  }, [sustainableData, selectedCategory]);

  const groupedData = filteredData.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleSlide = (category, direction) => {
    const items = groupedData[category];
    const itemsPerPage = 3;
    const maxIndex = items.length - 1;
  
    setCategorySlideIndex((prev) => {
      const current = prev[category] || 0;
      let nextIndex;
  
      if (direction === "next") {
        nextIndex = (current + 1) % items.length;
      } else {
        nextIndex = (current - 1 + items.length) % items.length;
      }
  
      return { ...prev, [category]: nextIndex };
    });
  };
  

  const handleDotClick = (category, index) => {
    setCategorySlideIndex((prev) => ({
      ...prev,
      [category]: index,
    }));
  };

  return (
    <>
    <div className="home-section">
      <Row>
            <Col md={12}>
            <a
                    className="text-decoration-none d-block mb-5"
                    style={{ cursor: "pointer", color: "black" }}
                  >
                    <span
                      onClick={() => navigate(`/home`)}
                      style={{ color: "black", marginRight: "5px", fontSize: "0.90rem"  }}
                    >
                      home
                    </span>
                    <span
                      onClick={() => navigate(`/slideshow/${collectionName}`)}
                      style={{ color: "black", margin: "0 5px", fontSize: "0.90rem"   }}
                    >
                      / {collectionName}
                    </span>
                  </a>

            </Col>
          </Row>
      <h2 className="home-section-title">{title}</h2>
      <p className="home-section-subtitle">{caption}</p>

      <div className="carousel-wrapper position-relative">
        {Object.keys(groupedData).map((category) => {
          const items = groupedData[category];
          const slideIndex = categorySlideIndex[category] || 0;
          const itemsPerPage = 3;
          const totalSlides = items.length;
          const start = slideIndex;
          const end = start + itemsPerPage;
          const currentItems = items;

          
          return (
            <div key={category} className="mb-5 mt-4">
              <h3 className="text-center mb-4 carousel-title mt-5">{category}</h3>

              <div className="carousel-slide-container position-relative">
             

                <Slideshow collectionName={collectionName} slides={currentItems} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
          <FooterCustomized></FooterCustomized>

          </>
  );
};

const Slideshow = ({ slides, collectionName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0 || !slides[currentIndex]) return null;

  const currentSlide = slides[currentIndex];

  const getStartDate = (slide) =>
    slide?.dateTimeStart || slide?.dateStart || slide?.date || null;

  const getEndDate = (slide) =>
    slide?.dateTimeEnd || slide?.dateEnd || null;

  const dateStartRaw = getStartDate(currentSlide);
  const dateEndRaw = getEndDate(currentSlide);

  const dateStart = dateStartRaw ? parseISO(dateStartRaw) : null;
  const dateEnd = dateEndRaw ? parseISO(dateEndRaw) : null;

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
            transition: "opacity 1s ease-in-out"
          }}>
          <div
            className="slide-image"
            style={{
              backgroundImage: `url(${slide.headerImage})`,
              height: "300px",
              backgroundSize: "cover",
              backgroundPosition: "center"
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

export default CarouselListPage;
