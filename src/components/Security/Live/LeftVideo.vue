<template>
  <div class="LeftVideo">
    <a-row
      class="video"
      ref="video1"
      id="video1"
    >
      <a-col
        :span="widthNum"
        v-for="(item,index) in videoInfo"
        v-bind:key="index"
        :style="videoStyle"
      >
        <Video
          :videoInfo="item"
          :getSelectVideoNo="getSelectVideoNo"
        />
      </a-col>
    </a-row>
    <div class="ctrBar">
      <div class="left">
        <span class="videoNum itemAction">
          <i
            class="iconfont"
            @click="setVideoNum(1)"
          >1</i>
          <i
            class="iconfont"
            @click="setVideoNum(4)"
          >4</i>
          <i
            class="iconfont"
            @click="setVideoNum(9)"
          >9</i>
          <i
            class="iconfont"
            @click="setVideoNum(16)"
          >16</i>
        </span>
      </div>
      <!-- <div class="right">
        <i class="iconfont iconcaret-circle-right"></i>
        <i class="iconfont iconbell"></i>
        <i class="iconfont iconcog"></i>
      </div> -->
    </div>
  </div>
</template>

<script>
import Video from "@/components/common/Video.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Video,
  },
  props: {
    videoUrl: String,
    id: String,
  },
  data() {
    return {
      boxH: 0,
      videoNum: 1,
      videoStyle: { height: "100%" },
      widthNum: 24,
      videoInfo: [],
      selectVideoNo: "",
    };
  },
  watch: {
    getSelectVideo(value) {
      // this.videoInfo[this.selectVideoNo] = {
      //   token: value.strToken,
      //   host: value.strSrcIpAddress
      // };
      this.videoInfo.map((item, idx) => {
        if (idx === this.selectVideoNo) {
          this.videoInfo[idx].token = value.strToken;
          this.videoInfo[idx].equipmentCode = value.equipmentCode;
          this.videoInfo[idx].host = value.serverName.replace("http://", "");
        }
      });
    },
  },
  created() {
    this.setVideoNum(9);
  },
  computed: {
    ...mapGetters(["getSelectVideo"]),
  },
  methods: {
    getSelectVideoNo(num) {
      this.videoInfo.map((item, idx) => {
        this.videoInfo[idx].selected = idx === num ? true : false;
        // if (idx === num) {
        // } else {
        //   this.videoInfo[idx].selected = false;
        // }
      });
      this.selectVideoNo = num;
    },
    handleChange() {},
    selectVideoNum() {},
    setVideoNum(num) {
      let tmp = [];
      if (num === 4) {
        this.widthNum = 12;
        this.videoStyle.height = `${717 / 2}px`;
      } else if (num === 9) {
        this.widthNum = 8;
        this.videoStyle.height = `${717 / 3}px`;
      } else if (num === 16) {
        this.widthNum = 6;
        this.videoStyle.height = `${717 / 4}px`;
      } else {
        this.widthNum = 24;
        this.videoStyle.height = `${717 / 1}px`;
      }
      for (let i = 0; i < num; i++) {
        tmp.push({
          no: i,
          token: "",
          host: "",
          equipmentCode: "",
          selected: false,
        });
      }
      this.videoInfo = tmp;
      this.videoNum = num;
    },
  },
  mounted() {
    // this.boxH = document.getElementById("CameraCtrlBox").clientHeight;
    // this.$refs.video1.style.height = `${this.boxH - 120}px`;
  },
};
</script>

<style lang="less">
.LeftVideo {
  height: 860px;
  .ant-select-selection {
    border: none;
  }
  .video {
    // height: calc(100% - 140px);
    // height: 717px;
    width: 100%;
    margin-bottom: 20px;
    background: rgba(2, 22, 82, 0.4);
    border: 1px solid #18599b;
  }
  .ctrBar {
    &::after {
      content: "";
      display: inline-block;
      clear: both;
    }
    .left {
      float: left;
      & > .itemAction {
        cursor: pointer;
        display: inline-block;
        // width: 73px;
        padding: 0 10px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        margin-right: 15px;
        background: rgba(151, 233, 255, 0.1);
        box-shadow: inset 0 0 3px 0 rgba(59, 249, 251, 0.5);
        border-radius: 19px;
        i {
          margin-right: 15px;
        }
        i:last-child {
          margin-right: 0;
        }
      }
    }
    .right {
      float: right;
      i {
        cursor: pointer;
        margin-right: 40px;
        &:last-child {
          margin: 0;
        }
      }
    }
  }
}
</style>
