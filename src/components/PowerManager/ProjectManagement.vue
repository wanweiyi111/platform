<template>
  <!-- 项目管理 -->
  <div class="project-management">
    <a-table
      class="Application_table"
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="dataList"
      :pagination="paginationProject"
      @change="changePage"
    >
      <div
        class="action_btn"
        slot="operation"
        slot-scope="text, record"
      >
        <a-tooltip
          placement="top"
          title="编辑"
        >
          <a-icon
            type="form"
            class="mr10"
            @click.stop="startEdit(record)"
          />
        </a-tooltip>
        <a-tooltip
          placement="top"
          title="初始化"
        >
          <a-icon
            type="interaction"
            class="mr10"
            @click.stop="goIni(record.id,record.projectName)"
          />
        </a-tooltip>
        <a-tooltip
          placement="top"
          title="删除"
        >
          <a-icon
            type="delete"
            @click.stop="powerProjectDelete(record.id)"
          />
        </a-tooltip>
      </div>
    </a-table>
  </div>
</template>

<script>
import _ from "lodash";
import PowerManager from "@/api/PowerManager";
import { Tooltip } from "ant-design-vue";
const power = new PowerManager();

const columns = [
  {
    title: "序号",
    dataIndex: "id",
    width: 100,
    align: "center",
  },
  {
    title: "项目名称",
    dataIndex: "projectName",
    width: 100,
    align: "center",
  },
  {
    title: "城市",
    dataIndex: "city",
    width: 100,
    align: "center",
  },
  {
    title: "区",
    dataIndex: "district",
    width: 100,
    align: "center",
  },
  {
    title: "街道",
    dataIndex: "street",
    width: 100,
    align: "center",
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
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      columns,
      dataList: [], //照明详情每页
      paginationProject: {
        current: 1, //当前页
        pageSize: 8, //每页显示条数
        total: 0, //总数
        showTotal: (total) => `共 ${total} 条`,
      },
      searchKey: "",
      projectIds: "",
    };
  },
  components: {
    aTooltip: Tooltip,
  },
  mounted() {},
  created() {
    // 搜索
    this.$bus.on("powerSearchKey", (searchKey, tabKey) => {
      if (tabKey === "4") {
        this.searchKey = searchKey;
        this.reset();
        // this.paginationProject.current = 1;
        // this.loadPowerProjectList();
      }
    });
    // 批量删除
    this.$bus.on("powerListDelete", (tabKey) => {
      if (tabKey === "4") {
        this.powerProjectDelete(this.projectIds, "batchRemove");
      }
    });

    // 新建/编辑项目后更新列表数据
    this.$bus.on("loadPowerProjectList", () => {
      this.searchKey = "";
      this.reset();
    });
    this.loadPowerProjectList();
  },
  beforeDestroy() {},
  methods: {
    // 获取项目管理列表数据
    async loadPowerProjectList() {
      let params = `${this.paginationProject.current}/${this.paginationProject.pageSize}?projectName=${this.searchKey}`;
      let res = await power.powerProjectQueryList(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.paginationProject.current = res.data.currentPage;
      this.paginationProject.total = res.data.totalNum;
      this.dataList = res.data.data;
      this.$bus.emit("clearSearchKey");
    },
    // 新建/编辑 清空搜索栏和重置页码为1
    reset() {
      this.paginationProject.current = 1;
      this.loadPowerProjectList();
    },
    // 项目初始化
    goIni(id, name) {
      let projectId = id;
      let projectName = name;
      this.$router.push({
        path: "/system/power/init",
        query: {
          projectId: projectId,
          projectName: projectName,
        },
      });
    },
    // 编辑
    startEdit(record) {
      const TAB_KEY = "4";
      const IS_EDIT = true;
      this.$bus.emit("showEditModel", TAB_KEY, IS_EDIT);
      this.$bus.emit("initFormProject", record, IS_EDIT);
      this.$bus.emit("clearSearchKey");
    },
    // 删除项目
    powerProjectDelete(projectIds, batchRemove) {
      if (_.isEmpty(projectIds) && !_.isEmpty(batchRemove)) {
        this.$message.warning("请选择要删除的信息");
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
          _this.powerProjectDeleteInfo(projectIds);
          _this.paginationProject.current = 1;
          _this.loadPowerProjectList();
        },
        onCancel() {},
      });
    },
    async powerProjectDeleteInfo(projectIds) {
      let params = `projectIds=${projectIds}`;
      let res = await power.powerProjectDeleteProject(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("删除失败");
        return;
      }
      this.$message.success("删除项目成功");
      this.projectIds = "";
    },
    changePage(page) {
      this.paginationProject.current = page.current;
      this.loadPowerProjectList();
    },
    selectedRows(selectedRows) {
      let projectIds = "";
      selectedRows.forEach((_) => {
        projectIds += _.id + ",";
      });
      this.projectIds = projectIds;
    },
    // 选择列表信息
    onSelectRow(record, selected, selectedRows) {
      this.selectedRows(selectedRows);
    },
    // 选择全部
    onSelectAllRow(selected, selectedRows) {
      this.selectedRows(selectedRows);
    },
  },
};
</script>