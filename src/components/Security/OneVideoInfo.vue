<template>
  <a-col v-if="showRight" :span="bottomSpan.right" class="acol OneVideoInfo">
    <CtrlPanel :split-line="false">
      <dt slot="title">
        {{curDevice.equipmentName}}
        <a
          :href="'/ctrl/camera-detail?id='+curDevice.equipmentCode"
          class="toCtrl"
        >
          操控
          <i class="iconfont iconangle-right"></i>
        </a>
      </dt>
      <dd slot="content">
        <div class="light-detail">
          <a-row>
            <a-col :span="24">
              <div class="playVideo">
                <Video
                  id="Video"
                  :videoInfo="{no:'videoOne',token:curDevice.strToken,host:curDevice.serverName}"
                />
              </div>
              <p class="videoInfo">{{curDevice.otherParameters}}</p>
            </a-col>
          </a-row>
          <!--
          <a-row :gutter="10">
            <a-col :span="4" class="ar gray">ONVIF用户名</a-col>
            <a-col :span="4">{{curDevice.onvif_name}}</a-col>
            <a-col :span="4" class="ar gray">ONVIF用户密码</a-col>
            <a-col :span="4">{{curDevice.onvif_passwd}}</a-col>
          </a-row>
          -->
          <!-- <a-row :gutter="10">
            <a-col :span="4" class="ar gray">主码流</a-col>
            <a-col
              :span="4"
              :title="this.curDevice.mainStreamUrl"
              class="ellipsis"
            >{{this.curDevice.mainStreamUrl}}</a-col>
            <a-col :span="4" class="ar gray">子码流</a-col>
            <a-col
              :span="4"
              :title="this.curDevice.secondSubstreamUrl"
              class="ellipsis"
            >{{this.curDevice.secondSubstreamUrl}}</a-col>
            <a-col :span="4" class="ar gray">三码流</a-col>
            <a-col
              :span="4"
              :title="this.curDevice.thirdSubstreamUrl"
              class="ellipsis"
            >{{this.curDevice.thirdSubstreamUrl}}</a-col>
          </a-row>
          <a-row :gutter="10">
            <a-col :span="4" class="ar gray">主码流宽度</a-col>
            <a-col :span="4">{{this.curDevice.mainWidth}}</a-col>
            <a-col :span="4" class="ar gray">子码流宽度</a-col>
            <a-col :span="4">{{this.curDevice.secondWidth}}</a-col>
            <a-col :span="4" class="ar gray">三码流宽度</a-col>
            <a-col :span="4">{{this.curDevice.thirdWidth}}</a-col>
          </a-row>
          <a-row :gutter="10">
            <a-col :span="4" class="ar gray">主码流高度</a-col>
            <a-col :span="4">{{this.curDevice.mainHeight}}</a-col>
            <a-col :span="4" class="ar gray">子码流高度</a-col>
            <a-col :span="4">{{this.curDevice.secondHeight}}</a-col>
            <a-col :span="4" class="ar gray">三码流高度</a-col>
            <a-col :span="4">{{this.curDevice.thirdHeight}}</a-col>
          </a-row> -->
        </div>
      </dd>
    </CtrlPanel>
  </a-col>
</template>

<script>
import CtrlPanel from "@/components/CtrlPanel.vue";
import Video from "@/components/common/SimpleVideo.vue";

export default {
  components: {
    CtrlPanel,
    Video
  },
  props: {
    curDevice: Object,
    bottomSpan: Object,
    showRight: Boolean
  },
  data() {
    return {
      videoInfo: {
        no: "videoOne",
        token: this.curDevice && this.curDevice.strToken,
        host: this.curDevice && this.curDevice.serverName,
        selected: false
      }
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
          selected: false
        };
      }
    }
  },
  created() {},
  computed: {},
  methods: {}
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
  .videoInfo{
    word-break:break-all;    
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
