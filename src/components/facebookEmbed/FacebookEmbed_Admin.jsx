import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Card,
  Row,
  Col,
  Table,
  Spinner,
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

// Import your existing preview component
import SocialFeed from "./FacebookEmbed";

export default function SocialFeedAdmin({ collectionName = "facebook_posts" }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("facebook");
  const [postedAt, setPostedAt] = useState("");
  const [visible, setVisible] = useState(true);

  const [editingPost, setEditingPost] = useState(null);

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [collectionName]);

  const resetForm = () => {
    setUrl("");
    setPlatform("facebook");
    setPostedAt("");
    setVisible(true);
    setEditingPost(null);
  };

  // Add or Update post
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (editingPost) {
        // Update existing
        const docRef = doc(db, collectionName, editingPost.id);
        await updateDoc(docRef, {
          url,
          platform,
          posted_at: postedAt,
          visible,
        });
      } else {
        // Add new
        await addDoc(collection(db, collectionName), {
          url,
          platform,
          posted_at: postedAt,
          visible,
        });
      }
      resetForm();
      fetchPosts(); // refresh posts without reloading the page
    } catch (err) {
      console.error("Error saving post:", err);
    }
  };

  // Edit post
  const handleEdit = (post) => {
    setEditingPost(post);
    setUrl(post.url);
    setPlatform(post.platform);
    setPostedAt(post.posted_at);
    setVisible(post.visible);
  };

  // Delete post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      fetchPosts(); // refresh posts
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <div className="container py-4">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">
            {editingPost ? "Edit Social Post" : "Add New Social Post"}
          </h5>
          <Form onSubmit={handleSave}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Post URL</Form.Label>
                  <Form.Control
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Platform</Form.Label>
                  <Form.Select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                  >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Posted At</Form.Label>
                  <Form.Control
                    type="date"
                    value={postedAt}
                    onChange={(e) => setPostedAt(e.target.value)}
                    required
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
              {editingPost ? "Update Post" : "Add Post"}
            </Button>
            {editingPost && (
              <Button
                variant="secondary"
                className="ms-2"
                onClick={resetForm}
              >
                Cancel
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>

      <h5 className="mb-3">Existing Posts</h5>

      {loading ? (
        <Spinner animation="border" />
      ) : posts.length === 0 ? (
        <div className="text-muted">No posts found.</div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>URL</th>
                <th>Platform</th>
                <th>Posted At</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="text-truncate" style={{ maxWidth: "250px" }}>
                    {post.url}
                  </td>
                  <td>{post.platform}</td>
                  <td>{post.posted_at}</td>
                  <td>{post.visible ? "Yes" : "No"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant={post.visible ? "secondary" : "success"}
                      className="me-2"
                      onClick={async () => {
                        try {
                          const docRef = doc(db, collectionName, post.id);
                          await updateDoc(docRef, { visible: !post.visible });
                          fetchPosts();
                        } catch (err) {
                          console.error("Error updating visibility:", err);
                        }
                      }}
                    >
                      {post.visible ? "Hide" : "Show"}
                    </Button>

                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(post.id)}
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

      {/* Live preview of SocialFeed */}
      <div className="mt-5">
        <h5 className="mb-3">Preview</h5>
        <SocialFeed collectionName={collectionName} />
      </div>
    </div>
  );
}
