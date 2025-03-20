    export default class VirtualTourGuideFormData {
        constructor() {
            this.id = "";
            this.title = "";
            this.body= [{ subtitle: "", body: "", image: null, image_source: ""}],
            this.references = [];
        }
        toJSON() {
            return { ...this };
        }
    }



