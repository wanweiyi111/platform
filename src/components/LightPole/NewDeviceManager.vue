<template>
  <div class="LightPoleDevicePlatform">
    <a-row>
      <a-col :span="sideBtn?1:4">
        <SideMenu
          :treeData="treeData"
          :fullheight="fullHeight"
          :projectId="Number(queryObj.id)"
          :states="sideBtn"
          @listenChildSearchValue="receivChilSearch"
          @listenChildSideId="receivChilSideId"
        />
      </a-col>
      <!-- <a-col :span="sideBtn?24:20"> -->
      <a-col :span="sideBtn?23:20">
        <div
          class="main"
          :style="{height:fullHeight-55+'px'}"
        >
          <div
            class="treeBtn"
            @click="stretchBtn"
          >
            <a-icon
              type="caret-left"
              :rotate="sideBtn ? 180 : 0"
            />
          </div>
          <div class="backHome">
            <div
              class="back fr"
              @click="goHome"
            >
              <img
                :src="BackIcoSvg"
                class="backIco"
              />返回首页
            </div>
          </div>
          <div class="LightPoleMain">
            <a-row>
              <a-col :span="6">
                <a-collapse
                  accordion
                  v-model="leftActiveKey"
                  expand-icon-position='right'
                  class="customCollapse"
                  v-if="equiDataOdd"
                >
                  <template #expandIcon="props">
                    <a-icon
                      type="double-left"
                      :rotate="props.isActive ? 90 : -90"
                    />
                  </template>
                  <a-collapse-panel
                    v-for="item in equiDataOdd"
                    :key="item.code"
                    :header="item.name"
                  >
                    <div
                      class="camareBox"
                      v-if="item.code == 4128"
                    >
                      <!-- 监控信息 -->
                      <NewPoleCamareInfo
                        :deviceInfo="camareInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleCamareInfo>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4112"
                    >
                      <!-- 路灯信息 -->
                      <NewPoleLightInfo
                        :deviceInfo="lightInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleLightInfo>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4144"
                    >
                      <!-- 大屏信息 -->
                      <NewPoleDisplayInfo
                        :deviceInfo="displayInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleDisplayInfo>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4176"
                    >
                      <!-- 环境监测信息 -->
                      <NewPoleEnvironmentalInfo
                        :deviceInfo="environmentalInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleEnvironmentalInfo>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4192"
                    >
                      <NewPoleRadarInfo
                        :deviceInfo="radarInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleRadarInfo>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4129"
                    >
                      <NewPoleWIFI
                        :deviceInfo="wifiInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleWIFI>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4208"
                    >
                      <NewPoleLock
                        :deviceInfo="lockInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleLock>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4240"
                    >
                      <NewPoleSOS
                        :deviceInfo="sosInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleSOS>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4272"
                    >
                      <NewPoleBroadcast
                        :deviceInfo="broadInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleBroadcast>
                    </div>
                  </a-collapse-panel>
                </a-collapse>
              </a-col>
              <a-col :span="12">
                <LightPole
                  :fullHeight="fullHeight"
                  :equiDataEven="equiDataEven"
                  :equiDataOdd="equiDataOdd"
                  :equiActionOdd="leftActiveKey"
                  :equiActionEven="rightActiveKey"
                  @listenChildLeftCode="receivChilLeft"
                  @listenChildRightCode="receivChilRight"
                />
              </a-col>
              <a-col :span="6">
                <a-collapse
                  accordion
                  v-model="rightActiveKey"
                  class="customCollapse"
                  expand-icon-position='right'
                  v-if="equiDataEven"
                >
                  <template #expandIcon="props">
                    <a-icon
                      type="double-left"
                      :rotate="props.isActive ? 90 : -90"
                    />
                  </template>
                  <a-collapse-panel
                    v-for="item in equiDataEven"
                    :key="item.code"
                    :header="item.name"
                  >
                    <div
                      class="camareBox"
                      v-if="item.code == 4128"
                    >
                      <!-- 监控信息 -->
                      <NewPoleCamareInfo
                        :deviceInfo="camareInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleCamareInfo>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4112"
                    >
                      <NewPoleLightInfo
                        :deviceInfo="lightInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleLightInfo>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4144"
                    >
                      <!-- 大屏信息 -->
                      <NewPoleDisplayInfo
                        :deviceInfo="displayInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleDisplayInfo>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4176"
                    >
                      <!-- 环境监测信息 -->
                      <NewPoleEnvironmentalInfo
                        :deviceInfo="environmentalInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleEnvironmentalInfo>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4192"
                    >
                      <NewPoleRadarInfo
                        :deviceInfo="radarInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleRadarInfo>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4129"
                    >
                      <NewPoleWIFI
                        :deviceInfo="wifiInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleWIFI>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4208"
                    >
                      <NewPoleLock
                        :deviceInfo="lockInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleLock>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4240"
                    >
                      <NewPoleSOS
                        :deviceInfo="sosInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleSOS>
                    </div>
                    <div
                      class="camareBox"
                      v-else-if="item.code == 4272"
                    >
                      <NewPoleBroadcast
                        :deviceInfo="broadInfo"
                        :from="from"
                        :isWarning="isWarning"
                        :warningMessage="warningMessageList"
                        :equipmentId="equipmentId"
                      ></NewPoleBroadcast>
                    </div>
                  </a-collapse-panel>
                </a-collapse>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <BasicInfo :infoData="poleInfoDO" />
              </a-col>
            </a-row>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import _ from "lodash";
