<template>
  <!-- 信息发布--任务 -->
  <div>
    <a-table
      class="Application_table"
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="dataListDisplayTask"
      :pagination="false"
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
            确定{{Number(record.statusCode)?'结束':'开启'}}该计划？
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
        <div>
          <a-tooltip
            placement="top"
            title="编辑"
          >
            <a-icon
              type="edit"
              @click="() => displayTaskEdit(record.taskId)"
            />
          </a-tooltip>
          <a-tooltip
            placement="top"
            title="删除"
          >
            <a-icon
              type="delete"
              class="pl10"
              @click="() => displayTaskDelete(record.id)"
            />
          </a-tooltip>
        </div>
      </div>
    </a-table>
    <a-pagination
      :total="paginationDisplayTask.total"
      :current="paginationDisplayTask.current"
      :showTotal="total => `共 ${total} 条`"
      @change="changePage"
    />
  </div>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import Display from "@/api/Display";
import { Tooltip, Popconfirm } from "ant-design-vue";

const display = new Display();

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    align: "center",
    width: 80,
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
    width: 80,
    align: "center",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  mixins: [baseMixin],
  data() {
    return {
      columns,
      dataListDisplayTask: [],
      paginationDisplayTask: {
        current: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0, //总数
      },
      taskInfoIds: "",
      searchData: {},
    };
  },
  components: {
    aTooltip: Tooltip,
    aPopconfirm: Popconfirm,
  },
  created() {
    // 批量删除
    this.$bus.off("displayTaskDelete").on("displayTaskDelete", () => {
      this.displayTaskDelete(this.taskInfoIds, "batchRemove");
    });
    // 搜索
    this.$bus
      .off("loadQueryListTask")
      .on("loadQueryListTask", (isSearch, searchData) => {
        if (isSearch) this.paginationDisplayTask.current = 1;
        this.searchData = searchData;
        this.loadQueryListTask();
      });
    this.searchData.projectId = this.projectId;
    this.loadQueryListTask();
  },

  methods: {
    // 获取信息发布任务列表数据
    async loadQueryListTask() {
      let params = `/${this.paginationDisplayTask.current}/${this.paginationDisplayTask.pageSize}`;
      let res = await display
        .screenTaskQueryList(params, this.searchData)
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code != 200) {
        return;
      }
      this.paginationDisplayTask.total = res.totalNum;
      this.dataListDisplayTask = res.data;
      this.taskInfoIds = "";
      this.$bus.emit("clearQueryObjTask");
    },

    // 信息发布任务列表分页
    changePage(page) {
      this.paginationDisplayTask.current = page;
      this.loadQueryListTask();
    },
    //信息发布删除任务信息
    displayTaskDelete(taskInfoIds, batchRemove) {
      if (_.isEmpty(taskInfoIds) && !_.isEmpty(batchRemove)) {
        this.$message.warning("请选择要删除的信息！");
        return;
      }
      let _this = this;
      this.$modal.confirm({
        title: "确定要删除吗?",
        okText: "确定",
        cancelText: "取消",
        centered: true,
        class: "application_modal",
        onOk() {
          _this.displayTaskRemoveInfo(taskInfoIds);
        },
        onCancel() {},
      });
    },

    async displayTaskRemoveInfo(taskInfoIds) {
      let params = `ids=${taskInfoIds}`;
      let res = await display.screenTaskRemove(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== 200) {
        this.$message.warning(res.msg);
        return;
      }
      this.loadQueryListTask();
      this.$message.success("删除成功！");
    },
    // 编辑任务
    displayTaskEdit(taskId) {
      this.$router.push({
        path: "/application-manage/display/add-task",
        query: { taskId: taskId, modelTitle: "编辑任务" },
      });
    },
    onPopconfirmSwite(record) {
      let objVal = record;
      this.displayTaskChangeState(objVal);
    },
    // 信息发布任务修改任务状态
    async displayTaskChangeState(record) {
      let params = {
        status: 1 ^ record.statusCode, //状态码，为1时，传0，为0时，传1（1是已执行，0是未执行）
        id: record.id,
        parjectId: "",
      };
      let res = await display.screenTaskModifyStatus(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning("修改失败！");
        return;
      }
      this.loadQueryListTask();
      this.$message.success("修改成功！");
    },

    // 选择列表信息
    onSelectRow(record, selected, selectedRows) {
      this.selectedRows(selectedRows);
    },
    // 选择全部
    onSelectAllRow(selected, selectedRows) {
      this.selectedRows(selectedRows);
    },
    selectedRows(selectedRows) {
      let taskInfoIds = "";
      selectedRows.forEach((_) => {
        taskInfoIds += _.id + ",";
      });
      this.taskInfoIds = taskInfoIds;
    },
  },
  filters: {
    filterStatus(value) {
      if (_.isEmpty(value)) {
        return value == 1 ? "有效" : "无效";
      }
    },
  },
};
</script>
