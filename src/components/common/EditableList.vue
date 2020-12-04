<template>
  <div>
    <a-table
      class="Application_table"
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="dataList"
      :rowSelection="{onSelect: onSelectRow,onSelectAll: onSelectAllRow}"
      :pagination="pagination"
      :scroll="{y:470}"
    >
      <!-- 照明分组联网状态 -->
      <template
        slot="networkState"
        slot-scope="text, record"
        v-if="funModules=='lightGrouping'||funModules=='displayGroup'"
      >
        <span>{{record.networkState|filterNetworkState}}</span>
      </template>
      <!-- 照明分组设备状态 -->
      <template
        slot="equipmentStatus"
        slot-scope="text, record"
        v-if="funModules=='lightGrouping'||funModules=='displayGroup'"
      >
        <span>{{record.equipmentStatus|filterEquipmentStatus}}</span>
      </template>
      <!-- 信息发布节目库审核状态 -->
      <template
        slot="reviewStatus"
        slot-scope="text, record"
        v-if="funModules=='displayProgramLibrary'"
      >
        <span>{{record.reviewStatus|filterReviewStatus}}</span>
      </template>
      <template
        slot="type"
        slot-scope="text, record"
      >
        <span>{{record.type|filterType}}</span>
      </template>
      <!-- 计划状态 -->
      <template
        slot="status"
        slot-scope="text, record"
        v-if="funModules=='lightTask'"
      >
        <span>{{record.statusCode|filterStatus}}</span>
      </template>
      <!-- 操作 -->
      <template
        slot="operation"
        slot-scope="text, record"
      >
        <!-- 照明-分组操作字段内容 -->
        <div
          class="editable-row-operations"
          v-if="funModules=='lightGrouping'"
        >
          <!-- 资源类型（resourceType）为1时可编辑修改信息，为2时不可修改；级别（rank）是child(子节点) -->
          <div v-if="!record.rank">
            <a-tooltip
              placement="top"
              title="编辑"
            >
              <a
                href="javascript:;"
                v-if="record.resourceType===1"
                @click="() => lightGroupingEdit(record.id)"
              >
                <a-icon
                  type="edit"
                  style="fontSize:16px;color:#fff"
                />
              </a>
            </a-tooltip>
            <a-tooltip
              placement="top"
              title="添加智慧杆"
            >
              <a
                href="javascript:;"
                v-if="record.resourceType==1"
                @click="() => lightGroupingAddLight(record.id)"
              >
                <a-icon
                  type="plus"
                  style="fontSize:16px;color:#fff"
                />
              </a>
            </a-tooltip>
            <a-switch
              v-if="record.resourceType == 1"
              checkedChildren="开启"
              unCheckedChildren="关闭"
              class="ml10"
              v-model="record.onOff"
              @change="setOnOffGroupLights(record)"
            />
          </div>
        </div>
        <!-- 照明-任务操作字段内容 -->
        <div
          class="editable-row-operations"
          v-else-if="funModules=='lightTask'"
        >
          <div v-if="!record.rank">
            <a-tooltip
              placement="top"
              title="编辑任务"
            >
              <a
                href="javascript:;"
                @click="() => lightAddTask(record)"
              >
                <a-icon
                  type="edit"
                  style="fontSize:16px;color:#fff"
                />
              </a>
            </a-tooltip>
            <a-tooltip
              placement="top"
              title="修改状态"
            >
              <a
                href="javascript:;"
                @click="() => changeTaskStatus(record)"
              >
                <a-icon
                  :type="record.statusCode==1?'eye':'eye-invisible'"
                  style="fontSize:16px;color:#fff"
                />
              </a>
            </a-tooltip>
          </div>
        </div>
        <!-- 信息发布--媒体库操作字段内容 -->
        <div
          class="editable-row-operations"
          v-else-if="funModules=='displayMediaLibrary'"
        >
          <a-tooltip
            placement="top"
            title="下载"
          >
            <a
              href="javascript:;"
              @click="() => displayMediaDownload(record.id)"
            >
              <a-icon
                type="download"
                style="fontSize:16px;color:#fff"
              />
            </a>
          </a-tooltip>
          <a-tooltip
            placement="top"
            title="预览"
          >
            <a
              href="javascript:;"
              @click="() => displayMediaPreview(record)"
            >
              <a-icon
                type="eye"
                style="fontSize:16px;color:#fff"
              />
            </a>
          </a-tooltip>
        </div>
        <!-- 信息发布--节目库操作字段内容 -->
        <div
          class="editable-row-operations"
          v-else-if="funModules=='displayProgramLibrary'"
        >
          <a-tooltip
            placement="top"
            title="编辑"
          >
            <router-link :to="'/ctrl/add-program?id='+record.programId">
              <a-icon
                type="edit"
                style="fontSize:16px;color:#fff"
              />
            </router-link>
          </a-tooltip>
          <a-tooltip
            placement="top"
            title="预览"
          >
            <a
              href="javascript:;"
              @click="() => displayMediaPreview(record)"
            >
              <a-icon
                type="eye"
                style="fontSize:16px;color:#fff"
              />
            </a>
          </a-tooltip>
        </div>
        <!-- 信息发布--分组操作字段内容 -->
        <div
          class="editable-row-operations"
          v-if="funModules=='displayGroup'"
        >
          <div v-if="!record.rank">
            <a-tooltip
              placement="top"
              title="编辑"
            >
              <a
                href="javascript:;"
                v-if="record.resourceType===1"
                @click="() => lightGroupingEdit(record.id,record.resourceName)"
              >
                <a-icon
                  type="edit"
                  style="fontSize:16px;color:#fff"
                />
              </a>
            </a-tooltip>
            <a-tooltip
              placement="top"
              title="添加大屏"
            >
              <a
                href="javascript:;"
                v-if="record.resourceType==1"
                @click="() => lightGroupingAddLight(record.id)"
              >
                <a-icon
                  type="plus"
                  style="fontSize:16px;color:#fff"
                />
              </a>
            </a-tooltip>
          </div>
        </div>
        <!-- 信息发布--任务操作字段内容 -->
        <div
          class="editable-row-operations"
          v-else-if="funModules=='displayTask'"
        >
          <div v-if="!record.rank">
            <router-link :to="'/ctrl/info-add-task?title=编辑任务&id='+record.taskId">
              <a-tooltip
                placement="top"
                title="编辑"
              >
                <a-icon
                  type="edit"
                  style="fontSize:16px;color:#fff"
                />
              </a-tooltip>
            </router-link>
            <a-tooltip
              placement="top"
              title="修改状态"
            >
              <a
                href="javascript:;"
                @click="() => changeTaskStatus(record)"
              >
                <a-icon
                  type="poweroff"
                  style="fontSize:16px;color:#fff"
                />
              </a>
            </a-tooltip>
          </div>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import _ from "lodash";