import utils from "@/utils/";
import Pole from "@/api/Pole.js";
import SideMenu from "./NewSideMenu.vue";
import LightPole from "./NewLightPole.vue";
import BasicInfo from "./BasicInfo.vue";
import BackIcoSvg from "@/assets/new-lightplatform/icon-back.svg";
import NewPoleCamareInfo from "./NewPoleCamareInfo.vue";
import NewPoleEnvironmentalInfo from "./NewPoleEnvironmentalInfo.vue";
import NewPoleRadarInfo from "./NewPoleRadarInfo.vue";
import NewPoleLightInfo from "./NewPoleLightInfo.vue";
import NewPoleDisplayInfo from "./NewPoleDisplayInfo.vue";
import NewPoleWIFI from "./NewPoleWIFI.vue";
import NewPoleSOS from "./NewPoleSOS.vue";
import NewPoleLock from "./NewPoleLock.vue";
import NewPoleBroadcast from "./NewPoleBroadcast.vue";
import CONFIG_LIST from "@/config";
// import Api from "@/api";
// import Display from "@/api/Display";
import PowerManager from "@/api/PowerManager";
import baseMixin from "@/mixins/base.js";

const { DeviceType, WorkStatus } = CONFIG_LIST;

// const api = new Api();
const pole = new Pole();
// const display = new Display();
const power = new PowerManager();

