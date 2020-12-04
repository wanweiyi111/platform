<template>
  <!-- 信息发布--媒体库 -->
  <div>
    <a-table
      class="Application_table"
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="dataListMediaLibrary"
      :pagination="false"
      :rowSelection="rowSelection"
    >

      <template
        slot="type"
        slot-scope="text, record"
      >
        <span>{{ record.type | filterType }}</span>
      </template>
      <template
        slot="status"
        slot-scope="text, record"
      >
        <a-tag :color="record.statusCode == 1 ?'green':record.statusCode == 2?'red':'blue'">
          {{record.status}}
        </a-tag>
      </template>
      <div
        slot="operation"
        slot-scope="text, record"
        class="action_btn"
      >
        <a-tooltip title="下载">
          <a-icon
            type="vertical-align-bottom"
            @click="() => displayMediaDownload(record.id)"
          />
        </a-tooltip>
        <a-tooltip title="预览">
          <a-icon
            type="eye"
            :style="{ paddingLeft: '10px' }"
            @click="displayMediaPreview(record)"
          />
        </a-tooltip>
        <a-tooltip
          placement="top"
          title="删除"
        >
          <a-icon
            type="delete"
            :style="{ paddingLeft: '10px' }"
            @click="() => displayMediaDelete(record.id)"
          />
        </a-tooltip>
      </div>
    </a-table>
    <a-pagination
      :total="paginationMediaLibrary.total"
      :current="paginationMediaLibrary.current"
      :showTotal="total => `共 ${total} 条`"
      @change="changePage"
    />
  </div>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import Display from "@/api/Display";
import { Tag, Tooltip } from "ant-design-vue";

const display = new Display();

const columns = [
  {
    title: "名称",
    dataIndex: "mediaName",
    ellipsis: true,
  },
  {
    title: "类型",
    dataIndex: "type",
    width: 80,
    scopedSlots: { customRender: "type" },
  },
  {
    title: "文件大小",
    dataIndex: "size",
  },
  {
    title: "上传人",
    dataIndex: "createByName",
  },
  {
    title: "上传时间",
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
    scopedSlots: { customRender: "status" },
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
      dataListMediaLibrary: [],
      paginationMediaLibrary: {
        current: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0, //总数
      },
      mediaIds: "",
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
    this.$bus.off("displayMediaAudit").on("displayMediaAudit", (status) => {
      this.displayMediaAudit(this.mediaIds, status);
    });
    // 批量删除
    this.$bus.off("displayMediaDelete").on("displayMediaDelete", () => {
      this.displayMediaDelete(this.mediaIds, "batchRemove");
    });
    // 搜索
    this.$bus
      .off("loadQueryListMedia")
      .on("loadQueryListMedia", (isSearch, searchData) => {
        if (isSearch) this.paginationMediaLibrary.current = 1;
        this.searchData = searchData;
        this.loadQueryListMedia();
      });
    this.searchData.projectId = this.projectId;
    this.loadQueryListMedia();
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
    // 获取信息发布媒体库列表数据
    async loadQueryListMedia() {
      let params = `${this.paginationMediaLibrary.current}/${this.paginationMediaLibrary.pageSize}`;
      let res = await display
        .screenMediaQueryList(params, this.searchData)
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code != 200) {
        return;
      }
      this.paginationMediaLibrary.total = res.data.total;
      this.dataListMediaLibrary = res.data.list;
      this.selectedRowKeys = [];
      this.mediaIds = "";
      this.$bus.emit("clearQueryObjMedia");
    },

    // 信息发布媒体库列表分页
    changePage(page) {
      this.paginationMediaLibrary.current = page;
      this.loadQueryListMedia();
    },
    // 信息发布媒体库预览
    displayMediaPreview(record) {
      record.url = record.url + "&token=" + sessionStorage.getItem("token");
      this.$emit("displayPreview", "displayMediaLibrary", record);
    },
    // 信息发布媒体审核
    async displayMediaAudit(mediaIds, status) {
      if (_.isEmpty(mediaIds)) {
        this.$message.warning("请选择要审核的媒体！");
        return;
      }
      let params = [...mediaIds.split(",")];
      params.pop();
      let res = await display
        .screenMediaModStatus({ list: params, status: status })
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res)) {
        this.$message.warning("审核失败！");
        return;
      }
      this.$message.success(status == 1 ? "审核成功！" : "驳回成功！");
      this.loadQueryListMedia();
    },
    // 信息发布媒体库下载文件
    async displayMediaDownload(id) {
      let res = await display.screenMediaFileDownload(id).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res)) {
        this.$message.warning("下载失败！");
        return;
      }
      console.log("下载", res);
      let downUrl = `${res}&token=${sessionStorage.getItem("token")}`;
      window.open(downUrl);
    },
    //信息发布媒体库删除媒体信息
    displayMediaDelete(mediaIds, batchRemove) {
      if (_.isEmpty(mediaIds) && !_.isEmpty(batchRemove)) {
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
          _this.displayMediaRemoveInfo(mediaIds, batchRemove);
        },
        onCancel() {},
      });
    },
    async displayMediaRemoveInfo(mediaIds, batchRemove) {
      let params = [];
      if (batchRemove) {
        params = [...mediaIds.split(",")];
        params.pop();
      } else {
        params = [mediaIds];
      }

      let res = await display
        .screenMediaRemove({ list: params })
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res)) {
        return;
      }
      this.$message.success("删除成功！");
      this.loadQueryListMedia();
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
      let mediaIds = "";
      selectedRows.forEach((_) => {
        mediaIds += _.id + ",";
      });
      this.mediaIds = mediaIds;
      //判断是否可以被审核，已驳回（2），已通过（1）的不能再被审核，只有待审（0）的能被审核
      let isAuditMedia = (selectedRows || [])
        .map((_) => _.statusCode)
        .some((_) => _ != 0);

      this.$bus.emit("displayMediaBtnStatus", isAuditMedia);
    },
  },
  filters: {
    filterType(value) {
      if (_.isEmpty(value)) {
        return value == 2 ? "图片" : value == 3 ? "视频" : "文本";
      }
    },
  },
};
</script>
