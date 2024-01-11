const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  workId: String,
  password: String,
  username: String,
  rating: Number,
  registerFlag: String,
  createTime: String
});
// 转换成模型
const userModel = mongoose.model("userModel", userSchema, "user_form")
// 暴露模型
module.exports = userModel;