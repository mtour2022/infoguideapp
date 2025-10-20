import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPlay,
  faPause,
  faEye,
  faEyeSlash,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import BestBeachLogo from "../../assets/images/Boracay-Worlds-Best-Beach-Logo.png";
import ImageLoader from "../../assets/images/whitebach_backdrop.png";
import { useNavigate } from "react-router-dom";

const Slideshow = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoStates, setVideoStates] = useState({});
  const [videoLoadedFlags, setVideoLoadedFlags] = useState({});
  const videoRefs = useRef({});

  // ✅ Fetch slideshow video URL from Firestore
  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const snapshot = await getDocs(collection(db, "slideshowVideo"));
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data();
          setVideoUrl(docData.videoUrl);
        } else {
          // fallback if no video found
          setVideoUrl(
            "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/boracay%20video%20preview.mp4?alt=media&token=1a3e9db3-e1d2-45ed-a812-dc2206b2c49e"
          );
        }
      } catch (error) {
        console.error("Error fetching video URL:", error);
      }
    };

    fetchVideoUrl();
  }, []);

  // ✅ Fetch tourism markets slides
  useEffect(() => {
    async function fetchData() {
      try {
        const querySnapshot = await getDocs(collection(db, "tourismMarkets"));
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        if (data.length === 0) return;

        const bestBeachIndex = data.findIndex((slide) =>
          slide.title?.toLowerCase().includes("best beach")
        );

        if (bestBeachIndex !== -1) {
          const bestBeachSlide = data.splice(bestBeachIndex, 1)[0];
          data.splice(0, 0, bestBeachSlide);
        }

        // Wait for videoUrl to load before setting slides
        if (videoUrl) {
          setSlides([{ title: "", headerImage: videoUrl }, ...data]);
        }
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    }

    fetchData();
  }, [videoUrl]); // depend on videoUrl so slideshow updates once it's loaded

  // ✅ Play the active video when slide changes
  useEffect(() => {
    const video = videoRefs.current[currentIndex];
    if (video) {
      video.play().catch(() => { });
    }
  }, [currentIndex]);

  const initializeVideoState = (index) => {
    if (!videoStates[index]) {
      setVideoStates((prev) => ({
        ...prev,
        [index]: {
          playing: true,
          muted: true,
          logoVisible: true,
        },
      }));
    }
  };

  const togglePlayback = (index) => {
    const video = videoRefs.current[index];
    const isPlaying = videoStates[index]?.playing;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play().catch(() => { });
      }
      setVideoStates((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          playing: !isPlaying,
        },
      }));
    }
  };

  const toggleMute = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.muted = !videoStates[index]?.muted;
      setVideoStates((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          muted: !prev[index]?.muted,
        },
      }));
    }
  };

  const toggleLogo = (index) => {
    setVideoStates((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        logoVisible: !prev[index]?.logoVisible,
      },
    }));
  };

  const handleNavClick = (direction) => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) currentVideo.pause();

    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + direction;
      if (newIndex < 0) newIndex = slides.length - 1;
      if (newIndex >= slides.length) newIndex = 0;
      return newIndex;
    });
  };

  const handleReadMore = (collection, url) => {
    navigate(`/read/${collection}/${url}`);
  };

  return (
    <div className="slideshow">
      <div className="slideshow-shadow left-shadow"></div>
      <div className="slideshow-shadow right-shadow"></div>

      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        const isVideo = slide.headerImage?.includes("mp4");
        const state = videoStates[index] || {};
        const videoLoaded = videoLoadedFlags[index] || false;

        return (
          <div
            key={index}
            className={`slide ${isActive ? "active" : ""}`}
            onMouseEnter={() => initializeVideoState(index)}
          >
            {isVideo ? (
              <div className="video-container">
                <div className="video-container" style={{ position: "relative" }}>
                  {/* Loader image (visible while video not loaded) */}
                  {!videoLoaded && (
                    <img
                      src={ImageLoader}
                      alt="Loading..."
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      style={{
                        display: isActive ? "block" : "none",
                        zIndex: 1,
                      }}
                    />
                  )}

                  {/* Video */}
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    className="slide-video"
                    autoPlay={isActive}
                    muted={state.muted}
                    loop={false}
                    onCanPlay={() =>
                      setVideoLoadedFlags((prev) => ({
                        ...prev,
                        [index]: true,
                      }))
                    }
                    onEnded={() =>
                      setVideoStates((prev) => ({
                        ...prev,
                        [index]: { ...prev[index], playing: false },
                      }))
                    }
                    style={{
                      display: isActive ? "block" : "none",
                      opacity: videoLoaded ? 1 : 0,
                      transition: "opacity 0.5s ease-in-out",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <source src={slide.headerImage} type="video/mp4" />
                  </video>
                </div>

              </div>
            ) : (
              <div
                className="slide-image"
                style={{ backgroundImage: `url(${slide.headerImage})` }}
              />
            )}

            <div className="slide-content">
              <h1
                className={
                  window.innerWidth <= 640
                    ? "slideshow-title-small"
                    : "slideshow-title"
                }
                data-text={slide.title}
              >
                {slide.title}
              </h1>

              {slide.id && (
                <button
                  className="read-more"
                  onClick={() => handleReadMore("tourismMarkets", slide.id)}
                >
                  Read More
                </button>
              )}
            </div>

            {index === 2 && state.logoVisible && (
              <div className="slide-content">
                <img
                  src={BestBeachLogo}
                  alt="Boracay Best Beach Logo"
                  className="beach-logo"
                />
              </div>
            )}

            {isVideo && (
              <div className="bottom-row">
                <div className="dots">
                  {slides.map((_, dotIndex) => (
                    <span
                      key={dotIndex}
                      className={`dot ${dotIndex === currentIndex ? "active" : ""
                        }`}
                      onClick={() => setCurrentIndex(dotIndex)}
                    ></span>
                  ))}
                </div>
                <div className="button-group">
                  <button
                    className="video-control me-2"
                    onClick={() => toggleLogo(index)}
                  >
                    <FontAwesomeIcon
                      icon={state.logoVisible ? faEyeSlash : faEye}
                    />
                  </button>
                  <button
                    className="video-control me-2"
                    onClick={() => togglePlayback(index)}
                  >
                    <FontAwesomeIcon
                      icon={state.playing ? faPause : faPlay}
                    />
                  </button>
                  {index !== 2 && (
                    <button
                      className="video-control"
                      onClick={() => toggleMute(index)}
                    >
                      <FontAwesomeIcon
                        icon={state.muted ? faVolumeMute : faVolumeUp}
                      />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button className="nav-button left" onClick={() => handleNavClick(-1)}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button className="nav-button right" onClick={() => handleNavClick(1)}>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default Slideshow;
