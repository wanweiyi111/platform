<template>
  <a-table
    class="Application_table"
    :columns="columnsView"
    :rowKey="record => record.id"
    :dataSource="dataSource"
    :pagination="pagination"
    @change="handleTableChange"
  >
    <template
      slot="reportingTime"
      slot-scope="reportingTime"
    >{{reportingTime | time}}</template>
    <template
      slot="radarId"
      slot-scope="id"
    ><span :title="id">{{id}}</span></template>
  </a-table>
</template>

<script>
import baseMixin from "@/mixins/base.js";
import Radar from "@/api/Radar";
const columnsView = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "雷达名称",
    dataIndex: "equipmentName",
    ellipsis: true,
  },
  {
    title: "归属智慧杆",
    dataIndex: "poleName",
    ellipsis: true,
  },
  {
    title: "位置",
    dataIndex: "location",
    ellipsis: true,
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    scopedSlots: { customRender: "updateTime" },
  },
];
export default {
  mixins: [baseMixin],
  name: "RadarStatistics",
  props: {
    qo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      columnsView,
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  created() {
    this.findTargetList();
  },
  watch: {
    // eslint-disable-next-line
    qo: {
      handler(value) {
        console.log("传值", value);
        let param = Object.assign({ pageNum: 1, pageSize: 10 }, value);
        this.findTargetList(param);
      },
      deep: true,
    },
  },
  methods: {
    async findTargetList(args = {}) {
      let radar = new Radar();
      let params = { projectId: this.projectId };
      params = Object.assign({}, params, args);
      let res = await radar.findTargetList(params);
      if (res.code === "200") {
        const pagination = { ...this.pagination };
        pagination.current = res.data.pageNum;
        pagination.total = res.data.total;
        this.dataSource = res.data.list;
        this.pagination = pagination;
      }
    },
    handleTableChange(pagination) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      let param = {};
      if (this.qo.searchText) {
        param = Object.assign(
          { pageNum: pager.current, pageSize: pagination.pageSize },
          this.qo
        );
      } else {
        param = Object.assign({
          pageNum: pager.current,
          pageSize: pagination.pageSize,
        });
      }
      this.findTargetList(param);
    },
  },
};
</script>

