class Stories {
    constructor({
        id = "",
        name = "",
        category="",
        classification= "",
        accreditation = "",
        ratings= "",
        established= "",
        lowest= "",
        assets= [],
        slogan = "",
        description = "",
        facilities= [],
        amenities = [],
        awards= [],
        images= [],
        roomtypes=[],
        advantages=[],
        accessibility=[],
        logo = "",
        headerImage = "",
        images=[],
        website=[],
        address= [],
        lat= "",
        long= "",
        maplink= "",
        socials= [{ facebook: "", instagram: "", tiktok: "", youtube: ""}],
    }) {
        this.id = id;
        this.classification = classification;
        this.title = title;
        this.image = image;
        this.date = date;
        this.body = Array.isArray(body) ? body : []; // Ensure body is always an array
        this.tags = tags;
        this.reference = reference;
        this.name = name;
        this.email = email;
        this.social = social;
    }
}

export default Stories;
