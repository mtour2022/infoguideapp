export default class CalendarEventsFormData {
    constructor() {
        this.id = "";
        this.dateTimeStart = "";
        this.dateTimeEnd= "";
        this.category= "";
        this.title = "";
        this.body= [{ subtitle: "", body: "", image: null, image_source: ""}],
        this.headerImage = null;
        this.headerImageSource = [];
        this.tags = [];
        this.thingsToDo= [];
    }
    toJSON() {
        return { ...this };
    }
}

export const calendarEventsCategoryOptions = [
    "Cultural Events",
    "Anniversary",
    "Enterprise Event",
    "Beach Party",
    "Festival",
    "Sports Event",
    "Holiday Party",
    "Concert & Music Festival",
    "Fundraiser & Charity Event",
    "Networking Event",
    "Conference & Seminar",
    "Trade Show & Expo",
    "Community Gathering",
    "Retreat & Team Building",
    "Theme Party",
    "Yultide Celebration",
];

