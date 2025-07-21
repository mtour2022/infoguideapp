import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import SocialPost from "../../classes/FacebookModel";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  Button,
  Form,
  Row,
  Col,
  Spinner
} from "react-bootstrap";

dayjs.extend(isBetween);

const loadFacebookSDK = () => {
  if (window.FB) return;

  const script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.crossOrigin = "anonymous";
  script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0";
  document.body.appendChild(script);
};

const SocialFeed = ({ collectionName = "facebook_posts" }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filter, setFilter] = useState("today");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFacebookSDK();

    const fetchSocialPosts = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        const data = snapshot.docs
          .map((doc) => new SocialPost({ id: doc.id, ...doc.data() }))
          .filter((post) => post.visible && post.posted_at);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialPosts();
  }, [collectionName]);

  useEffect(() => {
    const now = dayjs();
    let filtered = [];

    if (filter === "today") {
      filtered = posts.filter((post) =>
        dayjs(post.posted_at).isSame(now, "day")
      );
    } else if (filter === "this_week") {
      filtered = posts.filter((post) =>
        dayjs(post.posted_at).isSame(now, "week")
      );
    } else if (filter === "this_month") {
      filtered = posts.filter((post) =>
        dayjs(post.posted_at).isSame(now, "month")
      );
    } else if (filter === "custom") {
      const fromDate = dayjs(customRange.from);
      const toDate = dayjs(customRange.to).endOf("day");
      filtered = posts.filter((post) =>
        dayjs(post.posted_at).isBetween(fromDate, toDate, null, "[]")
      );
    } else {
      filtered = posts;
    }

    setFilteredPosts(filtered);

    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, [posts, filter, customRange]);

  return (
    <div className="text-center">
      <h4 className="fw-bold text-dark mb-3">Social Media Highlights</h4>

      <Row className="mb-4 justify-content-center">
        <Col xs="auto">
          <Form.Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="custom">Custom Date</option>
          </Form.Select>
        </Col>
        {filter === "custom" && (
          <>
            <Col xs="auto">
              <Form.Control
                type="date"
                value={customRange.from}
                onChange={(e) =>
                  setCustomRange({ ...customRange, from: e.target.value })
                }
              />
            </Col>
            <Col xs="auto">
              <Form.Control
                type="date"
                value={customRange.to}
                onChange={(e) =>
                  setCustomRange({ ...customRange, to: e.target.value })
                }
              />
            </Col>
          </>
        )}
      </Row>

      {loading ? (
        <div className="d-flex justify-content-center mt-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading posts...</span>
          </Spinner>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4 align-items-center">
          {filteredPosts.map((post) =>
            post.platform === "facebook" ? (
              <div
                key={post.id}
                className="fb-post"
                data-href={post.url}
                data-width="550"
                data-show-text="true"
              ></div>
            ) : null
          )}
          {filteredPosts.length === 0 && (
            <div className="text-muted">No posts found for selected filter.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
