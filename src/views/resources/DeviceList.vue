<template>
  <div class="DeviceList">
    <Breadcrumb />
    <CtrlPanel
      :split-line="true"
      class="bottom-sidebar high"
    >
      <template v-slot:title>
        <span class="f16">设备清单</span>
        <div
          slot="tabBarExtraContent"
          class="pd-t5"
        >
          <span class="title">智慧杆规格</span>
          <a-select
            defaultValue="0"
            size="small"
            class="mr15"
            @change="lightSpecifications"
            style="width:100px"
          >
            <a-select-option
              v-for="(item, index) in ModelList"
              :value="item.equipmentModel"
              v-bind:key="index"
            >{{ item.equipmentModel }}</a-select-option>
          </a-select>
          <a-input-search
            @keydown.enter="loadPageDevice"
            @change="inputChange"
            placeholder="请输入关键词"
            style="width: 234px;bottom:2px"
            size="small"
          />
          <!-- <span class="export">
            <i class="iconfont iconfile-export"></i>导出
          </span>-->
        </div>
      </template>
      <template v-slot:content>
        <div class="content">
          <a-table
            :columns="columns"
            :dataSource="deviceList"
            :rowKey="record => record.id"
            @change="handleTableChange"
            :pagination="pagination"
            :scroll="{ x: 1400, y: 470 }"
          ></a-table>
        </div>
      </template>
    </CtrlPanel>
  </div>
</template>

<script>
import CtrlPanel from "@/components/CtrlPanel.vue";
import baseMixin from "@/mixins/base.js";
import utils from "@/utils/";
import _api from "@/api";
import { mapMutations } from "vuex";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";

let api = new _api();

const columns = [
  {
    title: "序号",
    dataIndex: "id",
    key: "id",
    width: "5%",
  },
  {
    title: "资源名称",
    dataIndex: "equipmentName",
    key: "equipmentName",
    width: "5%",
  },
  {
    title: "设备类型",
    dataIndex: "equipmentType",
    key: "equipmentType",
    width: "5%",
  },
  {
    title: "设备厂商",
    dataIndex: "manufacturerName",
    key: "manufacturerName",
    width: "5%",
  },
  {
    title: "设备MAC",
    dataIndex: "equipmentMac",
    key: "equipmentMac",
    width: "5%",
  },
  {
    title: "归属智慧杆",
    dataIndex: "poleName",
    key: "poleName",
    width: "5%",
  },
  {
    title: "安装位置",
    dataIndex: "location",
    key: "location",
    width: "5%",
  },
  {
    title: "所属分组",
    dataIndex: "groupName",
    key: "groupName",
    width: "5%",
  },
  {
    title: "经度",
    dataIndex: "longitude",
    key: "longitude",
    width: "5%",
  },
  {
    title: "纬度",
    dataIndex: "latitude",
    key: "latitude",
    width: "5%",
  },
  {
    title: "安装时间",
    dataIndex: "installationTime",
    key: "installationTime",
    width: "5%",
  },
  {
    title: "入网时间",
    dataIndex: "onlineTime",
    key: "onlineTime",
    width: "5%",
  },
  {
    title: "联网状态",
    dataIndex: "networkStateText",
    key: "networkStateText",
    width: "5%",
  },
  {
    title: "设备状态",
    dataIndex: "equipmentStatusText",
    key: "equipmentStatusText",
    width: "5%",
  },
  {
    title: "规格",
    dataIndex: "equipmentModel",
    key: "equipmentModel",
    width: "5%",
  },
  {
    title: "WIFI",
    dataIndex: "wifiCount",
    key: "wifiCount",
    width: "5%",
  },
  {
    title: "摄像",
    dataIndex: "cameraCount",
    key: "cameraCount",
    width: "5%",
  },
  {
    title: "大屏",
    dataIndex: "screenCount",
    key: "screenCount",
    width: "5%",
  },
  {
    title: "路灯",
    dataIndex: "lightCount",
    key: "lightCount",
    width: "5%",
  },
];

export default {
  mixins: [baseMixin],
  components: {
    CtrlPanel,
    Breadcrumb,
  },
  data() {
    return {
      columns,
      equipmentModel: "",
      equipmentName: "",
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      deviceList: [],
      ModelList: [],
    };
  },
  created() {
    let routeData = this.$route;
    let currentMenuId = routeData.meta.id || "";
    let currentMenuParentId = routeData.meta.parentId || "";
    this.setCurrentMenu(currentMenuId);
    this.setCurrentParentMenu(currentMenuParentId);

    this.getPresetList("", "deviceList", "getDeviceList");
    this.getPresetList("", "ModelList", "getModelList");
  },
  methods: {
    ...mapMutations(["setCurrentMenu", "setCurrentParentMenu"]),

    inputChange(e) {
      this.equipmentName = e.target.value;
    },
    lightSpecifications(val) {
      this.getPresetList(
        { equipmentModel: val },
        "deviceList",
        "getDeviceList"
      );
    },
    loadPageDevice() {
      this.getPresetList(
        { equipmentName: this.equipmentName },
        "deviceList",
        "getDeviceList"
      );
    },
    async getPresetList(data, type, apiType) {
      let opt = data
        ? Object.assign(data, { projectId: this.projectId })
        : { projectId: this.projectId };
      let res = await api[apiType](opt);
      if (type === "deviceList") {
        this[type] = res.data.list;
        this[type] = res.data.list.map((item) => {
          item.installationTime = utils.toTime(item.installationTime);
          item.productionDate = utils.toTime(item.productionDate);
          item.onlineTime = utils.toTime(item.onlineTime);
          item.networkStateText = utils.getNetworkStateText(item.networkState);
          item.equipmentStatusText = utils.getEquipmentStatusText(
            item.equipmentStatus
          );
          return item;
        });
        this.pagination.total = res.data.pages * 10;
      } else {
        this[type] = res.data;
      }
      //   if (_.isEmpty(res) || res.code !== "200") {
      //     return;
      //   } else {
      //     this.deviceList = res.data.list;
      //   }
    },
    handleTableChange(pagination) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      let opt = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      };
      this.getPresetList(opt, "deviceList", "getDeviceList");
    },
  },
};
</script>
<style lang="less" scoped>
.ant-select-dropdown {
  z-index: 999;
}
.content {
  padding: 0 20px;
}
.f16 {
  display: inline-block;
  padding: 20px;
  color: #ddfdff;
}
.pd-t5 {
  position: absolute;
  right: 10px;
  top: 10px;
  .export {
    cursor: pointer;
    color: #97e9ff;
    padding: 5px 10px;
    margin-left: 10px;
    line-height: 1em;
    display: inline-block;
    border: 1px solid #97e9ff;
    border-radius: 15.5px;
    i {
      display: inline-block;
      margin: 0 5px;
    }
  }
}
.DeviceList {
  .bottom-sidebar.high {
    .content {
      // overflow-y: scroll;
    }
  }
}
</style>
