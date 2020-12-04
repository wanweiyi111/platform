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
        slot="onOffStatus"
        slot-scope="text, record"
      >
        <a-popconfirm
          okText="确认"
          cancelText="取消"
          @confirm="() => onPopconfirmSwite(record)"
        >
          <span slot="title">
            确定{{Number(record.statusCode)?'结束':'开启'}}该任务？
          </span>
          <a-switch
            :checked="Number(record.statusCode)?true:false"
            checked-children="是"
            un-checked-children="否"
          />
        </a-popconfirm>
      </template>
      <div
        slot="operation"
        slot-scope="text, record"
        class="action_btn"
      >
        <a-tooltip
          placement="top"
          title="编辑"
        >
          <a-icon
            type="edit"
            @click="() => operationEdit(record.taskId)"
          />
        </a-tooltip>
        <a-tooltip
          placement="top"
          title="删除"
        >
          <a-icon
            type="delete"
            class="pl10"
            @click="() => operationDelete(record.id)"
          />
        </a-tooltip>

      </div>
    </a-table>

  </div>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import Broadcast from "@/api/Broadcast";

import { Popconfirm, Tooltip } from "ant-design-vue";

const api = new Broadcast();
// 列表
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    width: 80,
    align: "center",
    ellipsis: true,
  },
  {
    title: "计划名称",
    dataIndex: "resourceName",
    ellipsis: true,
  },
  {
    title: "有效日期",
    dataIndex: "dateRange",
  },
  {
    title: "开始时间",
    dataIndex: "startTime",
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    ellipsis: true,
  },
  {
    title: "计划状态",
    dataIndex: "status",
  },
  {
    title: "是否有效",
    width: 80,
    align: "center",
    dataIndex: "onOffStatus",
    scopedSlots: { customRender: "onOffStatus" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  mixins: [baseMixin],
  components: {
    aTooltip: Tooltip,
    aPopconfirm: Popconfirm,
  },
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
      visibleEquipInfo: false, // 查看设备信息modal
      equipInfoView: {}, // 查看设备信息-数据
    };
  },
  watch: {
    searchValue: {
      handler(value) {
        console.log("传参", value);
        this.devicePagination.current = 1;
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
    // 分页
    changePageDevice(pagination) {
      this.devicePagination.current = pagination.current;
      let params = {};
      if (this.searchValue) {
        params = this.searchValue;
      }
      this.loadData(params);
    },
    // 开关按钮
    onPopconfirmSwite(record) {
      let objVal = record;
      console.log("开关", objVal);

      let params = {
        status: 1 ^ objVal.statusCode, //状态码，为1时，传0，为0时，传1（1是已执行，0是未执行）
        id: objVal.id,
        projectId: this.projectId,
      };
      this.loadChangeStateData(params);
      this.loadData({});
    },
    // 执行编辑功能
    operationEdit(taskId) {
      this.$router.push({
        path: "/application-manage/broad-cast/add-task",
        query: { modelTitle: "编辑节目", taskId: taskId },
      });
    },
    // 执行删除功能
    operationDelete(id) {
      let _this = this;
      this.$modal.confirm({
        title: "确定要删除吗?",
        okText: "确定",
        cancelText: "取消",
        centered: true,
        class: "application_modal",
        onOk() {
          _this.loadRemoveData(id);
        },
        onCancel() {},
      });
    },
    // 获取修改任务状态
    async loadChangeStateData(params) {
      let res = await api.broadcastTaskModifyStatus(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning("修改失败！");
        return;
      }
      this.$message.success("修改成功！");
    },
    // 删除数据
    async loadRemoveData(taskInfoIds) {
      let params = `ids=${taskInfoIds}`;
      let res = await api.broadcastTaskRemove(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== 200) {
        this.$message.warning(res.msg);
        return;
      }
      this.$message.success("删除成功！");
      this.loadData({});
    },

    // 获取任务列表数据
    async loadData(params) {
      let links = `${this.devicePagination.current}/${this.devicePagination.pageSize}`;
      let opt = Object.assign(params, { projectId: this.projectId });
      let res = await api.broadcastTaskQueryList(links, opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== 200) {
        return;
      }
      this.dataList = res.data;
      this.devicePagination.current = res.currentPage;
      this.devicePagination.total = res.totalNum;
    },
  },
};
</script>
