// 注意全篇的顺序不能乱
// 注意全篇的顺序不能乱
// 注意全篇的顺序不能乱
// 注意全篇的顺序不能乱
// 注意全篇的顺序不能乱

// 引入 express
const express = require("express");
// 引入 cors 防止跨源请求阻塞错误
const cors = require("cors");
// 初始化 express app
const app = express();
// 引入配置
const config = require("config");
// 获取app配置的端口
const appPort = config.get("server.app-port");
// 获取数据库配置的主机
const dbHost = config.get("server.db-host");
app.use(cors());
// 在端口 port 上启动后台服务
app.listen(appPort, () => {
  console.log("Server started on port" + appPort);
});

// 引入 mongoose
const mongoose = require("mongoose");
// 通过用户名和密码连接 mongodb 数据库，authSource = admin 确保认证成功
mongoose.connect("mongodb://" + dbHost + "/tr_material_two?authSource=admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("open", () => {
  console.log("Connected to mongoDB");
});
db.on("error", (error) => {
  console.log(error);
});

// 引入字符转义
const characterEscape = require("regex-escape");

// bodyParser 解析客户端请求
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// 导入模型
// 导入模型
// 导入模型
// 导入模型
// 导入模型

// 导入用户模型
let userModel = require("./user_schema");
// 导入单位模型
let unitModel = require("./unit_schema");
// 导入外购件分类模型
let materialCategoryModel = require("./material_category_schema");
// 导入外购件物料模型
let materialModel = require("./material_schema");
// 导入成套外购模型
let equipmentModel = require("./equipment_schema");
// 导入自制件模型
let homemadeModel = require("./homemade_schema");
// 导入操作记录模型
let operationHistoryModel = require("./operation_history_schema");

// 常用函数
// 常用函数
// 常用函数
// 常用函数
// 常用函数

// 获取 YYYY-MM-DD HH:MM:SS 格式的时间
function getMyTime() {
  const myDate = new Date();
  const year = myDate.getFullYear();
  const month = (myDate.getMonth() + 1).toString().padStart(2, "0");
  const date = myDate.getDate().toString().padStart(2, "0");
  const hour = myDate.getHours().toString().padStart(2, "0");
  const min = myDate.getMinutes().toString().padStart(2, "0");
  const second = myDate.getSeconds().toString().padStart(2, "0");
  const result =
    year + "-" + month + "-" + date + " " + hour + ":" + min + ":" + second;
  return result;
}

// 用户
// 用户
// 用户
// 用户
// 用户

// 注册时校验工号是否已经存在
app.post("/userValidRepeat", (req, res) => {
  userModel.find(
    {
      workId: req.body.workId,
    },
    (err, allData) => {
      if (err) {
        res.send(err);
      } else {
        if (allData.length) {
          res.send("工号已存在");
        } else {
          res.send("注册成功待审批");
        }
      }
    }
  );
});

// 注册校验工号不重复后添加一个待审批的用户
app.post("/userAdd", (req, res) => {
  let user = new userModel();
  user.workId = req.body.workId;
  user.password = req.body.password;
  user.username = req.body.username;
  user.rating = 1;
  user.registerFlag = "N";
  user.createTime = getMyTime();
  user.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send("已添加用户");
    }
  });
});

// 登录验证
app.post("/userLogin", (req, res) => {
  userModel.find(
    {
      workId: req.body.workId,
      password: req.body.password,
      registerFlag: "Y",
    },
    (err, allData) => {
      if (err) {
        res.send(err);
      } else {
        if (allData.length) {
          res.send("登入成功");
        } else {
          res.send("登入失败");
        }
      }
    }
  );
});

// 登录成功后获取用户信息
app.post("/userGetInfo", (req, res) => {
  userModel.find(
    {
      workId: req.body.workId,
      registerFlag: "Y",
    },
    (err, allData) => {
      if (err) {
        res.send(err);
      } else {
        res.json(allData);
      }
    }
  );
});

// 获取所有未通过审批的用户
app.get("/userGetAllUnapproved", (req, res) => {
  userModel
    .find({
      registerFlag: "N",
    })
    .exec((err, allData) => {
      if (err) {
        res.send(err);
      } else {
        res.json(allData);
      }
    });
});

// 获取所有已通过审批的用户
app.get("/userGetAllApproved", (req, res) => {
  userModel
    .find({
      registerFlag: "Y",
    })
    .exec((err, allData) => {
      if (err) {
        res.send(err);
      } else {
        res.json(allData);
      }
    });
});

// 修改用户为审批通过
app.post("/userApprovedOK", (req, res) => {
  userModel.findByIdAndUpdate(
    req.body._id,
    {
      registerFlag: "Y",
      rating: req.body.rating,
    },
    (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("审批通过");
      }
    }
  );
});

// 修改权限等级
app.post("/userUpdateRating", (req, res) => {
  userModel.findByIdAndUpdate(
    req.body._id,
    {
      rating: req.body.rating,
    },
    (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("权限已修改");
      }
    }
  );
});

// 修改密码时校验输入的旧密码是否正确
app.post("/userValidOldPassword", (req, res) => {
  userModel.find(
    {
      workId: req.body.workId,
      password: req.body.oldPassword,
    },
    (err, allData) => {
      if (err) {
        res.send(err);
      } else {
        if (allData.length) {
          res.send("校验成功");
        } else {
          res.send("校验失败");
        }
      }
    }
  );
});

// 修改密码
app.post("/userUpdateOldPassword", (req, res) => {
  userModel.updateOne(
    {
      workId: req.body.workId,
    },
    {
      password: req.body.newPassword,
    },
    (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("密码修改成功");
      }
    }
  );
});

