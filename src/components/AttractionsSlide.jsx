
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { NavLink } from "react-router-dom";

const geoOptions = ["All", "Boracay Island", "Mainland Malay"];

const AttractionsSlide = () => {
  const [attractions, setAttractions] = useState([]);
  const [filteredAttractions, setFilteredAttractions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGeo, setSelectedGeo] = useState("All");

  const itemsPerPage = window.innerWidth < 768 ? 2 : 4; // Mobile-friendly
  const totalPages = Math.ceil(filteredAttractions.length / itemsPerPage);

  useEffect(() => {
    const fetchAttractions = async () => {
      const querySnapshot = await getDocs(collection(db, "attractions"));
      const attractionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAttractions(attractionsData);
    };

    fetchAttractions();
  }, []);

  useEffect(() => {
    const filtered =
      selectedGeo === "All"
        ? attractions
        : attractions.filter((attraction) => attraction.geo === selectedGeo);
    setFilteredAttractions(filtered);
    setCurrentPage(1);
  }, [attractions, selectedGeo]);

  const currentAttractions = filteredAttractions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="home-section">
      <h2 className="home-section-title">TOURIST HOT SPOTS</h2>
      <p className="home-section-subtitle">Explore the best places to visit.</p>

      {/* Geo Filters */}
      <div className="geo-filter-container text-center mb-4">
        {geoOptions.map((geo) => (
          <button
            key={geo}
            className={`geo-filter ${selectedGeo === geo ? "active" : ""}`}
            onClick={() => setSelectedGeo(geo)}
          >
            {geo}
          </button>
        ))}
      </div>

      {/* Attractions Grid */}
      <div className="container">
        {currentAttractions.length > 0 ? (
          <div className="row justify-content-start">
            {currentAttractions.map((attraction) => (
              <div className="col-md-6 col-sm-12 mb-4" key={attraction.id}>
                <AttractionCard attraction={attraction} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No attractions available</p>
        )}
      </div>

      {/* Pagination & "View All" Button */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <NavLink to="/attractions" className="discover-more-btn">
          View All
        </NavLink>
        <div className="d-flex align-items-center">
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="nav-icon mx-3"
            onClick={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
          />
          <span>{currentPage} / {totalPages || 1}</span>
          <FontAwesomeIcon
            icon={faChevronRight}
            className="nav-icon mx-3"
            onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
          />
        </div>
      </div>
    </div>
  );
};

// ✅ AttractionCard Component
const AttractionCard = ({ attraction }) => {
  const [isHovered, setIsHovered] = useState(false);
  const images = [attraction.headerImage, ...(attraction.images?.slice(0, 1) || [])];

  return (
    <div
      className="pagination-component-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ImageSlider images={images} isHovered={isHovered} />
      <div className="pagination-component-gradient"></div>
      <div className="home-button-content">
        <p className="pagination-component-name">{attraction.name}</p>
        <p className="home-button-caption">
          {attraction.geo}, {attraction.address?.barangay}
        </p>
      </div>
    </div>
  );
};

// ✅ ImageSlider Component (Handles Image Hover Effects)
const ImageSlider = ({ images, isHovered }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);

  // Preload images before showing them
  useEffect(() => {
    let loadedCount = 0;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) setIsLoading(false);
      };
    });
  }, [images]);

  useEffect(() => {
    if (!isHovered) {
      setTimeout(() => setActiveIndex(0), 500);
      return;
    }

    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex + 1 < images.length ? prevIndex + 1 : 0
      );
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [isHovered, images.length]);

  return (
    <div className="image-slider-container">
      {isLoading && (
        <div className="image-loader">
          <div className="spinner"></div>
        </div>
      )}

      {images.map((image, index) => (
        <div
          key={index}
          className={`image-slider ${index === activeIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      ))}
    </div>
  );
};

export default AttractionsSlide;
