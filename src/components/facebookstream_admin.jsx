import React, { useEffect, useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { db } from "../config/firebase"; // adjust path
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function FacebookLiveAdmin() {
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [active, setActive] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load existing settings
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "stream", "currentStream");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setVideoUrl(data.videoUrl || "");
        setTitle(data.title || "");
        setSubtitle(data.subtitle || "");
        setActive(data.active || false);
      }
    };
    fetchData();
  }, []);

  // Save settings
  const handleSave = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "stream", "currentStream");
    await setDoc(docRef, {
      videoUrl,
      title,
      subtitle,
      active,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="container py-4">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Facebook Live Admin</h5>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Video URL</Form.Label>
              <Form.Control
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Enter Facebook Live Video URL"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Live Title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subtitle</Form.Label>
              <Form.Control
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter Subtitle"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="activeSwitch"
                label="Active (Show Stream)"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
            {saved && <span className="ms-3 text-success">✔ Saved!</span>}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
