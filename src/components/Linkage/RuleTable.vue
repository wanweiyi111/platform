<template>
  <a-table
    :pagination="false"
    :columns="columns"
    :dataSource="ruleList"
    :rowKey="record => record.id"
    class="rule-table"
  >
    <div slot="devices" slot-scope="text, record">
      <i :class="['mr5', 'iconfont', 'icon'+record.triggerIconfont]"></i>
      <i class="iconfont iconlong-arrow-right mr5"></i>
      <i :class="['iconfont', 'icon'+record.actionIconfont]"></i>
    </div>
    <div v-if="isEdit" slot="trigger" slot-scope="text, record, index">
      <i :class="['iconfont', 'mr5', 'icon' + record.triggerIconfont]"></i>
      <a-select
        v-model="ruleList[index].triggerId"
        defaultValue="ruleList[index].triggerId"
        size="small"
        style="width: 140px;"
      >
        <a-select-option
          v-for="item in triggerList(record.triggerEquipmentType)"
          :key="item.triggerId"
          :value="item.triggerId"
        >{{item.triggerName}}</a-select-option>
      </a-select>
    </div>
    <div v-else slot="trigger" slot-scope="text, record">{{record.triggerName}}</div>
    <div v-if="isEdit" slot="action" slot-scope="text, record, index">
      <i :class="['iconfont', 'mr5', 'icon'+record.triggerIconfont]"></i>
      <a-select v-model="ruleList[index].actionId" size="small" style="width: 140px;">
        <a-select-option
          v-for="item in actionList(record.actionEquipmentType)"
          :key="item.actionId"
          :value="item.actionId"
        >{{item.actionName}}</a-select-option>
      </a-select>
    </div>
    <div v-else slot="action" slot-scope="text, record">{{record.actionName}}</div>
    <div slot="operation" slot-scope="text, record">
      <a href="javascript:;" @click="deleteRule(record)">
        <i class="iconfont icontimes"></i>
      </a>
    </div>
  </a-table>
</template>
<script>
import _ from "lodash";
import { mapActions, mapGetters } from "vuex";
import utils from "@/utils";

const columns1 = [
  {
    title: "联动设备",
    scopedSlots: { customRender: "devices" }
  },
  {
    title: "触发条件",
    scopedSlots: { customRender: "trigger" }
  },
  {
    title: "执行动作",
    scopedSlots: { customRender: "action" }
  }
];

const columns2 = [
  {
    title: "联动设备",
    scopedSlots: { customRender: "devices" }
  },
  {
    title: "智慧杆1触发条件",
    scopedSlots: { customRender: "trigger" }
  },
  {
    title: "智慧杆2执行动作",
    scopedSlots: { customRender: "action" }
  }
];

export default {
  name: "RuleTable",
  props: {
    type: {
      type: String,
      default: "1"
    },
    ruleList: {
      type: Array,
      required: true
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      columns: this.type == "1" ? columns1 : columns2
    };
  },
  computed: {
    ...mapGetters(["triggerList", "actionList"])
  },
  created() {
    if (!_.isEmpty(this.ruleList)) {
      this.formatRule();
    }
    if (
      this.isEdit &&
      this.columns.findIndex(val => val.title === "操作") === -1
    ) {
      this.columns.push({
        title: "操作",
        scopedSlots: { customRender: "operation" }
      });
    }
    this.listTrigger();
    this.listAction();
  },
  watch: {
    ruleList: {
      handler: "changeRuleList",
      deep: true
    }
  },
  methods: {
    ...mapActions(["listTrigger", "listAction"]),
    deleteRule(item) {
      let index = this.ruleList.indexOf(item);
      this.ruleList.splice(index, 1);
    },
    changeRuleList(newVal, oldVal) {
      if (_.eq(newVal, oldVal)) {
        return;
      }
      this.formatRule();
    },
    formatRule() {
      this.ruleList.forEach(item => {
        // debugger;
        item.triggerId = Number.parseInt(item.triggerId);
        item.actionId = Number.parseInt(item.actionId);
        item.actionIconfont = utils.getDeviceIconByType(
          item.actionEquipmentType
        );
        item.triggerIconfont = utils.getDeviceIconByType(
          item.triggerEquipmentType
        );
      });
    }
  }
};
</script>
