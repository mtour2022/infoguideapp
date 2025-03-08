    export default class SustainableFormData {
        constructor() {
            this.id = "";
            this.category = "";
            this.title = "";
            this.body= [{ subtitle: "", body: "", image: null, image_source: ""}],
            this.headerImage = null;
            this.headerImageSource = [];
            this.tags = [];
            this.references= [];
        }
        toJSON() {
            return { ...this };
        }
    }
    
    export const sustainableTourismCategoryOptions = [
        "To Bring",
        "To Avoid",
        "To Remember",
        "To Support",
      ];
      
  