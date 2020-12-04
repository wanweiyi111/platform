<template>
  <div class="radar-chart-wrapper">
    <div id="radarChart"></div>
    <div class="radar-chart-btns">
      <span :class="{on: curFlag === 1 }" @click="handleRePortChange(1)">天</span>
      <span :class="{on: curFlag === 2 }" @click="handleRePortChange(2)">周</span>
      <span :class="{on: curFlag === 3 }" @click="handleRePortChange(3)">月</span>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/base.js";
import echarts from "echarts";
import Radar from "@/api/Radar";
let radar = new Radar();
export default {
  mixins: [baseMixin],
  name: "RadarChart",
  data() {
    return {
      radarChart: null,
      curFlag: 1 // 1天， 2周， 3月
    };
  },
  methods: {
    getChartOptions(params) {
      // params = {xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],  yData: [20, 32, 50, 34, 90, 130, 120]}
      let { xpos, ypos } = params;
      let option = {
        textStyle: {
          color: "#fff"
        },
        grid: {
          left: 60,
          right: 10,
          top: 30,
          bottom: 30
        },
        xAxis: {
          type: "category",
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          data: xpos
        },
        yAxis: {
          name: "（人）",
          offset: 20,
          type: "value",
          min: 0,
          max: params.yvalue[3],
          splitNumber: params.yvalue[3] === 0?1:params.yvalue.length-1,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            margin: -5,
            inside: false
          }
        },
        series: [
          {
            data: ypos,
            type: "line",
            smooth: true,
            showSymbol: false,
            lineStyle: {
              color: "#6DFDFD"
            }
          }
        ]
      };
      return option;
    },
    initRadarChart() {
      this.radarChart = echarts.init(document.getElementById("radarChart"));
    },
    refreshRadarChart(params) {
      let option = this.getChartOptions(params);
      this.radarChart.setOption(option);
    },
    destroyRadarChart() {
      if (this.radarChart) {
        this.radarChart.dispose();
        this.radarChart = null;
      }
    },
    handleRePortChange(flag) {
      let methods = {
        1: "findReportList",
        2: "findReportListWeek",
        3: "findReportListMonth"
      };
      let method = methods[flag];
      this.curFlag = flag;
      this[method]();
    },
    async findReportList() {
      // 天报表
      let res = await radar.findReportList({ projectId: this.projectId });
      if (res.code === "200") {
        this.refreshRadarChart(res.data);
      }
    },
    async findReportListWeek() {
      // 周报表
      let res = await radar.findReportListWeek({ projectId: this.projectId });
      if (res.code === "200") {
        this.refreshRadarChart(res.data);
      }
    },
    async findReportListMonth() {
      // 月报表
      let res = await radar.findReportListMonth({ projectId: this.projectId });
      if (res.code === "200") {
        this.refreshRadarChart(res.data);
      }
    }
  },
  mounted() {
    this.initRadarChart();
    this.findReportList();
  },
  beforeDestroy() {
    this.destroyRadarChart();
  }
};
</script>

<style scoped>
.radar-chart-wrapper,
#radarChart {
  width: 100%;
  height: 100%;
}
#radarChart {
  height: 170px;
}
.radar-chart-btns {
  display: flex;
  justify-content: center;
}
.radar-chart-btns span {
  display: inline-block;
  margin: 0 10px;
  width: 38px;
  height: 20px;
  line-height: 20px;
  background: rgba(0, 41, 115, 0.1);
  box-shadow: inset 0 0 3px 0 #3576d2;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 4px;
  cursor: pointer;
  text-align: center;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #589dff;
}
.radar-chart-btns span.on {
  background: rgba(151, 233, 255, 0.1);
  box-shadow: inset 0 0 3px 0 rgba(59, 249, 251, 0.5);
  font-size: 13px;
  color: #3bf9fb;
}
</style>
