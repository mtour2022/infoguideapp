import React, { useEffect, useState } from "react";
import { Container, Row, Spinner, Button, Col, Form, Dropdown } from "react-bootstrap";
import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy, limit, startAfter, getCountFromServer } from "firebase/firestore";
import ListCard from "../components/listCard/ListCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMapLocationDot, faSearch, faSortAlphaDown, faSortAlphaUp, faSortNumericDown, faSortNumericUp, faTimes } from "@fortawesome/free-solid-svg-icons";
import MapPopup from "../components/mapSearch/MapSearchComponent";
import FooterCustomized from "../components/footer/Footer";
import { useParams, useNavigate } from 'react-router-dom';
const ListViewPageComponent = ({ }) => {
  const [totalCount, setTotalCount] = useState(0);
  const { collectionName } = useParams();
  const navigate = useNavigate();
  
  const [pageCursors, setPageCursors] = useState([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allData, setAllData] = useState([]); // To store all data for suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [sortOption, setSortOption] = useState("name-asc");
  const [itemsPerPage, setItemsPerPage] = useState(20); // Default for large screens
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

  const fetchAllData = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, collectionName), orderBy("name")));
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllData(documents);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  };
  // Fetch data as usual, but this function is only used for paginated data
  const fetchData = async (direction = "initial") => {
    setLoading(true);

    try {
      let q = query(collection(db, collectionName), orderBy("name"), limit(itemsPerPage));

      if (direction === "next" && lastVisible) {
        q = query(q, startAfter(lastVisible));
      } else if (direction === "prev" && pageCursors.length >= 2) {
        const prevCursor = pageCursors[pageCursors.length - 2];
        q = query(collection(db, collectionName), orderBy("name"), startAfter(prevCursor), limit(itemsPerPage));
      }

      if (direction === "initial") {
        const countSnapshot = await getCountFromServer(collection(db, collectionName));
        setTotalCount(countSnapshot.data().count);
      }

      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (direction === "next") {
        setPageCursors([...pageCursors, querySnapshot.docs[0]]);
      } else if (direction === "prev") {
        setPageCursors(prev => prev.slice(0, -1));
      } else {
        setPageCursors(querySnapshot.docs.length ? [querySnapshot.docs[0]] : []);
      }

      setData(documents);
      setFilteredData(documents);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setIsLastPage(querySnapshot.docs.length < itemsPerPage);
    } catch (error) {
      console.error("Pagination error:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchData("initial");
    fetchAllData(); // Fetch all data once when the page loads
  }, [collectionName]);




  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(data);
    } else {
      const results = data.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(results);
    }
  }, [searchQuery, data]);
  



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
    let filtered = data;

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

    setFilteredData(filtered);
  };


  useEffect(() => {
    applyFilters();
  }, [filters, addressFilters]); // Make sure filters and addressFilters trigger the effect


  const handFilter = () => {
    setShowFilters(!showFilters); // Toggle filters visibility
  };

  const handleSearch = () => {
    const results = allData.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(results);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    // setFilteredData([suggestion]);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearchInputChange = (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);

    if (newQuery.trim() === "") {
      setShowSuggestions(false);
    } else {
      const matches = allData
        .filter(acc => acc.name.toLowerCase().includes(newQuery.toLowerCase()))
        .slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    }
  };

  const handleSort = (sortKey) => {
    setSortOption(sortKey);
    let sortedList = [...filteredData];
    if (sortKey === "name-asc") {
      sortedList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortKey === "name-desc") {
      sortedList.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortKey === "rating-asc") {
      sortedList.sort((a, b) => a.ratings - b.ratings);
    } else if (sortKey === "rating-desc") {
      sortedList.sort((a, b) => b.ratings - a.ratings);
    }
    setFilteredData(sortedList);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const sectionTitles = {
    accommodations: {
      title: "ACCOMMODATION ESTABLISHMENTS",
      subtitle: (
        <>
          Department of Tourism (DOT) Accredited Accommodation Establishments in Boracay Island, Malay as of <b>March 2025</b>.
        </>
      ),
    },
    restaurants: {
      title: "RESTAURANTS",
      subtitle: (
        <>
          Department of Tourism (DOT) Accredited Restaurants in Boracay Island, Malay as of <b>March 2025</b>.
        </>
      ),
    },
    spaAndWellnessCentres: {
      title: "SPA AND WELLNESS CENTERS",
      subtitle: (
        <>
          Department of Tourism (DOT) Accredited Spa and Wellness Centers in Boracay Island, Malay as of <b>March 2025</b>.
        </>
      ),
    },
    MICEFacilities: {
      title: "M.I.C.E. FACILITIES",
      subtitle: (
        <>
          Department of Tourism (DOT) Accredited M.I.C.E. Facilities in Boracay Island, Malay as of <b>March 2025</b>.
        </>
      ),
    },
    touristLandAndAirTransportOperators: {
      title: "TOURIST LAND & AIR TRANSPORT OPERATORS",
      subtitle: (
        <>
          Department of Tourism (DOT) Accredited Land and Air Transport Operators in Malay as of <b>March 2025</b>.
        </>
      ),
    },
    travelAndTourOperators: {
      title: "TRAVEL AND TOUR OPERATORS",
      subtitle: (
        <>
          Department of Tourism (DOT) Accredited Travel and Tour Operators in Malay as of <b>March 2025</b>.
        </>
      ),
    },
    tourguides: {
      title: "TOUR GUIDES",
      subtitle: (
        <>
          Department of Tourism (DOT) Accredited Tour Guides in Malay and Region VI as of <b>March 2025</b>.
        </>
      ),
    },
    touristAndSpecialtyShops: {
      title: "TOURIST SHOPS AND SPECIALTY SHOPS",
      subtitle: (
        <>
          Department of Tourism (DOT) Accredited Tourist and Specialty Shops in Boracay Island, Malay as of <b>March 2025</b>.
        </>
      ),
    },
    attractions: {
      title: "TOURIST HOT SPOTS",
      subtitle: (
        <>
          Attractions to disccover.
        </>
      ),
    },
    activities: {
      title: "TOURIST ACTIVITIES",
      subtitle: (
        <>
          Exciting activities to try.
        </>
      ),
    },
    touristActivityProviders: {
      title: "TOURIST ACTIVITY PROVIDERS",
      subtitle: (
        <>
          Elevate your experience with these tour activity providers.
        </>
      ),
    }
    // You can add more collectionName mappings here
  };

  return (
    <>
    <div className="home-section content-wrapper">
      <Row>
        <Col md={12}>
          <a
            className="text-decoration-none d-block mb-5"
            style={{ cursor: "pointer", color: "grey" }}>
            <span
              onClick={() => navigate(`/home`)}
              style={{ color: "grey", marginRight: "5px", fontSize: "0.90rem" }}>
              home
            </span>
            <span
              onClick={() => navigate(`/enterprises/${collectionName}`)}
              style={{ color: "grey", margin: "0 5px", fontSize: "0.90rem" }}>
              / {collectionName}
            </span>
          </a>
        </Col>
      </Row>
      <h2 className="home-section-title">{sectionTitles[collectionName]?.title}</h2>
      <p className="home-section-subtitle">{sectionTitles[collectionName]?.subtitle}</p>
      <Row className="align-items-center">
        <Col xs={10} sm={10} md={10} className="position-relative">
          <Form.Control
            type="text"
            placeholder={`Search over ${totalCount} ${collectionName}`}
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
          <div className="d-none d-md-block position-absolute" style={{ top: '50%', right: '10px', transform: 'translateY(-50%)' }}>
            <i className="bi bi-search" style={{ fontSize: '1.5rem', cursor: 'pointer' }} onClick={handleSearch}></i>
          </div>

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
        {collectionName !== 'activities' && (
          <Button
            className="w-100 sort-options-button"
            onClick={handleOpenMap}
          >
            <FontAwesomeIcon icon={faMapLocationDot} />
            <span className="d-none d-sm-inline ms-2">Map Search</span>
          </Button>
        )}

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
            datas={allData}
            collectionName={collectionName}
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
                  {data
                    .map((data) => data[filterType])
                    .flat()
                    .filter((value, index, self) => value && value !== null && self.indexOf(value) === index)
                    .map((value) => (
                      <Button
                        key={value}
                        onClick={() => handleFilterChange(filterType, value)}
                        className={`btn ${filters[filterType].includes(value) ? "btn-primary" : "btn-outline-secondary"
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
                  {data
                    .map((data) => data.address[filterType])
                    .flat()
                    .filter((value) => value && value !== null)
                    .filter((value, index, self) => self.indexOf(value) === index)
                    .map((value) => (
                      <Button
                        key={value}
                        onClick={() => handleAddressFilterChange(filterType, value)}
                        className={`btn ${addressFilters[filterType].includes(value) ? "btn-primary" : "btn-outline-secondary"
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
        {filteredData.length > 0 ? (
          filteredData.map((data) => (
            <ListCard key={data.id} data={data} collectionName={collectionName} />
          ))
        ) : (
          <div>No enterprises found.</div>
        )}
      </Row>
      <Row className="my-4">
        <Col className="d-flex justify-content-center gap-2">
          <Button
            variant="secondary"
            disabled={pageCursors.length <= 1}
            onClick={() => fetchData("prev")}
          >
            Prev Page
          </Button>
          <Button
            variant="secondary"
            disabled={isLastPage}
            onClick={() => fetchData("next")}
          >
            Next Page
          </Button>
        </Col>
      </Row>



    </div>
          <FooterCustomized></FooterCustomized>
</>
  );
};

export default ListViewPageComponent;
