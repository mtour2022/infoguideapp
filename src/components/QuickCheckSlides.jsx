import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { NavLink } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import { parseISO, format } from 'date-fns';
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

const UpdatesCarousel = ({ collectionName, categoryOptions, classificationOptions, title, caption, filterType }) => {
  const [updates, setUpdates] = useState([]);
  const [filteredUpdates, setFilteredUpdates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 768 ? 2 : 4);
  const [dateRange, setDateRange] = useState([null, null]); // [startDate, endDate]

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
      const updatesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUpdates(updatesData);
    };
    fetchUpdates();
  }, [collectionName]);

  useEffect(() => {
    let filtered = selectedFilter === "All" ? updates : updates.filter((update) => update[filterType] === selectedFilter);
    
    if (searchQuery) {
      filtered = filtered.filter((update) => update.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (dateRange[0]) {
      filtered = filtered.filter((update) => new Date(update.dateTimeStart) >= new Date(dateRange[0]));
    }
    if (dateRange[1]) {
      filtered = filtered.filter((update) => new Date(update.dateTimeEnd) <= new Date(dateRange[1]));
    }

    setFilteredUpdates(filtered);
    setCurrentPage(1);
  }, [updates, selectedFilter, searchQuery, filterType, dateRange]);

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

      <div className="search-container text-center mb-4 mx-1">
        <Row className="row">
          <Col md={8} sm={6} xs={6}  className="col px-2">
            <Form.Control
              type="text"
              placeholder={`Search here`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          
            <Col md={3} sm={6} xs={6} className="col px-2" style={{ position: 'relative', zIndex: 10 }}>
              <Form.Group>
                <DatePicker
                  selected={dateRange[0]}
                  onChange={(dates) => setDateRange(dates)}
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  selectsRange
                  isClearable
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select Date Range"
                  className="form-control"
                />
              </Form.Group>
            </Col>
         
        </Row>
      </div>



      <div className="container">
        {currentUpdates.length > 0 ? (
          <div className="row justify-content-start">
            {currentUpdates.map((update) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-6 mb-4" key={update.id}>
                <UpdateCard update={update} collectionName={collectionName} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No updates available</p>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <NavLink to={`/${collectionName}`} className="discover-more-btn">
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

const UpdateCard = ({ update, collectionName }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = update.headerImage;
    img.onload = () => setIsLoading(false);
  }, [update.headerImage]);

  // Ensure that dateTimeStart and dateTimeEnd are available and valid
  const dateStart = update.dateTimeStart ? parseISO(update.dateTimeStart) : null;
  const dateEnd = update.dateTimeEnd ? parseISO(update.dateTimeEnd) : null;

  // Format the dates only if they are valid
  const formattedDateStart = dateStart 
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(dateStart) 
    : null; // Fallback if dateStart is not available

  const formattedDateEnd = dateEnd
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(dateEnd)
    : null; // Fallback if dateEnd is not available

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
      <div className="home-button-content text-background-solid-color">
        <p className="home-button-name">{update.title}</p>
        <p className="home-button-caption fw-bold mb-2 mt-2">{(update.category || update.classification)?.toUpperCase()}</p>
        {formattedDateStart && (
          <p className="home-button-caption">
            <FontAwesomeIcon icon={faCalendar} className="me-2" />
            {collectionName === "updates" ? formattedDateStart : `${formattedDateStart} - ${formattedDateEnd}`}
          </p>
        )}

      </div>
    </div>
  );
};

export default UpdatesCarousel;
