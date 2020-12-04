<template>
  <div>
    <ChartSlider class="right-sidebar" :title="chartTitle" :data="sliderChartData" v-show="tabKey === '1'">
    </ChartSlider>
    <a-row class="ctrl-lock">
      <a-col :span="bottomSpan.left">
        <SummarySidebar class="right-sidebar" :allDeviceInfo="allDeviceInfo"></SummarySidebar>
        <CtrlPanel :hide-title="true" :style="{height:'580px'}" class="bottom-sidebar">
          <dd slot="content" class="pd-x10">
            <a-tabs :tabBarGutter="2" @change="changeTabs">
              <a-tab-pane tab="概览" key="1">
                <Summary ref="Summary" :cusRow="cusRow"></Summary>
              </a-tab-pane>
              <a-tab-pane tab="开关锁记录" key="2">
                <History ref="History"></History>
              </a-tab-pane>
              <!-- <a-tab-pane tab="统计报表" key="3">
                  <Chart ref="Chart"></Chart>
                </a-tab-pane> -->
              <div slot="tabBarExtraContent" class="pd-t5 tabBarExtraContent">
                <span v-if="tabKey==='1'">
                  联网状态
                  <a-select class="select" v-model="SummaryObj.networkState" style="width: 100px" @change="search">
                    <a-select-option value="0">离线</a-select-option>
                    <a-select-option value="1">在线</a-select-option>
                  </a-select>
                </span>
                <span class="serchBar" v-if="tabKey==='2'">
                  设备状态
                  <a-select class="select" v-model="SummaryObj.equipmentStatus" style="width: 100px" @change="search">
                    <a-select-option value="0">故障</a-select-option>
                    <a-select-option value="1">正常</a-select-option>
                  </a-select>
                </span>
                <span class="serchBar" v-if="tabKey==='2'">
                  时间
                  <a-range-picker :format="formatData" :value="dateValue" @change="handleChange" class="timeRange"
                    style="width: 300px" :placeholder="['开始时间', '结束时间']" />
                </span>
                <a-input-search v-model="SummaryObj.equipmentName" @search="search" placeholder="输入关键词"
                  class="mr5 serchBar" style="width: 130px;bottom:2px;" size="small" v-if="tabKey!=='3'" />
                <!-- <a-button icon="delete" size="small" @click="batchDelete">删除</a-button> -->
              </div>
            </a-tabs>
          </dd>
        </CtrlPanel>
      </a-col>
      <a-col :span="bottomSpan.right">
        <OneInfo :curObj="curObj" :bottomSpan="bottomSpan" v-if="showRight" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import _ from "lodash";
  import moment from "moment";
  import utils from "@/utils";
  import MapMixin from "@/mixins/map.js";
  import baseMixin from "@/mixins/base.js";
  import CtrlPanel from "@/components/CtrlPanel.vue";
  // import Chart from "@/components/SmartLock/Chart.vue";
  import Summary from "@/components/SmartLock/Summary.vue";
  import History from "@/components/SmartLock/History.vue";
  import OneInfo from "@/components/SmartLock/OneInfo.vue";
  import SummarySidebar from "@/components/common/SummarySidebar.vue";
  import ChartSlider from "@/components/common/ChartSlider.vue";
  import Lock from "@/api/Lock";
  let api = new Lock();
  export default {
    mixins: [baseMixin, MapMixin],
    components: {
      ChartSlider,
      CtrlPanel,
      SummarySidebar,
      Summary,
      // Chart,
      OneInfo,
      History
    },
    data() {
      return {
        curObj: {},
        showRight: false,
        formatData: "YYYY-MM-DD",
        sliderChartData: [],
        chartTitle: "智能柜锁",
        allDeviceInfo: {},
        tabKey: "1",
        SummaryObj: {
          networkState: "1",
          equipmentStatus: "1",
          startTime: "",
          endTime: ""
        },
        HistoryObj: {},
        columns: [],
        programInfo: [],
        bottomSpan: {
          left: 24,
          right: 10
        },
        dateValue: [],
        visible: false
      };
    },
    created() {
      this.loadSiderChart();
    },
    methods: {
      handleChange(value) {
        this.dateValue = value;
        this.SummaryObj.startTime = `${moment(value[0]).format(
          "YYYY-MM-DD"
        )} 00:00:00`;
        this.SummaryObj.endTime = `${moment(value[1]).format(
          "YYYY-MM-DD"
        )} 23:59:59`;
        this.search(this.SummaryObj);
      },
      changeTabs(key) {
        this.showRight = false;
        this.bottomSpan.left = 24;
        this.tabKey = key;
        this.SummaryObj = {
          networkState: "1",
          equipmentStatus: "1",
          startTime: "",
          endTime: ""
        };
      },
      search() {
        let {
          tabKey
        } = this;
        let _arr = {
          "1": "Summary",
          "2": "History",
          "3": "Chart"
        };
        this.$refs[_arr[tabKey]].loadData(this.SummaryObj);
      },
      async loadSiderChart() {
        try {
          this.queryObj.projectId = this.projectId;
          let res = await api.findByOnNetCount(this.queryObj);
          if (res.code !== "200") {
            return;
          }
          let obj = res.data;
          this.chartTitle += " " + 1;
          this.sliderChartData = [{
              chartText: "在线率",
              chartVal: Math.round((obj.onTotal / 1) * 100) || 0
            },
            {
              chartText: "离线率",
              chartVal: Math.round((obj.offTotal / 1) * 100) || 0
            },
            {
              chartText: "故障率",
              chartVal: Math.round((obj.errorTotal / 1) * 100) || 0
            }
          ];
        } catch (err) {
          console.info(err);
        }
      },
      cusRow(record) {
        // if (this.edit) {
        //   return false;
        // }
        return {
          on: {
            click: () => {
              this.setCenter(record);
              this.showRight = true;
              this.bottomSpan.left = 14;
              this.bottomSpan.right = 10;
              this.curObj = record;
              // this.getData({
              //   id: record.id
              // }, "curObj", "findBindings");
            }
          }
        };
      },
    }
  };
</script>
<style lang="less">
  .ctrl-lock {
    .serchBar {
      width: 200px;
    }

    .serchBar {
      margin-left: 20px;
    }

    .ant-calendar-picker-input.ant-input {
      border-radius: 10px;
    }
  }
</style>