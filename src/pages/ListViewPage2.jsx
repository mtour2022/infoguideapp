import React, { useEffect, useState } from "react";
import { Container, Row, Spinner, Button, Col, Form, Dropdown } from "react-bootstrap";
import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy, limit, startAfter, getCountFromServer  } from "firebase/firestore";
import ListCard from "../components/listCard/ListCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMapLocationDot, faSearch, faSortAlphaDown, faSortAlphaUp, faSortNumericDown, faSortNumericUp } from "@fortawesome/free-solid-svg-icons";
import FooterCustomized from "../components/footer/Footer";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const ListViewPageComponent2 = () => {
  const [totalCount, setTotalCount] = useState(0);

  const { collectionName } = useParams();
  const navigate = useNavigate();
  const [pageCursors, setPageCursors] = useState([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const [allData, setAllData] = useState([]); // To store all data for suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
    classification: "",
    purpose: "",
  });

  // Fetch all data (used for things like search suggestions, total display, etc.)
  const fetchAllData = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, collectionName), orderBy("title")));
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllData(documents);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  };

  // Fetch paginated data (with direction control: 'initial', 'next', 'prev')
  const fetchData = async (direction = "initial") => {
    setLoading(true);

    try {
      let q = query(collection(db, collectionName), orderBy("title"), limit(itemsPerPage));

      if (direction === "next" && lastVisible) {
        q = query(q, startAfter(lastVisible));
      } else if (direction === "prev" && pageCursors.length >= 2) {
        const prevCursor = pageCursors[pageCursors.length - 2];
        q = query(collection(db, collectionName), orderBy("title"), startAfter(prevCursor), limit(itemsPerPage));
      }

      if (direction === "initial") {
        const countSnapshot = await getCountFromServer(collection(db, collectionName));
        setTotalCount(countSnapshot.data().count);
      }

      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const now = new Date();
      const sortedByNearestDate = documents.sort((a, b) => {
        const dateA = new Date(a.dateTimeStart || a.date || 0);
        const dateB = new Date(b.dateTimeStart || b.date || 0);

        const timeA = dateA >= now ? dateA.getTime() : Infinity;
        const timeB = dateB >= now ? dateB.getTime() : Infinity;

        return timeA - timeB;
      });

      if (direction === "next") {
        setPageCursors(prev => [...prev, querySnapshot.docs[0]]);
      } else if (direction === "prev") {
        setPageCursors(prev => prev.slice(0, -1));
      } else {
        setPageCursors(querySnapshot.docs.length ? [querySnapshot.docs[0]] : []);
      }

      setData(sortedByNearestDate);
      setFilteredData(sortedByNearestDate);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setIsLastPage(querySnapshot.docs.length < itemsPerPage);
    } catch (error) {
      console.error("Pagination error:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to trigger both functions on mount or when collectionName changes
  useEffect(() => {
    fetchData("initial");
    fetchAllData();
  }, [collectionName]);



  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(data);
    } else {
      const results = data.filter(data =>
        data.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(results);
    }
  }, [searchQuery, data]);



  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const applyFilters = () => {
    let filtered = data;

    // Helper function to match filters
    const matchFilter = (itemValue, filterValue) => {
      if (!itemValue || !filterValue) return true; // No filter applied
      if (Array.isArray(itemValue)) {
        // Flatten array and ensure uniqueness
        const uniqueValues = [...new Set(itemValue)];
        return uniqueValues.includes(filterValue);
      }
      return itemValue === filterValue;
    };

    filtered = filtered.filter((item) =>
      matchFilter(item.category, filters.category) &&
      matchFilter(item.subcategory, filters.subcategory) &&
      matchFilter(item.classification, filters.classification) &&
      matchFilter(item.purpose, filters.purpose)
    );

    setFilteredData(filtered);
  };

  const handleSearch = () => {
    const results = allData.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(results);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
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
        .filter(acc => acc.title.toLowerCase().includes(newQuery.toLowerCase()))
        .slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const handleSort = (sortKey) => {
    setSortOption(sortKey);
    let sortedList = [...filteredData];

    if (sortKey === "name-asc") {
      sortedList.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortKey === "name-desc") {
      sortedList.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortKey === "date-asc") {
      sortedList.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortKey === "date-desc") {
      sortedList.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setFilteredData(sortedList);
  };

  const sectionTitles = {
    updates: { title: "TOURISM UPDATES", subtitle: "Stay updated with the latest happenings." },
    incomingEvents: { title: "INCOMING EVENTS", subtitle: "Series of Events to Experience." },
    stories: { title: "TOURISM STORIES", subtitle: "Tourism Articles to Read." },
    deals: { title: "DEALS, PROMOS, AND GIVEAWAYS", subtitle: "Get yourself the greatest deals!" },
    tourismMarkets: { title: "TOURISM NICHE", subtitle: "Find out what makes Boracay special!" },
    lifeStyles: { title: "LIFE STYLES AND FACILITIES", subtitle: "Get to know more about Boracay!" },
    helpfulLinks: { title: "HELPFUL LINKS", subtitle: "Planning? Here's different references for you!" },
    cruiseShips: { title: "CRUISE SHIP ARRIVALS", subtitle: "Data for Cruise Ship Arrival in Boracay Island." },
    tourismProjects: { title: "TOURISM PROJECTS AND PROGRAMS", subtitle: "Explore initiatives supporting sustainable tourism." },
    awardsAndRecognitions: { title: "AWARDS, RECOGNITIONS, AND CERTIFICATIONS", subtitle: "Municipality of Malay achievements in tourism excellence." },
    travelExpos: { title: "TRAVEL EXPOS, EXHIBITS, CONFERENCES, B2B, AND ROADSHOWS", subtitle: "Promoting Malay tourism globally!" },
  };

  return (
    <div className="home-section content-wrapper">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Row>
            <Col md={12}>
              <a className="text-decoration-none d-block mb-5" style={{ cursor: "pointer", color: "black" }}>
                <span onClick={() => navigate(`/home`)} style={{ color: "black", marginRight: "5px", fontSize: "0.90rem" }}>home</span>
                <span onClick={() => navigate(`/update/${collectionName}`)} style={{ color: "black", margin: "0 5px", fontSize: "0.90rem" }}>/ {collectionName}</span>
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
                      {suggestion.title}
                    </div>
                  ))}
                </div>
              )}
            </Col>

            <Col xs={2} sm={2} md={2}>
              <Button className="search-button w-100 d-flex justify-content-center align-items-center gap-2" onClick={() => applyFilters()}>
                <FontAwesomeIcon icon={faSearch} />
                <span className="d-none d-sm-inline">Search</span>
              </Button>
            </Col>
          </Row>

          {collectionName !== "lifeStyles" && (
            <Row className="mt-3">
              <Col xs={4} md={4}>
                <Dropdown onSelect={(key) => handleSort(key)} className="sort-dropdown mb-2">
                  <Dropdown.Toggle className="sort-options-button w-100">
                    {sortOption === "name-asc" && <FontAwesomeIcon icon={faSortAlphaDown} className="me-1" />}
                    {sortOption === "name-desc" && <FontAwesomeIcon icon={faSortAlphaUp} className="me-1" />}
                    {sortOption === "date-asc" && <FontAwesomeIcon icon={faSortNumericUp} className="me-1" />}
                    {sortOption === "date-desc" && <FontAwesomeIcon icon={faSortNumericDown} className="me-1" />}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="sort-dropdown-menu">
                    <Dropdown.Item eventKey="date-asc"><FontAwesomeIcon icon={faSortNumericUp} className="me-1" /> Date Ascending</Dropdown.Item>
                    <Dropdown.Item eventKey="date-desc"><FontAwesomeIcon icon={faSortNumericDown} className="me-1" /> Date Descending</Dropdown.Item>
                    <Dropdown.Item eventKey="name-asc"><FontAwesomeIcon icon={faSortAlphaDown} className="me-1" /> Name Ascending</Dropdown.Item>
                    <Dropdown.Item eventKey="name-desc"><FontAwesomeIcon icon={faSortAlphaUp} className="me-1" /> Name Descending</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>

              <Col xs={4} md={4}>
                <Dropdown className="w-100 mb-2">
                  <Dropdown.Toggle className="w-100 sort-options-button">
                    <FontAwesomeIcon icon={faFilter} className="me-2" />
                    Filters
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="p-3" style={{ minWidth: "300px" }}>
                    {/* Category */}
                    {/* Category */}
                    {[...new Set(data.flatMap((item) =>
                      Array.isArray(item.category) ? item.category : [item.category]
                    ).filter(Boolean))].length > 0 && (
                        <Form.Group className="mb-3">
                          <Form.Label>Category</Form.Label>
                          <Form.Select
                            value={filters.category}
                            onChange={(e) => handleFilterChange("category", e.target.value)}
                          >
                            <option value="">All</option>
                            {[...new Set(data.flatMap((item) =>
                              Array.isArray(item.category) ? item.category : [item.category]
                            ).filter(Boolean))].map((category) => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      )}
                    {/* Subcategory */}
                    {[...new Set(data.flatMap((item) =>
                      Array.isArray(item.subcategory) ? item.subcategory : [item.subcategory]
                    ).filter(Boolean))].length > 0 && (
                        <Form.Group className="mb-3">
                          <Form.Label>SubCategory</Form.Label>
                          <Form.Select
                            value={filters.subcategory}
                            onChange={(e) => handleFilterChange("subcategory", e.target.value)}
                          >
                            <option value="">All</option>
                            {[...new Set(data.flatMap((item) =>
                              Array.isArray(item.subcategory) ? item.subcategory : [item.subcategory]
                            ).filter(Boolean))].map((subcategory) => (
                              <option key={subcategory} value={subcategory}>{subcategory}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      )}

                    {/* Classification */}
                    {[...new Set(data.flatMap((item) =>
                      Array.isArray(item.classification) ? item.classification : [item.classification]
                    ).filter(Boolean))].length > 0 && (
                        <Form.Group className="mb-3">
                          <Form.Label>Classification</Form.Label>
                          <Form.Select
                            value={filters.classification}
                            onChange={(e) => handleFilterChange("classification", e.target.value)}
                          >
                            <option value="">All</option>
                            {[...new Set(data.flatMap((item) =>
                              Array.isArray(item.classification) ? item.classification : [item.classification]
                            ).filter(Boolean))].map((classification) => (
                              <option key={classification} value={classification}>{classification}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      )}

                    {/* Purpose */}
                    {[...new Set(data.flatMap((item) =>
                      Array.isArray(item.purpose) ? item.purpose : [item.purpose]
                    ).filter(Boolean))].length > 0 && (
                        <Form.Group className="mb-3">
                          <Form.Label>Purpose</Form.Label>
                          <Form.Select
                            value={filters.purpose}
                            onChange={(e) => handleFilterChange("purpose", e.target.value)}
                          >
                            <option value="">All</option>
                            {[...new Set(data.flatMap((item) =>
                              Array.isArray(item.purpose) ? item.purpose : [item.purpose]
                            ).filter(Boolean))].map((purpose) => (
                              <option key={purpose} value={purpose}>{purpose}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      )}

                    <Button
                      variant="outline-danger"
                      className="w-100"
                      onClick={() => setFilters({ category: "", subcategory: "", classification: "", purpose: "" })}
                    >
                      Reset Filters
                    </Button>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>


              <Col xs={4} md={4}>

              </Col>
            </Row>
          )}

          <Row className="mt-3">
            <Container className="empty-container"></Container>

            <Row className="justify-content-start mt-4">
              {filteredData.length > 0 ? (
                filteredData.map((item) => <ListCard key={item.id} data={item} collectionName={collectionName} />)
              ) : (
                <div>No {collectionName} found.</div>
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
            <FooterCustomized />
          </Row>
        </>
      )}

    </div>


  );
};

export default ListViewPageComponent2;
