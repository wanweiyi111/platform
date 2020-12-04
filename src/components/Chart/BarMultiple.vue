<template>
  <div
    :ref="bardata.ref"
    class="bar"
    :style="{height:chartHeight+'px'}"
    v-if="bardata.seriesArray.length>0"
  ></div>
</template>
<script>
/**
 * 参数说明
 * bardata：{
 *   ref：string 唯一标识名,                 *必填
 *   textTitle: string  图标名称
 *   nameTitle: string  系列名称
 *   xArray: array X轴数据                  *必填
 *   seriesName: array 列名称               *必填
 *   seriesColor: any  列颜色               *必填
 *   seriesArray: array 列数据（多柱状显示） *必填
 * }
 */
import Echarts from "echarts";

export default {
  name: "BarMultiple",
  props: {
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
    this.$nextTick(() => {
      this.drawBar(this.bardata);
    });
  },
  methods: {
    drawBar(data) {
      let bar_dv = this.$refs[data.ref];
      if (bar_dv) {
        let barBox = Echarts.init(bar_dv);
        let option = {
          color: data.seriesColor,
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          legend: {
            x: "center",
            y: "bottom",
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              color: "#fff",
              borderRadius: 5,
            },
            data: data.seriesName,
          },
          xAxis: [
            {
              type: "category",
              axisTick: { show: false },
              data: data.xArray,
              axisLabel: {
                textStyle: {
                  color: "#fff",
                },
                fontSize: 10,
                interval: 0,
                rotate: 40,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              show: false,
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: { show: false },
              minorTick: { show: false },
            },
          ],
          series: data.seriesArray,
          grid: {
            x: 10,
            y: 25,
            x2: 10,
            y2: 75,
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