<template>
  <div>
    <a-row>
      <a-col :span="24">
        <Breadcrumb />
      </a-col>
      <a-col :span="24">
        <a-row>
          <a-col :span="6">
            <a-input-search
              placeholder="请输入设备名称"
              v-model="queryObj.equipmentName"
              @search="search"
            >
              <a-button
                type="primary"
                style="border-color: rgba(255,255,255,0.5);"
                slot="enterButton"
              >
                <a-icon type="search" />搜索
              </a-button>
            </a-input-search>
          </a-col>
        </a-row>
      </a-col>
      <a-col
        :span="24"
        style="marginTop:30px"
      >
        <div class="table">
          <a-tabs
            class="Application_tabs"
            :activeKey="tabKey"
            @change="changeTabs"
          >
            <a-tab-pane
              tab="智慧照明"
              key="1"
            >
              <DeviceList
                @selectedRow="selectedRow"
                :enableCheckbox="true"
              ></DeviceList>
            </a-tab-pane>
            <a-tab-pane
              tab="安防监控"
              key="2"
            >
              <DeviceList
                type="camera"
                @selectedRow="selectedCamera"
                :enableCheckbox="true"
              ></DeviceList>
            </a-tab-pane>
            <a-tab-pane
              tab="LED大屏"
              key="3"
            >
              <DeviceList
                type="display"
                @selectedRow="selectedDisplay"
                :enableCheckbox="true"
              ></DeviceList>
            </a-tab-pane>
            <a-tab-pane
              tab="环境传感器"
              key="4"
            >
              <DeviceList
                type="environment"
                @selectedRow="selectedEnv"
                :enableCheckbox="true"
              ></DeviceList>
            </a-tab-pane>
            <a-tab-pane
              tab="雷达"
              key="5"
            >
              <DeviceList
                type="radar"
                @selectedRow="selectedRadar"
                :enableCheckbox="true"
              ></DeviceList>
            </a-tab-pane>
            <a-tab-pane
              tab="智慧停车"
              key="6"
            >
              <DeviceList
                type="etc"
                @selectedRow="selectedEtc"
                :enableCheckbox="true"
              ></DeviceList>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
      <AddDevice
        :visible="visible"
        :showModel="showModel"
      />
    </a-row>
    <div class="ctrl-light">
      <a-row
        :gutter="16"
        :class="['bottom-sidebar',{high: showMoreLight}]"
      >
        <a-col :span="bottomSpan.left">
        </a-col>
        <a-col
          v-if="bottomSpan.left < 24 && tabKey === '1'"
          :span="bottomSpan.right"
          style="position: relative;"
        >
          <DeviceEdit
            :model="curDevice"
            :edit="isDetailEdit"
            :showMoreLight="showMoreLight"
          ></DeviceEdit>
        </a-col>
        <a-col
          v-if="bottomSpan.left < 24 && tabKey === '2' || tabKey === '6'"
          :span="bottomSpan.right"
          style="position: relative;"
        >
          <DeviceEdit
            :model="curCamera"
            :edit="isDetailEdit"
            type="camera"
            :showMoreLight="showMoreLight"
          ></DeviceEdit>
        </a-col>
        <a-col
          v-if="bottomSpan.left < 24 && tabKey === '3'"
          :span="bottomSpan.right"
          style="position: relative;"
        >
          <DeviceEdit
            :model="curScreen"
            :edit="isDetailEdit"
            type="display"
            :showMoreLight="showMoreLight"
          ></DeviceEdit>
        </a-col>
        <a-col
          v-if="bottomSpan.left < 24 && tabKey === '4'"
          :span="bottomSpan.right"
          style="position: relative;"
        >
          <DeviceEdit
            :model="curEnvironment"
            :edit="isDetailEdit"
            type="environment"
            :showMoreLight="showMoreLight"
          ></DeviceEdit>
        </a-col>
        <a-col
          v-if="bottomSpan.left < 24 && tabKey === '5'"
          :span="bottomSpan.right"
          style="position: relative;"
        >
          <DeviceEdit
            :model="curRadar"
            :edit="isDetailEdit"
            type="radar"
            :showMoreLight="showMoreLight"
          ></DeviceEdit>
        </a-col>
      </a-row>

    </div>
  </div>
</template>

