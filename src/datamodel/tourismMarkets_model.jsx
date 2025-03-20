
    export default class TourismMarketFormData {
        constructor() {
            this.id = "";
            this.title = "";
            this.body= [{ subtitle: "", body: "", image: null, image_source: ""}],
            this.headerImage = null;
            this.references = [];
            this.images = [];
        }
        toJSON() {
            return { ...this };
        }
    }
