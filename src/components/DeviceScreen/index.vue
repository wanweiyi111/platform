<template>
  <!-- 设备管理--LED大屏 -->
  <div class="DeviceManager">
    <a-table
      :columns="columns"
      :dataSource="bigScreenList"
      :customRow="cusRow"
      :rowClassName="getRowClass"
      :rowSelection="{onSelect: onSelectRow,onSelectAll: onSelectAllRow}"
      :rowKey="record => record.id"
    >
      <template
        slot="operation"
        slot-scope="text,record"
      >
        <div class="ctrGroup">
          <a-tooltip
            placement="top"
            title="查看详情"
          >
            <a
              href="javascript:;"
              @click="() => screenCheckInfo(record)"
            >
              <i class="iconfont iconeye"></i>
            </a>
          </a-tooltip>
          <a-tooltip
            placement="top"
            title="定位"
          >
            <a
              href="javascript:;"
              @click="() => screenLocation(record)"
            >
              <i class="iconfont iconmap-marker-alt"></i>
            </a>
          </a-tooltip>
          <a-tooltip
            placement="top"
            title="编辑"
          >
            <a
              href="javascript:;"
              @click="screenEdit(record)"
            >
              <i class="iconfont iconcog"></i>
            </a>
          </a-tooltip>
        </div>
      </template>
    </a-table>
    <AddDevice />
  </div>
</template>

<script>
import _ from "lodash";
import utils from "@/utils";
import AddDevice from "@/components/common/AddDevice.vue";
import Display from "@/api/Display.js";
import baseMixin from "@/mixins/base.js";
import MapMixin from "@/mixins/map.js";

import { Tooltip } from "ant-design-vue";

let api = new Display();

const columns = [
  {
    title: "序号",
    dataIndex: "id",
  },
  {
    title: "资源名称",
    dataIndex: "equipmentName",
  },
  {
    title: "IP地址",
    dataIndex: "equipmentIp",
  },
  {
    title: "归属智慧杆",
    dataIndex: "poleCode",
  },
  {
    title: "设备状态",
    dataIndex: "equipmentStatus",
  },
  {
    title: "联网状态",
    dataIndex: "network",
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  mixins: [baseMixin, MapMixin],
  components: {
    AddDevice,
    aTooltip: Tooltip,
  },

  data() {
    return {
      columns,
      bigScreenList: [],
      selectedRowIndex: -1,
      groupList: "",
    };
  },
  created() {
    this.loadList("deviceFindByProjectIdPaged", this.queryObj, "bigScreenList");
    // 过滤搜索
    this.$bus.on("searchKey", (searchKey, tabKey) => {
      if (tabKey !== "3") {
        return;
      }
      this.loadList(
        "deviceFindByProjectIdPaged",
        { projectId: this.projectId, equipmentName: searchKey },
        "bigScreenList"
      );
    });
    // 删除
    this.$bus.on("batchDelete", (tabKey) => {
      if (tabKey !== "3") {
        return;
      }

      if (!this.groupList) {
        this.$message.warning("请选择要删除的信息！");
        return;
      }
      this.loadList("deleteScreenInfo", { id: this.groupList });
    });
  },
  methods: {
    // 单选
    onSelectRow(record, selected, selectedRows) {
      let tmp = selectedRows && selectedRows.map((item) => item.id);
      this.groupList = tmp.join();
    },
    // 全选
    onSelectAllRow(selected, selectedRows, changeRows) {
      let tmp = selectedRows && selectedRows.map((item) => item.id);
      this.groupList = tmp.join();
    },
    async loadList(type, opt, val) {
      let res = await api[type](opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      } else {
        if (val) {
          this[val] = res.data.list.map((item) => {
            item.network = utils.getNetworkStateText(item.networkState);
            item.equipmentStatus = utils.getEquipmentStatusText(
              item.equipmentStatus
            );
            return item;
          });
        } else {
          this.$message.success("删除成功");
          this.loadList(
            "deviceFindByProjectIdPaged",
            { projectId: this.projectId },
            "bigScreenList"
          );
        }
      }
    },
    cusRow(record, index) {
      return {
        on: {
          click: () => {
            this.selectedRowIndex = index;
          },
        },
      };
    },
    getRowClass(record, index) {
      return index === this.selectedRowIndex ? "selected-row" : "";
    },
    // 编辑
    screenEdit(record) {
      this.$bus.emit("deviceScreenEdit", record);
      this.$bus.emit("setFormScreen", record);
    },
    // 查看详情
    screenCheckInfo(record) {
      this.$bus.emit("selectedScreenRow", record);
    },
    // 定位
    screenLocation(record) {
      this.setCenter(record);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.DeviceManager {
  height: 300px;
  //overwrite ant style
  .bottom-sidebar.high {
    height: 623px;
  }
  .deviceSearch {
    width: 130px;
    padding: 6px;
  }
  .ctrGroup {
    a {
      color: #fff;
      margin-right: 10px;
    }
    a:hover {
      color: #c81623;
    }
    i {
      cursor: pointer;
    }
  }
  .ctrDevice {
    display: inline-block;
    padding: 6px 10px;
    border-radius: 15.5px;
    margin-left: 20px;
    vertical-align: middle;
    cursor: pointer;
    &.addDevice {
      background-image: linear-gradient(61deg, #6dfdfd 15%, #3bbdfb 100%);
    }
    &.delDevice {
      opacity: 0.5;
      border: 1px solid #97e9ff;
    }
  }
  .selected-row {
    background: rgba(138, 199, 247, 0.1);
  }
}
</style>
