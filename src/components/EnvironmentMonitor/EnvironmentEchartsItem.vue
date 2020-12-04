<template>
  <EnvironmentEcharts class="echarts-box" :option="setOpt()" :id="id"></EnvironmentEcharts>
</template>

<script>
import EnvironmentEcharts from "@/components/EnvironmentMonitor/EnvironmentEcharts.vue";
const colors = ["#5793f3", "#d14a61", "#675bba"];
export default {
  components: {
    EnvironmentEcharts
  },
  props: {
    legendData: {
      type: Array,
      default: () => []
    },
    datalist: {
      type: Array,
      default: () => []
    },
    xAxis: {
      type: Array,
      default: () => []
    },
    yAxisName: {
      type: Array,
      default: () => []
    },
    id: String
  },

  data() {
    return {};
  },
  created() {},
  computed: {},

  methods: {
    // 获取报表数据
    setOpt() {
      let option = {
        color: colors,

        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        grid: {
          left: 40,
          right: "10%",
          top: 80,
          bottom: "10%"
        },
        // toolbox: {
        //   feature: {
        //     dataView: { show: true, readOnly: false },
        //     restore: { show: true },
        //     saveAsImage: { show: true }
        //   }
        // },
        legend: {
          data: this.legendData,
          x: "21%",
          y: "bottom",
          textStyle: {
            color: "#fff"
          }
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: "#5793f3"
              }
            },
            data: this.xAxis
          }
        ],
        yAxis: [
          {
            type: "value",
            name: this.yAxisName[0],
            min: 0,
            // max: 250,
            position: "left",
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            // axisLabel: {
            //   formatter: "{value} ml"
            // },
            splitLine: { show: false }
          },
          {
            type: "value",
            name: this.yAxisName[1] || "",
            min: 0,
            // max: 250,
            position: "right",
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            // axisLabel: {
            //   formatter: "{value} ml"
            // },
            splitLine: { show: false }
          }
          // {
          //   type: "value",
          //   name: this.yAxisName[2],
          //   min: 0,
          //   // max: 25,
          //   position: "left",
          //   axisLine: {
          //     lineStyle: {
          //       color: colors[2]
          //     }
          //   },
          //   // axisLabel: {
          //   //   formatter: "{value} °C"
          //   // },
          //   splitLine: { show: false }
          // }
        ],
        series: [
          {
            name: this.xAxis[0],
            type: "line",
            data: this.datalist[0]
          },
          {
            name: this.xAxis[1],
            type: "line",
            yAxisIndex: 1,
            data: this.datalist[1]
          }
          // {
          //   name: this.xAxis[2],
          //   type: "line",
          //   yAxisIndex: 2,
          //   data: this.datalist[2]
          // }
        ]
      };
      return option;
    }
  }
};
</script>


