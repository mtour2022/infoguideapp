export default class TourGuideFormData {
    constructor() {
        this.id = "";
        this.name = "";
        this.designation = "";
        this.nationality = "";
        this.birthday = "";
        this.sex = "";
        this.height = "";
        this.weight = "";
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
        this.language = [];
        this.category = "";
        this.subcategory = "";
        this.classification = "";
        this.description = "";
        this.images = [];
        this.logo = null;
        this.headerImage = null;
        this.link = "";
        this.geo = "";
        this.accreditation = "";
        this.awards = [];
        this.socials = [];
        this.memberships = [];
        this.note = "";
    }
  
    toJSON() {
        return { ...this };
    }
  }
  