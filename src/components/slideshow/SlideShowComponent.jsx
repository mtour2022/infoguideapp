import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faPlay, faPause, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import BestBeachLogo from "../../assets/images/Boracay-Worlds-Best-Beach-Logo.png";
import ImageLoader from "../../assets/images/whitebach_backdrop.png"; // Dummy loader image
import { Container } from "react-bootstrap";

const videoUrl = "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/boracay%20video%20preview.mp4?alt=media&token=1a3e9db3-e1d2-45ed-a812-dc2206b2c49e";

const Slideshow = () => {
  const [slides, setSlides] = useState([{ title: "", headerImage: ImageLoader }]); // Start with loader
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "tourismMarkets"));
      const data = querySnapshot.docs.map((doc) => doc.data());

      if (data.length === 0) return;

      // Find the slide with "Best Beach" in the title
      const bestBeachIndex = data.findIndex((slide) =>
        slide.title.toLowerCase().includes("best beach")
      );

      // Rearrange slides to make "Best Beach" the second slide
      if (bestBeachIndex !== -1) {
        const bestBeachSlide = data.splice(bestBeachIndex, 1)[0];
        data.splice(0, 0, bestBeachSlide);
      }

      // Append video as the first slide
      setSlides([{ title: "", headerImage: videoUrl }, ...data]);
    }
    fetchData();
  }, []);

  const toggleVideoPlayback = () => {
    const videoElement = document.querySelector(".slide-video");
    if (videoElement) {
      if (isVideoPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleLogoVisibility = () => {
    setIsLogoVisible(!isLogoVisible);
  };

  return (
    <div className="slideshow">
      <div className="slideshow-shadow left-shadow"></div>
      <div className="slideshow-shadow right-shadow"></div>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentIndex ? "active" : ""}`}
        >
          {/* Render Video or Image based on headerImage */}
          {slide.headerImage.includes("mp4") ? (
            <div className="video-container">
              {!videoLoaded && (
                <img src={ImageLoader} alt="Loading Video..." className="loading-image" />
              )}
              <video
                className="slide-video"
                autoPlay
                muted
                loop
                onLoadedData={() => setVideoLoaded(true)}
              >
                <source src={slide.headerImage} type="video/mp4" />
              </video>
            </div>
          ) : (
            <div
              className="slide-image"
              style={{ backgroundImage: `url(${slide.headerImage})` }}
            ></div>
          )}

          {/* Title & Button */}
          {index !== 0 && (
            <div className="slide-content">
              <h1 className="slideshow-title" data-text={`${slide.title}`}>
                {slide.title}
              </h1>
              <button className="read-more">Read More</button>
            </div>
          )}

          {index === 0 && (
            <div className="slide-content">
              {isLogoVisible && (
                <img
                  src={BestBeachLogo}
                  alt="Boracay Best Beach Logo"
                  className="beach-logo"
                />
              )}
            </div>
          )}

          {/* Dots Indicator & Video Controls */}
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
              <button className="toggle-logo-btn" onClick={toggleLogoVisibility}>
                <FontAwesomeIcon icon={isLogoVisible ? faEyeSlash : faEye} />
              </button>
              <button className="video-control" onClick={toggleVideoPlayback}>
                <FontAwesomeIcon icon={isVideoPlaying ? faPause : faPlay} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        className="nav-button left"
        onClick={() =>
          setCurrentIndex((currentIndex - 1 + slides.length) % slides.length)
        }
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        className="nav-button right"
        onClick={() => setCurrentIndex((currentIndex + 1) % slides.length)}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default Slideshow;
