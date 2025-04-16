    export default class IncomingEventsFormData {
        constructor() {
            this.id = "";
            this.dateTimeStart = "";
            this.dateTimeEnd= "";
            this.category = "";
            this.title = "";
            this.body= [{ subtitle: "", body: "", image: null, image_source: ""}],
            this.headerImage = null;
            this.headerImageSource = [];
            this.tags = [];
            this.references= [];
            this.socials= [];
            this.origin= [];
        }
        toJSON() {
            return { ...this };
        }
    }
    
    export const incomingEventsCategoryOptions = [
        "Concerts & Live Music",
        "Festivals & Celebrations",
        "Clean Up and Tree Planting Activities",
        "Tourism Service Competitions",
        "Beach and Water Sports Events",
        "Sports Events",
        "Conferences & Seminars",
        "Workshops & Training",
        "Networking Events",
        "Charity & Fundraisers",
        "Community Gatherings",
        "Art Exhibitions & Cultural Events",
        "Theater & Performing Arts",
        "Food Festivals and Local Products Fares",
        "Tech & Startup Events",
        "Trade Shows & Expos",
        "Wellness & Fitness Events",
        "Educational Events",
        "Business & Corporate Events",
        "Gaming & eSports Tournaments",
        "Movie Screenings & Film Festivals",
        "Religious & Spiritual Events",
        "Travel & Adventure Activities"
      ];
      
  