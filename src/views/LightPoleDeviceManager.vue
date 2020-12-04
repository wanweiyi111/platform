<template>
  <div class="CameraView">
    <DeviceManager />
  </div>
</template>

<script>
import DeviceManager from "@/components/LightPole/NewDeviceManager.vue";
export default {
  components: {
    DeviceManager,
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
  top: 65px;
}
</style>
