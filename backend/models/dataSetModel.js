const mongoose = require("mongoose");

const dataSetSchema = new mongoose.Schema({
  channel_link: { type: String, index: true },
  channel_name: { type: String, index: true },
  creation_date: { type: String },
  total_views: { type: String },
  business_email: { type: String, index: true },
  description: { type: String },
  social_links: { type: String },
  subscribers: { type: String },
  monetization: { type: String },
  tags: { type: String },
});

const dataSet = mongoose.model("channels", dataSetSchema);
module.exports = dataSet;
