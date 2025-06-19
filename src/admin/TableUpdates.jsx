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
  Spinner
} from "react-bootstrap";
import { db } from "../config/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons";
import UpdateFormData from "../components/updates/UpdatesForm";
import EditUpdateForm from "../components/updates/EditUpdatesForm";

const UpdateTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
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
      const querySnapshot = await getDocs(collection(db, "updates"));
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

  // Sorting function for the date column
  const handleSort = () => {
    const sortedData = [...data].sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );
    setData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };


  // Delete an item from Firebase
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      await deleteDoc(doc(db, "updates", id));
      fetchData(); // Refresh data
    }
  };

  // Filtering and searching logic
  const filteredData = data.filter(
    (item) =>
      (categoryFilter === "" || item.category === categoryFilter) &&
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.classification.toLowerCase().includes(search.toLowerCase()) ||
        item.purpose.toLowerCase().includes(search.toLowerCase()) ||
        item.date.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.social.toLowerCase().includes(search.toLowerCase()))
  );

  const getFormattedDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0]; // Formats as YYYY-MM-DD
  };
  

  // Export to Excel
   const exportToExcel = () => {
      const flattenedData = data.map(({ title, ...rest }) => {
        return {
          ...rest,
          tags: Array.isArray(rest.tags) ? rest.tags.join(", ") : "", // Use rest.facilities
          origin: Array.isArray(rest.origin) ? rest.origin.join(", ") : "",
          headerImageSource: Array.isArray(rest.headerImageSource) ? rest.headerImageSource.join(", ") : "",
          references: Array.isArray(rest.references) ? rest.references.join(", ") : "",
          socials: Array.isArray(rest.socials) ? rest.socials.join(", ") : "",
            body: Array.isArray(rest.body)
            ? rest.body.map((item) => JSON.stringify(item)).join("; ") // Convert each object to a string
            : "",
        };
      });
    
      const ws = XLSX.utils.json_to_sheet(flattenedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      XLSX.writeFile(wb, `tourism_updates_infoguide_${getFormattedDate()}.xlsx`);
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
      <h1 className="text-2xl font-bold mb-1">Tourism Updates</h1>
      <p>List of Updates.</p>

      {/* Search and Filters */}
      <Row className="mb-4 mt-4">
        <Col md={4} className="mb-2 me-2 col">
          <Form.Control
            type="text"
            placeholder={`Search up to over ${data.length} articles`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={2} className="mb-2 me-2 col">
          <Form.Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Category</option>
            {[...new Set(data.map((item) => item.category))].map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </Col>
       
        <Container className="d-flex justify-content-end align-items-center mt-2">
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

            <th onClick={handleSort} style={{ cursor: "pointer" }}>
              Date {sortOrder === "asc" ? "▲" : "▼"}
            </th>
            <th>Classification</th>
            <th>Title</th>
            <th>Origin</th>
            <th>References</th>
            <th>Socials</th>
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
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{item.classification}</td>
              <td>{item.title}</td>
              <td>{Array.isArray(item.origin) ? item.origin.join(", ") : item.origin}</td>
            <td>{Array.isArray(item.references) ? item.references.join(", ") : item.references}</td>
            <td>{Array.isArray(item.socials) ? item.socials.join(", ") : item.socials}</td>
              
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

      {/* Conditionally render the Edit or Add form */}
      {editingItem ? (
        <EditUpdateForm
          editingItem={editingItem}
          toAddForm={() => setEditingItem(null)} // This correctly switches back to the add form
        />
      ) : (
        <UpdateFormData />
      )}

    </Container>
  );
};

export default UpdateTable;
