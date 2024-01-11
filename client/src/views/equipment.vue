<template>
  <div>
    <v-form v-model="inputValid" ref="formInput">
      <v-row class="px-4">
        <v-col cols="2" v-if="rating >= 2">
          <div class="text-center text-h6 grey--text mb-3">【一】</div>
          <v-text-field
            filled
            rounded
            label="请输入项目号"
            v-model="projectCode"
            :rules="allRules.projectCodeRule"
          ></v-text-field>
        </v-col>

        <v-col cols="2" v-if="rating >= 2">
          <div class="text-center text-h6 grey--text mb-3">【二】</div>
          <v-text-field
            filled
            rounded
            label="请输入设备代号（自己命名）"
            v-model="equipmentCode"
            :rules="allRules.equipmentCodeRule"
          ></v-text-field>
        </v-col>

        <v-col cols="2" v-if="rating >= 2">
          <div class="text-center text-h6 grey--text mb-3">【三】</div>
          <v-textarea
            filled
            counter
            rounded
            label="请输入设备名称"
            v-model="equipmentName"
            :rules="allRules.nameAndGGRule"
          ></v-textarea>
        </v-col>

        <v-col cols="2" v-if="rating >= 2">
          <div class="text-center text-h6 grey--text mb-3">【四】</div>
          <v-textarea
            filled
            rounded
            counter
            label="请输入设备规格"
            v-model="equipmentGG"
            :rules="allRules.nameAndGGRule"
          ></v-textarea>
        </v-col>

        <v-col cols="2" v-if="rating >= 2">
          <div class="text-center text-h6 grey--text mb-3">【五】</div>
          <v-select
            filled
            rounded
            label="请选择单位"
            item-text="unitName"
            item-value="unitCode"
            :items="allUnit"
            v-model="chooseUnit"
            return-object
          ></v-select>
        </v-col>

        <v-col cols="2" v-if="rating >= 2">
          <div class="text-center text-h6 grey--text mb-3">【六】</div>
          <v-btn
            block
            rounded
            dark
            x-large
            color="green"
            @click="addOneEquipment()"
          >
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
                label="搜索设备名称/设备规格/最终物料码/新增人"
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
                        v-if="rating >= 2.5"
                        @click="
                          tempTableItem = Object.assign({}, item);
                          dialogChooseUnit = {
                            unitName: tempTableItem.unitName,
                            unitCode: tempTableItem.unitCode,
                          };
                          tempBeforeUpdateItem = Object.assign({}, item);
                          dialogUpdateOneEquipment = true;
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
                          dialogDeprecatedOneEquipment = true;
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
    </v-form>

    <!-- 修改表格编码 -->
    <v-dialog v-model="dialogUpdateOneEquipment" persistent width="800px">
      <v-card rounded="xl">
        <v-toolbar>
          <v-icon class="mr-3">mdi-lead-pencil</v-icon>
          <v-toolbar-title class="font-weight-light">修改编码</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="dialogUpdateOneEquipment = false"
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
            counter
            :rules="allRules.nameAndGGRule"
            label="请输入修改后的设备名称"
            v-model="tempTableItem.equipmentName"
          ></v-textarea>
          <v-textarea
            filled
            rounded
            counter
            :rules="allRules.nameAndGGRule"
            label="请输入修改后的设备规格"
            v-model="tempTableItem.equipmentGG"
          ></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded dark color="green" @click="updateOneEquipment()">
            确认
          </v-btn>
          <v-btn
            rounded
            dark
            color="blue-grey"
            @click="dialogUpdateOneEquipment = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 废弃表格编码 -->
    <v-dialog v-model="dialogDeprecatedOneEquipment" persistent width="600px">
      <v-card rounded="xl">
        <v-toolbar>
          <v-icon class="mr-3">mdi-delete</v-icon>
          <v-toolbar-title class="font-weight-light">废弃编码</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="dialogDeprecatedOneEquipment = false"
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
                  【该项目号下的流水号】{{ tempTableItem.projectOrderCode }}
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
                  【设备代号】{{ tempTableItem.equipmentCode }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【设备名称】{{ tempTableItem.equipmentName }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【设备规格】{{ tempTableItem.equipmentGG }}
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
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded dark color="red" @click="deprecatedOneEquipment()">
            确认
          </v-btn>
          <v-btn
            rounded
            dark
            color="blue-grey"
            @click="dialogDeprecatedOneEquipment = false"
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
            <hot-column title="设备代号" data="equipmentCode"> </hot-column>
            <hot-column title="设备名称" data="equipmentName"> </hot-column>
            <hot-column title="设备规格" data="equipmentGG"> </hot-column>
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
    // 设备名称
    equipmentName: "",
    // 设备代号
    equipmentCode: "",
    // 设别规格
    equipmentGG: "",

    // 暂存
    tempTableItem: "",
    tempBeforeUpdateItem: "",

    // 对话框
    dialogBulkExport: false,
    dialogUpdateOneEquipment: false,
    dialogDeprecatedOneEquipment: false,

    // 选中的单位
    chooseUnit: {
      unitCode: "13",
      unitName: "件",
    },
    // 对话框选中的单位
    dialogChooseUnit: {
      unitName: "",
      unitCode: "",
    },
    // 所有单位
    allUnit: [],

    // 输入校验
    inputValid: false,
    // 所有校验规则
    allRules: {
      // 设备名称与规格的校验
      nameAndGGRule: [
        (v) => !!v || "不能为空",
        (v) => v.length < 200 || "长度不能超过200",
        (v) => /^[^'"“”‘’]*$/.test(v) || "输入不能包含中英文的单、双引号",
      ],
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
        (v) =>
          v.substring(1, 2) === "M" ||
          v.substring(1, 2) === "L" ||
          v.substring(1, 2) === "R" ||
          v.substring(1, 2) === "S" ||
          "第2位必须是M/L/R/S",
        (v) => /^\d+$/.test(v.substring(2, 7)) || "第3位到第7位必须为数字",
        (v) => v.substring(7, 8) === "-" || "第8位必须为'-'字符",
        (v) => /^\d+$/.test(v.substring(8, 9)) || "第9位必须为数字",
        (v) => v.length === 9 || "长度必须为9位",
      ],
      // 设备代号校验
      equipmentCodeRule: [
        (v) => !!v || "不能为空",
        (v) => v.length === 5 || "长度必须为5位",
        (v) =>
          /^[A-Za-z0-9]+$/.test(v.substring(0, 5)) || "必须由字母或数字构成",
      ],
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
        text: "该项目号下的流水号",
        value: "projectOrderCode",
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
        text: "设备代号",
        value: "equipmentCode",
        sortable: false,
        filterable: false,
        align: "center",
      },
      {
        text: "设备名称",
        value: "equipmentName",
        sortable: false,
        filterable: true,
        align: "center",
      },
      {
        text: "设备规格",
        value: "equipmentGG",
        sortable: false,
        filterable: true,
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

  created() {
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
      this.$axios({
        method: "get",
        url: "/equipmentGetTableAllData",
      }).then((res) => {
        this.tableAllData = res.data;
        this.tableLoading = false;
      });
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    // 新增单个成套设备编码
    async addOneEquipment() {
      try {
        this.$refs.formInput.validate();
        if (this.inputValid === true) {
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
          ];
          companyArr.forEach((item, index, arr) => {
            if (item.value === this.projectCode.substring(0, 1)) {
              projectCompany = item.name;
            }
          });
          typeArr.forEach((item, index, arr) => {
            if (item.value === this.projectCode.substring(1, 2)) {
              projectType = item.name;
            }
          });

          await this.$axios({
            method: "post",
            url: "/equipmentAddOne",
            data: {
              projectCode: this.projectCode,
              projectCompany: projectCompany,
              projectType: projectType,
              equipmentCode: this.equipmentCode,
              equipmentName: this.equipmentName,
              equipmentGG: this.equipmentGG,
              unitName: this.chooseUnit.unitName,
              unitCode: this.chooseUnit.unitCode,
              createUser: this.username,
            },
          });

          // 刷新表格数据
          this.tableAllData = (
            await this.$axios({
              method: "get",
              url: "/equipmentGetTableAllData",
            })
          ).data;

          this.$refs.snackbar.snackbarStatus = "info";
          this.$refs.snackbar.snackbarText = "成功新增一条编码";
          this.$refs.snackbar.snackbarShow = true;
        }
      } catch (error) {
        console.log(error);
      }
    },

    // 修改单个成套设备编码
    async updateOneEquipment() {
      try {
        // 修改
        await this.$axios({
          method: "post",
          url: "/equipmentUpdateOne",
          data: {
            _id: this.tempTableItem._id,
            equipmentName: this.tempTableItem.equipmentName,
            equipmentGG: this.tempTableItem.equipmentGG,
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
            url: "/equipmentGetTableAllData",
          })
        ).data;
        // 新增一条修改的操作记录
        this.addOneOperationHistory(
          "equipment_form",
          "修改表格编码",
          this.username,
          "",
          this.tempBeforeUpdateItem,
          this.tempTableItem,
          ""
        );

        this.dialogUpdateOneEquipment = false;
        this.$refs.snackbar.snackbarStatus = "info";
        this.$refs.snackbar.snackbarText = "修改成功";
        this.$refs.snackbar.snackbarShow = true;
      } catch (error) {
        console.log(error);
      }
    },

    // 废弃单个成套设备编码
    async deprecatedOneEquipment() {
      try {
        await this.$axios({
          method: "post",
          url: "/equipmentDeprecatedOne",
          data: {
            resultCode: this.tempTableItem.resultCode,
            deprecatedUser: this.username,
          },
        });
        // 刷新表格数据
        this.tableAllData = (
          await this.$axios({
            method: "get",
            url: "/equipmentGetTableAllData",
          })
        ).data;

        // 新增一条删除的操作记录
        this.addOneOperationHistory(
          "equipment_form",
          "废弃表格编码",
          this.username,
          this.tempTableItem,
          "",
          "",
          ""
        );

        this.dialogDeprecatedOneEquipment = false;
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
    // 将代号的输入自动转换成大写
    projectCode() {
      this.projectCode = this.projectCode.toUpperCase();
    },
    equipmentCode() {
      this.equipmentCode = this.equipmentCode.toUpperCase();
    },
  },
};
</script>
