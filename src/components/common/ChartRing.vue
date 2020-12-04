<template>
  <a-col :span="num" class="acol">
    <div :id="id" :style="style"></div>
    <span class="notice" v-if="showNotice">{{modelName}}</span>
    <div class="sleTime" v-if="!(showTime||false)">
      <span :class="DateType==='week'?'week active':'week'" @click="selType('week')">周</span>
      <span :class="DateType==='month'?'month active':'month'" @click="selType('month')">月</span>
    </div>
  </a-col>
</template>

<script>
/**
 * @description 加法运算
 * @param {Object} option echart配置参数
 * @param {Num} num 显示相对于父组件宽度
 * @return {BOOL} showNotice 是否显示提示
 * @return {BOOL} showTime 是否显示时间
 */
import _ from "lodash";
import echarts from "echarts";

let myChart = null;

export default {
  props: {
    id: String,
    option: {
      type: Object,
      default: () => {}
    },
    num: Number,
    showNotice: {
      type: Boolean
    },
    showTime: Boolean,
    modelName: String,
    height: String,
    chooseType: Function
  },
  data() {
    return {
      Option: this.option,
      DateType: "week",
      style: {
        width: "100%",
        height: this.height ? this.height : "100px"
      }
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
    selType(type) {
      this.DateType = type;
      this.chooseType(type);
    },
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
// .ChartRing {
//   width: 90px;
//   height: 90px;
//   font-size: 14px;
//   color: #ddfdff;
//   text-align: center;
//   float: left;
.notice {
  display: inline-block;
  margin-top: -10px;
}
.echartItem {
  width: 100%;
  height: 90px;
}
.echartItemLight {
  width: 100%;
  height: 200px;
}
.acol {
  .notice {
    display: inline-block;
    margin-top: 10px;
    width: 100%;
    text-align: center;
    color: #ddfdff;
  }
  .sleTime {
    width: 116px;
    margin: 0 auto;
    span {
      display: inline-block;
      margin: 0 10px;
      width: 38px;
      height: 20px;
      line-height: 20px;
      background: rgba(0, 41, 115, 0.1);
      box-shadow: inset 0 0 3px 0 #3576d2;
      border-top-right-radius: 5px;
      border-bottom-left-radius: 4px;
      cursor: pointer;
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #589dff;
      cursor: pointer;
      &.active {
        background: rgba(151, 233, 255, 0.1);
        box-shadow: inset 0 0 3px 0 rgba(59, 249, 251, 0.5);
        font-size: 13px;
        color: #3bf9fb;
      }
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
// }
</style>
