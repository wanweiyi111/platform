<template>
  <!-- 权限管理 -->
  <div class="power-management">
    <a-row class="bottom-sidebar high">
      <a-col>
        <CtrlPanel :hide-title="true">
          <dd slot="content" class="pd-x10">
            <a-tabs :tabBarGutter="2" @change="changeTabs" :activeKey="tabKey">
              <a-tab-pane tab="用户管理" key="1">
                <UserManagement></UserManagement>
              </a-tab-pane>
              <a-tab-pane tab="角色管理" key="2">
                <RoleManagement></RoleManagement>
              </a-tab-pane>
              <a-tab-pane tab="栏目管理" key="3">
                <ColumnManagement></ColumnManagement>
              </a-tab-pane>
              <a-tab-pane tab="项目管理" key="4">
                <ProjectManagement></ProjectManagement>
              </a-tab-pane>
              <div slot="tabBarExtraContent" class="pd-t5">
                <a-input-search
                  v-model="searchKey"
                  @search="powerSearch"
                  @keydown.enter="powerSearch"
                  placeholder="请输入关键词"
                  class="mr5"
                  style="width: 130px;bottom:2px;"
                  size="small"
                  v-show="tabKey==1||tabKey==4"
                />
                <a-button
                  type="primary"
                  icon="plus"
                  size="small"
                  class="mr5"
                  @click="showModel(false)"
                >{{addBtnName}}</a-button>
                <!-- <a-button icon="delete" size="small" @click="powerDelete">删除</a-button> -->
              </div>
            </a-tabs>
          </dd>
        </CtrlPanel>
      </a-col>
    </a-row>
    <!-- 新建/编辑用户对话框 -->
    <PowerAddUser :visible="addUserVisible" :showModel="showModel" :modelTitle="userModelTitle" />
    <!-- 角色管理设置设备权限 -->
    <PowerAddDevicePermission
      :visible="addDevicePermissionVisible"
      :showModel="showModelPermission"
    ></PowerAddDevicePermission>
    <!-- 新建/编辑栏目对话框 -->
    <PowerAddColumn
      :visible="addColumnVisible"
      :showModel="showModel"
      :modelTitle="columnModelTitle"
    ></PowerAddColumn>
    <!-- 新建/编辑项目对话框 -->
    <PowerAddProject
      :visible="addProjectVisible"
      :showModel="showModel"
      :modelTitle="projectModelTitle"
    />
  </div>
</template>

<script>
// import _ from "lodash";
import CtrlPanel from "@/components/CtrlPanel.vue";
import UserManagement from "@/components/PowerManager/UserManagement.vue";
import PowerAddDevicePermission from "@/components/PowerManager/PowerAddDevicePermission.vue";
import RoleManagement from "@/components/PowerManager/RoleManagement";
import ColumnManagement from "@/components/PowerManager/ColumnManagement.vue";
import ProjectManagement from "@/components/PowerManager/ProjectManagement";
import PowerAddUser from "@/components/PowerManager/PowerAddUser.vue";
import PowerAddColumn from "@/components/PowerManager/PowerAddColumn.vue";
import PowerAddProject from "@/components/PowerManager/PowerAddProject.vue";

export default {
  components: {
    CtrlPanel,
    UserManagement,
    PowerAddDevicePermission,
    RoleManagement,
    ColumnManagement,
    ProjectManagement,
    PowerAddUser,
    PowerAddColumn,
    PowerAddProject
  },
  data() {
    return {
      searchKey: "",
      tabKey: "1",
      userModelTitle: "新建用户",
      roleModelTitle: "新建角色",
      columnModelTitle: "新建栏目",
      projectModelTitle: "新建项目",
      addBtnName: "新建用户", //按钮文字
      addUserVisible: false,
      addColumnVisible: false,
      addProjectVisible: false,
      addDevicePermissionVisible: false
    };
  },
  created() {
    this.tabKey = this.$route.query.tabKey || "1";
    this.$bus.on("showEditModel", (tabKey, isEdit) => {
      this.tabKey = tabKey;
      this.showModel(isEdit);
    });
    // 设置设备权限对话框
    this.$bus.on("showModelPermission", () => {
      this.showModelPermission();
    });

    this.$bus.on("clearSearchKey", () => {
      this.searchKey = "";
    });
  },

  methods: {
    // 切换tab页签
    changeTabs(key) {
      this.tabKey = key;
      if (key === "1") {
        this.addBtnName = "新建用户";
      } else if (key === "2") {
        this.addBtnName = "新建角色";
      } else if (key === "3") {
        this.addBtnName = "新建栏目";
      } else if (key === "4") {
        this.addBtnName = "新建项目";
      }
      this.searchKey = "";
    },
    // 搜索
    powerSearch() {
      this.$bus.emit("powerSearchKey", this.searchKey, this.tabKey);
    },
    // 删除
    powerDelete() {
      this.$bus.emit("powerListDelete", this.tabKey);
    },
    // 显示对话框
    showModel(isEdit) {
      if (this.tabKey === "1") {
        this.addUserVisible = !this.addUserVisible;
        this.userModelTitle = isEdit ? "个人信息" : "新建用户";
      } else if (this.tabKey === "2") {
        this.roleModelTitle = isEdit ? "编辑角色" : "新建角色";
        this.$router.push({
          path: "/ctrl/power-add-role",
          query: { modelTitle: this.roleModelTitle }
        });
      } else if (this.tabKey === "3") {
        this.addColumnVisible = !this.addColumnVisible;
        this.columnModelTitle = isEdit ? "编辑栏目" : "新建栏目";
        this.$bus.emit("powerMenuQueryList");
      } else if (this.tabKey === "4") {
        this.addProjectVisible = !this.addProjectVisible;
        this.projectModelTitle = isEdit ? "编辑项目" : "新建项目";
      }
    },
    // 设置设备权限对话框
    showModelPermission() {
      this.addDevicePermissionVisible = !this.addDevicePermissionVisible;
    }
  }
};
</script>
