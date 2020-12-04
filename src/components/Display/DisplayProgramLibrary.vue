<template>
  <!-- 信息发布--节目库 -->
  <div>
    <a-table
      class="Application_table"
      :columns="columns"
      :rowKey="record => record.programId"
      :dataSource="dataListProgramLibrary"
      :pagination="false"
      :rowSelection="rowSelection"
    >
      <!-- 节目状态 -->
      <template
        slot="type"
        slot-scope="text, record"
      >
        <span>{{record.type|filterType}}</span>
      </template>
      <!-- 审核状态 -->
      <template
        slot="reviewStatus"
        slot-scope="text, record"
      >
        <a-tag :color="record.reviewStatus == 1 ?'green':record.reviewStatus == 2?'red':'blue'">
          {{record.reviewStatus|filterReviewStatus}}
        </a-tag>
      </template>
      <!-- 操作 -->
      <template
        slot="operation"
        slot-scope="text, record"
      >
        <div class="action_btn">
          <a-tooltip title="编辑">
            <a-icon
              type="edit"
              @click="() => displayProgramEdit(record)"
            />
          </a-tooltip>
          <a-tooltip title="预览">
            <a-icon
              type="eye"
              class="pl10"
              @click="() => displayProgramPreview(record)"
            />
          </a-tooltip>
          <a-tooltip title="删除">
            <a-icon
              type="delete"
              class="pl10"
              @click="() => displayProgramDelete(record.programId)"
            />
          </a-tooltip>
        </div>
      </template>
    </a-table>
    <a-pagination
      :total="paginationProgramLibrary.total"
      :current="paginationProgramLibrary.current"
      :showTotal="total => `共 ${total} 条`"
      @change="changePage"
    />
  </div>
</template>

<script>
import _ from "lodash";
import { Tag, Tooltip } from "ant-design-vue";
import baseMixin from "@/mixins/base.js";
import Display from "@/api/Display";

const display = new Display();

// 信息发布节目库
const columns = [
  {
    title: "节目名称",
    dataIndex: "programName",
    ellipsis: true,
  },
  {
    title: "创建人",
    dataIndex: "createByName",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    ellipsis: true,
  },
  {
    title: "审核者",
    dataIndex: "reviewUser",
  },
  {
    title: "审核时间",
    dataIndex: "reviewTime",
    ellipsis: true,
  },
  {
    title: "审核状态",
    width: 80,
    align: "center",
    dataIndex: "reviewStatus",
    scopedSlots: { customRender: "reviewStatus" },
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
  mixins: [baseMixin],
  data() {
    return {
      columns,
      dataListProgramLibrary: [],
      paginationProgramLibrary: {
        current: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0, //总数
      },
      programIds: "",
      selectedRowKeys: [], //被选中的列表信息key
      searchData: {},
    };
  },
  components: {
    aTag: Tag,
    aTooltip: Tooltip,
  },
  created() {
    // 审核媒体库
    this.$bus.off("displayProgramAudit").on("displayProgramAudit", (status) => {
      this.displayProgramAudit(this.programIds, status);
    });
    //批量删除
    this.$bus.off("displayProgramDelete").on("displayProgramDelete", () => {
      this.displayProgramDelete(this.programIds, "batchRemove");
    });
    // 搜索
    this.$bus
      .off("loadQueryListProgram")
      .on("loadQueryListProgram", (isSearch, searchData) => {
        if (isSearch) this.paginationProgramLibrary.current = 1;
        this.searchData = searchData;
        this.loadQueryListProgram();
      });
    this.searchData.projectId = this.projectId;
    this.loadQueryListProgram();
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        onSelect: this.onSelectRow,
        onSelectAll: this.onSelectAllRow,
      };
    },
  },
  methods: {
    // 获取信息发布节目库列表数据
    async loadQueryListProgram() {
      let params = `/${this.paginationProgramLibrary.current}/${this.paginationProgramLibrary.pageSize}`;
      let res = await display
        .screenProgramQueryList(params, this.searchData)
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code != 200) {
        return;
      }
      this.paginationProgramLibrary.total = res.data.total;
      this.dataListProgramLibrary = res.data.list;
      this.selectedRowKeys = [];
      this.programIds = "";
      this.$bus.emit("clearQueryObjProgram");
    },

    // 获取信息发布--节目列表分页
    changePage(page) {
      this.paginationProgramLibrary.current = page;
      this.loadQueryListProgram();
    },

    displayProgramEdit(record) {
      this.$router.push({
        path: "/application-manage/display/add-program",
        query: { programId: record.programId, modelTitle: '编辑节目' },
      });
    },
    // 信息发布媒体库预览
    displayProgramPreview(record) {
      this.$emit("displayPreview", "displayProgramLibrary", record);
    },

    //信息发布节目审核
    async displayProgramAudit(programIds, status) {
      this.$message.destroy();
      if (_.isEmpty(programIds)) {
        this.$message.warning("请选择要审核的节目！");
        return;
      }
      let params = [...programIds.split(",")];
      params.pop();
      let res = await display
        .screenProgramModStatus({ list: params, status: status })
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning("审核失败！");
        return;
      }
      this.loadQueryListProgram();
      this.$message.success("审核成功！");
    },
    //信息发布节目库删除节目信息
    displayProgramDelete(programIds, batchRemove) {
      if (_.isEmpty(programIds) && !_.isEmpty(batchRemove)) {
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
          _this.displayProgramRemoveInfo(programIds, batchRemove);
        },
        onCancel() {},
      });
    },
    async displayProgramRemoveInfo(programIds, batchRemove) {
      let params = [];
      if (batchRemove) {
        params = [...programIds.split(",")];
        params.pop();
      } else {
        params = [programIds];
      }

      let res = await display
        .screenProgramRemove({ list: params })
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning("删除失败！");
        return;
      }
      this.loadQueryListProgram();
      this.$message.success("删除成功！");
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
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
      let programIds = "";
      selectedRows.forEach((_) => {
        programIds += _.programId + ",";
      });
      this.programIds = programIds;
      //判断是否可以被审核，已驳回（2），已通过（1）的不能再被审核，只有待审（0）的能被审核
      let isAuditProgram = (selectedRows || [])
        .map((_) => _.reviewStatus)
        .some((_) => _ != 0);

      this.$bus.emit("displayProgramBtnStatus", isAuditProgram);
    },
  },
  filters: {
    filterType(value) {
      if (_.isEmpty(value)) {
        return value == 2 ? "图片" : value == 3 ? "视频" : "文本";
      }
    },
    filterReviewStatus(value) {
      if (_.isEmpty(value)) {
        return value == 0 ? "待审核" : value == 1 ? "已审核" : "已驳回";
      }
    },
  },
};
</script>
