<template>
  <div class="Video">
    <!---<canvas :id="id"></canvas>-->
    <video
      v-bind:class="videoInfo.selected?'h5video active':'h5video no'"
      :id="'video-'+videoInfo.no"
      autoplay="autoplay"
      muted="muted"
      webkit-playsinline
      playsinline
      @click="playVideo(videoInfo.no)"
    ></video>
    <!-- <div class="playBtn" v-show="this.isPlay">
      <i class="iconfont iconcaret-circle-right"></i>
    </div>-->
    <!----控制条---->
    <div class="ctrlBar">
      <i
        class="iconfont iconsearch-plus"
        @click="ctrlVideo('plus')"
        title="减焦距"
        @mousedown="mouseCtrl('down',0.1,'zoom-plus')"
        @mouseup="mouseCtrl('up',0.1,'zoom-plus')"
      ></i>
      <i
        class="iconfont iconsearch-minus"
        @click="ctrlVideo('minus')"
        title="加焦距"
        @mousedown="mouseCtrl('down',0.1,'zoom-minus')"
        @mouseup="mouseCtrl('up',0.1,'zoom-minus')"
      ></i>
      <i
        class="iconfont iconcircle1"
        @click="ctrlVideo('ManualRecordStart')"
        title="录制视频开始"
      ></i>
      <i
        class="iconfont iconcircle"
        @click="ctrlVideo('ManualRecordStop')"
        title="录制视频结束"
      ></i>
      <i
        class="iconfont iconimages"
        @click="ctrlVideo('Snapshot')"
        title="截图"
      ></i>
      <i
        class="iconfont iconcog"
        @click="ctrlVideo('showTurn')"
        title="显示控制方向"
      ></i>
      <!-- <i class="iconfont iconcog" @click="setPresetShow()" title="显示控制方向"></i> -->
    </div>
    <!----方向控制---->
    <a-row
      class="turnCtrl"
      v-show="turnCtrlShow"
    >
      <a-col class="turnDirection">
        <div class="box1">
          <div class="row">
            <span
              class="item"
              @click="turnTo(5)"
              @mousedown="mouseCtrl('down',5)"
              @mouseup="mouseCtrl('up',5)"
            >
              <i class="iconfont iconangle-left"></i>
            </span>
            <span
              class="item"
              @click="turnTo(1)"
              @mousedown="mouseCtrl('down',1)"
              @mouseup="mouseCtrl('up',1)"
            >
              <i class="iconfont iconangle-up"></i>
            </span>
            <span
              class="item"
              @click="turnTo(7)"
              @mousedown="mouseCtrl('down',7)"
              @mouseup="mouseCtrl('up',7)"
            >
              <i class="iconfont iconangle-right"></i>
            </span>
          </div>
          <div class="row">
            <span
              class="item"
              @click="turnTo(3)"
              @mousedown="mouseCtrl('down',3)"
              @mouseup="mouseCtrl('up',3)"
            >
              <i class="iconfont iconangle-left"></i>
            </span>
            <span
              class="item"
              @click="turnTo(0)"
              @mousedown="mouseCtrl('down',0)"
              @mouseup="mouseCtrl('up',0)"
            >
              <i class="iconfont iconsync"></i>
            </span>
            <span
              class="item"
              @click="turnTo(4)"
              @mousedown="mouseCtrl('down',4)"
              @mouseup="mouseCtrl('up',4)"
            >
              <i class="iconfont iconangle-right"></i>
            </span>
          </div>
          <div class="row">
            <span
              class="item"
              @click="turnTo(6)"
              @mousedown="mouseCtrl('down',6)"
              @mouseup="mouseCtrl('up',6)"
            >
              <i class="iconfont iconangle-left"></i>
            </span>
            <span
              class="item"
              @click="turnTo(2)"
              @mousedown="mouseCtrl('down',2)"
              @mouseup="mouseCtrl('up',2)"
            >
              <i class="iconfont iconangle-down"></i>
            </span>
            <span
              class="item"
              @click="turnTo(8)"
              @mousedown="mouseCtrl('down',8)"
              @mouseup="mouseCtrl('up',8)"
            >
              <i class="iconfont iconangle-right"></i>
            </span>
          </div>
        </div>
      </a-col>
      <a-col class="speedSlider">
        <div class="slider">
          <a-slider
            vertical
            :defaultValue="30"
            @change="onSliderChange"
            v-model="speedVal"
            :max="100"
            :min="1"
          />
        </div>
        <a-input
          v-model="speedVal"
          class="input"
        />
      </a-col>
    </a-row>
    <!----预置点---->
    <a-col v-bind:class="presetShow==='in'?'presetBox animated bounceInRight':'presetBox animated bounceOutRight'">
      <p>预置点</p>
      <ul
        class="presetList"
        ref="presetList"
      >
        <li
          v-for="(item,index) in presetList"
          :key="index"
        >
          <a-col
            class="text ellipsis"
            @dblclick="editVal"
            contenteditable="false"
            :id="index"
            @blur="unable"
            @input="inputChange"
            :span="15"
            :title="item.preName"
          >{{item.preName}}</a-col>
          <a-col
            class="operationGroups"
            :span="9"
          >
            <i
              class="set iconfont iconcog"
              @click="operationPre(item.ptzIndex,'set')"
            ></i>
            <i
              class="del iconfont iconchevron-circle-down"
              v-if="item.canDo"
              @click="operationPre(item.ptzIndex,'del')"
            ></i>
            <i
              class="effect iconfont icontimes"
              @click="operationPre(item.ptzIndex,'effect')"
            ></i>
          </a-col>
        </li>
      </ul>
    </a-col>
  </div>
