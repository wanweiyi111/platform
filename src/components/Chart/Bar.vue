<template>
  <div>
    <div
      :ref="bardata.ref"
      class="bar"
      :style="{height:chartHeight+'px'}"
      v-if="bardata.xArray.length>0"
    ></div>
  </div>
</template>
<script>
/**
 * 参数说明
 * bardata：{
 *   ref：string 唯一标识名,
 *   height: string 字符串
 *   textTitle: string  图标名称
 *   nameTitle: string  系列名称
 *   xArray: array X轴数据
 *   yArray：array Y轴数据
 *   colorArray: any  颜色
 * }
 */

import Echarts from "echarts";

export default {
  name: "Bar",
  props: {
    // id: String,
    bardata: {
      type: Object,
      default: () => {},
    },
    chartHeight: {
      type: Number,
      default: 215,
    },
  },
  data() {
    return {};
  },
  created() {},
  watch: {
    bardata: {
      handler(value) {
        this.drawBar(value);
      },
      deep: true,
    },
  },
  mounted() {
    console.log("mounted");
    this.$nextTick(() => {
      this.drawBar(this.bardata);
    });
    // this.drawLine();
  },
  methods: {
    drawBar(data) {
      let bar_dv = this.$refs[data.ref];
      if (bar_dv) {
        let barBox = Echarts.init(bar_dv);
        let option = {
          title: {
            text: data.textTitle,
            left: "center",
            top: 20,
            textStyle: {
              color: "rgba(255,255,255,.8)",
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          xAxis: [
            {
              type: "category",
              data: data.xArray,
              axisTick: {
                alignWithLabel: true,
              },
              axisLabel: {
                textStyle: {
                  color: "#fff",
                },
              },
            },
          ],
          yAxis: [
            {
              show: false,
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: { show: false },
              minorTick: { show: false },
              type: "value",
            },
          ],
          series: [
            {
              name: data.nameTitle,
              type: "bar",
              barWidth: "60%",
              data: data.yArray,
              itemStyle: {
                normal: {
                  color: data.colorArray,
                  label: {
                    show: true, //开启显示
                    position: "top", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "#fff",
                      fontSize: 12,
                    },
                    formatter: function (params) {
                      if (params.value > 0) {
                        return params.value;
                      } else {
                        return "";
                      }
                    },
                  },
                },
              },
              // barMinHeight: [2],
            },
          ],
          grid: {
            x: 15,
            y: 25,
            x2: 15,
            y2: 30,
          },
        };
        barBox.setOption(option, true);
        window.addEventListener("resize", () => {
          barBox.resize();
        });
      }
    },
  },
};
</script>