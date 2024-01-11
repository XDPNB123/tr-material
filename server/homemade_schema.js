const mongoose = require("mongoose");

const homemadeSchema = new mongoose.Schema({
  projectCode: String,
  projectCompany: String,
  projectType: String,
  totalName: String,
  totalCode: String,
  partName: String,
  partCode: String,
  unitName: String,
  unitCode: String,
  resultCode: String,
  createTime: String,
  updateTime: String,
  deprecatedTime: String,
  createUser: String,
  updateUser: String,
  deprecatedUser: String,
  deprecated: String
});
// 转换成模型
const homemadeModel = mongoose.model("homemadeModel", homemadeSchema, "homemade_form")
// 暴露模型
module.exports = homemadeModel;