
    export default class TravelExposFormData {
        constructor() {
            this.id = "";
            this.title = "";
            this.dateStart = "";
            this.dateEnd= "";
            this.category = [];
            this.classification= "";
            this.description = "";
            this.headerImage = null;
            this.references = [];
            this.images = [];
        }
        toJSON() {
            return { ...this };
        }
    }



    export const travelExposCategoryOptions = [
        "Travel Expos",
        "Travel Exhibits",
        "Travel Conventions",
        "Global Tourism Meetings",
        "Travel Festivals",
        "Business to Business Meetings",
        "Travel Roadshows",
        "Travel Fairs",
        "Travel Exchange",
        "Tourism Summit",
        "Tourism Conferences",
    ];
    
    export const travelExposClassificationOptions = [
        "International",
        "National",
        "Regional",
        "Local"
    ];