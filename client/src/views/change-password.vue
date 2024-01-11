<template>
  <v-img :src="require('../assets/change-password.jpg')" height="100vh">
    <!-- v-img 内层隐藏了一个宽高为 v-img 的 div，如果直接在 v-img 上写 d-flex justify-center align-center 那么作用的是这个隐藏的 div 而不是 v-card -->
    <v-btn rounded text x-large @click="$router.back(1)"
      ><v-icon class="mr-2">mdi-arrow-left</v-icon>返回</v-btn
    >
    <div class="d-flex justify-center align-center" style="height: 100%">
      <v-card
        width="600px"
        class="pa-6"
        outlined
        elevation="1"
        rounded="xl"
        style="opacity: 0.9"
      >
        <v-card-text>
          <div class="text-h5 text-center blue--text font-weight-bold pb-10">
            修改密码
          </div>

          <v-form v-model="validUpdatePassword" ref="formValidUpdatePassword">
            <v-text-field
              v-model="oldPassword"
              rounded
              filled
              label="请输入旧密码"
              :rules="notNullRule"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              :type="showPassword ? 'text' : 'password'"
            ></v-text-field>

            <v-text-field
              v-model="newPassword"
              rounded
              filled
              label="请输入新密码"
              :rules="notNullRule"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              :type="showPassword ? 'text' : 'password'"
            ></v-text-field>
          </v-form>
          <div class="d-flex justify-end">
            <v-btn
              class="mr-3"
              color="red"
              rounded
              dark
              large
              @click="$refs.formValidUpdatePassword.reset()"
              >清空</v-btn
            >
            <v-btn
              class="mr-3"
              color="green"
              rounded
              dark
              large
              @click="updatePassword()"
              >修改</v-btn
            >
          </div>
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
    // 用户信息
    username: "",
    workId: "",
    rating: "",
    // 密码
    oldPassword: "",
    newPassword: "",
    showPassword: "",
    // 校验
    validUpdatePassword: false,
    notNullRule: [
      (v) => {
        return !!v || "不能为空";
      },
    ],
  }),
  created() {
    // 获取用户信息
    this.username = localStorage.getItem("username");
    this.workId = localStorage.getItem("workId");
    this.rating = localStorage.getItem("rating");
  },
  methods: {
    async updatePassword() {
      try {
        if (this.validUpdatePassword === true) {
          // 校验旧密码
          const res = await this.$axios({
            method: "post",
            url: "/userValidOldPassword",
            data: {
              workId: this.workId,
              oldPassword: this.oldPassword,
            },
          });
          if (res.data === "校验成功") {
            // 修改密码
            await this.$axios({
              method: "post",
              url: "/userUpdateOldPassword",
              data: {
                workId: this.workId,
                newPassword: this.newPassword,
              },
            });
            this.$refs.snackbar.snackbarStatus = "info";
            this.$refs.snackbar.snackbarText = "密码已修改";
            this.$refs.snackbar.snackbarShow = true;
            // 延迟进入
            setTimeout(() => {
              this.$router.push("/index");
            }, 1500);
          } else {
            this.$refs.snackbar.snackbarStatus = "error";
            this.$refs.snackbar.snackbarText = "旧密码错误";
            this.$refs.snackbar.snackbarShow = true;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
