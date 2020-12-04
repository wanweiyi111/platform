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
      <div
        slot="action"
        slot-scope="text, record"
        class="action_btn"
      >
        <a-tooltip title="查看详情">
          <a-icon
            type="eye"
            @click="showModalEquipInfo(record)"
          />
        </a-tooltip>
      </div>
    </a-table>
    <!-- 查看设备信息 -->
    <a-modal
      class="application_modal"
      :visible="visibleEquipInfo"
      title="设备信息"
      :width="600"
      :footer="null"
      @cancel="handleModelEquipOk"
    >
      <a-descriptions
        title="基本信息"
        size="small"
        :column=2
        bordered
      >
        <a-descriptions-item
          label="设备名称"
          :span="2"
        >
          {{equipInfoView.equipmentName}}
        </a-descriptions-item>
        <a-descriptions-item
          label="设备ID"
          :span="2"
        >
          {{equipInfoView.equipmentCode}}
        </a-descriptions-item>
        <a-descriptions-item label="经度">
          {{equipInfoView.longitude}}
        </a-descriptions-item>
        <a-descriptions-item label="纬度">
          {{equipInfoView.latitude}}
        </a-descriptions-item>
        <a-descriptions-item label="联网状态">
          {{Number(equipInfoView.networkState)?'在线':'离线'}}
        </a-descriptions-item>
        <a-descriptions-item label="设备状态">
          {{Number(equipInfoView.equipmentStatus)?'在线':'故障'}}
        </a-descriptions-item>
        <a-descriptions-item label="位置">
          {{equipInfoView.location||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="安装时间">
          {{equipInfoView.createTime||'-'}}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import Police from "@/api/Police";

import { Badge, Tooltip } from "ant-design-vue";

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
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
    width: 100,
    scopedSlots: { customRender: "action" },
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
      visibleEquipInfo: false,
      equipInfoView: {},
    };
  },
  components: {
    aBadge: Badge,
    aTooltip: Tooltip,
  },
  watch: {
    searchValue: {
      handler(value) {
        let param = value;
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
      this.loadData({});
    },
    // 打开详情modal
    showModalEquipInfo(val) {
      this.equipInfoView = val;
      this.visibleEquipInfo = true;
    },
    // 关闭详情modal
    handleModelEquipOk() {
      this.equipInfoView = {};
      this.visibleEquipInfo = false;
    },
    // 获取数据
    async loadData(params) {
      params.pageNum = this.devicePagination.current;
      params.pageSize = this.devicePagination.pageSize;
      let opt = Object.assign(params, { projectId: this.projectId });
      let res = await api.findByProjectIdPaged(opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.dataList = res.data.records;
      this.devicePagination.current = res.data.current;
      this.devicePagination.total = res.data.total;
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
