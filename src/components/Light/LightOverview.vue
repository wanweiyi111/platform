<template>
  <Overview
    :columns="columns"
    :data-list="pageDevice"
    :edit="edit"
    @selectedRow="selectedRow"
    @change="changePage"
    :pagination="pageInfo"
  />
</template>

<script>
import _ from "lodash";
import utils from "@/utils/";
import MapMixin from "@/mixins/map.js";
import baseMixin from "@/mixins/base.js";
import Api from "@/api";
// import CtrlPanel from "@/components/CtrlPanel.vue";
import Overview from "@/components/common/Overview.vue";

const api = new Api();

const columns = [
  {
    title: "序号",
    dataIndex: "id"
  },
  {
    title: "资源名称",
    dataIndex: "equipmentName"
  },
  {
    title: "联网状态",
    dataIndex: "networkStateText"
  },
  {
    title: "设备状态",
    dataIndex: "equipmentStatusText"
  },
  {
    title: "亮度",
    dataIndex: "brightness"
  },
  {
    title: "安装位置",
    dataIndex: "location"
  }
];

export default {
  name: "LightOverview",
  mixins: [baseMixin, MapMixin],
  props: {
    edit: {
      type: Boolean,
      default: false
    }
    // showMore: {
    //   type: Boolean,
    //   default: true
    // }
  },
  components: {
    Overview
  },
  data() {
    return {
      columns,
      allDevice: [], //照明--概览列表数据
      pageDevice: [], //照明详情每页
      pageInfo: { pageSize: 14 },
      queryObj: { pageNum: 1, pageSize: 14 }
    };
  },
  mounted() {},
  created() {
    let _this = this;

    this.loadallDevice();
    this.loadPageDevice();

    this.$bus.on("searchKey", this.searchKey);
    this.$bus.on("batchDelete", tabKey => {
      if (tabKey !== "1") {
        return;
      }
    });
    this.$bus.on("changeEquipmentStatus", val => {
      if (!val) {
        delete _this.queryObj.equipmentStatus;
      } else {
        _this.queryObj.equipmentStatus = val;
      }
      _this.loadPageDevice();
    });
  },
  beforeDestroy() {
    this.$bus.off("searchKey", this.searchKey);
  },
  methods: {
    // 获取照明概览列表数据
    async loadallDevice() {
      let res = await api.findByProjectId(this.queryObj).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.allDevice = res.data.map(item => {
        item.installationTime = utils.toTime(item.installationTime);
        item.productionDate = utils.toTime(item.productionDate);
        item.offlineTime = utils.toTime(item.offlineTime);
        item.onlineTime = utils.toTime(item.onlineTime);
        return item;
      });
      this.setMapMarks(this.allDevice, 'light');
    },
    async loadPageDevice() {
      let res = await api.findByProjectIdPaged(this.queryObj).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.pageInfo = {
        current: res.data.pageNum,
        total: res.data.total,
        pageSize: res.data.pageSize
      };
      this.pageDevice = res.data.list.map(item => {
        item.networkStateText = utils.getNetworkStateText(item.networkState);
        item.equipmentStatusText = utils.getEquipmentStatusText(
          item.equipmentStatus
        );
        return item;
      });
    },
    changePage(pagination) {
      this.pageInfo = pagination;
      this.queryObj = Object.assign(this.queryObj, this.pageInfo);
      this.queryObj.pageNum = this.pageInfo.current;
      this.loadPageDevice();
    },
    async selectedRow(item) {
      // debugger;
      let params = Object.assign({}, this.queryObj, { id: item.id });
      let res = await api.findByInfoAndRun(params).catch(err => {
        console.log(err);
      });
      if (res.code !== "200") {
        this.curDevice = {};
        return;
      }
      this.$emit("selectedRow", res.data);
    },
    searchKey(searchKey, tabKey) {
      if (tabKey !== "1") {
        return;
      }
      this.queryObj.equipmentName = searchKey;
      this.loadPageDevice();
    }
  }
};
</script>