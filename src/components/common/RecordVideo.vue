<template>
  <div
    class="Video"
    :style="{height:videoHeight+'px'}"
  >
    <!---<canvas :id="id"></canvas>-->
    <video
      class="h5video"
      :id="id"
      autoplay="autoplay"
      muted="muted"
      webkit-playsinline
      playsinline
    ></video>
    <!-- <div class="playBtn" v-show="this.isPlay">
      <i class="iconfont iconcaret-circle-right"></i>
    </div>-->
  </div>
</template>

<script>
import "animate.css";
import JsLoader from "@/libs/JsLoader.js";
import { H5sPlayerRecordCreate } from "@/libs/h5splayerhelper.js";
import _ from "lodash";

export default {
  props: {
    id: String,
    videoHeight: {
      type: Number,
      default: 209,
    },
    videoInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      presetList: [],
      presetShow: "out",
      equipmentCode: this.$route.query.id,
      speedVal: 1,
      isPlay: true,
      player: "",
      v1: null,
      conf: {},
      preVal: "",
      recordConf: {},
      turnCtrlShow: false,
    };
  },
  created() {},
  mounted() {
    this.initLive(this.videoInfo);
  },
  beforeDestroy() {
    this.v1 && this.v1.disconnect();
    delete this.v1;
    this.v1 = undefined;
  },
  watch: {
    videoInfo: {
      deep: true,
      immediate: true, // 这句重要
      handler(val) {
        this.initLive(val);
      },
    },
  },
  methods: {
    initLive(val) {
      console.log("获取值", val);
      if (this.v1 != undefined) {
        this.v1.disconnect();
        delete this.v1;
        this.v1 = undefined;
      }
      if (!_.isEmpty(val)) {
        this.recordConf = {
          begintime: val.strStartTime, //{string} begintime 0 for fileplayback
          endtime: val.strEndTime, //{string} endtime 0 for fileplayback
          autoplay: "true", // 'true' or 'false' for playback autoplay
          showposter: "true", //'true' or 'false' show poster
          serverpb: "true", //'true' or 'false' playback from h5stream record, default false
          filename: val.filename, // file name need to playback (begintime == 0 & endtime == 0 and serverpb is true)
        };
        this.conf = {
          videoid: this.id,
          protocol: window.location.protocol, //http: or https:
          host: val.host, //localhost:8080
          rootpath: "/", // '/' or window.location.pathname
          token: val.token,
          hlsver: "v1", //v1 is for ts, v2 is for fmp4
          pbconf: this.recordConf,
          consolelog: "false",
          // session: "c1782caf-b670-42d8-ba90-2244d0b0ee83" //session got from login
        };

        this.v1 = H5sPlayerRecordCreate(this.conf);
        this.v1.connect();
      }
    },
  },
  destroyed() {
    // this.v1 = null;
    this.v1.disconnect();
    delete this.v1;
    this.v1 = null;
    console.log("销毁");
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.Video {
  width: 100%;
  height: 100%;
  position: relative;
  .playBtn {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -20px;
    margin-left: -20px;
    font-size: 40px;
    cursor: pointer;
  }
  video {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
}
// }
</style>
