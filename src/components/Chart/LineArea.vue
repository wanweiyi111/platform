<template>
  <div
    :ref="linedata.ref"
    class="line"
    :style="{height:chartHeight+'px'}"
    v-if="linedata.seriesArray.length>0"
  ></div>
</template>
<script>
/**
 * 参数说明
 * linedata{
 *   ref：string 唯一标识名,
 *   textTitle: string  图标名称
 *   nameTitle: string  系列名称
 *   xArray: array X轴数据
 *   seriesArray：array Y轴数据
 *   colorArray: any  颜色
 * }
 */
import Echarts from "echarts";

export default {
  name: "LineArea",
  props: {
    // id: String,
    linedata: {
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
    linedata: {
      handler(value) {
        this.drawBar(value);
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.drawBar(this.linedata);
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
            text: "KW/H",
            textStyle: {
              color: "rgba(255, 255, 255, 0.8)",
              // fontStyle: "italic",
              fontSize: 12,
            },
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: data.xArray,
            axisTick: {
              // alignWithLabel: true,
            },
            axisLabel: {
              textStyle: {
                color: "#fff",
              },
            },
          },
          yAxis: {
            type: "value",
            show: false,
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            minorTick: { show: false },
          },
          series: [
            {
              name: "能耗",
              data: data.seriesArray,
              type: "line",
              itemStyle: {
                color: "#8961fa",
              },
              areaStyle: {
                color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#8961fa",
                  },
                  {
                    offset: 1,
                    color: "#3c4db1",
                  },
                ]),
              },
              smooth: true,
            },
          ],
          grid: {
            x: 15,
            y: 15,
            x2: 15,
            y2: 25,
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