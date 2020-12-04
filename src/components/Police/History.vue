<template>
  <div>
    <a-table
      class="Application_table"
      :columns="columns"
      :dataSource="dataList"
      :rowKey="record => record.exceptionId"
      :pagination="devicePagination"
      @change="changePageDevice"
    >
      <template
        slot="eventType"
        slot-scope="text, record"
      >
        {{record.faultType|formatWarningFaultType}}
      </template>
    </a-table>
  </div>
</template>

<script>
import _ from "lodash";
import unionsApi from "@/api/Unions";
import baseMixin from "@/mixins/base.js";
const unions = new unionsApi();

const columns = [
  {
    title: "ID",
    dataIndex: "exceptionId",
    width: 80,
  },
  {
    title: "报警设备",
    dataIndex: "equipmentName",
    ellipsis: true,
  },
  {
    title: "报警内容",
    dataIndex: "faultDescription",
    ellipsis: true,
  },
  {
    title: "位置",
    dataIndex: "location",
    ellipsis: true,
  },
  {
    title: "报警事件",
    width: 80,
    align: "center",
    dataIndex: "faultType",
    scopedSlots: { customRender: "eventType" },
  },
  {
    title: "报警时间",
    dataIndex: "createTime",
    width: 150,
  },
];

export default {
  mixins: [baseMixin],
  props: {
    searchValue: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      columns,
      visible: false,
      form: this.$form.createForm(this),
      dataList: [],
      curEvent: {},
      devicePagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共 ${total} 条`,
      },
    };
  },
  watch: {
    searchValue: {
      handler(value) {
        let param = value;
        param.pageNum = this.devicePagination.current;
        param.pageSize = this.devicePagination.pageSize;
        this.loadData(param);
      },
      deep: true,
    },
  },
  created() {
    this.loadData({});
  },
  methods: {
    changePageDevice(pagination) {
      this.devicePagination.current = pagination.current;
      let params = {};
      params.pageNum = pagination.current;
      params.pageSize = pagination.pageSize;
      if (this.searchValue.equipmentName) {
        params.equipmentName = this.searchValue.equipmentName;
      }
      this.loadData(params);
    },
    // 获取历史列表数据
    async loadData(params) {
      let opt = Object.assign(params, {
        projectId: this.projectId,
        equipmentType: 4240,
      });
      let res = await unions.findException(opt).catch((err) => {
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
