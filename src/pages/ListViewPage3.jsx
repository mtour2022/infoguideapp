import React, { useEffect, useState } from "react";
import { Container, Row, Spinner, Button, Col, Form, Dropdown, Card, Image, Modal } from "react-bootstrap";
import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMapLocationDot, faSearch, faSortAlphaDown, faSortAlphaUp, faSortNumericDown, faSortNumericUp } from "@fortawesome/free-solid-svg-icons";
import FooterCustomized from "../components/footer/Footer";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const ListViewPageComponent3 = () => {
  const { collectionName } = useParams();
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState("name-asc");
  const [suggestions, setSuggestions] = useState([]);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
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
        limit(50)
      );

      try {
        const querySnapshot = await getDocs(q);
        const dataItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(dataItems);
        console.log(dataItems);

        setFilteredData(dataItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName]);


  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const handleSearch = () => {
    const results = data.filter(data =>
      (data.name ? data.name : data.title) // Use name if exists, otherwise use title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredData(results);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name || suggestion.title); // Use name if available, otherwise title
    setFilteredData([suggestion]);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearchInputChange = (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);

    if (newQuery.trim() === "") {
      setFilteredData(data);
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      const matches = data
        .filter(acc =>
          (acc.name ? acc.name : acc.title) // Check if name exists, otherwise use title
            .toLowerCase()
            .includes(newQuery.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    }
  };


  const handleSort = (sortKey) => {
    setSortOption(sortKey);
    let sortedList = [...filteredData];

    const getTitleOrName = (item) => item.title || item.name || "";

    if (sortKey === "name-asc") {
      sortedList.sort((a, b) => getTitleOrName(a).localeCompare(getTitleOrName(b)));
    } else if (sortKey === "name-desc") {
      sortedList.sort((a, b) => getTitleOrName(b).localeCompare(getTitleOrName(a)));
    }

    setFilteredData(sortedList);
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

  const groupedData = filteredData.reduce((acc, item) => {
    const category = item.category || "";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const sectionTitles = {
    ordinances: { title: "BEACH LAWS", subtitle: "Boracay Beach Ordinances to follow." },
    hotlines: { title: "HOTLINES", subtitle: "Emergency Hotlines and Tourist Assistance Hotlines." },

  };

  // Predefined fallback images
  const fallbackImages = {
    ordinances: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/a4size-landscape-beachlaws-min.png?alt=media&token=5cc831c5-386e-4a6f-bc09-39c8192769b1",
    hotlines: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/lettersize-portrait-hotlines-min.png?alt=media&token=1f7b2446-c20c-4b1a-b3e3-716b95958c02",
    tariff: "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/lettersize-portrait-tariffrates-min.png?alt=media&token=7f29524b-e91d-4db3-9871-499b2041d480",
  };

  // Fallback logic
  const getHeaderImage = () => {
    if (collectionName === "ordinances") return fallbackImages.ordinances;
    if (collectionName === "hotlines") return fallbackImages.hotlines;
    if (collectionName === "tariff") return fallbackImages.tariff;
    return data.headerImage;
  };

  // Body image modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const openImageModal = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage('');
  };
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
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
      {getHeaderImage() && (
        <Image
          src={getHeaderImage()}
          alt="Header"
          fluid
          rounded
          style={{ height: '500px', objectFit: 'cover' }}
          className={`article-headerImage mb-4 mt-4 ${data.className}`}
          onClick={() => openImageModal(getHeaderImage())}
        />
      )}
      <Row className="align-items-center">
        <Col xs={10} sm={10} md={10} className="position-relative">
          <Form.Control
            type="text"
            placeholder={`Search over ${data.length} ${collectionName}`}
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
        </Col>

        <Col xs={2} sm={2} md={2}>
          <Button className="search-button w-100 d-flex justify-content-center align-items-center gap-2" onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
            <span className="d-none d-sm-inline">Search</span>
          </Button>
        </Col>
      </Row>



      {collectionName === "hotlines" && (
        <Row className="mt-3">
          <Col xs={6} md={6}>
            <Dropdown onSelect={(key) => handleSort(key)} className="sort-dropdown mb-2">
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
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          {/* Filter Section */}
          <Col xs={6} md={6}>
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
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
                {/* Subcategory, Classification, Purpose similar to the original code */}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      )}

      




      {/* Carousel Section: Display grouped data */}
      {(collectionName === "hotlines"
        ? Object.keys(groupedData).sort((a, b) => {
          const categoryOrder = [
            "Emergency Hotline",
            "Tourist Inquiries and Complaints",
            "First Aid and Medical Attention",
            "Water Rescue",
            "Fire Supression",
            "Peace, Order, and Security",
            "Tourist Assistance",
            "Healthcare",
            "Mental Care",
            "Animal Welfare"
            // Add more if needed
          ];
          const indexA = categoryOrder.indexOf(a);
          const indexB = categoryOrder.indexOf(b);
          if (indexA === -1 && indexB === -1) return a.localeCompare(b);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        })
        : Object.keys(groupedData)
      ).map((category) => {
        const items = groupedData[category];
        const totalSlides = items.length;
        const itemsPerPage = 3;
        const slides = Array.from(
          { length: Math.ceil(totalSlides / itemsPerPage) },
          (_, i) => items.slice(i * itemsPerPage, (i + 1) * itemsPerPage)
        );

        return (
          <div key={category} className="mb-5 mt-4">
            <h3 className="text-center mb-4">{category}</h3>
            {slides.map((slide, slideIndex) => (
              <Row key={slideIndex} className="mb-4">
                {slide.map((item) => (
                 <Col
                  key={item.id}
                  md={collectionName === "touristFAQs" || collectionName === "requirements" ? 12 : 4}
                  className="d-flex mb-3"
                >
                  <ListCard3 data={item} collectionName={collectionName} navigate={navigate} />
                </Col>
               
                ))}
              </Row>
            ))}
          </div>
        );
      })}

      <Modal show={showImageModal} onHide={closeImageModal} centered size="lg">
        <Modal.Body className="gallery-modal d-flex justify-content-center align-items-center">
          {imageLoading && (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}

          <Image
            src={selectedImage}
            alt="Full View"
            fluid
            onLoad={handleImageLoad}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
        </Modal.Body>
      </Modal>



      <FooterCustomized />
    </div>
  );
};

export default ListViewPageComponent3;

const ListCard3 = ({ data, collectionName, navigate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };
  const image = data.logo || data.headerImage || data.images?.[0];
  const name = data.name || data.title;
  const category = data.category;

  
  const isVideoUrl = (url) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

  const hasNumbers = (arr) => Array.isArray(arr) && arr.length > 0;

  const [expandedSections, setExpandedSections] = useState([]);

const toggleBodySection = (index) => {
  setExpandedSections((prev) =>
    prev.includes(index)
      ? prev.filter((i) => i !== index)
      : [...prev, index]
  );
};

  return (
    <Card className="custom-listcard h-100">
      <div className="custom-listcard-inner">
        {image && (
         <div className="custom-listcard-image" style={{ backgroundImage: `url(${image})` }}></div>
        )}
        {/* <div className="custom-listcard-image" style={{ backgroundImage: `url(${image})` }}></div> */}
        <div className="custom-listcard-text">
          <h5 className="custom-listcard-title">{name}</h5>
          <p className="mb-1 fw-bold text-danger"><strong></strong> {category}</p>

          {hasNumbers(data.landline) && (
            <p className="mb-1"><strong>Landline:</strong> {data.landline.join(", ")}</p>
          )}

          {hasNumbers(data.mobile) && (
            <p className="mb-1"><strong>Mobile:</strong> {data.mobile.join(", ")}</p>
          )}

          {hasNumbers(data.satellite) && (
            <p className="mb-1"><strong>Satellite:</strong> {data.satellite.join(", ")}</p>
          )}

          {data.ordinance && (
            <p className="mb-1"><strong>{data.ordinance}</strong></p>
          )}

          {data.description &&
            data.description.trim() !== "" &&
            data.description.trim() !== "<p><br></p>" && (
              <div className="mb-1">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={toggleDescription}
                >
                  <div
                    className={isExpanded ? "expanded-description" : "collapsed-description"}
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: isExpanded ? "unset" : 1, // Limits the text to one line
                    }}
                    dangerouslySetInnerHTML={{
                      __html: isExpanded
                        ? data.description
                        : `${data.description.substring(0, 100)}...`, // Truncate text for collapsed state
                    }}
                  />
                  <FontAwesomeIcon
                    icon={isExpanded ? faChevronUp : faChevronDown}
                    className="ms-2"
                  />
                </div>
              </div>
            )}
{data.body?.map((section, index) => {
  const isExpandedSection = expandedSections.includes(index);
  const bodyContent = section.body || "";

  return (
    <div className="mb-3" key={index}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => toggleBodySection(index)}
      >
        <h6 className="mb-0">
          <strong>{section.subtitle}</strong>
        </h6>
        <FontAwesomeIcon
          icon={isExpandedSection ? faChevronUp : faChevronDown}
          className="ms-2"
        />
      </div>

      {section.image && isVideoUrl(section.image) && (
        <video controls className="article-body-video mt-2 mb-2" style={{ width: "100%" }}>
          <source src={section.image} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {section.image && !isVideoUrl(section.image) && (
        <Image
          src={section.image}
          alt="Section"
          fluid
          rounded
          className="article-body-image mt-2 mb-2"
          onClick={() => openImageModal?.(section.image)}
        />
      )}

      {section.image_source && (
        <small className="text-muted d-block mb-2">
          Source: {section.image_source}
        </small>
      )}

      {bodyContent && (
        <div
          className={isExpandedSection ? "expanded-description" : "collapsed-description"}
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: isExpandedSection ? "unset" : 1,
            marginTop: "0.25rem",
          }}
          dangerouslySetInnerHTML={{
            __html: isExpandedSection
              ? bodyContent
              : `${bodyContent.substring(0, 100)}...`,
          }}
        />
      )}
    </div>
  );
})}



        </div>
      </div>
    </Card>
  );
};
