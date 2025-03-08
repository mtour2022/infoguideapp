    export default class OrdinancesFormData {
        constructor() {
            this.id = "";
            this.title = "";
            this.ordinance = "";
            this.description = "";
            this.logo = null;
            this.references = [];
        }
        toJSON() {
            return { ...this };
        }
    }



