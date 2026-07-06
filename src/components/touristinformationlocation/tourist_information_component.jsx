import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Card,
  Row,
  Col,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import TouristInfoDeskComponent from "./TouristInfoDeskComponent";

export default function TouristInfoDeskAdmin({
  collectionName = "touristInfoDesk",
}) {
  const [desk, setDesk] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [deskName, setDeskName] = useState("");
  const [address, setAddress] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [status, setStatus] = useState("Open");
  const [visible, setVisible] = useState(true);
  const [postedBy, setPostedBy] = useState("Municipality of Malay Tourism Office");
  const [postedAt, setPostedAt] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  // Fetch the single desk record
  const fetchDesk = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDesk(docs.length > 0 ? docs[0] : null);
    } catch (err) {
      console.error("Error loading desk:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesk();
  }, [collectionName]);

  const resetForm = () => {
    setDeskName("");
    setAddress("");
    setOpenTime("");
    setCloseTime("");
    setContactPerson("");
    setContactNumber("");
    setStatus("Open");
    setVisible(true);
    setPostedBy("Municipality of Malay Tourism Office");
    setPostedAt("");
    setEditingItem(null);
  };

  // Add or Update — only one record allowed
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const now = new Date();
      const formattedPostedAt = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Delete existing record (only one allowed)
      const snapshot = await getDocs(collection(db, collectionName));
      for (const s of snapshot.docs) {
        await deleteDoc(doc(db, collectionName, s.id));
      }

      const data = {
        deskName,
        address,
        openTime,
        closeTime,
        contactPerson,
        contactNumber,
        status,
        visible,
        postedBy,
        postedAt: formattedPostedAt,
      };

      if (editingItem) {
        const docRef = doc(db, collectionName, editingItem.id);
        await updateDoc(docRef, data);
      } else {
        await addDoc(collection(db, collectionName), data);
      }

      resetForm();
      fetchDesk();
    } catch (err) {
      console.error("Error saving info desk:", err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setDeskName(item.deskName);
    setAddress(item.address);
    setOpenTime(item.openTime || "");
    setCloseTime(item.closeTime || "");
    setContactPerson(item.contactPerson || "");
    setContactNumber(item.contactNumber || "");
    setStatus(item.status || "Open");
    setVisible(item.visible);
    setPostedBy(item.postedBy || "Municipality of Malay Tourism Office");
    setPostedAt(item.postedAt || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this desk location?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      fetchDesk();
    } catch (err) {
      console.error("Error deleting desk:", err);
    }
  };

  return (
    <div className="container py-4">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">
            {editingItem ? "Edit Tourist Information Desk" : "Add Tourist Information Desk"}
          </h5>
          <Form onSubmit={handleSave}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Desk Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={deskName}
                    onChange={(e) => setDeskName(e.target.value)}
                    placeholder="e.g. Caticlan Jetty Port Tourist Desk"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Malay Tourism Office, Caticlan"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Open Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Close Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Mr. Juan Dela Cruz"
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="e.g. 0928 123 4567"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="visibleSwitch"
                label="Visible"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              {editingItem ? "Update Desk Info" : "Save Desk Info"}
            </Button>
            {editingItem && (
              <Button variant="secondary" className="ms-2" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>

      <h5 className="mb-3">Current Tourist Information Desk</h5>

      {loading ? (
        <Spinner animation="border" />
      ) : !desk ? (
        <div className="text-muted">No information desk set.</div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover>
            <thead>
              <tr>
                <th>Desk Name</th>
                <th>Address</th>
                <th>Open–Close Time</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Posted By</th>
                <th>Posted At</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr key={desk.id}>
                <td>{desk.deskName}</td>
                <td>{desk.address}</td>
                <td>
                  {desk.openTime && desk.closeTime
                    ? `${desk.openTime} – ${desk.closeTime}`
                    : "—"}
                </td>
                <td>
                  {desk.contactPerson || "—"} <br />
                  <small>{desk.contactNumber || ""}</small>
                </td>
                <td
                  style={{
                    color:
                      desk.status === "Open"
                        ? "green"
                        : desk.status === "Closed"
                        ? "red"
                        : "#f0ad4e",
                    fontWeight: "bold",
                  }}
                >
                  {desk.status || "N/A"}
                </td>
                <td>{desk.postedBy || "—"}</td>
                <td>{desk.postedAt || "—"}</td>
                <td>{desk.visible ? "Yes" : "No"}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(desk)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(desk.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}

      {/* Live Preview */}
      <div className="mt-5">
        <h5 className="mb-3">Preview</h5>
        <TouristInfoDeskComponent collectionName={collectionName} />
      </div>
    </div>
  );
}
