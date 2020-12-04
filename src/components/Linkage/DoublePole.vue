<template>
  <section class="linkage-content">
    <div class="font14 white1 mar-y10"></div>
    <a-row class="pd-y10">
      <a-col :span="7">
        <div>
          <i class="num-wrap">2</i>
          {{poleInfoDO.poleName}}设备
        </div>
        <SelectPoleDevice
          :poleId="pId"
          :maxCount="1"
          @loadedPoleInfo="loadedPole"
          @selectedDevice="selectDevice"
        ></SelectPoleDevice>
      </a-col>
      <a-col :span="5" class="pd-x10">
        <a-divider dashed />
      </a-col>
      <a-col :span="8">
        <div v-if="pId2">{{poleInfoDO2.poleName}}设备</div>
        <a-button type="primary" v-if="!pId2" @click="showPoleSelect">选择智慧杆</a-button>
        <a-modal
          title="选择智慧杆2"
          :visible="showPoleSelector"
          @ok="showPoleSelector = false"
          @cancel="cancelSelectPole"
          okText='确定'
          cancelText='取消'
        >
          <a-radio-group name="poleList" v-model="pId2">
            <a-radio
              v-for="item in poleList"
              :value="item.id.toString()"
              :key="item.id"
            >{{item.poleName}}</a-radio>
          </a-radio-group>
        </a-modal>
        <SelectPoleDevice
          :poleId="pId2"
          :maxCount="1"
          @loadedPoleInfo="loadedPole2"
          @selectedDevice="selectDevice2"
          v-if="!!pId2"
        ></SelectPoleDevice>
      </a-col>
      <a-col :span="4" class="pt10">
        <a-button size="small" @click="addRule">添加联动规则</a-button>
      </a-col>
    </a-row>
    <div class="font14 white1 mar-y10">
      <i class="num-wrap">3</i> 添加联动规则
    </div>
    <RuleTable :ruleList.sync="ruleList" type="2"></RuleTable>
    <div class="font14 white1 mar-y10">
      <i class="num-wrap">4</i> 其他设置
    </div>
    <a-row class="mar-y10">
      <a-col :span="3">是否生效</a-col>
      <a-col :span="4">
        <a-switch checkedChildren="是" unCheckedChildren="否" v-model="otherSet.status" />
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
import { mapGetters, mapActions } from "vuex";
import utils from "@/utils";
import Unions from "@/api/Unions.js";
import SelectPoleDevice from "@/components/Linkage/SelectPoleDevice.vue";
import RuleTable from "@/components/Linkage/RuleTable.vue";
import baseMixin from "@/mixins/base.js";

const unions = new Unions();

export default {
  name: "Linkage",
  mixins: [baseMixin],
  components: {
    SelectPoleDevice,
    RuleTable
  },
  props: {
    poleId: {
      type: String,
      required: true
    },
    poleId2: {
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
      pId: this.poleId,
      pId2: this.poleId2,
      // columns,
      queryObj: {
        id: this.poleId
      },
      poleInfoDO: {},
      poleInfoDO2: {},
      showPoleSelector: false,
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
    ...mapGetters(["triggerList", "actionList", "poleList", "ruleObj"])
  },
  watch: {
    ruleObj: {
      handler: "changeRuleObj",
      deep: true
    },
    poleId: (newVal, oldVal) => {
      if (newVal === oldVal) {
        return;
      }
      this.pId = this.poleId;
    },
    poleId2: (newVal, oldVal) => {
      if (newVal === oldVal) {
        return;
      }
      this.pId2 = this.poleId2;
    }
  },
  created() {
    if (!this.poleList || this.poleList.length === 0) {
      this.loadAllPoles(this.queryObj);
    }
    if (!_.isEmpty(this.ruleObj)) {
      this.changeRuleObj(this.ruleObj, null);
    }
  },
  methods: {
    ...mapActions(["loadAllPoles"]),
    selectDevice(devices) {
      this.selectedDevice[0] = devices[0];
    },
    selectDevice2(devices) {
      this.selectedDevice[1] = devices[0];
    },
    loadedPole(item) {
      this.poleInfoDO = item;
      // this.otherSet.isUseToGroup = this.poleInfoDO.groupName ? true : false;
    },
    loadedPole2(item) {
      this.poleInfoDO2 = item;
      // this.otherSet.isUseToGroup = this.poleInfoDO.groupName ? true : false;
    },
    showPoleSelect() {
      // debugger;
      this.showPoleSelector = true;
      if (!this.poleList || this.poleList.length === 0) {
        this.loadAllPoles(this.queryObj);
      }
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
      // this.selectedDevice.splice(0, this.selectedDevice.length);
      this.selectedDevice = [];
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
      if (!this.otherSet.name) {
        this.$message.warning("请输入联动名称");
        return;
      }
      this.loading = true;
      let rule = JSON.parse(JSON.stringify(this.otherSet));
      this.ruleList.forEach(item => {
        item.actionName = this.getNameById(item.actionId, "actionList");
        item.triggerName = this.getNameById(item.triggerId, "triggerList");
      });
      // debugger;
      rule.poleId = this.poleInfoDO.id + "," + this.poleInfoDO2.id;
      rule.poleName =
        this.poleInfoDO.poleName + "," + this.poleInfoDO2.poleName;
      rule.groupName = this.otherSet.isUseToGroup
        ? this.poleInfoDO.groupName
        : "";
      rule.status = rule.status ? 1 : 0;

      let data = {
        details: this.ruleList,
        rule
      };

      try {
        let res = await unions.addRule(data);
        if (res.code != "200") {
          this.$message.error(res.msg);
          this.loading = false;
          return;
        }
        this.$message.success(res.msg);
      } catch (err) {
        this.$message.error(err);
        this.loading = false;
      }

      setTimeout(() => {
        this.$router.push("/ctrl/linkage");
      }, 2000);
    },
    cancelSelectPole() {
      this.pId2 = "";
      this.showPoleSelector = false;
    },
    back() {
      this.$router.back();
    },
    changeRuleObj(newVal, oldVal) {
      // debugger;
      if (_.eq(newVal, oldVal)) {
        return;
      }
      this.ruleList = this.ruleObj.details;
      this.otherSet = this.ruleObj.rule;
    }
  }
};
</script>