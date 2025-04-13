import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faHotel, faSpa, faUtensils, faBuilding, faPlane, faCar, faMapMarkedAlt, faShoppingBag, faBiking, faTree, faShip, faCalendarAlt, faDumbbell, faCocktail, faCoffee, faParking, faHospital } from "@fortawesome/free-solid-svg-icons";
import HomeButtonFormData from "../datamodel/homeButtons_model";

// Creating objects using the model
const button1 = new HomeButtonFormData();
button1.name = "ACCOMMODATION ESTABLISHMENTS";
button1.link = "/infoguideapp/enterprises/accommodations";
button1.image = "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/homeButtons%2Faccommodations.png?alt=media&token=b925b582-a826-4c41-867c-c0d0b395c73d";
button1.color = "#A051EE";
button1.caption = "Find the best places to stay.";
button1.icon = "hotel";

const button2 = new HomeButtonFormData();
button2.name = "RESTAURANTS";
button2.link = "/infoguideapp/enterprises/restaurants";
button2.image = "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/homeButtons%2Fboracaydine.png?alt=media&token=b0afdc72-a651-4f2c-a825-a9059bc5314d";
button2.color = "#DA3C3C";
button2.caption = "Explore the best dining spots.";
button2.icon = "restaurant";

const button3 = new HomeButtonFormData();
button3.name = "SPA & WELLNESS CENTERS";
button3.link = "/infoguideapp/enterprises/spaAndWellnessCentres";
button3.image = "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/homeButtons%2Fspawellnessbackground.png?alt=media&token=ba96844e-1608-4438-95fc-902ff797c6a1";
button3.color = "#2D8B3C";
button3.caption = "Relax and rejuvenate.";
button3.icon = "spa";

const button4 = new HomeButtonFormData();
button4.name = "M.I.C.E. FACILITIES";
button4.link = "/infoguideapp/enterprises/MICEFacilities";
button4.image = "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/homeButtons%2Fmicebackground.jpg?alt=media&token=10a7509d-39a0-4781-a2e8-fb4ca240e95c";
button4.color = "#008080";
button4.caption = "Meet, innovate, and collaborate.";
button4.icon = "building";



const button5 = new HomeButtonFormData();
button5.name = "TOURIST LAND & AIR TRANSPORT OPERATORS";
button5.link = "/infoguideapp/enterprises/touristLandAndAirTransportOperators";
button5.image = "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/homeButtons%2Ftouristlandandairtransfer-min.png?alt=media&token=9c991c65-624f-4b18-9b6e-ff803068c7ba";
button5.color = "#F3DB3B";
button5.caption = "Reliable transport options.";
button5.icon = "plane";

const button6 = new HomeButtonFormData();
button6.name = "TRAVEL AND TOUR OPERATORS";
button6.link = "/infoguideapp/enterprises/travelAndTourOperators";
button6.image = "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/homeButtons%2FtravelAndToursbackground-min.png?alt=media&token=41c0c7d3-697a-4031-8043-1fe7996bd29b";
button6.color = "#4682B4";
button6.caption = "Plan your next adventure.";
button6.icon = "flag";

const button7 = new HomeButtonFormData();
button7.name = "TOUR GUIDES";
button7.link = "/infoguideapp/enterprises/tourguides";
button7.image = "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/homeButtons%2Ftourguidesboracay.png?alt=media&token=b66c7bcf-4935-4c18-bda9-d07197397eb6";
button7.color = "#FF8A00";
button7.caption = "Experience guided tours.";
button7.icon = "mic";

const button8 = new HomeButtonFormData();
button8.name = "TOURIST & SPECIALTY SHOPS";
button8.link = "/infoguideapp/enterprises/touristAndSpecialtyShops";
button8.image = "https://firebasestorage.googleapis.com/v0/b/infoguide-13007.firebasestorage.app/o/homeButtons%2Ftouristshops.jpg?alt=media&token=c3aaa527-0878-426f-92f2-5ed4f348bdbd";
button8.color = "#8B4513";
button8.caption = "Shop for souvenirs and gifts.";
button8.icon = "shopping";

