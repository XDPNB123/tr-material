const mongoose = require("mongoose");

const operationHistorySchema = new mongoose.Schema({
  operationForm: String,
  operationType: String,
  operationUser: String,
  operationTime: String,
  deprecatedData: Object,
  updateBeforeData: Object,
  updateAfterData: Object
});
// 转换成模型
const operationHistoryModel = mongoose.model("operationHistoryModel", operationHistorySchema, "operation_history_form")
// 暴露模型
module.exports = operationHistoryModel;