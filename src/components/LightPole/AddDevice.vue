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
                  :value="deviceTypeVal"
                  @change="deviceChange"
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
              <span class="title">设备编号</span>
              <span class="ctrData">
                <a-tree-select
                  :treeData="deviceList"
                  treeDefaultExpandAll
                  :value="deviceNo"
                  @change="deviceNoChange"
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
              <span class="title">设备厂家</span>
              <span class="ctrData">
                <a-input class="sourceData" v-model="deviceManufactor" />
              </span>
            </a-col>
          </a-row>
          <a-row class="infoItem arow">
            <a-col :span="12">
              <span class="title">设备型号</span>
              <span class="ctrData">
                <a-input class="sourceData" v-model="deviceModel" />
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
                <a-input class="sourceData" v-model="camareType" />
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
              <span class="ctrData">{{poleInfoDO.equipmentName}}</span>
            </a-col>
            <a-col :span="12">
              <span class="title">安装时间</span>
              <span class="ctrData">
                <a-input class="sourceData" v-model="installTime" />
              </span>
            </a-col>
          </a-row>
          <!-- <a-row class="infoItem arow">
            <a-col :span="12">
              <span class="title">设备版本型号</span>
              <span class="ctrData">
                <a-input class="sourceData" v-model="equipmentVersion" />
              </span>
            </a-col>
            <a-col :span="12"></a-col>
          </a-row>-->
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script>
import deviceApi from "@/api/Pole";
import utils from "@/utils/";
import baseMixin from "@/mixins/base.js";

let device_api = new deviceApi();
const deviceType = [
  {
    title: "安防监控",
    value: "4128",
    key: "4128"
  },
  {
    title: "照明",
    value: "4112",
    key: "4112"
  },
  {
    title: "WIFI",
    value: "4160",
    key: "4160"
  },
  {
    title: "大屏",
    value: "4144",
    key: "4144"
  },
  {
    title: "环境监控",
    value: "4176",
    key: "4176"
  },
  {
    title: "雷达",
    value: "4192",
    key: "4192"
  }
];
export default {
  mixins: [baseMixin],
  components: {},
  props: {
    visible: Boolean,
    showModel: Function,
    poleInfoDO: Object
  },
  data() {
    return {
      deviceList: [],
      deviceListVal: [],
      modalWidth: document.body.clientHeight - 100,
      deviceType,
      deviceTypeVal: "",
      deviceManufactor: "",
      deviceModel: "",
      camareType: "",
      deviceName: "",
      deviceNo: "",
      deviceMAC: "",
      deviceIP: "",
      installTime: "",
      uName: "",
      equipmentVersion: "",
      pwd: "",
      submitData: ""
    };
  },
  methods: {
    deviceNoChange(val) {
      let curElement = this.deviceListVal[val];
      this.submitData = {
        poleId: this.poleInfoDO.id,
        equipmentId: curElement.id,
        equipmentType: curElement.equipmentType,
        equipmentCode: curElement.equipmentCode
      };
      this.deviceNo = curElement.equipmentCode;
      this.deviceModel = curElement.equipmentModel;
      this.deviceName = curElement.equipmentName;
      this.deviceNo = curElement.equipmentName;
      this.deviceManufactor = curElement.manufacturerName;
      this.installTime = utils.toDate(curElement.installationTime);
      this.deviceIP = curElement.equipmentIp;
      this.deviceMAC = curElement.equipmentMac;
      this.equipmentVersion = curElement.equipmentVersion || "1.0";
      this.uName = curElement.createBy;
      this.camareType = curElement.cameraType;
    },
    deviceChange(val) {
      this.deviceTypeVal = val;
      this.loadList("getDeviceListByDeviceType", {
        projectId: this.projectId,
        equipmentType: val
      });
    },
    async loadList(api, opt) {
      let res = await device_api[api](opt).catch(err => {
        console.log(err);
      });
      if (res.code === "200") {
        this.deviceListVal = res.data;
        this.deviceList = [];
        res.data.map((item, idx) => {
          this.deviceList.push({
            title: item.equipmentName,
            value: idx,
            key: idx
          });
        });
      }
    },
    async handleOk() {
      let opt = this.submitData;
      let res = await device_api["addDeviceToPole"](opt).catch(err => {
        console.log(err);
      });
      if (res.code === "200") {
        this.$message.success("添加成功");
        this.showModel();
        setTimeout(() => {
          this.$router.go(-1);
        }, 1000);
      }
    },
    handleCancel() {
      this.showModel();
      //   setTimeout(() => {
      //     this.showModel();
      //   }, 3000);
    },
    changeTabs() {}
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
