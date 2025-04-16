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
      "accommodations",
      "mainlandMalayHotels",
      "resorts",
    ],
    "Food & Beverages": [
      "restaurants",
      "barsAndPartyClubs",
      "cafeAndCoworking",
    ],
    "Tourism & Leisure": [
      "tourguides",
      "travelAndTourOperators",
      "touristActivityProviders",
      "MICEFacilities",
      "eventsPlanningCompanies",
      "touristAndSpecialtyShops",
    ],
    "Health & Wellness": [
        "spaAndWellnessCentres", "gymnsAndFitnessClubs"],
    "Transport & Parking": [
      "touristLandTransportOperators",
      "touristAirTransportOperators",
      "passengerShipLines",
      "parkingSpaces",
    ],
    "Healthcare Facilities": [
      "hospitalsAndClinics",
    ],
  };

  export const classificationOptions= {
    "accommodations": [ "Resort", "Hotel", "Mabuhay Accommodation", "Apartment Hotel/Apartel"],
    "mainlandMalayHotels": [ "Resort", "Hotel", "Mabuhay Accommodation", "Apartment Hotel/Apartel"],
    "resorts": ["Mainland Activity Resort"],
    "restaurants": [ "Fine Dining", "Buffet", "Casual Dining", "Pop-up", "Fast Foood", "Bistro", "Pub"],
    "barsAndPartyClubs": ["Cocktail Bar", "Live Music Bar", "Lounges", "Sports Bar", "Entertainment Bars", "Dance Clubs", "Rooftop Clubs"],
    "cafeAndCoworking": ["Classic Café", "Breakfast Café", "Coworking Café", "Brunch Café", "Pub Café", "Open Coworking Space"],
    "tourguides": ["Local Tour Guide", "Regional Tour Guide", "Community Guide", "Eco Guide"],
    "travelAndTourOperators": ["Local", "Foreign"],
    "touristActivityProviders": ["Water Activity Provider", "Aqua Sports Provider", "Land Activity Provider", "Aerial Activity Provider", "Food & Beverage Provider", "Transport Provider", ],
    "MICEFacilities": ["Convention Center", "Conference Rooms", "Meeting Rooms", "Ballrooms, Exhibition Halls"],
    "eventsPlanningCompanies": ["Wedding Planner", "Corporate Event Planner", "Conference Planner"],
    "touristAndSpecialtyShops": ["Souvenir Shop", "Gift Shop", "Super Marekt", "Local Market", "Wet Market", "Food Stop", "Tattoo Shop"],
    "spaAndWellnessCentres": ["Spa Treatments", "Massage Salon"],
    "gymnsAndFitnessClubs": ["Commercial Gymn", "Boxing Club", "Ballet Club", "Dance Studio", "Yoga Studio"],
    "touristLandTransportOperators": ["Shuttle Service", "Car/Van Rental", "Tour Bus Company", "Airport Transfer Service", "Taxi Operator"],
    "touristAirTransportOperators": ["Airline Service", "Helicopter Service"],
    "passengerShipLines": ["Ferry Service", "Ocean Liner"],
    "parkingSpaces": ["Parkling Lot"],
    "hospitalsAndClinics": ["General Hospital", "Heath-care Center", "General Veterinaryc Care","General Dentistry", ],
    }
  
  export const geoOptions = [
    'Boracay Island',
    'Mainland Malay',
    'Caticlan Area (Near Airport and Jetty)',
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
    'Budget-friendly',
    'Vegan-friendly',
    'Allergen-friendly',
    'Pregnant-friendly'
  ];
  
  
  export const accessibilityOptions = [
    'Beachfront',

    'Beside Main/Commercial Road',
    'Beside Access Road',
    'Private Road',
    'Coastal Area',
    'Riverside',
    'Hillside (With Road Access)',
    'Walking Distant to Beach',
    'Forest Area (Trail Walk)',
    'Forest Area (With Community Guide)',
  ];
  

  export const roomTypeOptions = [
    'Single', 'Standard Room',
    'Standard Double',
    'Standard Twin Room',    'Deluxe Room',
    'Deluxe Double Room',
    'Deluxe Triple Room',
    'Deluxe Family Room',
    'Studio Room or Apartment','Apartment Suite', 'Apartelle', 'Suite Room','Penthouse Suite','Ambassador Suite','Mandarin Grand Suite',
    'Junior Suite', 'Executive Suite','Loft Suite',
    'Presidential Suite','Luxury Room',
    'Superior Room', 'Premier Room','Honeymoon Room', 'Family Room',
    'Bunk Bed',   "Bachelor's Pad",
    'Villa',   'Roofdeck Room',
    'Triple Room',   'Garden Veranda Room',
    'Quad Room',
    'Queen Bed',
    'King Bed',
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
    'Swimming Pool',  'Sky Deck Pool',
    'Pool Bar',   'Baggage Storage',
    'Rooftop Bar / Lounge',
    'Game Room & Entertainment Areas',
    'Playgrounds & Kids’ Areas',
    'Private Beach Access','Souvenir Shop',
    'Banquet & Event Halls',  'Kitchen and kitchenwares','Handicapped accessible rooms',
    'Business & Conference Rooms',
    'Indoor Cafe',    'Function Hall',    'Karaoke Room', 'View Deck',
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
    'IT Assistance','Massage Services',
    'Complimentary Breakfast',
    'Laundry Services',
    '24/7 Security Guard',
    'Golf Course Access',  'Room Service',
  ];
  
