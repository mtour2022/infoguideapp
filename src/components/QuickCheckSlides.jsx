import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { NavLink } from "react-router-dom";

const UpdatesCarousel = ({ collectionName, categoryOptions, classificationOptions, title, caption, filterType }) => {
  const [updates, setUpdates] = useState([]);
  const [filteredUpdates, setFilteredUpdates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 768 ? 2 : 4);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 2 : 4);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(filteredUpdates.length / itemsPerPage);

  useEffect(() => {
    const fetchUpdates = async () => {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const now = new Date();
      const updatesData = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((update) => {
          if (update.dateTimeStart && update.dateTimeEnd) {
            const startDate = new Date(update.dateTimeStart);
            const endDate = new Date(update.dateTimeEnd);
            return now >= startDate && now <= endDate;
          }
          return true;
        });
      setUpdates(updatesData);
    };
    fetchUpdates();
  }, [collectionName]);

  useEffect(() => {
    const filtered = selectedFilter === "All"
      ? updates
      : updates.filter((update) => update[filterType] === selectedFilter);
    setFilteredUpdates(filtered);
    setCurrentPage(1);
  }, [updates, selectedFilter, filterType]);

  const currentUpdates = filteredUpdates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filterOptions = filterType === "category" ? categoryOptions : classificationOptions;

  return (
    <div className="home-section">
      <h2 className="home-section-title">{title}</h2>
      <p className="home-section-subtitle">{caption}</p>

      <div className="geo-filter-container text-center mb-4">
        {["All", ...filterOptions].map((option) => (
          <button
            key={option}
            className={`geo-filter ${selectedFilter === option ? "active" : ""}`}
            onClick={() => setSelectedFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="container">
        {currentUpdates.length > 0 ? (
          <div className="row justify-content-start">
            {currentUpdates.map((update) => (
              <div className="col-lg-3 col-md-6 col-sm-6 mb-4" key={update.id}>
                <UpdateCard update={update} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No updates available</p>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center">
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

const UpdateCard = ({ update }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = update.headerImage;
    img.onload = () => setIsLoading(false);
  }, [update.headerImage]);

  return (
    <div className="pagination-component-card">
      <div className="image-slider-container">
        {isLoading && (
          <div className="image-loader">
            <div className="spinner"></div>
          </div>
        )}
        <div
          className="image-slider"
          style={{
            backgroundImage: `url(${update.headerImage})`,
            opacity: isLoading ? 0 : 1
          }}
        ></div>
      </div>
      <div className="pagination-component-gradient"></div>
      <div className="home-button-content">
        <p className="home-button-name">{update.title}</p>
        <p className="home-button-caption">{update.category || update.classification}</p>
      </div>
    </div>
  );
};


export default UpdatesCarousel;