<template>
  <div class="BottomBox">
    <a-row
      type="flex"
      justify="space-around"
      align="middle"
      class="BottomMenu"
    >
      <a-col
        :span="6"
        class="acolContainer"
      >
        <Box title="设备概况">
          <a-carousel arrows>
            <div
              slot="prevArrow"
              slot-scope="props"
              class="custom-slick-arrow"
              style="left: 10px;zIndex: 1"
            >
              <a-icon type="left-circle" />
            </div>
            <div
              slot="nextArrow"
              slot-scope="props"
              class="custom-slick-arrow"
              style="right: 10px"
            >
              <a-icon type="right-circle" />
            </div>
            <a-row
              type="flex"
              justify="space-around"
              align="middle"
              class="arow"
            >
              <ChartRing
                :option="deviceOpt"
                id="linghts"
                :num="8"
                v-bind:showNotice="true"
              ></ChartRing>
              <ChartRing
                :option="deviceOpt"
                id="wifi"
                :num="8"
                v-bind:showNotice="true"
              ></ChartRing>
              <ChartRing
                :option="deviceOpt"
                id="display"
                :num="8"
                v-bind:showNotice="true"
              ></ChartRing>
            </a-row>
            <a-row
              type="flex"
              justify="space-around"
              align="middle"
              class="arow"
            >
              <ChartRing
                :option="wifiOpt"
                id="wifiBox"
                :num="8"
                v-bind:showNotice="true"
              ></ChartRing>
            </a-row>
          </a-carousel>
        </Box>
      </a-col>
      <a-col
        :span="6"
        class="acolContainer"
      >
        <Box title="照明节能">
          <a-row
            type="flex"
            justify="space-around"
            align="middle"
            class="arow linght"
          >
            <ChartRing
              :option="linghtsOpt"
              id="lingtsInfoBox"
              :num="24"
              v-bind:showNotice="false"
              :chooseType="chooseType"
            ></ChartRing>
          </a-row>
        </Box>
      </a-col>
      <a-col
        :span="6"
        class="acolContainer"
      >
        <Box
          title="公共WIFI"
          v-bind:showNotice="false"
        >
          <a-row
            type="flex"
            justify="space-around"
            align="middle"
            class="arow wifi"
          >
            <ChartRing
              :option="wifiOpt"
              id="wifiInfoBox"
              :num="24"
              v-bind:showNotice="false"
            ></ChartRing>
          </a-row>
        </Box>
      </a-col>
      <a-col
        :span="6"
        class="acolContainer"
      >
        <Box
          title="安防监控"
          v-bind:showNotice="false"
        >
          <a-row
            type="flex"
            justify="space-around"
            align="middle"
            class="arow wifi"
          ></a-row>
        </Box>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Box from "@/components/Box.vue"; // @ is an alias to /src
import ChartRing from "@/components/common/ChartRing.vue"; // @ is an alias to /src
import echarts from "echarts";

import { Carousel } from "ant-design-vue";

