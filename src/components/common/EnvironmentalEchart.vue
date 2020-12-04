<template>
  <div class="ChartRingSingle">
    <ChartRing
      :option="setOpt()"
      :id="chartBoxId"
      :num="24"
      v-bind:showNotice="false"
      v-bind:showTime="true"
    ></ChartRing>
  </div>
</template>

<script>
import ChartRing from "@/components/common/ChartRing.vue"; // @ is an alias to /src

export default {
  components: {
    ChartRing
  },
  props: {
    msg: String,
    chartVal: Number,
    chartText: {
      type: String,
      default: "优"
    },
    chartBoxId: String
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    imgOnload() {
      this.imgLoaded = true;
    },
    setOpt() {
      let _this = this;
      var value = 0.8, // 值，0~1之间
        startAngle = 215, // 开始角度
        endAngle = -35, // 结束角度
        splitCount = 60, // 刻度数量
        pointerAngle = (startAngle - endAngle) * (1 - value) + endAngle; // 当前指针（值）角度
      var option = {
        series: [
          {
            center: ["50%", "50%"],
            type: "gauge",
            radius: "100%",
            startAngle: pointerAngle,
            endAngle: endAngle,
            splitNumber: 1,
            axisLine: {
              show: false,
              lineStyle: {
                width: 3,
                opacity: 0
              }
            },
            title: { show: false },
            detail: { show: false },
            splitLine: { show: false },
            axisTick: {
              length: 20,
              splitNumber: Math.ceil((1 - value) * splitCount),
              lineStyle: {
                color: "#001242",
                width: 1
              }
            },
            axisLabel: { show: false },
            pointer: { show: false },
            itemStyle: {},
            data: [
              {
                value: value,
                name: "test"
              }
            ]
          },
          {
            center: ["50%", "50%"],
            type: "gauge",
            radius: "100%",
            startAngle: startAngle,
            endAngle: pointerAngle,
            splitNumber: 1,
            axisLine: {
              show: false,
              lineStyle: {
                width: 3,
                opacity: 0
              }
            },
            title: { show: false },
            detail: {
              // color: "#DDFDFF",
              fontSize: 14,
              fontWeight: "bold",
              offsetCenter: [0, 10],
              formatter: function(value) {
                return value + `\n{a|${_this.chartText}}`;
              },
              rich: {
                unit: {
                  fontSize: 14,
                  // color: "#DDFDFF",
                  paddingLeft: 10
                },
                a: {
                  fontSize: 14,
                  // color: "#7EC3FA",
                  lineHeight: 20
                }
              }
            },
            splitLine: { show: false },
            axisTick: {
              length: 20,
              splitNumber: Math.ceil(value * splitCount),
              lineStyle: {
                color: {
                  image: document.getElementById("bgimg"),
                  repeat: "no-repeat"
                },
                width: 1
              }
            },
            axisLabel: { show: false },
            pointer: { show: false },
            itemStyle: {},
            data: [
              {
                value: value,
                name: "test"
              }
            ]
          },
          {
            center: ["50%", "50%"],
            type: "gauge",
            radius: "100%",
            startAngle: pointerAngle,
            endAngle: pointerAngle,
            splitNumber: 1,
            axisLine: {
              show: false,
              lineStyle: {
                width: 3,
                opacity: 0
              }
            },
            title: { show: false },
            detail: { show: false },
            splitLine: { show: false },
            axisTick: {
              length: 20,
              splitNumber: 1,
              lineStyle: {
                color: {
                  image: document.getElementById("bgimg"),
                  repeat: "no-repeat"
                },
                width: 1
              }
            },
            axisLabel: { show: false },
            pointer: { show: false },
            itemStyle: {},
            data: [
              {
                value: value,
                name: "test"
              }
            ]
          }
        ]
      };
      return option;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.ChartRingSingle {
  width: 100%;
  height: 90px;
  text-align: center;
  // height: 386px;
  .box {
    height: 386px;
  }

  .arow {
    padding: 20px 14px;
    & > div {
      margin-bottom: 13px;
    }
  }
}
</style>
