<template>
  <a-tabs :tabBarGutter="2">
    <a-tab-pane
      tab="用户统计报表"
      key="1"
    >
      <UserChart />
    </a-tab-pane>
    <a-tab-pane
      tab="WIFI统计报表"
      key="2"
    >
      <WifiChart />
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import baseMixin from "@/mixins/base.js";
import UserChart from "./UserChart.vue";
import WifiChart from "./WifiChart.vue";

export default {
  mixins: [baseMixin],
  components: {
    UserChart,
    WifiChart,
  },
  props: {},
  data() {
    return {
      value: [],
      linghtsOpt: {},
      params: {},
    };
  },
  created() {},
  methods: {},
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