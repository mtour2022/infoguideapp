    export default class LifeStyleFormData {
        constructor() {
            this.id = "";
            this.title = "";
            this.body= [{ subtitle: "", body: "", image: null, image_source: ""}],
            this.headerImage = null;
            this.references = [];
        }
        toJSON() {
            return { ...this };
        }
    }
