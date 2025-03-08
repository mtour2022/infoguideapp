    export default class TariffRatesFormData {
        constructor() {
            this.id = "";
            this.title = "";
            this.ordinance = "";
            this.implementor = [];
            this.body= [{ subtitle: "", body: "", image: null, image_source: ""}],
            this.headerImage = null;
            this.serviceProviders = [];
            this.references = [];
        }
        toJSON() {
            return { ...this };
        }
    }
