    export default class HelpfulLinksFormData {
        constructor() {
            this.id = "";
            this.title = "";
            this.ordinance = "";
            this.description = "";
            this.headerImage = null;
            this.references = [];
        }
        toJSON() {
            return { ...this };
        }
    }



