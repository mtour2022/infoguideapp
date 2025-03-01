export default class AccommodationFormData {
  constructor() {
      this.id = "";
      this.name = "";
      this.category = "";
      this.subcategory = "";
      this.classification = "";
      this.accreditation = "";
      this.ratings = "";
      this.established = "";
      this.lowest = "";
      this.slogan = "";
      this.description = "";
      this.facilities = [];
      this.amenities = [];
      this.awards = [];
      this.images = [];
      this.roomtypes = [];
      this.operatinghours = [];
      this.inclusivity = [];
      this.accessibility = "";
      this.logo = null;
      this.headerImage = null;
      this.website = "";
      this.address = {
          street: "",
          barangay: "",
          town: "",
          region: "",
          province: "",
          country: "",
          lat: "",
          long: "",
      };
      this.link = "";
      this.geo = "";
      this.socials = [];
      this.memberships = [];
      this.note = "";
  }

  toJSON() {
      return { ...this };
  }
}

  




export const categoryOptions = [
    "Hospitality & Lodging",
    "Food & Beverages",
    "Tourism & Leisure",
    "Health & Wellness",
    "Transport & Parking",
    "Medical Facilities",
  ];



  export const subcategoriesOptions = {
    "Hospitality & Lodging": [
      "Accommodation Establishments",
      "Recreational Resorts",
    ],
    "Food & Beverages": [
      "Restaurants",
      "Bars & Party Clubs",
      "Café & Coworking",
    ],
    "Tourism & Leisure": [
      "Tour Guides",
      "Travel & Tour Operators",
      "Tourist Activity Providers",
      "M.I.C.E. Facilities",
      "Events Planning Companies",
      "Tourist & Specialty Shops",
    ],
    "Health & Wellness": [
        "Spa & Wellness Centres", "Gymns & Fitness Clubs"],
    "Transport & Parking": [
      "Tourist Land Transport Operators",
      "Tourist Air Transport Operators",
      "Passenger Ship Lines",
      "Parking Spaces",
    ],
    "Healthcare Facilities": [
      "Hospitals & Clinics",
      "Veterinary Clinics",
      "Dental Clinics",
    ],
  };

  export const classificationOptions= {
    "Accommodation Establishments": [ "Resort", "Hotel", "Mabuhay Accommodation", "Apartment Hotel/Apartel"],
    "Recreational Resorts": ["Mainland Activity Resort"],
    "Restaurants": [ "Fine Dining", "Buffet", "Casual Dining", "Pop-up", "Fast Foood", "Bistro", "Pub"],
    "Bars & Party Clubs": ["Cocktail Bar", "Live Music Bar", "Lounges", "Sports Bar", "Entertainment Bars", "Dance Clubs", "Rooftop Clubs"],
    "Café & Coworking": ["Classic Café", "Breakfast Café", "Coworking Café", "Brunch Café", "Pub Café", "Open Coworking Space"],
    "Tour Guides": ["Local Tour Guide", "Regional Tour Guide", "Community Guide", "Eco Guide"],
    "Travel & Tour Operators": ["Local", "Foreign"],
    "Tourist Activity Providers": ["Water Activity Provider", "Aqua Sports Provider", "Land Activity Provider", "Aerial Activity Provider", "Food & Beverage Provider", "Transport Provider", ],
    "M.I.C.E. Facilities": ["Convention Center", "Conference Rooms", "Meeting Rooms", "Ballrooms, Exhibition Halls"],
    "Events Planning Companies": ["Wedding Planner", "Corporate Event Planner", "Conference Planner"],
    "Tourist & Specialty Shops": ["Souvenir Shop", "Gift Shop", "Local Market", "Wet Market", "Tattoo Shop"],
    "Spa & Wellness Centres": ["Spa Treatments", "Massage Salon"],
    "Gymns & Fitness Clubs": ["Commercial Gymn", "Boxing Club", "Ballet Club", "Dance Studio", "Yoga Studio"],
    "Tourist Land Transport Operators": ["Shuttle Service", "Car/Van Rental", "Tour Bus Company", "Airport Transfer Service", "Taxi Operator"],
    "Tourist Air Transport Operators": ["Airline Service", "Helicopter Service"],
    "Passenger Ship Lines": ["Ferry Service", "Ocean Liner"],
    "Parking Spaces": ["Parkling Lot"],
    "Hospitals & Clinics": ["General Hospital", "Retail Clinic", "Heath-care Center"],
    "Veterinary Clinics": ["Animal Practice", "General Veterinaryc Care"],
    "Dental Clinics": ["General Dentistry", "Pediatric Destistry", "Cosmetic Dentistry", "Orthodontics"],
    }
  
  export const geoOptions = [
    'Boracay Island',
    'Mainland Malay',
    'Caticlan Area (Near Airport and Jettyport)',
    'Nearby Town',
    'Capital Town, Kalibo',
    'Municipality of Malay',
    'Aklan Province'
  ];

    
  export const inclusivityOptions = [
    'PWD-friendly',
    'Pet-friendly',
    'Senior Citizen Friendly',
    'Kid-friendly',
    'Muslim-friendly',
    'Gender-friendly',
    'Budget-friendly'
  ];
  
  
  export const accessibilityOptions = [
    'Beachfront',
    'Beside Main/Commercial Road',
    'Beside Access Road',
    'Private Road',
    'Coastal Area',
    'Riverside',
    'Hillside',
  ];
  

  export const roomTypeOptions = [
    'Single',
    'Standard Double',
    'Standard Twin Room',
    'Deluxe Double Room',
    'Deluxe Triple Room',
    'Deluxe Family Room',
    'Studio Room or Apartment',
    'Junior Suite', 'Executive Suite',
    'Presidential Suite',
    'Bunk Bed',
    'Villa',
    'Triple Room',
    'Quad Room',
    'Connecting Room',
    'Cabana',
  ];
  
  export const facilitiesOptions = [
    'Reception & Concierge Desk',
    'Parking Area',
    'CCTV Protected',
    'Indoor Dining',
    'Basic Fitness Center',
    'Spa & Wellness Center',
    'Swimming Pool',
    'Pool Bar',
    'Rooftop Bar / Lounge',
    'Game Room & Entertainment Areas',
    'Playgrounds & Kids’ Areas',
    'Private Beach Access',
    'Banquet & Event Halls',
    'Business & Conference Rooms',
    'Indoor Cafe'
  ];
  
  export const amenitiesOptions = [
    'Housekeeping Service',
    'Wi-Fi Internet Access',
    'Toiletries',
    'Smart TV & Entertainment',
    'Air Conditioning',
    'Minibar & Coffee Maker',
    'Bathrobe & Slippers',
    'In-Room Safe',
    'Airport Transfers',
    'Shuttle Services',
    'Pet-Friendly Services',
    'IT Assistance',
    'Complimentary Breakfast',
    'Laundry Services',
    '24/7 Security Guard',
    'Golf Course Access',
  ];
  
