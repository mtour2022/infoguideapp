export default class OtherTourismEnterprisesFormData {
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
  