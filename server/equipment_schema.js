const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  projectCode: String,
  projectOrderCode: String,
  projectCompany: String,
  projectType: String,
  equipmentCode: String,
  equipmentName: String,
  equipmentGG: String,
  unitName: String,
  unitCode: String,
  resultCode: String,
  createTime: String,
  updateTime: String,
  deprecatedTime: String,
  createUser: String,
  updateUser: String,
  deprecatedUser: String,
  deprecated: String,
});
// 转换成模型
const equipmentModel = mongoose.model("equipmentModel", equipmentSchema, "equipment_form")
// 暴露模型
module.exports = equipmentModel;