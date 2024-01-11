const mongoose = require("mongoose");

const materialCategorySchema = new mongoose.Schema({
  categoryName: String,
  categoryCode: String,
  level: Number,
  id: Number,
  parentId: Number,
  createTime: String,
  updateTime: String,
  deprecatedTime: String,
  createUser: String,
  updateUser: String,
  deprecatedUser: String,
  deprecated: String
});
// 转换成模型
const materialCategoryModel = mongoose.model("materialCategoryModel", materialCategorySchema, "material_category_form")
// 暴露模型
module.exports = materialCategoryModel;