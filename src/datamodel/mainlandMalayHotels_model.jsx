export default class MainlandMalayHotelsFormData {
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

  


