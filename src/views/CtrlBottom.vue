<template>
  <div class="CameraView">
    <Map />
    <TopBar />
    <CameraCtrl />
  </div>
</template>

<script>
import CameraCtrl from "@/components/DevicCamare"; // @ is an alias to /src
import Map from "@/components/Map/Map.vue"; // @ is an alias to /src
import TopBar from "@/components/TopBar.vue"; // @ is an alias to /src
export default {
  components: {
    CameraCtrl,
    Map,
    TopBar
  },
  created() {}
};
</script>
<style lang="less" scoped>
.ant-select-dropdown {
  z-index: 99999999;
}
.CameraView {
  height: 100%;
  position: relative;
}
</style>
>
