<template>
  <div class="AddDevice">
    <a-modal
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="modalWidth"
      class="modelBox"
      okText='确定'
      cancelText='取消'
    >
      <a-tabs :tabBarGutter="2" @change="changeTabs">
        <a-tab-pane tab="添加设备" key="1">
          <a-row class="infoItem arow">
            <a-col :span="12">
              <span class="title">设备类型</span>
              <span class="ctrData">
                <a-tree-select
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  :treeData="deviceType"
                  treeDefaultExpandAll
                  v-model="deviceTypeVal"
                  class="sourceData"
                >
                  <span
                    style="color: #08c"
                    slot="title"
                    slot-scope="{key, value}"
                    v-if="key='0-0-1'"
                  >Child Node1 {{value}}</span>
                </a-tree-select>
              </span>
            </a-col>
            <a-col :span="12">
              <span class="title">资源名称</span>
              <span class="ctrData">
                <a-input class="sourceData" v-model="deviceName" />
              </span>
            </a-col>
          </a-row>
          <a-row class="infoItem arow">
            <a-col :span="12">
              <span class="title">设备厂家</span>
              <span class="ctrData">
                <a-tree-select
                  :treeData="deviceType"
                  treeDefaultExpandAll
                  v-model="deviceManufactor"
                  class="sourceData"
                >
                  <span
                    style="color: #08c"
                    slot="title"
                    slot-scope="{key, value}"
                    v-if="key='0-0-1'"
                  >Child Node1 {{value}}</span>
                </a-tree-select>
              </span>
            </a-col>
            <a-col :span="12">
              <span class="title">设备编号</span>
              <span class="ctrData">
                <a-input class="sourceData" v-model="deviceNo" />
              </span>
            </a-col>
          </a-row>
          <a-row class="infoItem arow">
            <a-col :span="12">
              <span class="title">设备型号</span>
              <span class="ctrData">
                <a-tree-select
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  :treeData="deviceType"
                  treeDefaultExpandAll
                  v-model="deviceModel"
                  class="sourceData"
                >
                  <span
                    style="color: #08c"
                    slot="title"
                    slot-scope="{key, value}"
                    v-if="key='0-0-1'"
                  >Child Node1 {{value}}</span>
                </a-tree-select>
              </span>
            </a-col>
            <a-col :span="12">
              <span class="title">设备MAC</span>
              <span class="ctrData">
                <a-input class="sourceData" v-model="deviceMAC" />
              </span>
            </a-col>
          </a-row>
          <a-row class="infoItem arow">
            <!-- <a-col :span="12">
              <span class="title">摄像头类型</span>
              <span class="ctrData">
                <a-tree-select
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  :treeData="deviceType"
                  treeDefaultExpandAll
                  v-model="camareType"
                  class="sourceData"
                >
                  <span
                    style="color: #08c"
                    slot="title"
                    slot-scope="{key, value}"
                    v-if="key='0-0-1'"
                  >Child Node1 {{value}}</span>
                </a-tree-select>
              </span>
            </a-col>-->
            <a-col :span="12">
              <span class="title">设备版本型号</span>
              <span class="ctrData">
                <a-input class="sourceData" v-model="equipmentVersion" />
              </span>
            </a-col>
            <a-col :span="12">
              <span class="title">IP地址</span>
              <span class="ctrData">
                <a-input class="sourceData" v-model="deviceIP" />
              </span>
            </a-col>
          </a-row>
          <a-row class="infoItem arow">
            <a-col :span="12">
              <span class="title">归属智慧杆</span>
              <span class="ctrData">
                <a-tree-select
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  :treeData="deviceType"
                  treeDefaultExpandAll
                  v-model="lightAscription"
                  class="sourceData"
                >
                  <span
                    style="color: #08c"
                    slot="title"
                    slot-scope="{key, value}"
                    v-if="key='0-0-1'"
                  >Child Node1 {{value}}</span>
                </a-tree-select>
              </span>
            </a-col>
            <a-col :span="12">
              <span class="title">安装时间</span>
              <span class="ctrData">
                <a-date-picker @change="onTimeChange" />
              </span>
            </a-col>
          </a-row>
        </a-tab-pane>
        <!--<a-tab-pane tab="批量添加" key="2"></a-tab-pane>-->
      </a-tabs>
    </a-modal>
  </div>
