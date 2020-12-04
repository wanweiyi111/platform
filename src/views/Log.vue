<template>
  <section class="ctrl-light">
    <CtrlPanel
      :hide-title="true"
      class="bottom-sidebar high"
    >
      <dd
        slot="content"
        class="pd-x10"
      >
        <a-tabs
          :tabBarGutter="2"
          @change="changeTabs"
          :activeKey="tabKey"
        >
          <a-tab-pane
            tab="登录日志"
            key="1"
          >
            <LogTable
              :tabKey="tabKey"
              :queryObj="queryObj"
              ref="table1"
            ></LogTable>
          </a-tab-pane>
          <a-tab-pane
            tab="操作日志"
            key="2"
          >
            <LogTable
              :tabKey="tabKey"
              :queryObj="queryObj"
              ref="table2"
            ></LogTable>
          </a-tab-pane>
          <a-tab-pane
            tab="异常日志"
            key="3"
          >
            <LogTable
              :tabKey="tabKey"
              :queryObj="queryObj"
              ref="table3"
            ></LogTable>
          </a-tab-pane>
          <a-tab-pane
            tab="应用日志"
            key="4"
          >
            <LogTable
              :tabKey="tabKey"
              :queryObj="queryObj"
              ref="table4"
            ></LogTable>
          </a-tab-pane>
          <a-tab-pane
            tab="指令执行日志"
            key="5"
          >
            <LogTable
              :tabKey="tabKey"
              :queryObj="queryObj"
              ref="table5"
            ></LogTable>
          </a-tab-pane>
          <div
            slot="tabBarExtraContent"
            class="pd-t5"
          >
            类型：
            <a-select
              class="mr5"
              style="width: 110px;"
              size="small"
              defaultValue="a1"
              @change="changeType"
              placeholder="请选择"
            >
              <a-select-option
                key="a1"
                value="a1"
              >请选择</a-select-option>
              <a-select-option
                v-for="(item, index) in typeList"
                :key="index"
                :value="item"
              >{{item}}</a-select-option>
            </a-select>时间：
            <a-range-picker
              :format="dateFormat"
              showTime
              size="small"
              class="mr5"
              style="width: 200px;"
              @change="changeDateRange"
              :placeholder="['开始时间', '结束时间']"
            />
            <a-input-search
              @keydown.enter="startSearch"
              placeholder="请输入关键词"
              size="small"
              style="width: 130px;"
            />
          </div>
        </a-tabs>
      </dd>
    </CtrlPanel>
  </section>
</template>

<script>
import utils from "@/utils";
import moment from "moment";
import CtrlPanel from "@/components/CtrlPanel.vue";
import LogTable from "@/components/LogTable.vue";
import baseMixin from "@/mixins/base.js";
import Log from "@/api/Log.js";
import { EquipmentTypeEnum } from "@/utils/enum.js";

const log = new Log();

export default {
  mixins: [baseMixin],
  components: { CtrlPanel, LogTable },
  data() {
    return {
      dateFormat: "YYYY/MM/DD",
      tabKey: "1",
      typeList: [],
    };
  },
  created() {},
  methods: {
    moment,
    reloadTable() {
      this.$refs["table" + this.tabKey].LoadLogList();
    },
    changeDateRange(dates) {
      try {
        this.queryObj.beginDate = dates[0].format(utils.fsTime);
        this.queryObj.startDate = dates[0].format(utils.fsTime);
        this.queryObj.endDate = dates[1].format(utils.fsTime);
        this.reloadTable();
      } catch (err) {
        console.info(err);
      }
      // console.log(this.queryObj, dates);
    },
    changeTabs(key) {
      this.tabKey = key;
      this.loadTypes();
    },
    startSearch(ev) {
      // debugger;
      const searchKeyMap = {
        1: "",
        2: "record",
        3: "detail",
        4: "record",
        5: "searchText",
      };
      this.queryObj[searchKeyMap[this.tabKey]] = ev.target.value;
      this.reloadTable();
    },
    changeType(val) {
      val = val === "a1" ? "" : val;
      if (this.tabKey === "3") {
        this.queryObj.level = val;
      } else if (this.tabKey === "2" || this.tabKey === "4") {
        this.queryObj.type = val;
      } else if (this.tabKey === "5") {
        this.queryObj.equipmentType = val;
      }
      this.queryObj.projectId = this.projectId;
      if (!val) {
        delete this.queryObj.level;
        delete this.queryObj.type;
      }
      this.reloadTable();
    },
    async loadTypes() {
      if (this.tabKey === "5") {
        this.typeList = Object.values(EquipmentTypeEnum);
        return;
      }
      const funcMap = {
        1: "",
        2: "operationsTypes",
        3: "exceptionsLevels",
        4: "applicationsTypes",
        5: "",
      };
      try {
        let res = await log[funcMap[this.tabKey]]();
        if (res.code !== "200") {
          this.typeList = [];
          return;
        }
        this.typeList = res.data;
      } catch (err) {
        this.typeList = [];
        console.info(err);
      }
    },
  },
};
</script>