export default {
  components: {
    Box,
    ChartRing,
    aCarousel: Carousel,
  },
  data() {
    return {
      deviceOpt: this.setOpt(),
      linghtsOpt: {
        grid: {
          top: "8%",
          left: "1%",
          right: "1%",
          bottom: "8%",
          containLabel: true,
        },

        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: false,
              lineStyle: {
                color: "#f9f9f9",
              },
            },
            axisLabel: {
              show: false,
              //坐标轴刻度标签的相关设置
              textStyle: {
                color: "#d1e6eb",
                margin: 15,
              },
            },
            axisTick: {
              show: false,
            },
            data: ["19/01", "19/01", "19/01", "19/01", "19/01", "19/01"],
          },
        ],
        yAxis: [
          {
            type: "value",
            min: 0,
            max: 4,
            splitNumber: 7,
            splitLine: {
              show: true,
              lineStyle: {
                color: "#0a3256",
              },
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              margin: 20,
              textStyle: {
                color: "#d1e6eb",
              },
            },
            axisTick: {
              show: false,
            },
          },
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
                color: "#28ffb3", // 线条颜色
              },
              borderColor: "#f0f",
            },
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#fff",
              },
            },
            itemStyle: {
              normal: {
                color: "#28ffb3",
              },
            },
            tooltip: {
              show: false,
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
                      color: "rgba(0,154,120,1)",
                    },
                    {
                      offset: 1,
                      color: "rgba(0,0,0, 0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(53,142,215, 0.9)", //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              },
            },
            data: [1, 0, 3, 4, 1.4, 2.4, 3.4],
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
                color: "#28ffb3", // 线条颜色
              },
              borderColor: "#f0f",
            },
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#fff",
              },
            },
            itemStyle: {
              normal: {
                color: "#28ffb3",
              },
            },
            tooltip: {
              show: false,
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
                      color: "rgba(0,154,120,1)",
                    },
                    {
                      offset: 1,
                      color: "rgba(0,0,0, 0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(53,142,215, 0.9)", //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              },
            },
            data: [0, 3, 3, 4, 2, 3, 2.9],
          },
          {
            name: "",
            type: "bar",
            barWidth: 20,
            tooltip: {
              show: false,
            },
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#fff",
              },
            },
            itemStyle: {
              normal: {
                barBorderRadius: 3,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#14c8d4",
                  },
                  {
                    offset: 1,
                    color: "#43eec6",
                  },
                ]),
                // color: function(params) {
                //   var colorList = [
                //     "#0ec1ff",
                //     "#10cdff",
                //     "#12daff",
                //     "#15ebff",
                //     "#17f8ff",
                //     "#1cfffb",
                //     "#1dfff1"
                //   ];
                //   return colorList[params.dataIndex];
                // }
              },
            },
            data: [4, 3, 4, 2, 1, 3.5, 2.8],
          },
        ],
      },
      wifiOpt: {
        grid: {
          top: "8%",
          left: "1%",
          right: "1%",
          bottom: "8%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: false,
              lineStyle: {
                color: "#233e64",
              },
            },
            axisLabel: {
              show: false,
              //坐标轴刻度标签的相关设置
              textStyle: {
                color: "#6a9cd5",
                margin: 15,
              },
            },
            axisTick: { show: false },
            data: ["0", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7"],
          },
        ],
        yAxis: [
          {
            type: "value",
            min: 0,
            max: 140,
            splitNumber: 7,
            splitLine: {
              show: false,
              lineStyle: {
                color: "#233e64",
              },
            },
            axisLine: { show: false },
            axisLabel: {
              margin: 20,
              textStyle: {
                color: "#6a9cd5",
              },
            },
            axisTick: { show: false },
          },
        ],
        series: [
          {
            name: "异常流量",
            type: "line",
            smooth: true, //是否平滑曲线显示
            // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
            symbolSize: 0,

            lineStyle: {
              normal: {
                color: "#3deaff", // 线条颜色
              },
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
                    { offset: 0, color: "rgba(61,234,255, 0.9)" },
                    { offset: 0.7, color: "rgba(61,234,255, 0)" },
                  ],
                  false
                ),

                shadowColor: "rgba(53,142,215, 0.9)", //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              },
            },
            data: [0, 105, 84, 125, 110, 92, 98],
          },
          {
            name: "异常流量",
            type: "line",
            smooth: true, //是否平滑曲线显示
            // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
            symbolSize: 0,

            lineStyle: {
              normal: {
                color: "#3deaff", // 线条颜色
              },
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
                    { offset: 0, color: "rgba(61,234,255, 0.9)" },
                    { offset: 0.7, color: "rgba(61,234,255, 0)" },
                  ],
                  false
                ),

                shadowColor: "rgba(53,142,215, 0.9)", //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              },
            },
            data: [0, 120, 100, 110, 60, 30, 98],
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    /**设置echart 饼图配置值**/
    setOpt() {
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        series: [
          {
            type: "pie",
            center: ["50%", "50%"], // 仪表位置
            radius: ["100%", "80%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center",
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold",
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
            ],
          },
        ],
      };

      return option;
    },
  },
};
</script>
<style lang="less" scoped>
.arow {
  padding: 10px 0 20px 0;
  height: 100%;
}
.linght.arow {
  padding-top: 0;
}
.wifi.arow {
  padding-top: 0;
  // margin-top: -60px;
}
.BottomMenu {
  width: 100%;
  // padding-right: 50px;
  // height: 235px;
  // position: fixed;
  // bottom: 30px;
  // left: 25px;
  .width32 {
    width: 32%;
  }

  .acolContainer {
    position: absolute;
    bottom: 0;
    &:nth-child(3),
    &:nth-child(4) {
      bottom: 280px;
    }
    &:nth-child(odd) {
      right: 20px;
    }
    &:nth-child(even) {
      left: 20px;
    }
  }
}
</style>

