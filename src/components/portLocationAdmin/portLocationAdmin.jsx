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
import PortScheduleTodayComponent from "./portLocationComponent";

export default function PortScheduleTodayAdmin({
  collectionName = "portScheduleToday",
}) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [location, setLocation] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState("Open");
  const [visible, setVisible] = useState(true);
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [postedBy, setPostedBy] = useState("Philippine Coast Guard");
  const [postedAt, setPostedAt] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  // Fetch the single schedule
  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSchedule(docs.length > 0 ? docs[0] : null);
    } catch (err) {
      console.error("Error loading schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [collectionName]);

  const resetForm = () => {
    setLocation("");
    setDatePosted("");
    setReference("");
    setStatus("Open");
    setVisible(true);
    setOpenTime("");
    setCloseTime("");
    setPostedBy("Philippine Coast Guard");
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

      // Delete any existing schedule before adding a new one
      const snapshot = await getDocs(collection(db, collectionName));
      for (const s of snapshot.docs) {
        await deleteDoc(doc(db, collectionName, s.id));
      }

      const data = {
        location,
        date_posted: datePosted,
        reference,
        status,
        visible,
        openTime,
        closeTime,
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
      fetchSchedule();
    } catch (err) {
      console.error("Error saving schedule:", err);
    }
  };

  // Edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setLocation(item.location);
    setDatePosted(item.date_posted);
    setReference(item.reference);
    setStatus(item.status || "Open");
    setVisible(item.visible);
    setOpenTime(item.openTime || "");
    setCloseTime(item.closeTime || "");
    setPostedBy(item.postedBy || "Philippine Coast Guard");
    setPostedAt(item.postedAt || "");
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      fetchSchedule();
    } catch (err) {
      console.error("Error deleting schedule:", err);
    }
  };

  return (
    <div className="container py-4">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">
            {editingItem ? "Edit Port Schedule" : "Add Port Schedule"}
          </h5>
          <Form onSubmit={handleSave}>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Caticlan Jetty Port"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Date Posted</Form.Label>
                  <Form.Control
                    type="date"
                    value={datePosted}
                    onChange={(e) => setDatePosted(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Reference / Link</Form.Label>
                  <Form.Control
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Paste reference link or source"
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Cancelled">Cancelled</option>
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
                  <Form.Label>Posted By</Form.Label>
                  <Form.Control
                    type="text"
                    value={postedBy}
                    onChange={(e) => setPostedBy(e.target.value)}
                    placeholder="e.g. Philippine Coast Guard"
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
              {editingItem ? "Update Schedule" : "Save Schedule"}
            </Button>
            {editingItem && (
              <Button variant="secondary" className="ms-2" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>

      <h5 className="mb-3">Current Port Schedule</h5>

      {loading ? (
        <Spinner animation="border" />
      ) : !schedule ? (
        <div className="text-muted">No schedule set for today.</div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover>
            <thead>
              <tr>
                <th>Location</th>
                <th>Date Posted</th>
                <th>Open–Close Time</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Posted By</th>
                <th>Posted At</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr key={schedule.id}>
                <td>{schedule.location}</td>
                <td>{schedule.date_posted}</td>
                <td>
                  {schedule.openTime && schedule.closeTime
                    ? `${schedule.openTime} – ${schedule.closeTime}`
                    : "—"}
                </td>
                <td className="text-truncate" style={{ maxWidth: "250px" }}>
                  {schedule.reference ? (
                    <a
                      href={schedule.reference}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {schedule.reference}
                    </a>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td
                  style={{
                    color:
                      schedule.status === "Open"
                        ? "green"
                        : schedule.status === "Closed"
                        ? "red"
                        : schedule.status === "Delayed"
                        ? "#f0ad4e"
                        : "#6c757d",
                    fontWeight: "bold",
                  }}
                >
                  {schedule.status || "N/A"}
                </td>
                <td>{schedule.postedBy || "—"}</td>
                <td>{schedule.postedAt || "—"}</td>
                <td>{schedule.visible ? "Yes" : "No"}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(schedule)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(schedule.id)}
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
        <PortScheduleTodayComponent collectionName={collectionName} />
      </div>
    </div>
  );
}
