import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Card,
  Table,
  Spinner,
} from "react-bootstrap";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";

export default function SlideshowVideoAdmin({
  collectionName = "slideshowVideo",
}) {
  const [videoData, setVideoData] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [postedBy, setPostedBy] = useState("Boracay InfoGuide Admin");
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing video record (only one allowed)
  const fetchVideo = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setVideoData(docs.length > 0 ? docs[0] : null);
    } catch (err) {
      console.error("Error fetching video URL:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [collectionName]);

  const resetForm = () => {
    setVideoUrl("");
    setPostedBy("Boracay InfoGuide Admin");
    setEditingItem(null);
  };

  // Save or update video URL (only one document allowed)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const now = new Date();
      const formattedDate = now.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Delete old record before adding a new one
      const snapshot = await getDocs(collection(db, collectionName));
      for (const s of snapshot.docs) {
        await deleteDoc(doc(db, collectionName, s.id));
      }

      const data = {
        videoUrl,
        postedBy,
        updatedAt: formattedDate,
      };

      if (editingItem) {
        await updateDoc(doc(db, collectionName, editingItem.id), data);
      } else {
        await addDoc(collection(db, collectionName), data);
      }

      resetForm();
      fetchVideo();
    } catch (err) {
      console.error("Error saving video URL:", err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setVideoUrl(item.videoUrl);
    setPostedBy(item.postedBy || "Boracay InfoGuide Admin");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video URL?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      fetchVideo();
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  return (
    <div className="container py-4">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">
            {editingItem ? "Edit Slideshow Video" : "Set Slideshow Video"}
          </h5>

          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Video URL (MP4)</Form.Label>
              <Form.Control
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://firebasestorage.googleapis.com/..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Posted By</Form.Label>
              <Form.Control
                type="text"
                value={postedBy}
                onChange={(e) => setPostedBy(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              {editingItem ? "Update Video" : "Save Video"}
            </Button>
            {editingItem && (
              <Button variant="secondary" className="ms-2" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>

      <h5 className="mb-3">Current Slideshow Video</h5>

      {loading ? (
        <Spinner animation="border" />
      ) : !videoData ? (
        <div className="text-muted">No video URL set yet.</div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover>
            <thead>
              <tr>
                <th>Video URL</th>
                <th>Posted By</th>
                <th>Updated At</th>
                <th>Preview</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr key={videoData.id}>
                <td className="text-truncate" style={{ maxWidth: "300px" }}>
                  <a href={videoData.videoUrl} target="_blank" rel="noopener noreferrer">
                    {videoData.videoUrl}
                  </a>
                </td>
                <td>{videoData.postedBy}</td>
                <td>{videoData.updatedAt}</td>
                <td>
                  <video
                    src={videoData.videoUrl}
                    width="200"
                    height="120"
                    controls
                  />
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(videoData)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(videoData.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