// 单位
// 单位
// 单位
// 单位
// 单位

// 获取所有单位
app.get("/unitGetAllData", async (req, res) => {
  try {
    const allData = await unitModel.find({});
    res.json(allData);
  } catch (error) {
    res.send(error);
  }
});

// 基础外购件
// 基础外购件
// 基础外购件
// 基础外购件
// 基础外购件

// 获取对应 level 的所有类别
app.post("/materialGetCategoryByLevel", (req, res) => {
  materialCategoryModel.find(
    {
      level: req.body.level,
      deprecated: "N",
    },
    (err, allData) => {
      if (err) {
        res.send(err);
      } else {
        res.json(allData);
      }
    }
  );
});
// 根据选择类别的 id 找到其下所有分类
app.post("/materialGetCategoryById", (req, res) => {
  materialCategoryModel.find(
    {
      parentId: req.body.parentId,
      deprecated: "N",
    },
    (err, allData) => {
      if (err) {
        res.send(err);
      } else {
        res.json(allData);
      }
    }
  );
});

// 获取某个细类下去重后的所有型号
app.post("/materialGetRemoveRepeatXH", (req, res) => {
  materialModel.aggregate(
    [
      // 1、查询为该 thinId 的文档
      {
        $match: {
          thinId: req.body.thinId,
          deprecated: "N",
        },
      },
      // 2、将查询到的结果按 xhms 字段分组，xhms、xhCode 的值为每组第一个文档的 xhms、xhCode 值
      {
        $group: {
          _id: "$xhms",
          xhms: {
            $first: "$xhms",
          },
          xhCode: {
            $first: "$xhCode",
          },
        },
      },
      // 3、添加一个字段，level='5'，'5'必须为字符串不能为数字，否则最终结果将不会包含 level 字段
      {
        $project: {
          xhms: 1,
          xhCode: 1,
          level: "5",
        },
      },
      // 4、最终结果按 xhCode 升序排序
      {
        $sort: {
          xhCode: 1,
        },
      },
    ],
    (err, allData) => {
      if (err) {
        res.send(err);
      } else {
        res.json(allData);
      }
    }
  );
});

// 获取某个型号下的所有规格
app.post("/materialGetGGByXH", (req, res) => {
  materialModel.aggregate(
    [
      {
        $match: {
          thinId: req.body.thinId,
          xhCode: req.body.xhCode,
          deprecated: "N",
        },
      },
      {
        $project: {
          ggms: 1,
          ggCode: 1,
          level: "6",
        },
      },
    ],
    (err, allData) => {
      if (err) {
        res.send(err);
      } else {
        res.json(allData);
      }
    }
  );
});

// 获取表格所有数据
app.get("/materialGetTableAllData", (req, res) => {
  materialModel.find(
    {
      deprecated: "N",
    },
    (err, allData) => {
      if (err) {
        res.send(err);
      } else {
        res.json(allData);
      }
    }
  );
});

// 根据选中的类别 id 过滤表格数据
app.post("/materialGetTableDataByCategoryId", (req, res) => {
  switch (req.body.level) {
    case 1:
      materialModel.find(
        {
          deprecated: "N",
          bigId: req.body.bigId,
        },
        (err, allData) => {
          if (err) {
            res.send(err);
          } else {
            res.json(allData);
          }
        }
      );
      break;
    case 2:
      materialModel.find(
        {
          deprecated: "N",
          middleId: req.body.middleId,
        },
        (err, allData) => {
          if (err) {
            res.send(err);
          } else {
            res.json(allData);
          }
        }
      );
      break;

    case 3:
      materialModel.find(
        {
          deprecated: "N",
          smallId: req.body.smallId,
        },
        (err, allData) => {
          if (err) {
            res.send(err);
          } else {
            res.json(allData);
          }
        }
      );
      break;

    case 4:
      materialModel.find(
        {
          deprecated: "N",
          thinId: req.body.thinId,
        },
        (err, allData) => {
          if (err) {
            res.send(err);
          } else {
            res.json(allData);
          }
        }
      );
      break;

    case 5:
      materialModel.find(
        {
          deprecated: "N",
          thinId: req.body.thinId,
          xhCode: req.body.xhCode,
        },
        (err, allData) => {
          if (err) {
            res.send(err);
          } else {
            res.json(allData);
          }
        }
      );
      break;

    case 6:
      materialModel.find(
        {
          deprecated: "N",
          thinId: req.body.thinId,
          xhCode: req.body.xhCode,
          ggCode: req.body.ggCode,
        },
        (err, allData) => {
          if (err) {
            res.send(err);
          } else {
            res.json(allData);
          }
        }
      );
      break;
  }
});

// 获取类别表中最后一个类别的 id
app.get("/materialGetLastCategoryId", (req, res) => {
  // _id 是带有时间性质的，可以用 _id 进行反排序
  materialCategoryModel
    .find({
      deprecated: "N",
    })
    .sort({
      _id: -1,
    })
    .limit(1)
    .exec((err, allData) => {
      if (err) {
        res.send(err);
      } else {
        res.json(allData[0].id);
      }
    });
});

// 新增类别
app.post("/materialAddCategory", (req, res) => {
  let materialCategory = new materialCategoryModel();
  materialCategory.categoryName = req.body.categoryName;
  materialCategory.categoryCode = req.body.categoryCode;
  materialCategory.level = req.body.level;
  materialCategory.id = req.body.id;
  materialCategory.parentId = req.body.parentId;
  materialCategory.createTime = getMyTime();
  materialCategory.updateTime = "";
  materialCategory.deprecatedTime = "";
  materialCategory.createUser = req.body.createUser;
  materialCategory.updateUser = "";
  materialCategory.deprecatedUser = "";
  materialCategory.deprecated = "N";
  materialCategory.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send("新增类别成功");
    }
  });
});

