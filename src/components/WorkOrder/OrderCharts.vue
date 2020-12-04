<template>
  <!-- 新建/编辑分组 -->
  <a-row class="orderCharts">
    <div class="selectTime">
      时间：
      <a-range-picker
        showTime
        size="small"
        class="mr5"
        style="width: 200px;"
        @change="changeDateRange"
        :placeholder="['开始时间', '结束时间']"
      />
    </div>
    <a-col :span="8" class="leftPart">
      <ChartRing
        :option="orderorderCharts"
        id="orderCharts"
        :num="24"
        :showNotice="true"
        :showTime="true"
        modelName
      ></ChartRing>
    </a-col>
    <a-col :span="14" class="rightPart">
      <ChartRing
        :option="trendOpt"
        id="orderTrendCharts"
        :num="24"
        :showNotice="true"
        :showTime="true"
        modelName
      ></ChartRing>
    </a-col>
  </a-row>
</template>

<script>
import utils from "@/utils/";
import Log from "@/api/Log";
import baseMixin from "@/mixins/base.js";
import ChartRing from "@/components/common/ChartRing.vue";

let api = new Log();

export default {
  mixins: [baseMixin],
  components: {
    ChartRing
  },
  props: {
    visible: Boolean,
    modalTitle: String
  },
  data() {
    return {
      orderorderCharts: {},
      trendOpt: {},
      submitObj: {
        plantCompletionTime: "",
        actualCompletionTime: ""
      }
    };
  },
  created() {
    this.loadList("ringChart");
    this.getDeviceLightReport();
  },
  mounted() {},
  methods: {
    // 环境监测
    async getDeviceLightReport() {
      let xAxisData = [];
      let res = await api.trendChart(this.submitObj).catch(err => {
        console.log(err);
      });

      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning(res);
        return;
      }
      let _trendOpt = {
        grid: {
          top: "8%",
          left: "0",
          right: "0",
          bottom: "8%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: true,
              lineStyle: {
                color: "#f9f9f9"
              }
            },
            axisLabel: {
              show: true,
              //坐标轴刻度标签的相关设置
              textStyle: {
                color: "#d1e6eb"
              }
            },
            axisTick: {
              show: true
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: "value",
            min: 0,
            max: 4,
            splitNumber: 4,
            splitLine: {
              show: true,
              lineStyle: {
                color: "#0a3256"
              }
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              margin: 20,
              textStyle: {
                color: "#d1e6eb"
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "",
            type: "line",
            smooth: true, //是否平滑曲线显示
            // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbol: "emptyCircle",
            symbolSize: 6,
            lineStyle: {
              normal: {
                color: "#FF7373" // 线条颜色
              },
              borderColor: "#f0f"
            },
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#fff"
              }
            },
            itemStyle: {
              normal: {
                color: "#FF7373"
              }
            },
            tooltip: {
              show: false
            },
            data: []
          },
          {
            name: "",
            type: "line",
            smooth: true, //是否平滑曲线显示
            // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbol: "emptyCircle",
            symbolSize: 6,
            lineStyle: {
              normal: {
                color: "#00A8DA" // 线条颜色
              },
              borderColor: "#f0f"
            },
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#fff"
              }
            },
            itemStyle: {
              normal: {
                color: "#00A8DA"
              }
            },
            tooltip: {
              show: false
            },
            data: []
          },
          {
            name: "",
            type: "line",
            smooth: true, //是否平滑曲线显示
            // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbol: "emptyCircle",
            symbolSize: 6,
            lineStyle: {
              normal: {
                color: "#FFBF04" // 线条颜色
              },
              borderColor: "#f0f"
            },
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#fff"
              }
            },
            itemStyle: {
              normal: {
                color: "#FFBF04"
              }
            },
            tooltip: {
              show: false
            },
            data: []
          },
          {
            name: "",
            type: "line",
            smooth: true, //是否平滑曲线显示
            // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbol: "emptyCircle",
            symbolSize: 6,
            lineStyle: {
              normal: {
                color: "#80B100" // 线条颜色
              },
              borderColor: "#f0f"
            },
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#fff"
              }
            },
            itemStyle: {
              normal: {
                color: "#80B100"
              }
            },
            tooltip: {
              show: false
            },
            data: []
          }
        ]
      };
      res.data.data.map(item => {
        _trendOpt.xAxis[0].data.push(utils.toTime(item.createTime));
        _trendOpt.series[0].data.push(item.appointState);
        _trendOpt.series[1].data.push(item.approveState);
        _trendOpt.series[2].data.push(item.processState);
        _trendOpt.series[3].data.push(item.compleState);
      });
      this.trendOpt = _trendOpt;
    },
    changeDateRange(dates) {
      this.submitObj.plantCompletionTime = dates[0].format(utils.fsTime);
      this.submitObj.actualCompletionTime = dates[1].format(utils.fsTime);
      this.loadList("ringChart");
      this.getDeviceLightReport();
      // this.loadList("sheetList", this.pagination, {
      //   plantCompletionTime: dates[0].format(utils.fsDate),
      //   actualCompletionTime: dates[1].format(utils.fsDate)
      // });
    },
    async loadList(type, data, val) {
      let opt = Object.assign(
        {
          projectId: this.projectId
        },
        val
      );
      let res = await api[type](this.submitObj).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      let _list = res.data.list || res.data;
      this.setOpts(_list.data);
    },
    setOpts(data) {
      let onTotal = 0;
      for (let i in data) {
        onTotal =
          data[i]["appointState"] +
          data[i]["approveState"] +
          data[i]["rejectState"] +
          data[i]["processState"] +
          data[i]["compleState"];
        let deviceOpt = {
          title: {
            subtext: onTotal,
            textStyle: {
              color: "#f2f2f2",
              fontSize: 40
              // align: 'center'
            },
            subtextStyle: {
              fontSize: 30,
              color: ["#ff9d19"]
            },
            x: "center",
            y: "center"
          },
          series: [
            {
              type: "pie",
              center: ["50%", "50%"], // 仪表位置
              radius: ["40%", "65%"],
              avoidLabelOverlap: false,
              label: {
                // normal: {
                //   show: true,
                //   formatter: "{a|" + onTotal + "}",
                //   rich: {
                //     c: {
                //       color: "#38AEE0",
                //       fontSize: 11,
                //       lineHeight: 30,
                //       align: "center"
                //     },
                //     a: {
                //       fontSize: 24,
                //       align: "center",
                //       color: "#FFF"
                //     }
                //   },
                //   textStyle: {
                //     fontSize: 11,
                //     fontWeight: "bold"
                //   },
                //   position: "center"
                // },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: "12",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: true,
                  length: 10,
                  length2: 15
                },
                emphasis: {
                  show: true
                }
              },
              data: [
                {
                  value: data[i].rejectState,
                  name: "已拒绝",
                  itemStyle: {
                    color: "#57e7ec"
                  }
                },
                {
                  value: data[i].compleState,
                  name: "已完成",
                  itemStyle: {
                    color: "#80B100"
                  }
                },
                {
                  value: data[i].approveState,
                  name: "待指派",
                  itemStyle: {
                    color: "#FF7373"
                  }
                },
                {
                  value: data[i].appointState,
                  name: "处理中",
                  itemStyle: {
                    color: "#FFBF04"
                  }
                },
                {
                  value: data[i].processState,
                  name: "审核中",
                  itemStyle: {
                    color: "#00A8DA"
                  }
                }
              ]
            }
          ]
        };
        this["orderorderCharts"] = deviceOpt;
      }
    }
  }
};
</script>
<style lang="less">
.orderCharts {
  margin-top: 22px;
  position: relative;
  .selectTime {
    position: absolute;
    right: 0;
    top: -30px;
  }
  .leftPart,
  .rightPart {
    height: 100%;
    &.leftPart {
      margin-right: 10px;
    }
    .echartItem {
      height: 400px;
    }
  }
}
</style>