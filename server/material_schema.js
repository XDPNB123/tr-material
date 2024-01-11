const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  bigName: String,
  bigCode: String,
  bigId: Number,
  bigParentId: Number,
  middleName: String,
  middleCode: String,
  middleId: Number,
  middleParentId: Number,
  smallName: String,
  smallCode: String,
  smallId: Number,
  smallParentId: Number,
  thinName: String,
  thinCode: String,
  thinId: Number,
  thinParentId: Number,
  xhms: String,
  xhCode: String,
  ggms: String,
  ggCode: String,
  unitName: String,
  unitCode: String,
  brandName:String,
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
const materialModel = mongoose.model("materialModel", materialSchema, "material_form")
// 暴露模型
module.exports = materialModel;