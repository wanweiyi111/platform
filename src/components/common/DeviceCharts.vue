<template>
  <Box title="设备概况" :titleNum="0" class="DeviceCharts">
    <a-tabs defaultActiveKey="1" tabPosition="bottom">
      <a-tab-pane tab="Tab 1" key="1">
        <a-row type="flex" justify="space-around" align="middle" class="arow">
          <ChartRing
            :option="etc"
            id="etc"
            :num="8"
            :showNotice="true"
            :showTime="true"
            modelName="智慧停车"
          ></ChartRing>
          <ChartRing
            :option="light"
            id="linghts"
            :num="8"
            :showNotice="true"
            :showTime="true"
            modelName="智能照明"
          ></ChartRing>
          <ChartRing
            :option="screen"
            id="screen"
            :num="8"
            :showNotice="true"
            :showTime="true"
            modelName="信息发布"
          ></ChartRing>
          <!-- <ChartRing
          :option="deviceOpt"
          id="chartEnv"
          :num="8"
          :showNotice="true"
          :showTime="true"
          modelName="环境传感器"
          ref="chartEnv"
          ></ChartRing>-->
        </a-row>
      </a-tab-pane>
      <a-tab-pane tab="Tab 2" key="2">
        <a-row type="flex" justify="space-around" align="middle" class="arow">
          <ChartRing
            :option="camera"
            id="wifi"
            :num="8"
            :showNotice="true"
            :showTime="true"
            modelName="安防监控"
          ></ChartRing>
          <ChartRing
            :option="sensor"
            id="chartEnv"
            :num="8"
            :showNotice="true"
            :showTime="true"
            modelName="环境传感器"
          ></ChartRing>
          <ChartRing
            :option="radar"
            id="display"
            :num="8"
            :showNotice="true"
            :showTime="true"
            modelName="雷达"
          ></ChartRing>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </Box>
</template>

<script>
import baseMixin from "@/mixins/base.js";
import ChartRing from "@/components/common/ChartRing.vue";
import Box from "@/components/Box.vue";
import Report from "@/api/Report";
let api = new Report();
export default {
  mixins: [baseMixin],
  components: {
    Box,
    ChartRing
  },
  data() {
    return {
      light: "",
      screen: "",
      camera: "",
      radar: "",
      sensor: "",
      etc: ""
    };
  },
  created() {
    this.loadList("geAallDevice");
  },
  methods: {
    changeCarousel(current) {},
    async loadList(type, data, val) {
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
      this.setOpts(_list);
    },
    setOpts(data) {
      for (let i in data) {
        let deviceOpt = {
          series: [
            {
              type: "pie",
              // center: ["50%", "50%"], // 仪表位置
              radius: ["100%", "80%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: true,
                  formatter: "{c|在线} \n {a|" + data[i].onTotal + "}",
                  rich: {
                    c: {
                      color: "#38AEE0",
                      fontSize: 11,
                      lineHeight: 30,
                      align: "center"
                    },
                    a: {
                      fontSize: 24,
                      align: "center",
                      color: "#FFF"
                    }
                  },
                  textStyle: {
                    fontSize: 11,
                    fontWeight: "bold"
                  },
                  position: "center"
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: "12",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {
                  value: data[i].onTotal,
                  name: "在线",
                  itemStyle: {
                    color: "#57e7ec"
                  }
                },
                {
                  value: data[i].offTotal,
                  name: "离线",
                  itemStyle: {
                    color: "#fff"
                  }
                },
                {
                  value: data[i].errorTotal,
                  name: "故障",
                  itemStyle: {
                    color: "#ff7373"
                  }
                }
              ]
            }
          ]
        };
        this[i] = deviceOpt;
      }
    }
  }
};
</script>
<style lang="less">
.DeviceCharts {
  .ant-tabs-bottom {
    margin-top: 30px;
  }
  .ant-tabs-tab {
    opacity: 0;
  }
}
</style>