import Api from "@/api";
import { Tooltip } from "ant-design-vue";

export default {
  name: "grouping",
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      required: true,
    },
    paginationObj: {
      type: Object,
      default: () => {},
    },
    funModules: {
      type: String,
      default: "lightGrouping",
    },
  },
  data() {
    let _this = this;
    return {
      loading: false,
      pagination: {
        pageNo: 1,
        pageSize: 10, // 默认每页显示数量
        showTotal: (total) => `共 ${total} 条`, // 显示总数
        onChange: (page, pageSize) => _this.changePage(page, pageSize), //点击页码事件
        total: 0, //总条数
      },
    };
  },
  components: {
    aTooltip: Tooltip,
  },
  created() {
    this.pagination.total = this.paginationObj.total;
    this.pagination.pageNo = this.paginationObj.currentPage;
  },
  watch: {
    "paginationObj.total": function (val) {
      this.pagination.total = val;
    },
    "paginationObj.currentPage": function (val) {
      this.pagination.pageNo = val;
    },
  },

  methods: {
    // 分组获取当前列表行ID
    lightGroupingEdit(id, resourceName) {
      this.$emit("lightGroupingEdit", id, resourceName);
    },
    // 分组给分组添加灯
    lightGroupingAddLight(id) {
      this.$emit("groupAddLight", id);
    },
    // 分页切换
    changePage(page) {
      this.$emit("changePage", page);
    },

    selectedRows(selectedRows) {
      this.$emit("selectRows", selectedRows);
    },
    // 选择列表信息
    onSelectRow(record, selected, selectedRows) {
      this.selectedRows(selectedRows);
    },
    // 选择全部
    onSelectAllRow(selected, selectedRows) {
      this.selectedRows(selectedRows);
    },
    lightAddTask(record) {
      this.$router.push({
        path: "/ctrl/light-add-task",
        query: { title: "编辑任务", record: JSON.stringify(record) },
      });
    },
    // 任务修改状态
    changeTaskStatus(record) {
      let planStateCode = record.statusCode == 1 ? 0 : 1;
      let id = record.id;
      this.$emit("changeState", { id, planStateCode });
    },
    // 查看任务关联信息
    taskInfo(id) {
      this.$emit("checkTaskInfo", id);
    },
    // 信息发布媒体库下载
    displayMediaDownload(id) {
      this.$emit("mediaDownload", id);
    },
    // 信息发布节目库预览
    displayMediaPreview(mediaList) {
      this.$emit("programPreview", this.funModules, mediaList);
    },
    async setOnOffGroupLights(record) {
      console.log(record, "setOnOffGroupLights, record");

      let { children, onOff } = record;
      if (!children.length) {
        this.$message.warning("分组中没有灯！");
        return;
      }
      let deviceIds = [];
      children.forEach((light) => deviceIds.push(light.equipmentCode));
      onOff = +onOff || 0;
      try {
        let res = await new Api().setOnOff({
          deviceIds,
          onOff,
        });
        if (res.code !== "200") {
          this.$message.error(res.msg);
        } else {
          this.$message.success(res.msg);
        }
      } catch (err) {
        this.$message.error(err.toString());
      }
    },
  },
  filters: {
    filterStatus(value) {
      if (_.isEmpty(value)) {
        return value == 1 ? "有效" : "无效";
      }
    },
    filterType(value) {
      if (_.isEmpty(value)) {
        return value == 2 ? "图片" : value == 3 ? "视频" : "文本";
      }
    },
    filterReviewStatus(value) {
      if (_.isEmpty(value)) {
        return value == 1 ? "已审核" : "待审核";
      }
    },
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
.ant-table-row-expand-icon {
  border-radius: 50%;
  border-color: #6af9fe;
  background: #6af9fe;
  color: #051e63;
  font-weight: 900;
}
td div {
  display: inline-block;
}
.editable-row-operations a {
  margin-right: 10px;
}
</style>
