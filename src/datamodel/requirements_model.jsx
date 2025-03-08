    export default class RequirementsFormData {
        constructor() {
            this.id = "";
            this.title = "";
            this.body= [{ subtitle: "", body: "", image: null, image_source: ""}],
            this.port = "";
            this.purpose = "";
            this.headerImage = null;
            this.references = [];
        }
        toJSON() {
            return { ...this };
        }
    }

    export const requirementsPortOptions = [
        'Caticlan Jetty Port',
        'Tabon Port',
        'Cagban Port',
        'Tambisaan Port',
      ];
    
    export const requirementsPurposeOptions = [
        'Tourists Entry',
        'Tourists Exit',
        'Aklanon Tourists Entry',
        'Aklanon Tourists Exit',
        'Same-day Pass (Entry)',
        'Same-day Pass (Exit/Mainland Tour)',
    ];

