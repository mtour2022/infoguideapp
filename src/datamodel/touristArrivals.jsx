
    export default class TouristArrivalsFormData {
        constructor() {
            this.id = "";
            this.title = "";
            this.year = "";
            this.month = "";
            this.subTotal = "";
            this.description = "";
            this.headerImage = null;
            this.references = [];
        }
        toJSON() {
            return { ...this };
        }
    }




    
  