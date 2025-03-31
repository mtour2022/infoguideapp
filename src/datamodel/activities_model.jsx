export default class ActivitiesFormData {
    constructor() {
        this.id = "";
        this.name = "";
        this.category = "";
        this.body= [{ subtitle: "", body: "", image: null, image_source: ""}],
        this.images = [];
        this.operatinghours = [];
        this.accessibility = "";
        this.headerImage = null;
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
        this.note = "";
        this.tags = [];
        this.slogan = "";
        this.subcategory = "";
        this.lowest = [];
        this.maxPax = "";
        this.serviceProviders = [];

    }
    toJSON() {
        return { ...this };
    }
  }

  export const activitiesCategoryOptions = [
    "Water Sports",
    "Aqua Sports",
    "Cruise Activities",
    "Land Activities",
    "Aerial Activities",
    "Wellness Activities",
    "Cultural Experiences"
  ];
  

  export const activitiesSubcategoriesOptions = {
    "Water Sports": [
      "Surfing",
      "Kayaking",
      "Paddle Boarding",
      "Jet Skiing",
      "Parasailing",
      "Wakeboarding",
      "Floatable Rides"
    ],

    "Aqua Sports": [
      "Swimming",
      "Scuba Diving",
      "Snorkeling",
      "Free Diving",
      "Helmet Diving",
    ],
    "Cruise Activities": [
      "Sail Boat",
      "Party Boat",
      "Island Hopping",
      "Sunset Cruise",
      "Luxury Yacht Tour",
      "River Cruise",
      "Glass-Bottom Boat Tour"
    ],
    "Land Activities": [
    "Island Land Tour",
    "Mainland Tour",
      "Hiking & Trekking",
      "Bike Tour",
      "Camping & Glamping",
      "ATV & Buggy Car Adventures",
      "Rock Climbing",
      "Wildlife Safari & Bird Watching",
      "Horseback Riding"
    ],
    "Aerial Activities": [
      "Ziplining",
      "Bungee Jumping",
      "Helicopter & Small Aircraft Tours"
    ],
    "Wellness Activities": [
      "Yoga & Meditation Retreats",
      "Spa & Massage Therapy",
      "Cold Spring Escapade",
    ],
    "Cultural Experiences": [
      "Heritage & Historical Tours",
      "Traditional Dance & Music Shows",
      "Local Food & Culinary Tours",
      "Handicraft & Artisan Workshops",
      "Religious & Pilgrimage Tours",
      "Farm & Agri-Tourism"
    ]
  };
  

