<template>
  <div class="ctrl-police">
    <SummarySidebar class="right-sidebar" :allDeviceInfo="allDeviceInfo"></SummarySidebar>
    <a-row :gutter="16" class="bottom-sidebar">
      <a-col :span="bottomSpan.left">
        <CtrlPanel :hide-title="true" :style="{height:'580px'}" class="bottom-sidebar">
          <dd slot="content" class="pd-x10">
            <a-tabs :tabBarGutter="2" @change="changeTabs">
              <a-tab-pane tab="概览" key="1">
                <Summary ref="Summary"></Summary>
              </a-tab-pane>
              <a-tab-pane tab="历史" key="2">
                <History ref="History"></History>
              </a-tab-pane>
              <a-tab-pane tab="报表" key="3">
                <Chart ref="Chart"></Chart>
              </a-tab-pane>
              <div slot="tabBarExtraContent" class="pd-t5">
                <span v-if="tabKey==='1'">
                  联网状态
                  <a-select
                    class="select"
                    v-model="SummaryObj.networkState"
                    style="width: 100px"
                    @change="search"                    
                  >
                    <a-select-option value="0">离线</a-select-option>
                    <a-select-option value="1">在线</a-select-option>
                  </a-select>
                </span>
                <span class="serchBar" v-if="tabKey==='1'">
                  设备状态
                  <a-select
                    class="select"
                    v-model="SummaryObj.equipmentStatus"
                    style="width: 100px"
                    @change="search"
                  >
                    <a-select-option value="0">故障</a-select-option>
                    <a-select-option value="1">正常</a-select-option>
                  </a-select>
                </span>
                <span class="serchBar" v-if="tabKey==='2'">
                  时间
                  <a-range-picker
                    :format="formatData"
                    :value="value"
                    @change="handleChange"
                    class="timeRange"
                    style="width: 200px"
                    :placeholder="['开始时间', '结束时间']"
                  />
                </span>
                <span class="serchBar" v-if="tabKey==='2'">
                  处理状态
                  <a-select
                    class="select"
                    v-model="SummaryObj.eventStatus"
                    style="width: 100px"
                    @change="search"
                  >
                    <a-select-option value="0">待处理</a-select-option>
                    <a-select-option value="1">处理中</a-select-option>
                    <a-select-option value="2">已解决</a-select-option>
                  </a-select>
                </span>
                <a-input-search
                  v-model="SummaryObj.equipmentName"
                  @search="search"
                  placeholder="输入关键词"
                  class="mr5"
                  style="width: 130px;bottom:2px;"
                  size="small"
                  v-if="tabKey!=='3'"
                />
                <!-- <a-button icon="delete" size="small" @click="batchDelete">删除</a-button> -->
              </div>
            </a-tabs>
          </dd>
        </CtrlPanel>
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
import Chart from "@/components/Police/Chart.vue";
import Summary from "@/components/Police/Summary.vue";
import History from "@/components/Police/History.vue";
import SummarySidebar from "@/components/common/SummarySidebar.vue";
import Police from "@/api/Police";
let api = new Police();
export default {
  mixins: [baseMixin, MapMixin],
  components: {
    CtrlPanel,
    SummarySidebar,
    Summary,
    Chart,
    History
  },
  data() {
    return {
      formatData: "YY-MM-DD hh:mm:ss",
      sliderChartData: [],
      chartTitle: "大屏数",
      allDeviceInfo: {},
      tabKey: "1",
      SummaryObj: {
        networkState: "1",
        equipmentStatus: "1",
        eventStatus: "2",
        startDate: "",
        endDate: ""
      },
      HistoryObj: {},
      columns: [],
      programInfo: [],
      bottomSpan: {
        left: 24,
        right: 10
      },
      visible: false
    };
  },
  created() {},
  methods: {
    handleChange(value) {
      this.value = value;
      this.SummaryObj.startDate = `${moment(value[0]).format(
        "YYYY-MM-DD"
      )} 00:00:00`;
      this.SummaryObj.endDate = `${moment(value[1]).format(
        "YYYY-MM-DD"
      )} 24:00:00`;
      this.search(this.SummaryObj);
    },
    changeDateRange(date) {
      // console.log(date, "=======");
    },
    changeTabs(key) {
      this.tabKey = key;
      this.SummaryObj = {
        networkState: "1",
        equipmentStatus: "1",
        eventStatus: "2",
        startDate: "",
        endDate: ""
      };
    },
    search() {
      let { tabKey } = this;
      let _arr = { "1": "Summary", "2": "History", "3": "Chart" };
      this.$refs[_arr[tabKey]].loadData(this.SummaryObj);
    },
    // 获取照明--任务列表数据
    async loadData(params) {
      let opt = Object.assign(params, { projectId: this.projectId });
      let res = await api.findByProjectIdPaged(opt).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.dataList = res.data.records;
      // console.log(this.dataList,'=============')
      //   this.setMapMarks(this.allDevice, "pole");
    }
  }
};
</script>
<style lang="less">
.ctrl-police {
  .serchBar {
    width: 200px;
  }
}
</style>