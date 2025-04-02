export default class TourismStoriesFormData {
    constructor() {
        this.id = "";
        this.title = "";
        this.classification = "";
        this.purpose = "";
        this.date = "";
        this.body= [{ subtitle: "", body: "", image: null, image_source: ""}],
        this.headerImage = null;
        this.tags = [];
        this.references= [];
        this.name = "";
        this.email = "";
        this.social = "";


    }
    toJSON() {
        return { ...this };
    }
}



export const storiesClassificationOptions = [
    "Informative",
    "Inspirational",
    "Ranking",
    "Tourism Awards and Recognitions",
    "Promotional and Marketing",
    "Educational",
    "Opinions and Review"
];

export const storiesPurposeOptions = {
    Informative: [
        "Statistical Reports",
        "News",
        "Awards and Recognitions",
        "Tourism Projects",
        "Tourism Trends",
        "Popularity Ranking",
        "Technology"
    ],
    "Promotional and Marketing": [
        "Travel Deals and Promotions",
        "Itinerary-Based",
        "Cultural Exploration",
        "Events or Festival Coverage",
        "Destination Highlight"
    ],
    "Tourism Awards and Recognitions": [
        "Tourism Enterprises Awards",
        "International Awards and Recognition",
        "National Awards and Recognitions",
        "Sports Tourism Awards"
    ],
    Ranking: [
        "Best Hotels",
        "Best Restaurants",
        "Best Tourism Frontliners",
        "Best Spa and Wellness Centers",
        "Best Tourism Shops",
        "Best Bars and Party Clubs",
        "Best Buffet Restaurants"
    ],
    Inspirational: [
        "Story-Telling",
        "Sustainable Tourism",
        "Biography"
    ],
    Educational: [
        "Travel Tips",
        "Practical or How-To",
        "Budgeting and Financial Planning",
        "Safety and Health"
    ],
    "Opinions and Review": [
        "Product and Service Reviews",
        "Case Study"
    ]
};
