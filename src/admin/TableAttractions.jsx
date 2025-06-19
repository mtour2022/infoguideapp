import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Button,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Spinner,
} from "react-bootstrap";
import { db } from "../config/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons";
import AttractionsForm from "../components/attractions/AttractionsForm";
import Swal from "sweetalert2";
import EditAttractionsForm from "../components/attractions/EditAttractionsForm";


const AttractionTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [geoFilter, subGeoFilter] = useState("");
  const [barangayFilter, setBarangayFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");


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
    const querySnapshot = await getDocs(collection(db, "attractions"));
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
        await deleteDoc(doc(db, "attractions", id));
        fetchData(); // Refresh data
        Swal.fire("Deleted!", "Your entry has been deleted.", "success");
      }
    });
  };

// Filtering and searching logic
const filteredData = data.filter((item) => {
  // Check if categoryFilter is empty or exists in the item's category array
  const categoryMatch =
    categoryFilter === "" || item.category.includes(categoryFilter);

  // Check geographic filter
  const geoMatch = geoFilter === "" || item.geo === geoFilter;

  // Check barangay filter
  const barangayMatch =
    barangayFilter === "" || item.address.barangay === barangayFilter;

  // Check search filter
  const searchTerm = search.toLowerCase();
  const searchMatch =
    item.name.toLowerCase().includes(searchTerm) ||
    item.established.toLowerCase().includes(searchTerm) ||
    // For category, check if any element in the array matches the search term
    item.category.some((cat) => cat.toLowerCase().includes(searchTerm)) ||
    item.geo.toLowerCase().includes(searchTerm) ||
    item.address.barangay.toLowerCase().includes(searchTerm) ||
    item.address.street.toLowerCase().includes(searchTerm);

  // Return true if all conditions are met
  return categoryMatch && geoMatch && barangayMatch && searchMatch;
});


  const getFormattedDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0]; // Formats as YYYY-MM-DD
  };
  
  const exportToExcel = () => {
    const flattenedData = data.map(({ name, category, ...rest }) => {
      return {
        ...rest,
        body: Array.isArray(rest.body) ? rest.body.join(", ") : "",
        images: Array.isArray(rest.images) ? rest.images.join(", ") : "",
        operatinghours: Array.isArray(rest.operatinghours) ? rest.operatinghours.join(", ") : "",
        address: rest.address ? JSON.stringify(rest.address) : "", // Convert objects to JSON string
      };
    });
  
    const ws = XLSX.utils.json_to_sheet(flattenedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `tourism_attractions_infoguide_${getFormattedDate()}.xlsx`);
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
      <h1 className="text-2xl font-bold mb-1">Attractions</h1>
      <p>List of Attractions.</p>

      {/* Search and Filters */}
      <Row>
        
        <Col md={6} className="mb-1 me-2 col">
          <Form.Control
            type="text"
            placeholder={`Search up to over ${data.length} accommodations`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={2} className="mb-1 me-2 col">
          <Form.Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {[...new Set(data.flatMap(item => item.category))].map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </Col>

        
        
      </Row>
      <Row>
        <Col md={2} className="mb-1 me-2 col">
                  <Form.Select
                    value={geoFilter}
                    onChange={(e) => subGeoFilter(e.target.value)}
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
            <th>Category</th>
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
              <td>{Array.isArray(item.category) ? item.category.join(", ") : item.category}</td>
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
        <EditAttractionsForm
        editingItem={editingItem}
        toAddForm={() => setEditingItem(null)} // This correctly switches back to the add form
        >

        </EditAttractionsForm>
      ) : (
        <AttractionsForm></AttractionsForm>
      )}

    </Container>
  );
};

export default AttractionTable;
