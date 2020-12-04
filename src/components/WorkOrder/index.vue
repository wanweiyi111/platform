<template>
  <!-- 新建/编辑分组 -->
  <div class="orderTable">
    <OrderCharts />
    <OrderTable />
  </div>
</template>

<script>
import Log from "@/api/Log";
import baseMixin from "@/mixins/base.js";
import OrderCharts from "./OrderCharts.vue";
import OrderTable from "./OrderTable.vue";

let api = new Log();

export default {
  mixins: [baseMixin],
  components: {
    OrderCharts,
    OrderTable
  },
  props: {
    visible: Boolean,
    modalTitle: String
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang="less">
.orderCharts {
  margin-top: 22px;
}
</style>