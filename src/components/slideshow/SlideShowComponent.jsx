import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

const videoUrl = "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/boracay%20video%20preview.mp4?alt=media&token=1a3e9db3-e1d2-45ed-a812-dc2206b2c49e";

const Slideshow = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "tourismMarkets"));
      const data = querySnapshot.docs.map((doc) => doc.data());

      // Append video as the first slide
      setSlides([{ title: "", headerImage: videoUrl }, ...data]);
    }
    fetchData();
  }, []);

  if (slides.length === 0) return <div>Loading...</div>;
  
  const toggleVideoPlayback = () => {
    const videoElement = document.querySelector(".slide-video"); // Select the video
    if (videoElement) {
      if (isVideoPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
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
            <video className="slide-video" autoPlay muted loop>
              <source src={slide.headerImage} type="video/mp4" />
            </video>
          ) : (
            <div
              className="slide-image"
              style={{ backgroundImage: `url(${slide.headerImage})` }}
            ></div>
          )}

          {/* Title & Button */}
          {index !== 0 &&  <div className="slide-content">
            <h1 className="slideshow-title" data-text={`${slide.title}`}>
              {slide.title}
            </h1>
            <button className="read-more">Read More</button>
            </div>}

          {/* Dots Indicator */}
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

              {/* Video Play/Pause Button (Only for Video Slide) */}
              {currentIndex === 0 && (
                <button className="video-control" onClick={toggleVideoPlayback}>
                  <FontAwesomeIcon icon={isVideoPlaying ? faPause : faPlay} />
                </button>
              )}
            </div>


            </div>

      ))}

      {/* Navigation Buttons */}
      <button className="nav-button left" onClick={() => setCurrentIndex((currentIndex - 1 + slides.length) % slides.length)}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button className="nav-button right" onClick={() => setCurrentIndex((currentIndex + 1) % slides.length)}>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default Slideshow;
