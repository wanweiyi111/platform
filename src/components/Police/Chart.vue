<template>
  <ChartRing
    :option="linghtsOpt"
    id="PayChart"
    :num="24"
    :showNotice="false"
    height="550px"
    :showTime="true"
  ></ChartRing>
</template>

<script>
import ChartRing from "@/components/common/ChartRing.vue";
import echarts from "echarts";
import Api from "@/api/Police.js";
import baseMixin from "@/mixins/base.js";
const api = new Api();

export default {
  mixins: [baseMixin],
  components: {
    ChartRing
  },
  props: {},
  data() {
    return {
      value: [],
      linghtsOpt: {},
      params:{}
    };
  },
  created() {
    this.getDeviceLightReport({});
  },
  methods: {
    // 环境监测
    // 环境监测
    async getDeviceLightReport(obj) {
      // let startBar = type === 'week' ? 0 : 80
      let opt = Object.assign(obj, { projectId: this.projectId });
      let res = await api.findEventHandlerCount(opt).catch(err => {
        console.log(err);
      });

      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning(res.msg);
        return;
      }
      let _linghtsOpt = {
        grid: {
          top: "12%",
          left: "0",
          right: "0",
          bottom: "8%",
          containLabel: true
        },
        legend: {
          //图例组件，颜色和名字
          right: "10%",
          top: "0",
          itemGap: 16,
          itemWidth: 18,
          itemHeight: 10,
          data: [
            {
              name: "报警数量"
              //icon:'image://../wwwroot/js/url2.png', //路径
            },
            {
              name: "处理数量"
            }
          ],
          textStyle: {
            color: "#a8aab0",
            fontStyle: "normal",
            fontFamily: "微软雅黑",
            fontSize: 12
          }
        },
        tooltip: {
          //提示框组件
          trigger: "axis",
          formatter: "{b}<br />{a0}: {c0}<br />{a1}: {c1}",
          axisPointer: {
            type: "shadow",
            label: {
              backgroundColor: "#6a7985"
            }
          },
          textStyle: {
            color: "#fff",
            fontStyle: "normal",
            fontFamily: "微软雅黑",
            fontSize: 12
          }
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              //		interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
              //	margin:15,
              textStyle: {
                color: "#98FEFF",
                fontStyle: "normal",
                fontFamily: "微软雅黑",
                fontSize: 12
              },
              rotate: 50
            },
            axisTick: {
              //坐标轴刻度相关设置。
              show: false
            },
            axisLine: {
              //坐标轴轴线相关设置
              lineStyle: {
                color: "#fff",
                opacity: 0.2
              }
            },
            splitLine: {
              //坐标轴在 grid 区域中的分隔线。
              show: false
            }
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
            name: "报警数量",
            type: "line",
            smooth: true, //是否平滑曲线显示
            // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbol: "emptyCircle",
            symbolSize: 6,
            lineStyle: {
              normal: {
                color: "#EE6723" // 线条颜色
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
                color: "#EE6723"
              }
            },
            tooltip: {
              show: false
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0,154,120,1)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0,0,0, 0)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(53,142,215, 0.9)", //阴影颜色
                shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              }
            },
            data: []
          },
          {
            name: "处理数量",
            type: "line",
            smooth: true, //是否平滑曲线显示
            // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbol: "emptyCircle",
            symbolSize: 6,
            lineStyle: {
              normal: {
                color: "#4cd0f8" // 线条颜色
              },
              borderColor: "#f0f"
            },
            label: {
              show: false,
              position: "top",
              textStyle: {
                color: "#fff"
              }
            },
            itemStyle: {
              normal: {
                color: "#4cd0f8"
              }
            },
            tooltip: {
              show: false
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0,154,120,1)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0,0,0, 0)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(53,142,215, 0.9)", //阴影颜色
                shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              }
            },
            data: []
          }
        ]
      };
      _linghtsOpt.yAxis[0].min = res.data.yaxis[0];
      _linghtsOpt.yAxis[0].max = res.data.yaxis[1];
      _linghtsOpt.xAxis[0].data = res.data.queryDate;
      _linghtsOpt.series[0].data = res.data.handleList;
      _linghtsOpt.series[1].data = res.data.completedList;
      this.linghtsOpt = _linghtsOpt;
    }
  }
};
</script>

<style lang="less" scoped>
.TurnoverRateBox {
  height: 200px;
  .etcChartBox {
    position: relative;
    .searchData {
      position: absolute;
      top: 10px;
      right: 0;
      .form-row {
        & > div {
          display: inline-block;
          margin-right: 15px;
        }
        .payType {
          width: 80px;
        }
        .timeRange {
          width: 200px;
        }
      }
    }
  }
}
</style>