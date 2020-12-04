<template>
  <div class="RightCtrl">
    <a-input-search
      placeholder="输入关键字"
      @search="onSearch"
      class="search"
    />
    <div class="title">监控列表</div>
    <ul class="cameraList">
      <li
        @click="selCamera(item)"
        v-for="(item,index) in cameraList"
        v-bind:key="index"
      >
        <span class="fl ellipsis">{{item.equipmentName}}</span>
        <span class="fr">
          <i class="iconfont iconmap-marker-alt"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import _ from "lodash";
import Camera from "@/api/Camera.js";
import Media from "@/api/Media.js";
import { mapMutations } from "vuex";
import baseMixin from "@/mixins/base.js";

const PRENUM = 30;
// const equipmentCode = 28;
let camera = new Camera();
let media = new Media();
let st;
export default {
  mixins: [baseMixin],
  // components: {},
  props: {},
  data() {
    return {
      equipmentCode: this.$route.query.id,
      speedVal: 0,
      canEdit: true,
      presetList: [],
      preVal: "",
      cameraList: [],
      speed: 0,
    };
  },
  created() {
    // this.getPresetList();
    this.getCameraList();
  },
  mounted() {
    // this.$refs.presetList.style.height =
    // document.getElementById("CameraCtrlBox").clientHeight - 230 + "px";
  },
  computed: {},
  methods: {
    ...mapMutations(["selectedVideo"]),
    // eslint-disable-next-line
    onSearch(val) {},
    callback() {},
    onSliderChange(val) {
      this.speed = val;
    },
    inputChange(e) {
      this.preVal = e.target.innerHTML;
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
    unable(e) {
      e.target.setAttribute("contenteditable", "false");
    },
    deviceEffect(val) {
      console.log(val);
    },
    selCamera(item) {
      item.serverName.replace("http://", "");
      item.random = Math.random();
      this.selectedVideo(item);
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
            equipmentCode: this.equipmentCode,
          });
        }
      }
    },
    //预置点操作
    async operationPre(ptzIndex, type) {
      let opt = {
        ptzIndex: ptzIndex,
        equipmentCode: this.equipmentCode,
      };
      if (type === "set") {
        opt.preName = this.preVal;
      }
      let res = await camera.effectPresent(opt, type).catch((err) => {
        console.log(err);
      });
      if (res && res.code === "200") {
        this.$message.info("操作成功");
      }
    },
    //安防列表获取
    async getCameraList() {
      let res = await media
        .GetSrcWithoutDevice({
          projectId: this.projectId,
        })
        .catch((err) => {
          console.log(err);
        });
      if (res && res.code === "200") {
        this.cameraList = res.data;
      }
    },
    //转向
    turnTo(val) {
      let deviceEffectOpt = {
        direction: val,
        aperture: 0,
        date: 0,
        deviceIds: [this.equipmentCode],
        focus: 0,
        hour: 0,
        messageId: "string",
        ptzSpeed: this.speed === 0 ? 0.01 : this.speed / 10,
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
    mouseCtrl(type, val) {
      if (type === "down") {
        st = setInterval(() => {
          this.turnTo(val);
        }, 500);
      } else {
        clearInterval(st);
      }
    },
  },
};
</script>

<style lang="less">
/***overwrite ant style**/
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  border: none;
  border-bottom: 1px solid #295492;
}
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
  border: 1px solid #295492;
  border-bottom: none;
}
/***overwrite ant style**/
.RightCtrl {
  padding-left: 10px;
  height: 100%;
  .title {
    font-size: 14px;
    color: #7ec3fa;
    line-height: 30px;
    padding-top: 20px;
  }
  .ant-tabs-content {
  }
  .cameraList {
    height: 500px;
    overflow-y: scroll;
    font-size: 12px;
    line-height: 24px;
    li {
      overflow: hidden;
      .fl {
        width: 91%;
      }
    }
  }
}
</style>
