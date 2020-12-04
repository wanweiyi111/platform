<template>
  <div>
    <a-table :columns="columns" :dataSource="dataList" :pagination="false">
      <template slot="portDos" slot-scope="text, record">{{record.portDos?record.portDos.length:1}}</template>
      <template
        slot="totalCumulativeCharge"
        slot-scope="text, record"
      >{{record.totalCumulativeCharge||0}}</template>
      <template
        slot="networkState"
        slot-scope="text, record"
      >{{record.networkState|formatNetworkState}}</template>
      <template
        slot="equipmentStatus"
        slot-scope="text, record"
      >{{record.equipmentStatus|formatEquipmentStatus}}</template>
    </a-table>
  </div>
</template>

<script>
import _ from "lodash";
import Api from "@/api/Charge";
import baseMixin from "@/mixins/base.js";

const api = new Api();

const columns = [
  {
    title: "序号",
    dataIndex: "id",
    width: 40
  },
  {
    title: "名称",
    dataIndex: "equipmentName",
    width: 120
  },
  {
    title: "充电口数",
    dataIndex: "portDos",
    scopedSlots: { customRender: "portDos" },
    width: 60
  },
  {
    title: "联网状态",
    dataIndex: "networkState",
    scopedSlots: { customRender: "networkState" },
    width: 60
  },
  {
    title: "设备状态",
    dataIndex: "equipmentStatus",
    scopedSlots: { customRender: "equipmentStatus" },
    width: 120
  },
  {
    title: "累计充电总量（KW）",
    dataIndex: "totalCumulativeCharge",
    scopedSlots: { customRender: "totalCumulativeCharge" },
    width: 100
  },
  {
    title: "站点",
    dataIndex: "stationName",
    width: 120
  },
  {
    title: "安装位置",
    dataIndex: "location",
    width: 100
  }
];

export default {
  mixins: [baseMixin],
  data() {
    return {
      columns,
      dataList: [],
      paginationLightTask: {
        current: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0 //总数
      }
    };
  },

  created() {
    this.loadData({});
  },
  methods: {
    // 获取照明--任务列表数据
    async loadData(params) {
      let opt = Object.assign(params, { projectId: this.projectId });
      let res = await api.findByProjectIdPaged(opt).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.dataList = res.data.list;

      //   this.setMapMarks(this.allDevice, "pole");
    }
  }
};
</script>
