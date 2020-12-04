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
        slot="networkState"
        slot-scope="text, record"
      >
        <a-badge
          :status="Number(record.networkState)?'success':'default'"
          :text="Number(record.networkState)?'正常':'离线'"
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
import Police from "@/api/Police";

import { Badge } from "ant-design-vue";

const api = new Police();

const columns = [
  {
    title: "设备编码",
    dataIndex: "equipmentNumber",
    ellipsis: true,
  },
  {
    title: "设备名称",
    dataIndex: "equipmentName",
    ellipsis: true,
  },
  {
    title: "安装位置",
    dataIndex: "location",
    ellipsis: true,
  },
  {
    title: "联网状态",
    dataIndex: "networkState",
    scopedSlots: { customRender: "networkState" },
    width: 80,
    align: "center",
  },
  {
    title: "设备状态",
    dataIndex: "equipmentStatus",
    scopedSlots: { customRender: "equipmentStatus" },
    width: 80,
    align: "center",
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
      dataList: [],
      devicePagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal: (total) => `共 ${total} 条`,
      },
    };
  },
  components: {
    aBadge: Badge,
  },
  watch: {
    searchValue: {
      handler(value) {
        let param = Object.assign(
          { pageNum: 1, pageSize: this.devicePagination.pageSize },
          value
        );
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
      let params = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      };
      this.loadData(params);
    },
    // 获取数据
    async loadData(params) {
      let opt = Object.assign(params, { projectId: this.projectId });
      let res = await api.findByProjectIdPaged(opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.dataList = res.data.records;
      // 获取设备编码
      let code = [];
      res.data.records.map((val) => {
        code.push(val.equipmentCode);
      });
      this.$emit("codeFunc", code);
    },
  },
};
</script>
