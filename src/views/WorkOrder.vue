<template>
  <section class="ctrl-light">
    <CtrlPanel :hide-title="true" class="bottom-sidebar high">
      <dd slot="content" class="pd-x10">
        <a-tabs :tabBarGutter="2" @change="changeTabs" :activeKey="tabKey">
          <a-tab-pane tab="工单信息" key="1">
            <OrderTable />
          </a-tab-pane>
          <a-tab-pane tab="报表" key="2">
            <OrderCharts />
          </a-tab-pane>
          <!-- <div slot="tabBarExtraContent" class="pd-t5">
            类型：
            <a-select
              class="mr5"
              size="small"
              defaultValue="a1"
              @change="changeType"
              placeholder="请选择"
            >
              <a-select-option key="a1" value="a1">请选择</a-select-option>
              <a-select-option v-for="(item, index) in typeList" :key="index" :value="item">{{item}}</a-select-option>
            </a-select>时间：
            <a-range-picker
              :format="dateFormat"
              showTime
              size="small"
              class="mr5"
              style="width: 200px;"
              @change="changeDateRange"
            />
            <a-input-search
              @keydown.enter="startSearch"
              placeholder="请输入关键词"
              size="small"
              style="width: 130px;"
            />
          </div>-->
        </a-tabs>
      </dd>
    </CtrlPanel>
  </section>
</template>

<script>
import utils from "@/utils";
import moment from "moment";
import CtrlPanel from "@/components/CtrlPanel.vue";
import OrderCharts from "@/components/WorkOrder/OrderCharts.vue";
import OrderTable from "@/components/WorkOrder/OrderTable.vue";
import baseMixin from "@/mixins/base.js";
import Log from "@/api/Log.js";

const log = new Log();

export default {
  mixins: [baseMixin],
  components: { CtrlPanel, OrderCharts, OrderTable },
  data() {
    return {
      dateFormat: "YYYY/MM/DD",
      tabKey: "1"
    };
  },
  created() {},
  methods: {
    moment,
    changeTabs(key) {
      this.tabKey = key;
    }
  }
};
</script>