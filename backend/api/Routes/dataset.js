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
    console.log("filter==>",filter)
    console.log("payload==>",payload)
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
  payload.map(({ operator, value, field }) => {
    if (value?.trim() !== "") data[field] = operationHandler(operator, value);
  });
  return data;
};

var operationHandler = (operation, value) => {
  if (operation === "isAnyOf") {
    return { $in: value.split(",") };
  } else if (operation === "equals" || operation === "=") {
    return value;
  } else if (operation === "startsWith") {
    return { $regex: new RegExp(`^${value}`, "i") };
  } else if (operation === "endsWith") {
    return { $regex: new RegExp(`${value}$`, "i") };
  } else if (operation === "isEmpty") {
    return "";
  } else if (operation === "isNotEmpty") {
    return { $ne: "" };
  } else if (operation === "!=") {
    return { $ne: parseInt(value) };
  } else if (operation === ">") {
    return { $gt: parseInt(value) };
  } else if (operation === ">=") {
    return { $gte: parseInt(value) };
  } else if (operation === "<") {
    return { $lt: parseInt(value) };
  } else if (operation === "<=") {
    return { $lte: parseInt(value) };
  } else {
    return { $regex: new RegExp(value, "i") };
  }
};

