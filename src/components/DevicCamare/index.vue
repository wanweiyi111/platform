<template>
  <div class="DeviceManager">
    <a-table
      :columns="columns"
      :dataSource="camareList"
      :rowSelection="{onSelect: onSelectRow,onSelectAll: onSelectAllRow,onChange:onChange}"
      :rowKey="record => record.id"
      :customRow="cusRow"
    >
      <template
        slot="DelData"
        slot-scope="item"
      >
        <div class="ctrGroup">
          <a-popconfirm
            title="Are you sure delete this task?"
            @confirm="confirm((item.id))"
            okText="确定删除"
            cancelText="再想想"
          >
            <i class="iconfont icontimes"></i>
          </a-popconfirm>
          <i
            class="iconfont iconcog"
            @click="edit(item)"
          ></i>
        </div>
      </template>
    </a-table>
    <AddDevice />
  </div>
</template>

<script>
import _ from "lodash";
import utils from "@/utils";
import baseMixin from "@/mixins/base.js";
import AddDevice from "@/components/common/AddDevice.vue";
import Camera from "@/api/Camera.js";
import { Popconfirm } from "ant-design-vue";

let api = new Camera();

const columns = [
  {
    title: "序号",
    dataIndex: "id",
    width: "15%",
    key: "id",
  },
  {
    title: "资源名称",
    dataIndex: "equipmentName",
    key: "equipmentName",
    width: "15%",
  },
  {
    title: "安装位置",
    dataIndex: "location",
    width: "20%",
    key: "location",
  },
  {
    title: "IP地址",
    dataIndex: "equipmentIp",
    width: "15%",
    key: "equipmentIp",
  },
  {
    title: "归属智慧杆",
    dataIndex: "poleCode",
    width: "15%",
    key: "poleCode",
  },
  {
    title: "联网状态",
    dataIndex: "networkState",
    width: "10%",
    key: "networkState",
  },
  {
    title: "操作",
    width: "10%",
    key: "DelData",
    scopedSlots: { customRender: "DelData" },
  },
];
const deviceList = ["AP", "摄像头", "大屏", "照明", "环境传感器"];
export default {
  mixins: [baseMixin],
  components: {
    AddDevice,
    aPopconfirm: Popconfirm,
  },
  props: {
    model: Object,
  },
  data() {
    return {
      columns,
      deviceList,
      camareList: [],
      isEdit: false,
    };
  },
  created() {
    this.loadList(
      "findByProjectIdPaged",
      { projectId: this.projectId },
      "camareList"
    );
    this.$bus.off("batchDelete").on("batchDelete", (tabKey) => {
      this.loadList("delCamare", this.groupList);
      if (tabKey !== "2") {
        return;
      }
    });
  },
  methods: {
    cusRow(record, index) {
      return {
        on: {
          click: () => {
            this.$bus.$emit("selectedCamareRow", record);
          },
        },
      };
    },
    onChange(selectedRowKeys, selectedRows) {
      let tmp = [];
      selectedRows &&
        selectedRows.map((item) => {
          tmp.push({ ids: item.id });
        });
      this.groupList = tmp;
    },
    onSelectRow(record, selected, selectedRows) {},
    onSelectAllRow(selected, selectedRows, changeRows) {
      console.log(selected, selectedRows, changeRows, "++++++++");
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
            console.log(this[val], val, "------");
            item.networkState = utils.getNetworkStateText(item.networkState);
            return item;
          });
        } else {
          this.$message.success("删除成功");
        }
      }
    },
    confirm(id) {
      this.loadList("delCamare", [{ ids: id }]);
      this.$message.success("删除成功");
      this.loadList(
        "findByProjectIdPaged",
        { projectId: this.projectId },
        "camareList"
      );
    },
    edit(item) {
      this.$bus.$emit("cameraEdit", item);
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
    i {
      margin-left: 15px;
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
}
</style>
