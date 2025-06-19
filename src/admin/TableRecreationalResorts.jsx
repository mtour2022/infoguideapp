import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Button,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,  Spinner

} from "react-bootstrap";
import { db } from "../config/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons";
import RecreationalResortForm from "../components/recreationalresorts/RecreationalResortForm";
import EditingRecreationalResortForm from "../components/recreationalresorts/EditRecreationalResortForm";
import Swal from "sweetalert2";


const RecreatonalResortTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [classificationFilter, setClassificationFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [geoFilter, subGeoFilter] = useState("");
  const [barangayFilter, setBarangayFilter] = useState("");


  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(0);
  const [editingItem, setEditingItem] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const [loading, setLoading] = useState(true);
  

  const fetchData = async () => {
      try {
      const querySnapshot = await getDocs(collection(db, "resorts"));
      const dataList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(dataList);
      } catch(error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  // Delete an item from Firebase
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "resorts", id));
        fetchData(); // Refresh data
        Swal.fire("Deleted!", "Your entry has been deleted.", "success");
      }
    });
  };


  // Filtering and searching logic
const filteredData = data.filter((item) => {
    // Check subcategory filter
    const subCategoryMatch = subCategoryFilter === "" || item.subcategory === subCategoryFilter;
  
    // Check classification filter
    const classificationMatch = classificationFilter === "" || item.classification === classificationFilter;
  
    // Check geographic filter
    const geoMatch = geoFilter === "" || item.geo === geoFilter;
  
    // Check barangay filter
    const barangayMatch = barangayFilter === "" || item.address.barangay === barangayFilter;
  
    // Check search filter
    const searchTerm = search.toLowerCase();
    const searchMatch =
      item.name.toLowerCase().includes(searchTerm) ||
      item.established.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm) ||
      item.subcategory.toLowerCase().includes(searchTerm) ||
      item.classification.toLowerCase().includes(searchTerm) ||
      item.geo.toLowerCase().includes(searchTerm) ||
      item.address.barangay.toLowerCase().includes(searchTerm) ||
      item.address.street.toLowerCase().includes(searchTerm); // Remove the extra '||' here
  
    // Return true if all conditions are met
    return (
      subCategoryMatch &&
      classificationMatch &&
      geoMatch &&
      barangayMatch &&
      searchMatch
    );
  });
  
  const getFormattedDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0]; // Formats as YYYY-MM-DD
  };
  
  const exportToExcel = () => {
    const flattenedData = data.map(({ name, established, category, subcategory, classification, ...rest }) => {
      return {
        ...rest,
        facilities: Array.isArray(rest.facilities) ? rest.facilities.join(", ") : "", // Use rest.facilities
        activities: Array.isArray(rest.activities) ? rest.activities.join(", ") : "",
        images: Array.isArray(rest.images) ? rest.images.join(", ") : "",
        operatinghours: Array.isArray(rest.operatinghours) ? rest.operatinghours.join(", ") : "",
        socials: Array.isArray(rest.socials) ? rest.socials.join(", ") : "",
        address: rest.address ? JSON.stringify(rest.address) : "", // Convert objects to JSON string
      };
    });
  
    const ws = XLSX.utils.json_to_sheet(flattenedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `tourism_stories_infoguide_${getFormattedDate()}.xlsx`);
  };
  

  // Pagination logic
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // When "Add New" is clicked, clear editing state so the add form is shown
  const handleAddNew = () => {
    setEditingItem(null);
  };

  
  

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-1">Recreational Resorts</h1>
      <p>List of LGU-Recognized Recreational Resorts in Mainland Malay</p>
      {/* Search and Filters */}
      <Row>
        <Col md={6} className="mb-1 me-2 col">
          <Form.Control
            type="text"
            placeholder={`Search up to over ${data.length} recreational resorts`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={2} className="mb-1 me-2 col">
          <Form.Select
            value={subCategoryFilter}
            onChange={(e) => setSubCategoryFilter(e.target.value)}
          >
            <option value="">All Subcategories</option>
            {[...new Set(data.map((item) => item.subcategory))].map((subcategory, index) => (
              <option key={index} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2} className="mb-1 me-2 col">
          <Form.Select
            value={classificationFilter}
            onChange={(e) => setClassificationFilter(e.target.value)}
          >
            <option value="">All Classifications</option>
            {[...new Set(data.map((item) => item.classification))].map((classification, index) => (
              <option key={index} value={classification}>
                {classification}
              </option>
            ))}
          </Form.Select>
        </Col>
        
        
      </Row>
      <Row>
      <Col md={2} className="mb-1 me-2 col">
          <Form.Select
            value={geoFilter}
            onChange={(e) => setSubCategoryFilter(e.target.value)}
          >
            <option value="">All Geographical Location</option>
            {[...new Set(data.map((item) => item.geo))].map((geo, index) => (
              <option key={index} value={geo}>
                {geo}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2} className="mb-1 me-2 col">
          <Form.Select
            value={barangayFilter}
            onChange={(e) => setBarangayFilter(e.target.value)}
          >
            <option value="">All Barangays</option>
            {[...new Set(data.map((item) => item.address.barangay))].map((barangay, index) => (
              <option key={index} value={barangay}>
                {barangay}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Container className="d-flex justify-content-end align-items-center mt-2 mb-4">
          <Button variant="outline-secondary" className="me-2" onClick={fetchData}>
            <FontAwesomeIcon icon={faRefresh} size="xs" fixedWidth /> Refresh List
          </Button>
          <Button variant="outline-success" onClick={handleAddNew}>
            <FontAwesomeIcon icon={faPlus} size="xs" fixedWidth /> Add New
          </Button>
        </Container>
      </Row>

      {/* Data Table */}
      {loading ? (
      // Show spinner while loading data
      <div className="d-flex justify-content-center align-items-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : displayedData.length === 0 ? (
      // Show "No Data Available" message when list is empty
      <div className="text-center my-5">
        <h5>No Data Available</h5>
      </div>
    ) : (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Actions</th>
            <th>Business Name</th>
            <th>Established</th>
            <th>Category</th>
            <th>SubCategory</th>
            <th>Classification</th>
            <th>Geo Location</th>
            <th>Barangay</th>
            <th>Street</th>

          </tr>
        </thead>

  
        <tbody>
          {displayedData.map((item) => (
            <tr key={item.id}>
              <td>
                <Container className="d-flex justify-content-center align-items-center">
                  <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleEdit(item)}>
                      <FontAwesomeIcon icon={faEdit} size="xs" fixedWidth />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>
                      <FontAwesomeIcon icon={faTrash} size="xs" fixedWidth />
                    </Button>
                  </OverlayTrigger>
                </Container>
              </td>
              <td>{item.name}</td>
              <td>{item.established}</td>
              <td>{item.category}</td>
              <td>{item.subcategory}</td>
              <td>{item.classification}</td>
              <td>{item.geo}</td>
              <td>{item.address.barangay}</td>
              <td>{item.address.street}</td>

              
            </tr>
          ))}
        </tbody>
      </Table>
    )}

      {/* Pagination */}
      <Container className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <Button onClick={exportToExcel} variant="outline-success">
          Download Excel
        </Button>
        <ReactPaginate
          previousLabel={"◄"}
          nextLabel={"►"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination mb-0"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </Container>
      <Container className="empty-container"></Container>

      {/* Conditionally render the Edit or Add form */}
      {editingItem ? (
        <EditingRecreationalResortForm
        editingItem={editingItem}
        toAddForm={() => setEditingItem(null)} // This correctly switches back to the add form
        >

        </EditingRecreationalResortForm>
      ) : (
        <RecreationalResortForm></RecreationalResortForm>
      )}

    </Container>
  );
};

export default RecreatonalResortTable;