<script>
import _ from "lodash";
import utils from "@/utils";
import MapMixin from "@/mixins/map.js";
import baseMixin from "@/mixins/base.js";
import { mapMutations } from "vuex";
import DeviceList from "@/components/common/DeviceList.vue";
import DeviceEdit from "@/components/common/DeviceEdit.vue";
import AddDevice from "@/components/common/AddDevice.vue";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
import mapApi from "@/libs/MapApi.js";
// import _api from "@/api/Environment";
import Report from "@/api/Report";
// let Api = new _api();
let apiReport = new Report();
import CONFIG_LIST from "@/config";
const { NETkState, EStatus } = CONFIG_LIST;
const Ecolumns = [
  {
    title: "序号",
    dataIndex: "id",
  },
  {
    title: "资源名称",
    dataIndex: "equipmentName",
  },
  {
    title: "联网状态",
    dataIndex: "networkState",
  },
  {
    title: "设备状态",
    dataIndex: "equipmentStatus",
  },
  {
    title: "安装位置",
    dataIndex: "location",
  },
];
const typeArr = [
  "pm25",
  "PM10",
  "noise",
  "temperature",
  "humidity",
  "windDirection",
  "windSpeed",
  "pressure",
  "rainfall",
  "radiation",
  "ultraviolet",
];
export default {
  mixins: [baseMixin, MapMixin],
  components: {
    DeviceList,
    DeviceEdit,
    AddDevice,
    Breadcrumb,
  },
  data() {
    return {
      allDeviceInfo: {},
      queryObj: {},
      columns: [],
      showRight: false,
      EdataList: [],
      curEnvironment: [],
      Ecolumns,
      allLight: [], //照明--概览列表数据
      pageLight: [], //照明详情每页
      showMoreLight: false,
      curDevice: {},
      curCamera: {},
      curScreen: {},
      curRadar: {},
      isRadarEdit: false,
      isCamareEdit: false,
      showCamare: false,
      isScreenEdit: false,
      isScreenInfo: false,
      tabKey: "1",
      programInfo: [],
      bottomSpan: {
        left: 24,
        right: 10,
      },
      visible: false,
    };
  },
  created() {
    let routeData = this.$route;
    let currentMenuId = routeData.meta.id || "";
    let currentMenuParentId = routeData.meta.parentId || "";
    this.setCurrentMenu(currentMenuId);
    this.setCurrentParentMenu(currentMenuParentId);

    // this.loadList("environmentList", "EdataList", "");
    this.loadList("geAallDevice", "programInfo", "");
    // this.$bus.on("selectedRow", (item, isEdit) => {});
    this.$bus.off("selectedCamareRow").on("selectedCamareRow", (item) => {
      // console.log(item);
      // item.networkState = utils.getNetworkStateText(item.networkState);
      this.curCamera = item;
      this.setData(item);
    });
    this.$bus.off("selectedScreenRow").on("selectedScreenRow", (item) => {
      item.networkState = utils.getNetworkStateText(item.networkState);
      this.curScreen = item;
      this.isScreenEdit = false;
      this.setData(item);
    });
    this.$bus.off("cameraEdit").on("cameraEdit", (item) => {
      this.isCamareEdit = true;
      this.setData(item);
    });
    this.$bus.off("deviceScreenEdit").on("deviceScreenEdit", (item) => {
      this.curScreen = item;
      this.isScreenEdit = true;
      this.setData(item);
    });
  },
  methods: {
    ...mapMutations(["setCurrentMenu", "setCurrentParentMenu"]),

    cusRow(record) {
      let tmp = [];
      return {
        on: {
          click: () => {
            for (let item in record) {
              if (typeArr.indexOf(item) >= 0) {
                tmp.push({
                  name: item,
                  id: Math.random(),
                  value: `${record[item]}`,
                });
              }
            }
            this.showRight = true;
            this.curEnvironment = tmp;
            this.bottomSpan.left = 14;
          },
        },
      };
    },
    //获取数据
    async loadList(type, data, val) {
      // let api = type === "environmentList" ? Api : apiReport;
      let api = apiReport;
      let opt = Object.assign(
        {
          projectId: this.projectId,
        },
        val
      );
      let res = await api[type](opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      let _list = res.data.list || res.data;
      if (type === "environmentList") {
        _list &&
          _list.map((item) => {
            item["networkState"] = NETkState[item["networkState"]];
            item["equipmentStatus"] = EStatus[item["equipmentStatus"]];
          });
      }
      this[data] = _list;
    },
    setData(data) {
      if (_.isEmpty(data)) {
        this.bottomSpan.left = 24;
      } else {
        this.bottomSpan.left = 14;
      }
    },
    // tabs页签切换
    changeTabs(key) {
      this.tabKey = key;
      this.curDevice = {};
      this.curCamera = {};
      this.curScreen = {};
      this.curRadar = {};
      this.queryObj.equipmentName = "";
      this.bottomSpan.left = 24;
      if (key !== "4") {
        this.showRight = false;
      }
      mapApi.hideHeatMap(key !== "5" ? "hide" : "show");
    },
    selectedRow(item, isEdit) {
      this.isDetailEdit = isEdit || false;
      this.curDevice = item;
      this.setData(item);
    },
    selectedCamera(item, isEdit) {
      this.isDetailEdit = isEdit || false;
      this.curCamera = item;
      this.setData(item);
    },
    selectedDisplay(item, isEdit) {
      this.isDetailEdit = isEdit || false;
      this.curScreen = item;
      this.setData(item);
    },
    selectedEnv(item, isEdit) {
      this.isDetailEdit = isEdit || false;
      this.curEnvironment = item;
      this.setData(item);
    },
    selectedRadar(item, isEdit) {
      this.isDetailEdit = isEdit || false;
      this.curRadar = item;
      this.setData(item);
    },
    selectedEtc(item, isEdit) {
      this.isDetailEdit = isEdit || false;
      this.curCamera = item;
      this.setData(item);
    },
    search() {
      this.queryObj.projectId = this.projectId;
      this.$bus.emit("changeQueryObj", this.queryObj, this.tabKey);
    },
    batchDelete() {
      this.$bus.emit("batchDelete", this.tabKey);
    },
    changeEquipmentStatus() {},
    showModel() {
      this.visible = !this.visible;
    },
    changeCamareEdit() {
      this.isCamareEdit = !this.isCamareEdit;
      if (!this.isCamareEdit) {
        this.bottomSpan.left = 24;
      }
    },
    changeScreenEdit(isScreenInfo) {
      this.isScreenInfo = isScreenInfo;
      this.isScreenEdit = !this.isScreenEdit;
      if (!this.isScreenEdit) {
        this.bottomSpan.left = 24;
      }
    },
  },
};
</script>