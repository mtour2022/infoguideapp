import React, { useEffect, useState } from "react";
import { Container, Row, Spinner, Button, Col, Form, Dropdown } from "react-bootstrap";
import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import ListCard from "../components/listCard/ListCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMapLocationDot, faSearch, faSortAlphaDown, faSortAlphaUp, faSortNumericDown, faSortNumericUp, faTimes} from "@fortawesome/free-solid-svg-icons";
import MapPopup from "../components/mapSearch/MapSearchComponent";
import FooterCustomized from "../components/footer/Footer";

const AccommodationPage = ({ title, caption, link }) => {
  const [accommodations, setAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [sortOption, setSortOption] = useState("name-asc");
  const [itemsPerPage, setItemsPerPage] = useState(50); // Default for large screens
  const [isFirstPage, setIsFirstPage] = useState(true); // Add a new state
  const [showFilters, setShowFilters] = useState(false); // State to toggle filters
  const [addressFilters, setAddressFilters] = useState({
    street: [],
    barangay: [],
  });
  const [filters, setFilters] = useState({
    classification: [],
    geo: [],
    accessibility: [],
  });
  const [showMap, setShowMap] = useState(false); // Manage popup visibility
  const [isMapVisible, setIsMapVisible] = useState(true);
   // Effect to reset map visibility when it is closed
   useEffect(() => {
    if (!showMap) {
      setIsMapVisible(false); // Hide map when it's closed
    } else {
      setIsMapVisible(true); // Show map when it's opened
    }
  }, [showMap]);

  // Adjust items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {  // Small screen (mobile)
        setItemsPerPage(20);
      } else {  // Larger screens (tablet, desktop)
        setItemsPerPage(50);
      }
    };

    handleResize(); // Set initial itemsPerPage based on the current window size
    window.addEventListener("resize", handleResize); // Listen for window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup event listener
    };
  }, []);

   // Handle map search button click
   const handleOpenMap = () => {
    setShowMap(true); // Show the map popup when clicked
  };

  // Close the map popup
  const handleCloseMap = () => {
    setShowMap(false);
  };

  const fetchAccommodations = async (nextPage = false) => {
    setLoading(true);
    let q;

    if (nextPage && lastVisible) {
      q = query(
        collection(db, "accommodations"),
        orderBy("name"),
        startAfter(lastVisible),
        limit(itemsPerPage)
      );
    } else {
      q = query(
        collection(db, "accommodations"),
        orderBy("name"),
        limit(itemsPerPage)
      );
      setIsFirstPage(true); // This ensures we mark the first page properly

    }

    try {
      const querySnapshot = await getDocs(q);
      const accommodationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAccommodations(accommodationsData);
      setFilteredAccommodations(accommodationsData);

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      setIsLastPage(accommodationsData.length < itemsPerPage);
    } catch (error) {
      console.error("Error fetching accommodations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccommodations();
  }, [itemsPerPage]);

  const handleNextPage = () => {
    fetchAccommodations(true);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAccommodations(accommodations);
    } else {
      const results = accommodations.filter(accommodation =>
        accommodation.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAccommodations(results);
    }
  }, [searchQuery, accommodations]);

  const handlePreviousPage = async () => {

      if (isFirstPage) return; // Prevent going back if it's the first page


    setLoading(true);
    let q = query(
      collection(db, "accommodations"),
      orderBy("name"),
      startAfter(lastVisible),
      limit(itemsPerPage)
    );

    try {
      const querySnapshot = await getDocs(q);
      const accommodationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAccommodations(accommodationsData);
      setFilteredAccommodations(accommodationsData);

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      setIsLastPage(accommodationsData.length < itemsPerPage);
      setIsFirstPage(false); // Mark as not the first page anymore

    } catch (error) {
      console.error("Error fetching accommodations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle street or barangay filter changes
  const handleAddressFilterChange = (filterType, value) => {
    const updatedAddressFilters = { ...addressFilters };
    if (updatedAddressFilters[filterType].includes(value)) {
      updatedAddressFilters[filterType] = updatedAddressFilters[filterType].filter((item) => item !== value);
    } else {
      updatedAddressFilters[filterType].push(value);
    }
    setAddressFilters(updatedAddressFilters); // Update the state for address filters
  };
  

  const handleFilterChange = (filterType, value) => {
    const updatedFilters = { ...filters };
    if (updatedFilters[filterType].includes(value)) {
      updatedFilters[filterType] = updatedFilters[filterType].filter(
        (item) => item !== value
      );
    } else {
      updatedFilters[filterType].push(value);
    }
    setFilters(updatedFilters);
  };

  const applyFilters = () => {
    let filtered = accommodations;
  
    // Apply general filters
    Object.keys(filters).forEach((filterType) => {
      if (filters[filterType].length > 0) {
        filtered = filtered.filter((acc) =>
          filters[filterType].some((value) =>
            acc[filterType] && acc[filterType].toLowerCase().includes(value.toLowerCase())
          )
        );
      }
    });
  
    // Apply address filters for street and barangay
    Object.keys(addressFilters).forEach((filterType) => {
      if (addressFilters[filterType].length > 0) {
        filtered = filtered.filter((acc) =>
          addressFilters[filterType].some((value) =>
            acc.address && acc.address[filterType] && acc.address[filterType].toLowerCase().includes(value.toLowerCase())
          )
        );
      }
    });
  
    setFilteredAccommodations(filtered);
  };
  

  useEffect(() => {
    applyFilters();
  }, [filters, addressFilters]); // Make sure filters and addressFilters trigger the effect
  

  const handFilter = () => {
    setShowFilters(!showFilters); // Toggle filters visibility
  };

  const handleSearch = () => {
    const results = accommodations.filter(accommodation =>
      accommodation.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAccommodations(results);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setFilteredAccommodations([suggestion]);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearchInputChange = (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);

    if (newQuery.trim() === "") {
      setFilteredAccommodations(accommodations);
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      const matches = accommodations
        .filter(acc =>
          acc.name.toLowerCase().includes(newQuery.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    }
  };

  const handleSort = (sortKey) => {
    setSortOption(sortKey);
    let sortedList = [...filteredAccommodations];
    if (sortKey === "name-asc") {
      sortedList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortKey === "name-desc") {
      sortedList.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortKey === "rating-asc") {
      sortedList.sort((a, b) => a.ratings - b.ratings);
    } else if (sortKey === "rating-desc") {
      sortedList.sort((a, b) => b.ratings - a.ratings);
    }
    setFilteredAccommodations(sortedList);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <div className="home-section content-wrapper">
      <h2 className="home-section-title">ACCOMMODATION ESTABLISHMENTS</h2>
      <p className="home-section-subtitle">
        Department of Tourism (DOT) Accredited Accommodation Establishments in Boracay Island, Malay as of <b>March 2025</b>.
      </p>

      <Row className="align-items-center">
        <Col xs={10} sm={10} md={10} className="position-relative">
          <Form.Control
            type="text"
            placeholder={`Search over ${accommodations.length} accommodations`}
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 100);
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="autocomplete-dropdown position-absolute w-100 bg-white border rounded shadow-sm z-3">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-2 suggestion-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name}
                </div>
              ))}
            </div>
          )}
        </Col>

        <Col xs={2} sm={2} md={2}>
          <Button
            onClick={handleSearch}
            className="search-button w-100 d-flex justify-content-center align-items-center gap-2"
          >
            <FontAwesomeIcon icon={faSearch} />
            <span className="d-none d-sm-inline">Search</span>
          </Button>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col xs={4} md={4}>
          <Dropdown onSelect={(key) => handleSort(key)} className=" sort-dropdown  mb-2">
            <Dropdown.Toggle className="sort-options-button w-100">
              {sortOption === "name-asc" && (
                <>
                  <FontAwesomeIcon icon={faSortAlphaDown} className="me-1" />
                  <span className="d-none d-sm-inline ms-2">Name Ascending</span>
                </>
              )}
              {sortOption === "name-desc" && (
                <>
                  <FontAwesomeIcon icon={faSortAlphaUp} className="me-1" />
                  <span className="d-none d-sm-inline ms-2">Name Descending</span>
                </>
              )}
              {sortOption === "rating-asc" && (
                <>
                  <FontAwesomeIcon icon={faSortNumericUp} className="me-1" />
                  <span className="d-none d-sm-inline ms-2">Rating Ascending</span>
                </>
              )}
              {sortOption === "rating-desc" && (
                <>
                  <FontAwesomeIcon icon={faSortNumericDown} className="me-1" />
                  <span className="d-none d-sm-inline ms-2">Rating Descending</span>
                </>
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu className="sort-dropdown-menu">
              <Dropdown.Item eventKey="name-asc">
                <FontAwesomeIcon icon={faSortAlphaDown} className="me-1" />
                Name Ascending
              </Dropdown.Item>
              <Dropdown.Item eventKey="name-desc">
                <FontAwesomeIcon icon={faSortAlphaUp} className="me-1" />
                Name Descending
              </Dropdown.Item>
              <Dropdown.Item eventKey="rating-asc">
                <FontAwesomeIcon icon={faSortNumericUp} className="me-1" />
                Rating Ascending
              </Dropdown.Item>
              <Dropdown.Item eventKey="rating-desc">
                <FontAwesomeIcon icon={faSortNumericDown} className="me-1" />
                Rating Descending
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={4} md={4}>
          <Button
          className="w-100 mb-2 sort-options-button"
            onClick={handFilter}
          >
            <FontAwesomeIcon icon={faFilter} />
            <span className="d-none d-sm-inline ms-2">Filter</span>
          </Button>
        </Col>
        <Col xs={4} md={4}>
          <Button
          className="w-100 sort-options-button"
            onClick={handleOpenMap}
          >
            <FontAwesomeIcon icon={faMapLocationDot} />
            <span className="d-none d-sm-inline ms-2">Map Search</span>
          </Button>
        </Col>
      </Row>

      {/* Map Popup Component */}
      {showMap && (
          <div className="map-popup-overlay">
            <Button className="close-button" onClick={() => {
              setShowMap(false);
              setIsMapVisible(false); // important to clean map state
            }}>
              <FontAwesomeIcon icon={faTimes} />
            </Button>

            <MapPopup
              accommodations={accommodations}
              isMapVisible={isMapVisible}
            />
          </div>
        )}


      {showFilters && (
  <Row className="mt-4">
    <Col xs={12}>
      <div className="filter-button-group">
        {/* For the general filters */}
        {Object.keys(filters).map((filterType) => (
          <div key={filterType} className="filter-buttons">
            {accommodations
              .map((accommodation) => accommodation[filterType])
              .flat()
              .filter((value, index, self) => value && value !== null && self.indexOf(value) === index)
              .map((value) => (
                <Button
                  key={value}
                  onClick={() => handleFilterChange(filterType, value)}
                  className={`btn ${
                    filters[filterType].includes(value) ? "btn-primary" : "btn-outline-secondary"
                  } filter-button`}
                >
                  {value}
                </Button>
              ))}
          </div>
        ))}

        {/* For the address filters */}
        {["street", "barangay"].map((filterType) => (
          <div key={filterType} className="filter-buttons">
            {accommodations
              .map((accommodation) => accommodation.address[filterType])
              .flat()
              .filter((value) => value && value !== null)
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((value) => (
                <Button
                  key={value}
                  onClick={() => handleAddressFilterChange(filterType, value)}
                  className={`btn ${
                    addressFilters[filterType].includes(value) ? "btn-primary" : "btn-outline-secondary"
                  } filter-button`}
                >
                  {value}
                </Button>
              ))}
          </div>
        ))}
      </div>
    </Col>
    <Row>
    <Col>
    </Col>
    </Row>
  </Row>
)}





      <Container className="empty-container"></Container>

      <Row className="justify-content-start mt-4">
        {filteredAccommodations.length > 0 ? (
          filteredAccommodations.map((accommodation) => (
            <ListCard key={accommodation.id} accommodation={accommodation} />
          ))
        ) : (
          <div>No accommodations found.</div>
        )}
      </Row>

      <div className="d-flex justify-content-between mt-4 px-2 mb-5">
      <Button onClick={handlePreviousPage} disabled={loading || isFirstPage}>
        Previous
      </Button>

        <Button onClick={handleNextPage} disabled={loading || isLastPage}>
          Next
        </Button>
      </div>
      <FooterCustomized></FooterCustomized>
    </div>
  );
};

export default AccommodationPage;
