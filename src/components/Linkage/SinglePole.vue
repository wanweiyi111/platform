<template>
  <section class="linkage-content">
    <div class="font14 white1 mar-y10">
      <i class="num-wrap">2</i>
      选择 {{poleInfoDO.poleName}} 上的设备
    </div>
    <a-row class="pd-y10">
      <a-col :span="20">
        <SelectPoleDevice
          :poleId="poleId"
          @loadedPoleInfo="loadedPole"
          @selectedDevice="selectDevice"
        ></SelectPoleDevice>
      </a-col>
      <a-col :span="4" class="pt10">
        <a-button size="small" @click="addRule">添加联动规则</a-button>
      </a-col>
    </a-row>
    <div class="font14 white1 mar-y10">
      <i class="num-wrap">3</i> 添加联动规则
    </div>
    <RuleTable :ruleList.sync="ruleList" type="1"></RuleTable>
    <div class="font14 white1 mar-y10">
      <i class="num-wrap">4</i> 其他设置
    </div>
    <a-row class="mar-y10">
      <a-col :span="3">是否生效</a-col>
      <a-col :span="4">
        <a-switch checkedChildren="是" unCheckedChildren="否" v-model="otherSet.status" />
      </a-col>
      <a-col :span="5">用于所属整个智慧杆组</a-col>
      <a-col :span="3">
        <a-switch checkedChildren="是" unCheckedChildren="否" v-model="otherSet.isUseToGroup" />
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="3">联动名称</a-col>
      <a-col :span="20">
        <a-input size="small" v-model="otherSet.name"></a-input>
      </a-col>
    </a-row>
    <div class="ac mar-y10">
      <a-button type="primary" class="mr15" @click="saveRule" :disabled="loading">保存</a-button>
      <a-button @click="back">取消</a-button>
    </div>
  </section>
</template>
<script>
import _ from "lodash";
import { mapGetters } from "vuex";
import utils from "@/utils";
import Unions from "@/api/Unions.js";
import SelectPoleDevice from "@/components/Linkage/SelectPoleDevice.vue";
import RuleTable from "@/components/Linkage/RuleTable.vue";
import baseMixin from "@/mixins/base.js";

const unions = new Unions();

export default {
  mixins: [baseMixin],
  name: "Linkage",
  components: {
    SelectPoleDevice,
    RuleTable
  },
  props: {
    poleId: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // columns,
      queryObj: {
        id: this.poleId,
        projectId: this.projectId
      },
      poleInfoDO: {},

      selectedDevice: [],
      ruleList: [],
      otherSet: {
        status: false,
        type: this.type,
        name: "",
        isUseToGroup: false
      },
      loading: false
    };
  },
  computed: {
    ...mapGetters(["triggerList", "actionList", "ruleObj"])
  },
  watch: {
    ruleObj: {
      handler: "changeRuleObj",
      deep: true
    }
  },
  methods: {
    selectDevice(devices) {
      this.selectedDevice = devices;
    },
    loadedPole(item) {
      this.poleInfoDO = item;
      this.otherSet.isUseToGroup = this.poleInfoDO.groupName ? true : false;
    },

    addRule() {
      if (this.selectedDevice.length < 2) {
        this.$message.warning("必须要2个设备才可以关联");
        return;
      }
      let rule = {
        actionEquipmentCode: this.selectedDevice[1].equipmentCode,
        actionEquipmentType: this.selectedDevice[1].equipmentType,
        actionId: "",
        actionName: "",
        triggerEquipmentCode: this.selectedDevice[0].equipmentCode,
        triggerEquipmentType: this.selectedDevice[0].equipmentType,
        triggerId: "",
        triggerName: "",
        ruleId: ""
      };
      rule.actionIconfont = utils.getDeviceIconByType(rule.actionEquipmentType);
      rule.triggerIconfont = utils.getDeviceIconByType(
        rule.triggerEquipmentType
      );
      this.ruleList.push(rule);
      this.selectedDevice.splice(0, this.selectedDevice.length);
    },
    getNameById(id, type) {
      let list = this[type](),
        item = null;
      const idKey = type === "actionList" ? "actionId" : "triggerId";
      const nameKey = type === "actionList" ? "actionName" : "triggerName";
      for (var i = 0, len = list.length; i < len; i++) {
        // debugger;
        item = list[i];
        if (item[idKey] === id) {
          return item[nameKey];
        }
      }
      return "";
    },
    async saveRule() {
      console.log(this.ruleList, "saveRule=this.ruleList=1=");
      if (!this.otherSet.name) {
        this.$message.warning("请输入联动名称");
        return;
      }
      // debugger;
      this.loading = true;
      let rule = JSON.parse(JSON.stringify(this.otherSet));
      this.ruleList.forEach(item => {
        item.actionName = this.getNameById(item.actionId, "actionList");
        item.triggerName = this.getNameById(item.triggerId, "triggerList");
      });
      rule.poleId = this.poleInfoDO.id;
      rule.poleName = this.poleInfoDO.poleName;
      rule.groupName = this.otherSet.isUseToGroup
        ? this.poleInfoDO.groupName
        : "";
      rule.status = rule.status ? 1 : 0;

      let data = {
        details: this.ruleList,
        rule
      };

      try {
        let res = await unions[rule["id"] ? "modifyRule" : "addRule"](data);
        if (res.code != "200") {
          this.$message.error(res.msg);
          this.loading = false;
          return;
        }
        this.$message.success(res.msg);
        setTimeout(() => {
          this.$router.push("/ctrl/linkage");
        }, 2000);
      } catch (err) {
        // console.error(err);
        this.$message.error(err);
        this.loading = false;
      }
    },
    back() {
      this.$router.back();
    },
    changeRuleObj(newVal, oldVal) {
      if (_.eq(newVal, oldVal)) {
        return;
      }
      this.ruleList = this.ruleObj.details;
      this.otherSet = this.ruleObj.rule;
    }
  }
};
</script>