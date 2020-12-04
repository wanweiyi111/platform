<template>
  <!-- 权限管理--添加权限控制 -->
  <div class="application_from">
    <a-row>
      <a-col :span="20">
        <Breadcrumb />
      </a-col>
      <a-col :span="4">
        <router-link
          class="fr font14 white1 "
          to="/system/power?tabKey=3"
        >
          <a-icon
            class="pr5"
            type="rollback"
          />返回栏目管理
        </router-link>
      </a-col>
    </a-row>
    <a-row class="search mt10">
      <a-col :span="6">
        <a-input-search
          v-model="searchKey"
          @search="searchChange"
          placeholder="请输入关键词"
          class="mr5"
        />
      </a-col>
    </a-row>
    <a-row class="mt20">
      <a-col :spam="24">
        <a-tabs
          class="Application_tabs"
          :activeKey="tabKey"
          @change="changeTabs"
        >
          <a-tab-pane
            :tab="columnTitle + ' - 权限列表'"
            key="1"
          >
            <div class="tab-btns">
              <a-button
                type="dashed"
                icon="plus"
                @click="showModel()"
              >新建权限</a-button>
            </div>
            <a-table
              class="Application_table"
              :columns="columns"
              :rowKey="record => record.id"
              :dataSource="dataList"
              :pagination="pagination"
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
                    type="edit"
                    @click.stop="showModel(record)"
                  />
                </a-tooltip>
                <a-tooltip
                  placement="top"
                  title="删除"
                >
                  <a-icon
                    type="delete"
                    class="pl10"
                    @click.stop="powerDeleteControl(record.id)"
                  />
                </a-tooltip>
              </div>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
    <PowerAddControl
      :visible="addControlVisible"
      :showModel="showModel"
      :modelTitle="controlModelTitle"
      @getControlAdd="getControlAdd"
    ></PowerAddControl>
  </div>
</template>

<script>
import _ from "lodash";
import utils from "@/utils/";
import baseMixin from "@/mixins/base.js";
import PowerManager from "@/api/PowerManager";
import PowerAddControl from "@/components/PowerManager/PowerAddControl.vue";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
import { Tooltip } from "ant-design-vue";

const power = new PowerManager();

const columns = [
  {
    title: "名称",
    dataIndex: "permissionName",
  },
  {
    title: "URL地址",
    dataIndex: "perms",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    width: 140,
  },
  {
    title: "修改时间",
    dataIndex: "modifyTime",
    width: 140,
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 80,
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  mixins: [baseMixin],
  components: {
    PowerAddControl,
    aTooltip: Tooltip,
    Breadcrumb,
  },
  data() {
    return {
      searchKey: "",
      columns,
      dataList: [],
      parentId: "",
      pagination: {
        current: 1, //当前页
        pageSize: 8, //每页显示条数
        total: 0, //总数
        showTotal: (total) => `共 ${total} 条`,
      },
      addControlVisible: false,
      controlModelTitle: "新建权限",
      tabKey: "1",
      columnTitle: "",
    };
  },

  created() {
    let query = this.$route.query;
    this.parentId = query.parentId;
    this.columnTitle = query.columnTitle;
    this.loadPowerControlList();
    // this.$bus.on("loadPowerControlList", () => {
    //   this.loadPowerControlList();
    // });
  },
  methods: {
    changeTabs(key) {
      this.tabKey = key;
    },
    // 搜索
    searchChange() {
      this.pagination.current = 1;
      this.loadPowerControlList();
      this.searchKey = "";
    },
    // 获取菜单列表数据
    async loadPowerControlList() {
      let params = `${this.pagination.current}/${this.pagination.pageSize}`;
      let data = {
        parentId: this.parentId,
        permissionName: this.searchKey,
        type: 1,
        projectId: this.projectId,
      };
      let res = await power
        .powerQueryMethodPermissionList(params, data)
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("加载失败");
        return;
      }
      this.pagination.current = res.data.currentPage;
      this.pagination.total = res.data.totalNum;
      this.dataList = res.data.data.map((_) => {
        _.createTime = utils.toTime(_.createTime);
        _.modifyTime = utils.toTime(_.modifyTime);
        return _;
      });
    },

    // 切换分页
    changePage(page) {
      this.pagination.current = page.current;
      this.loadPowerControlList();
    },

    showModel(record) {
      this.addControlVisible = !this.addControlVisible;
      if (_.isEmpty(record)) {
        this.controlModelTitle = "新建权限";
        const TYPE = 1; //权限类型，1按钮，0菜单
        let params = {
          parentId: this.parentId,
          type: TYPE,
        };
        this.$bus.emit("initFormAddControl", params);
      } else {
        this.controlModelTitle = "编辑权限";
        const IS_EDIT = true;
        this.$bus.emit("initFormAddControl", record, IS_EDIT);
      }
    },
    // 新增/编辑权限 子级返回值
    getControlAdd(res) {
      console.log("返回", res);
      this.pagination.current = 1;
      this.loadPowerControlList();
    },
    // 删除控制权限
    powerDeleteControl(id) {
      let _this = this;
      this.$modal.confirm({
        class: "application_modal",
        title: "确定要删除吗?",
        okText: "确定",
        cancelText: "取消",
        centered: true,
        onOk() {
          _this.powerControlDeleteInfo(id);
        },
        onCancel() {},
      });
    },
    async powerControlDeleteInfo(id) {
      let params = `promissionIds=${id}`;
      let res = await power.powerColumnDeletePermission(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("权限删除失败");
        return;
      }
      this.$message.success("权限删除成功");
      this.loadPowerControlList();
    },
  },
};
</script>
