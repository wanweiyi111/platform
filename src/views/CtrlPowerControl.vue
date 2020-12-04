<template>
  <!-- 权限管理--添加权限控制 -->
  <div class="add-control">
    <a-row class="bottom-sidebar high">
      <a-col>
        <CtrlPanel>
          <dt
            slot="title"
            class="clearfix pd-x20"
          >
            添加权限控制
            <router-link
              class="fr font14"
              to="/ctrl/power-management?tabKey=3"
            >&lt;返回列表</router-link>
          </dt>
          <dd
            slot="content"
            class="pd-x20"
          >
            <a-row
              type="flex"
              justify="end"
              style="line-height:40px;"
            >
              <a-col>
                <a-input-search
                  v-model="searchKey"
                  @search="loadPowerControlList"
                  @keydown.enter="loadPowerControlList"
                  placeholder="请输入关键词"
                  class="mr5"
                  style="width: 200px;margin-right:10px;bottom:2px;"
                  size="small"
                />
                <a-button
                  type="primary"
                  icon="plus"
                  size="small"
                  class="mr5"
                  @click="showModel()"
                >新建</a-button>
              </a-col>
            </a-row>
            <a-row>
              <a-col>
                <a-table
                  :columns="columns"
                  :rowKey="record => record.id"
                  :dataSource="dataList"
                  :pagination="false"
                  :scroll="{x:1400,y:470}"
                >
                  <template
                    slot="operation"
                    slot-scope="text, record"
                  >
                    <a-tooltip
                      placement="top"
                      title="编辑"
                    >
                      <a
                        href="javascript:;"
                        class="white1"
                        @click.stop="showModel(record)"
                      >
                        <i class="iconfont iconpen-square"></i>
                      </a>
                    </a-tooltip>
                    <a-tooltip
                      placement="top"
                      title="删除"
                    >
                      <a
                        href="javascript:;"
                        class="white1"
                        @click.stop="powerDeleteControl(record.id)"
                      >
                        <i class="iconfont icontrash-alt"></i>
                      </a>
                    </a-tooltip>
                  </template>
                </a-table>
                <a-pagination
                  :total="pagination.total"
                  :current="pagination.currentPage"
                  :showTotal="total => `共 ${total} 条`"
                  @change="changePage"
                />
              </a-col>
            </a-row>
          </dd>
        </CtrlPanel>
      </a-col>
    </a-row>

    <PowerAddControl
      :visible="addControlVisible"
      :showModel="showModel"
      :modelTitle="controlModelTitle"
    ></PowerAddControl>
  </div>
</template>

<script>
import _ from "lodash";
import utils from "@/utils/";
import baseMixin from "@/mixins/base.js";
import PowerManager from "@/api/PowerManager";
import CtrlPanel from "@/components/CtrlPanel.vue";
import PowerAddControl from "@/components/PowerManager/PowerAddControl.vue";
import { Tooltip } from "ant-design-vue";

const power = new PowerManager();

const columns = [
  {
    title: "名称",
    dataIndex: "permissionName",
    width: 120,
  },
  {
    title: "URL地址",
    dataIndex: "perms",
    width: 120,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    width: 160,
  },
  {
    title: "修改时间",
    dataIndex: "modifyTime",
    width: 160,
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 100,
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  mixins: [baseMixin],
  components: {
    CtrlPanel,
    PowerAddControl,
    aTooltip: Tooltip,
  },
  data() {
    return {
      searchKey: "",
      columns,
      dataList: [],
      parentId: "",
      pagination: {
        current: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0, //总数
      },
      addControlVisible: false,
      controlModelTitle: "新建权限",
    };
  },

  created() {
    this.parentId = this.$route.query.parentId;
    this.loadPowerControlList();
    this.$bus.on("loadPowerControlList", () => {
      this.loadPowerControlList();
    });
  },
  methods: {
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
      this.pagination.total = res.data.totalNum;
      this.dataList = res.data.data.map((_) => {
        _.createTime = utils.toTime(_.createTime);
        _.modifyTime = utils.toTime(_.modifyTime);
        return _;
      });
      this.searchKey = "";
    },

    // 切换分页
    changePage(page) {
      this.pagination.current = page;
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

    // 删除控制权限
    powerDeleteControl(id) {
      let _this = this;
      this.$modal.confirm({
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
