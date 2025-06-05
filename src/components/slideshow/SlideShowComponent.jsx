import { useState, useEffect, useRef } from "react";
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

const videoUrl =
  "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/boracay%20video%20preview.mp4?alt=media&token=1a3e9db3-e1d2-45ed-a812-dc2206b2c49e";

const linkedVideos = [
  {
    title: "Love Boracay v5. 2025",
    headerImage:
      "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/highlightvideos%2Flove-boracay-2025.mp4?alt=media&token=ae2064a9-df06-41ab-8096-e38402a71c45",
    link: "/read/incomingEvents/TSS3xCQcJlPsyhuQWSy2",
  },
  {
    title: "22nd Fiesta De Obreros 2025",
    headerImage:
      "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/highlightvideos%2Ffiesta-de-obreros.mp4?alt=media&token=feb1f3d6-a7dc-4e1b-89d7-2133ce5730cb",
    link: "/read/incomingEvents/cCW9d9XpzyIZxhxPTUdl",
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

      setSlides([...linkedVideos, { title: "", headerImage: videoUrl }, ...data]);
    }

    fetchData();
  }, []);

  // useEffect(() => {
  //   const currentSlide = slides[currentIndex];
  //   const isVideo = currentSlide?.headerImage.includes("mp4");

  //   if (!isVideo) {
  //     // Stop video when transitioning away from a video slide
  //     const prevVideo = videoRefs.current[currentIndex];
  //     if (prevVideo) {
  //       prevVideo.pause();
  //     }
  //   }

  //   const interval = setInterval(() => {
  //     const nextIndex = (currentIndex + 1) % slides.length;
  //     setCurrentIndex(nextIndex);
  //   }, 8000);

  //   return () => clearInterval(interval);
  // }, [currentIndex, slides]);

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
    if (index === 0 || index === 1) {
      // Toggle visibility of the title and read more button instead of the logo for index 0 and 1
      setVideoStates((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          titleVisible: !prev[index]?.titleVisible,
          readMoreVisible: !prev[index]?.readMoreVisible,
        },
      }));
    } else {
      setVideoStates((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          logoVisible: !prev[index]?.logoVisible,
        },
      }));
    }
  };

  const handleNavClick = (direction) => {
    // Stop video for the current slide
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.pause();
    }

    // Move to the next or previous slide
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
        const isVideo = slide.headerImage.includes("mp4");
        const state = videoStates[index] || {};
        const videoLoaded = videoLoadedFlags[index] || false;

        return (
          <div
            key={index}
            className={`slide ${isActive ? "active" : ""}`}
            onMouseEnter={() => initializeVideoState(index)}
          >
            {!videoLoaded && isVideo && isActive && (
              <div
                className="slide-image"
                style={{ backgroundImage: `url(${ImageLoader})` }}
              />
            )}

            {isVideo ? (
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
                    if (isActive) setVideoStates((prev) => ({
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

            {(index === 0 || index === 1) ? (
              <div className="slide-content">
                {state.titleVisible && (
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
                )}
                {state.readMoreVisible && (
                  <button
                    className="read-more"
                    onClick={() => handleReadMore(slide.link)}
                  >
                    Read More
                  </button>
                )}
              </div>
            ) : (
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

            {index === 2 && state.logoVisible && (
              <div className="slide-content">
                <img
                  src={BestBeachLogo}
                  alt="Boracay Best Beach Logo"
                  className="beach-logo"
                />
              </div>
            )}

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

              {isVideo && (
                <div className="button-group">
                  <button
                    className="video-control me-2"
                    onClick={() => toggleLogo(index)}
                  >
                    <FontAwesomeIcon icon={state.logoVisible ? faEyeSlash : faEye} />
                  </button>
                  <button
                    className="video-control me-2"
                    onClick={() => togglePlayback(index)}
                  >
                    <FontAwesomeIcon icon={state.playing ? faPause : faPlay} />
                  </button>
                  {index != 2 && (
                    <button
                      className="video-control"
                      onClick={() => toggleMute(index)}
                    >
                      <FontAwesomeIcon icon={state.muted ? faVolumeMute : faVolumeUp} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <button
        className="nav-button left"
        onClick={() => handleNavClick(-1)}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        className="nav-button right"
        onClick={() => handleNavClick(1)}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default Slideshow;
