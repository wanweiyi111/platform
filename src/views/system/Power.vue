<template>
  <!-- 权限管理 -->
  <div class="power-management">
    <a-row>
      <a-col :spam="24">
        <Breadcrumb />
      </a-col>
    </a-row>
    <div class="search mt10">
      <a-row>
        <a-col :span="6">
          <a-input-search
            v-model="searchKey"
            @search="powerSearch"
            placeholder="请输入关键词"
            v-show="tabKey==1||tabKey==4"
          />
        </a-col>
      </a-row>
    </div>
    <a-row class="mt20">
      <a-col :span="24">
        <a-tabs
          class="Application_tabs"
          :activeKey="tabKey"
          @change="changeTabs"
        >
          <a-tab-pane
            tab="用户管理"
            key="1"
          >
            <div class="tab-btns">
              <a-button
                type="dashed"
                icon="plus"
                @click="showModel(false)"
              >{{addBtnName}}</a-button>
            </div>
            <UserManagement @showModelPermission="showModelPermission"></UserManagement>
          </a-tab-pane>
          <a-tab-pane
            tab="角色管理"
            key="2"
          >
            <div class="tab-btns">
              <a-button
                type="dashed"
                icon="plus"
                @click="showModel(false)"
              >{{addBtnName}}</a-button>
            </div>
            <RoleManagement></RoleManagement>
          </a-tab-pane>
          <a-tab-pane
            tab="栏目管理"
            key="3"
          >
            <div class="tab-btns">
              <a-button
                type="dashed"
                icon="plus"
                @click="showModel(false)"
              >{{addBtnName}}</a-button>
            </div>
            <ColumnManagement></ColumnManagement>
          </a-tab-pane>
          <a-tab-pane
            tab="项目管理"
            key="4"
          >
            <div class="tab-btns">
              <a-button
                type="dashed"
                icon="plus"
                @click="showModel(false)"
              >{{addBtnName}}</a-button>
            </div>
            <ProjectManagement ref="projectManagement"></ProjectManagement>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
    <!-- 新建/编辑用户对话框 -->
    <PowerAddUser
      :visible="addUserVisible"
      :showModel="showModel"
      :modelTitle="userModelTitle"
    />
    <!-- 角色管理设置设备权限 -->
    <ModalSetDevicePermission
      :visible="addDevicePermissionVisible"
      :showModel="showModelPermission"
    ></ModalSetDevicePermission>

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
import { mapMutations } from "vuex";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
import UserManagement from "@/components/PowerManager/UserManagement.vue";
import ModalSetDevicePermission from "@/components/PowerManager/ModalSetDevicePermission.vue";
import RoleManagement from "@/components/PowerManager/RoleManagement";
import ColumnManagement from "@/components/PowerManager/ColumnManagement.vue";
import ProjectManagement from "@/components/PowerManager/ProjectManagement";
import PowerAddUser from "@/components/PowerManager/PowerAddUser.vue";
import PowerAddColumn from "@/components/PowerManager/PowerAddColumn.vue";
import PowerAddProject from "@/components/PowerManager/PowerAddProject.vue";

export default {
  components: {
    Breadcrumb,
    UserManagement,
    ModalSetDevicePermission,
    RoleManagement,
    ColumnManagement,
    ProjectManagement,
    PowerAddUser,
    PowerAddColumn,
    PowerAddProject,
  },
  data() {
    return {
      searchKey: "",
      tabKey: "1",
      userModelTitle: "新建用户",
      roleModelTitle: "新建角色",
      columnModelTitle: "新建栏目",
      projectModelTitle: "新建项目",
      addBtnName: "", //按钮文字
      addUserVisible: false,
      addColumnVisible: false,
      addProjectVisible: false,
      addDevicePermissionVisible: false,
      btnName: ["新建用户", "新建角色", "新建栏目", "新建项目"],
    };
  },
  created() {
    this.tabKey = this.$route.query.tabKey || "1";
    this.addBtnName = this.btnName[Number(this.tabKey) - 1];
    this.$bus.on("showEditModel", (tabKey, isEdit) => {
      this.tabKey = tabKey;
      this.showModel(isEdit);
    });
    //设置设备权限对话框;
    // this.$bus.on("showModelPermission", () => {
    //   this.showModelPermission();
    // });

    // this.$bus.on("clearSearchKey", () => {
    //   this.searchKey = "";
    // });
  },

  methods: {
    ...mapMutations(["setCurrentMenu", "setCurrentParentMenu"]),
    // 切换tab页签
    changeTabs(key) {
      this.tabKey = key;
      this.addBtnName = this.btnName[Number(this.tabKey) - 1];
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
          path: "/system/power/power-add-role",
          query: { modelTitle: this.roleModelTitle },
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
    },
    // 项目管理-新建/编辑 项目
    getProjectAdd() {
      this.$bus.emit("loadPowerProjectList");
    },
  },
};
</script>
