<template>
  <div :id="id" class="echarts-item"></div>
</template>

<script>
import _ from "lodash";
import echarts from "echarts";

let myChart = null;
export default {
  props: {
    id: String,
    option: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      Option: this.option
    };
  },
  watch: {
    option() {
      this.Option = this.option;
      this.loadEcharts();
    }
  },

  mounted() {
    this.loadEcharts();
  },

  methods: {
    loadEcharts(val) {
      let dom = document.getElementById(this.id);
      if (_.isElement(dom)) {
        myChart = echarts.init(dom);
        let _option = val ? val : this.Option;
        if (_option && typeof _option === "object") {
          myChart.setOption(_option, true);
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
.echarts-item {
  width: 100%;
  height: 100%;
}
</style>
