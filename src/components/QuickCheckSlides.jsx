import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { NavLink } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { parseISO, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';


const UpdatesCarousel = ({ collectionName, categoryOptions, classificationOptions, title, caption, filterType }) => {
  const navigate = useNavigate();

  const handleReadMore = (collectionName, dataId) => {
    navigate(`/infoguideapp/read/${collectionName}/${dataId}`);
  };

  const [updates, setUpdates] = useState([]);
  const [filteredUpdates, setFilteredUpdates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(3); // Set to 3 items per page

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

    setFilteredUpdates(filtered);
    setCurrentPage(1);
  }, [updates, selectedFilter, searchQuery, filterType]);

  const totalPages = Math.ceil(filteredUpdates.length / itemsPerPage);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
    }, 8000);

    return () => clearInterval(interval);
  }, [totalPages]);

  const currentUpdates = filteredUpdates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filterOptions = filterType === "category" ? categoryOptions : classificationOptions;

  return (
    <div className="home-section">
      <h2 className="home-section-title">{title}</h2>
      <p className="home-section-subtitle">{caption}</p>

      {/* Search and Filter */}
      <div className="search-container text-center mb-4 mx-1">
        <Row className="row">
          <Col md={8} sm={8} xs={8} className="col px-2">
            <Form.Control
              type="text"
              placeholder={`Search here`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>

          <Col md={4} sm={4} xs={4} className="col px-2">
            <Form.Control
              as="select"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="" disabled>
                {filterType === "category" ? "Categories" : "Classification"}
              </option>
              {["All", ...filterOptions].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Row>
      </div>

      {/* Carousel */}
      <div className="carousel-wrapper position-relative">
        <div className="row justify-content-start">
          {currentUpdates.map((update) => (
            <div className="col-12 col-md-4 mb-4" key={update.id}>
              <UpdateCard
                update={update}
                collectionName={collectionName}
                onReadMore={() => handleReadMore(collectionName, update.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <NavLink to={`/infoguideapp/update/${collectionName}`} className="discover-more-btn">
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

const UpdateCard = ({ update, collectionName, onReadMore }) => {
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
    <div className="pagination-component-card" onClick={onReadMore} style={{ cursor: 'pointer' }}>
      <div className="image-slider-container">
        {isLoading && <div className="image-loader"><div className="spinner"></div></div>}
        <div
          className="image-slider"
          style={{
            backgroundImage: `url(${update.headerImage})`,
            opacity: isLoading ? 0 : 1
          }}
        ></div>
      </div>
      <div className="home-button-content text-background-solid-color">
        <p className="card-button-name">{update.title}</p>
        <p className="card-button-caption d-none d-sm-block">{Array.isArray(update.origin) ? update.origin.join(', ') : ''}</p>
        <p className="card-button-caption d-none d-sm-block">{update.name}</p>
        <p className="card-button-caption fw-bold mb-1 mt-3 d-none d-sm-block">
          {(update.category || update.classification)}
        </p>

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
    </div>
  );
};

export default UpdatesCarousel;
