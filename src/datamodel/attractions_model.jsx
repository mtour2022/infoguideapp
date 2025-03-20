export default class AttractionsFormData {
    constructor() {
        this.id = "";
        this.name = "";
        this.category = [];
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
        this.howToGetThere = "";
        this.tags = [];
        this.thingsToDo = [];
    }
  
    toJSON() {
        return { ...this };
    }
  }



  export const attractionsCategoryOptions = [
    "Marvels of Malay",
    "Beaches",
    "Parks & Nature Reserves",
    "Museums & Art Galleries",
    "Historical Landmarks",
    "Amusement Parks",
    "Zoos & Wildlife Sanctuaries",
    "Waterfalls",
    "Mountains & Hiking Trails",
    "Caves & Underground Rivers",
    "Religious Sites & Temples",
    "Lakes","Rivers",
    "Cultural Villages",
    "Botanical Gardens",
    "Scenic Viewpoints",
    "Adventure & Theme Parks",
    "Eco-Tourism Sites",
    "Diving & Snorkeling Spots",
    "Hot Springs & Wellness Retreats",
    "Festivals & Events",
    "Cold Springs",
    "Camping and Glamping Area",
    "Food & Culinary Attractions",
    "Living Museum",
    "Experiencial Tour"

  ];
  

