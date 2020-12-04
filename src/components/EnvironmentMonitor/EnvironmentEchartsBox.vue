<template>
  <a-row class="echarts-content">
    <a-col :span="2"></a-col>
    <a-col :span="4" v-for="(item,index) in  echartsList" :key="index">
      <EnvironmentEchartsItem
        class="echarts-box"
        :legendData="item.legendData"
        :datalist="item.datalist"
        :xAxis="item.xAxis"
        :yAxisName="item.yAxisName"
        :id="'echartsBox'+index"
      ></EnvironmentEchartsItem>
    </a-col>
    <a-col :span="2"></a-col>
  </a-row>
</template>


<script>
import EnvironmentEchartsItem from "@/components/EnvironmentMonitor/EnvironmentEchartsItem.vue";

export default {
  components: {
    EnvironmentEchartsItem
  },
  props: {
    echartsList: Array
  }
};
</script>
