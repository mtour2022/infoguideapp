

export default class UpdateFormData {
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
  
    
  
  
  
  
  export const updatesCategoryOptions = [
      "Advisories",
      "News",
      "Reminders",
      "Announcements",
      "Holidays",
      "Events",
      "Guidelines",
      "Policies",
      "Emergency Alerts",
      "Community Updates",
      "Opportunities",
      "Public Notices",
      "Press Releases",
    ];
  