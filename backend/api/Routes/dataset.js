const express = require("express");
const route = express.Router();
const collection = require("../../models/dataSetModel");
const jsonData = require("../../scripts/output.json");

route.post("/save", async (req, res, next) => {
  try {
    const payload = req.body;
    const records = await collection.create(jsonData);
    return res.status(201).json({ success: true, records });
  } catch (e) {
    console.log(e);
    return next(e);
  }
});

route.post("/count", async (req, res, next) => {
  try {
    const { filter = []} = req.body;
    const payload = payloadHandler(filter);
    const count  = await collection.countDocuments(payload)
    return res.status(200).json({ success: true, count });
  } catch (e) {
    console.log(e);
    return next(e);
  }
});

route.post("/search", async (req, res, next) => {
  try {
    const { filter = [], skip = 0, limit = 5 } = req.body;
    const payload = payloadHandler(filter);

    const records = await collection.aggregate([
      { $match: payload },
      { $skip: skip },
      { $limit: limit },
    ]);

    return res.status(200).json({ success: true, records, count: 0 });
  } catch (e) {
    console.log(e);
    return next(e);
  }
});

module.exports = route;

var payloadHandler = (payload) => {
  let data = {};
  payload.map(({ operation, value, field }) => {
    if (value?.trim() !== "") data[field] = operationHandler(operation, value);
  });
  return data;
};
var operationHandler = (operation, value) => {
  if (operation === "isAnyOf") {
    return { $in: value.split(",") };
  } else if (operation === "equals") {
    return value;
  } else if (operation === "startsWith") {
    return { $regex: new RegExp(`^${value}`, "i") };
  } else if (operation === "endsWith") {
    return { $regex: new RegExp(`${value}$`, "i") };
  } else if (operation === "isEmpty") {
    return "";
  } else if (operation === "isNotEmpty") {
    return { $ne: "" };
  } else {
    return { $regex: new RegExp(value, "i") };
  }
};
