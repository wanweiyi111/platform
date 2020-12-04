<template>
  <!-- 信息发布--分组 -->
  <div>
    <a-table
      class="Application_table"
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="dataListDisplayGroup"
      :pagination="false"
    >
      <!-- 分组联网状态 -->
      <template
        slot="networkState"
        slot-scope="text, record"
        v-if="record.networkState"
      >
        <a-badge
          :status="Number(record.networkState)?'success':'default'"
          :text="Number(record.networkState)?'正常':'离线'"
        />
      </template>
      <template
        slot="equipmentStatus"
        slot-scope="text, record"
        v-if="record.equipmentStatus"
      >
        <a-badge
          :status="Number(record.equipmentStatus)?'success':'error'"
          :text="Number(record.equipmentStatus)?'正常':'故障'"
        />
      </template>
      <div
        slot="operation"
        slot-scope="text, record"
        class="action_btn"
      >
        <template v-if="record.resourceType==1">
          <a-tooltip
            placement="top"
            title="编辑"
          >
            <a-icon
              type="edit"
              @click="() => displayGroupEdit(record)"
            />
          </a-tooltip>
          <a-tooltip
            placement="top"
            title="添加大屏"
          >
            <a-icon
              type="plus"
              class="pl10"
              @click="() => displayGroupAddScreen(record)"
            />
          </a-tooltip>
        </template>
        <!-- 未分组的大屏信息不能被删除 -->
        <template v-if="!record.screen">
          <a-tooltip title="删除">
            <a-icon
              type="delete"
              class="pl10"
              @click="() => displayGroupDelete(record)"
            />
          </a-tooltip>
        </template>
      </div>
    </a-table>
    <a-pagination
      :total="paginationDisplayGroup.total"
      :current="paginationDisplayGroup.current"
      :showTotal="total => `共 ${total} 条`"
      @change="changePage"
    />
  </div>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import Display from "@/api/Display";
import { Badge, Tooltip } from "ant-design-vue";
const display = new Display();

// 信息发布分组colums数据
const columns = [
  {
    title: "ID",
    width: 80,
    align: "center",
    dataIndex: "id",
  },
  {
    title: "资源名称",
    dataIndex: "resourceName",
    ellipsis: true,
  },
  {
    title: "安装位置",
    dataIndex: "location",
    ellipsis: true,
  },
  {
    title: "联网状态",
    width: 80,
    align: "center",
    dataIndex: "networkState",
    scopedSlots: { customRender: "networkState" },
  },
  {
    title: "设备状态",
    width: 80,
    align: "center",
    dataIndex: "equipmentStatus",
    scopedSlots: { customRender: "equipmentStatus" },
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
      dataListDisplayGroup: [], //分组列表数据
      paginationDisplayGroup: {
        //信息发布分组分页数据
        current: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0, //总数
      },
      searchData: {},
    };
  },
  components: {
    aTooltip: Tooltip,
    aBadge: Badge,
  },
  created() {
    // 搜索
    this.$bus.on("loadQueryListGroup", (isSearch, searchData) => {
      if (isSearch) this.paginationDisplayGroup.current = 1;
      this.searchData = searchData;
      this.loadQueryListGroup();
    });

    this.searchData.projectId = this.projectId;
    this.loadQueryListGroup();
  },
  methods: {
    // 处理接口返回的数据
    processingData(data) {
      let processedData = (data || []).map((_) => {
        if (_.children && _.children.length == 0) {
          delete _.children;
        }
        return _;
      });
      return processedData;
    },
    // 获取信息发布--分组列表数据
    async loadQueryListGroup() {
      let params = `${this.paginationDisplayGroup.current}/${this.paginationDisplayGroup.pageSize}`;
      let res = await display
        .screenGroupQueryList(params, this.searchData)
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code != 200) {
        return;
      }
      this.paginationDisplayGroup.total = res.totalNum;
      this.dataListDisplayGroup = this.processingData(res.data);
      this.$bus.emit("clearQueryObjGroup");
    },

    // 信息发布--分组列表分页
    changePage(page) {
      this.paginationDisplayGroup.current = page;
      this.loadQueryListGroup();
    },

    // 编辑
    displayGroupEdit(record) {
      const IS_EDIT = true;
      this.$bus.emit("showModalAddGroup", IS_EDIT);
      this.$bus.emit("initFormAddGroup", record, IS_EDIT);
    },
    // 给分组添加大屏
    displayGroupAddScreen(record) {
      const IS_SHOW = true;
      this.$bus.emit("showModelGroupAddScreen", IS_SHOW);
      this.$bus.emit("currentGroupAddScreen", record);
    },

    // 删除信息发布分组信息
    displayGroupDelete(record) {
      let _this = this;
      this.$modal.confirm({
        class: "application_modal",
        title: "确定要删除吗?",
        okText: "确定",
        cancelText: "取消",
        centered: true,
        onOk() {
          _this.displayScreenGroupRemove(record);
        },
        onCancel() {},
      });
    },
    //删除接口
    async displayScreenGroupRemove(record) {
      let params = "";
      if (record.rank) {
        params = `groupIds=${record.groupId}&screenIds=${record.id}`;
      } else {
        params = `groupIds=${record.id}&screenIds=`;
      }
      let res = await display.screenGroupRemove(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== 200) {
        this.$message.warning("删除失败");
        return;
      }
      this.loadQueryListGroup();
      this.$message.success("删除成功！");
    },
  },
  filters: {
    filterNetworkState(value) {
      if (!_.isEmpty(value)) {
        return value == 1 ? "在线" : "离线";
      }
    },
    filterEquipmentStatus(value) {
      if (!_.isEmpty(value)) {
        return value == 1 ? "正常" : "故障";
      }
    },
  },
};
</script>
<style lang="less" scope>
.ant-pagination {
  margin: 16px 0;
  text-align: right;
}
.white1 {
  margin-right: 10px;
}
</style>