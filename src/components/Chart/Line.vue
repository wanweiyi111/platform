<template>
  <div
    :ref="linedata.ref"
    class="line"
    :style="{height:chartHeight+'px'}"
    v-if="seriesArray"
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
  name: "chartLine",
  props: {
    // id: String,
    linedata: {
      type: Object,
      default: () => {},
    },
    chartHeight: {
      type: Number,
      default: 220,
    },
    seriesArray: {
      type: Array,
      default: () => [],
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
    seriesArray(val) {
      this.seriesArray = val;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.drawBar(this.linedata);
    });
  },
  methods: {
    drawBar(data) {
      let bar_dv = this.$refs[data.ref];
      if (bar_dv) {
        let barBox = Echarts.init(bar_dv);
        let option = {
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            data: data.xArray,
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
              data: data.seriesArray,
              type: "line",
              name: "连接人数",
              smooth: true,
              itemStyle: {
                color: "#2E8B57",
              },
            },
          ],
          grid: {
            x: 10,
            y: 10,
            x2: 10,
            y2: 30,
          },
        };
        barBox.setOption(option, true);
        window.addEventListener("resize", () => {
          barBox.resize();
          // barBox.resize({
          //   height: document.documentElement.clientHeight / 4 - 30,
          // });
        });
      }
    },
  },
};
</script>