// 仅修改类别表的类别名称
app.post("/materialUpdateCategory", async (req, res) => {
  try {
    await materialCategoryModel.updateMany(
      {
        id: req.body.id,
        deprecated: "N",
      },
      {
        categoryName: req.body.categoryName,
        updateUser: req.body.username,
        updateTime: getMyTime(),
      }
    );
    res.send("类别名称修改成功");
  } catch (error) {
    console.log(error);
  }
});

// 仅修改基础物料表的类别名称、型号描述、规格描述
app.post("/materialUpdateTable", async (req, res) => {
  try {
    switch (req.body.level) {
      case 2:
        const allData2 = await materialModel.find({
          middleId: req.body.id,
          deprecated: "N",
        });
        allData2.forEach((item, index, arr) => {
          item.middleName = req.body.categoryName;
          item.updateUser = req.body.username;
          item.updateTime = getMyTime();
          // 调用 save 方法的文档会被检查 _id 字段的值。如果 _id 字段是未定义或 null，Mongoose 假定您正在尝试创建一个新文档，并为该文档生成一个新的唯一的 _id。如果 _id 字段不是未定义或 null，Mongoose 假定您正在尝试更新现有文档，并根据 _id 字段值执行更新操作
          item.save();
        });
        res.send("基础物料表中类名称修改成功");
        break;

      case 3:
        const allData3 = await materialModel.find({
          smallId: req.body.id,
          deprecated: "N",
        });
        allData3.forEach((item, index, arr) => {
          item.smallName = req.body.categoryName;
          item.updateUser = req.body.username;
          item.updateTime = getMyTime();
          item.save();
        });
        res.send("基础物料表小类名称修改成功");
        break;

      case 4:
        const allData4 = await materialModel.find({
          thinId: req.body.id,
          deprecated: "N",
        });
        allData4.forEach((item, index, arr) => {
          item.thinName = req.body.categoryName;
          item.updateUser = req.body.username;
          item.updateTime = getMyTime();
          item.save();
        });
        res.send("基础物料表细类名称修改成功");
        break;

      case 5:
        // 找出该细类下的所有型号
        const allData5 = await materialModel.find({
          thinId: req.body.thinId,
          deprecated: "N",
        });
        let repeat = false;
        // 判断修改后的型号描述是否在这些型号中已经存在
        allData5.forEach((item, index, arr) => {
          if (
            item.xhms.replace(/(\r\n|\n|\r|\s)/gm, "") ===
            req.body.xhms.replace(/(\r\n|\n|\r|\s)/gm, "")
          ) {
            repeat = true;
          }
        });
        if (repeat) {
          res.send("型号描述已存在");
        } else {
          await materialModel.updateMany(
            {
              thinId: req.body.thinId,
              xhCode: req.body.xhCode,
              deprecated: "N",
            },
            {
              xhms: req.body.xhms.replace(/(\r\n|\n|\r)/gm, ""),
              updateUser: req.body.updateUser,
              updateTime: getMyTime(),
            }
          );
        }
        res.send("基础物料表型号描述已修改");
        break;

      case 6:
        // 找出该型号下的所有规格
        const allData6 = await materialModel.find({
          thinId: req.body.thinId,
          xhCode: req.body.xhCode,
          deprecated: "N",
        });
        let repeat_ = false;
        // 判断修改后的型号描述是否在这些规格中已经存在
        allData6.forEach((item, index, arr) => {
          if (
            item.ggms.replace(/(\r\n|\n|\r|\s)/gm, "") ===
            req.body.ggms.replace(/(\r\n|\n|\r|\s)/gm, "")
          ) {
            repeat_ = true;
          }
        });
        if (repeat_) {
          res.send("规格描述已存在");
        } else {
          await materialModel.updateMany(
            {
              thinId: req.body.thinId,
              xhCode: req.body.xhCode,
              ggCode: req.body.ggCode,
              deprecated: "N",
            },
            {
              ggms: req.body.ggms.replace(/(\r\n|\n|\r)/gm, ""),
              updateUser: req.body.updateUser,
              updateTime: getMyTime(),
            }
          );
          res.send("基础物料表规格描述已修改");
        }
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

// 修改类别表的类别名称和类别代号
// app.post('/materialUpdateCategory', (req, res) => {
//   materialCategoryModel.updateMany({
//     id: req.body.id,
//     deprecated: 'N'
//   }, {
//     categoryName: req.body.categoryName,
//     categoryCode: req.body.categoryCode,
//     updateUser: req.body.username,
//     updateTime: getMyTime()
//   }, (err, allData) => {
//     if (err) {
//       res.send(err)
//     } else {
//       res.send('类别的名称和代号修改成功')
//     }
//   })
// })

// 修改基础物料表的类别名称和类别代号、型号描述和型号代号、规格描述和规格代号、最终代码
// app.post('/materialUpdateTable', (req, res) => {
//   switch (req.body.level) {
//     case 2:
//       materialModel.find({
//         middleId: req.body.id,
//         deprecated: "N"
//       }, (err, allData) => {
//         if (err) {
//           res.send(err)
//         } else {
//           allData.forEach((item, index, arr) => {
//             item.resultCode = item.resultCode.substring(0, 2) + req.body.categoryCode + item.resultCode.substring(6)
//             item.middleName = req.body.categoryName
//             item.middleCode = req.body.categoryCode
//             item.updateUser = req.body.username
//             item.updateTime = getMyTime()
//             // 调用 save 方法的文档会被检查 _id 字段的值。如果 _id 字段是未定义或 null，Mongoose 假定您正在尝试创建一个新文档，并为该文档生成一个新的唯一的 _id。如果 _id 字段不是未定义或 null，Mongoose 假定您正在尝试更新现有文档，并根据 _id 字段值执行更新操作
//             item.save((error) => {
//               if (err) {
//                 res.send(error)
//               }
//             })
//           })
//           res.send('基础物料表修改成功')
//         }
//       })
//       break;

//     case 3:
//       materialModel.find({
//         smallId: req.body.id,
//         deprecated: "N"
//       }, (err, allData) => {
//         if (err) {
//           res.send(err)
//         } else {
//           allData.forEach((item, index, arr) => {
//             item.resultCode = item.resultCode.substring(0, 7) + req.body.categoryCode + item.resultCode.substring(11)
//             item.smallName = req.body.categoryName
//             item.smallCode = req.body.categoryCode
//             item.updateUser = req.body.username
//             item.updateTime = getMyTime()
//             item.save((error) => {
//               if (err) {
//                 res.send(error)
//               }
//             })
//           })
//           res.send('基础物料表修改成功')
//         }
//       })
//       break;

//     case 4:
//       materialModel.find({
//         thinId: req.body.id,
//         deprecated: "N"
//       }, (err, allData) => {
//         if (err) {
//           res.send(err)
//         } else {
//           allData.forEach((item, index, arr) => {
//             item.resultCode = item.resultCode.substring(0, 12) + req.body.categoryCode + item.resultCode.substring(16)
//             item.thinName = req.body.categoryName
//             item.thinCode = req.body.categoryCode
//             item.updateUser = req.body.username
//             item.updateTime = getMyTime()
//             item.save((error) => {
//               if (err) {
//                 res.send(error)
//               }
//             })
//           })
//           res.send('基础物料表修改成功')
//         }
//       })
//       break;

//     case 5:
//       // 找出该细类下的所有型号
//       materialModel.find({
//         thinId: req.body.thinId,
//         deprecated: "N"
//       }, (err, allData) => {
//         if (err) {
//           res.send(err)
//         } else {
//           let repeat = false
//           // 判断修改后的型号描述是否在这些型号中已经存在
//           allData.forEach((item, index, arr) => {
//             if (item.xhms.replace(/(\r\n|\n|\r|\s)/gm, "") === req.body.xhms.replace(/(\r\n|\n|\r|\s)/gm, "")) {
//               repeat = true
//             }
//           })
//           if (repeat) {
//             res.send('型号描述已存在')
//           } else {
//             materialModel.updateMany({
//               thinId: req.body.thinId,
//               xhCode: req.body.xhCode,
//               deprecated: "N"
//             }, {
//               xhms: req.body.xhms,
//               updateUser: req.body.updateUser,
//               updateTime: getMyTime()
//             }, (error) => {
//               if (error) {
//                 res.send(error)
//               } else {
//                 res.send('基础物料表型号描述已修改')
//               }
//             })
//           }
//         }
//       })
//       break;

//     case 6:
//       // 找出该型号下的所有规格
//       materialModel.find({
//         thinId: req.body.thinId,
//         xhCode: req.body.xhCode,
//         deprecated: "N"
//       }, (err, allData) => {
//         if (err) {
//           res.send(err)
//         } else {
//           let repeat = false
//           // 判断修改后的型号描述是否在这些规格中已经存在
//           allData.forEach((item, index, arr) => {
//             if (item.ggms.replace(/(\r\n|\n|\r|\s)/gm, "") === req.body.ggms.replace(/(\r\n|\n|\r|\s)/gm, "")) {
//               repeat = true
//             }
//           })
//           if (repeat) {
//             res.send('规格描述已存在')
//           } else {
//             materialModel.updateMany({
//               thinId: req.body.thinId,
//               xhCode: req.body.xhCode,
//               ggCode: req.body.ggCode,
//               deprecated: "N"
//             }, {
//               ggms: req.body.ggms,
//               updateUser: req.body.updateUser,
//               updateTime: getMyTime()
//             }, (error) => {
//               if (error) {
//                 res.send(error)
//               } else {
//                 res.send('基础物料表规格描述已修改')
//               }
//             })
//           }
//         }
//       })
//       break;
//   }
// })

// 新增编码
app.post("/materialAddOne", async (req, res) => {
  try {
    // 获取该细类下所有的型号规格
    const allData = await materialModel.find({
      thinId: req.body.thinId,
    });

    let repeatXH = false;
    let repeatGG = false;
    let xhms = "";
    let xhCode = "";
    let ggms = "";
    let ggCode = "";
    let maxXHCode = "0000";
    let maxGGCode = "0000";

    allData.forEach((item, index, arr) => {
      // 找到该细类下最大的型号代号
      if (parseInt(maxXHCode) < parseInt(item.xhCode)) {
        maxXHCode = item.xhCode;
      }
      if (
        item.xhms.replace(/(\r\n|\n|\r|\s)/gm, "") ===
        req.body.xhms.replace(/(\r\n|\n|\r|\s)/gm, "")
      ) {
        repeatXH = true;
        // 如果新加物料的型号与数据库中已经存在的型号去掉空格后相同，则使用数据库中已经存在的型号
        xhms = item.xhms;
        xhCode = item.xhCode;
        // 找到该型号下最大的规格代号
        if (parseInt(maxGGCode) < parseInt(item.ggCode)) {
          maxGGCode = item.ggCode;
        }
        if (
          item.ggms.replace(/(\r\n|\n|\r|\s)/gm, "") ===
          req.body.ggms.replace(/(\r\n|\n|\r|\s)/gm, "")
        ) {
          repeatGG = true;
        }
      }
    });

    if (repeatXH === false && repeatGG === false) {
      xhms = req.body.xhms;
      xhCode = (parseInt(maxXHCode) + 1).toString().padStart(4, "0");
      ggms = req.body.ggms;
      ggCode = "0001";
    } else if (repeatXH === true && repeatGG === false) {
      ggms = req.body.ggms;
      ggCode = (parseInt(maxGGCode) + 1).toString().padStart(4, "0");
    } else if (repeatXH === true && repeatGG === true) {
      res.send("此规格型号的编码已经存在");
    }

    if (repeatXH === false || repeatGG === false) {
      let material = new materialModel();
      material.bigName = req.body.bigName;
      material.bigCode = req.body.bigCode;
      material.bigId = req.body.bigId;
      material.bigParentId = req.body.bigParentId;
      material.middleName = req.body.middleName;
      material.middleCode = req.body.middleCode;
      material.middleId = req.body.middleId;
      material.middleParentId = req.body.middleParentId;
      material.smallName = req.body.smallName;
      material.smallCode = req.body.smallCode;
      material.smallId = req.body.smallId;
      material.smallParentId = req.body.smallParentId;
      material.thinName = req.body.thinName;
      material.thinCode = req.body.thinCode;
      material.thinId = req.body.thinId;
      material.thinParentId = req.body.thinParentId;
      material.xhms = xhms.replace(/(\r\n|\n|\r)/gm, "");
      material.xhCode = xhCode;
      material.ggms = ggms.replace(/(\r\n|\n|\r)/gm, "");
      material.ggCode = ggCode;
      material.unitName = req.body.unitName;
      material.unitCode = req.body.unitCode;
      material.brandName = req.body.brandName;
      material.resultCode = `${req.body.bigCode}-${req.body.middleCode}-${req.body.smallCode}-${req.body.thinCode}-${xhCode}-${ggCode}`;
      material.createTime = getMyTime();
      material.updateTime = "";
      material.deprecatedTime = "";
      material.createUser = req.body.createUser;
      material.updateUser = "";
      material.deprecatedUser = "";
      material.deprecated = "N";
      await material.save();
      // 将拼接后的最终物料码返回给前端
      res.send(material.resultCode);
    }
  } catch (error) {
    res.send(error);
  }
});

// 修改单个成套设备
app.post("/materialUpdateOne", async (req, res) => {
  try {
    await materialModel.updateOne(
      {
        _id: req.body._id,
        deprecated: "N",
      },
      {
        unitName: req.body.unitName,
        unitCode: req.body.unitCode,
        brandName: req.body.brandName,
        updateTime: getMyTime(),
        updateUser: req.body.updateUser,
      }
    );
    res.send("已修改单个编码");
  } catch (error) {
    res.send(error);
  }
});

// 全局搜索
app.post("/materialGlobalSearch", async (req, res) => {
  try {
    const result = [];
    // 所有的大类
    const bigArr = [];
    // 所有的中类
    const middleArr = [];
    // 所有的小类
    const smallArr = [];
    // 所有的细类
    const thinArr = [];

    // 获取所有类别的数据
    const allCategoryData = await materialCategoryModel.find({
      deprecated: "N",
    });
    allCategoryData.forEach((item, index, arr) => {
      if (item.level === 1) {
        bigArr.push(item);
      } else if (item.level === 2) {
        middleArr.push(item);
      } else if (item.level === 3) {
        smallArr.push(item);
      } else if (item.level === 4) {
        thinArr.push(item);
      }
    });
    let newBigArr = JSON.parse(JSON.stringify(bigArr));
    let newMiddleArr = JSON.parse(JSON.stringify(middleArr));
    let newSmallArr = JSON.parse(JSON.stringify(smallArr));
    let newThinArr = JSON.parse(JSON.stringify(thinArr));

    newBigArr.forEach((item, index, arr) => {
      if (item.categoryName.includes(req.body.searchAll)) {
        item.joinName = `【${item.categoryName}】`;
        item.bigName = item.categoryName;
        item.bigCode = item.categoryCode;
        item.bigId = item.id;
        item.bigParentId = item.parentId;
        result.push(item);
      }
    });
    newMiddleArr.forEach((item, index, arr) => {
      if (item.categoryName.includes(req.body.searchAll)) {
        // 中类如果匹配成功，则去拼接其父类名称
        newBigArr.forEach((item1, index1, arr1) => {
          if (item1.id === item.parentId) {
            item.joinName = `【${item1.categoryName}】【${item.categoryName}】`;
            item.bigName = item1.categoryName;
            item.bigCode = item1.categoryCode;
            item.bigId = item1.id;
            item.bigParentId = item1.parentId;
            item.middleName = item.categoryName;
            item.middleCode = item.categoryCode;
            item.middleId = item.id;
            item.middleParentId = item.parentId;
            result.push(item);
          }
        });
      }
    });
    newSmallArr.forEach((item, index, arr) => {
      if (item.categoryName.includes(req.body.searchAll)) {
        // 小类如果匹配成功，则去拼接其父类名称
        newMiddleArr.forEach((item1, index1, arr1) => {
          if (item1.id === item.parentId) {
            newBigArr.forEach((item2, index2, arr2) => {
              if (item2.id === item1.parentId) {
                item.joinName = `【${item2.categoryName}】【${item1.categoryName}】【${item.categoryName}】`;
                item.bigName = item2.categoryName;
                item.bigCode = item2.categoryCode;
                item.bigId = item2.id;
                item.bigParentId = item2.parentId;
                item.middleName = item1.categoryName;
                item.middleCode = item1.categoryCode;
                item.middleId = item1.id;
                item.middleParentId = item1.parentId;
                item.smallName = item.categoryName;
                item.smallCode = item.categoryCode;
                item.smallId = item.id;
                item.smallParentId = item.parentId;
                result.push(item);
              }
            });
          }
        });
      }
    });
    newThinArr.forEach((item, index, arr) => {
      if (item.categoryName.includes(req.body.searchAll)) {
        // 细类如果匹配成功，则去拼接其父类名称
        newSmallArr.forEach((item1, index1, arr1) => {
          if (item1.id === item.parentId) {
            newMiddleArr.forEach((item2, index2, arr2) => {
              if (item2.id === item1.parentId) {
                newBigArr.forEach((item3, index3, arr3) => {
                  if (item3.id === item2.parentId) {
                    item.joinName = `【${item3.categoryName}】【${item2.categoryName}】【${item1.categoryName}】【${item.categoryName}】`;
                    item.bigName = item3.categoryName;
                    item.bigCode = item3.categoryCode;
                    item.bigId = item3.id;
                    item.bigParentId = item3.parentId;
                    item.middleName = item2.categoryName;
                    item.middleCode = item2.categoryCode;
                    item.middleId = item2.id;
                    item.middleParentId = item2.parentId;
                    item.smallName = item1.categoryName;
                    item.smallCode = item1.categoryCode;
                    item.smallId = item1.id;
                    item.smallParentId = item1.parentId;
                    item.thinName = item.categoryName;
                    item.thinCode = item.categoryCode;
                    item.thinId = item.id;
                    item.thinParentId = item.parentId;
                    result.push(item);
                  }
                });
              }
            });
          }
        });
      }
    });
    // 获取所有匹配到的型号，并按 thinId 和 xhms 的组合去重
    const allXHData = await materialModel.aggregate([
      {
        $match: {
          xhms: {
            $regex: characterEscape(req.body.searchAll),
            $options: "i",
          },
          deprecated: "N",
        },
      },
      {
        $group: {
          // 按 thinId 和 xhms 的组合去重
          _id: {
            thinId: "$thinId",
            xhms: "$xhms",
          },
          bigName: {
            $first: "$bigName",
          },
          bigCode: {
            $first: "$bigCode",
          },
          bigId: {
            $first: "$bigId",
          },
          bigParentId: {
            $first: "$bigParentId",
          },
          middleName: {
            $first: "$middleName",
          },
          middleCode: {
            $first: "$middleCode",
          },
          middleId: {
            $first: "$middleId",
          },
          middleParentId: {
            $first: "$middleParentId",
          },
          smallName: {
            $first: "$smallName",
          },
          smallCode: {
            $first: "$smallCode",
          },
          smallId: {
            $first: "$smallId",
          },
          smallParentId: {
            $first: "$smallParentId",
          },
          thinName: {
            $first: "$thinName",
          },
          thinCode: {
            $first: "$thinCode",
          },
          thinId: {
            $first: "$thinId",
          },
          thinParentId: {
            $first: "$thinParentId",
          },
          xhms: {
            $first: "$xhms",
          },
          xhCode: {
            $first: "$xhCode",
          },
        },
      },
      {
        $project: {
          bigName: 1,
          bigCode: 1,
          bigId: 1,
          bigParentId: 1,
          middleName: 1,
          middleCode: 1,
          middleId: 1,
          middleParentId: 1,
          smallName: 1,
          smallCode: 1,
          smallId: 1,
          smallParentId: 1,
          thinName: 1,
          thinCode: 1,
          thinId: 1,
          thinParentId: 1,
          xhms: 1,
          xhCode: 1,
          // 添加字段
          level: "5",
          joinName: {
            $concat: [
              "【",
              "$bigName",
              "】",
              "【",
              "$middleName",
              "】",
              "【",
              "$smallName",
              "】",
              "【",
              "$thinName",
              "】",
              "【",
              "$xhms",
              "】",
            ],
          },
        },
      },
      {
        $sort: {
          thinId: 1,
        },
      },
    ]);
    result.push(...allXHData);

    // 获取匹配到的所有规格
    const allGGData = await materialModel.aggregate([
      {
        $match: {
          ggms: {
            $regex: characterEscape(req.body.searchAll),
            $options: "i",
          },
          deprecated: "N",
        },
      },
      {
        $project: {
          bigName: 1,
          bigCode: 1,
          bigId: 1,
          bigParentId: 1,
          middleName: 1,
          middleCode: 1,
          middleId: 1,
          middleParentId: 1,
          smallName: 1,
          smallCode: 1,
          smallId: 1,
          smallParentId: 1,
          thinName: 1,
          thinCode: 1,
          thinId: 1,
          thinParentId: 1,
          xhms: 1,
          xhCode: 1,
          ggms: 1,
          ggCode: 1,
          // 添加字段
          level: "6",
          joinName: {
            $concat: [
              "【",
              "$bigName",
              "】",
              "【",
              "$middleName",
              "】",
              "【",
              "$smallName",
              "】",
              "【",
              "$thinName",
              "】",
              "【",
              "$xhms",
              "】",
              "【",
              "$ggms",
              "】",
            ],
          },
        },
      },
    ]);
    result.push(...allGGData);

    // 返回结果
    res.json(result);
  } catch (err) {
    res.send(err);
  }
});

// 废弃某个类别下的所有子类
function deprecatedChildrenCategory(categoryData, id) {
  try {
    // 废弃中类
    categoryData.forEach((item, index, arr) => {
      if (item.id === id) {
        item.deprecated = "Y";
        item.save();
        // 废弃小类
        categoryData.forEach((item1, index1, arr1) => {
          if (item1.parentId === id) {
            item1.deprecated = "Y";
            item1.save();
            // 废弃细类
            categoryData.forEach((item2, index2, arr2) => {
              if (item2.parentId === item1.id) {
                item2.deprecated = "Y";
                item2.save();
              }
            });
          }
        });
      }
    });
  } catch (error) {
    res.send(error);
  }
}

// 废弃类别和表格编码
app.post("/materialDeprecatedCategory", async (req, res) => {
  try {
    const categoryData = await materialCategoryModel.find({
      deprecated: "N",
    });

    // 废弃分类
    deprecatedChildrenCategory(categoryData, req.body.id);

    // 废弃表格编码
    switch (req.body.level) {
      case 2:
        await materialModel.updateMany(
          {
            middleId: req.body.id,
            deprecated: "N",
          },
          {
            deprecated: "Y",
          }
        );
        break;
      case 3:
        await materialModel.updateMany(
          {
            smallId: req.body.id,
            deprecated: "N",
          },
          {
            deprecated: "Y",
          }
        );
        break;
      case 4:
        await materialModel.updateMany(
          {
            thinId: req.body.id,
            deprecated: "N",
          },
          {
            deprecated: "Y",
          }
        );
        break;
    }
    res.send("已废弃该分类下的所有子分类及其编码");
  } catch (error) {
    res.send(error);
  }
});

// 废弃单个编码
app.post("/materialDeprecatedOne", async (req, res) => {
  try {
    await materialModel.updateOne(
      {
        resultCode: req.body.resultCode,
        deprecated: "N",
      },
      {
        deprecated: "Y",
        deprecatedTime: getMyTime(),
        deprecatedUser: req.body.deprecatedUser,
      }
    );
    res.send("已废弃单个编码");
  } catch (error) {
    res.send(error);
  }
});

// 成套外购
// 成套外购
// 成套外购
// 成套外购
// 成套外购

// 获取所有的成套设备
app.get("/equipmentGetTableAllData", async (req, res) => {
  try {
    const allData = await equipmentModel.find({
      deprecated: "N",
    });
    res.json(allData);
  } catch (error) {
    res.send(error);
  }
});

// 添加单个成套设备
app.post("/equipmentAddOne", async (req, res) => {
  try {
    // 获取该项目号下的流水号
    const allData = await equipmentModel.find({
      // 不需要 deprecated: "N"，否则会导致删除一个编码后，新增编码流水号重复
      projectCode: req.body.projectCode,
    });
    let projectOrderCode = (allData.length + 1).toString().padStart(6, "0");

    let equipment = new equipmentModel();
    equipment.projectCode = req.body.projectCode;
    equipment.projectOrderCode = projectOrderCode;
    equipment.projectCompany = req.body.projectCompany;
    equipment.projectType = req.body.projectType;
    equipment.equipmentCode = req.body.equipmentCode;
    equipment.equipmentName = req.body.equipmentName;
    equipment.equipmentGG = req.body.equipmentGG;
    equipment.unitName = req.body.unitName;
    equipment.unitCode = req.body.unitCode;
    equipment.resultCode = `W-${req.body.equipmentCode}-${projectOrderCode}-${req.body.projectCode}`;
    equipment.createTime = getMyTime();
    equipment.updateTime = "";
    equipment.deprecatedTime = "";
    equipment.createUser = req.body.createUser;
    equipment.updateUser = "";
    equipment.deprecatedUser = "";
    equipment.deprecated = "N";
    await equipment.save();
    res.send("已新增一条编码");
  } catch (error) {
    res.send(error);
  }
});

// 修改单个成套设备
app.post("/equipmentUpdateOne", async (req, res) => {
  try {
    await equipmentModel.updateOne(
      {
        _id: req.body._id,
        deprecated: "N",
      },
      {
        equipmentName: req.body.equipmentName,
        equipmentGG: req.body.equipmentGG,
        updateTime: getMyTime(),
        unitName: req.body.unitName,
        unitCode: req.body.unitCode,
        updateUser: req.body.updateUser,
      }
    );
    res.send("已修改单个编码");
  } catch (error) {
    res.send(error);
  }
});

// 废弃单个成套设备
app.post("/equipmentDeprecatedOne", async (req, res) => {
  try {
    await equipmentModel.updateOne(
      {
        resultCode: req.body.resultCode,
        deprecated: "N",
      },
      {
        deprecated: "Y",
        deprecatedTime: getMyTime(),
        deprecatedUser: req.body.deprecatedUser,
      }
    );
    res.send("已废弃单个编码");
  } catch (error) {
    res.send(error);
  }
});

// 自制件
// 自制件
// 自制件
// 自制件
// 自制件

// 获取所有的自制件
app.get("/homemadeGetTableAllData", async (req, res) => {
  try {
    const allData = await homemadeModel.find({
      deprecated: "N",
    });
    res.json(allData);
  } catch (error) {
    res.send(error);
  }
});

// 添加自制件编码至表格
app.post("/homemadeAddOne", async (req, res) => {
  try {
    let homemade = new homemadeModel();
    homemade.projectCode = req.body.projectCode;
    homemade.projectCompany = req.body.projectCompany;
    homemade.projectType = req.body.projectType;
    homemade.totalName = req.body.totalName;
    homemade.totalCode = req.body.totalCode;
    homemade.partName = req.body.partName;
    homemade.partCode = req.body.partCode;
    homemade.unitName = req.body.unitName;
    homemade.unitCode = req.body.unitCode;
    homemade.resultCode = req.body.resultCode;
    homemade.createTime = getMyTime();
    homemade.updateTime = "";
    homemade.deprecatedTime = "";
    homemade.createUser = req.body.createUser;
    homemade.updateUser = "";
    homemade.deprecatedUser = "";
    homemade.deprecated = "N";
    await homemade.save();
    res.send("已新增一条编码");
  } catch (error) {
    res.send(error);
  }
});

// 校验单个自制件
app.post("/homemadeValidRepeat", async (req, res) => {
  try {
    const allData = await homemadeModel.find({
      deprecated: "N",
      projectCode: req.body.projectCode,
      totalCode: req.body.totalCode,
    });
    if (allData.length === 0) {
      res.send("这是该总装图下新增的第一条数据");
    } else {
      if (allData[0].totalName !== req.body.totalName) {
        res.send("该总装图代号已存在，请修改成对应的总装图名称");
      } else {
        const allData_ = await homemadeModel.find({
          deprecated: "N",
          resultCode: req.body.resultCode,
        });
        if (allData_.length > 0) {
          res.send("最终物料编码已存在");
        } else {
          res.send("校验通过");
        }
      }
    }
  } catch (error) {
    res.send(error);
  }
});

// 修改单个自制件
app.post("/homemadeUpdateOne", async (req, res) => {
  try {
    await homemadeModel.updateOne(
      {
        _id: req.body._id,
        deprecated: "N",
      },
      {
        partName: req.body.partName,
        updateTime: getMyTime(),
        unitName: req.body.unitName,
        unitCode: req.body.unitCode,
        updateUser: req.body.updateUser,
      }
    );
    res.send("已修改单个编码");
  } catch (error) {
    res.send(error);
  }
});

// 废弃单个自制件
app.post("/homemadeDeprecatedOne", async (req, res) => {
  try {
    await homemadeModel.updateOne(
      {
        _id: req.body._id,
        deprecated: "N",
      },
      {
        deprecated: "Y",
        deprecatedTime: getMyTime(),
        deprecatedUser: req.body.deprecatedUser,
      }
    );
    res.send("已废弃单个编码");
  } catch (error) {
    res.send(error);
  }
});

// 操作记录
// 操作记录
// 操作记录
// 操作记录
// 操作记录

// 新增一条操作记录
// 添加自制件编码至表格
app.post("/operationHistoryAddOne", async (req, res) => {
  try {
    if (
      req.body.operationType === "修改表格编码" ||
      req.body.operationType === "废弃表格编码" ||
      req.body.operationType === "修改类别名称" ||
      req.body.operationType === "修改型号描述" ||
      req.body.operationType === "修改规格描述" ||
      req.body.operationType === "修改品牌单位"
    ) {
      let operationHistory = new operationHistoryModel();
      operationHistory.operationForm = req.body.operationForm;
      operationHistory.operationType = req.body.operationType;
      operationHistory.operationUser = req.body.operationUser;
      operationHistory.operationTime = getMyTime();
      operationHistory.deprecatedData = req.body.deprecatedData;
      operationHistory.updateBeforeData = req.body.updateBeforeData;
      operationHistory.updateAfterData = req.body.updateAfterData;
      await operationHistory.save();
      res.send("已新增一条操作记录");
    } else if (req.body.operationType === "废弃分类、子分类、表格编码") {
      // 废弃的分类及其所有子分类加到该废弃数组
      const allDeprecatedCategory = [];

      const categoryData = await materialCategoryModel.find({
        deprecated: "N",
      });

      categoryData.forEach((item, index, arr) => {
        if (item.id === req.body.queryParam.id) {
          allDeprecatedCategory.push(item);
          categoryData.forEach((item1, index1, arr1) => {
            if (item1.parentId === req.body.queryParam.id) {
              allDeprecatedCategory.push(item1);
              categoryData.forEach((item2, index2, arr2) => {
                if (item2.parentId === item1.id) {
                  allDeprecatedCategory.push(item2);
                }
              });
            }
          });
        }
      });

      // 该分类下需要废弃的所有编码加入该数组
      let allDeprecatedMaterial = [];
      switch (req.body.queryParam.level) {
        case 2:
          const middleData = await materialModel.find({
            middleId: req.body.queryParam.id,
            deprecated: "N",
          });
          allDeprecatedMaterial = middleData;
          break;
        case 3:
          const smallData = await materialModel.find({
            smallId: req.body.queryParam.id,
            deprecated: "N",
          });
          allDeprecatedMaterial = smallData;
          break;
        case 4:
          const thinData = await materialModel.find({
            thinId: req.body.queryParam.id,
            deprecated: "N",
          });
          allDeprecatedMaterial = thinData;
          break;
      }

      let operationHistory = new operationHistoryModel();
      operationHistory.operationForm = req.body.operationForm;
      operationHistory.operationType = req.body.operationType;
      operationHistory.operationUser = req.body.operationUser;
      operationHistory.operationTime = getMyTime();
      operationHistory.deprecatedData = {
        allDeprecatedCategory: allDeprecatedCategory,
        allDeprecatedMaterial: allDeprecatedMaterial,
      };
      operationHistory.updateBeforeData = req.body.updateBeforeData;
      operationHistory.updateAfterData = req.body.updateAfterData;
      await operationHistory.save();
      res.send("已新增一条操作记录");
    }
  } catch (error) {
    res.send(error);
  }
});
