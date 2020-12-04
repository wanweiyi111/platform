<template>
  <!-- 栏目管理 -->
  <div class="column-management">
    <a-table
      class="Application_table"
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="dataList"
      :pagination="false"
      :scroll="{y:500}"
    >
      <div
        class="action_btn"
        slot="operation"
        slot-scope="text, record"
      >
        <a-tooltip
          placement="top"
          title="添加权限"
        >
          <i
            class="iconfont iconuser-cog mr10"
            @click.stop="addControl(record.id,record.menuName)"
          ></i>
        </a-tooltip>
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
          title="删除"
        >
          <a-icon
            type="delete"
            @click.stop="powerColumnDelete(record.id)"
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
    title: "栏目名称",
    dataIndex: "permissionName",
    width: 140,
    align: "center",
  },
  {
    title: "URL地址",
    dataIndex: "path",
    width: 140,
    align: "center",
  },
  {
    title: "排序",
    dataIndex: "orderNum",
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
  data() {
    return {
      columns,
      dataList: [], //照明详情每页
      paginationColumn: {
        currentPage: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0, //总数
      },
      promissionIds: "",
    };
  },
  components: {
    aTooltip: Tooltip,
  },
  created() {
    // 批量删除
    this.$bus.on("powerListDelete", (tabKey) => {
      if (tabKey === "3") {
        this.powerColumnDelete(this.promissionIds, "batchRemove");
      }
    });
    // 新建/编辑用户后更新列表数据
    this.$bus.on("loadPowerColumnList", () => {
      this.loadPowerColumnList();
    });
    this.loadPowerColumnList();
  },
  methods: {
    // 获取栏目管理列表数据
    async loadPowerColumnList() {
      let res = await power.powerColumnQueryTreeList().catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.dataList = res.data.rows;
    },

    // 删除栏目
    powerColumnDelete(promissionIds, batchRemove) {
      if (_.isEmpty(promissionIds) && !_.isEmpty(batchRemove)) {
        this.$message.warning("请选择要删除的信息");
        return;
      }
      let _this = this;
      this.$modal.confirm({
        class: "application_modal",
        title: "确定要删除吗?",
        okText: "确定",
        cancelText: "取消",
        centered: true,
        onOk() {
          _this.powerColumnDeleteInfo(promissionIds);
        },
        onCancel() {},
      });
    },
    async powerColumnDeleteInfo(promissionIds) {
      let params = `promissionIds=${promissionIds}`;
      let res = await power.powerColumnDeletePermission(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("栏目删除失败");
        return;
      }
      this.$message.success("栏目删除成功");
      this.loadPowerColumnList();
      this.promissionIds = "";
    },
    // 编辑
    startEdit(record) {
      const TAB_KEY = "3";
      const IS_EDIT = true;
      this.$bus.emit("showEditModel", TAB_KEY, IS_EDIT);
      this.$bus.emit("initFormColumn", record, IS_EDIT);
      this.$bus.emit("powerMenuQueryList");
    },
    // 添加权限控制
    addControl(id, name) {
      this.$router.push({
        path: "/system/power/power-control",
        query: { parentId: id, columnTitle: name },
      });
    },
    selectedRows(selectedRows) {
      let promissionIds = "";
      selectedRows.forEach((_) => {
        promissionIds += _.id + ",";
      });
      this.promissionIds = promissionIds;
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
<style lang="less" scoped>
.column-management {
  .white1 {
    margin-right: 10px;
  }
}
</style>