    export default class DealsFormData {
        constructor() {
            this.id = "";
            this.dateTimeStart = "";
            this.dateTimeEnd= "";
            this.category = "";
            this.title = "";
            this.body= [{ subtitle: "", body: "", image: null, image_source: ""}],
            this.headerImage = null;
            this.headerImageSource = [];
            this.tags = [];
            this.references= [];
            this.socials= [];
            this.origin= [];
        }
        toJSON() {
            return { ...this };
        }
    }
    
    export const dealsAndPromotionsCategoryOptions = [
        "Compilation (Hotels)",
        "Compilation (Restaurants)",
        "Compilation (Tour Packages)",
        "Compilation (Travel Deals)",
        "Compilation (Local Services)",
        "Discount Offers",
        "Limited-Time Deals",
        "Buy One Get One (BOGO)",
        "Seasonal Promotions",
        "Loyalty Rewards",
        "Flash Sales",
        "Bundle Deals",
        "Exclusive Online Deals",
        "Freebies & Giveaways",
        "Early Bird Specials",
        "Referral Discounts",
        "Holiday Specials",
        "Weekend Promotions",
        "First-Time Customer Deals",
        "Cashback Offers",
        "Promo Codes & Vouchers",
        "Membership Discounts",
        "Corporate Discounts"
    ];
  
  