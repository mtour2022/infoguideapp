import React, { useEffect, useState } from "react";
import { Container, Row, Spinner, Button, Col, Form, Dropdown } from "react-bootstrap";
import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import ListCard from "../components/listCard/ListCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMapLocationDot, faSearch, faSortAlphaDown, faSortAlphaUp, faSortNumericDown, faSortNumericUp } from "@fortawesome/free-solid-svg-icons";
import FooterCustomized from "../components/footer/Footer";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const ListViewPageComponent2 = () => {
  const { collectionName } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
    classification: "",
    purpose: "",
  });
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let q = query(
        collection(db, collectionName),
        orderBy("title"),
        limit(itemsPerPage)
      );
      
      try {
        const querySnapshot = await getDocs(q);
        const dataItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(dataItems);
        setFilteredData(dataItems);

        const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisible(lastVisibleDoc);
        setIsLastPage(dataItems.length < itemsPerPage);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, itemsPerPage]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const applyFilters = () => {
    let filtered = data;
  
    if (filters.category) {
      filtered = filtered.filter((item) =>
        item.category && item.category.includes(filters.category)
      );
    }
  
    if (filters.subcategory) {
      filtered = filtered.filter((item) =>
        item.subcategory && item.subcategory.includes(filters.subcategory)
      );
    }
  
    if (filters.classification) {
      filtered = filtered.filter((item) =>
        item.classification && item.classification.includes(filters.classification)
      );
    }
  
    if (filters.purpose) {
      filtered = filtered.filter((item) =>
        item.purpose && item.purpose.includes(filters.purpose)
      );
    }
  
    setFilteredData(filtered);
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
    updates: { title: "TOURISM UPDATES", subtitle: "Boracay Island Tourism Updates." },
    incomingEvents: { title: "Incoming Events", subtitle: "Series of Events to Experience." },
    stories: { title: "TOURISM STORIES", subtitle: "Tourism Articles to Read." },
    deals: { title: "DEALS, PROMOS, AND GIVEAWAYS", subtitle: "Get yourself the greatest deals!" },
  };

  return (
    <div className="home-section content-wrapper">
      <Row>
        <Col md={12}>
          <a className="text-decoration-none d-block mb-5" style={{ cursor: "pointer", color: "black" }}>
            <span onClick={() => navigate(`/infoguideapp/home`)} style={{ color: "black", marginRight: "5px", fontSize: "0.90rem" }}>home</span>
            <span onClick={() => navigate(`/infoguideapp/update/${collectionName}`)} style={{ color: "black", margin: "0 5px", fontSize: "0.90rem" }}>/ {collectionName}</span>
          </a>
        </Col>
      </Row>
      <h2 className="home-section-title">{sectionTitles[collectionName]?.title}</h2>
      <p className="home-section-subtitle">{sectionTitles[collectionName]?.subtitle}</p>

      <Row className="align-items-center">
        <Col xs={10} sm={10} md={10} className="position-relative">
          <Form.Control
            type="text"
            placeholder={`Search over ${data.length} ${collectionName}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>

        <Col xs={2} sm={2} md={2}>
          <Button className="search-button w-100 d-flex justify-content-center align-items-center gap-2" onClick={() => applyFilters()}>
            <FontAwesomeIcon icon={faSearch} />
            <span className="d-none d-sm-inline">Search</span>
          </Button>
        </Col>
      </Row>

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
                {[...new Set(data.map((item) => item.category).filter(Boolean))].length > 0 && (
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={filters.category}
                      onChange={(e) => handleFilterChange("category", e.target.value)}
                    >
                      <option value="">All</option>
                      {[...new Set(data.map((item) => item.category).filter(Boolean))].map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}

                {/* Subcategory */}
                {[...new Set(data.map((item) => item.subcategory).filter(Boolean))].length > 0 && (
                  <Form.Group className="mb-3">
                    <Form.Label>Subcategory</Form.Label>
                    <Form.Select
                      value={filters.subcategory}
                      onChange={(e) => handleFilterChange("subcategory", e.target.value)}
                    >
                      <option value="">All</option>
                      {[...new Set(data.map((item) => item.subcategory).filter(Boolean))].map((subcategory) => (
                        <option key={subcategory} value={subcategory}>{subcategory}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}

                {/* Classification */}
                {[...new Set(data.map((item) => item.classification).filter(Boolean))].length > 0 && (
                  <Form.Group className="mb-3">
                    <Form.Label>Classification</Form.Label>
                    <Form.Select
                      value={filters.classification}
                      onChange={(e) => handleFilterChange("classification", e.target.value)}
                    >
                      <option value="">All</option>
                      {[...new Set(data.map((item) => item.classification).filter(Boolean))].map((classification) => (
                        <option key={classification} value={classification}>{classification}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}

                {/* Purpose */}
                {[...new Set(data.map((item) => item.purpose).filter(Boolean))].length > 0 && (
                  <Form.Group className="mb-3">
                    <Form.Label>Purpose</Form.Label>
                    <Form.Select
                      value={filters.purpose}
                      onChange={(e) => handleFilterChange("purpose", e.target.value)}
                    >
                      <option value="">All</option>
                      {[...new Set(data.map((item) => item.purpose).filter(Boolean))].map((purpose) => (
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

      <Row className="mt-3">
        <Container className="empty-container"></Container>

        <Row className="justify-content-start mt-4">
          {filteredData.length > 0 ? (
            filteredData.map((item) => <ListCard key={item.id} data={item} collectionName={collectionName} />)
          ) : (
            <div>No {collectionName} found.</div>
          )}
        </Row>

        <div className="d-flex justify-content-between mt-4 px-2 mb-5">
          <Button disabled={loading || isLastPage} onClick={() => fetchData(true)}>Next</Button>
        </div>
        <FooterCustomized />
        </Row>
      </div>

    
    );
};

export default ListViewPageComponent2;
