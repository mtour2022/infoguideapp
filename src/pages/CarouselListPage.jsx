import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useParams, useNavigate } from "react-router-dom";
import FooterCustomized from "../components/footer/Footer";
import { Row, Col} from "react-bootstrap";



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
          const currentItems = Array.from({ length: itemsPerPage }, (_, i) => {
            return items[(start + i) % items.length];
          });
          
          return (
            <div key={category} className="mb-5 mt-4">
              <h3 className="text-center mb-4 carousel-title mt-5">{category}</h3>

              <div className="carousel-slide-container position-relative">
              <button
                className="btn btn-light position-absolute"
                  style={{ top: "40%", left: "-10px", zIndex: 9999 }} // Increased zIndex for left button
                  onClick={() => handleSlide(category, "prev")}
                >
                  &#10094;
                </button> 

                <div className="row carousel-slide">
                  {currentItems.map((item, index) => {
                    let colClass = index === 1
                      ? "col-12 col-sm-12 col-md-6 scale-up"
                      : "d-none d-sm-block col-sm-6 col-md-3";
                    return (
                      <>
                      <div className={`${colClass} d-flex justify-content-center`} key={item.id}>
                        <SustainableCard
                          item={item}
                          collectionName={collectionName}
                          onReadMore={() => handleReadMore(collectionName, item.id)}
                        />
                      </div>
                      </>
                    );
                  })}
                </div>

                <button
                  className="btn btn-light position-absolute"
                  style={{ top: "40%", right: "-10px", zIndex: 9999 }} // Increased zIndex for right button
                  onClick={() => handleSlide(category, "next")}
                >
                  &#10095;
                </button>

              </div>

            {/* Pagination Dots */}
              <div className="d-flex justify-content-center align-items-center mt-1 mb-5 customized-dot-pagination">
                {[...Array(totalSlides)].map((_, i) => (
                  <div
                    key={i}
                    className={`dot ${i === slideIndex ? "active" : ""}`}
                    onClick={() => handleDotClick(category, i)}
                  ></div>
                ))}
              </div>


            </div>
          );
        })}
      </div>
      <FooterCustomized></FooterCustomized>
    </div>
  );
};

const SustainableCard = ({ item, onReadMore }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = item.headerImage;
    img.onload = () => setIsLoading(false);
  }, [item.headerImage]);

  return (
    <div className="pagination-component-card" onClick={onReadMore} style={{ cursor: 'pointer' }}>
      <div className="image-slider-container">
        {isLoading && (
          <div className="image-loader">
            <div className="spinner"></div>
          </div>
        )}
        <div
          className="image-slider"
          style={{
            backgroundImage: `url(${item.headerImage})`,
            opacity: isLoading ? 0 : 1
          }}
        ></div>
      </div>
      <div className="home-button-content text-background-solid-color">
        <p className="card-button-name ">{item.title}</p>
        <p className="card-button-caption d-none d-sm-block">{item.category}</p>
      </div>
    </div>
  );
};

export default CarouselListPage;
