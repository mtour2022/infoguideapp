
    export default class CruiseShipsFormData {
        constructor() {
            this.id = "";
            this.title = "";
            this.dateStart = "";
            this.dateEnd= "";
            this.country = "";
            this.total = "";
            this.description = "";
            this.headerImage = null;
            this.references = [];
            this.images = [];
        }
        toJSON() {
            return { ...this };
        }
    }

