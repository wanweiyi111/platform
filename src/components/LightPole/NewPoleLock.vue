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
                :span="6"
                class="title"
              >联网状态：</a-col>
              <a-col
                :span="18"
                class="text"
              >{{NETkState[item.networkState]}}</a-col>
            </a-row>
            <a-row>
              <a-col
                :span="6"
                class="title"
              >工作状态：</a-col>
              <a-col
                :span="18"
                class="text"
              >
                {{
                WorkStatus[item.equipmentStatus]
                }}
              </a-col>
              <a-col
                :span="6"
                class="title"
              >开锁控制：</a-col>
              <a-col
                :span="18"
                class="text"
              >
                <a-switch
                  :checked="Number(item.onOff)?true:false"
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  @change="onSwChange(item)"
                />
              </a-col>
            </a-row>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import Pole from "@/api/Pole";
import CONFIG_LIST from "@/config";
import Lock from "@/api/Lock";
const api = new Lock();

const { NETkState, WorkStatus } = CONFIG_LIST;
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
      onOff: false,
      timer: "",
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

    // 查看设备故障信息
    checkWarningMessage(equipmentCode) {
      this.$bus.emit("showWarningMessage", equipmentCode);
    },
    onSwChange(data) {
      let currentDataInfo = data;
      let listData = this.deviceInfo;
      let deviceIdsArr = [];
      const onOff = Number(currentDataInfo.onOff) ? 0 : 1;
      const messageId = this.createMsgCodeId(currentDataInfo, "setOnOff");
      deviceIdsArr.push(currentDataInfo.equipmentCode);
      this.deviceInfo = this.setOnOffData(listData, currentDataInfo.id, onOff);
      const params = {
        deviceIds: deviceIdsArr,
        durTime: 10,
        messageId,
        onOff,
      };
      this.loadSetOnOffData(params);
      let _this = this;
      this.timer = setTimeout(() => {
        // 开锁请求成功 又关掉
        _this.deviceInfo = _this.setOnOffData(listData, currentDataInfo.id, 0);
      }, 3000);
    },
    // 开关按钮 原数据处理  存储临时onOff数据值
    setOnOffData(data, currentId, state) {
      let newData = (data || []).map((item) => {
        if (item.id == currentId) {
          item.onOff = state ? "1" : "0";
        }
        return item;
      });
      return newData;
    },
    // 获取开关
    async loadSetOnOffData(params) {
      let res = await api.setOnOff(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.$message.success("操作成功");
    },
  },
  filters: {
    valueWithUnit(val, unit) {
      return val ? `${val} ${unit}` : "";
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
};
</script>
