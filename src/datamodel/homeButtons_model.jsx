export default class HomeButtonFormData {
    constructor() {
        this.name = "";
        this.link = "";
        this.image = "";
        this.color = "";
        this.caption = "";
        this.logo = "";
    }
    toJSON() {
        return { ...this };
    }
}
