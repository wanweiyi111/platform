<template>
  <div class="environment-report">
    <a-row>
      <a-col :span="3">
        <a-radio-group
          @change="handleSizeChange"
          :defaultValue="defaultSearchType"
          buttonStyle="solid"
        >
          <a-radio-button value="week">周</a-radio-button>
          <a-radio-button value="month">月</a-radio-button>
          <!-- <a-radio-button value="years">年</a-radio-button> -->
        </a-radio-group>
      </a-col>
      <a-col :span="6">
        日期 &nbsp;
        <a-date-picker v-model="defaultSearchTime" :format="dateFormat" @change="onChangeDate" />
      </a-col>
    </a-row>
    <EnvironmentEchartsBox :echartsList="echartsList"></EnvironmentEchartsBox>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import baseMixin from "@/mixins/base.js";
import Environment from "@/api/Environment";
import EnvironmentEchartsBox from "@/components/EnvironmentMonitor/EnvironmentEchartsBox.vue";
const environment = new Environment();

export default {
  mixins: [baseMixin],
  components: {
    EnvironmentEchartsBox
  },

  data() {
    return {
      searchObj: {},
      defaultSearchType: "week",
      defaultSearchDate: "",
      defaultSearchTime:"",
      dateFormat: "YYYY-MM-DD HH:MM:SS",
      echartsList: [],
      typeObj: {
        humiditys: "湿度",
        rainfall: "雨量",
        temperatures: "温度",
        noises: "噪音",
        pm10s: "PM10",
        pm25s: "PM2.5",
        pressures: "气压",
        windDirections: "风向",
        windSpeed: "风力"
      },
      yAxisNameObj: {
        humiditys: "湿度(RH%)",
        rainfall: "雨量(mm)",
        temperatures: "温度(°C)",
        noises: "噪音(dB/A)",
        pm10s: "PM10(ug/m³)",
        pm25s: "PM2.5(ug/m³)",
        pressures: "气压(h/pa)",
        windDirections: "风向(°)",
        windSpeed: "风力(m/s)"
      }
    };
  },
  created() {
    this.defaultSearchDate = moment(new Date()).format("YYYY-MM-DD HH:MM:SS");
    this.loadEchartsData();
  },
  computed: {},

  methods: {
    moment,
    // 获取报表数据
    async loadEchartsData() {
      let echartsList1 = {};
      let echartsList2 = {};
      let echartsList3 = {};
      let echartsList4 = {};
      let echartsList5 = {};
      let opt = {
        searchType: this.defaultSearchType,
        searchDate: [this.defaultSearchDate],
        projectId: this.projectId
      };

      let res = await environment.findByTimeDimension(opt).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        return;
      }
      if (!_.isEmpty(res.data.data)) {
        echartsList1 = {
          legendData: [this.typeObj["humiditys"], this.typeObj["rainfall"]],
          datalist: [
            res.data.data[0]["humiditys"],
            res.data.data[0]["rainfall"]
          ],
          xAxis: res.data.dates,
          yAxisName: [
            this.yAxisNameObj["humiditys"],
            this.yAxisNameObj["rainfall"]
          ]
        };
        echartsList2 = {
          legendData: [this.typeObj["temperatures"], this.typeObj["noises"]],
          datalist: [
            res.data.data[0]["temperatures"],
            res.data.data[0]["noises"]
          ],
          xAxis: res.data.dates,
          yAxisName: [
            this.yAxisNameObj["temperatures"],
            this.yAxisNameObj["noises"]
          ]
        };
        echartsList3 = {
          legendData: [this.typeObj["pm10s"], this.typeObj["pm25s"]],
          datalist: [res.data.data[0]["pm10s"], res.data.data[0]["pm25s"]],
          xAxis: res.data.dates,
          yAxisName: [this.yAxisNameObj["pm10s"], this.yAxisNameObj["pm25s"]]
        };
        echartsList4 = {
          legendData: [
            this.typeObj["pressures"],
            this.typeObj["windDirections"]
          ],
          datalist: [
            res.data.data[0]["pressures"],
            res.data.data[0]["windDirections"]
          ],
          xAxis: res.data.dates,
          yAxisName: [
            this.yAxisNameObj["pressures"],
            this.yAxisNameObj["windDirections"]
          ]
        };
        echartsList5 = {
          legendData: [this.typeObj["windSpeed"]],
          datalist: [res.data.data[0]["windSpeed"]],
          xAxis: res.data.dates,
          yAxisName: [this.yAxisNameObj["windSpeed"]]
        };
      }
      this.echartsList = [
        echartsList1,
        echartsList2,
        echartsList3,
        echartsList4,
        echartsList5
      ];
    },
    handleSizeChange(e) {
      this.defaultSearchType = e.target.value;
      this.loadEchartsData();
    },
    // 切换日期
    onChangeDate(date, dateStrings) {
      this.defaultSearchTime=date;
      this.defaultSearchDate = dateStrings;
      this.loadEchartsData();
    }
  }
};
</script>

<style lang="less">
.environment-report {
  padding-top: 10px;
  .ant-radio-button-wrapper {
    background: transparent;
    &.ant-radio-button-wrapper-checked {
      // background: #fff;
      color: #011147;
    }
  }
  .echarts-content {
    padding: 12px;
    .echarts-box {
      width: 100%;
      height: 400px;
    }
  }
}
</style>
