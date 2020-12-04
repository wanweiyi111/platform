<template>
  <!-- 智慧杆信息发布大屏信息 -->
  <div class="displayInfo camareInfo">
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
        <div class="contentDevice">
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
                :span="8"
                class="title"
              >屏幕开关状态：</a-col>
              <a-col
                :span="16"
                class="text"
              >{{WorkStatus[item.equipmentStatus]}}</a-col>
            </a-row>
            <a-row>
              <a-col
                :span="8"
                class="title"
              >是否播放节目：</a-col>
              <a-col
                :span="16"
                class="text"
              >{{WorkStatus[item.equipmentStatus]}}</a-col>
            </a-row>
            <a-row>
              <a-col
                :span="8"
                class="title"
              >开关控制：</a-col>
              <a-col
                :span="16"
                class="text"
              >
                <a-switch
                  :defaultChecked="item.onOff==='0'?false:true"
                  checkedChildren="开"
                  unCheckedChildren="关"
                  @change="onSwLedChange(item.equipmentCode,item.brightness,$event)"
                />
              </a-col>
            </a-row>
            <a-row>
              <a-col
                :span="8"
                class="title"
              >亮度控制：</a-col>
              <a-col
                :span="16"
                class="text lightSlider"
              >
                <div
                  class="sliderbox fl"
                  style="width:80%"
                >
                  <a-slider
                    :min="1"
                    :max="100"
                    :disabled="!Boolean(item.onOff)"
                    v-model="item.brightness"
                    class="slider"
                    @afterChange="onSliderLedChange(item.equipmentCode, $event)"
                  />
                </div>
                <i class="sliderTip fr">{{item.brightness}}%</i>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import baseMixin from "@/mixins/base.js";
import CONFIG_LIST from "@/config";
import Display from "@/api/Display";
import Pole from "@/api/Pole";
const { NETkState, WorkStatus } = CONFIG_LIST;
const display = new Display();
const pole = new Pole();

export default {
  mixins: [baseMixin],
  props: {
    deviceInfo: Array,
    from: String,
    isWarning: Boolean,
    equipmentId: String,
  },
  data() {
    return {
      NETkState,
      WorkStatus,
    };
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
    // 信息发布智慧杆开关控制
    async onSwLedChange(code, voltage, val) {
      let opt = {
        level: voltage,
        deviceIds: [code],
        onOff: +val,
        pojectId: this.projectId,
      };
      let res = await display.setOnOff(opt);
      if (res.code != "200") {
        this.$message.error(res.msg);
        return;
      }
      this.$message.success("修改成功");
      this.$bus.emit("getData", "displayInfo");
    },
    // 信息发布大屏亮度控制
    async onSliderLedChange(code, val) {
      let opt = { level: val, deviceIds: [code], pojectId: this.projectId };
      let res = await display.setBrightness(opt);
      if (res.code != "200") {
        this.$message.error(res.msg);
        return;
      }
      this.$message.success("修改成功");
    },

    // 查看设备故障信息
    checkWarningMessage(equipmentCode) {
      this.$bus.emit("showWarningMessage", equipmentCode);
    },
  },
};
</script>


