export default class TourismEnterprisesFormData {
    constructor() {
        this.id = "";
        this.name = "";
        this.category = "";
        this.subcategory = "";
        this.classification = "";
        this.accreditation = "";
        this.established = "";
        this.lowest = "";
        this.slogan = "";
        this.description = "";
        this.facilities = [];
        this.activities = [];
        this.awards = [];
        this.images = [];
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