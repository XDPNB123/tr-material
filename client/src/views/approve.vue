<template>
  <div>
    <v-row class="mx-8 mb-8">
      <v-col cols="12" v-if="allUnapprovedUsers.length > 0">
        <div class="text-h4 text-center blue--text font-weight-bold my-6">
          注册申请
        </div>
      </v-col>

      <v-col v-for="(item, index) in allUnapprovedUsers" :key="index" cols="2">
        <v-card outlined rounded="xl">
          <div class="text-center py-8">
            <v-avatar v-if="(index + 1) % 2 === 1" size="164">
              <img src="../assets/avatar1.png" alt="XDP" />
            </v-avatar>
            <v-avatar v-else size="164">
              <img src="../assets/avatar2.png" alt="XDP" />
            </v-avatar>
          </div>
          <div>
            <div class="py-3 mx-4">
              <v-icon class> mdi-account </v-icon>
              <span class="text-caption ms-3">姓名：{{ item.username }}</span>
            </div>
            <v-divider></v-divider>
            <div class="py-3 mx-4">
              <v-icon class> mdi-eye </v-icon>
              <span class="text-caption ms-3">密码：******</span>
            </div>
            <v-divider></v-divider>
            <div class="py-3 mx-4">
              <v-icon>mdi-identifier</v-icon>
              <span class="text-caption ms-3">工号：{{ item.workId }}</span>
            </div>
            <v-divider></v-divider>
            <div class="py-3 mx-4">
              <v-select
                filled
                rounded
                hide-details
                prefix="权限："
                :items="allRating"
                item-text="ratingName"
                item-value="ratingValue"
                v-model="item.rating"
              ></v-select>
            </div>
            <v-divider></v-divider>
          </div>
          <div class="mx-4 py-3">
            <v-btn rounded block color="primary" @click="approveOK(item)">
              审批通过
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12">
        <div class="text-h4 text-center blue--text font-weight-bold mt-16">
          权限更改
        </div>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="4" offset="4">
            <v-text-field
              filled
              rounded
              label="根据姓名搜索"
              append-icon="mdi-magnify"
              v-model="searchName"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>

      <v-col v-for="(item, index) in allApprovedUsers" :key="index" cols="2">
        <v-card rounded="xl" outlined>
          <div class="text-center py-8">
            <v-avatar v-if="(index + 1) % 2 === 1" size="164">
              <img src="../assets/avatar1.png" alt="XDP" />
            </v-avatar>
            <v-avatar v-else size="164">
              <img src="../assets/avatar2.png" alt="XDP" />
            </v-avatar>
          </div>
          <div>
            <div class="py-3 mx-4">
              <v-icon class> mdi-account </v-icon>
              <span class="text-caption ms-3">姓名：{{ item.username }}</span>
            </div>
            <v-divider></v-divider>
            <div class="py-3 mx-4">
              <v-icon>mdi-identifier</v-icon>
              <span class="text-caption ms-3">工号：{{ item.workId }}</span>
            </div>
            <v-divider></v-divider>
            <div class="py-3 mx-4">
              <v-select
                filled
                rounded
                hide-details
                prefix="权限："
                :items="allRating"
                item-text="ratingName"
                item-value="ratingValue"
                v-model="item.rating"
              ></v-select>
            </div>
            <v-divider></v-divider>
          </div>
          <div class="mx-4 py-3">
            <v-btn rounded block color="primary" @click="updateRating(item)">
              确认修改
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <Snackbar ref="snackbar"></Snackbar>
  </div>
</template>

<script>
import Snackbar from "../components/Snackbar.vue";
export default {
  components: { Snackbar },
  data: () => ({
    // 搜索名称
    searchName: "",
    // 所有未审批用户
    allUnapprovedUsers: [],
    // 所有审批完成的用户
    allApprovedUsers: [],
    // 暂存所有审批完成的用户
    tempAllApprovedUsers: [],
    // 权限等级
    allRating: [
      { ratingName: "查看", ratingValue: 1 },
      { ratingName: "查看/新增", ratingValue: 2 },
      { ratingName: "查看/新增/仅修改成套外购", ratingValue: 2.5 },
      { ratingName: "查看/新增/修改", ratingValue: 3 },
      { ratingName: "查看/新增/修改/删除", ratingValue: 4 },
      { ratingName: "查看/新增/修改/删除/审批", ratingValue: 5 },
    ],
  }),

  async created() {
    this.allUnapprovedUsers = (
      await this.$axios({
        method: "get",
        url: "/userGetAllUnapproved",
      })
    ).data;
    this.allApprovedUsers = (
      await this.$axios({
        method: "get",
        url: "/userGetAllApproved",
      })
    ).data;
    this.tempAllApprovedUsers = JSON.parse(
      JSON.stringify(this.allApprovedUsers)
    );
  },

  methods: {
    // 注册审批通过
    async approveOK(item) {
      try {
        // 审批通过
        await this.$axios({
          method: "post",
          url: "/userApprovedOK",
          data: {
            _id: item._id,
            rating: item.rating,
          },
        });

        // 刷新
        this.allUnapprovedUsers = (
          await this.$axios({
            method: "get",
            url: "/userGetAllUnapproved",
          })
        ).data;
        this.allApprovedUsers = (
          await this.$axios({
            method: "get",
            url: "/userGetAllApproved",
          })
        ).data;
        this.tempAllApprovedUsers = JSON.parse(
          JSON.stringify(this.allApprovedUsers)
        );

        this.$refs.snackbar.snackbarStatus = "info";
        this.$refs.snackbar.snackbarText = "已审批通过";
        this.$refs.snackbar.snackbarShow = true;
      } catch (error) {
        console.log(error);
      }
    },

    // 修改权限
    async updateRating(item) {
      try {
        // 修改
        await this.$axios({
          method: "post",
          url: "/userUpdateRating",
          data: {
            _id: item._id,
            rating: item.rating,
          },
        });

        // 刷新
        this.allApprovedUsers = (
          await this.$axios({
            method: "get",
            url: "/userGetAllApproved",
          })
        ).data;
        this.tempAllApprovedUsers = JSON.parse(
          JSON.stringify(this.allApprovedUsers)
        );
        this.$refs.snackbar.snackbarStatus = "info";
        this.$refs.snackbar.snackbarText = "已更新权限";
        this.$refs.snackbar.snackbarShow = true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    searchName() {
      // 让allUsers回到初始状态
      this.allApprovedUsers = JSON.parse(
        JSON.stringify(this.tempAllApprovedUsers)
      );
      const result = [];
      this.allApprovedUsers.forEach((item, index, arr) => {
        if (item.username.includes(this.searchName)) {
          result.push(item);
        }
      });
      this.allApprovedUsers = JSON.parse(JSON.stringify(result));
    },
  },
};
</script>
