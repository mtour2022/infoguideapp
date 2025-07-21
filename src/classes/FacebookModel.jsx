class SocialPost {
  constructor({
    id = "",
    platform = "",
    url = "",
    title = "",
    created_at = null,
    posted_at = null,
    visible = true,
    // Optional fields for extension
    description = "",
    tags = [],
    social = { facebook: "", instagram: "", tiktok: "", youtube: "" },
  }) {
    this.id = id;
    this.platform = platform; // "facebook", "instagram", etc.
    this.url = url;
    this.title = title;
    this.created_at = created_at ? new Date(created_at) : new Date();
        this.posted_at = posted_at ? new Date(posted_at) : new Date();

    this.visible = visible;

    this.description = description;
    this.tags = tags;
    this.social = social;
  }
}

export default SocialPost;


