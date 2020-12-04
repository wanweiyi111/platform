<template>
  <section class="full_page" :style="{height:height+'px'}">
    <div id="map_box" class="map_box"></div>
    <div v-show="false">
      <DeviceInfoWindow ref="hoverDevice" :device="hoverDevice"></DeviceInfoWindow>
    </div>
  </section>
</template>

<script >
import mapApi from "@/libs/MapApi.js";
import DeviceInfoWindow from "@/components/Map/DeviceInfoWindow";
import MapMixin from "@/mixins/map.js";

// import mapCtrl from "@/utils/mapCtrl.js";
// import lightsIcon from "@/assets/images/lights.svg";
// const lightsIcon = require("../assets/images/lights.svg");

export default {
  mixins: [MapMixin],
  components: {
    DeviceInfoWindow,
  },
  data() {
    return {
      hoverDevice: {},
    };
  },
  props: {
    title: String,
    height: Number,
  },
  mounted() {
    mapApi.init("map_box");
  },
  methods: {
    pointHover(e) {
      console.log(e);
    },
    pointClick(e) {
      console.log(e);
    },
  },
};
</script>

<style scoped lang="less">
.full_page {
  width: 100%;
  height: 100%;
}
.map_box {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style >