import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { Pagination, FreeMode, Autoplay } from "swiper/modules";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import {
  parseISO,
  isWithinInterval,
  addDays,
  subWeeks,
  addMonths,
  subDays,
} from "date-fns";
import { useNavigate } from "react-router-dom";

export default function CustomSwiper({ collectionName = "deals", title }) {
  const [slides, setSlides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        // ✅ Try to sort by createdAt descending
        const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const withColors = data.map((item) => ({
          ...item,
          randomColor: generateReadableColor(),
        }));

        setSlides(withColors);
      } catch (error) {
        console.warn("⚠️ Sorting failed — falling back to unsorted order.", error);
        const snapshot = await getDocs(collection(db, collectionName));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          randomColor: generateReadableColor(),
        }));
        setSlides(data.reverse()); // ✅ Reverse fallback (recent last → first)
      }
    };

    fetchSlides();
  }, [collectionName]);


  const generateReadableColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 40) + 40;
    const lightness = Math.floor(Math.random() * 25) + 25;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };



  const navigateTo = (id) => {
    navigate(`/read/${collectionName}/${id}`);
  };



  return (
    <div className="custom-swiper-container-wrapper">
      <div className="custom-header-row">
         <h2 className="custom-section-title">{title}</h2>
        <button
          className="read-more-btn view-all-btn"
          onClick={() => navigate(`/update/${collectionName}`)}
        >
          <span className="view-text-full">View All →</span>
          <span className="view-text-short">View →</span>
        </button>
      </div>

      <Swiper
        slidesPerView="auto"
        spaceBetween={10}
        freeMode={true} // ✅ smooth, natural scrolling feel
        grabCursor={true}
        loop={true} // ✅ infinite scroll
        speed={700} // ✅ smooth transition duration
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        modules={[Pagination, FreeMode, Autoplay]}
        className="custom-mySwiper"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className="custom-slide">
            <div className="custom-slide-content">
              {/* Left image */}
              <div
                className="custom-slide-image"
                onClick={() => navigateTo(slide.id)}
              >
                {!slide.imageLoaded && (
                  <div className="spinner-container">
                    <div className="loading-spinner"></div>
                  </div>
                )}
                <img
                  src={slide.headerImage || slide.image}
                  alt={slide.title || "Slide Image"}
                  onLoad={() => {
                    slide.imageLoaded = true;
                    setSlides((prev) => [...prev]);
                  }}
                  style={{ display: slide.imageLoaded ? "block" : "none" }}
                />
              </div>

              {/* Description */}
              <div
                className="custom-slide-description"
                style={{ backgroundColor: slide.randomColor, color: "#fff" }}
              >
                <div className="custom-text-box">
                  <h2>{slide.title}</h2>
                  <p>{slide.description || slide.caption}</p>
                </div>
                <button
                  className="read-more-btn"
                  onClick={() => navigateTo(slide.id)}
                >
                  Read →
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
