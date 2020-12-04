<template>
  <LightPole />
</template>

<script>
import LightPole from "@/components/LightPole/index.vue";
export default {
  components: {
    LightPole,
  },
  created() {},
};
</script>
<style lang="less" scoped>
.ant-select-dropdown {
  z-index: 99999999;
}
.CameraView {
  // height: 100%;
  position: relative;
}
</style>
