<template>
  <section class="ctrl-light">
    <CtrlPanel :hide-title="true" class="bottom-sidebar high">
      <dd slot="content" class="pd-x10">
        <a-tabs :tabBarGutter="2" @change="changeTabs" :activeKey="tabKey">
          <a-tab-pane tab="巡检" key="1">
            <InspectTable />
          </a-tab-pane>
          <a-tab-pane tab="报表" key="2">
            <InspectCharts />
          </a-tab-pane>
        </a-tabs>
      </dd>
    </CtrlPanel>
  </section>
</template>

<script>
import utils from "@/utils";
import moment from "moment";
import CtrlPanel from "@/components/CtrlPanel.vue";
import InspectCharts from "@/components/WorkOrder/InspectCharts.vue";
import InspectTable from "@/components/WorkOrder/InspectTable.vue";
import baseMixin from "@/mixins/base.js";
import Log from "@/api/Log.js";

const log = new Log();

export default {
  mixins: [baseMixin],
  components: { CtrlPanel, InspectCharts, InspectTable },
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