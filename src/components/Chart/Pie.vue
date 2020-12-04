<template>
  <div
    :ref="bardata.ref"
    class="pie"
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
 *   seriesArray: array 饼状数据（多柱状显示） *必填
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
          legend: {
            orient: "vertical",
            right: "25",
            y: "center",
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              color: "#fff",
              borderRadius: 5,
            },
            // data: data.seriesName,
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          series: [
            {
              name: "数量",
              type: "pie",
              radius: [40, 60],
              center: ["35%", "50%"],
              roseType: "radius",
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: true,
                },
              },
              labelLine: {
                normal: {
                  length: 2,
                },
              },
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    formatter: "{d}%",
                  },
                  labelLine: { show: false },
                  color: function (params) {
                    //自定义颜色
                    let colorList = data.seriesColor;
                    return colorList[params.dataIndex];
                  },
                },
              },
              data: data.seriesArray,
            },
          ],
          grid: {
            x: 15,
            y: 15,
            x2: 70,
            y2: 15,
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