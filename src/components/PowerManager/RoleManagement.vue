<template>
  <div>
    <a-table
      class="Application_table"
      :columns="columns"
      :rowKey="record => record.roleId"
      :dataSource="dataList"
      :pagination="false"
      :scroll="{y:500}"
    >
      <template
        slot="accessContent"
        slot-scope="text, record"
      >
        <a
          href="javascript:;"
          class="access-content"
          @click.stop="startCheckOrEdit(record,true)"
        >查看权限</a>
      </template>
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
            @click.stop="startCheckOrEdit(record)"
          />
        </a-tooltip>
        <a-tooltip
          placement="top"
          title="删除"
        >
          <a-icon
            type="delete"
            @click.stop="powerRoleDelete(record.roleId)"
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
    title: "角色ID",
    dataIndex: "roleId",
    width: 60,
    align: "center",
  },
  {
    title: "角色名称",
    dataIndex: "roleName",
    width: 80,
    align: "center",
  },
  {
    title: "角色描述",
    dataIndex: "remark",
    width: 100,
    align: "center",
  },
  {
    title: "权限内容",
    dataIndex: "accessContent",
    width: 80,
    align: "center",
    scopedSlots: { customRender: "accessContent" },
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
  data() {
    return {
      columns,
      dataList: [], //列表数据
      paginationRole: {
        currentPage: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0, //总数
      },
      roleIds: "",
    };
  },
  components: {
    aTooltip: Tooltip,
  },
  mounted() {},
  created() {
    // 批量删除
    this.$bus.on("powerListDelete", (tabKey) => {
      if (tabKey === "2") {
        this.powerRoleDelete(this.roleIds, "batchRemove");
      }
    });
    this.loadPowerRoleList();
  },

  methods: {
    // 获取角色管理列表数据
    async loadPowerRoleList() {
      let res = await power.powerRoleQueryList().catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("加载失败！");
        return;
      }
      this.dataList = res.data;
    },
    // 删除
    powerRoleDelete(roleIds, batchRemove) {
      if (_.isEmpty(roleIds) && !_.isEmpty(batchRemove)) {
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
          _this.powerRoleDeleteInfo(roleIds);
        },
        onCancel() {},
      });
    },

    async powerRoleDeleteInfo(roleIds) {
      let params = `roleIds=${roleIds}`;
      let res = await power.powerRoleDeledtRole(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("删除角色失败");
        return;
      }
      this.$message.success("删除角色成功");
      this.loadPowerRoleList();
      this.roleIds = "";
    },
    // 查看/编辑
    startCheckOrEdit(record, isViewPermission) {
      // 清空提示框
      this.$message.destroy();

      if (isViewPermission) {
        //查看权限
        this.$router.push({
          path: "/system/power/power-add-role",
          query: {
            modelTitle: "查看权限",
            id: record.roleId,
            isViewPermission: isViewPermission,
          },
        });
      } else {
        // 编辑
        this.$router.push({
          path: "/system/power/power-add-role",
          query: { modelTitle: "编辑角色", id: record.roleId },
        });
      }
    },
    selectedRows(selectedRows) {
      let roleIds = "";
      selectedRows.forEach((_) => {
        roleIds += _.roleId + ",";
      });
      this.roleIds = roleIds;
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
.access-content {
  color: #98feff;
}
</style>