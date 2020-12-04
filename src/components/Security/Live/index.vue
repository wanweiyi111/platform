<template>
  <a-row class="LeftVideo">
    <a-col :span="17">
      <LeftVideo id="liveVideo" :videoUrl="videoUrl" />
    </a-col>
    <a-col :span="7">
      <RightCtrl />
    </a-col>
  </a-row>
</template>

<script>
import LeftVideo from "./LeftVideo.vue";
import RightCtrl from "./RightCtrl.vue";
export default {
  components: {
    LeftVideo,
    RightCtrl
  },
  props: {},
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