const button9 = new HomeButtonFormData();
button9.name = "MAINLAND MALAY HOTELS";
button9.link = "/infoguideapp/enterprises/mainlandMalayHotels";
button9.image = "";
button9.color = "#E6A8D7"; // Vibrant pastel pink-purple
button9.caption = "Comfortable stays on the mainland.";
button9.icon = "hotel";

const button10 = new HomeButtonFormData();
button10.name = "RECREATIONAL RESORTS";
button10.link = "/infoguideapp/enterprises/resorts";
button10.image = "";
button10.color = "#86D8B7"; // Vibrant pastel teal-green
button10.caption = "Relax and unwind in nature.";
button10.icon = "umbrella-beach";

const button11 = new HomeButtonFormData();
button11.name = "TOURIST ACTIVITY PROVIDERS";
button11.link = "/infoguideapp/enterprises/touristActivityProviders";
button11.image = "";
button11.color = "#F7B787"; // Vibrant pastel peach-orange
button11.caption = "Exciting experiences for travelers.";
button11.icon = "running";

const button12 = new HomeButtonFormData();
button12.name = "EVENTS PLANNING COMPANIES";
button12.link = "/infoguideapp/enterprises/eventsPlanning";
button12.image = "";
button12.color = "#B1A7F2"; // Vibrant pastel blue-purple
button12.caption = "Plan your perfect event.";
button12.icon = "calendar-check";

const button13 = new HomeButtonFormData();
button13.name = "PASSENGER SHIPLINES";
button13.link = "/infoguideapp/enterprises/passengerShipLines";
button13.image = "";
button13.color = "#A52A2A";
button13.caption = "Sail across destinations.";
button13.icon = "ship";

const button16 = new HomeButtonFormData();
button16.name = "GYMS & FITNESS CENTERS";
button16.link = "/infoguideapp/enterprises/gymnsAndFitnessClubs";
button16.image = "";
button16.color = "#E13F6A";
button16.caption = "Stay fit and active.";
button16.icon = "gym";

const button17 = new HomeButtonFormData();
button17.name = "BARS & PARTY CLUBS";
button17.link = "/infoguideapp/enterprises/barsAndPartyClubs";
button17.image = "";
button17.color = "#191970";
button17.caption = "Enjoy the nightlife.";
button17.icon = "bar";

const button18 = new HomeButtonFormData();
button18.name = "CAFE & COWORKING SPACES";
button18.link = "/infoguideapp/enterprises/cafeAndCoworking";
button18.image = "";
button18.color = "#B2F130";
button18.caption = "Work and relax in cafes.";
button18.icon = "cafe";

const button19 = new HomeButtonFormData();
button19.name = "MAINLAND PARKING SPACE";
button19.link = "/infoguideapp/enterprises/parkingSpaces";
button19.image = "";
button19.color = "#F3B03B";
button19.caption = "Find convenient parking.";
button19.icon = "parking";

const button20 = new HomeButtonFormData();
button20.name = "HOSPITALS AND CLINICS";
button20.link = "/infoguideapp/enterprises/hospitalsAndClinics";
button20.image = "";
button20.color = "#04D9A4";
button20.caption = "Healthcare facilities.";
button20.icon = "hospital";



// Exporting the button data
const ButtonDataArray = [
    button1, button2, button3, button4, button5, button6, button7, button8, button9, button10, button11, button12,
    button13, button16, button17, button18, button19, button20];

export default ButtonDataArray;



// const button9 = new HomeButtonFormData();
// button9.name = "ACTIVITIES";
// button9.link = "activities";
// button9.image = "";
// button9.color = "#556B2F";
// button9.caption = "Exciting activities await.";
// button9.icon = faBiking;

// const button10 = new HomeButtonFormData();
// button10.name = "ATTRACTIONS";
// button10.link = "attractions";
// button10.image = "";
// button10.color = "#32CD32";
// button10.caption = "Discover top attractions.";
// button10.icon = faTree;