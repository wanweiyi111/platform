<template>
  <div>
    <a-table
      class="Application_table"
      :columns="columns"
      :dataSource="dataList"
      :rowKey="record => record.id"
      :pagination="devicePagination"
      @change="changePageDevice"
    >
      <template
        slot="LongitudeLatitudeState"
        slot-scope="text,record"
      >{{record.longitude}}，{{record.latitude}}
      </template>
      <template
        slot="parkingStatus"
        slot-scope="text, record"
      >
        <a-badge
          :status="Number(record.parkingStatus)?'processing':'success'"
          :text="Number(record.parkingStatus)?'使用中':'闲置中'"
        />
      </template>
      <template
        slot="equipmentStatus"
        slot-scope="text, record"
      >
        <a-badge
          :status="Number(record.equipmentStatus)?'success':'error'"
          :text="Number(record.equipmentStatus)?'正常':'故障'"
        />
      </template>
    </a-table>
  </div>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import Etc from "@/api/Etc";

import { Badge, Switch } from "ant-design-vue";

const api = new Etc();

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "车位编号",
    dataIndex: "parkingCode",
    width: 80,
    align: "center",
  },
  {
    title: "车牌号",
    dataIndex: "carCode",
    width: 85,
    align: "center",
  },
  {
    title: "车位地点",
    dataIndex: "parkingAddress",
    ellipsis: true,
  },
  {
    title: "车位经纬度",
    dataIndex: "LongitudeLatitudeState",
    scopedSlots: { customRender: "LongitudeLatitudeState" },
    width: 120,
  },
  {
    title: "驶入时间",
    dataIndex: "inTime",
    width: 120,
  },
  {
    title: "驶出时间",
    dataIndex: "outTime",
    width: 120,
  },
  {
    title: "停车时长",
    dataIndex: "parkingTime",
  },
  {
    title: "费用",
    dataIndex: "fee",
  },
];

export default {
  mixins: [baseMixin],
  components: {
    aBadge: Badge,
  },
  props: {
    searchValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      columns,
      dataList: [],
      devicePagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal: (total) => `共 ${total} 条`,
      },
      visibleEquipInfo: false, // 查看设备信息modal
      equipInfoView: {}, // 查看设备信息-数据
    };
  },
  watch: {
    searchValue: {
      handler(value) {
        let param = value;
        this.devicePagination.current = 1;
        this.loadData(param);
      },
      deep: true,
    },
  },
  created() {
    this.devicePagination.current = 1;
    this.loadData({});
  },
  methods: {
    // 分页
    changePageDevice(pagination) {
      this.devicePagination.current = pagination.current;
      let params = {};
      if (this.searchValue) {
        params = this.searchValue;
      }
      this.loadData(params);
    },

    // 获取数据
    async loadData(params) {
      params.pageNum = this.devicePagination.current;
      params.pageSize = this.devicePagination.pageSize;
      // let opt = Object.assign(params, { projectId: this.projectId });
      let opt = Object.assign(params);
      let res = await api.findDetailReport(opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.dataList = res.data.list;
      this.devicePagination.current = res.data.pageNum;
      this.devicePagination.total = res.data.total;
    },
  },
};
</script>
