import React, { useEffect, useState } from "react";
import { Table, Form, Button, Container, Row, Col } from "react-bootstrap";
import { db } from "../config/firebase"; // Import your Firebase config
import { collection, getDocs } from "firebase/firestore";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [classificationFilter, setClassificationFilter] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "stories"));
      const dataList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(dataList);
    };

    fetchData();
  }, []);

  // Sorting function for date column
  const handleSort = () => {
    const sortedData = [...data].sort((a, b) => {
      return sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });
    setData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Filtering and searching logic
  const filteredData = data.filter(
    (item) =>
      (classificationFilter === "" || item.classification === classificationFilter) &&
      (purposeFilter === "" || item.purpose === purposeFilter) &&
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.classification.toLowerCase().includes(search.toLowerCase()) ||
        item.purpose.toLowerCase().includes(search.toLowerCase()) ||
        item.date.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.social.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination logic
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Function to format the current date as MMDDYYYY
  const getFormattedDate = () => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0"); // Month (01-12)
    const dd = String(now.getDate()).padStart(2, "0"); // Day (01-31)
    const yyyy = now.getFullYear(); // Year (4 digits)
    return `${mm}${dd}${yyyy}`;
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.map(({ id, body, tags, references, headerImage, ...rest }) => rest)
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `tourism_stories_infoguide_${getFormattedDate()}.xlsx`);
  };

  // Extract unique values for filters
  const classifications = [...new Set(data.map((item) => item.classification))];
  const purposes = [...new Set(data.map((item) => item.purpose))];

  return (
    <Container>
      {/* Search and Filters Row */}

        <h1 className="text-2xl font-bold mb-1">Submit an Article</h1>
        <p>Each article submitted must be thoroughly reviewed by the technical writers.</p>


      <Row className="mb-4 mt-4">
        <Col md={4} className="mb-2 me-2 col">
          <Form.Control
            type="text"
            placeholder={`Search up to over ${data.length} articles`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3} className="mb-2 me-2 col">
          <Form.Select
            value={classificationFilter}
            onChange={(e) => setClassificationFilter(e.target.value)}
          >
            <option value="">All Classifications</option>
            {classifications.map((classification, index) => (
              <option key={index} value={classification}>
                {classification}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3} className="mb-2 col">
          <Form.Select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
          >
            <option value="">All Purposes</option>
            {purposes.map((purpose, index) => (
              <option key={index} value={purpose}>
                {purpose}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Data Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th onClick={handleSort} style={{ cursor: "pointer" }}>
              Date {sortOrder === "asc" ? "▲" : "▼"}
            </th>
            <th>Classification</th>
            <th>Purpose</th>
            <th>Title</th>
            <th>Name</th>
            <th>Email</th>
            <th>Social</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((item) => (
            <tr key={item.id}>
              <td>{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}</td>
              <td>{item.classification}</td>
              <td>{item.purpose}</td>
              <td>{item.title}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.social}</td>
            </tr>
          ))}
        </tbody>

      </Table>

      {/* Pagination */}
      <Container className="d-flex justify-content-between align-items-center mb-4">
        <Button onClick={exportToExcel} variant="success">
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

    </Container>
  );
};

export default DataTable;
