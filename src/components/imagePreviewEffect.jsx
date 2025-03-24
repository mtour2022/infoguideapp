// import { useState, useEffect, useRef } from "react";

// const ImageSlider = ({ images, isHovered }) => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     let loadedCount = 0;
//     images.forEach((src) => {
//       const img = new Image();
//       img.src = src;
//       img.onload = () => {
//         loadedCount++;
//         if (loadedCount === images.length) setIsLoading(false);
//       };
//     });
//   }, [images]);

//   useEffect(() => {
//     if (!isHovered) {
//       setTimeout(() => setActiveIndex(0), 500); 
//       return;
//     }

//     intervalRef.current = setInterval(() => {
//       setActiveIndex((prevIndex) =>
//         prevIndex + 1 < images.length ? prevIndex + 1 : 0
//       );
//     }, 3000); 
//     return () => clearInterval(intervalRef.current);
//   }, [isHovered, images.length]);

//   return (
//     <div className="image-slider-container">
//       {isLoading && (
//         <div className="image-loader">
//           <div className="spinner"></div>
//         </div>
//       )}

//       {images.map((image, index) => (
//         <div
//           key={index}
//           className={`image-slider ${index === activeIndex ? "active" : ""}`}
//           style={{ backgroundImage: `url(${image})` }}
//         ></div>
//       ))}
//     </div>
//   );
// };

// export default ImageSlider;
