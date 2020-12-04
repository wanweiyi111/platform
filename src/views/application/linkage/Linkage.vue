<template>
  <a-row>
    <a-col :span="24">
      <Breadcrumb />
      <a-row class="search mt10">
        <a-col :span="6">
          <a-input-search
            v-model="queryObj.equipmentName"
            @keydown.enter="loadList"
            placeholder="请输入关键词"
          />
        </a-col>
      </a-row>
    </a-col>
    <a-col :span="24">
      <a-row class="mt20">
        <a-col :span="24">
          <a-tabs
            class="Application_tabs"
            :activeKey="tabKey"
            @change="changeTabs"
          >
            <a-tab-pane
              tab="列表"
              key="1"
            >
              <div class="tab-btns">
                <a-button
                  type="dashed"
                  icon="delete"
                  @click="deleteMutip"
                >删除</a-button>
              </div>
              <a-table
                class="Application_table"
                :columns="columns"
                :rowKey="record => record.id"
                :dataSource="linkList"
                :pagination="pageInfo"
                :bordered="false"
                :rowSelection="{onSelect: (record, selected, selectedRows) => this.delRows = selectedRows, onSelectAll: (record, selected, selectedRows) => this.delRows = selectedRows}"
                size="middle"
                @change="changePage"
              >
                <span
                  slot="action"
                  slot-scope="text, record"
                >
                  <a
                    href="javascript:;"
                    class="white1 mr5"
                    @click.stop="showRules(record)"
                    title="查看联动规则"
                  >
                    <i class="iconfont iconlink"></i>
                  </a>
                  <router-link
                    :to="'./linkage-edit?linkId=' + record.id"
                    class="white1"
                    title="修改"
                  >
                    <i class="iconfont iconpen-alt"></i>
                  </router-link>
                </span>
              </a-table>

            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </a-col>
    <!-- 查看联动设备  -->
    <a-modal
      title="查看联动设备"
      :visible="showDetails"
      @ok="showDetails = false"
      @cancel="showDetails = false"
      class="modal-no-padding"
      okText='确定'
      cancelText='取消'
    >
      <RuleTable
        :ruleList="curRule.details"
        :type="type"
        :isEdit="false"
      ></RuleTable>
    </a-modal>
  </a-row>

</template>

<script>
import _ from "lodash";
import { mapActions, mapGetters, mapMutations } from "vuex";
import utils from "@/utils/";
import Unions from "@/api/Unions.js";
// import Pole from "@/api/Pole.js";
import MapMixin from "@/mixins/map.js";
import baseMixin from "@/mixins/base.js";
import RuleTable from "@/components/Linkage/RuleTable.vue";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";

const unions = new Unions();
// const pole = new Pole();

const columns = [
  {
    title: "序号",
    dataIndex: "id",
  },
  {
    title: "联动名称",
    dataIndex: "name",
  },
  {
    title: "联动类型",
    dataIndex: "type",
  },
  {
    title: "联动设备数量",
    dataIndex: "equipmentNumber",
  },
  {
    title: "联动规则条数",
    dataIndex: "ruleNumber",
  },
  {
    title: "生效状态",
    dataIndex: "status",
  },
  {
    title: "所属智慧杆",
    dataIndex: "poleName",
  },
  {
    title: "所属分组",
    dataIndex: "groupName",
  },
  // {
  //   title: "智慧杆位置",
  //   dataIndex: "location"
  // },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "linkage",
  mixins: [baseMixin, MapMixin],
  components: {
    RuleTable,
    Breadcrumb,
  },
  data() {
    return {
      pageInfo: { current: 1, pageNum: 1, pageSize: 10 },
      columns,
      linkList: [],
      delRows: [],
      showMoreLight: false,
      curRule: {},
      showDetails: false,
      tabKey: "1",
    };
  },
  computed: {
    ...mapGetters(["poleList"]),
    type() {
      return _.isEmpty(this.curRule) ? "1" : this.curRule.rule.type;
    },
  },
  created() {
    // 左侧菜单 -s
    let routeData = this.$route;
    let currentMenuId = routeData.meta.id || "";
    let currentMenuParentId = routeData.meta.parentId || "";
    this.setCurrentMenu(currentMenuId);
    this.setCurrentParentMenu(currentMenuParentId);

    this.loadAllDevice();
    this.loadPageDevice();
  },
  methods: {
    ...mapMutations(["setCurrentMenu", "setCurrentParentMenu"]),
    ...mapActions(["loadAllPoles"]),
    changeTabs(key) {
      this.tabKey = key;
    },
    async loadAllDevice() {
      try {
        // let res = await pole.findByProjectId(this.queryObj);
        this.queryObj.projectId = this.projectId;
        if (_.isEmpty(this.poleList)) {
          this.loadAllPoles(this.queryObj).then(() => {
            this.setMapMarks(this.poleList, "pole");
          });
        } else {
          this.setMapMarks(this.poleList, "pole");
        }
      } catch (err) {
        console.info(err);
      }
    },

    async loadPageDevice() {
      try {
        // debugger;
        this.queryObj.projectId = this.projectId;
        let res = await unions.queryList(this.queryObj, this.pageInfo);
        if (res.code != 200) {
          return;
        }
        this.linkList = res.data.list.map((item) => {
          item.type = utils.getLinkageTypeText(item.type);
          item.status = utils.getLinkageStatusText(item.status);
          return item;
        });
        this.pageInfo.current = res.data.pageNum;
        this.pageInfo.pageNum = res.data.pageNum;
        this.pageInfo.pageSize = res.data.pageSize;
      } catch (err) {
        console.log(err);
      }
    },
    changePage(pageInfo) {
      this.pageInfo = pageInfo;
      this.loadPageDevice();
    },
    selectedRow(pole) {
      this.$router.push(`/ctrl/linkage-operat/${pole.id}`);
    },
    async deleteMutip() {
      const option = {
        list: this.delRows.map((item) => {
          return item.id;
        }),
      };
      try {
        let res = await unions.deleteRule(option);
        if (res.code !== "200") {
          this.$message.error(res.msg || "删除失败");
        } else {
          this.$message.success(res.msg || "删除成功");
          this.loadPageDevice();
          this.loadAllDevice();
        }
      } catch (err) {
        this.$message.error(err);
      }
    },
    // async changeStatus(record) {
    //   const option = {
    //     rule: {
    //       id: record.id,
    //       status: record.status === 0 ? 1 : 0
    //     }
    //   };
    //   try {
    //     let res = await unions.modifyRule(option);
    //     if (res.code !== "200") {
    //       this.$message.error(res.msg || "删除失败");
    //     } else {
    //       this.$message.success(res.msg || "删除成功");
    //       this.loadPageDevice();
    //       this.loadAllDevice();
    //     }
    //   } catch (err) {
    //     this.$message.error(err);
    //   }
    // },
    async showRules(record) {
      try {
        let res = await unions.ruleQuery(record.id);
        if (res.code !== "200") {
          this.$message.error(res.msg);
          return;
        }
        this.curRule = res.data;
        this.showDetails = true;
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>