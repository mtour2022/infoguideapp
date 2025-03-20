
    export default class TourismProjectsFormData {
        constructor() {
            this.id = "";
            this.title = "";
            this.category = [];
            this.body= [{ subtitle: "", body: "", image: null, image_source: ""}],
            this.headerImage = null;
            this.references = [];
            this.images = [];
        }
        toJSON() {
            return { ...this };
        }
    }


    export const tourismProjectsCategoryOptions = [
        "Environmental",
        "Digitalization",
        "Community Development",
        "Cultural Heritage",
        "Eco-Tourism",
        "Infrastructure Development",
        "Hospitality & Services",
        "Adventure & Recreation",
        "Sustainable Tourism",
        "Wildlife Conservation",
        "Educational & Awareness Programs",
        "Health & Wellness Tourism",
        "Indigenous People Empowerment",
        "Traditional Arts & Crafts",
        "Cultural Exchange Programs",
        "Indigenous Heritage Conservation",
        "Ethno-Tourism Initiatives"
    ];
    