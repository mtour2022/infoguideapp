import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { NavLink } from "react-router-dom";
import { activitiesCategoryOptions } from "../datamodel/activities_model";

const ActivitiesSlide = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // const itemsPerPage = 4; // Only 1 row, 4 items per row
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 768 ? 2 : 4);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 2 : 4);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  // Fetch activities from Firebase
  useEffect(() => {
    const fetchActivities = async () => {
      const querySnapshot = await getDocs(collection(db, "activities"));
      const activitiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivities(activitiesData);
    };

    fetchActivities();
  }, []);

  // Filter activities based on selected category
  useEffect(() => {
    const filtered =
      selectedCategory === "All"
        ? activities
        : activities.filter((activity) => activity.category === selectedCategory);
    setFilteredActivities(filtered);
    setCurrentPage(1);
  }, [activities, selectedCategory]);

  // Paginate activities
  const currentActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="home-section">
      <h2 className="home-section-title">TOURIST ACTIVITIES</h2>
      <p className="home-section-subtitle">Discover exciting activities to enjoy.</p>

      {/* Category Filters */}
      <div className="geo-filter-container text-center mb-4">
        {["All", ...activitiesCategoryOptions].map((category) => (
          <button
            key={category}
            className={`geo-filter ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Activities Grid (1 Row, 4 Items) */}
      <div className="container">
      {currentActivities.length > 0 ? (
        <div className="row justify-content-start">
          {currentActivities.map((activity) => (
            <div className="col-lg-3 col-md-6 col-sm-6 mb-4" key={activity.id}>
              <ActivityCard activity={activity} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No activities available</p>
      )}
    </div>


      {/* Pagination & "View All" Button */}
      <div className="d-flex justify-content-between align-items-center">
        <NavLink to="/activities" className="discover-more-btn">
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


const ActivityCard = ({ activity }) => {
  const [isHovered, setIsHovered] = useState(false);
  const images = [activity.headerImage, ...(activity.images?.slice(0, 1) || [])];

  return (
    <div
      className="pagination-component-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ImageSlider images={images} isHovered={isHovered} />
      <div className="pagination-component-gradient"></div>
      <div className="home-button-content">
        <p className="pagination-component-name">{activity.name}</p>
        <p className="home-button-caption">{activity.category}</p>
      </div>
    </div>
  );
};




const ImageSlider = ({ images, isHovered }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);

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

export default ActivitiesSlide;