</template>

<script>
import CApi from "@/api/Camera";
import EApi from "@/api/Environment";
import Api from "@/api";
import DApi from "@/api/Display";

const deviceType = [
  {
    title: "安防监控",
    value: "5",
    key: "5"
  },
  {
    title: "照明",
    value: "3",
    key: "3"
  },
  {
    title: "WIFI",
    value: "6",
    key: "6"
  },
  {
    title: "大屏",
    value: "4",
    key: "4"
  },
  {
    title: "环境监控",
    value: "7",
    key: "7"
  }
];
export default {
  components: {},
  props: {
    visible: Boolean,
    showModel: Function
  },
  data() {
    return {
      modalWidth: document.body.clientHeight - 100,
      deviceType,
      deviceTypeVal: "",
      deviceManufactor: "",
      deviceModel: "",
      camareType: "",
      lightAscription: "",
      deviceName: "",
      deviceNo: "",
      deviceMAC: "",
      deviceIP: "",
      installTime: "",
      uName: "",
      equipmentVersion: "",
      pwd: ""
    };
  },
  methods: {
    async loadList(api, opt) {
      let res = await api(opt).catch(err => {
        console.log(err);
      });
      return res;
    },
    async handleOk() {
      let deviceType = parseInt(this.deviceTypeVal);
      let res = "";
      let opt = {
        equipmentType: deviceType,
        equipmentModel: this.deviceModel,
        equipmentName: this.deviceName,
        equipmentCode: this.deviceNo,
        manufacturerName: this.deviceManufactor,
        installationTime: this.installTime,
        equipmentIp: this.deviceIP,
        equipmentMac: this.deviceMAC,
        poleCode: this.lightAscription,
        equipmentVersion: this.equipmentVersion,
        createBy: this.uName,
        cameraType: this.camareType,
        pwd: this.pwd
      };
      if (deviceType === 5) {
        // api = new CApi().addCamare;
        res = await new CApi().addCamare(opt).catch(err => {
          console.log(err);
        });
      } else if (deviceType === 3) {
        res = await new Api().addLight(opt).catch(err => {
          console.log(err);
        });
      } else if (deviceType === 7) {
        // api = new EApi().addEnvironment;
        res = await new EApi().addEnvironment(opt).catch(err => {
          console.log(err);
        });
      } else if (deviceType === 4) {
        // api = new DApi().addDisplay;
        res = await new DApi().addDisplay(opt).catch(err => {
          console.log(err);
        });
      } else if (deviceType === 6) {
        // api = new EApi().addWifi;
        res = await new EApi().addWifi(opt).catch(err => {
          console.log(err);
        });
      } else {
        return;
      }
      if (res.code === "200") {
        this.$message.success("添加成功");
        this.showModel();
      }
    },
    handleCancel() {
      this.showModel();
      //   setTimeout(() => {
      //     this.showModel();
      //   }, 3000);
    },
    changeTabs() {},
    onTimeChange(time, time2) {
      this.installTime = time.format(utils.fsTime);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
span.ant-select-arrow .ant-select-arrow-icon {
  color: #fff;
}
.modelBox {
  border: 1px solid red;
  font-size: 14px;
  color: #bacee4;
  .infoItem {
    width: 100%;
    margin-bottom: 10px;
    span {
      display: inline-block;
    }
    .title {
      width: 35%;
      text-align: right;
      padding-right: 10px;
    }
    .ctrData {
      width: 65%;
      .sourceData {
        border-radius: 10px;
        width: 100%;
      }
    }
  }
  .ant-modal-content {
    width: calc(100% - 624px);
  }
}
</style>
