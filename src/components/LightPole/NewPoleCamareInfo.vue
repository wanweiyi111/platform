<template>
  <!-- 智慧杆安防监控设备信息 -->
  <div class="camareInfo">
    <a-tabs
      @change="changeTab"
      size="small"
      :tabBarGutter="0"
    >
      <a-tab-pane
        v-for="item in deviceInfo"
        :tab="item.equipmentName"
        :key="item.equipmentCode"
      >
        <div class="contentDevice camare">
          <!--设备故障、解绑 -->
          <div :class="isWarning?'btnsBox warning':'btnsBox'">
            <span
              class="faultMessage"
              v-if="isWarning"
            >
              <i class="iconfont iconexclamation-triangle"></i>
              <a
                href="javascript:;"
                class="task"
                @click="checkWarningMessage"
              >设备故障</a>
            </span>
            <a-button
              type="primary"
              size="small"
              class="removeBtn"
              @click="poleRemoveBind(item.equipmentCode)"
              v-if="from"
            >解绑</a-button>
          </div>
          <div class="partBox">
            <a-row class="arow pm2">
              <a-col
                :span="24"
                class="videoBox"
              >
                <Video
                  :videoInfo="cameraList"
                  id="poleVideo"
                />
              </a-col>
            </a-row>
            <a
              href="javascript:;"
              @click="toCtrl()"
              class="toCtrl"
            >
              详情
              <i class="iconfont iconangle-right"></i>
            </a>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import baseMixin from "@/mixins/base.js";
import Pole from "@/api/Pole";
import Video from "@/components/common/SimpleVideo.vue";
import Media from "@/api/Media.js";
let media = new Media();
const pole = new Pole();
export default {
  mixins: [baseMixin],
  components: {
    Video,
  },
  props: {
    deviceInfo: Array,
    from: String,
    isWarning: Boolean,
    equipmentId: String,
  },
  data() {
    return {
      cameraList: {},
      selectCode: "",
    };
  },
  watch: {
    deviceInfo: {
      deep: true,
      // immediate: true, // 这句重要
      handler(val) {
        this.getCameraList(val[0].equipmentCode);
      },
    },
  },
  created() {},
  methods: {
    //安防列表获取
    async getCameraList(code) {
      let res = await media
        .GetSrcWithoutDevice({
          projectId: this.projectId,
        })
        .catch((err) => {
          console.log(err);
        });
      if (res && res.code === "200") {
        res.data.map((item, idx) => {
          if (item.equipmentCode === code) {
            this.cameraList = {
              no: idx,
              token: item.strToken,
              host: item.serverName && item.serverName.replace("http://", ""),
            };
          }
        });
      }
    },
    // TAB切换
    changeTab(code) {
      this.$bus.emit("setWarning", code);
    },

    // 设备解绑
    poleRemoveBind(equipmentCode) {
      let _this = this;
      this.$modal.confirm({
        title: "是否接触该设备和智慧杆的绑定关系?",
        okText: "确定",
        cancelText: "取消",
        centered: true,
        onOk() {
          _this.deleteByPoleId(equipmentCode);
        },
        onCancel() {},
      });
    },
    async deleteByPoleId(equipmentCode) {
      let res = await pole.deleteByPoleId({
        equipmentCode: equipmentCode,
        poleId: this.equipmentId,
        pojectId: this.projectId,
      });
      if (res.code != "200") {
        this.$message.error("解绑失败");
        return;
      }
      this.$message.success("解绑成功");
      this.$bus.emit("getPoleInfo");
    },
    // 操控
    toCtrl() {
      // this.$router.push({
      //   path: "/ctrl/camera-detail",
      //   query: { id: equipmentCode },
      // });
      this.$router.push({
        path: "/application-manage/camera",
        query: { tabKey: 2 },
      });
    },

    // 查看设备故障信息
    checkWarningMessage(equipmentCode) {
      this.$bus.emit("showWarningMessage", equipmentCode);
    },
  },
};
</script>
<style  lang="less">
.camareInfo {
  .camare {
    & > .partBox {
      padding: 10px 12px;
      border-top: 1px solid #0e3a76;
    }
    font-size: 14px;
    color: #bacee4;
    .toCtrl {
      float: right;
      margin: 0 10px 10px 0;
      width: 78px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background-image: linear-gradient(61deg, #6dfdfd 15%, #3bbdfb 100%);
      border-radius: 15px;
      color: #011147;
    }
    .arow {
      line-height: 24px;
      .title {
        display: inline-block;
        margin-right: 5px;
      }
      .text {
        text-align: left;
      }
      .videoBox {
        margin-top: 33px;
        padding: 10px;
      }
    }
  }
}
</style>
