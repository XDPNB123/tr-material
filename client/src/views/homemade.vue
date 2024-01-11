<template>
  <div>
    <v-row class="px-4">
      <v-col cols="12" v-if="rating >= 2">
        <hot-table
          ref="hotTableImport"
          :settings="hotTableImportSettings"
          :key="refreshKey"
        >
          <hot-column title="总装图名称" data="totalName"> </hot-column>
          <hot-column title="总装图代号" data="totalCode"> </hot-column>
          <hot-column title="零部件名称" data="partName"> </hot-column>
          <hot-column title="零部件代号" data="partCode"> </hot-column>
          <hot-column title="单位（不填时默认为件）" data="unitName">
          </hot-column>
        </hot-table>
      </v-col>

      <v-col cols="2" offset="4" v-if="rating >= 2">
        <v-form v-model="validProjectCode" ref="formProjectCode">
          <v-text-field
            filled
            rounded
            label="请输入项目号"
            v-model="projectCode"
            :rules="allRules.projectCodeRule"
          ></v-text-field>
        </v-form>
      </v-col>

      <v-col cols="2" v-if="rating >= 2">
        <v-btn block rounded dark x-large color="green" @click="bulkImport()">
          <v-icon>mdi-check</v-icon>生成编码
        </v-btn>
      </v-col>

      <v-col cols="12">
        <v-card outlined elevation="1" rounded="xl" class="mb-10">
          <v-card-title class="text-h5 ml-5 my-5">
            <div>所有编码</div>

            <v-spacer></v-spacer>
            <v-btn
              rounded
              x-large
              color="primary"
              class="mr-5"
              :disabled="tableSelected.length < 1"
              @click="beforeBulkExport()"
            >
              <v-icon>mdi-export-variant</v-icon>批量导出
            </v-btn>

            <v-text-field
              filled
              rounded
              clearable
              hide-details
              append-icon="mdi-magnify"
              label="搜索"
              v-model="tableSearch"
            >
            </v-text-field>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="tableHeaders"
              :items="tableAllData"
              :search="tableSearch"
              :footer-props="{ 'items-per-page-options': [5, 10, 15, 100] }"
              :sort-by="['createTime']"
              :sort-desc="[true]"
              :loading="tableLoading"
              loading-text="正在加载数据......"
              no-data-text="没有任何数据"
              no-results-text="没有搜索到任何数据"
              show-select
              item-key="_id"
              v-model="tableSelected"
            >
              <template v-slot:[`item.resultCode`]="{ item }">
                <v-chip class="blue" dark>
                  {{ item.resultCode }}
                  <v-btn icon @click="copyText(item.resultCode)">
                    <v-icon small>mdi-content-copy</v-icon>
                  </v-btn>
                </v-chip>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <div class="d-flex justify-center">
                  <v-btn icon>
                    <v-icon
                      color="blue"
                      v-if="rating >= 3"
                      @click="
                        tempTableItem = Object.assign({}, item);
                        dialogChooseUnit = {
                          unitName: tempTableItem.unitName,
                          unitCode: tempTableItem.unitCode,
                        };
                        tempBeforeUpdateItem = Object.assign({}, item);
                        dialogUpdateOneHomemade = true;
                      "
                    >
                      mdi-lead-pencil
                    </v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon
                      color="red"
                      v-if="rating >= 4"
                      @click="
                        tempTableItem = Object.assign({}, item);
                        dialogDeprecatedOneHomemade = true;
                      "
                    >
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 修改表格编码 -->
    <v-dialog v-model="dialogUpdateOneHomemade" persistent width="800px">
      <v-card rounded="xl">
        <v-toolbar>
          <v-icon class="mr-3">mdi-lead-pencil</v-icon>
          <v-toolbar-title class="font-weight-light">修改编码</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="dialogUpdateOneHomemade = false"
            >mdi-close-thick</v-icon
          >
        </v-toolbar>
        <v-card-text class="mt-8">
          <v-select
            filled
            rounded
            label="请选择修改后的单位"
            item-text="unitName"
            item-value="unitCode"
            :items="allUnit"
            v-model="dialogChooseUnit"
            return-object
          ></v-select>
          <v-textarea
            filled
            rounded
            label="请输入修改后的零部件名称"
            v-model="tempTableItem.partName"
          ></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded dark color="green" @click="updateOneHomemade()">
            确认
          </v-btn>
          <v-btn
            rounded
            dark
            color="blue-grey"
            @click="dialogUpdateOneHomemade = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 废弃表格编码 -->
    <v-dialog v-model="dialogDeprecatedOneHomemade" persistent width="600px">
      <v-card rounded="xl">
        <v-toolbar>
          <v-icon class="mr-3">mdi-delete</v-icon>
          <v-toolbar-title class="font-weight-light">废弃编码</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="dialogDeprecatedOneHomemade = false"
            >mdi-close-thick</v-icon
          >
        </v-toolbar>
        <v-card-text>
          <div class="text-h6 text-center mt-6 mb-4">
            您确认要废弃该编码吗？
          </div>
          <v-list outlined rounded>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【项目号】{{ tempTableItem.projectCode }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【项目所属公司】{{ tempTableItem.projectCompany }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【项目类别】{{ tempTableItem.projectType }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【总装图名称】{{ tempTableItem.totalName }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【总装图代号】{{ tempTableItem.totalCode }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【零部件名称】{{ tempTableItem.partName }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【零部件代号】{{ tempTableItem.partCode }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【单位】{{ tempTableItem.unitName }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【最终物料码】{{ tempTableItem.resultCode }}
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded dark color="red" @click="deprecatedOneHomemade()">
            确认
          </v-btn>
          <v-btn
            rounded
            dark
            color="blue-grey"
            @click="dialogDeprecatedOneHomemade = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 批量导出编码 -->
    <v-dialog v-model="dialogBulkExport" persistent width="1200px">
      <v-card rounded="xl">
        <v-toolbar>
          <v-icon class="mr-3">mdi-export-variant</v-icon>
          <v-toolbar-title class="font-weight-light">批量导出</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="dialogBulkExport = false">mdi-close-thick</v-icon>
        </v-toolbar>
        <v-card-text>
          <hot-table
            ref="hotTableExport"
            :settings="hotTableExportSettings"
            :key="refreshKey"
            class="mt-6"
          >
            <hot-column title="项目号" data="projectCode"> </hot-column>
            <hot-column title="总装图名称" data="totalName"> </hot-column>
            <hot-column title="总装图代号" data="totalCode"> </hot-column>
            <hot-column title="零部件名称" data="partName"> </hot-column>
            <hot-column title="零部件代号" data="partCode"> </hot-column>
            <hot-column title="单位" data="unitName"> </hot-column>
            <hot-column title="最终物料码" data="resultCode"> </hot-column>
          </hot-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded dark color="green" @click="bulkExport()"> 导出 </v-btn>
          <v-btn
            rounded
            dark
            color="blue-grey"
            @click="dialogBulkExport = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Snackbar ref="snackbar"></Snackbar>
  </div>
</template>
<script>
import Snackbar from "../components/Snackbar.vue";
import { HotTable, HotColumn } from "@handsontable/vue";
import "handsontable/dist/handsontable.full.css";
import { registerAllModules } from "handsontable/registry";
registerAllModules();
export default {
  components: { Snackbar, HotTable, HotColumn },
  data: () => ({
    // 用户
    username: "",
    rating: "",

    // 刷新
    refreshKey: 0,

    // 项目号
    projectCode: "",
    // 项目号校验是否通过
    validProjectCode: false,

    // 暂存
    tempTableItem: "",
    tempBeforeUpdateItem: "",

    // 对话框
    dialogBulkExport: false,
    dialogUpdateOneHomemade: false,
    dialogDeprecatedOneHomemade: false,

    // 对话框选中的单位
    dialogChooseUnit: {
      unitName: "",
      unitCode: "",
    },
    // 所有单位
    allUnit: [],

    // 所有校验规则
    allRules: {
      // 项目号校验
      projectCodeRule: [
        (v) => !!v || "不能为空",
        (v) =>
          v.substring(0, 1) === "Z" ||
          v.substring(0, 1) === "F" ||
          v.substring(0, 1) === "J" ||
          v.substring(0, 1) === "A" ||
          v.substring(0, 1) === "Y" ||
          v.substring(0, 1) === "L" ||
          v.substring(0, 1) === "H" ||
          "第1位必须是Z/F/J/A/Y/L/H",
        (v) => /^[A-Z]+$/.test(v.substring(1, 2)) || "第2位必须大写字母",
        (v) => /^\d+$/.test(v.substring(2, 7)) || "第3位到第7位必须为数字",
        (v) => v.substring(7, 8) === "-" || "第8位必须为'-'字符",
        (v) => /^\d+$/.test(v.substring(8, 9)) || "第9位必须为数字",
        (v) => v.length === 9 || "长度必须为9位",
      ],
    },

    // 批量导入的设置
    hotTableImportSettings: {
      // 绑定的数据源
      data: [],
      // 显示行号
      rowHeaders: true,
      // 最小空余行
      minSpareRows: 5,
      // 高度自适应
      height: "auto",
      // 横向展开
      stretchH: "all",
      // 密钥认证
      licenseKey: "non-commercial-and-evaluation",
    },

    // 批量导出的设置
    hotTableExportSettings: {
      // 绑定的数据源
      data: [],
      // 显示行号
      rowHeaders: true,
      // 最小空余行
      minSpareRows: 5,
      // 高度自适应
      height: "auto",
      // 横向展开
      stretchH: "all",
      // 密钥认证
      licenseKey: "non-commercial-and-evaluation",
    },

    // 表格
    tableSelected: [],
    tableSearch: "",
    tableAllData: [],
    tableLoading: true,
    tableHeaders: [
      {
        text: "项目号",
        value: "projectCode",
        sortable: false,
        filterable: false,
        align: "center",
      },
      {
        text: "项目所属公司",
        value: "projectCompany",
        sortable: false,
        filterable: false,
        align: "center",
      },
      {
        text: "项目类别",
        value: "projectType",
        sortable: false,
        filterable: false,
        align: "center",
      },
      {
        text: "总装图名称",
        value: "totalName",
        sortable: false,
        filterable: true,
        align: "center",
      },
      {
        text: "总装图代号",
        value: "totalCode",
        sortable: false,
        filterable: false,
        align: "center",
      },
      {
        text: "零部件名称",
        value: "partName",
        sortable: false,
        filterable: true,
        align: "center",
      },
      {
        text: "零部件代号",
        value: "partCode",
        sortable: false,
        filterable: false,
        align: "center",
      },
      {
        text: "单位",
        value: "unitName",
        sortable: false,
        filterable: false,
        align: "center",
      },
      {
        text: "最终物料码",
        value: "resultCode",
        sortable: false,
        filterable: true,
        align: "center",
      },
      {
        text: "新增时间",
        value: "createTime",
        sortable: true,
        filterable: false,
        align: "center",
      },
      {
        text: "新增人",
        value: "createUser",
        sortable: false,
        filterable: true,
        align: "center",
      },
      {
        text: "操作",
        value: "actions",
        sortable: false,
        filterable: false,
        align: "center",
      },
    ],
  }),

  async created() {
    try {
      // 获取用户信息用户
      this.username = localStorage.getItem("username");
      this.rating = localStorage.getItem("rating");

      // 获取所有单位
      this.$axios({
        method: "get",
        url: "/unitGetAllData",
      }).then((res) => {
        this.allUnit = res.data;
      });

      // 获取表格的所有数据
      this.tableAllData = (
        await this.$axios({
          method: "get",
          url: "/homemadeGetTableAllData",
        })
      ).data;
      this.tableLoading = false;
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    // 批量导入自制件
    async bulkImport() {
      this.$refs.formProjectCode.validate();
      if (this.validProjectCode) {
        // 获取所有数据
        const allData = this.hotTableImportSettings.data;

        // 校验通过的数据
        const filterAllData = [];

        // 校验是否通过
        let validFlag = true;
        allData.forEach((item, index, arr) => {
          if (
            !item.totalName &&
            item.totalCode &&
            item.partName &&
            item.partCode
          ) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，总装图名称不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (
            item.totalName &&
            !item.totalCode &&
            item.partName &&
            item.partCode
          ) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，总装图代号不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (
            item.totalName &&
            item.totalCode &&
            !item.partName &&
            item.partCode
          ) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，零部件名称不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (
            item.totalName &&
            item.totalCode &&
            item.partName &&
            !item.partCode
          ) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，零部件代号不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (
            !item.totalName &&
            !item.totalCode &&
            item.partName &&
            item.partCode
          ) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，总装图名称、总装图代号不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (
            !item.totalName &&
            item.totalCode &&
            !item.partName &&
            item.partCode
          ) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，总装图名称、零部件名称不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (
            !item.totalName &&
            item.totalCode &&
            item.partName &&
            !item.partCode
          ) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，总装图名称、零部件代号不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (
            item.totalName &&
            !item.totalCode &&
            !item.partName &&
            item.partCode
          ) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，总装图代号、零部件名称不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (
            item.totalName &&
            !item.totalCode &&
            item.partName &&
            !item.partCode
          ) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，总装图代号、零部件代号不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (
            item.totalName &&
            item.totalCode &&
            !item.partName &&
            !item.partCode
          ) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，零部件名称、零部件代号不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (
            !item.totalName &&
            !item.totalCode &&
            !item.partName &&
            item.partCode
          ) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，总装图名称、总装图代号、零部件名称不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (
            !item.totalName &&
            !item.totalCode &&
            item.partName &&
            !item.partCode
          ) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，总装图名称、总装图代号、零部件代号不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (
            item.totalName &&
            !item.totalCode &&
            !item.partName &&
            !item.partCode
          ) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，总装图代号、零部件名称、零部件代号不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (
            item.totalName &&
            item.totalCode &&
            item.partName &&
            item.partCode
          ) {
            // 总装图代号的校验
            if (
              /^[A-Z0-9]+$/.test(item.totalCode) &&
              item.totalCode.length === 5
            ) {
              // 零部件代号的校验
              if (
                /^\d+$/.test(item.partCode.substring(0, 2)) &&
                /^\d+$/.test(item.partCode.substring(3, 5)) &&
                /^\d+$/.test(item.partCode.substring(6, 8)) &&
                /^\d+$/.test(item.partCode.substring(9, 11)) &&
                /^[A-Z]+$/.test(item.partCode.substring(11, 12)) &&
                item.partCode.substring(2, 3) === "." &&
                item.partCode.substring(5, 6) === "." &&
                item.partCode.substring(8, 9) === "."
              ) {
                if (!item.unitName) {
                  // 如果没有单位，则默认为件
                  item.unitName = "件";
                  item.unitCode = "13";
                  filterAllData.push(item);
                } else {
                  // 判断单位是否能在定义的所有单位中找到
                  let findFlag = false;
                  this.allUnit.forEach((item1, index1, arr1) => {
                    if (item1.unitName === item.unitName) {
                      findFlag = true;
                      item.unitCode = item1.unitCode;
                      filterAllData.push(item);
                    }
                  });
                  // 如果单位没找到
                  if (!findFlag) {
                    validFlag = false;
                    this.$refs.snackbar.snackbarStatus = "error";
                    this.$refs.snackbar.snackbarText = `请检查第${
                      index + 1
                    }行，单位'${item.unitName}'不存在于常用单位中`;
                    this.$refs.snackbar.snackbarShow = true;
                  }
                }
              } else {
                validFlag = false;
                this.$refs.snackbar.snackbarStatus = "error";
                this.$refs.snackbar.snackbarText = `请检查第${
                  index + 1
                }行，零部件代号格式错误`;
                this.$refs.snackbar.snackbarShow = true;
              }
            } else {
              validFlag = false;
              this.$refs.snackbar.snackbarStatus = "error";
              this.$refs.snackbar.snackbarText = `请检查第${
                index + 1
              }行，总装图代号长度只能是五位，且必须由数字或字母构成`;
              this.$refs.snackbar.snackbarShow = true;
            }
          }
        });

        /**
         * 校验输入的表格，要求表格不能有重复
         */
        // 输入的 Excel 表格中是否有重复编码
        let inputFormRepeat = false;
        // 给每一条数据添加 resultCode 属性
        filterAllData.forEach((item) => {
          item.resultCode = `M-${item.totalCode}-${item.partCode}-${this.projectCode}`;
        });
        // 里面每一个元素都是 resultCode 字符串
        const tempArr = [];
        for (let i = 0; i < filterAllData.length; i++) {
          if (i === 0) {
            tempArr.push(filterAllData[0].resultCode);
            continue;
          }
          if (tempArr.includes(filterAllData[i].resultCode)) {
            inputFormRepeat = true;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              i + 1
            }行，零部件代号重复`;
            this.$refs.snackbar.snackbarShow = true;
            break;
          } else {
            tempArr.push(filterAllData[i].resultCode);
          }
        }

        // 数据库中是否已经存在编码
        let repeatFlag = false;
        if (validFlag && !inputFormRepeat) {
          // 循环检查重复
          for (let i = 0; i < filterAllData.length; i++) {
            const res = await this.$axios({
              method: "post",
              url: "/homemadeValidRepeat",
              data: {
                projectCode: this.projectCode,
                totalName: filterAllData[i].totalName,
                totalCode: filterAllData[i].totalCode,
                resultCode: filterAllData[i].resultCode,
              },
            });

            if (res.data === "这是该总装图下新增的第一条数据") {
              continue;
            } else if (
              res.data === "该总装图代号已存在，请修改成对应的总装图名称"
            ) {
              repeatFlag = true;
              this.$refs.snackbar.snackbarStatus = "error";
              this.$refs.snackbar.snackbarText = `请检查第${
                i + 1
              }行，该总装图代号已存在，请修改成对应的总装图名称`;
              this.$refs.snackbar.snackbarShow = true;
              break;
            } else if (res.data === "最终物料编码已存在") {
              repeatFlag = true;
              this.$refs.snackbar.snackbarStatus = "error";
              this.$refs.snackbar.snackbarText = `请检查第${
                i + 1
              }行，最终物料码${filterAllData[i].resultCode}已存在`;
              this.$refs.snackbar.snackbarShow = true;
              break;
            } else if (res.data === "校验通过") {
              continue;
            }
          }
        }

        // 如果校验成功
        if (validFlag && !repeatFlag && !inputFormRepeat) {
          // 根据项目号获取项目所属公司和项目类型
          let projectCompany = "";
          let projectType = "";
          const companyArr = [
            { name: "自动化", value: "Z" },
            { name: "孚鼎泰", value: "F" },
            { name: "机器人", value: "J" },
            { name: "AGV", value: "A" },
            { name: "研究院", value: "Y" },
            { name: "云联", value: "L" },
            { name: "安徽", value: "H" },
          ];
          const typeArr = [
            { name: "智能制造", value: "M" },
            { name: "输送分拣", value: "L" },
            { name: "研发", value: "R" },
            { name: "售后", value: "S" },
            { name: "内部委托", value: "X" },
          ];
          companyArr.forEach((item, index, arr) => {
            if (item.value === this.projectCode.substring(0, 1)) {
              projectCompany = item.name;
            }
          });

          const temp = typeArr.find((item) => {
            return item.value === this.projectCode.substring(1, 2);
          });

          if (temp === undefined) {
            projectType = this.projectCode.substring(1, 2);
          } else {
            projectType = temp.name;
          }

          // 循环添加编码
          for (let i = 0; i < filterAllData.length; i++) {
            await this.$axios({
              method: "post",
              url: "/homemadeAddOne",
              data: {
                projectCode: this.projectCode,
                projectCompany: projectCompany,
                projectType: projectType,
                totalName: filterAllData[i].totalName,
                totalCode: filterAllData[i].totalCode,
                partName: filterAllData[i].partName,
                partCode: filterAllData[i].partCode,
                unitName: filterAllData[i].unitName,
                unitCode: filterAllData[i].unitCode,
                resultCode: `M-${filterAllData[i].totalCode}-${filterAllData[i].partCode}-${this.projectCode}`,
                createUser: this.username,
              },
            });
          }

          // 批量导入表格置空
          this.hotTableImportSettings.data = [];
          this.refreshKey++;

          // 刷新数据表格
          this.tableLoading = true;
          // 获取表格的所有数据
          this.tableAllData = (
            await this.$axios({
              method: "get",
              url: "/homemadeGetTableAllData",
            })
          ).data;
          this.$refs.snackbar.snackbarStatus = "info";
          this.$refs.snackbar.snackbarText = "批量导入成功";
          this.$refs.snackbar.snackbarShow = true;
          this.tableLoading = false;
        }
      }
    },

    // 修改单个自制件编码
    async updateOneHomemade() {
      try {
        // 修改
        await this.$axios({
          method: "post",
          url: "/homemadeUpdateOne",
          data: {
            _id: this.tempTableItem._id,
            partName: this.tempTableItem.partName,
            unitName: this.dialogChooseUnit.unitName,
            unitCode: this.dialogChooseUnit.unitCode,
            updateUser: this.username,
          },
        });
        // 更新 tempTableItem 的单位
        this.tempTableItem.unitName = this.dialogChooseUnit.unitName;
        this.tempTableItem.unitCode = this.dialogChooseUnit.unitCode;
        // 刷新表格数据
        this.tableAllData = (
          await this.$axios({
            method: "get",
            url: "/homemadeGetTableAllData",
          })
        ).data;
        // 新增一条修改的操作记录
        this.addOneOperationHistory(
          "homemade_form",
          "修改表格编码",
          this.username,
          "",
          this.tempBeforeUpdateItem,
          this.tempTableItem,
          ""
        );

        this.dialogUpdateOneHomemade = false;
        this.$refs.snackbar.snackbarStatus = "info";
        this.$refs.snackbar.snackbarText = "修改成功";
        this.$refs.snackbar.snackbarShow = true;
      } catch (error) {
        console.log(error);
      }
    },

    // 废弃单个编码
    async deprecatedOneHomemade() {
      try {
        await this.$axios({
          method: "post",
          url: "/homemadeDeprecatedOne",
          data: {
            _id: this.tempTableItem._id,
            deprecatedUser: this.username,
          },
        });

        // 刷新表格数据
        this.tableLoading = true;
        this.tableAllData = (
          await this.$axios({
            method: "get",
            url: "/homemadeGetTableAllData",
          })
        ).data;
        this.tableLoading = false;

        // 新增一条删除或修改的操作记录
        this.addOneOperationHistory(
          "homemade_form",
          "废弃表格编码",
          this.username,
          this.tempTableItem,
          "",
          "",
          ""
        );

        this.dialogDeprecatedOneHomemade = false;
        this.$refs.snackbar.snackbarStatus = "info";
        this.$refs.snackbar.snackbarText = "废弃编码成功";
        this.$refs.snackbar.snackbarShow = true;
      } catch (error) {
        console.log(error);
      }
    },

    // 新增一条删除或修改的操作记录
    addOneOperationHistory(
      operationForm,
      operationType,
      operationUser,
      deprecatedData,
      updateBeforeData,
      updateAfterData,
      queryParam
    ) {
      try {
        this.$axios({
          method: "post",
          url: "/operationHistoryAddOne",
          data: {
            operationForm: operationForm,
            operationType: operationType,
            operationUser: operationUser,
            deprecatedData: deprecatedData,
            updateBeforeData: updateBeforeData,
            updateAfterData: updateAfterData,
            queryParam: queryParam,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },

    // 批量导出之前
    beforeBulkExport() {
      // 打开对话框前清空数据
      this.hotTableExportSettings.data = JSON.parse(
        JSON.stringify(this.tableSelected)
      );

      // 打开对话框前刷新 handsontable，否则清空数据失败，仍然会保留上一次的导入数据
      this.refreshKey++;

      // 打开对话框
      this.dialogBulkExport = true;

      // 打开对话框之后，必须进行一次延迟重渲染，否则表格宽度只会展示一半
      setTimeout(() => {
        this.refreshKey++;
      }, 3000);
    },

    // 批量导出
    bulkExport() {
      try {
        this.$refs.hotTableExport.hotInstance
          .getPlugin("exportFile")
          .downloadFile("csv", {
            filename: "导出数据",
          });
      } catch (error) {
        console.log(error);
      }
    },

    // 复制输入框中的内容
    copyText(text) {
      this.$copyText(text);
      this.$refs.snackbar.snackbarStatus = "info";
      this.$refs.snackbar.snackbarText = "复制成功";
      this.$refs.snackbar.snackbarShow = true;
    },
  },

  watch: {
    projectCode() {
      this.projectCode = this.projectCode.toUpperCase();
    },
    tableSelected() {
      console.log(this.tableSelected);
    },
  },
};
</script>
