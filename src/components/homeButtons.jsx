import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHotel,
  faSpa,
  faUtensils,
  faBuilding,
  faPlane,
  faCompass,
  faCar,
  faMapMarkedAlt,
  faShoppingBag,
  faBiking,
  faTree,
  faShip,
  faCalendarAlt,
  faDumbbell,
  faCocktail,
  faCoffee,
  faParking,
  faHospital,
  faFlag,
  faSailboat,
} from "@fortawesome/free-solid-svg-icons";
import defaultButtonDataArray from "../classes/HomeButtons"; // Default button data
import DOTlogo from "../assets/images/DepartmentOfTourismAccreditationLogo.png"

const fallbackImage =
  "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/homeButtons%2Fwhitebach_backdrop.jpg?alt=media&token=2d712ede-915f-4ca5-ba1d-b650bce45cf7";

const iconMap = {
  hotel: faHotel,
  spa: faSpa,
  restaurant: faUtensils,
  building: faBuilding,
  sailboat: faSailboat,
  flag: faFlag,
  plane: faPlane,
  mic: faCompass,
  map: faMapMarkedAlt,
  shopping: faShoppingBag,
  biking: faBiking,
  nature: faTree,
  ship: faShip,
  event: faCalendarAlt,
  gym: faDumbbell,
  bar: faCocktail,
  cafe: faCoffee,
  parking: faParking,
  hospital: faHospital,
};

const HomeButtons = ({ buttonDataArray = defaultButtonDataArray }) => {
  return (
    <div className="home-section">
      {/* First Section: DOT Accredited */}
      <div className="">
         <div className="text-center my-4 text-white">
  <h2 className="custom-section-title text-white">
    DOT ACCREDITED TOURISM ENTERPRISES
  </h2>

  <small className="home-section-subtitle d-block mt-2 text-white">
    Department of Tourism (DOT) Accredited Enterprises in Boracay Island, Malay, Philippines as of{" "}
    <strong>May 2025</strong>.
  </small>
</div>

        <div className="row">
            {buttonDataArray.length > 0 ? (
              buttonDataArray.slice(0, 8).map((button, index) => (
<div className="col-6 col-lg-3 m-0 p-1 p-md-2" key={index}>
                  <NavLink to={button.link} className="group">
                    <div
                      className="home-button-card"
                      style={{ "--button-color": button.color }}
                    >
                      <div
                        className="home-button-bg"
                        style={{
                          backgroundImage: `url(${button.image ? button.image : fallbackImage})`,
                        }}
                      ></div>
                      <div className="home-button-gradient"></div>
                      <img src={DOTlogo} alt="DOT Accreditation" className="home-button-logo" />
                      {button.icon && (
            <FontAwesomeIcon icon={iconMap[button.icon]} className="home-button-icon" />
          )}

                      <div className="home-button-content">
                        <p className="home-button-name">{button.name}</p>
                        <p className="home-button-caption">{button.caption}</p>
                      </div>
                    </div>
                  </NavLink>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No data available</p>
            )}
          </div>

      
      </div>

      
          </div>
        );
      };

export default HomeButtons;
