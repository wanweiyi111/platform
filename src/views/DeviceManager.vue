<template>
  <div class="ctrl-light">
    <SummarySidebar class="right-sidebar" :allDeviceInfo="allDeviceInfo"></SummarySidebar>
    <a-row :gutter="16" :class="['bottom-sidebar',{high: showMoreLight}]">
      <a-col :span="bottomSpan.left">
        <CtrlPanel :hide-title="true">
          <dd slot="content" class="pd-x10">
            <a-tabs :tabBarGutter="2" @change="changeTabs">
              <a-tab-pane tab="智慧照明" key="1">
                <DeviceList @selectedRow="selectedRow" :enableCheckbox="true"></DeviceList>
              </a-tab-pane>
              <a-tab-pane tab="安防监控" key="2">
                <DeviceList type="camera" @selectedRow="selectedCamera" :enableCheckbox="true"></DeviceList>
              </a-tab-pane>
              <a-tab-pane tab="LED大屏" key="3">
                <DeviceList type="display" @selectedRow="selectedDisplay" :enableCheckbox="true"></DeviceList>
              </a-tab-pane>
              <a-tab-pane tab="环境传感器" key="4">
                <DeviceList type="environment" @selectedRow="selectedEnv" :enableCheckbox="true"></DeviceList>
              </a-tab-pane>
              <a-tab-pane tab="雷达" key="5">
                <DeviceList type="radar" @selectedRow="selectedRadar" :enableCheckbox="true"></DeviceList>
              </a-tab-pane>
              <a-tab-pane tab="智慧停车" key="6">
                <DeviceList type="etc" @selectedRow="selectedEtc" :enableCheckbox="true"></DeviceList>
              </a-tab-pane>
              <div slot="tabBarExtraContent" class="pd-t5">
                <a href="javascript:;" class="mr15 white2" @click="showMoreLight = !showMoreLight">
                  <a-icon v-if="!showMoreLight" type="arrow-up" />
                  <a-icon v-else type="arrow-down" />
                </a>
                <a-input-search
                  v-model="queryObj.equipmentName"
                  @search="search"
                  placeholder="搜索设备名称"
                  class="mr5"
                  style="width: 130px;bottom:2px;"
                  size="small"
                />
                <!-- <a-button icon="delete" size="small" @click="batchDelete">删除</a-button> -->
              </div>
            </a-tabs>
          </dd>
        </CtrlPanel>
      </a-col>
      <a-col
        v-if="bottomSpan.left < 24 && tabKey === '1'"
        :span="bottomSpan.right"
        style="position: relative;"
      >
        <DeviceEdit :model="curDevice" :edit="isDetailEdit" :showMoreLight="showMoreLight"></DeviceEdit>
      </a-col>
      <a-col
        v-if="bottomSpan.left < 24 && tabKey === '2' || tabKey === '6'"
        :span="bottomSpan.right"
        style="position: relative;"
      >
        <!-- <CamareEdit
          :curCamera="curCamera"
          :isCamareEdit="isCamareEdit"
          :changeCamareEdit="changeCamareEdit"
        ></CamareEdit>-->
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
        <!-- <ScreenEdit
          ref="ScreenEdit"
          :curScreen="curScreen"
          :isScreenEdit="isScreenEdit"
          @changeScreenEdit="changeScreenEdit"
        ></ScreenEdit>-->
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
        <!-- <EnvironmentEdit
          :curLight="curEnvironment"
          :bottomSpan="{rigtht:24}"
          :showRight="showRight"
        />-->
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

    <AddDevice :visible="visible" :showModel="showModel" />
  </div>
</template>

<script>
import _ from "lodash";
import utils from "@/utils";
import MapMixin from "@/mixins/map.js";
import baseMixin from "@/mixins/base.js";
import CtrlPanel from "@/components/CtrlPanel.vue";
import SummarySidebar from "@/components/common/SummarySidebar.vue";
import DeviceList from "@/components/common/DeviceList.vue";
import DeviceEdit from "@/components/common/DeviceEdit.vue";
import AddDevice from "@/components/common/AddDevice.vue";
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
    dataIndex: "id"
  },
  {
    title: "资源名称",
    dataIndex: "equipmentName"
  },
  {
    title: "联网状态",
    dataIndex: "networkState"
  },
  {
    title: "设备状态",
    dataIndex: "equipmentStatus"
  },
  {
    title: "安装位置",
    dataIndex: "location"
  }
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
  "ultraviolet"
];
export default {
  mixins: [baseMixin, MapMixin],
  components: {
    CtrlPanel,
    SummarySidebar,
    DeviceList,
    DeviceEdit,
    AddDevice
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
        right: 10
      },
      visible: false
    };
  },
  created() {
    // this.loadList("environmentList", "EdataList", "");
    this.loadList("geAallDevice", "programInfo", "");
    // this.$bus.on("selectedRow", (item, isEdit) => {});
    this.$bus.off("selectedCamareRow").on("selectedCamareRow", item => {
      // console.log(item);
      // item.networkState = utils.getNetworkStateText(item.networkState);
      this.curCamera = item;
      this.setData(item);
    });
    this.$bus.off("selectedScreenRow").on("selectedScreenRow", item => {
      item.networkState = utils.getNetworkStateText(item.networkState);
      this.curScreen = item;
      this.isScreenEdit = false;
      this.setData(item);
    });
    this.$bus.off("cameraEdit").on("cameraEdit", item => {
      this.isCamareEdit = true;
      this.setData(item);
    });
    this.$bus.off("deviceScreenEdit").on("deviceScreenEdit", item => {
      this.curScreen = item;
      this.isScreenEdit = true;
      this.setData(item);
    });
  },
  methods: {
    cusRow(record, index) {
      let tmp = [];
      return {
        on: {
          click: () => {
            for (let item in record) {
              if (typeArr.indexOf(item) >= 0) {
                tmp.push({
                  name: item,
                  id: Math.random(),
                  value: `${record[item]}`
                });
              }
            }
            this.showRight = true;
            this.curEnvironment = tmp;
            this.bottomSpan.left = 14;
          }
        }
      };
    },
    //获取数据
    async loadList(type, data, val) {
      // let api = type === "environmentList" ? Api : apiReport;
      let api = apiReport;
      let opt = Object.assign(
        {
          projectId: this.projectId
        },
        val
      );
      let res = await api[type](opt).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      let _list = res.data.list || res.data;
      if (type === "environmentList") {
        _list &&
          _list.map((item, index) => {
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
    }
  }
};
</script>