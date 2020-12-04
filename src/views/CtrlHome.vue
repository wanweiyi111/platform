<template>
  <div class="desktopHome">
    <a-row :gutter="24">
      <a-col :span="6">
        <a-card
          class="customCard customStyle_map"
          title="设备概况"
          :loading="EquiData.length<1"
          :bordered="false"
          :style="{height:(fullHeight-130)/4+ 'px'}"
        >
          <HomeEquipment :equipData="EquiData" />
        </a-card>
        <a-card
          class="customCard customCard--charts"
          title="在线率统计"
          :bordered="false"
          :loading="onLineData.xArray.length<1"
        >
          <BarMultiple
            :bardata="onLineData"
            :chartHeight="(fullHeight-205)/2.5"
          />
        </a-card>
      </a-col>
      <a-col
        :span="12"
        class
      >
        <a-card
          class="customCard customStyle_map"
          title="地图分布"
          :bordered="false"
        >
          <Map :height="((fullHeight-165)/3)*2" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card
          class="customCard customCard--charts"
          title="WIFI连接统计"
          :bordered="false"
        >
          <WifiLine
            :linedata="WifiData"
            :chartHeight="(fullHeight-250)/3"
            :seriesArray="WifiData.seriesArray"
          />
        </a-card>
        <a-card
          class="customCard customCard--charts"
          title="视频监控"
          :bordered="false"
        >
          <Video
            :videoHeight='(fullHeight-246)/3'
            :videoInfo="selCameraList&&selCameraList[0]"
            id="home111"
          />
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="6">
        <a-card
          class="customCard customCard--charts"
          title="环境监测"
          :bordered="false"
          :style="{height:(fullHeight-175)/3+'px'}"
        >
          <EnvironmentalMonitoring
            :environmentData="environmentData"
            v-if="environmentData.length"
          ></EnvironmentalMonitoring>
          <span
            class="show pd-y10 pd-x10"
            v-else
          >暂无数据</span>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card
          class="customCard customCard--charts"
          title="照明能耗"
          :bordered="false"
          :loading="ligthData.xArray.length<1"
        >
          <LineArea
            :linedata="ligthData"
            :chartHeight="(fullHeight-280)/3"
          />
          <!-- <div class="tip"></div> -->
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card
          class="customCard customCard--charts"
          title="异常事件"
          :bordered="false"
          :loading="abnormalData.seriesArray.length<1"
        >
          <pie
            :bardata="abnormalData"
            :chartHeight="(fullHeight-280)/3"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card
          class="customCard customCard--charts"
          title="一键求助"
          :bordered="false"
          :loading="barData.xArray.length<1"
        >
          <Bar
            class="about_bar"
            id="about_bar"
            :chartHeight="(fullHeight-280)/3"
            :bardata="barData"
          />
        </a-card>
      </a-col>
    </a-row>
    <div class="footer">
      <div>2020 华智有为 版权所有</div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import Api from "@/api";
