<template>
  <div>
    <v-row class="px-4">
      <v-col cols="12">
        <v-row>
          <v-col cols="8">
            <!-- :search-input.sync 绑定的是搜索框输入的数据，v-model 绑定的是选中某一项后返回的数据 -->
            <v-combobox
              filled
              rounded
              clearable
              label="全局搜索（至少输入两个字）"
              no-data-text="没有找到数据"
              :search-input.sync="searchAll"
              v-model="searchAllReturnObject"
              @change="afterClickSearchItem()"
              :items="allFilteredNames"
              item-text="joinName"
            ></v-combobox>
          </v-col>

          <v-col cols="4">
            <v-text-field
              filled
              rounded
              readonly
              label="拼接后的类别"
              append-icon="mdi-content-copy"
              @click:append="copyText(joinCategoryName)"
              v-model="joinCategoryName"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="2">
        <div class="text-center text-h5 grey--text mb-3">【一】选择大类</div>
        <v-card outlined elevation="1" rounded="xl">
          <v-card-text>
            <v-list rounded height="420px" class="overflow-auto">
              <v-list-item-group v-model="bigIndex" color="primary">
                <v-list-item
                  v-for="(item, index) in showingAllBigCategory"
                  :key="index"
                  @click="showChildrenList(item)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{
                      item.categoryName
                    }}</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-icon>
                    <v-tooltip top v-if="rating >= 2">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="green"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="
                            tempItem = Object.assign({}, item);
                            dialogAddCategory = true;
                          "
                        >
                          <v-icon> mdi-plus-thick </v-icon>
                        </v-btn>
                      </template>
                      <span>在该类别下新增中类</span>
                    </v-tooltip>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
        <v-text-field
          filled
          rounded
          readonly
          hide-details
          class="mt-6 text-h6"
          v-model="bigCode"
        ></v-text-field>
      </v-col>

      <v-col cols="2">
        <div class="text-center text-h5 grey--text mb-3">【二】选择中类</div>
        <v-card outlined elevation="1" rounded="xl">
          <v-card-text>
            <v-list rounded height="420px" class="overflow-auto">
              <v-list-item-group v-model="middleIndex" color="primary">
                <v-list-item
                  v-for="(item, index) in showingAllMiddleCategory"
                  :key="index"
                  @click="showChildrenList(item)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{
                      item.categoryName
                    }}</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-icon>
                    <v-tooltip top v-if="rating >= 2">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="green"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="
                            tempItem = Object.assign({}, item);
                            dialogAddCategory = true;
                          "
                        >
                          <v-icon> mdi-plus-thick </v-icon>
                        </v-btn>
                      </template>
                      <span>在该类别下新增小类</span>
                    </v-tooltip>
                    <v-tooltip top v-if="rating >= 3">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="blue"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="
                            tempItem = Object.assign({}, item);
                            tempBeforeUpdateItem = Object.assign({}, item);
                            dialogUpdateCategoryOrXHOrGG = true;
                          "
                        >
                          <v-icon> mdi-lead-pencil </v-icon>
                        </v-btn>
                      </template>
                      <span>修改该类别的名称</span>
                    </v-tooltip>
                    <v-tooltip top v-if="rating >= 4">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="red"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="
                            tempItem = Object.assign({}, item);
                            dialogDeprecatedCategory = true;
                          "
                        >
                          <v-icon> mdi-delete </v-icon>
                        </v-btn>
                      </template>
                      <span>废弃该类别</span>
                    </v-tooltip>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
        <v-text-field
          filled
          rounded
          readonly
          hide-details
          class="mt-6 text-h6"
          v-model="middleCode"
        ></v-text-field>
      </v-col>

      <v-col cols="2">
        <div class="text-center text-h5 grey--text mb-3">【三】选择小类</div>
        <v-card outlined elevation="1" rounded="xl">
          <v-card-text>
            <v-list rounded height="420px" class="overflow-auto">
              <v-list-item-group v-model="smallIndex" color="primary">
                <v-list-item
                  v-for="(item, index) in showingAllSmallCategory"
                  :key="index"
                  @click="showChildrenList(item)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{
                      item.categoryName
                    }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-tooltip top v-if="rating >= 2">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="green"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="
                            tempItem = Object.assign({}, item);
                            dialogAddCategory = true;
                          "
                        >
                          <v-icon> mdi-plus-thick </v-icon>
                        </v-btn>
                      </template>
                      <span>在该类别下新增细类</span>
                    </v-tooltip>
                    <v-tooltip top v-if="rating >= 3">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="blue"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="
                            tempItem = Object.assign({}, item);
                            tempBeforeUpdateItem = Object.assign({}, item);
                            dialogUpdateCategoryOrXHOrGG = true;
                          "
                        >
                          <v-icon> mdi-lead-pencil </v-icon>
                        </v-btn>
                      </template>
                      <span>修改该类别的名称</span>
                    </v-tooltip>
                    <v-tooltip top v-if="rating >= 4">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="red"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="
                            tempItem = Object.assign({}, item);
                            dialogDeprecatedCategory = true;
                          "
                        >
                          <v-icon> mdi-delete </v-icon>
                        </v-btn>
                      </template>
                      <span>废弃该类别</span>
                    </v-tooltip>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
        <v-text-field
          filled
          rounded
          readonly
          hide-details
          class="mt-6 text-h6"
          v-model="smallCode"
        ></v-text-field>
      </v-col>

      <v-col cols="2">
        <div class="text-center text-h5 grey--text mb-3">【四】选择细类</div>
        <v-card outlined elevation="1" rounded="xl">
          <v-card-text>
            <v-list rounded height="420px" class="overflow-auto">
              <v-list-item-group v-model="thinIndex" color="primary">
                <v-list-item
                  v-for="(item, index) in showingAllThinCategory"
                  :key="index"
                  @click="showChildrenList(item)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{
                      item.categoryName
                    }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-tooltip top v-if="rating >= 2">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="green"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="beforeBulkImport()"
                        >
                          <v-icon> mdi-microsoft-excel </v-icon>
                        </v-btn>
                      </template>
                      <span>批量导入</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="orange"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="
                            beforeBulkExport('导出某细类下的所有型号规格')
                          "
                        >
                          <v-icon> mdi-export-variant </v-icon>
                        </v-btn>
                      </template>
                      <span>批量导出</span>
                    </v-tooltip>
                    <v-tooltip top v-if="rating >= 3">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="blue"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="
                            tempItem = Object.assign({}, item);
                            tempBeforeUpdateItem = Object.assign({}, item);
                            dialogUpdateCategoryOrXHOrGG = true;
                          "
                        >
                          <v-icon> mdi-lead-pencil </v-icon>
                        </v-btn>
                      </template>
                      <span>修改该类别的名称</span>
                    </v-tooltip>
                    <v-tooltip top v-if="rating >= 4">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="red"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="
                            tempItem = Object.assign({}, item);
                            dialogDeprecatedCategory = true;
                          "
                        >
                          <v-icon> mdi-delete </v-icon>
                        </v-btn>
                      </template>
                      <span>废弃该类别</span>
                    </v-tooltip>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
        <v-text-field
          filled
          rounded
          readonly
          hide-details
          class="mt-6 text-h6"
          v-model="thinCode"
        ></v-text-field>
      </v-col>

      <v-col cols="2">
        <div class="text-center text-h5 grey--text mb-3">【五】选择型号</div>
        <v-card outlined elevation="1" rounded="xl">
          <v-card-text>
            <v-list rounded height="420px" class="overflow-auto">
              <v-list-item-group v-model="xhIndex" color="primary">
                <v-list-item
                  v-for="(item, index) in showingAllXH"
                  :key="index"
                  @click="showChildrenList(item)"
                >
                  <v-list-item-content>
                    <div class="text-subtitle-1">{{ item.xhms }}</div>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-tooltip top v-if="rating >= 3">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="blue"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="
                            tempItem = Object.assign({}, item);
                            tempBeforeUpdateItem = Object.assign({}, item);
                            dialogUpdateCategoryOrXHOrGG = true;
                          "
                        >
                          <v-icon> mdi-lead-pencil </v-icon>
                        </v-btn>
                      </template>
                      <span>修改该型号描述</span>
                    </v-tooltip>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
        <v-text-field
          filled
          rounded
          readonly
          hide-details
          class="mt-6 text-h6"
          v-model="xhCode"
        ></v-text-field>
      </v-col>

      <v-col cols="2">
        <div class="text-center text-h5 grey--text mb-3">【六】选择规格</div>
        <v-card outlined elevation="1" rounded="xl">
          <v-card-text>
            <v-list rounded height="420px" class="overflow-auto">
              <v-list-item-group v-model="ggIndex" color="primary">
                <v-list-item
                  v-for="(item, index) in showingAllGG"
                  :key="index"
                  @click="showChildrenList(item)"
                >
                  <v-list-item-content>
                    <div class="text-subtitle-1">{{ item.ggms }}</div>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-tooltip top v-if="rating >= 3">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="blue"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="
                            tempItem = Object.assign({}, item);
                            tempBeforeUpdateItem = Object.assign({}, item);
                            dialogUpdateCategoryOrXHOrGG = true;
                          "
                        >
                          <v-icon> mdi-lead-pencil </v-icon>
                        </v-btn>
                      </template>
                      <span>编辑该规格描述</span>
                    </v-tooltip>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
        <v-text-field
          filled
          rounded
          readonly
          hide-details
          class="mt-6 text-h6"
          v-model="ggCode"
        ></v-text-field>
      </v-col>

      <v-col cols="2" offset="4" v-if="rating >= 2">
        <v-textarea
          filled
          rounded
          clearable
          hide-details
          label="请输入型号描述"
          v-model="xhms"
        ></v-textarea>
      </v-col>

      <v-col cols="2" v-if="rating >= 2">
        <v-textarea
          filled
          rounded
          clearable
          hide-details
          label="输入规格描述"
          v-model="ggms"
        ></v-textarea>
      </v-col>

      <v-col cols="12" v-if="rating >= 2">
        <v-row>
          <v-col cols="4" offset="4">
            <v-text-field
              filled
              rounded
              hide-details
              label="请输入品牌（可不填）"
              v-model="brandName"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" offset="4">
            <v-select
              filled
              rounded
              hide-details
              label="请选择单位"
              item-text="unitName"
              item-value="unitCode"
              return-object
              v-model="chooseUnit"
              :items="allUnit"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" offset="4">
            <v-btn
              block
              x-large
              rounded
              dark
              color="green"
              @click="addOneMaterial()"
            >
              <v-icon>mdi-check</v-icon>生成编码
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-card outlined elevation="1" rounded="xl" class="my-10">
          <v-card-title class="text-h5 ml-5 my-5">
            <div v-if="tableShowAllData || !bigId">所有编码</div>
            <div v-else>【{{ tableShowingCategoryOrXHOrGG }}】下所有的编码</div>
            <v-spacer></v-spacer>
            <v-switch
              inset
              label="是否展示所有编码"
              class="mr-5"
              v-model="tableShowAllData"
            ></v-switch>
            <v-btn
              rounded
              x-large
              color="primary"
              class="mr-5"
              :disabled="tableSelected.length < 1"
              @click="beforeBulkExport('导出表格中的数据')"
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
                        tempBeforeUpdateItem = Object.assign({}, item);
                        dialogUpdateOneMaterial = true;
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
                        dialogDeprecatedOneMaterial = true;
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

    <!-- 新增大中小细类 -->
    <v-dialog v-model="dialogAddCategory" persistent width="600px">
      <v-card rounded="xl">
        <v-toolbar>
          <v-icon class="mr-3">mdi-plus-thick</v-icon>
          <v-toolbar-title class="font-weight-light">新增类别</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="dialogAddCategory = false">mdi-close-thick</v-icon>
        </v-toolbar>
        <v-card-text>
          <div class="text-h6 text-center mt-8 mb-4">
            在【{{ tempItem.categoryName }}】下新增{{
              tempItem.level === 1 ? "中" : tempItem.level === 2 ? "小" : "细"
            }}类
          </div>
          <v-text-field
            filled
            rounded
            label="请输入要新增的类别名称"
            v-model="inputCategoryName"
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded dark color="green" @click="addCategory()">
            确认
          </v-btn>
          <v-btn
            rounded
            dark
            color="blue-grey"
            @click="dialogAddCategory = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 修改中小细类名称/型号描述/规格描述 -->
    <v-dialog v-model="dialogUpdateCategoryOrXHOrGG" persistent width="600px">
      <v-card rounded="xl">
        <v-toolbar>
          <v-icon class="mr-3">mdi-lead-pencil</v-icon>
          <v-toolbar-title class="font-weight-light">
            修改{{
              parseInt(tempItem.level) === 2
                ? "类别名称"
                : parseInt(tempItem.level) === 3
                ? "类别名称"
                : parseInt(tempItem.level) === 4
                ? "类别名称"
                : parseInt(tempItem.level) === 5
                ? "型号描述"
                : "规格描述"
            }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="dialogUpdateCategoryOrXHOrGG = false"
            >mdi-close-thick</v-icon
          >
        </v-toolbar>
        <v-card-text>
          <v-text-field
            filled
            rounded
            class="mt-12"
            label="请输入修改后的类别名称"
            v-model="tempItem.categoryName"
            v-if="
              parseInt(tempItem.level) === 2 ||
              parseInt(tempItem.level) === 3 ||
              parseInt(tempItem.level) === 4
            "
          ></v-text-field>

          <v-textarea
            filled
            rounded
            class="mt-12"
            label="请输入修改后的型号描述"
            v-model="tempItem.xhms"
            v-if="parseInt(tempItem.level) === 5"
          ></v-textarea>

          <v-textarea
            filled
            rounded
            class="mt-12"
            label="请输入修改后的规格描述"
            v-model="tempItem.ggms"
            v-if="parseInt(tempItem.level) === 6"
          ></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded dark color="green" @click="updateCategoryOrXHOrGG()">
            确认
          </v-btn>
          <v-btn
            rounded
            dark
            color="blue-grey"
            @click="dialogUpdateCategoryOrXHOrGG = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 修改单位/品牌 -->
    <v-dialog v-model="dialogUpdateOneMaterial" persistent width="600px">
      <v-card rounded="xl">
        <v-toolbar>
          <v-icon class="mr-3">mdi-lead-pencil</v-icon>
          <v-toolbar-title class="font-weight-light">修改编码</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="dialogUpdateOneMaterial = false"
            >mdi-close-thick</v-icon
          >
        </v-toolbar>
        <v-card-text class="mt-6">
          <v-select
            filled
            rounded
            label="请选择修改后的单位"
            item-text="unitName"
            v-model="tempTableItem.unitName"
            :items="allUnit"
          ></v-select>
          <v-text-field
            filled
            rounded
            hide-details
            label="请输入修改后的品牌"
            v-model="tempTableItem.brandName"
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded dark color="green" @click="updateOneMaterial()">
            确认
          </v-btn>
          <v-btn
            rounded
            dark
            color="blue-grey"
            @click="dialogUpdateOneMaterial = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 废弃分类，并同时废弃该分类下的所有编码 -->
    <v-dialog v-model="dialogDeprecatedCategory" persistent width="600px">
      <v-card rounded="xl">
        <v-toolbar>
          <v-icon class="mr-3">mdi-delete</v-icon>
          <v-toolbar-title class="font-weight-light">废弃分类</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="dialogDeprecatedCategory = false"
            >mdi-close-thick</v-icon
          >
        </v-toolbar>
        <v-card-text>
          <div
            class="text-h6 font-weight-middle text-center red--text mt-8 mb-4"
          >
            警告！！！废弃该分类的同时，会废弃该分类下所有的编码，并废弃其所有子分类，请问你还要废弃吗？
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded dark color="red" @click="deprecatedCategory()">
            确认
          </v-btn>
          <v-btn
            rounded
            dark
            color="blue-grey"
            @click="dialogDeprecatedCategory = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 废弃表格编码 -->
    <v-dialog v-model="dialogDeprecatedOneMaterial" persistent width="600px">
      <v-card rounded="xl">
        <v-toolbar>
          <v-icon class="mr-3">mdi-delete</v-icon>
          <v-toolbar-title class="font-weight-light">废弃编码</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="dialogDeprecatedOneMaterial = false"
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
                  【大类】{{ tempTableItem.bigName }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【中类】{{ tempTableItem.middleName }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【小类】{{ tempTableItem.smallName }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【细类】{{ tempTableItem.thinName }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【型号】{{ tempTableItem.xhms }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div class="text-subtitle-1">
                  【规格】{{ tempTableItem.ggms }}
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
          <v-btn rounded dark color="red" @click="deprecatedOneMaterial()">
            确认
          </v-btn>
          <v-btn
            rounded
            dark
            color="blue-grey"
            @click="dialogDeprecatedOneMaterial = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 使用可编辑表格批量导入细类下的多个型号和规格 -->
    <v-dialog v-model="dialogBulkImport" persistent width="1200px">
      <v-card rounded="xl">
        <v-toolbar>
          <v-icon class="mr-3">mdi-microsoft-excel</v-icon>
          <v-toolbar-title class="font-weight-light">批量导入</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="dialogBulkImport = false">mdi-close-thick</v-icon>
        </v-toolbar>
        <v-card-text>
          <hot-table
            ref="hotTableImport"
            :settings="hotTableImportSettings"
            :key="refreshKey"
            class="mt-6"
          >
            <hot-column title="型号描述" data="xhms"> </hot-column>
            <hot-column title="规格描述" data="ggms"> </hot-column>
            <hot-column title="单位" data="unitName"> </hot-column>
            <hot-column title="品牌（可不填）" data="brandName"> </hot-column>
          </hot-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded dark color="green" @click="bulkImport()"> 导入 </v-btn>
          <v-btn
            rounded
            dark
            color="blue-grey"
            @click="dialogBulkImport = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 使用可编辑表格批量导出细类下的多个型号和规格 -->
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
            <hot-column title="大类名称" data="bigName"> </hot-column>
            <hot-column title="中类名称" data="middleName"> </hot-column>
            <hot-column title="小类名称" data="smallName"> </hot-column>
            <hot-column title="细类名称" data="thinName"> </hot-column>
            <hot-column title="型号描述" data="xhms"> </hot-column>
            <hot-column title="规格描述" data="ggms"> </hot-column>
            <hot-column title="单位" data="unitName"> </hot-column>
            <hot-column title="品牌（可不填）" data="brandName"> </hot-column>
            <hot-column title="最终代码" data="resultCode"> </hot-column>
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
import pinyin from "pinyin";
import Snackbar from "../components/Snackbar.vue";
import { HotTable, HotColumn } from "@handsontable/vue";
import "handsontable/dist/handsontable.full.css";
import { registerAllModules } from "handsontable/registry";
registerAllModules();
export default {
  components: {
    Snackbar,
    HotTable,
    HotColumn,
  },
  data: () => ({
    // 刷新 hansontable
    refreshKey: 0,
    // 用户
    username: "",
    rating: "",
    // 全局搜素
    searchAll: "",
    searchAllReturnObject: "",
    allFilteredNames: [],
    // 正在展示的大类、中类、小类、细类、型号、规格列表
    showingAllBigCategory: [],
    showingAllMiddleCategory: [],
    showingAllSmallCategory: [],
    showingAllThinCategory: [],
    showingAllXH: [],
    showingAllGG: [],
    // 列表选中时的名称
    bigName: "",
    middleName: "",
    smallName: "",
    thinName: "",
    xhms: "",
    ggms: "",
    // 列表选中时的代号
    bigCode: "",
    middleCode: "",
    smallCode: "",
    thinCode: "",
    xhCode: "",
    ggCode: "",
    // 列表选中时的 id
    bigId: "",
    middleId: "",
    smallId: "",
    thinId: "",
    // 列表选中时的 parentId
    bigParentId: "",
    middleParentId: "",
    smallParentId: "",
    thinParentId: "",
    // 列表选中时的索引
    bigIndex: -1,
    middleIndex: -1,
    smallIndex: -1,
    thinIndex: -1,
    xhIndex: -1,
    ggIndex: -1,
    // 选中的单位
    chooseUnit: {
      unitCode: "13",
      unitName: "件",
    },
    // 所有单位
    allUnit: [],
    // 品牌
    brandName: "",
    // 输入
    inputCategoryName: "",
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
    // 对话框
    dialogBulkImport: false,
    dialogBulkExport: false,
    dialogAddCategory: false,
    dialogUpdateOneMaterial: false,
    dialogUpdateCategoryOrXHOrGG: false,
    dialogDeprecatedCategory: false,
    dialogDeprecatedOneMaterial: false,
    // 暂存列表项和表格项
    tempItem: {},
    tempTableItem: {},
    // 暂存修改名称前的类别项、型号项、规格项、表格项
    tempBeforeUpdateItem: {},
    // 表格
    tableHeaders: [
      {
        text: "大类",
        value: "bigName",
        sortable: false,
        filterable: true,
        align: "center",
      },
      {
        text: "中类",
        value: "middleName",
        sortable: false,
        filterable: true,
        align: "center",
      },
      {
        text: "小类",
        value: "smallName",
        sortable: false,
        filterable: true,
        align: "center",
      },
      {
        text: "细类",
        value: "thinName",
        sortable: false,
        filterable: true,
        align: "center",
      },
      {
        text: "型号",
        value: "xhms",
        sortable: false,
        filterable: true,
        align: "center",
      },
      {
        text: "规格",
        value: "ggms",
        sortable: false,
        filterable: true,
        align: "center",
      },
      {
        text: "型号代号",
        value: "xhCode",
        sortable: false,
        filterable: false,
        align: "center",
      },
      {
        text: "规格代号",
        value: "ggCode",
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
        text: "品牌",
        value: "brandName",
        sortable: false,
        filterable: true,
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
    tableSelected: [],
    tableSearch: "",
    tableAllData: [],
    tableShowAllData: true,
    tableLoading: true,
    tableShowingCategoryOrXHOrGG: "",
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

      // 获取所有大类
      this.$axios({
        method: "post",
        url: "/materialGetCategoryByLevel",
        data: {
          level: 1,
        },
      }).then((res) => {
        this.showingAllBigCategory = res.data;
      });

      // 获取表格的所有数据
      this.$axios({
        method: "get",
        url: "/materialGetTableAllData",
      }).then((res) => {
        this.tableAllData = res.data;
        this.tableLoading = false;
      });
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    // 根据选择的类别找出其下级的所有分类
    async showChildrenList(item) {
      try {
        if (item.level === 1) {
          // 重置表格为加载状态
          this.tableLoading = true;
          // 是否展示所有编码置为否
          this.tableShowAllData = false;
          // 选中的大类的信息
          this.bigName = item.categoryName;
          this.bigCode = item.categoryCode;
          this.bigId = item.id;
          this.bigParentId = item.parentId;
          // 表格左上角提示的选中类别
          this.tableShowingCategoryOrXHOrGG = item.categoryName;
          // 清空列表及其他选中数据
          this.middleName = "";
          this.middleCode = "";
          this.middleId = "";
          this.middleParentId = "";
          this.middleIndex = -1;

          this.smallName = "";
          this.smallCode = "";
          this.smallId = "";
          this.smallParentId = "";
          this.smallIndex = -1;

          this.thinName = "";
          this.thinCode = "";
          this.thinId = "";
          this.thinParentId = "";
          this.thinIndex = -1;

          this.xhms = "";
          this.xhCode = "";
          this.xhIndex = -1;

          this.ggms = "";
          this.ggCode = "";
          this.ggIndex = -1;

          this.showingAllMiddleCategory = [];
          this.showingAllSmallCategory = [];
          this.showingAllThinCategory = [];
          this.showingAllXH = [];
          this.showingAllGG = [];
          // 根据大类 id 找到其下所有中类
          const res = await this.$axios({
            method: "post",
            url: "/materialGetCategoryById",
            data: {
              parentId: item.id,
            },
          });
          this.showingAllMiddleCategory = res.data;
          // 根据选中大类的 id 过滤表格数据
          const res1 = await this.$axios({
            method: "post",
            url: "/materialGetTableDataByCategoryId",
            data: {
              bigId: item.id,
              level: 1,
            },
          });
          this.tableAllData = res1.data;
          this.tableLoading = false;
        } else if (item.level === 2) {
          // 重置表格为加载状态
          this.tableLoading = true;
          // 是否展示所有编码置为否
          this.tableShowAllData = false;
          // 选中的中类的信息
          this.middleName = item.categoryName;
          this.middleCode = item.categoryCode;
          this.middleId = item.id;
          this.middleParentId = item.parentId;
          // 表格左上角提示的选中类别
          this.tableShowingCategoryOrXHOrGG = item.categoryName;
          // 清空列表及其他选中数据
          this.smallName = "";
          this.smallCode = "";
          this.smallId = "";
          this.smallParentId = "";
          this.smallIndex = -1;

          this.thinName = "";
          this.thinCode = "";
          this.thinId = "";
          this.thinParentId = "";
          this.thinIndex = -1;

          this.xhms = "";
          this.xhCode = "";
          this.xhIndex = -1;

          this.ggms = "";
          this.ggCode = "";
          this.ggIndex = -1;

          this.showingAllSmallCategory = [];
          this.showingAllThinCategory = [];
          this.showingAllXH = [];
          this.showingAllGG = [];
          // 根据中类 id 找到其下所有小类
          const res = await this.$axios({
            method: "post",
            url: "/materialGetCategoryById",
            data: {
              parentId: item.id,
            },
          });
          this.showingAllSmallCategory = res.data;
          // 根据选中的中类的 id 过滤表格数据
          const res1 = await this.$axios({
            method: "post",
            url: "/materialGetTableDataByCategoryId",
            data: {
              middleId: item.id,
              level: 2,
            },
          });
          this.tableAllData = res1.data;
          this.tableLoading = false;
        } else if (item.level === 3) {
          // 重置表格为加载状态
          this.tableLoading = true;
          // 是否展示所有编码置为否
          this.tableShowAllData = false;
          // 选中的小类的信息
          this.smallName = item.categoryName;
          this.smallCode = item.categoryCode;
          this.smallId = item.id;
          this.smallParentId = item.parentId;
          // 表格左上角提示的选中类别
          this.tableShowingCategoryOrXHOrGG = item.categoryName;
          // 清空列表及其他选中数据
          this.thinName = "";
          this.thinCode = "";
          this.thinId = "";
          this.thinParentId = "";
          this.thinIndex = -1;

          this.xhms = "";
          this.xhCode = "";
          this.xhIndex = -1;

          this.ggms = "";
          this.ggCode = "";
          this.ggIndex = -1;

          this.showingAllThinCategory = [];
          this.showingAllXH = [];
          this.showingAllGG = [];
          // 根据小类 id 找到其下所有细类
          const res = await this.$axios({
            method: "post",
            url: "/materialGetCategoryById",
            data: {
              parentId: item.id,
            },
          });
          this.showingAllThinCategory = res.data;
          // 根据选中的小类的 id 过滤表格数据
          const res1 = await this.$axios({
            method: "post",
            url: "/materialGetTableDataByCategoryId",
            data: {
              smallId: item.id,
              level: 3,
            },
          });
          this.tableAllData = res1.data;
          this.tableLoading = false;
        } else if (item.level === 4) {
          // 重置表格为加载状态
          this.tableLoading = true;
          // 是否展示所有编码置为否
          this.tableShowAllData = false;
          // 选中的细类的信息
          this.thinName = item.categoryName;
          this.thinCode = item.categoryCode;
          this.thinId = item.id;
          this.thinParentId = item.parentId;
          // 表格左上角提示的选中类别
          this.tableShowingCategoryOrXHOrGG = item.categoryName;
          // 清空列表及其他选中数据
          this.xhms = "";
          this.xhCode = "";
          this.xhIndex = -1;

          this.ggms = "";
          this.ggCode = "";
          this.ggIndex = -1;

          this.showingAllXH = [];
          this.showingAllGG = [];
          // 找到该细类下去重后的所有的型号
          const res = await this.$axios({
            method: "post",
            url: "/materialGetRemoveRepeatXH",
            data: {
              thinId: item.id,
            },
          });
          this.showingAllXH = res.data;
          // 根据选中的细类的 id 过滤表格数据
          const res1 = await this.$axios({
            method: "post",
            url: "/materialGetTableDataByCategoryId",
            data: {
              thinId: item.id,
              level: 4,
            },
          });
          this.tableAllData = res1.data;
          this.tableLoading = false;
        } else if (parseInt(item.level) === 5) {
          // 重置表格为加载状态
          this.tableLoading = true;
          // 是否展示所有编码置为否
          this.tableShowAllData = false;
          // 选中的型号的信息
          this.xhms = item.xhms;
          this.xhCode = item.xhCode;
          // 表格左上角提示的选中类别
          this.tableShowingCategoryOrXHOrGG = item.xhms;
          // 清空列表及其他选中数据
          this.ggms = "";
          this.ggCode = "";
          this.ggIndex = -1;

          this.showingAllGG = [];
          // 找到该型号下的所有规格
          const res = await this.$axios({
            method: "post",
            url: "/materialGetGGByXH",
            data: {
              thinId: this.thinId,
              xhCode: this.xhCode,
            },
          });
          this.showingAllGG = res.data;
          // 根据选中的型号过滤表格数据
          const res1 = await this.$axios({
            method: "post",
            url: "/materialGetTableDataByCategoryId",
            data: {
              thinId: this.thinId,
              xhCode: this.xhCode,
              level: 5,
            },
          });
          this.tableAllData = res1.data;
          this.tableLoading = false;
        } else if (parseInt(item.level) === 6) {
          // 重置表格为加载状态
          this.tableLoading = true;
          // 是否展示所有编码置为否
          this.tableShowAllData = false;
          // 选中的规格的信息
          this.ggms = item.ggms;
          this.ggCode = item.ggCode;
          // 表格左上角提示的选中类别
          this.tableShowingCategoryOrXHOrGG = item.ggms;
          // 根据选中的规格过滤表格数据
          const res1 = await this.$axios({
            method: "post",
            url: "/materialGetTableDataByCategoryId",
            data: {
              thinId: this.thinId,
              xhCode: this.xhCode,
              ggCode: this.ggCode,
              level: 6,
            },
          });
          this.tableAllData = res1.data;
          this.tableLoading = false;
        }
      } catch (error) {
        console.log(error);
      }
    },

    // 将输入的类别名称转换成四个字母的代号
    categoryNameToCategoryCode(categoryName) {
      // 输入的类别名称只能包含中文和英文字母，如果包含字符则替换为空字符串
      const removeCharacterCategoryName = categoryName.replace(
        /[^\u4e00-\u9fa5a-zA-Z]/gi,
        ""
      );

      // 调用 pinyin 方法后返回的二维数组，如 ‘李白’ 会返回 [['li'],['bai']]
      const arr = pinyin(removeCharacterCategoryName, { style: "normal" });
      switch (arr.length) {
        // 一个字
        case 1:
          // 如果这个字只有一个字母，则返回这个字母重复四次；如果这个字有多个字母，则返回这个字的首字母+尾字母重复两次
          return (
            arr[0][0].charAt(0) +
            arr[0][0].charAt(arr[0][0].length - 1) +
            arr[0][0].charAt(0) +
            arr[0][0].charAt(arr[0][0].length - 1)
          ).toUpperCase();
        // 二个字
        case 2:
          // 返回第一个字的首尾字母加第二个字的首尾字母，如果其中一个字只有一个字母，也同样满足
          return (
            arr[0][0].charAt(0) +
            arr[0][0].charAt(arr[0][0].length - 1) +
            arr[1][0].charAt(0) +
            arr[1][0].charAt(arr[1][0].length - 1)
          ).toUpperCase();
        // 三个字
        case 3:
          // 返回第一个字的首字母加第二个字的首字母加第三个字的首尾字母，如果第三个字只有一个字母也同样满足
          return (
            arr[0][0].charAt(0) +
            arr[1][0].charAt(0) +
            arr[2][0].charAt(0) +
            arr[2][0].charAt(arr[2][0].length - 1)
          ).toUpperCase();
        // 四个字
        case 4:
          // 返回前四个字的首字母
          return (
            arr[0][0].charAt(0) +
            arr[1][0].charAt(0) +
            arr[2][0].charAt(0) +
            arr[3][0].charAt(0)
          ).toUpperCase();

        case 5:
          // 返回前四个字的首字母
          return (
            arr[0][0].charAt(0) +
            arr[1][0].charAt(0) +
            arr[3][0].charAt(0) +
            arr[4][0].charAt(0)
          ).toUpperCase();

        case 6:
          // 返回前四个字的首字母
          return (
            arr[0][0].charAt(0) +
            arr[2][0].charAt(0) +
            arr[4][0].charAt(0) +
            arr[5][0].charAt(0)
          ).toUpperCase();

        case 7:
          // 返回前四个字的首字母
          return (
            arr[0][0].charAt(0) +
            arr[2][0].charAt(0) +
            arr[4][0].charAt(0) +
            arr[6][0].charAt(0)
          ).toUpperCase();

        case 8:
          // 返回前四个字的首字母
          return (
            arr[1][0].charAt(0) +
            arr[3][0].charAt(0) +
            arr[5][0].charAt(0) +
            arr[7][0].charAt(0)
          ).toUpperCase();
        // 大于四个字
        default:
          // 返回后四个字的首字母
          return (
            arr[2][0].charAt(0) +
            arr[4][0].charAt(0) +
            arr[6][0].charAt(0) +
            arr[8][0].charAt(0)
          ).toUpperCase();
      }
    },

    // 新增类别
    async addCategory() {
      try {
        // 判断新增的类别名称是否在列表中已经存在
        const childrenList = (
          await this.$axios({
            method: "post",
            url: "/materialGetCategoryById",
            data: {
              parentId: this.tempItem.id,
            },
          })
        ).data;
        const tempList = [];
        childrenList.forEach((item) => {
          tempList.push(item.categoryName);
        });
        if (tempList.indexOf(this.inputCategoryName) !== -1) {
          this.$refs.snackbar.snackbarStatus = "error";
          this.$refs.snackbar.snackbarText = `类别【${this.inputCategoryName}】已存在，无法新增（或类别列表本身存在重复）`;
          this.$refs.snackbar.snackbarShow = true;
          return;
        }

        // 将输入的类别名称转换成四个大写字母
        const categoryCode = this.categoryNameToCategoryCode(
          this.inputCategoryName
        );
        // 获取类别表最后一个类别的 id
        const res = await this.$axios({
          method: "get",
          url: "/materialGetLastCategoryId",
        });
        const categoryId = res.data;
        // 新增类别
        await this.$axios({
          method: "post",
          url: "/materialAddCategory",
          data: {
            categoryName: this.inputCategoryName,
            categoryCode: categoryCode,
            level: this.tempItem.level + 1,
            id: categoryId + 1,
            parentId: this.tempItem.id,
            createUser: this.username,
            updateUser: this.username,
          },
        });

        // 根据新增的类别等级，只刷新对应等级的列表，不对表格进行任何操作
        const res1 = await this.$axios({
          method: "post",
          url: "/materialGetCategoryById",
          data: {
            parentId: this.tempItem.id,
          },
        });
        if (this.tempItem.level === 1) {
          this.showingAllMiddleCategory = res1.data;
        } else if (this.tempItem.level === 2) {
          this.showingAllSmallCategory = res1.data;
        } else if (this.tempItem.level === 3) {
          this.showingAllThinCategory = res1.data;
        }

        // 消息条提示
        this.$refs.snackbar.snackbarStatus = "info";
        this.$refs.snackbar.snackbarText = `新增${
          this.tempItem.level === 1
            ? "中类"
            : this.tempItem.level === 2
            ? "小类"
            : "细类"
        }成功`;
        this.$refs.snackbar.snackbarShow = true;
        this.dialogAddCategory = false;
      } catch (error) {
        console.log(error);
      }
    },

    // 仅修改类别名称、型号描述、规格描述
    async updateCategoryOrXHOrGG() {
      try {
        if (
          parseInt(this.tempItem.level) === 2 ||
          parseInt(this.tempItem.level) === 3 ||
          parseInt(this.tempItem.level) === 4
        ) {
          // 修改类别表的类别名称
          await this.$axios({
            method: "post",
            url: "/materialUpdateCategory",
            data: {
              categoryName: this.tempItem.categoryName,
              id: this.tempItem.id,
              updateUser: this.username,
            },
          });
          // 修改基础物料表的类别名称
          await this.$axios({
            method: "post",
            url: "/materialUpdateTable",
            data: {
              categoryName: this.tempItem.categoryName,
              id: this.tempItem.id,
              level: parseInt(this.tempItem.level),
              updateUser: this.username,
            },
          });
          // 新增一条修改类别名称的操作记录
          await this.addOneOperationHistory(
            "material_form",
            "修改类别名称",
            this.username,
            "",
            this.tempBeforeUpdateItem,
            this.tempItem,
            ""
          );
          // 编辑的是哪一级类别，就只刷新这一级的类别列表
          const res = await this.$axios({
            method: "post",
            url: "/materialGetCategoryById",
            data: {
              parentId: this.tempItem.parentId,
            },
          });
          if (this.tempItem.level === 2) {
            this.showingAllMiddleCategory = res.data;
          } else if (this.tempItem.level === 3) {
            this.showingAllSmallCategory = res.data;
          } else if (this.tempItem.level === 4) {
            this.showingAllThinCategory = res.data;
          }
        } else if (parseInt(this.tempItem.level) === 5) {
          // 修改基础物料表的型号描述
          const res = await this.$axios({
            method: "post",
            url: "/materialUpdateTable",
            data: {
              thinId: this.thinId,
              level: parseInt(this.tempItem.level),
              // 修改后的型号描述
              xhms: this.tempItem.xhms,
              // 型号代号在型号描述修改前后不会改变
              xhCode: this.tempItem.xhCode,
              updateUser: this.username,
            },
          });
          if (res.data === "型号描述已存在") {
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = "型号描述已存在";
            this.$refs.snackbar.snackbarShow = true;
            // 直接跳出方法，不执行最后的刷新操作
            return;
          }
          // 新增一条修改型号描述的操作记录
          await this.addOneOperationHistory(
            "material_form",
            "修改型号描述",
            this.username,
            "",
            {
              bigName: this.bigName,
              bigCode: this.bigCode,
              bigId: this.bigId,
              bigParentId: this.bigParentId,
              middleName: this.middleName,
              middleCode: this.middleCode,
              middleId: this.middleId,
              middleParentId: this.middleParentId,
              smallName: this.smallName,
              smallCode: this.smallCode,
              smallId: this.smallId,
              smallParentId: this.smallParentId,
              thinName: this.thinName,
              thinCode: this.thinCode,
              thinId: this.thinId,
              thinParentId: this.thinParentId,
              xhms: this.tempBeforeUpdateItem.xhms,
              xhCode: this.tempBeforeUpdateItem.xhCode,
            },
            {
              bigName: this.bigName,
              bigCode: this.bigCode,
              bigId: this.bigId,
              bigParentId: this.bigParentId,
              middleName: this.middleName,
              middleCode: this.middleCode,
              middleId: this.middleId,
              middleParentId: this.middleParentId,
              smallName: this.smallName,
              smallCode: this.smallCode,
              smallId: this.smallId,
              smallParentId: this.smallParentId,
              thinName: this.thinName,
              thinCode: this.thinCode,
              thinId: this.thinId,
              thinParentId: this.thinParentId,
              xhms: this.tempItem.xhms,
              xhCode: this.tempItem.xhCode,
            },
            ""
          );
          // 型号描述修改成功，则刷新型号描述的列表
          this.showingAllXH = (
            await this.$axios({
              method: "post",
              url: "/materialGetRemoveRepeatXH",
              data: {
                thinId: this.thinId,
              },
            })
          ).data;
        } else if (parseInt(this.tempItem.level) === 6) {
          // 修改基础物料表的规格描述
          const res = await this.$axios({
            method: "post",
            url: "/materialUpdateTable",
            data: {
              thinId: this.thinId,
              level: parseInt(this.tempItem.level),
              xhCode: this.xhCode,
              // 修改后的规格描述
              ggms: this.tempItem.ggms,
              // 规格代号在规格描述修改前后不会改变
              ggCode: this.tempItem.ggCode,
              updateUser: this.username,
            },
          });
          if (res.data === "规格描述已存在") {
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = "规格描述已存在";
            this.$refs.snackbar.snackbarShow = true;
            // 直接跳出方法，不执行最后的刷新操作
            return;
          }
          // 新增一条修改规格描述的操作记录
          await this.addOneOperationHistory(
            "material_form",
            "修改规格描述",
            this.username,
            "",
            {
              bigName: this.bigName,
              bigCode: this.bigCode,
              bigId: this.bigId,
              bigParentId: this.bigParentId,
              middleName: this.middleName,
              middleCode: this.middleCode,
              middleId: this.middleId,
              middleParentId: this.middleParentId,
              smallName: this.smallName,
              smallCode: this.smallCode,
              smallId: this.smallId,
              smallParentId: this.smallParentId,
              thinName: this.thinName,
              thinCode: this.thinCode,
              thinId: this.thinId,
              thinParentId: this.thinParentId,
              xhms: this.xhms,
              xhCode: this.xhCode,
              ggms: this.tempBeforeUpdateItem.ggms,
              ggCode: this.tempBeforeUpdateItem.ggCode,
            },
            {
              bigName: this.bigName,
              bigCode: this.bigCode,
              bigId: this.bigId,
              bigParentId: this.bigParentId,
              middleName: this.middleName,
              middleCode: this.middleCode,
              middleId: this.middleId,
              middleParentId: this.middleParentId,
              smallName: this.smallName,
              smallCode: this.smallCode,
              smallId: this.smallId,
              smallParentId: this.smallParentId,
              thinName: this.thinName,
              thinCode: this.thinCode,
              thinId: this.thinId,
              thinParentId: this.thinParentId,
              xhms: this.xhms,
              xhCode: this.xhCode,
              ggms: this.tempItem.ggms,
              ggCode: this.tempItem.ggCode,
            },
            ""
          );
          // 规格描述修改成功，则刷新规格描述的列表
          this.showingAllGG = (
            await this.$axios({
              method: "post",
              url: "/materialGetGGByXH",
              data: {
                thinId: this.thinId,
                xhCode: this.xhCode,
              },
            })
          ).data;
        }

        // 判断有选中状态的最后一级列表是哪级，表格只展示最后一级列表选中项下的最新编码
        if (this.middleId === "") {
          // 根据选中的大类 id 获取表格数据
          this.tableAllData = (
            await this.$axios({
              method: "post",
              url: "/materialGetTableDataByCategoryId",
              data: {
                bigId: this.bigId,
                level: 1,
              },
            })
          ).data;
        } else if (this.smallId === "") {
          // 根据选中的中类 id 获取表格数据
          this.tableAllData = (
            await this.$axios({
              method: "post",
              url: "/materialGetTableDataByCategoryId",
              data: {
                middleId: this.middleId,
                level: 2,
              },
            })
          ).data;
        } else if (this.thinId === "") {
          // 根据选中的小类 id 获取表格数据
          this.tableAllData = (
            await this.$axios({
              method: "post",
              url: "/materialGetTableDataByCategoryId",
              data: {
                smallId: this.smallId,
                level: 3,
              },
            })
          ).data;
        } else if (this.xhCode === "") {
          // 根据选中的细类 id 获取表格数据
          this.tableAllData = (
            await this.$axios({
              method: "post",
              url: "/materialGetTableDataByCategoryId",
              data: {
                thinId: this.thinId,
                level: 4,
              },
            })
          ).data;
        } else if (this.ggCode === "") {
          // 根据选中的型号获取表格数据
          this.tableAllData = (
            await this.$axios({
              method: "post",
              url: "/materialGetTableDataByCategoryId",
              data: {
                thinId: this.thinId,
                xhCode: this.xhCode,
                level: 5,
              },
            })
          ).data;
        } else if (this.ggCode !== "") {
          // 根据选中的规格获取表格数据
          this.tableAllData = (
            await this.$axios({
              method: "post",
              url: "/materialGetTableDataByCategoryId",
              data: {
                thinId: this.thinId,
                xhCode: this.xhCode,
                ggCode: this.ggCode,
                level: 6,
              },
            })
          ).data;
        }

        this.dialogUpdateCategoryOrXHOrGG = false;
        // 消息条提示
        this.$refs.snackbar.snackbarText = `${
          parseInt(this.tempItem.level) === 2
            ? "类别名称"
            : parseInt(this.tempItem.level) === 3
            ? "类别名称"
            : parseInt(this.tempItem.level) === 4
            ? "类别名称"
            : parseInt(this.tempItem.level) === 5
            ? "型号描述"
            : "规格描述"
        }修改成功，表格已同步修改`;
        this.$refs.snackbar.snackbarStatus = "info";
        this.$refs.snackbar.snackbarShow = true;
      } catch (error) {
        console.log(error);
      }
    },

    // 修改类别名称和类别代号、型号描述和型号代号、规格描述和规格代号、最终代码
    // async updateCategoryOrXHOrGG() {
    //   try {
    //     let categoryCode = "";
    //     // 如果修改的是中小细类的名称，则更新类别表的类别名称和类别代码
    //     if (
    //       parseInt(this.tempItem.level) === 2 ||
    //       parseInt(this.tempItem.level) === 3 ||
    //       parseInt(this.tempItem.level) === 4
    //     ) {
    //       // 将修改后的类别名称转换成四个大写字母
    //       categoryCode = this.categoryNameToCategoryCode(
    //         this.tempItem.categoryName
    //       );
    //       // 修改类别表的类别名称/类别代号
    //       await this.$axios({
    //         method: "post",
    //         url: "/materialUpdateCategory",
    //         data: {
    //           categoryName: this.tempItem.categoryName,
    //           categoryCode: categoryCode,
    //           id: this.tempItem.id,
    //           updateUser: this.username,
    //         },
    //       });
    //       // 更新基础物料表的类别名称/类别代码/最终代码
    //       await this.$axios({
    //         method: "post",
    //         url: "/materialUpdateTable",
    //         data: {
    //           categoryName: this.tempItem.categoryName,
    //           categoryCode: categoryCode,
    //           id: this.tempItem.id,
    //           level: parseInt(this.tempItem.level),
    //           updateUser: this.username,
    //         },
    //       });
    //       // 编辑的是哪一级类别，就只刷新这一级的类别列表
    //       const res1 = await this.$axios({
    //         method: "post",
    //         url: "/materialGetCategoryById",
    //         data: {
    //           parentId: this.tempItem.parentId,
    //         },
    //       });
    //       if (this.tempItem.level === 2) {
    //         this.showingAllMiddleCategory = res1.data;
    //       } else if (this.tempItem.level === 3) {
    //         this.showingAllSmallCategory = res1.data;
    //       } else if (this.tempItem.level === 4) {
    //         this.showingAllThinCategory = res1.data;
    //       }
    //     } else if (parseInt(this.tempItem.level) === 5) {
    //       // 更新基础物料表的型号描述
    //       const res = await this.$axios({
    //         method: "post",
    //         url: "/materialUpdateTable",
    //         data: {
    //           thinId: this.thinId,
    //           level: parseInt(this.tempItem.level),
    //           // 修改后的型号描述
    //           xhms: this.tempItem.xhms,
    //           // 型号代号在型号描述修改前后不会改变
    //           xhCode: this.tempItem.xhCode,
    //           updateUser: this.username,
    //         },
    //       });
    //       if (res.data === "型号描述已存在") {
    //         this.$refs.snackbar.snackbarStatus = "error";
    //         this.$refs.snackbar.snackbarText = "型号描述已存在";
    //         this.$refs.snackbar.snackbarShow = true;
    //         // 直接跳出方法，不执行最后的刷新操作
    //         return;
    //       }
    //       // 型号描述修改成功，则刷新型号描述的列表
    //       const res1 = await this.$axios({
    //         method: "post",
    //         url: "/materialGetRemoveRepeatXH",
    //         data: {
    //           thinId: this.thinId,
    //         },
    //       });
    //       this.showingAllXH = res1.data;
    //     } else if (parseInt(this.tempItem.level) === 6) {
    //       // 更新基础物料表的规格描述
    //       const res = await this.$axios({
    //         method: "post",
    //         url: "/materialUpdateTable",
    //         data: {
    //           thinId: this.thinId,
    //           level: parseInt(this.tempItem.level),
    //           xhCode: this.xhCode,
    //           // 修改后的规格描述
    //           ggms: this.tempItem.ggms,
    //           // 规格代号在规格描述修改前后不会改变
    //           ggCode: this.tempItem.ggCode,
    //           updateUser: this.username,
    //         },
    //       });
    //       if (res.data === "规格描述已存在") {
    //         this.$refs.snackbar.snackbarStatus = "error";
    //         this.$refs.snackbar.snackbarText = "规格描述已存在";
    //         this.$refs.snackbar.snackbarShow = true;
    //         // 直接跳出方法，不执行最后的刷新操作
    //         return;
    //       }
    //       // 规格描述修改成功，则刷新规格描述的列表
    //       const res1 = await this.$axios({
    //         method: "post",
    //         url: "/materialGetGGByXH",
    //         data: {
    //           thinId: this.thinId,
    //           xhCode: this.xhCode,
    //         },
    //       });
    //       this.showingAllGG = res1.data;
    //     }

    //     // 判断有选中状态的最后一级列表是哪级，表格只展示最后一级列表选中项下的最新编码
    //     if (this.middleId === "") {
    //       // 根据选中的大类 id 获取表格数据
    //       const res = await this.$axios({
    //         method: "post",
    //         url: "/materialGetTableDataByCategoryId",
    //         data: {
    //           bigId: this.bigId,
    //           level: 1,
    //         },
    //       });
    //       this.tableAllData = res.data;
    //     } else if (this.smallId === "") {
    //       // 根据选中的中类 id 获取表格数据
    //       const res = await this.$axios({
    //         method: "post",
    //         url: "/materialGetTableDataByCategoryId",
    //         data: {
    //           middleId: this.middleId,
    //           level: 2,
    //         },
    //       });
    //       this.tableAllData = res.data;
    //     } else if (this.thinId === "") {
    //       // 根据选中的小类 id 获取表格数据
    //       const res = await this.$axios({
    //         method: "post",
    //         url: "/materialGetTableDataByCategoryId",
    //         data: {
    //           smallId: this.smallId,
    //           level: 3,
    //         },
    //       });
    //       this.tableAllData = res.data;
    //     } else if (this.xhCode === "") {
    //       // 根据选中的细类 id 获取表格数据
    //       const res = await this.$axios({
    //         method: "post",
    //         url: "/materialGetTableDataByCategoryId",
    //         data: {
    //           thinId: this.thinId,
    //           level: 4,
    //         },
    //       });
    //       this.tableAllData = res.data;
    //     } else if (this.ggCode === "") {
    //       // 根据选中的型号获取表格数据
    //       const res = await this.$axios({
    //         method: "post",
    //         url: "/materialGetTableDataByCategoryId",
    //         data: {
    //           thinId: this.thinId,
    //           xhCode: this.xhCode,
    //           level: 5,
    //         },
    //       });
    //       this.tableAllData = res.data;
    //     } else if (this.ggCode !== "") {
    //       // 根据选中的规格获取表格数据
    //       const res = await this.$axios({
    //         method: "post",
    //         url: "/materialGetTableDataByCategoryId",
    //         data: {
    //           thinId: this.thinId,
    //           xhCode: this.xhCode,
    //           ggCode: this.ggCode,
    //           level: 6,
    //         },
    //       });
    //       this.tableAllData = res.data;
    //     }

    //     this.dialogUpdateCategoryOrXHOrGG = false;
    //     // 消息条提示
    //     this.$refs.snackbar.snackbarText = `${
    //       parseInt(this.tempItem.level) === 2
    //         ? "类别名称"
    //         : parseInt(this.tempItem.level) === 3
    //         ? "类别名称"
    //         : parseInt(this.tempItem.level) === 4
    //         ? "类别名称"
    //         : parseInt(this.tempItem.level) === 5
    //         ? "型号描述"
    //         : "规格描述"
    //     }修改成功，表格已同步修改`;
    //     this.$refs.snackbar.snackbarStatus = "info";
    //     this.$refs.snackbar.snackbarShow = true;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    // 点击全局搜索后的某一项后
    async afterClickSearchItem() {
      if (this.searchAll) {
        if (this.searchAll.length >= 2) {
          if (this.searchAllReturnObject.level === 1) {
            // 重置表格为加载状态
            this.tableLoading = true;
            // 是否展示所有编码置为否
            this.tableShowAllData = false;

            // 选中的大类的信息
            this.bigName = this.searchAllReturnObject.bigName;
            this.bigCode = this.searchAllReturnObject.bigCode;
            this.bigId = this.searchAllReturnObject.bigId;
            this.bigParentId = this.searchAllReturnObject.bigParentId;
            this.showingAllBigCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.bigId) {
                this.bigIndex = index;
              }
            });

            // 表格左上角提示的选中类别
            this.tableShowingCategoryOrXHOrGG =
              this.searchAllReturnObject.bigName;

            // 清空列表及其他选中数据
            this.middleName = "";
            this.middleCode = "";
            this.middleId = "";
            this.middleParentId = "";
            this.middleIndex = -1;
            this.smallName = "";
            this.smallCode = "";
            this.smallId = "";
            this.smallParentId = "";
            this.smallIndex = -1;
            this.thinName = "";
            this.thinCode = "";
            this.thinId = "";
            this.thinParentId = "";
            this.thinIndex = -1;
            this.xhms = "";
            this.xhCode = "";
            this.xhIndex = -1;
            this.ggms = "";
            this.ggCode = "";
            this.ggIndex = -1;
            this.showingAllMiddleCategory = [];
            this.showingAllSmallCategory = [];
            this.showingAllThinCategory = [];
            this.showingAllXH = [];
            this.showingAllGG = [];

            // 根据大类 id 找到其下所有中类
            this.showingAllMiddleCategory = (
              await this.$axios({
                method: "post",
                url: "/materialGetCategoryById",
                data: {
                  parentId: this.searchAllReturnObject.bigId,
                },
              })
            ).data;

            // 根据选中大类的 id 过滤表格数据
            this.tableAllData = (
              await this.$axios({
                method: "post",
                url: "/materialGetTableDataByCategoryId",
                data: {
                  bigId: this.searchAllReturnObject.bigId,
                  level: 1,
                },
              })
            ).data;
            this.tableLoading = false;
          } else if (this.searchAllReturnObject.level === 2) {
            // 重置表格为加载状态
            this.tableLoading = true;
            // 是否展示所有编码置为否
            this.tableShowAllData = false;

            // 选中的大类的信息
            this.bigName = this.searchAllReturnObject.bigName;
            this.bigCode = this.searchAllReturnObject.bigCode;
            this.bigId = this.searchAllReturnObject.bigId;
            this.bigParentId = this.searchAllReturnObject.bigParentId;
            this.showingAllBigCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.bigId) {
                this.bigIndex = index;
              }
            });

            // 选中的中类的信息
            this.middleName = this.searchAllReturnObject.middleName;
            this.middleCode = this.searchAllReturnObject.middleCode;
            this.middleId = this.searchAllReturnObject.middleId;
            this.middleParentId = this.searchAllReturnObject.middleParentId;
            // 获取最新的中类列表
            // 1、防止一开始不选择任何类别，就直接全局搜索，此时 showingAllMiddleCategory 为空
            // 2、防止其他人新增中类后，全局搜索点击别人新增的中类时，showingAllMiddleCategory 仍然是之前点击大类时获取的旧的中类列表，导致 showingAllMiddleCategory 中找不到别人新增的中类
            this.showingAllMiddleCategory = (
              await this.$axios({
                method: "post",
                url: "/materialGetCategoryById",
                data: {
                  parentId: this.searchAllReturnObject.bigId,
                },
              })
            ).data;
            this.showingAllMiddleCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.middleId) {
                this.middleIndex = index;
              }
            });

            // 表格左上角提示的选中类别
            this.tableShowingCategoryOrXHOrGG =
              this.searchAllReturnObject.middleName;

            // 清空列表及其他选中数据
            this.smallName = "";
            this.smallCode = "";
            this.smallId = "";
            this.smallParentId = "";
            this.smallIndex = -1;
            this.thinName = "";
            this.thinCode = "";
            this.thinId = "";
            this.thinParentId = "";
            this.thinIndex = -1;
            this.xhms = "";
            this.xhCode = "";
            this.xhIndex = -1;
            this.ggms = "";
            this.ggCode = "";
            this.ggIndex = -1;
            this.showingAllSmallCategory = [];
            this.showingAllThinCategory = [];
            this.showingAllXH = [];
            this.showingAllGG = [];

            // 根据中类 id 找到其下所有小类
            this.showingAllSmallCategory = (
              await this.$axios({
                method: "post",
                url: "/materialGetCategoryById",
                data: {
                  parentId: this.searchAllReturnObject.middleId,
                },
              })
            ).data;

            // 根据选中的中类的 id 过滤表格数据
            this.tableAllData = (
              await this.$axios({
                method: "post",
                url: "/materialGetTableDataByCategoryId",
                data: {
                  middleId: this.searchAllReturnObject.middleId,
                  level: 2,
                },
              })
            ).data;
            this.tableLoading = false;
          } else if (this.searchAllReturnObject.level === 3) {
            // 重置表格为加载状态
            this.tableLoading = true;
            // 是否展示所有编码置为否
            this.tableShowAllData = false;

            // 选中的大类的信息
            this.bigName = this.searchAllReturnObject.bigName;
            this.bigCode = this.searchAllReturnObject.bigCode;
            this.bigId = this.searchAllReturnObject.bigId;
            this.bigParentId = this.searchAllReturnObject.bigParentId;
            this.showingAllBigCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.bigId) {
                this.bigIndex = index;
              }
            });

            // 选中的中类的信息
            this.middleName = this.searchAllReturnObject.middleName;
            this.middleCode = this.searchAllReturnObject.middleCode;
            this.middleId = this.searchAllReturnObject.middleId;
            this.middleParentId = this.searchAllReturnObject.middleParentId;
            // 获取最新的中类列表
            this.showingAllMiddleCategory = (
              await this.$axios({
                method: "post",
                url: "/materialGetCategoryById",
                data: {
                  parentId: this.searchAllReturnObject.bigId,
                },
              })
            ).data;
            this.showingAllMiddleCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.middleId) {
                this.middleIndex = index;
              }
            });

            // 选中的小类信息
            this.smallName = this.searchAllReturnObject.smallName;
            this.smallCode = this.searchAllReturnObject.smallCode;
            this.smallId = this.searchAllReturnObject.smallId;
            this.smallParentId = this.searchAllReturnObject.smallParentId;
            // 获取最新的小类列表
            this.showingAllSmallCategory = (
              await this.$axios({
                method: "post",
                url: "/materialGetCategoryById",
                data: {
                  parentId: this.searchAllReturnObject.middleId,
                },
              })
            ).data;
            this.showingAllSmallCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.smallId) {
                this.smallIndex = index;
              }
            });

            // 表格左上角提示的选中类别
            this.tableShowingCategoryOrXHOrGG =
              this.searchAllReturnObject.smallName;

            // 清空列表及其他选中数据
            this.thinName = "";
            this.thinCode = "";
            this.thinId = "";
            this.thinParentId = "";
            this.thinIndex = -1;
            this.xhms = "";
            this.xhCode = "";
            this.xhIndex = -1;
            this.ggms = "";
            this.ggCode = "";
            this.ggIndex = -1;
            this.showingAllThinCategory = [];
            this.showingAllXH = [];
            this.showingAllGG = [];

            // 根据小类 id 找到其下所有细类
            this.showingAllThinCategory = (
              await this.$axios({
                method: "post",
                url: "/materialGetCategoryById",
                data: {
                  parentId: this.searchAllReturnObject.smallId,
                },
              })
            ).data;

            // 根据选中的小类的 id 过滤表格数据
            this.tableAllData = (
              await this.$axios({
                method: "post",
                url: "/materialGetTableDataByCategoryId",
                data: {
                  smallId: this.searchAllReturnObject.smallId,
                  level: 3,
                },
              })
            ).data;
            this.tableLoading = false;
          } else if (this.searchAllReturnObject.level === 4) {
            // 重置表格为加载状态
            this.tableLoading = true;
            // 是否展示所有编码置为否
            this.tableShowAllData = false;

            // 选中的大类的信息
            this.bigName = this.searchAllReturnObject.bigName;
            this.bigCode = this.searchAllReturnObject.bigCode;
            this.bigId = this.searchAllReturnObject.bigId;
            this.bigParentId = this.searchAllReturnObject.bigParentId;
            this.showingAllBigCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.bigId) {
                this.bigIndex = index;
              }
            });

            // 选中的中类的信息
            this.middleName = this.searchAllReturnObject.middleName;
            this.middleCode = this.searchAllReturnObject.middleCode;
            this.middleId = this.searchAllReturnObject.middleId;
            this.middleParentId = this.searchAllReturnObject.middleParentId;
            // 获取最新的中类列表
            this.showingAllMiddleCategory = (
              await this.$axios({
                method: "post",
                url: "/materialGetCategoryById",
                data: {
                  parentId: this.searchAllReturnObject.bigId,
                },
              })
            ).data;
            this.showingAllMiddleCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.middleId) {
                this.middleIndex = index;
              }
            });

            // 选中的小类信息
            this.smallName = this.searchAllReturnObject.smallName;
            this.smallCode = this.searchAllReturnObject.smallCode;
            this.smallId = this.searchAllReturnObject.smallId;
            this.smallParentId = this.searchAllReturnObject.smallParentId;
            // 获取最新的小类列表
            this.showingAllSmallCategory = (
              await this.$axios({
                method: "post",
                url: "/materialGetCategoryById",
                data: {
                  parentId: this.searchAllReturnObject.middleId,
                },
              })
            ).data;
            this.showingAllSmallCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.smallId) {
                this.smallIndex = index;
              }
            });

            // 选中的细类信息
            this.thinName = this.searchAllReturnObject.thinName;
            this.thinCode = this.searchAllReturnObject.thinCode;
            this.thinId = this.searchAllReturnObject.thinId;
            this.thinParentId = this.searchAllReturnObject.thinParentId;
            // 获取最新的细类列表
            this.showingAllThinCategory = (
              await this.$axios({
                method: "post",
                url: "/materialGetCategoryById",
                data: {
                  parentId: this.searchAllReturnObject.smallId,
                },
              })
            ).data;
            this.showingAllThinCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.thinId) {
                this.thinIndex = index;
              }
            });

            // 表格左上角提示的选中类别
            this.tableShowingCategoryOrXHOrGG =
              this.searchAllReturnObject.thinName;

            // 清空列表及其他选中数据
            this.xhms = "";
            this.xhCode = "";
            this.xhIndex = -1;
            this.ggms = "";
            this.ggCode = "";
            this.ggIndex = -1;
            this.showingAllXH = [];
            this.showingAllGG = [];

            // 根据细类 id 找到其下所有型号
            this.showingAllXH = (
              await this.$axios({
                method: "post",
                url: "/materialGetRemoveRepeatXH",
                data: {
                  thinId: this.searchAllReturnObject.thinId,
                },
              })
            ).data;

            // 根据选中的细类的 id 过滤表格数据
            this.tableAllData = (
              await this.$axios({
                method: "post",
                url: "/materialGetTableDataByCategoryId",
                data: {
                  thinId: this.searchAllReturnObject.thinId,
                  level: 4,
                },
              })
            ).data;
            this.tableLoading = false;
          } else if (parseInt(this.searchAllReturnObject.level) === 5) {
            // 重置表格为加载状态
            this.tableLoading = true;
            // 是否展示所有编码置为否
            this.tableShowAllData = false;

            // 选中的大类的信息
            this.bigName = this.searchAllReturnObject.bigName;
            this.bigCode = this.searchAllReturnObject.bigCode;
            this.bigId = this.searchAllReturnObject.bigId;
            this.bigParentId = this.searchAllReturnObject.bigParentId;
            this.showingAllBigCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.bigId) {
                this.bigIndex = index;
              }
            });

            // 选中的中类的信息
            this.middleName = this.searchAllReturnObject.middleName;
            this.middleCode = this.searchAllReturnObject.middleCode;
            this.middleId = this.searchAllReturnObject.middleId;
            this.middleParentId = this.searchAllReturnObject.middleParentId;
            // 获取最新的中类列表
            this.showingAllMiddleCategory = (
              await this.$axios({
                method: "post",
                url: "/materialGetCategoryById",
                data: {
                  parentId: this.searchAllReturnObject.bigId,
                },
              })
            ).data;
            this.showingAllMiddleCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.middleId) {
                this.middleIndex = index;
              }
            });

            // 选中的小类信息
            this.smallName = this.searchAllReturnObject.smallName;
            this.smallCode = this.searchAllReturnObject.smallCode;
            this.smallId = this.searchAllReturnObject.smallId;
            this.smallParentId = this.searchAllReturnObject.smallParentId;
            // 获取最新的小类列表
            this.showingAllSmallCategory = (
              await this.$axios({
                method: "post",
                url: "/materialGetCategoryById",
                data: {
                  parentId: this.searchAllReturnObject.middleId,
                },
              })
            ).data;
            this.showingAllSmallCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.smallId) {
                this.smallIndex = index;
              }
            });

            // 选中的细类信息
            this.thinName = this.searchAllReturnObject.thinName;
            this.thinCode = this.searchAllReturnObject.thinCode;
            this.thinId = this.searchAllReturnObject.thinId;
            this.thinParentId = this.searchAllReturnObject.thinParentId;
            // 获取最新的细类列表
            this.showingAllThinCategory = (
              await this.$axios({
                method: "post",
                url: "/materialGetCategoryById",
                data: {
                  parentId: this.searchAllReturnObject.smallId,
                },
              })
            ).data;
            this.showingAllThinCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.thinId) {
                this.thinIndex = index;
              }
            });

            // 选中的型号信息
            this.xhms = this.searchAllReturnObject.xhms;
            this.xhCode = this.searchAllReturnObject.xhCode;
            // 获取最新的型号列表
            this.showingAllXH = (
              await this.$axios({
                method: "post",
                url: "/materialGetRemoveRepeatXH",
                data: {
                  thinId: this.searchAllReturnObject.thinId,
                },
              })
            ).data;
            this.showingAllXH.forEach((item, index, arr) => {
              if (item.xhCode === this.searchAllReturnObject.xhCode) {
                this.xhIndex = index;
              }
            });

            // 表格左上角提示的选中类别
            this.tableShowingCategoryOrXHOrGG = this.searchAllReturnObject.xhms;

            // 清空列表及其他选中数据
            this.ggms = "";
            this.ggCode = "";
            this.ggIndex = -1;
            this.showingAllGG = [];

            // 找到该型号下的所有规格
            this.showingAllGG = (
              await this.$axios({
                method: "post",
                url: "/materialGetGGByXH",
                data: {
                  thinId: this.searchAllReturnObject.thinId,
                  xhCode: this.searchAllReturnObject.xhCode,
                },
              })
            ).data;

            // 根据选中的型号过滤表格数据
            this.tableAllData = (
              await this.$axios({
                method: "post",
                url: "/materialGetTableDataByCategoryId",
                data: {
                  thinId: this.searchAllReturnObject.thinId,
                  xhCode: this.searchAllReturnObject.xhCode,
                  level: 5,
                },
              })
            ).data;

            this.tableLoading = false;
          } else if (parseInt(this.searchAllReturnObject.level) === 6) {
            // 重置表格为加载状态
            this.tableLoading = true;
            // 是否展示所有编码置为否
            this.tableShowAllData = false;

            // 选中的大类的信息
            this.bigName = this.searchAllReturnObject.bigName;
            this.bigCode = this.searchAllReturnObject.bigCode;
            this.bigId = this.searchAllReturnObject.bigId;
            this.bigParentId = this.searchAllReturnObject.bigParentId;
            this.showingAllBigCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.bigId) {
                this.bigIndex = index;
              }
            });

            // 选中的中类的信息
            this.middleName = this.searchAllReturnObject.middleName;
            this.middleCode = this.searchAllReturnObject.middleCode;
            this.middleId = this.searchAllReturnObject.middleId;
            this.middleParentId = this.searchAllReturnObject.middleParentId;
            // 获取最新的中类列表
            this.showingAllMiddleCategory = (
              await this.$axios({
                method: "post",
                url: "/materialGetCategoryById",
                data: {
                  parentId: this.searchAllReturnObject.bigId,
                },
              })
            ).data;
            this.showingAllMiddleCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.middleId) {
                this.middleIndex = index;
              }
            });

            // 选中的小类的信息
            this.smallName = this.searchAllReturnObject.smallName;
            this.smallCode = this.searchAllReturnObject.smallCode;
            this.smallId = this.searchAllReturnObject.smallId;
            this.smallParentId = this.searchAllReturnObject.smallParentId;
            // 获取最新的小类列表
            this.showingAllSmallCategory = (
              await this.$axios({
                method: "post",
                url: "/materialGetCategoryById",
                data: {
                  parentId: this.searchAllReturnObject.middleId,
                },
              })
            ).data;
            this.showingAllSmallCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.smallId) {
                this.smallIndex = index;
              }
            });

            // 选中的细类的信息
            this.thinName = this.searchAllReturnObject.thinName;
            this.thinCode = this.searchAllReturnObject.thinCode;
            this.thinId = this.searchAllReturnObject.thinId;
            this.thinParentId = this.searchAllReturnObject.thinParentId;
            // 获取最新的细类列表
            this.showingAllThinCategory = (
              await this.$axios({
                method: "post",
                url: "/materialGetCategoryById",
                data: {
                  parentId: this.searchAllReturnObject.smallId,
                },
              })
            ).data;
            this.showingAllThinCategory.forEach((item, index, arr) => {
              if (item.id === this.searchAllReturnObject.thinId) {
                this.thinIndex = index;
              }
            });

            // 选中的型号信息
            this.xhms = this.searchAllReturnObject.xhms;
            this.xhCode = this.searchAllReturnObject.xhCode;
            // 获取最新的型号列表
            this.showingAllXH = (
              await this.$axios({
                method: "post",
                url: "/materialGetRemoveRepeatXH",
                data: {
                  thinId: this.searchAllReturnObject.thinId,
                },
              })
            ).data;
            this.showingAllXH.forEach((item, index, arr) => {
              if (item.xhCode === this.searchAllReturnObject.xhCode) {
                this.xhIndex = index;
              }
            });

            // 选中的规格信息
            this.ggms = this.searchAllReturnObject.ggms;
            this.ggCode = this.searchAllReturnObject.ggCode;
            // 获取最新的规格列表
            this.showingAllGG = (
              await this.$axios({
                method: "post",
                url: "/materialGetGGByXH",
                data: {
                  thinId: this.searchAllReturnObject.thinId,
                  xhCode: this.searchAllReturnObject.xhCode,
                },
              })
            ).data;
            this.showingAllGG.forEach((item, index, arr) => {
              if (item.ggCode === this.searchAllReturnObject.ggCode) {
                this.ggIndex = index;
              }
            });

            // 表格左上角提示的选中类别
            this.tableShowingCategoryOrXHOrGG = this.searchAllReturnObject.ggms;

            // 根据选中的规格过滤表格数据
            this.tableAllData = (
              await this.$axios({
                method: "post",
                url: "/materialGetTableDataByCategoryId",
                data: {
                  thinId: this.searchAllReturnObject.thinId,
                  xhCode: this.searchAllReturnObject.xhCode,
                  ggCode: this.searchAllReturnObject.ggCode,
                  level: 6,
                },
              })
            ).data;

            this.tableLoading = false;
          }
        }
      }
    },

    // 修改表格中的品牌和单位
    async updateOneMaterial() {
      try {
        // 通过单位名称找到单位代号
        this.allUnit.forEach((item, index, arr) => {
          if (item.unitName === this.tempTableItem.unitName) {
            this.tempTableItem.unitCode = item.unitCode;
          }
        });
        // 修改
        await this.$axios({
          method: "post",
          url: "/materialUpdateOne",
          data: {
            _id: this.tempTableItem._id,
            unitName: this.tempTableItem.unitName,
            unitCode: this.tempTableItem.unitCode,
            brandName: this.tempTableItem.brandName,
            updateUser: this.username,
          },
        });
        // 新增一条修改的操作记录
        this.addOneOperationHistory(
          "material_form",
          "修改品牌单位",
          this.username,
          "",
          this.tempBeforeUpdateItem,
          this.tempTableItem,
          ""
        );
        // 判断有选中状态的最后一级列表是哪级，表格只展示最后一级列表选中项下的最新编码
        if (this.bigId === "") {
          // 获取表格的所有数据
          this.tableAllData = (
            await this.$axios({
              method: "get",
              url: "/materialGetTableAllData",
            })
          ).data;
        } else if (this.middleId === "") {
          // 根据选中的大类 id 获取表格数据
          this.tableAllData = (
            await this.$axios({
              method: "post",
              url: "/materialGetTableDataByCategoryId",
              data: {
                bigId: this.bigId,
                level: 1,
              },
            })
          ).data;
        } else if (this.smallId === "") {
          // 根据选中的中类 id 获取表格数据
          this.tableAllData = (
            await this.$axios({
              method: "post",
              url: "/materialGetTableDataByCategoryId",
              data: {
                middleId: this.middleId,
                level: 2,
              },
            })
          ).data;
        } else if (this.thinId === "") {
          // 根据选中的小类 id 获取表格数据
          this.tableAllData = (
            await this.$axios({
              method: "post",
              url: "/materialGetTableDataByCategoryId",
              data: {
                smallId: this.smallId,
                level: 3,
              },
            })
          ).data;
        } else if (this.xhCode === "") {
          // 根据选中的细类 id 获取表格数据
          this.tableAllData = (
            await this.$axios({
              method: "post",
              url: "/materialGetTableDataByCategoryId",
              data: {
                thinId: this.thinId,
                level: 4,
              },
            })
          ).data;
        } else if (this.ggCode === "") {
          // 根据选中的型号获取表格数据
          this.tableAllData = (
            await this.$axios({
              method: "post",
              url: "/materialGetTableDataByCategoryId",
              data: {
                thinId: this.thinId,
                xhCode: this.xhCode,
                level: 5,
              },
            })
          ).data;
        } else if (this.ggCode !== "") {
          // 根据选中的规格获取表格数据
          this.tableAllData = (
            await this.$axios({
              method: "post",
              url: "/materialGetTableDataByCategoryId",
              data: {
                thinId: this.thinId,
                xhCode: this.xhCode,
                ggCode: this.ggCode,
                level: 6,
              },
            })
          ).data;
        }

        this.dialogUpdateOneMaterial = false;
        this.$refs.snackbar.snackbarStatus = "info";
        this.$refs.snackbar.snackbarText = "修改成功";
        this.$refs.snackbar.snackbarShow = true;
      } catch (error) {
        console.log(error);
      }
    },

    // 删除中小细类时，废弃该类别下所有的子类别，同时废弃该类别下的所有编码
    async deprecatedCategory() {
      try {
        // 新增一条废弃分类的操作记录，必须调用在正式废弃分类前
        await this.addOneOperationHistory(
          "category_form、material_form",
          "废弃分类、子分类、表格编码",
          this.username,
          "",
          "",
          "",
          { id: this.tempItem.id, level: this.tempItem.level }
        );
        // 正式废弃分类
        await this.$axios({
          method: "post",
          url: "/materialDeprecatedCategory",
          data: {
            id: this.tempItem.id,
            level: this.tempItem.level,
          },
        });

        this.dialogDeprecatedCategory = false;
        this.$refs.snackbar.snackbarStatus = "info";
        this.$refs.snackbar.snackbarText = "废弃分类成功";
        this.$refs.snackbar.snackbarShow = true;
        this.tableShowAllData = true;
      } catch (error) {
        console.log(error);
      }
    },

    // 废弃单个编码
    async deprecatedOneMaterial() {
      try {
        await this.$axios({
          method: "post",
          url: "/materialDeprecatedOne",
          data: {
            resultCode: this.tempTableItem.resultCode,
            deprecatedUser: this.username,
          },
        });
        // 在是否展示全部编码按钮打开的情况下，废弃单个编码，也同样刷新表格数据
        this.tableShowAllData = false;
        setTimeout(() => {
          this.tableShowAllData = true;

          // 新增一条删除的操作记录
          this.addOneOperationHistory(
            "material_form",
            "废弃表格编码",
            this.username,
            this.tempTableItem,
            "",
            "",
            ""
          );

          this.dialogDeprecatedOneMaterial = false;
          this.$refs.snackbar.snackbarStatus = "info";
          this.$refs.snackbar.snackbarText = "废弃编码成功";
          this.$refs.snackbar.snackbarShow = true;
        }, 50);
      } catch (error) {
        console.log(error);
      }
    },

    // 新增编码
    async addOneMaterial() {
      try {
        // 保证大中小细类的选中项和输入的型号规格不能为空
        if (
          !this.bigCode ||
          !this.middleCode ||
          !this.smallCode ||
          !this.thinCode ||
          !this.xhms ||
          !this.ggms
        ) {
          this.$refs.snackbar.snackbarStatus = "error";
          this.$refs.snackbar.snackbarText =
            "请确保大/中/小/细类必须选中，且输入的型号/规格不能为空";
          this.$refs.snackbar.snackbarShow = true;
        } else {
          // 新增单个编码
          const res = await this.$axios({
            method: "post",
            url: "/materialAddOne",
            data: {
              bigName: this.bigName,
              bigCode: this.bigCode,
              bigId: this.bigId,
              bigParentId: this.bigParentId,
              middleName: this.middleName,
              middleCode: this.middleCode,
              middleId: this.middleId,
              middleParentId: this.middleParentId,
              smallName: this.smallName,
              smallCode: this.smallCode,
              smallId: this.smallId,
              smallParentId: this.smallParentId,
              thinName: this.thinName,
              thinCode: this.thinCode,
              thinId: this.thinId,
              thinParentId: this.thinParentId,
              xhms: this.xhms,
              ggms: this.ggms,
              unitName: this.chooseUnit.unitName,
              unitCode: this.chooseUnit.unitCode,
              brandName: this.brandName,
              createUser: this.username,
            },
          });
          if (res.data === "此规格型号的编码已经存在") {
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText =
              "此规格型号的编码已经存在，或已被删除过";
            this.$refs.snackbar.snackbarShow = true;
          } else {
            // 刷新型号/规格列表
            // 开启进度条
            this.tableLoading = true;
            // 表格左上角提示的选中的细类
            this.tableShowingCategoryOrXHOrGG = this.thinName;
            // 清空列表及其他选中数据
            this.xhms = "";
            this.xhCode = "";
            this.xhIndex = -1;

            this.ggms = "";
            this.ggCode = "";
            this.ggIndex = -1;

            this.showingAllXH = [];
            this.showingAllGG = [];
            // 找到该细类下去重后的所有的型号
            this.showingAllXH = (
              await this.$axios({
                method: "post",
                url: "/materialGetRemoveRepeatXH",
                data: {
                  thinId: this.thinId,
                },
              })
            ).data;
            // 根据选中的细类的 id 过滤表格数据
            this.tableAllData = (
              await this.$axios({
                method: "post",
                url: "/materialGetTableDataByCategoryId",
                data: {
                  thinId: this.thinId,
                  level: 4,
                },
              })
            ).data;
            // 关闭进度条
            this.tableLoading = false;
            // 将刚刚添加的最终物料码复制到粘贴板
            this.$copyText(res.data);
            this.$refs.snackbar.snackbarStatus = "info";
            this.$refs.snackbar.snackbarText =
              "已新增一条编码，并将其复制到粘贴板";
            this.$refs.snackbar.snackbarShow = true;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    // 批量导入之前
    beforeBulkImport() {
      if (!this.thinCode) {
        this.$refs.snackbar.snackbarStatus = "error";
        this.$refs.snackbar.snackbarText = "批量导入前，大/中/小/细类必须选中";
        this.$refs.snackbar.snackbarShow = true;
      } else {
        // 打开对话框前清空数据
        this.hotTableImportSettings.data = [];

        // 打开对话框前刷新 handsontable，否则清空数据失败，仍然会保留上一次的导入数据
        this.refreshKey++;

        // 打开对话框
        this.dialogBulkImport = true;

        // 打开对话框之后，必须进行一次延迟重渲染，否则表格宽度只会展示一半
        setTimeout(() => {
          this.refreshKey++;
        }, 1000);
      }
    },

    // 批量导入
    async bulkImport() {
      try {
        // 获取所有数据
        const allData = this.hotTableImportSettings.data;

        // 校验通过的数据
        const filterAllData = [];

        // 校验是否通过
        let validFlag = true;
        allData.forEach((item, index, arr) => {
          if (!item.xhms && item.ggms && item.unitName) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，型号描述不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (item.xhms && !item.ggms && item.unitName) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，规格描述不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (item.xhms && item.ggms && !item.unitName) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，单位不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (!item.xhms && !item.ggms && item.unitName) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，型号描述、规格描述不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (!item.xhms && item.ggms && !item.unitName) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，型号描述、单位不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (item.xhms && !item.ggms && !item.unitName) {
            validFlag = false;
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = `请检查第${
              index + 1
            }行，规格描述、单位不能为空`;
            this.$refs.snackbar.snackbarShow = true;
          } else if (item.xhms && item.ggms && item.unitName) {
            // 单位是否能在定义的所有单位中找到，如果能找到，则将单位代号赋予到第四列
            let findFlag = false;
            this.allUnit.forEach((item1, index1, arr1) => {
              if (item1.unitName === item.unitName) {
                findFlag = true;
                item.unitCode = item1.unitCode;
                // 如果品牌列什么都不填，那么 brandName=undefined，会导致 brandName 属性被省略，需要赋予默认值空字符串
                if (!item.brandName) {
                  item.brandName = "";
                }
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
        });

        // 如果校验成功
        if (validFlag) {
          // 循环添加编码
          for (let i = 0; i < filterAllData.length; i++) {
            await this.$axios({
              method: "post",
              url: "/materialAddOne",
              data: {
                bigName: this.bigName,
                bigCode: this.bigCode,
                bigId: this.bigId,
                bigParentId: this.bigParentId,
                middleName: this.middleName,
                middleCode: this.middleCode,
                middleId: this.middleId,
                middleParentId: this.middleParentId,
                smallName: this.smallName,
                smallCode: this.smallCode,
                smallId: this.smallId,
                smallParentId: this.smallParentId,
                thinName: this.thinName,
                thinCode: this.thinCode,
                thinId: this.thinId,
                thinParentId: this.thinParentId,
                xhms: filterAllData[i].xhms,
                ggms: filterAllData[i].ggms,
                unitName: filterAllData[i].unitName,
                unitCode: filterAllData[i].unitCode,
                brandName: filterAllData[i].brandName,
                createUser: this.username,
              },
            });
          }

          // 刷新型号/规格列表
          // 开启进度条
          this.tableLoading = true;
          // 表格左上角提示的选中的细类
          this.tableShowingCategoryOrXHOrGG = this.thinName;
          // 清空列表及其他选中数据
          this.xhms = "";
          this.xhCode = "";
          this.xhIndex = -1;

          this.ggms = "";
          this.ggCode = "";
          this.ggIndex = -1;

          this.showingAllXH = [];
          this.showingAllGG = [];
          // 找到该细类下去重后的所有的型号
          this.showingAllXH = (
            await this.$axios({
              method: "post",
              url: "/materialGetRemoveRepeatXH",
              data: {
                thinId: this.thinId,
              },
            })
          ).data;
          // 根据选中的细类的 id 过滤表格数据
          this.tableAllData = (
            await this.$axios({
              method: "post",
              url: "/materialGetTableDataByCategoryId",
              data: {
                thinId: this.thinId,
                level: 4,
              },
            })
          ).data;
          // 关闭对话框
          this.dialogBulkImport = false;
          // 关闭进度条
          this.tableLoading = false;
          this.$refs.snackbar.snackbarStatus = "info";
          this.$refs.snackbar.snackbarText = "已自动去除重复，批量导入完成";
          this.$refs.snackbar.snackbarShow = true;
        }
      } catch (error) {
        console.log(error);
      }
    },

    // 批量导出之前
    async beforeBulkExport(type) {
      try {
        if (type === "导出某细类下的所有型号规格") {
          if (!this.thinCode) {
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText =
              "批量导出前，大/中/小/细类必须选中";
            this.$refs.snackbar.snackbarShow = true;
          } else {
            // 打开对话框给前赋值数据
            this.hotTableExportSettings.data = (
              await this.$axios({
                method: "post",
                url: "/materialGetTableDataByCategoryId",
                data: {
                  thinId: this.thinId,
                  level: 4,
                },
              })
            ).data;

            // 打开对话框前刷新 handsontable，否则对话框永远只展示第一次打开时的数据
            this.refreshKey++;

            // 打开对话框
            this.dialogBulkExport = true;

            // 打开对话框前刷新 handsontable，否则表格宽度只会展示一半
            setTimeout(() => {
              this.refreshKey++;
            }, 4000);
          }
        } else if (type === "导出表格中的数据") {
          this.hotTableExportSettings.data = JSON.parse(
            JSON.stringify(this.tableSelected)
          );

          // 打开对话框前刷新 handsontable，否则对话框永远只展示第一次打开时的数据
          this.refreshKey++;

          // 打开对话框
          this.dialogBulkExport = true;

          // 打开对话框前刷新 handsontable，否则表格宽度只会展示一半
          setTimeout(() => {
            this.refreshKey++;
          }, 4000);
        }
      } catch (error) {
        console.log(error);
      }
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

    // 新增一条删除或修改的操作记录
    async addOneOperationHistory(
      operationForm,
      operationType,
      operationUser,
      deprecatedData,
      updateBeforeData,
      updateAfterData,
      queryParam
    ) {
      try {
        await this.$axios({
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

    // 复制输入框中的内容
    copyText(text) {
      this.$copyText(text);
      this.$refs.snackbar.snackbarStatus = "info";
      this.$refs.snackbar.snackbarText = "复制成功";
      this.$refs.snackbar.snackbarShow = true;
    },
  },

  computed: {
    // 拼接后的类别
    joinCategoryName() {
      return `${this.bigName}-${this.middleName}-${this.smallName}-${this.thinName}`;
    },
  },

  watch: {
    // 监测是否展示所有编码的按钮
    async tableShowAllData() {
      try {
        if (this.tableShowAllData) {
          // 重置表格为加载状态
          this.tableLoading = true;
          // 获取表格的所有数据
          this.tableAllData = (
            await this.$axios({
              method: "get",
              url: "/materialGetTableAllData",
            })
          ).data;

          // 重置所有编码
          this.tableShowingCategoryOrXHOrGG = "所有编码";
          this.tableLoading = false;

          // 清空选中数据
          this.bigName = "";
          this.bigCode = "";
          this.bigId = "";
          this.bigParentId = "";
          this.bigIndex = -1;

          this.middleName = "";
          this.middleCode = "";
          this.middleId = "";
          this.middleParentId = "";
          this.middleIndex = -1;

          this.smallName = "";
          this.smallCode = "";
          this.smallId = "";
          this.smallParentId = "";
          this.smallIndex = -1;

          this.thinName = "";
          this.thinCode = "";
          this.thinId = "";
          this.thinParentId = "";
          this.thinIndex = -1;

          this.xhms = "";
          this.xhCode = "";
          this.xhIndex = -1;

          this.ggms = "";
          this.ggCode = "";
          this.ggIndex = -1;

          this.showingAllMiddleCategory = [];
          this.showingAllSmallCategory = [];
          this.showingAllThinCategory = [];
          this.showingAllXH = [];
          this.showingAllGG = [];

          // 全局搜索的输入清除
          this.searchAll = "";

          // 获取所有大类
          this.showingAllBigCategory = (
            await this.$axios({
              method: "post",
              url: "/materialGetCategoryByLevel",
              data: {
                level: 1,
              },
            })
          ).data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 全局搜索
    async searchAll() {
      try {
        if (this.searchAll) {
          if (this.searchAll.length >= 2) {
            this.allFilteredNames = (
              await this.$axios({
                method: "post",
                url: "/materialGlobalSearch",
                data: {
                  searchAll: this.searchAll,
                },
              })
            ).data;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
