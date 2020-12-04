<template>
  <div class="RightMenu">
    <Box title="安防监控" type="RightMenu">11</Box>
  </div>
</template>

<script>
import Box from "@/components/Box.vue"; // @ is an alias to /src
// import Api from "@/api/";

export default {
  name: "RightMenu",
  components: {
    Box
  },
  created() {}
};
</script>
<style lang="less" scoped>
.RightMenu {
  width: 351px;
  height: 250px;
  position: absolute;
  top: 50%;
  margin-top: -125px;
  right: 25px;
}
</style>

