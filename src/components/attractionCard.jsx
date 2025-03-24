// import { useState } from "react";
// import ImageSlider from "./imagePreviewEffect";

// const AttractionCard = ({ attraction }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   const images = [attraction.headerImage, ...(attraction.images?.slice(0, 1) || [])];

//   return (
//     <div
//       className="pagination-component-card"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <ImageSlider images={images} isHovered={isHovered} />

//       <div className="pagination-component-gradient"></div>

//       <div className="home-button-content">
//         <p className="pagination-component-name">{attraction.name}</p>
//         <p className="home-button-caption">
//           {attraction.geo}, {attraction.address?.barangay}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AttractionCard;
