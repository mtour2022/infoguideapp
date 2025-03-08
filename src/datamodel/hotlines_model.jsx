    export default class HotlinesFormData {
        constructor() {
            this.id = "";
            this.name = "";
            this.category = "";
            this.landline = [];
            this.mobile = [];
            this.satellite = [];
            this.logo = null;
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
            this.socials = [];
            this.geo = "";
            this.link = "";

        }
        toJSON() {
            return { ...this };
        }
    }
    
    export const hotlinesCategoryOptions = [
        "Emergency Hotline",
        "First Aid and Medical Attention",
        "Fire Supression",
        "Water Rescue",
        "Police Assistance",
        "Healthcare",
        "Mental Care",
        "Tourist Assistance",
        "Tourist Inquiries and Complaints",
        "Animal Welfare",
    ];
  
  