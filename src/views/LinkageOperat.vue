<template>
  <CtrlPanel
    :hideTitle="true"
    class="linkage-wrap"
    :style="{'width': activeKey === '2' ? '1100px' : ''}"
  >
    <a-row slot="content">
      <a-col
        :span="4"
        class="ac pt50"
      >
        <img
          :src="imgPole"
          alt
        />
      </a-col>
      <a-col :span="activeKey === '2' ? 16 :20">
        <a-tabs
          size="small"
          :tabBarGutter="2"
          v-model="activeKey"
        >
          <a-tab-pane
            tab="单杆联动"
            key="1"
            :activeKey="activeKey"
          >
            <SinglePole
              :poleId="poleId"
              :type="1"
            ></SinglePole>
          </a-tab-pane>
          <a-tab-pane
            tab="双杆联动"
            key="2"
          >
            <DoublePole
              :poleId="poleId"
              :poleId2="poleId2"
              :type="2"
            ></DoublePole>
          </a-tab-pane>
          <div
            slot="tabBarExtraContent"
            :class="['pd-y10', {'pd-x20': activeKey === '1'}]"
          >
            <a-steps
              :current="current"
              size="small"
            >
              <a-step
                v-for="item in steps"
                :key="item.title"
                :title="item.title"
              />
            </a-steps>
          </div>
        </a-tabs>
      </a-col>
      <a-col
        :span="4"
        class="ac pt50"
        v-show="activeKey === '2'"
      >
        <img
          :src="imgPole2"
          alt
        />
      </a-col>
    </a-row>
  </CtrlPanel>
</template>

<script>
import _ from "lodash";
import { mapGetters, mapMutations, mapActions } from "vuex";
import CtrlPanel from "@/components/CtrlPanel.vue";
import baseMixin from "@/mixins/base.js";
import SinglePole from "@/components/Linkage/SinglePole.vue";
import DoublePole from "@/components/Linkage/DoublePole.vue";
import imgPole from "@/assets/images/pole.svg";
import imgPole2 from "@/assets/images/pole2.svg";

import { Steps } from "ant-design-vue";

export default {
  name: "LinkageOperat",
  mixins: [baseMixin],
  props: ["id", "id2"],
  components: {
    CtrlPanel,
    SinglePole,
    DoublePole,
    aSteps: Steps,
    aStep: Steps.Step,
  },
  data() {
    return {
      poleId: this.id || "",
      poleId2: this.id2 || "",
      imgPole,
      imgPole2,
      activeKey: "1",
      current: 0,
      steps: [
        {
          title: "选择智慧杆",
          content: "选择智慧杆",
        },
        {
          title: "选择智慧杆设备",
          content: "Second-content",
        },
        {
          title: "添加联动规则",
          content: "Last-content",
        },
        {
          title: "其他设置",
          content: "Last-content",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["ruleObj"]),
  },
  created() {
    let linkId = this.$route.query.linkId;
    if (linkId) {
      this.queryRule(linkId);
      return;
    }
    this.setActiveKey();
  },
  watch: {
    ruleObj: {
      handler: "changeRuleObj",
      deep: true,
    },
  },
  methods: {
    ...mapActions(["queryRule"]),
    ...mapMutations(["setUnionRuleObj"]),
    changeRuleObj(newVal, oldVal) {
      if (_.eq(newVal, oldVal)) {
        return;
      }
      const rule = newVal.rule;
      if (rule.type === 2) {
        const arr = rule.poleId.split(",");
        this.poleId = arr[0];
        this.poleId2 = arr[1] || "";
      } else {
        this.poleId = rule.poleId;
      }
      this.setActiveKey();
    },
    setActiveKey() {
      if (this.$route.query.tabKey) {
        this.activeKey = this.$route.query.tabKey;
      } else if (!this.poleId2) {
        this.activeKey = "1";
      } else {
        this.activeKey = "2";
      }
    },
  },
};
</script>

<style lang="less">
.num-wrap {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ddfdff;
  font-size: 14px;
  line-height: 20px;
  color: #011147;
  letter-spacing: 0;
  text-align: center;
  font-style: normal;
  margin-right: 5px;
}
.circle {
  display: block;
  width: 44px;
  height: 44px;
  border: 1px solid #18599b;
  border-radius: 50%;
  font-size: 20px;
  color: #ddfdff;
  text-align: center;
  line-height: 44px;
  margin: 0 5px 5px 0;
  float: left;
  &.active {
    background-image: linear-gradient(90deg, #6dfdfd 10%, #3bbdfb 89%);
  }
}

.rule-table {
  .iconfont {
    color: #98feff;
  }
}
</style>