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

// Local video
const videoUrl =
  "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/boracay%20video%20preview.mp4?alt=media&token=1a3e9db3-e1d2-45ed-a812-dc2206b2c49e";

// 👇 Replace linkedVideos with Facebook Live Slide
const linkedVideos = [
  {
    type: "facebook",
    title: "Live Now: Boracay MDRRMC",
    videoUrl: "https://www.facebook.com/malay.mdrrmc/videos/1326837815488475",
  },
];

const Slideshow = () => {
  const navigate = useNavigate();

  const [slides, setSlides] = useState([{ title: "", headerImage: ImageLoader }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoStates, setVideoStates] = useState({});
  const [videoLoadedFlags, setVideoLoadedFlags] = useState({});
  const videoRefs = useRef({});

  const handleReadMore = (collection, url) => {
    navigate(`/read/${collection}/${url}`);
  };

  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "tourismMarkets"));
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      if (data.length === 0) return;

      const bestBeachIndex = data.findIndex((slide) =>
        slide.title.toLowerCase().includes("best beach")
      );

      if (bestBeachIndex !== -1) {
        const bestBeachSlide = data.splice(bestBeachIndex, 1)[0];
        data.splice(0, 0, bestBeachSlide);
      }

      // 👇 Put facebook live as first, then local video, then the rest
      setSlides([...linkedVideos, { title: "", headerImage: videoUrl }, ...data]);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const video = videoRefs.current[currentIndex];
    if (video) {
      video.play().catch(() => {});
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
        setVideoStates((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            playing: false,
          },
        }));
      } else {
        video.play().catch(() => {});
        setVideoStates((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            playing: true,
          },
        }));
      }
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
    if (currentVideo) {
      currentVideo.pause();
    }

    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + direction;
      if (newIndex < 0) newIndex = slides.length - 1;
      if (newIndex >= slides.length) newIndex = 0;
      return newIndex;
    });
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
            {/* 👇 Render Facebook Live if type = facebook */}
           {slide.type === "facebook" ? (
  <div className="video-wrapper">
    <iframe
      src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        slide.videoUrl
      )}&show_text=false&autoplay=true`}
      style={{
        border: "none",
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
      scrolling="no"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      allowFullScreen={true}
      title="Facebook Live Stream"
    ></iframe>
  </div>
) : isVideo ? (

              <div className="video-container">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  className="slide-video"
                  autoPlay={isActive}
                  muted={state.muted}
                  loop={false}
                  onCanPlay={() => {
                    setVideoLoadedFlags((prev) => ({
                      ...prev,
                      [index]: true,
                    }));
                  }}
                  onEnded={() => {
                    if (isActive)
                      setVideoStates((prev) => ({
                        ...prev,
                        [index]: {
                          ...prev[index],
                          playing: false,
                        },
                      }));
                  }}
                  style={{ display: isActive && videoLoaded ? "block" : "none" }}
                >
                  <source src={slide.headerImage} type="video/mp4" />
                </video>
              </div>
            ) : (
              <div
                className="slide-image"
                style={{ backgroundImage: `url(${slide.headerImage})` }}
              />
            )}

            {slide.type !== "facebook" && (
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
            )}

            {index === 1 && state.logoVisible && (
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
                      className={`dot ${dotIndex === currentIndex ? "active" : ""}`}
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
