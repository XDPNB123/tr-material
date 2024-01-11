<template>
  <v-img :src="require('../assets/login.jpg')" height="100vh">
    <div class="d-flex justify-center align-center" style="height: 100%">
      <v-card
        width="600px"
        class="pa-6"
        elevation="1"
        outlined
        rounded="xl"
        style="opacity: 0.9"
      >
        <v-card-text>
          <v-tabs v-model="tab" grow>
            <v-tab>登录</v-tab>
            <v-tab>注册</v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab" class="pt-12">
            <v-tab-item>
              <v-form v-model="validLogin" ref="formValidLogin">
                <v-text-field
                  v-model="workId"
                  rounded
                  filled
                  label="请输入工号"
                  :rules="[notNullRule, onlyNumRule]"
                  @keydown.enter="login()"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  rounded
                  filled
                  label="请输入密码"
                  :rules="[notNullRule]"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  @keydown.enter="login()"
                ></v-text-field>

                <div class="d-flex justify-end">
                  <v-btn
                    rounded
                    dark
                    color="red"
                    x-large
                    class="mr-3"
                    @click="$refs.formValidLogin.reset()"
                    >清除</v-btn
                  >
                  <v-btn rounded dark color="green" x-large @click="login()"
                    >登入</v-btn
                  >
                </div>
              </v-form>
            </v-tab-item>
            <v-tab-item>
              <v-form v-model="validRegister" ref="formValidRegister">
                <v-text-field
                  v-model="workId"
                  rounded
                  filled
                  label="请输入工号"
                  :rules="[notNullRule, onlyNumRule]"
                  @keydown.enter="register()"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  rounded
                  filled
                  label="请输入密码"
                  :rules="[notNullRule]"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  @keydown.enter="register()"
                ></v-text-field>

                <v-text-field
                  v-model="username"
                  rounded
                  filled
                  label="请输入姓名"
                  :rules="[notNullRule]"
                  @keydown.enter="register()"
                ></v-text-field>

                <div class="d-flex justify-end">
                  <v-btn
                    rounded
                    dark
                    color="red"
                    x-large
                    class="mr-3"
                    @click="$refs.formValidRegister.reset()"
                    >清除</v-btn
                  >
                  <v-btn rounded dark color="green" x-large @click="register()"
                    >注册</v-btn
                  >
                </div>
              </v-form>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </div>
    <Snackbar ref="snackbar"></Snackbar>
  </v-img>
</template>
<script>
import Snackbar from "../components/Snackbar.vue";
export default {
  components: { Snackbar },
  data: () => ({
    tab: "",
    // 校验
    validLogin: false,
    validRegister: false,
    // 用户信息
    workId: "",
    password: "",
    username: "",
    // 密码是否明文展示
    showPassword: false,
    // 输入规则
    notNullRule: (v) => {
      return !!v || "不能为空";
    },
    onlyNumRule: (v) => {
      return /^\d+$/.test(v) || "只能为数字";
    },
  }),

  methods: {
    // 注册
    async register() {
      try {
        const res = await this.$axios({
          method: "post",
          url: "/userValidRepeat",
          data: { workId: this.workId },
        });
        if (res.data === "注册成功待审批") {
          await this.$axios({
            method: "post",
            url: "/userAdd",
            data: {
              workId: this.workId,
              password: this.password,
              username: this.username,
            },
          });
          this.$refs.snackbar.snackbarStatus = "info";
          this.$refs.snackbar.snackbarText = "注册成功待审批";
          this.$refs.snackbar.snackbarShow = true;
        } else if (res.data === "工号已存在") {
          this.$refs.snackbar.snackbarStatus = "error";
          this.$refs.snackbar.snackbarText = "工号已存在";
          this.$refs.snackbar.snackbarShow = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 登录
    async login() {
      const res = await this.$axios({
        method: "post",
        url: "/userLogin",
        data: {
          workId: this.workId,
          password: this.password,
        },
      });
      if (res.data === "登入成功") {
        const res_ = await this.$axios({
          method: "post",
          url: "/userGetInfo",
          data: {
            workId: this.workId,
          },
        });
        this.$refs.snackbar.snackbarStatus = "info";
        this.$refs.snackbar.snackbarText = "登入成功";
        this.$refs.snackbar.snackbarShow = true;
        // 储存用户信息
        localStorage.setItem("username", res_.data[0].username);
        localStorage.setItem("workId", res_.data[0].workId);
        localStorage.setItem("rating", res_.data[0].rating);
        // 延迟跳转
        setTimeout(() => {
          this.$router.push("/index");
        }, 1500);
      } else if (res.data === "登入失败") {
        this.$refs.snackbar.snackbarStatus = "error";
        this.$refs.snackbar.snackbarText = "账号待审批/工号不存在/密码错误";
        this.$refs.snackbar.snackbarShow = true;
      }
    },
  },
};
</script>
