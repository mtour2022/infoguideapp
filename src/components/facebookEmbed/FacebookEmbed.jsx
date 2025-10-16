import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import SocialPost from "../../classes/FacebookModel";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

dayjs.extend(isBetween);

const loadFacebookSDK = () => {
  return new Promise((resolve) => {
    if (window.FB) return resolve(window.FB);

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0";
    script.onload = () => resolve(window.FB);
    document.body.appendChild(script);
  });
};

const SocialFeed = ({ collectionName = "facebook_posts" }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filter, setFilter] = useState("today");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchSocialPosts = useCallback(async () => {
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
  }, [collectionName]);

  useEffect(() => {
    const init = async () => {
      await loadFacebookSDK(); // load SDK
      await fetchSocialPosts(); // fetch posts
      // no need to call FB.XFBML.parse() here anymore
    };
    init();
  }, [fetchSocialPosts]);


  useEffect(() => {
    const now = dayjs();
    let filtered = [];

    if (filter === "today") {
      // Change: show posts from the last 7 days including today
      const sevenDaysAgo = now.subtract(7, "day").startOf("day");
      filtered = posts.filter((post) =>
        dayjs(post.posted_at).isAfter(sevenDaysAgo)
      );
    }
    else if (filter === "this_week") {
      filtered = posts.filter((post) => dayjs(post.posted_at).isSame(now, "week"));
    } else if (filter === "this_month") {
      filtered = posts.filter((post) => dayjs(post.posted_at).isSame(now, "month"));
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
    setCurrentIndex(0); // reset to first post

    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, [posts, filter, customRange]);

  // After fetching and filtering posts
  useEffect(() => {
    if (!window.FB) return;

    // Small timeout ensures DOM has updated
    const timer = setTimeout(() => {
      window.FB.XFBML.parse();
    }, 100); // 100ms delay is usually enough

    return () => clearTimeout(timer);
  }, [filteredPosts, currentIndex]);


  if (loading) {
    return (
      <div className="d-flex justify-content-center my-4">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!filteredPosts || filteredPosts.length === 0) {
    return (
      <div className="text-center text-muted my-3">No posts found for selected filter.</div>
    );
  }

  const currentPost = filteredPosts[currentIndex];

  return (
    <div className="container my-4">
      {/* <h2 className="home-section-title mb-1 mt-5 mb-3">SOCIAL MEDIA HIGHLIGHTS</h2> */}

      {/* Filter */}
      <Row className="justify-content-center align-items-center flex-nowrap">
        <Col xs={12} sm={12} md={6} lg={4} xl={4} xxl={4}>
          <Row className="mb-3 g-2 justify-content-center align-items-center flex-nowrap">
            <Col xs="auto" className="flex-grow-1">
              <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="custom">Custom Date</option>
              </Form.Select>
            </Col>

            {filter === "custom" && (
              <>
                <Col xs="auto" className="flex-grow-1">
                  <Form.Control
                    type="date"
                    value={customRange.from}
                    onChange={(e) => setCustomRange({ ...customRange, from: e.target.value })}
                  />
                </Col>
                <Col xs="auto" className="flex-grow-1">
                  <Form.Control
                    type="date"
                    value={customRange.to}
                    onChange={(e) => setCustomRange({ ...customRange, to: e.target.value })}
                  />
                </Col>
              </>
            )}

            <Col xs="auto">
              <Button variant="primary" onClick={fetchSocialPosts}>
                <FontAwesomeIcon icon={faSyncAlt} />
              </Button>
            </Col>
          </Row>
          {/* Current Post */}
          {currentPost.platform === "facebook" ? (
            <div
              className="fb-post w-100"
              data-href={currentPost.url}
              data-show-text="true"
            ></div>
          ) : (
            <div
              className="d-flex align-items-center justify-content-center w-100"
              style={{
                backgroundColor: "#f0f0f0",
                fontSize: "1.2rem",
                textAlign: "center",
                padding: "1rem",
              }}
            >
              {currentPost.title || "No preview available"}
            </div>
          )}

          {/* Navigation and Dots Section */}
          <div className="">
            <Row className="pt-3 align-items-center">
              {/* Left: Dot Indicators (max 5) */}
              <Col className="d-flex justify-content-start ms-0 ps-0">
                {(() => {
                  const totalDots = filteredPosts.length;
                  const maxVisibleDots = 5;
                  let start = 0;

                  if (totalDots > maxVisibleDots) {
                    // Center currentIndex if possible
                    start = Math.max(0, currentIndex - Math.floor(maxVisibleDots / 2));
                    // Ensure we don't overflow
                    if (start + maxVisibleDots > totalDots) {
                      start = totalDots - maxVisibleDots;
                    }
                  }

                  return filteredPosts.slice(start, start + maxVisibleDots).map((_, i) => {
                    const dotIndex = start + i;
                    return (
                      <span
                        key={dotIndex}
                        className={`dot ${dotIndex === currentIndex ? "active" : ""}`}
                        onClick={() => setCurrentIndex(dotIndex)}
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: dotIndex === currentIndex ? "#007bff" : "#ccc",
                          cursor: "pointer",
                          marginRight: "5px",
                        }}
                      ></span>
                    );
                  });
                })()}
              </Col>

              {/* Right: Navigation Arrows */}
              <Col className="d-flex justify-content-end">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="nav-icon left me-3"
                  onClick={() =>
                    setCurrentIndex((prev) => (prev - 1 + filteredPosts.length) % filteredPosts.length)
                  }
                  style={{ cursor: "pointer" }}
                />
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="nav-icon right"
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % filteredPosts.length)}
                  style={{ cursor: "pointer" }}
                />
              </Col>
            </Row>
          </div>

        </Col>
      </Row>
      {/* embed */}

    </div>
  );
};

export default SocialFeed;
