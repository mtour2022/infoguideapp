export default class RecreationalResortsFormData {
    constructor() {
        this.id = "";
        this.name = "";
        this.category = "";
        this.subcategory = "";
        this.classification = "";
        this.established = "";
        this.lowest = "";
        this.slogan = "";
        this.description = "";
        this.facilities = [];
        this.activities = []; //instead of amenities activities iya
        this.images = [];
        this.operatinghours = [];
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
        this.note = "";
    }
  
    toJSON() {
        return { ...this };
    }
  }

  export const resortFacilitiesOptions = [
    'Reception Desk',
    'Parking Area',
    'CCTV Protected',
    'Restaurant',
    'Security Guard/House',
    'WiFi Connection',
    'Storage or Locker',
    'Accommodation',
    'Swimming Pool',
    'Common Bathroom or Changing Room',
    'Cafe',
    'Bar',
    'Obstacle Course',
    'Kubo House',
    'Conference/Events Room',
    'Lights and Sounds',
    'LED Wall',
    'Photography Boot/Station',
    'Shuttle',
    'Entertainment Area',
    'Live Music',
    'Lounge'
  ];
  

  export const resortActivitiesOptions = [
    'Swimming',
    'ATV Ride',
    'Buggy Car Ride',
    'Splash Slide',
    'Cliff Diving',
    'Floating Matt',
    'Crystal Kayaking',
    'River Kayaking',
    'Stand-up Paddle Board',
    'Kawa Bath',
    'Superman Zipline',
    'Sky Bike',
    'Monkey Zipline',
    'Team-building',
    'Conferences and Meetings',
    'Dine',
    'Platter Dine',
    'Buffet Lunch Dining',
    'Try Local Delicacies',
    'Boodle Fight Dining',
    'Camping',
    'Glamping',
    'Overnight Stay',
    'Bonfire'
  ];
  