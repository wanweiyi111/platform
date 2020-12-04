<template>
  <div>
    <a-table
      class="Application_table"
      :columns="currentColumns"
      :dataSource="dataList"
      :rowKey="record => record.id"
      :rowSelection="rowSelection"
      :pagination="devicePagination"
      @change="changePageDevice"
    >
      <!-- 审核状态 -->
      <template
        slot="reviewStatus"
        slot-scope="text, record"
      >
        <a-tag :color="record.reviewStatus == 1 ?'green':record.reviewStatus == 2?'red':'blue'">
          {{record.reviewStatus|filterReviewStatus}}
        </a-tag>
      </template>
      <div
        slot="action"
        slot-scope="text, record"
        class="action_btn"
      >
        <a-tooltip title="编辑">
          <a-icon
            type="edit"
            @click="goEdit(record.programId,record.programName)"
          />
        </a-tooltip>
        <!-- <a-tooltip title="预览">
          <a-icon
            type="eye"
            :style="{ paddingLeft: '10px' }"
            @click="showModalPlayAudio(record.programId)"
          />
        </a-tooltip> -->
        <a-tooltip title="删除">
          <a-icon
            type="delete"
            :style="{ paddingLeft: '10px' }"
            @click="programDelete(record.programId)"
          />
        </a-tooltip>
      </div>
    </a-table>
    <!-- 试听 -->
    <a-modal
      title="音频试听"
      class="application_modal"
      :visible="visiblePlayAudio"
      :width="600"
      :closable="false"
    >
      <template slot="footer">
        <a-button
          type="primary"
          @click="handleModelPlayAudioOk"
        >关闭</a-button>
      </template>
      <PlayAudio :audioValue="audioInfo"></PlayAudio>
    </a-modal>
    <!-- 查看设备信息 -->
    <a-modal
      title="设备信息"
      class="application_modal"
      :visible="visibleEquipInfo"
      :width="600"
      :closable="false"
    >
      <template slot="footer">
        <a-button
          type="primary"
          @click="handleModelEquipOk"
        >关闭</a-button>
      </template>
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
        <a-descriptions-item
          label="归属智慧杆"
          :span="2"
        >
          {{equipInfoView.poleName}}
        </a-descriptions-item>
        <a-descriptions-item label="安装位置">
          {{equipInfoView.location}}
        </a-descriptions-item>
        <a-descriptions-item label="安装时间">
          {{equipInfoView.installationTime}}
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
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import Broadcast from "@/api/Broadcast";

import { Tag, Tooltip } from "ant-design-vue";

const api = new Broadcast();
// 列表
const columns = [
  {
    title: "ID",
    dataIndex: "programId",
    width: 80,
    align: "center",
    ellipsis: true,
  },
  {
    title: "节目名称",
    dataIndex: "programName",
    ellipsis: true,
  },
  {
    title: "创建人",
    dataIndex: "createByName",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    ellipsis: true,
  },
  // {
  //   title: "审核者",
  //   dataIndex: "reviewUser",
  // },
  // {
  //   title: "审核时间",
  //   dataIndex: "reviewTime",
  //   ellipsis: true,
  // },
  // {
  //   title: "审核状态",
  //   width: 80,
  //   align: "center",
  //   dataIndex: "reviewStatus",
  //   scopedSlots: { customRender: "reviewStatus" },
  // },
  {
    title: "操作",
    align: "center",
    width: 150,
    scopedSlots: {
      customRender: "action",
    },
  },
];
// 概览-设置音频节目
const columnsType = [
  {
    title: "ID",
    dataIndex: "id",
    width: 80,
    align: "center",
    ellipsis: true,
  },
  {
    title: "节目名称",
    dataIndex: "mediaName",
    ellipsis: true,
  },
  {
    title: "上传时间",
    dataIndex: "createTime",
    ellipsis: true,
  },
];

export default {
  mixins: [baseMixin],
  components: {
    aTooltip: Tooltip,
    aTag: Tag,
  },
  props: {
    searchValue: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: () => "list",
    },
  },
  data() {
    return {
      columns,
      columnsType,
      dataList: [],
      devicePagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal: (total) => `共 ${total} 条`,
      },
      visibleEquipInfo: false, // 查看设备信息modal
      equipInfoView: {}, // 查看设备信息-数据
      selectedRowKeys: [], // 设置节目 选择的row
      visiblePlayAudio: false,
      audioInfo: {}, // 预览数据
    };
  },
  watch: {
    searchValue: {
      handler(value) {
        console.log("传参", value);
        this.selectedRowKeys = [];
        this.devicePagination.current = 1;
        let param = value;
        this.loadData(param);
      },
      deep: true,
    },
  },
  computed: {
    currentColumns() {
      return this.type === "list" ? this.columns : this.columnsType;
    },
    rowSelection() {
      if (this.type === "list") {
        return null;
      } else {
        const { selectedRowKeys } = this;
        return {
          selectedRowKeys,
          onChange: this.onSelectChange,
        };
      }
    },
  },
  created() {
    this.loadData({});
  },
  methods: {
    // 删除
    programDelete(programId) {
      let id = [programId];
      let _this = this;
      this.$modal.confirm({
        title: "确定要删除吗?",
        okText: "确定",
        cancelText: "取消",
        centered: true,
        class: "application_modal",
        onOk() {
          _this.loadProgramRemoveInfo(id);
          _this.devicePagination.current = 1;
          _this.loadData({});
        },
        onCancel() {},
      });
    },
    // 编辑
    goEdit(programId, programName) {
      this.$router.push({
        path: "/application-manage/broad-cast/add-program",
        query: {
          modelTitle: "编辑节目",
          programId: programId,
          programName: programName,
        },
      });
    },
    // 试听 modal
    showModalPlayAudio(programId) {
      this.loadMedioInfoData(programId);
      console.log("试听数据", programId);
      this.visiblePlayAudio = true;
    },
    // 试听 --关
    handleModelPlayAudioOk() {
      this.visiblePlayAudio = false;
    },
    // 弹出modal
    showModalEquipInfo(val) {
      this.equipInfoView = val;
      this.visibleEquipInfo = true;
    },
    // 关闭modal
    handleModelEquipOk() {
      this.equipInfoView = {};
      this.visibleEquipInfo = false;
    },
    // 分页
    changePageDevice(pagination) {
      this.devicePagination.current = pagination.current;
      let params = {};
      if (this.searchValue) {
        params = this.searchValue;
      }
      this.loadData(params);
    },
    // 多选table -modal设置节目
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
      this.$emit("returnSelectedRow", selectedRowKeys);
    },
    // 获取节目删除 数据
    async loadProgramRemoveInfo(programId) {
      let res = await api
        .broadProgramRemove({ list: programId })
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning("删除失败！");
        return;
      }
      this.$message.success("删除成功！");
    },
    // 获取节目预览 数据
    async loadMedioInfoData(programId) {
      let params = `/${this.projectId}/${programId}`;
      let res = await api.getMediaInfo(params).catch((err) => {
        console.log(err);
      });
      console.log("预览数据", res);
    },
    // 获取数据
    async loadData(params) {
      let links = `${this.devicePagination.current}/${this.devicePagination.pageSize}`;
      let opt = Object.assign(params, { projectId: this.projectId });
      let res = await api.broadcastProgramQueryList(links, opt).catch((err) => {
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
  filters: {
    filterReviewStatus(value) {
      if (_.isEmpty(value)) {
        return value == 0 ? "待审核" : value == 1 ? "已审核" : "已驳回";
      }
    },
  },
};
</script>
