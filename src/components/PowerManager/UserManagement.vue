<template>
  <!-- 用户管理 -->
  <div class="user-management">
    <a-table
      class="Application_table"
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="dataList"
      :pagination="false"
      :scroll="{x:1400,y:500}"
    >
      <div
        class="action_btn"
        slot="operation"
        slot-scope="text, record"
      >
        <a-tooltip
          placement="top"
          title="设置设备权限"
        >
          <a-icon
            type="setting"
            class="mr10"
            @click.stop="powerSetPermission(record)"
          />
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
            @click.stop="powerUserDelete(record.id)"
          />
        </a-tooltip>
      </div>
    </a-table>
    <a-row>
      <a-col
        class="ar mt10"
        :span="24"
      >
        <a-pagination
          :total="paginationUser.total"
          :current="paginationUser.currentPage"
          :showTotal="total => `共 ${total} 条`"
          @change="changePage"
        />
      </a-col>
    </a-row>

  </div>
</template>

<script>
import _ from "lodash";
import utils from "@/utils/";
import PowerManager from "@/api/PowerManager";
import { Tooltip } from "ant-design-vue";
const power = new PowerManager();

const columns = [
  {
    title: "用户名",
    dataIndex: "userName",
    width: 100,
  },
  {
    title: "手机号",
    dataIndex: "mobile",
    width: 110,
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 180,
  },
  {
    title: "归属部门",
    dataIndex: "deptName",
    width: 80,
  },
  {
    title: "关联角色",
    dataIndex: "roleName",
    width: 80,
  },
  {
    title: "关联项目",
    dataIndex: "projectName",
    width: 120,
  },
  {
    title: "到期时间",
    dataIndex: "endEffectivePeriod",
    width: 150,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    width: 150,
  },
  {
    title: "修改时间",
    dataIndex: "modifyTime",
    width: 150,
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 120,
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  data() {
    return {
      columns,
      dataList: [], //列表数据
      paginationUser: {
        currentPage: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0, //总数
      },
      userIds: "",
      searchKey: "", //搜索数据
    };
  },
  components: {
    aTooltip: Tooltip,
  },
  mounted() {},
  created() {
    this.$bus.on("powerSearchKey", (searchKey, tabKey) => {
      if (tabKey === "1") {
        this.searchKey = searchKey;
        this.loadPowerUserList();
      }
    });
    // 批量删除
    this.$bus.on("powerListDelete", (tabKey) => {
      if (tabKey === "1") {
        this.powerUserDelete(this.userIds, "batchRemove");
      }
    });
    // 新建/编辑用户后更新列表数据
    this.$bus.on("loadPowerUserList", () => {
      this.loadPowerUserList();
    });
    this.loadPowerUserList();
  },
  methods: {
    // 获取用户管理列表数据
    async loadPowerUserList() {
      let params = `${this.paginationUser.currentPage}/${this.paginationUser.pageSize}?userName=${this.searchKey}`;

      let res = await power.powerUserQueryList(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("加载失败！");
        return;
      }
      this.paginationUser.total = res.data.totalNum;
      this.dataList = (res.data.data || []).map((item) => {
        item.endEffectivePeriod = utils.toTime(item.endEffectivePeriod);
        item.createTime = utils.toTime(item.createTime);
        item.modifyTime = utils.toTime(item.modifyTime);
        return item;
      });
      this.$bus.emit("clearSearchKey");
    },
    // 设置设备权限
    powerSetPermission(record) {
      this.$bus.emit("getDevicePermission", record);
      this.$emit("showModelPermission");
    },
    // 编辑
    startEdit(record) {
      const TAB_KEY = "1";
      const IS_EDIT = true;
      this.$bus.emit("showEditModel", TAB_KEY, IS_EDIT);
      this.$bus.emit("initFormAddUser", record, IS_EDIT);
    },
    // 删除用户
    powerUserDelete(userIds, batchRemove) {
      if (_.isEmpty(userIds) && !_.isEmpty(batchRemove)) {
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
          _this.powerUserDeleteInfo(userIds);
        },
        onCancel() {},
      });
    },
    // 删除
    async powerUserDeleteInfo(userIds) {
      let params = `userIds=${userIds}`;
      let res = await power.powerUserDeleteUserList(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("删除失败");
        return;
      }
      this.$message.success("删除用户成功");
      this.loadPowerUserList();
      this.userIds = "";
    },
    // 切换分页
    changePage(page) {
      this.paginationUser.currentPage = page;
      this.loadPowerUserList();
    },
    selectedRows(selectedRows) {
      let userIds = "";
      selectedRows.forEach((_) => {
        userIds += _.id + ",";
      });
      this.userIds = userIds;
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