export default {
  mixins: [baseMixin],
  components: {
    SideMenu,
    LightPole,
    BasicInfo,
    NewPoleEnvironmentalInfo,
    NewPoleRadarInfo,
    NewPoleLightInfo,
    NewPoleCamareInfo,
    NewPoleDisplayInfo,
    NewPoleBroadcast,
    NewPoleLock,
    NewPoleSOS,
    NewPoleWIFI,
  },
  data() {
    return {
      equiType: DeviceType,
      fullHeight:
        document.documentElement.clientHeight || document.body.clientHeight,
      activeKey: ["1"],
      visible: false,
      visibleWarning: false, //设备故障对话框
      utils,
      from: "",
      equipmentId: "",
      queryObj: {
        id: "",
      },
      equipmentTypeObj: {
        camareInfo: "4128",
        lightInfo: "4112",
        environmentalInfo: "4176",
        displayInfo: "4144",
        radarInfo: "4192",
        wifiInfo: "4129",
        lockInfo: "4208",
        sosInfo: "4240",
        broadInfo: "4272",
      },
      lightInfo: [], //智慧照明路灯信息数据
      camareInfo: [], //安防监控信息数据
      environmentalInfo: [], //环境监测信息数据
      displayInfo: [], //信息发布大屏信息数据
      radarInfo: [], //雷达信息数据
      wifiInfo: [], // WIFI信息
      sosInfo: [], // sos信息数据
      lockInfo: [], // 智能锁信息数据
      broadcastInfo: [], // 广播信息数据
      showOne: "lightInfo",
      poleInfoDO: {}, //智慧杆信息
      equipmentDOS: {}, //智慧杆设备基础数据
      warningMessageList: {}, //告警信息
      isWarning: false,
      equipmentNum: 0,
      currentDeviceAlarmMessage: [], //当前设备告警信息
      equiData: [], // 杆数据
      equiDataEven: [], //偶数杆数据
      equiDataOdd: [], //奇数杆数据
      BackIcoSvg,
      leftActiveKey: "", // 奇数默认打开
      rightActiveKey: "",
      lightValue: 0, // 智慧照明调节亮度
      WorkStatus: WorkStatus, //led屏状态
      projectList: [],
      paginationProject: {
        currentPage: 1, //当前页
        pageSize: 15, //每页显示条数
        total: 0, //总数
      },
      searchKey: "",
      currentEqui: [], // 当前用户下杆设备
      treeData: [], // 树状图数据
      sideBtn: false, // 侧栏操作按钮
    };
  },
  created() {
    this.get_bodyHeight();
    this.from = this.$route.query.from;
    this.queryObj.id = this.$route.query.id;
    this.equipmentId = this.$route.query.id + "";
    this.getPoleInfo(this.equipmentId);

    this.loadPowerProjectList();
  },

  watch: {
    activeKey(key) {
      console.log(key);
    },
  },
  mounted() {},
  methods: {
    // 伸缩按钮
    stretchBtn() {
      this.sideBtn = !this.sideBtn;
    },
    receivChilSideId(value) {
      let id = value;
      // 数据初始化
      this.equiDataEven = [];
      this.equiDataOdd = [];
      this.getPoleInfo(id);
      this.$router.push({
        path: "/ctrl/manager-device",
        query: { id: id },
      });
    },
    receivChilLeft(value) {
      this.leftActiveKey = value;
    },
    receivChilRight(value) {
      this.rightActiveKey = value;
    },
    // 父级接收子级搜索关键字
    receivChilSearch(value) {
      this.searchKey = value;
      this.loadPowerProjectList();
    },
    // 获取项目管理列表数据
    async loadPowerProjectList() {
      let userInfo = JSON.parse(sessionStorage.getItem("loginData"));
      let params = `${this.paginationProject.currentPage}/${this.paginationProject.pageSize}?userName=${userInfo.user.userName}`;
      let res = await power.powerUserQueryList(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      let arrData = res.data.data;
      this.loadDevicePermission(this.projectId, arrData);
      this.projectList = res.data.data;
      this.$bus.emit("clearSearchKey");
    },
    // 获取设备数据
    async loadDevicePermission(projectId, currentData) {
      let res = await power.powerFindAllEquipments({ projectId: projectId });
      if (res.code != "200") {
        this.$message.warning("加载失败");
        return;
      }
      let data =
        res.data &&
        res.data.map((_, i) => {
          _.equipmentName = this.equiType[_.equipmentType];
          _.id = _.equipmentType + i;
          _.equipmentCode = _.equipmentType;
          return _;
        });
      let dataList = data;
      let currentEqui = [];
      for (let i in dataList) {
        if (dataList[i].equipmentCode == 1) {
          currentEqui = dataList[i].children.map((val) => {
            let data = {};
            data.title = val.equipmentName;
            data.key = val.id;
            data.slots = {
              icon: "dg",
            };
            return data;
          });
        }
      }
      let treeData = currentData.map((val) => {
        let json = {};
        json.title = val.projectName;
        json.key = val.projectId;
        json.slots = {
          icon: "right",
        };
        json.children = currentEqui;
        return json;
      });
      this.treeData = treeData;
    },

    // 返回首页
    goHome() {
      this.$router.push({ path: "/" });
    },
    // 返回列表
    goBack() {
      this.$router.push({
        path: "/ctrl/light-pole",
      });
    },
    // 添加设备
    showAddDevice() {
      this.visible = !this.visible;
    },
    showWarningMessage() {
      this.visibleWarning = !this.visibleWarning;
    },
    // 获取设备信息
    async getPoleInfo(equipmentId) {
      this.equipmentNum = 0;
      this.lightInfo = [];
      this.camareInfo = [];
      this.environmentalInfo = [];
      this.displayInfo = [];
      this.radarInfo = [];
      const typeObj = {
        4112: "lightInfo",
        4128: "camareInfo",
        4176: "environmentalInfo",
        4192: "radarInfo",
        4144: "displayInfo",
        4129: "wifiInfo",
        4208: "lockInfo",
        4240: "sosInfo",
        4272: "broadInfo",
      };
      let equiTypeList = [];
      let equiTypeListEven = [];
      let equiTypeListOdd = [];
      let opt = {
        id: equipmentId,
        projectId: this.projectId,
      };
      let res = await pole.findBindingsByType(opt);
      if (res.code != "200") {
        this.$message.warning("加载失败");
        return;
      }
      let equipmentDOS = res.data.equipmentDOS;
      this.equipmentDOS = equipmentDOS;
      this.poleInfoDO = res.data.poleInfoDO;

      for (let i in equipmentDOS) {
        equiTypeList.push({
          code: i,
          name: this.equiType[i],
        });
        this[typeObj[i]] = equipmentDOS[i];
        this.equipmentNum++;
      }
      for (let i = 0; i < equiTypeList.length; i++) {
        if (i % 2 == 0) {
          equiTypeListOdd.push(equiTypeList[i]);
        } else {
          equiTypeListEven.push(equiTypeList[i]);
        }
      }
      if (equiTypeListEven.length > 0) {
        let rightCode = equiTypeListEven[0].code;
        let righttypeName = typeObj[rightCode];
        let rightCodeList = this.getDeviceCode(this[typeObj[rightCode]]);
        this.equiDataEven = equiTypeListEven;
        this.rightActiveKey = rightCode;
        this.getData(righttypeName, rightCodeList, rightCode);
      }
      if (equiTypeListOdd.length > 0) {
        let leftCode = equiTypeListOdd[0].code;
        let typeName = typeObj[leftCode];
        let leftCodeList = this.getDeviceCode(this[typeObj[leftCode]]);
        this.equiDataOdd = equiTypeListOdd;
        this.leftActiveKey = leftCode;
        this.getData(typeName, leftCodeList, leftCode);
      }

      let firstKey = this.getFirstKey(equipmentDOS);
      let equipmentCodeList = this.getDeviceCode(this[typeObj[firstKey]]);
      let activeKey = this[typeObj[firstKey]][0].equipmentCode;
      this.showOne = typeObj[firstKey];
      this.getDeviceWarningMessage(equipmentCodeList, activeKey);
    },

    // 获取返回数据对象中的第一个元素KEY
    getFirstKey(obj) {
      for (var k in obj) return k;
    },

    // 切换设备类型,查看设备信息并获取设备基础数据以外的特殊数据
    chooseDevice(type = "lightInfo") {
      this.showOne = type;
      let equipmentCodeList = this.getDeviceCode(this[type]);
      let activeKey = this[type][0].equipmentCode;
      this.getDeviceWarningMessage(equipmentCodeList, activeKey);
      this.getData(type, equipmentCodeList, this.equipmentTypeObj[type]);
    },
    async getData(type, codes, equipmentType) {
      let opt = {
        projectId: this.projectId,
        codes: codes,
        equipmentType: equipmentType,
      };
      let res = await pole.getInfoByDeviceEquipmentCodes(opt);
      if (res.code != "200") {
        this.$message.warning("加载失败");
        return;
      }
      this[type] = res.data;
    },

    // 筛选设备equipmentCode
    getDeviceCode(data) {
      let equipmentCodeList = data && data.map((_) => _.equipmentCode);
      return equipmentCodeList;
    },
    // 通过设备code查询设备的告警信息
    async getDeviceWarningMessage(codeList, activeKey) {
      let res = await pole.getWarningMessageByCode(codeList);
      if (_.isEmpty(res) || res.code != "200") {
        this.$message.warning("加载失败");
        return;
      }
      this.warningMessageList = res.data;
      this.setWarning(activeKey);
      console.log('设备告警', res.data,)
    },
    // 获取设备告警状态
    setWarning(activeKey) {
      this.isWarning = !_.isEmpty(
        this.warningMessageList && this.warningMessageList[activeKey]
      );
    },
    // 获取屏幕高度
    get_bodyHeight() {
      //动态获取浏览器高度
      const that = this;
      window.addEventListener("resize", () => {
        let fullHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        that.fullHeight = fullHeight;
      });
    },
  },
};
</script>
<style lang="less">
</style>
