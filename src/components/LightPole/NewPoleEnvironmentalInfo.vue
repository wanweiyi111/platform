<template>
  <!-- 智慧杆环境监测设备信息 -->
  <div class="environmentalInfo camareInfo">
    <a-tabs @change="changeTab" size="small" :tabBarGutter="0">
      <a-tab-pane v-for="item in deviceInfo" :tab="item.equipmentName" :key="item.equipmentCode">
        <div class="contentDevice environmental">
          <!--设备故障、解绑 -->
          <div :class="isWarning?'btnsBox warning':'btnsBox'">
            <span class="faultMessage" v-if="isWarning">
              <i class="iconfont iconexclamation-triangle"></i>
              <a href="javascript:;" class="task" @click="checkWarningMessage">设备故障</a>
            </span>
            <a-button
              type="primary"
              size="small"
              class="removeBtn"
              @click="poleRemoveBind(item.equipmentCode)"
              v-if="from"
            >解绑</a-button>
          </div>
          <div class="environmentalEchart">
            <i class="iconfont iconcloud-showers-heavy" v-if="item.rainfall > 0"></i>
            <span class="weather-sun" v-if="item.rainfall <= 0"></span>
            <div class="temperature-box">
              <span class="temperature">{{item.temperature}}</span>
              <span class="temperature-unit">℃</span>
            </div>
          </div>
          <a-row class="arow pm2">
            <a-col :span="12" class="front">
              <span class="title">PM 2.5</span>
              <span class="text">
                <i>{{item.pm25||0}}</i>μg/m³
              </span>
            </a-col>
            <a-col :span="12">
              <span class="title">PM 10</span>
              <span class="text">
                <i>{{item.pm10||0}}</i>μg/m³
              </span>
            </a-col>
          </a-row>
          <a-row class="arow">
            <a-col :span="12" class="front">
              <span class="title">雨量</span>
              <span class="text">
                <i>{{item.rainfall||0}}</i>mm
              </span>
            </a-col>
            <a-col :span="12">
              <span class="title">风向</span>
              <span class="text">
                <i>{{item.windDirection||0}}</i>
                <i class="wind_num">°</i>
              </span>
            </a-col>
          </a-row>
          <a-row class="arow">
            <a-col :span="12" class="front">
              <span class="title">湿度</span>
              <span class="text">
                <i>{{item.humidity||0}}</i>%
              </span>
            </a-col>
            <a-col :span="12">
              <span class="title">气压</span>
              <span class="text">
                <i>{{item.pressure||0}}</i>h/Pa
              </span>
            </a-col>
          </a-row>
          <a-row class="arow noise">
            <a-col :span="12" class="front">
              <span class="title">噪音</span>
              <span class="text">
                <i>{{item.noise||0}}</i>dB/A
              </span>
            </a-col>
            <a-col :span="12">
              <span class="title">风速</span>
              <span class="text">
                <i>{{item.windSpeed||0}}</i>m/s
              </span>
            </a-col>
          </a-row>
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
};
</script>
<style lang="less">
.environmentalInfo {
  .environmental {
    padding: 0;
    .arow {
      border-top: 1px solid #0e3a76;
      padding: 10px 0;
      &.pm2 {
        i {
          color: #37d208 !important;
        }
      }
      &.noise {
        i {
          color: #ff8904 !important;
        }
      }
      .front {
        padding-left: 30px;
      }
      .title,
      .text {
        display: block;
        &.title {
          font-size: 14px;
          margin-bottom: 10px;
          color: #ddfdff;
        }
        &.text {
          font-size: 12px;
          i {
            font-size: 26px;
            margin-right: 12px;
            color: #7ec3fa;
            &.wind_num {
              display: inline-block;
              margin-top: -10px;
              margin-left: -10px;
            }
          }
        }
      }
    }
  }

  .environmentalEchart {
    .weather-sun {
      display: inline-block;
      width: 60px;
      height: 60px;
      background: url(../../assets/images/sun_net.svg) no-repeat;
      background-size: 100%;
      margin-left: 100px;
    }
    & > i {
      display: block;
      text-align: center;
      font-size: 40px;
      color: #8ad3ff;
      // padding: 20px 0;
    }

    border-bottom: 1px solid #0e3a76;
    .temperature-box {
      line-height: normal;
      text-align: center;
    }
    .temperature {
      font-size: 40px;
      color: #98feff;
    }
    .temperature-unit {
      font-size: 12px;
      color: #bacee4;
      margin-left: 15px;
      margin-right: 15px;
    }
    .air-quality {
      color: #37d208;
    }
  }
}
</style>