import LocalApi from "@/api/LocalApi";
import { mapActions, mapGetters } from "vuex";
import baseMixin from "@/mixins/base.js";
import MapMixin from "@/mixins/map.js";
import EnvironmentalMonitoring from "@/components/common/EnvironmentalMonitoring.vue";
import Video from "@/components/common/SimpleVideo.vue";
import Map from "@/components/Map/Map.vue";
import echarts from "echarts";
import HomeEquipment from "@/components/HomeEquipment.vue";
import Bar from "@/components/Chart/Bar.vue";
import BarMultiple from "@/components/Chart/BarMultiple.vue";
import pie from "@/components/Chart/Pie.vue";
import LineArea from "@/components/Chart/LineArea.vue";
import WifiLine from "@/components/Chart/Line.vue";
import Media from "@/api/Media.js";
let media = new Media();
const api = new Api();
const lApi = new LocalApi();
export default {
  mixins: [baseMixin, MapMixin],
  components: {
    EnvironmentalMonitoring,
    Video,
    Map,
    HomeEquipment,
    Bar,
    BarMultiple,
    pie,
    LineArea,
    WifiLine,
  },
  data() {
    return {
      cameraList: [],
      selCameraList: [],
      queryObj: {},
      environmentData: [], //环境监测数据
      fullHeight: document.documentElement.clientHeight,
      barData: {
        ref: "barhelp",
        xArray: [],
        yArray: [],
        colorArray: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#7b51ea" },
          { offset: 0.5, color: "#5a4ecc" },
          { offset: 1, color: "#354bab" },
        ]),
      },
      onLineData: {
        ref: "onlinebar",
        xArray: [],
        seriesName: ["在线", "离线"],
        seriesArray: [],
        seriesColor: [
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#83c324" },
            { offset: 1, color: "#008000" },
          ]),
          "#a4a4a4",
        ],
      },
      abnormalData: {
        ref: "abnormalPie",
        xArray: [],
        seriesArray: [],
        seriesColor: [
          "#016cfe",
          "#FFFF00",
          "#3399CC",
          "#755ce7",
          "#FF6600",
          "#009966",
          "#00FFFF",
          "#FF6699",
          "#99FF33",
          "#FF0000",
        ],
      },
      ligthData: {
        ref: "lightLine",
        xArray: [],
        seriesArray: [],
      },
      WifiData: {
        ref: "wifiLine",
        xArray: [],
        seriesArray: [],
      },
      EquiData: [],
    };
  },

  computed: {
    ...mapGetters(["poleList"]),
  },
  beforeCreate() {},
  created() {
    this.findByProjectIdPaged();
    if (this.projectId) {
      this.setMapPoleMarks();
      this.getCameraList();
      this.handleEqui();
    }
  },
  mounted() {
    this.toProjectCenter();
    this.get_bodyHeight();
    // window.onresize = this.get_bodyHeight;
    if (this.projectId) {
      this.handleOnline(this.projectId);
      this.handleHelp(this.projectId);
      this.handleLighting(this.projectId);
      this.handleAbnormal(this.projectId);
      this.handleWIFI(this.projectId);
    }
  },
  watch: {
    fullHeight(val) {
      //监控浏览器高度变化
      if (!this.timer) {
        this.fullHeight = val;
        this.timer = true;
        let that = this;
        setTimeout(function () {
          that.timer = false;
        }, 400);
      }
    },
  },
  /**设置echart 饼图配置值**/
  methods: {
    // 获取屏幕高度
    get_bodyHeight() {
      //动态获取浏览器高度
      const that = this;
      window.onresize = () => {
        return (() => {
          window.fullHeight = document.documentElement.clientHeight;
          that.fullHeight = window.fullHeight;
        })();
      };
    },
    // 一键告警
    async handleHelp(id) {
      let res = await lApi["postAlarm"]({ projectId: id }).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning(res.msg);
        return;
      }
      let boxData = res.data;
      let xArray = [];
      let yArray = [];
      for (let i in boxData) {
        let keys = Object.keys(boxData[i]);
        xArray.push(keys + "月");
        yArray.push(boxData[i][keys]);
      }
      this.barData.ref = "bardata";
      this.barData.xArray = xArray;
      this.barData.yArray = yArray;
    },
    // 照明能耗
    async handleLighting(id) {
      let res = await lApi["postLightReport"]({
        projectId: id,
      }).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning(res.msg);
        return;
      }
      let boxData = res.data;
      let xArray = [];
      let yArray = [];
      for (let i in boxData) {
        let keys = Object.keys(boxData[i]);
        xArray.push(keys + "月");
        yArray.push(boxData[i][keys]);
      }
      this.ligthData.xArray = xArray;
      this.ligthData.seriesArray = yArray;
    },
    // 异常事件
    async handleAbnormal(id) {
      let res = await lApi["postAlarmType"]({
        projectId: id,
      }).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning(res.msg);
        return;
      }
      let boxData = res.data;
      let seriesData = [];
      for (let i in boxData) {
        let keys = Object.keys(boxData[i]);
        if (this.projectId == 10028) {
          if (keys != "公共广播") {
            seriesData.push({
              name: keys[0],
              value: boxData[i][keys],
            });
          }
        } else {
          seriesData.push({
            name: keys[0],
            value: boxData[i][keys],
          });
        }
      }
      this.abnormalData.seriesArray = seriesData;
    },
    // WIFI连接
    async handleWIFI(id) {
      let res = await lApi["postWifi"]({
        projectId: id,
      }).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning(res.msg);
        return;
      }
      let boxData = res.data;
      let xArray = [];
      let yArray = [];
      for (let i in boxData) {
        let keys = Object.keys(boxData[i]);
        xArray.push(keys + "月");
        yArray.push(boxData[i][keys]);
      }
      this.WifiData.xArray = xArray;
      this.WifiData.seriesArray = yArray;
    },
    // 设备概况
    async handleEqui() {
      let res = await lApi["postEquipment"]({
        projectId: this.projectId,
      }).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning(res.msg);
        return;
      }
      let boxData = res.data;
      let seriesData = [];
      for (let i in boxData) {
        let keys = Object.keys(boxData[i]);
        // 10028惠州项目无公共广播，过滤
        if (this.projectId == 10028) {
          if (keys != "公共广播") {
            seriesData.push({
              name: keys[0],
              value: boxData[i][keys],
            });
          }
        } else {
          seriesData.push({
            name: keys[0],
            value: boxData[i][keys],
          });
        }
      }
      this.EquiData = seriesData;
    },
    //安防列表获取
    async getCameraList() {
      let res = await media
        .GetSrcWithoutDevice({
          projectId: this.projectId,
        })
        .catch((err) => {
          console.log(err.message);
        });
      if (res && res.code === "200") {
        res.data.map((item, idx) => {
          this.cameraList.push({
            equipmentCode: item.equipmentCode,
            equipmentName: item.equipmentName,
            no: idx,
            token: item.strToken,
            host: item.serverName && item.serverName.replace("http://", ""),
            selected: false,
          });
          if (item.isDisplay) {
            this.selCameraList.push({
              no: idx,
              token: item.strToken,
              host: item.serverName && item.serverName.replace("http://", ""),
              selected: false,
            });
          }
        });
      }
    },
    ...mapActions([
      "loadAllPoles",
      "findByNameOrLocation",
      "getUserInfoByToken",
    ]),
    // 设置地图显示 灯杆
    setMapPoleMarks() {
      let currProject = {
        longitude: this.currProject.longitude,
        latitude: this.currProject.latitude,
      };
      this.queryObj.projectId = this.projectId;
      this.loadAllPoles(this.queryObj)
        .then((res) => {
          if (!_.isArray(res.data)) {
            return;
          }
          this.setMapMarks(res.data, "pole");
          this.setCenter(currProject);
        })
        .catch((err) => {
          console.info(err);
        });
    },
    // 地图点击灯杆 跳转
    selectedRow(item) {
      this.$router.push(`/ctrl/manager-device?id=${item.id}`);
    },
    async findByProjectIdPaged() {
      let res = await api
        .homeSensorFindByProjectId({ projectId: this.projectId })
        .catch((err) => {
          console.log(err);
        });

      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning(res.msg);
        return;
      }
      this.environmentData = res.data;
    },
    // 在线率统计
    async handleOnline(id) {
      let opt = Object.assign({
        projectId: id,
      });
      let res = await lApi["postOnLineEquipment"](opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      let dataBox = res.data;
      let seriresTotal = [];
      let onlineNum = [];
      let offNum = [];
      let xArray = [];
      for (let key in dataBox) {
        xArray.push(dataBox[key].name);
        onlineNum.push(dataBox[key].onTotal);
        offNum.push(dataBox[key].offTotal);
      }
      seriresTotal = [
        {
          name: "在线",
          type: "bar",
          barGap: 0,
          // barMinHeight: [2],
          // label: labelOption,
          data: onlineNum,
          itemStyle: {
            normal: {
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "#fff",
                  fontSize: 12,
                },
                formatter: function (params) {
                  if (params.value > 0) {
                    return params.value;
                  } else {
                    return "";
                  }
                },
              },
            },
          },
        },
        {
          name: "离线",
          type: "bar",
          data: offNum,
          itemStyle: {
            normal: {
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "#fff",
                  fontSize: 12,
                },
                formatter: function (params) {
                  if (params.value > 0) {
                    return params.value;
                  } else {
                    return "";
                  }
                },
              },
            },
          },
        },
      ];
      this.onLineData.xArray = xArray;
      this.onLineData.seriesArray = seriresTotal;
      this.$set(this.onLineData);
    },
  },
};
</script>
<style lang="less" scoped>
.Video {
  padding: 0;
  // height: 209px;
}
</style>
