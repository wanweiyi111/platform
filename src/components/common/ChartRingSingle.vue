<template>
  <div class="ChartRingSingle">
    <ChartRing
      :option="this.setOpt(this.chartVal)"
      :id="this.chartBoxId"
      :num="24"
      v-bind:showNotice="false"
      v-bind:showTime="true"
    ></ChartRing>
  </div>
</template>

<script>
import ChartRing from "@/components/common/ChartRing.vue"; // @ is an alias to /src
const lightsIcon = require("../../assets/images/lightBar.jpg");

export default {
  components: {
    ChartRing
  },
  props: {
    msg: String,
    chartVal: Number,
    chartText: String,
    chartBoxId: String
  },
  data() {
    return {
      lightsIcon: lightsIcon
    };
  },
  created() {},
  methods: {
    setOpt(val) {
      let _this = this;
      var val = val > 100 ? 100 : val;
      var singleTick = 3.6;
      var opt = {
        splitNumberF: "",
        splitNumberB: "",
        startF: 90,
        endF: null,
        startB: null,
        endB: -270
      };
      var detailTick = singleTick * val;
      opt.splitNumberF = val;
      opt.splitNumberB = 100 - val;
      // if (detailTick > 90) {
      //     // opt.endB = 360 - detailTick;
      opt.endF =
        90 - detailTick > 0 ? 90 - detailTick - 4 : 90 - detailTick + 4;
      // } else {
      // opt.endB = 360 - detailTick;
      // opt.endF = 90 - detailTick;
      // }
      opt.startB = opt.endF;

      let option = {
        toolbox: {
          toolbox: {
            show: true,
            feature: {
              restore: {
                show: false
              },
              saveAsImage: {
                show: false
              }
            }
          }
        },
        series: [
          {
            center: ["50%", "50%"], // 仪表位置
            radius: "100%", //仪表大小
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            },
            pointer: {
              show: false
            }, //显示隐藏指针
            startAngle: opt.startB,
            endAngle: opt.endB,
            name: "业务指标",
            type: "gauge",
            // 去掉多余的分段
            splitNumber: 1,
            axisLine: {
              lineStyle: {
                width: 10,
                opacity: 0
              }
            },
            // 指针样式
            itemStyle: {},
            axisTick: {
              // 刻度长度与轴线宽度一致，达到分隔的效果
              length: 7,
              // 增加刻度密度
              splitNumber: opt.splitNumberB,
              lineStyle: {
                // 增加刻度宽度
                width: 1
              }
            },
            color: "#fff",
            fontSize: 40,
            offsetCenter: [0, "20%"],
            rich: {
              unit: {
                fontSize: 14,
                color: "#7EC3FA",
                lineHeight: 30
              }
            },
            data: [
              {
                value: val,
                name: ""
              }
            ],
            title: {
              fontSize: 8,
              offsetCenter: [0, "-35%"],
              color: "#999"
            },
            detail: {
              color: "#DDFDFF",
              fontSize: 34,
              fontWeight: "bold",
              offsetCenter: [0, 0],
              formatter: function(val) {
                return val + `{unit|%}\n{a|${_this.chartText}}`;
              },
              rich: {
                unit: {
                  fontSize: 14,
                  color: "#DDFDFF",
                  paddingLeft: 10
                },
                a: {
                  fontSize: 14,
                  color: "#7EC3FA",
                  lineHeight: 20
                }
              }
            }
          },
          {
            center: ["50%", "50%"], // 仪表位置
            radius: "100%", //仪表大小
            splitLine: {
              show: false
            },
            pointer: {
              show: false
            }, //显示隐藏指针
            startAngle: opt.startF,
            endAngle: opt.endF,
            name: "业务指标",
            type: "gauge",
            // 去掉多余的分段
            splitNumber: 1,
            axisLine: {
              lineStyle: {
                width: 10,
                opacity: 0
              }
            },
            axisTick: {
              // 刻度长度与轴线宽度一致，达到分隔的效果
              length: 7,
              // 增加刻度密度
              splitNumber: opt.splitNumberF,
              lineStyle: {
                // 增加刻度宽度
                width: 1,
                color: '#0dc2fe'
                // color: {
                //   image: document.getElementById("bgimg"),
                //   repeat: "no-repeat"
                // }
              }
            },
            axisLabel: {
              show: false
            },
            title: {
              show: false
            },
            detail: {
              show: false
            },
            data: [
              {
                value: 50
                // name: '完成率'
              }
            ]
          }
        ]
      };
      return option;
    },
    swithBar(val) {
      var val = val > 100 ? 100 : val;
      var singleTick = 3.6;
      var opt = {
        splitNumberF: "",
        splitNumberB: "",
        startF: 90,
        endF: null,
        startB: null,
        endB: -270
      };
      var detailTick = singleTick * val;
      opt.splitNumberF = val;
      opt.splitNumberB = 100 - val;
      // if (detailTick > 90) {
      //     // opt.endB = 360 - detailTick;
      opt.endF =
        90 - detailTick > 0 ? 90 - detailTick - 4 : 90 - detailTick + 4;
      // } else {
      // opt.endB = 360 - detailTick;
      // opt.endF = 90 - detailTick;
      // }
      opt.startB = opt.endF;
      return opt;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.ChartRingSingle {
  width: 100%;
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
