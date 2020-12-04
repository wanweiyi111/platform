<template>
  <a-row>
    <a-col :span="24">
      <div class="playVideo">
        <Video
          :id="id"
          :videoHeight='275'
          :videoInfo="{no:'videoOne',token:curDevice.strToken,host:curDevice.serverName}"
        />
      </div>
    </a-col>
  </a-row>
</template>

<script>
import Video from "@/components/common/SimpleVideo.vue";

export default {
  components: {
    Video,
  },
  props: {
    curDevice: Object,
    id: String,
  },
  data() {
    return {
      videoInfo: {
        no: "videoOne",
        token: this.curDevice && this.curDevice.strToken,
        host: this.curDevice && this.curDevice.serverName,
        selected: false,
      },
    };
  },
  watch: {
    videoInfo: {
      deep: true,
      // immediate: true, // 这句重要
      handler(val) {
        this.videoInfo = {
          no: "videoOne",
          token: val && val.strToken,
          host: val && val.serverName,
          selected: false,
        };
      },
    },
  },
  created() {
    console.log("视频");
  },
  computed: {},
  methods: {},
};
</script>

<style lang="less">
.OneVideoInfo.acol {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 531px;
  color: #ddfdff;
  font-size: 14px;
  // width: 100%;
  // height: 100%;
  .toCtrl {
    color: #98feff;
    float: right;
  }
  .ctrl-panel {
    padding: 0 14px;
    width: 100%;
    height: 100%;
  }
  .playVideo {
    width: 100%;
    height: 300px;
    margin: 20px 0;
  }
  .videoInfo {
    word-break: break-all;
  }
  .acol8 {
    margin-bottom: 10px;
    .gray {
      display: inline-block;
      width: 40%;
      color: #bacee4;
      margin-right: 14px;
      text-align: right;
    }
    .text {
      display: inline-block;
      width: calc(50% - 14px);
    }
  }
}
</style>
