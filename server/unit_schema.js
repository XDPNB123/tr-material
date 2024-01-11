const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({
  unitCode: String,
  unitName: String,
});
// 转换成模型
const unitModel = mongoose.model("unitModel", unitSchema, "unit_form")
// 暴露模型
module.exports = unitModel;