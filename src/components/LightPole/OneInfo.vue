<template>
  <CtrlPanel :split-line="false" class="OneInfoBox">
    <dt slot="title">智慧杆名称:{{this.curLight.poleInfoDO&&this.curLight.poleInfoDO.equipmentName||''}}</dt>
    <dd slot="content">
      <a-table
        :columns="deviceType"
        :dataSource="this.curLight.equipmentDOS"
        :rowKey="record => record.id"
      ></a-table>
    </dd>
  </CtrlPanel>
</template>

<script>
import CtrlPanel from "@/components/CtrlPanel.vue";
import CApi from "@/api/Pole";
import _ from "lodash";
import baseMixin from "@/mixins/base.js";

let api = new CApi();
const deviceType = [
  {
    title: "设备类型",
    dataIndex: "equipmentType",
    key: "equipmentType"
  },
  {
    title: "设备名称",
    dataIndex: "equipmentName",
    key: "equipmentName"
  },
  {
    title: "设备状态",
    dataIndex: "equipmentStatus"
  },
  {
    title: "亮度",
    dataIndex: "brightness"
  },
  {
    title: "开关状态",
    dataIndex: "onOff"
  },
  {
    title: "安装时间",
    dataIndex: "installationTime",
    key: "installationTime"
  }
];
export default {
  mixins: [baseMixin],
  components: {
    CtrlPanel
  },
  props: {
    bottomSpan: Object,
    curLight: Object
  },

  data() {
    return {
      deviceType,
      deviceList: this.curLight
    };
  },
  created() {
    // this.loadList("findBindings", { id: this.curLight.id }, "deviceList");
  },
  computed: {},
  methods: {
    async loadList(type, opt, val) {
      let _opt = Object.assign(
        {
          projectId: this.projectId
        },
        opt
      );
      let res = await api[type](_opt).catch(err => {
        console.log(err);
      });
      this[val] = res.data.list;
    }
  }
};
</script>

<style lang="less">
.OneInfoBox {
  position: absolute;
  right: 0;
  bottom: 10px;
  color: #ddfdff;
  font-size: 7px;
  width: 100%;
  min-height: 360px;
}
</style>
