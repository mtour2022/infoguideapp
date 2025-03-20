
    export default class AwardsAndRecognitionsFormData {
        constructor() {
            this.id = "";
            this.title = "";
            this.year = "";
            this.rank = "";
            this.category = [];
            this.description = "";
            this.headerImage = null;
            this.references = [];
        }
        toJSON() {
            return { ...this };
        }
    }



    export const awardsAndRecognitionCategoryOptions = [
        "LGU Award",
        "International Award",
        "International Recognition",
        "National Award",
        "National Recognition",
        "Regional Award",
        "Regional Recognition",
        "Certifications",
        "Seals",
    ];
    
  