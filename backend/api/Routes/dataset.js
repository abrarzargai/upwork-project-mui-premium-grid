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
    const { filter = [] } = req.body;
    const payload = payloadHandler(filter);
    console.log("count | filter==>", filter);
    console.log("count | payload==>", payload);
    // const count = await collection.count(payload);
    const result = await await collection.aggregate([
      { $match: payload },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
      }
      }
    ]);
    return res.status(200).json({ success: true, count:result[0]?.count || 0 });
  } catch (e) {
    console.log(e);
    return next(e);
  }
});

route.post("/search", async (req, res, next) => {
  try {
    const { filter = [], skip = 0, limit = 5 } = req.body;
    const payload = payloadHandler(filter);
    console.log("Search | filter==>", filter);
    console.log("Search | payload==>", payload);
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
  payload
    .map(({ operator, value, field }) => {
      if (typeof value === "string") {
        if (value?.trim() !== "")
          data[field] = operatorHandler(operator, value);
      } else if (Array.isArray(value)) {
        const values = value.map(parseValue);
        if (
          operator === "isAnyOf" ||
          operator === "equals" ||
          operator === "="
        ) {
          data[field] = { $in: values };
        }
      }
    })
    .filter(Boolean);
  return data;
};

function parseValue(value) {
  const parsedValue = parseFloat(value);
  return isNaN(parsedValue) ? value : parsedValue;
}

var operatorHandler = (operator, value) => {
  if (operator === "isAnyOf") {
    return { $in: value.split(",") };
  } else if (operator === "equals" || operator === "=") {
    return value;
  } else if (operator === "startsWith") {
    return { $regex: new RegExp(`^${value}`, "i") };
  } else if (operator === "endsWith") {
    return { $regex: new RegExp(`${value}$`, "i") };
  } else if (operator === "isEmpty") {
    return "";
  } else if (operator === "isNotEmpty") {
    return { $ne: "" };
  } else if (operator === "!=") {
    return { $ne: parseInt(value) };
  } else if (operator === ">") {
    return { $gt: parseInt(value) };
  } else if (operator === ">=") {
    return { $gte: parseInt(value) };
  } else if (operator === "<") {
    return { $lt: parseInt(value) };
  } else if (operator === "<=") {
    return { $lte: parseInt(value) };
  } else if (operator === "after") {
    return { $gt: new Date(value) };
  } else if (operator === "onOrAfter") {
    return { $gte: new Date(value) };
  } else if (operator === "before") {
    return { $lt: new Date(value) };
  } else if (operator === "onOrBefore") {
    return { $lte: new Date(value) };
  } else if (operator === "is") {
    return { $eq: new Date(value) };
  } else if (operator === "not") {
    return { $ne: new Date(value) };
  } else {
    return { $regex: new RegExp(value, "i") };
  }
};

