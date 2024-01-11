<template>
  <div>
    <v-app-bar
      absolute
      color="blue darken-2"
      height="30px"
      dark
      shrink-on-scroll
    >
      <v-app-bar-title
        style="position: absolute; top: 40px; right: 43%"
        class="text-h4"
        >同日物料编码系统</v-app-bar-title
      >

      <v-spacer></v-spacer>

      <div class="text-center mr-3 mt-4">
        <div>
          <v-menu open-on-hover top offset-y rounded="xl">
            <template v-slot:activator="{ on, attrs }">
              <v-icon x-large dark v-bind="attrs" v-on="on">
                mdi-account-circle
              </v-icon>
            </template>
            <v-card class="text-center">
              <v-avatar size="100px" class="mx-14 mt-4">
                <img src="../assets/avatar1.png" />
              </v-avatar>
              <p class="text-h6">{{ username }}</p>
              <v-list rounded>
                <v-list-item-group>
                  <v-divider class="mb-2"></v-divider>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-shield-account</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>权限{{ role }}</v-list-item-content>
                  </v-list-item>
                  <v-divider class="mb-2"></v-divider>
                  <v-list-item @click="$router.push('/changePassword')">
                    <v-list-item-icon>
                      <v-icon>mdi-lock-reset</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>修改密码</v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-menu>
        </div>
        <div class="text-subtitle-1">{{ username }}</div>
      </div>

      <div class="text-center mr-2 mt-4" @click="dialogLogout = true">
        <div>
          <v-icon x-large dark> mdi-close-circle </v-icon>
        </div>
        <div class="text-subtitle-1">退出</div>
      </div>

      <!-- v-app-bar 的拓展插槽 -->
      <template v-slot:extension>
        <v-tabs v-model="tab" align-with-title>
          <v-tab v-for="(pageName, index) in pageNames" :key="index">
            {{ pageName }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-tabs-items v-model="tab" style="margin-top: 180px">
      <v-tab-item v-for="(page, index) in pages" :key="index">
        <component :is="page"></component>
      </v-tab-item>
    </v-tabs-items>

    <!-- 退出登录对话框 -->
    <v-dialog v-model="dialogLogout" persistent width="500px">
      <v-card rounded="xl">
        <v-toolbar>
          <v-icon class="mr-3">mdi-logout-variant</v-icon>
          <v-toolbar-title class="font-weight-light">退出登录</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="dialogLogout = false">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text>
          <div class="text-h6 text-center mt-6">您确认要退出吗？</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn rounded block dark color="red lighten-1" @click="exit()">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Material from "../views/material.vue";
import Equipment from "../views/equipment.vue";
import HomeMade from "../views/homemade.vue";
import Approve from "../views/approve.vue";
export default {
  components: { Material, Equipment, HomeMade, Approve },
  data() {
    return {
      // 用户
      username: "",
      rating: "",
      role: "",
      //
      dialogLogout: false,
      tab: null,
      pageNames: ["基础外购件", "成套外购件", "自制件", "注册审批/权限更改"],
      pages: ["Material", "Equipment", "HomeMade", "Approve"],
    };
  },
  // localStorage 里面没有检测到用户信息，则跳转到登录
  beforeCreate: function () {
    if (!localStorage.getItem("workId")) {
      this.$router.push("/login");
    }
  },
  created: function () {
    // 权限判断
    this.username = localStorage.getItem("username");
    this.rating = Number(localStorage.getItem("rating"));
    // 角色判断
    switch (this.rating) {
      case 1:
        this.role = "【查询】";
        break;
      case 2:
        this.role = "【查询】【新增】";
        break;
      case 2.5:
        this.role = "【查询】【新增】【仅修改成套外购】";
        break;
      case 3:
        this.role = "【查询】【新增】【修改】";
        break;
      case 4:
        this.role = "【查询】【新增】【修改】【删除】";
        break;
      case 5:
        this.role = "【查询】【新增】【修改】【删除】【审批】";
        break;
    }
    // 权限等级小于 5 则不能看到注册审批/权限修改页面
    if (this.rating < 5) {
      this.pages.splice(3, 1);
      this.pageNames.splice(3, 1);
    }
  },

  methods: {
    // 退出登录
    exit() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>
