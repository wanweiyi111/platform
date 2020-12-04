<template>
  <!-- 智慧杆雷达设备信息 -->
  <div class="radarInfo camareInfo">
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
        <div class="contentDevice radar">
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

          <div class="infoList">
            <a-row>
              <a-col
                :span="12"
                class="title"
              >距离分辨率：</a-col>
              <a-col
                :span="12"
                class="text"
              >{{item.distanceResolution | valueWithUnit('m')}}</a-col>
            </a-row>
            <a-row>
              <a-col
                :span="12"
                class="title"
              >雷达中心频率：</a-col>
              <a-col
                :span="12"
                class="text"
              >{{item.radarFrequency | valueWithUnit('KHZ')}}</a-col>
            </a-row>
            <a-row>
              <a-col
                :span="12"
                class="title"
              >水平角度：</a-col>
              <a-col
                :span="12"
                class="text"
              >{{item.horizontalAngle | valueWithUnit('deg')}}</a-col>
            </a-row>
            <a-row>
              <a-col
                :span="12"
                class="title"
              >最大目标跟踪数：</a-col>
              <a-col
                :span="12"
                class="text"
              >{{item.maxTargetTrackNum | valueWithUnit('个')}}</a-col>
            </a-row>
            <a-row>
              <a-col
                :span="12"
                class="title"
              >探测最大距离：</a-col>
              <a-col
                :span="12"
                class="text"
              >{{item.maxValidDistance | valueWithUnit('m')}}</a-col>
            </a-row>
            <a-row>
              <a-col
                :span="12"
                class="title"
              >最大测速：</a-col>
              <a-col
                :span="12"
                class="text"
              >{{item.maxDetectionSpeed | valueWithUnit('km/m')}}</a-col>
            </a-row>
            <a-row>
              <a-col
                :span="12"
                class="title"
              >垂直角度：</a-col>
              <a-col
                :span="12"
                class="text"
              >{{item.verticalAngle | valueWithUnit('deg')}}</a-col>
            </a-row>
            <a-row>
              <a-col
                :span="12"
                class="title"
              >发现目标的个数：</a-col>
              <a-col
                :span="12"
                class="text"
              >{{item.targetNum | valueWithUnit('个')}}</a-col>
            </a-row>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import baseMixin from "@/mixins/base.js";
import Pole from "@/api/Pole";
const pole = new Pole();
export default {
  mixins: [baseMixin],
  props: {
    deviceInfo: Array,
    from: String,
    isWarning: Boolean,
    equipmentId: String,
  },

  methods: {
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
        projectId: this.projectId,
      });
      if (res.code != "200") {
        this.$message.error("解绑失败");
        return;
      }
      this.$message.success("解绑成功");
      this.$bus.emit("getPoleInfo");
    },

    // 查看设备故障信息
    checkWarningMessage(equipmentCode) {
      this.$bus.emit("showWarningMessage", equipmentCode);
    },
  },
  filters: {
    valueWithUnit(val, unit) {
      return val ? `${val} ${unit}` : "";
    },
  },
};
</script>
