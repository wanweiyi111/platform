<template>
  <a-row class="Demand">
    <a-col :span="17">
      <LeftVideo id="warnningVideo" :videoUrl="videoUrl" />
    </a-col>
    <a-col :span="7">
      <RightCtrl />
    </a-col>
  </a-row>
</template>

<script>
import LeftVideo from "../Live/LeftVideo";
import RightCtrl from "./RightCtrl.vue";
export default {
  components: {
    LeftVideo,
    RightCtrl
  },
  props: {
    type: String
  },
  data() {
    return {
      videoUrl: "rtmp://localhost:1935/live/"
    };
  },
  created() {},
  computed: {},
  methods: {}
};
</script>

<style lang="less">
</style>
