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
import HolidayTodayComponent from "./holidayComponent";

export default function HolidayTodayAdmin({
  collectionName = "holidayToday",
}) {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [holidayName, setHolidayName] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [officeStatus, setOfficeStatus] = useState("Closed");
  const [timeStart, setTimeStart] = useState("08:00");
  const [timeEnd, setTimeEnd] = useState("17:00");
  const [reference, setReference] = useState("");
  const [postedBy, setPostedBy] = useState("LGU Malay Municipal Tourism Office");
  const [postedAt, setPostedAt] = useState("");
  const [visible, setVisible] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  // Fetch all holidays
  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHolidays(docs);
    } catch (err) {
      console.error("Error loading holidays:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [collectionName]);

  const resetForm = () => {
    setHolidayName("");
    setDateStart("");
    setDateEnd("");
    setOfficeStatus("Closed");
    setTimeStart("08:00");
    setTimeEnd("17:00");
    setReference("");
    setVisible(true);
    setPostedBy("LGU Malay Municipal Tourism Office");
    setPostedAt("");
    setEditingItem(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const now = new Date();
      const formattedPostedAt = now.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const data = {
        holidayName,
        dateStart,
        dateEnd,
        officeStatus,
        timeStart,
        timeEnd,
        reference,
        postedBy,
        postedAt: formattedPostedAt,
        visible,
      };

      if (editingItem) {
        const docRef = doc(db, collectionName, editingItem.id);
        await updateDoc(docRef, data);
      } else {
        await addDoc(collection(db, collectionName), data);
      }

      resetForm();
      fetchHolidays();
    } catch (err) {
      console.error("Error saving holiday:", err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setHolidayName(item.holidayName);
    setDateStart(item.dateStart);
    setDateEnd(item.dateEnd);
    setOfficeStatus(item.officeStatus || "Closed");
    setTimeStart(item.timeStart || "08:00");
    setTimeEnd(item.timeEnd || "17:00");
    setReference(item.reference || "");
    setVisible(item.visible ?? true);
    setPostedBy(item.postedBy || "LGU Malay Municipal Tourism Office");
    setPostedAt(item.postedAt || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this holiday?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      fetchHolidays();
    } catch (err) {
      console.error("Error deleting holiday:", err);
    }
  };

  return (
    <div className="container py-4">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">{editingItem ? "Edit Holiday" : "Add Holiday"}</h5>
          <Form onSubmit={handleSave}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Holiday Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={holidayName}
                    onChange={(e) => setHolidayName(e.target.value)}
                    placeholder="e.g. Holy Week"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Office Status</Form.Label>
                  <Form.Select
                    value={officeStatus}
                    onChange={(e) => setOfficeStatus(e.target.value)}
                  >
                    <option>Closed</option>
                    <option>Open</option>
                    <option>Half Day</option>
                    <option>Special Schedule</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Time Start</Form.Label>
                  <Form.Control
                    type="time"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Time End</Form.Label>
                  <Form.Control
                    type="time"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    required
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
                    placeholder="e.g. DOLE, Malacañang"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={8}>
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

              <Col md={4} className="d-flex align-items-end">
                <Form.Check
                  type="switch"
                  id="visibleSwitch"
                  label="Visible"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                />
              </Col>
            </Row>

            <Button type="submit" variant="primary">
              {editingItem ? "Update Holiday" : "Save Holiday"}
            </Button>
            {editingItem && (
              <Button variant="secondary" className="ms-2" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>

      <h5 className="mb-3">Holiday List</h5>

      {loading ? (
        <Spinner animation="border" />
      ) : holidays.length === 0 ? (
        <div className="text-muted">No holidays added yet.</div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Holiday Name</th>
                <th>Date Range</th>
                <th>Office Status</th>
                <th>Operating Hours</th>
                <th>Reference</th>
                <th>Posted By</th>
                <th>Posted At</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((h, i) => (
                <tr key={h.id}>
                  <td>{i + 1}</td>
                  <td>{h.holidayName}</td>
                  <td>
                    {h.dateStart && h.dateEnd
                      ? `${h.dateStart} – ${h.dateEnd}`
                      : "—"}
                  </td>
                  <td>{h.officeStatus || "—"}</td>
                  <td>
                    {h.timeStart && h.timeEnd
                      ? `${h.timeStart} – ${h.timeEnd}`
                      : "—"}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: "250px" }}>
                    {h.reference ? (
                      <a
                        href={h.reference}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {h.reference}
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>{h.postedBy || "—"}</td>
                  <td>{h.postedAt || "—"}</td>
                  <td>{h.visible ? "Yes" : "No"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() => handleEdit(h)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(h.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Live Preview */}
      <div className="mt-5">
        <h5 className="mb-3">Preview</h5>
        <HolidayTodayComponent collectionName={collectionName} />
      </div>
    </div>
  );
}