</template>

<script>
import "animate.css";
import JsLoader from "@/libs/JsLoader.js";
import _ from "lodash";
import Camera from "@/api/Camera.js";
import Media from "@/api/Media.js";
import baseMixin from "@/mixins/base.js";
let camera = new Camera();
let media = new Media();
let st;
const PRENUM = 30;

export default {
  mixins: [baseMixin],
  props: {
    id: String,
    videoInfo: Object,
    getSelectVideoNo: Function,
  },
  data() {
    return {
      presetList: [],
      presetShow: "out",
      speedVal: 1,
      isPlay: true,
      player: "",
      v1: null,
      conf1: {},
      preVal: "",
      turnCtrlShow: false,
    };
  },
  created() {
    this.getPresetList();
  },
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
      if (this.v1 != undefined) {
        this.v1.disconnect();
        delete this.v1;
        this.v1 = undefined;
      }
      if (this.videoInfo.token) {
        this.conf1 = {
          videoid: `video-${val.no}`,
          protocol: window.location.protocol, //http: or https:
          host: val.host, //localhost:8080
          rootpath: "/", // '/' or window.location.pathname
          token: val.token,
          hlsver: "v1", //v1 is for ts, v2 is for fmp4
          // session: "c1782caf-b670-42d8-ba90-2244d0b0ee83" //session got from login
        };
        this.v1 = H5sPlayerCreate(this.conf1);
        this.v1.connect();
      }
    },
    unable(e) {
      e.target.setAttribute("contenteditable", "false");
    },
    editVal(e) {
      e.target.setAttribute("contenteditable", "true");
      this.keepLastIndex(e.target);
    },
    keepLastIndex(obj) {
      if (window.getSelection) {
        //ie11 10 9 ff safari
        obj.focus(); //解决ff不获取焦点无法定位问题
        let range = window.getSelection(); //创建range
        range.selectAllChildren(obj); //range 选择obj下所有子内容
        range.collapseToEnd(); //光标移至最后
      } else if (document.selection) {
        //ie10 9 8 7 6 5
        let range = document.selection.createRange(); //创建选择对象
        range.moveToElementText(obj); //range定位到obj
        range.collapse(false); //光标移至最后
        range.select();
      }
    },
    async getPresetList() {
      let res = await camera
        .getPresupposeByCameraId({
          equipmentCode: this.equipmentCode,
        })
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      //创建并填充预置点数组
      for (let i = 1; i <= PRENUM; i++) {
        let has = false;
        res.data &&
          // eslint-disable-next-line
          res.data.map((item, index) => {
            if (i === item.ptzIndex) {
              item.canDo = true;
              this.presetList.push(item);
              has = true;
              return;
            }
          });
        if (!has) {
          this.presetList.push({
            ptzIndex: i,
            preName: `预设点${i}`,
            equipmentCode: this.videoInfo.equipmentCode,
          });
        }
      }
    },
    onSliderChange(val) {
      this.speed = val;
    },
    inputChange(e) {
      this.preVal = e.target.innerHTML;
    },
    //转向
    turnTo(val) {
      let messageObj = Object.assign(this.videoInfo, {
        equipmentType: 4128,
        id: this.videoInfo.equipmentCode,
      });
      let messageId = this.createMsgId(messageObj, "ptz");
      let deviceEffectOpt = {
        direction: val,
        aperture: 0,
        date: 0,
        deviceIds: [this.videoInfo.equipmentCode],
        focus: 0,
        hour: 0,
        messageId: messageId,
        ptzSpeed: this.speed === 0 ? 0.01 : this.speed / 100,
        sec: 0,
        streamIndex: 0,
        year: 0,
        zoom: 0,
      };
      let res = camera.movePtz(deviceEffectOpt).catch((err) => {
        console.log(err);
      });
      if (res && res.code === "200") {
        this.$message.info("操作成功");
      }
    },
    async setFocus(val) {
      let opt = {
        deviceIds: [this.videoInfo.equipmentCode],
        zoom: val.zoom,
        zoomSpeed: val.zoomSpeed,
      };
      let res = await camera.setFocus(opt).catch((err) => {
        console.log(err);
      });
      if (res && res.code === "200") {
        this.$message.info("操作成功");
      }
    },
    async controlMedia(type, data) {
      let res = await media[type](data).catch((err) => {
        console.log(err);
      });
      if (res && res.bStatus) {
        this.$message.info(res.strCode);
      }
    },
    mouseCtrl(type, val, ctrlType) {
      let zoomSpeed = this.speed === 0 ? 0.01 : this.speed / 100;
      if (type === "down") {
        st = setInterval(() => {
          if (ctrlType) {
            if (ctrlType === "zoom-plus") {
              this.setFocus({ zoom: 0, zoomSpeed: zoomSpeed });
            } else if (ctrlType === "zoom-plus") {
              this.setFocus({ zoom: 1, zoomSpeed: zoomSpeed });
            }
          } else {
            this.turnTo(val);
          }
        }, 500);
      } else {
        clearInterval(st);
      }
    },
    // playVideo() {}
    playVideo: function (num) {
      // let box = document.getElementById(this.id);
      // this.v1.connect();
      // if (box.paused) {
      //   this.isPlay = false;
      //   box.play();
      //   if (this.v1 != null);
      //   {
      //     this.v1.disconnect();
      //     this.v1 = null;
      //   }
      //   this.v1 = H5sPlayerCreate(this.conf1);
      //   this.v1.connect();
      // } else {
      //   this.isPlay = true;
      //   this.v1.disconnect();
      //   this.v1 = null;
      //   box.pause();
      // }
      this.getSelectVideoNo(num);
    },
    ctrlVideo(type) {
      let zoomSpeed = this.speed === 0 ? 0.01 : this.speed / 100;
      if (!this.videoInfo.token) {
        return;
      }
      switch (type) {
        case "showTurn":
          this.turnCtrlShow = !this.turnCtrlShow;
          break;
        case "plus":
          this.setFocus({ zoom: 1, zoomSpeed: zoomSpeed || 0.01 });
          break;
        case "minus":
          this.setFocus({ zoom: 0, zoomSpeed: zoomSpeed || 0.01 });
          break;
        case "ManualRecordStart":
          this.controlMedia("ManualRecordStartAndStop", {
            token: this.videoInfo.token,
            session: this.videoInfo.session,
            type: "ManualRecordStart",
          });
          break;
        case "ManualRecordStop":
          this.controlMedia("ManualRecordStartAndStop", {
            token: this.videoInfo.token,
            session: this.videoInfo.session,
            type: "ManualRecordStop",
          });
          break;
        case "Snapshot":
          this.controlMedia(type, {
            token: this.videoInfo.token,
            session: this.videoInfo.session,
          });
          break;
      }
    },
    setPresetShow() {
      this.presetShow = this.presetShow === "in" ? "out" : "in";
    },
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
    display: block;
    width: 100%;
    height: 100%;
    object-fit: fill;
    border: 1px solid black;
    cursor: pointer;
    &.active {
      background: #616263;
    }
    &.no {
      background: #363636;
    }
  }
  .ctrlBar {
    background: hsla(0, 0%, 100%, 0.3);
    width: calc(100% - 2px);
    position: absolute;
    left: 0;
    bottom: 0;
    text-align: right;
    padding: 3px 0;
    i {
      cursor: pointer;
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      margin-right: 5px;
    }
  }
  /*******控制**********/
  .turnCtrl {
    //   height: 40%;
    position: absolute;
    right: 20px;
    bottom: 40px;
    overflow: hidden;
    .turnDirection {
      float: left;
      .row {
        flex-basis: 100%;
        display: flex;
        .item {
          cursor: pointer;
          display: inline-block;
          margin: 0 12px 12px 0;
          width: 24px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          border-radius: 50%;
          background: rgba(151, 233, 255, 0.1);
          box-shadow: inset 0 0 3px 0 rgba(59, 249, 251, 0.5);
        }
      }
      .row:nth-child(1) {
        justify-content: center;
      }
      .row:nth-child(2) {
        justify-content: center;
      }
      .row:nth-child(3) {
        justify-content: center;
      }
    }
    .speedSlider {
      float: right;
      // padding-left: 110px;
      .ant-slider-handle {
        //   width: 28px;
        //   height: 28px;
        //   border-radius: 50%;
        //   background-image: linear-gradient(270deg, #6dfdfd 0%, #3bbdfb 83%);
        // border: none;
        background: #3bf9fb;
      }
      .input {
        padding: 0;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 50%;
        box-shadow: inset 0 0 3px 0 #98feff;
        color: #ddfdff;
        margin-top: 12px;
        margin-left: 6px;
      }
      .slider {
        height: 60px;
      }
    }
  }
  /*******预置点**********/
  .presetBox {
    padding: 10px;
    background: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 215px;
    right: 37px;
    margin-top: 18px;
    z-index: 99999;
    width: 358px;
    p {
      color: #ddfdff;
      margin-bottom: 10px;
    }
    .presetList {
      overflow-y: scroll;
      height: 600px;
      padding-left: 5px;
      li {
        height: 30px;
        line-height: 30px;
        .operationGroups {
          // float: right;
          text-align: right;
          i {
            cursor: pointer;
            margin-right: 14px;
          }
          i:last-child {
            margin: 0;
          }
        }
        &:hover {
          background: rgba(255, 255, 255, 0.05);
        }
      }
    }
  }
}
// }
</style>
