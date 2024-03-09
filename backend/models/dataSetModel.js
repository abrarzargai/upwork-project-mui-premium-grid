const mongoose = require("mongoose");

const dataSetSchema = new mongoose.Schema({
  channel_link: { type: String },
  channel_name: { type: String },
  creation_date: { type: String },
  total_views: { type: String },
  business_email: { type: String },
  description: { type: String },
  social_links: { type: String },
  subscribers: { type: String },
  monetization: { type: String },
  tags: { type: String },
},
{  timestamps: true });

const dataSet = mongoose.model("dataset", dataSetSchema);
module.exports = dataSet;
