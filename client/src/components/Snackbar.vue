<template>
  <div>
    <v-snackbar
      rounded="xl"
      v-model="snackbarShow"
      top
      :color="snackbarStatus"
      width="100%"
      :timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>
<script>
export default {
  data: () => ({
    snackbarShow: false,
    snackbarText: "",
    snackbarStatus: "",
  }),
};
</script>
