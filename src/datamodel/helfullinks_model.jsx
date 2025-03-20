    export default class HelpfulLinksFormData {
        constructor() {
            this.id = "";
            this.title = "";
            this.category = [];
            this.description = "";
            this.headerImage = null;
            this.references = [];
        }
        toJSON() {
            return { ...this };
        }
    }



    export const helpfulLinksCategoryOptions = [
        "General Inquiries",
        "Complaints & Assistance",
        "Entry & Exit Fees and Requirements",
        "Tourist Registration",
        "Travel Inspiration",
        "Tourism Campaigns",
        "News & Updates",
        "Public Transportation",
        "Car Rentals & Ridesharing",
        "Hotel & Accommodation Booking",
        "Tour & Activity Reservations",
        "Local Tips & Recommendations",
        "Sustainable & Eco-Tourism",
        "Cultural & Heritage Sites",
        "Emergency Contacts & Safety",
        "Visa & Immigration Information",
        "Currency Exchange & Payments",
        "Weather & Climate Updates",
        "Language & Communication",
        "Local Laws & Etiquette",
        "Food & Dining Guides",
        "Shopping & Souvenirs",
        "Events & Festivals",
        "Healthcare & Medical Assistance",
        "Itinerary Generation",
        "Tourism Enterprise Accreditation"
    ];
    