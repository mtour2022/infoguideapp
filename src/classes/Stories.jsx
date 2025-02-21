class Stories {
    constructor({
        id = "",
        classification = "",
        title = "",
        image = "",
        date = "",
        body = [],  // Set default as an empty array
        tags = [],
        reference = [],
        name = "",
        email = "",
        social = "",
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
