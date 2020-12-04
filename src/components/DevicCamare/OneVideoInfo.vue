<template>
  <a-col :span="10" class="acol OneCamareInfo">
    <CtrlPanel :split-line="false">
      <dt slot="title">
        {{curCamera.equipmentName}}
        <div class="ctrGroup" v-if="isCamareEdit">
          <span class="save" @click="ctrInfo('save')">保存</span>
          <span class="cancel" @click="ctrInfo('cancel')">取消</span>
        </div>
      </dt>
      <dd slot="content">
        <div v-if="!isCamareEdit">
          <DeviceDetail :model="curCamera" type="camera"></DeviceDetail>
        </div>
        <div v-if="isCamareEdit" class="isCamareEdit">
          <a-collapse accordion class="light-detail">
            <a-row class="infoItem arow">
              <a-col :span="24">
                <span class="title">设备类型</span>
                <span class="ctrData">
                  <a-tree-select
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    :treeData="deviceType"
                    treeDefaultExpandAll
                    v-model="editObj.equipmentType"
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
              <a-col :span="24">
                <span class="title">资源名称</span>
                <span class="ctrData">
                  <a-input class="sourceData" v-model="editObj.equipmentName" />
                </span>
              </a-col>
            </a-row>
            <a-row class="infoItem arow">
              <a-col :span="24">
                <span class="title">设备厂家</span>
                <span class="ctrData">
                  <a-tree-select
                    :treeData="deviceType"
                    treeDefaultExpandAll
                    v-model="editObj.manufacturerName"
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
              <a-col :span="24">
                <span class="title">设备编号</span>
                <span class="ctrData">
                  <a-input class="sourceData" v-model="editObj.equipmentCode" />
                </span>
              </a-col>
            </a-row>
            <a-row class="infoItem arow">
              <a-col :span="24">
                <span class="title">设备型号</span>
                <span class="ctrData">
                  <a-tree-select
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    :treeData="deviceType"
                    treeDefaultExpandAll
                    v-model="editObj.equipmentModel"
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
              <a-col :span="24">
                <span class="title">设备MAC</span>
                <span class="ctrData">
                  <a-input class="sourceData" v-model="editObj.equipmentMac" />
                </span>
              </a-col>
            </a-row>
            <a-row class="infoItem arow">
              <a-col :span="24">
                <span class="title">IP地址</span>
                <span class="ctrData">
                  <a-input class="sourceData" v-model="editObj.equipmentIp" />
                </span>
              </a-col>
            </a-row>
            <a-row class="infoItem arow">
              <a-col :span="24">
                <span class="title">用户名</span>
                <span class="ctrData">
                  <a-input class="sourceData" v-model="editObj.createBy" />
                </span>
              </a-col>
              <a-col :span="24">
                <span class="title">密码</span>
                <span class="ctrData">
                  <a-input class="sourceData" v-model="editObj.pwd" />
                </span>
              </a-col>
            </a-row>
            <a-row class="infoItem arow">
              <a-col :span="24">
                <span class="title">归属智慧杆</span>
                <span class="ctrData">
                  <a-tree-select
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    :treeData="deviceType"
                    treeDefaultExpandAll
                    v-model="editObj.poleCode"
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
              <a-col :span="24">
                <span class="title">安装时间</span>
                <span class="ctrData">
                  <a-date-picker @change="onTimeChange" />
                </span>
              </a-col>
            </a-row>
            <a-row class="infoItem arow">
              <a-col :span="24">
                <span class="title">设备版本型号</span>
                <span class="ctrData">
                  <a-input class="sourceData" v-model="editObj.equipmentVersion" />
                </span>
              </a-col>
              <a-col :span="24"></a-col>
            </a-row>
          </a-collapse>
        </div>
      </dd>
    </CtrlPanel>
  </a-col>
</template>

<script>
import CtrlPanel from "@/components/CtrlPanel.vue";
import DeviceDetail from "@/components/common/DeviceDetail.vue";
import CApi from "@/api/Camera";
import _ from "lodash";

let api = new CApi();
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
  components: {
    CtrlPanel,
    DeviceDetail
  },
  props: {
    bottomSpan: Object,
    curCamera: Object,
    isCamareEdit: Boolean,
    changeCamareEdit: Function
  },
  created() {},
  data() {
    return {
      editObj: _.cloneDeep(this.curCamera),
      isEdit: false,
      deviceType,
      camareType: ""
    };
  },
  computed: {},
  methods: {
    async loadList(api, opt) {
      let res = await api(opt).catch(err => {
        console.log(err);
      });
      return res;
    },
    async submit() {
      // let deviceType = parseInt(this.editObj);
      try {
        let res = await api.addCamare(this.editObj);
        if (res.code === "200") {
          this.$message.success(res.msg || "修改成功");
        } else {
          this.$message.warning(res.msg);
        }
      } catch (err) {
        console.info(err);
      }
    },
    changeTabs() {},
    onTimeChange(time, time2) {
      this.installationTime = time.format(utils.fsTime);;
    },
    ctrInfo(type) {
      if (type === "save") {
        this.submit();
        this.changeCamareEdit("isCamareEdit");
      } else {
        this.changeCamareEdit("isCamareEdit");
      }
    }
  }
};
</script>

<style lang="less">
.OneCamareInfo.acol {
  position: absolute;
  right: 0;
  bottom: 0;
  color: #ddfdff;
  font-size: 7px;
  width: 100%;
  .ctrGroup {
    position: absolute;
    right: 6px;
    top: 0px;
    span {
      display: inline-block;
      cursor: pointer;
      line-height: 1em;
      text-align: center;
      padding: 5px 18px;
      text-indent: 0;
      border-radius: 15.5px;
      margin-left: 5px;
      &.save {
        background-image: linear-gradient(61deg, #6dfdfd 15%, #3bbdfb 100%);
      }
      &.cancel {
        border: 1px solid #5393c9;
      }
    }
  }
  .isCamareEdit {
    .infoItem {
      width: 100%;
      .title {
        display: inline-block;
        width: 35%;
        text-align: right;
        padding-right: 10px;
      }
      .ctrData {
        display: inline-block;
        width: 65%;
        .sourceData {
          border-radius: 10px;
          width: 100%;
        }
      }
    }
  }
  .ctrl-panel {
    padding: 0 14px;
    width: 100%;
    height: 100%;
  }
  .acol8 {
    margin-bottom: 10px;
    .gray {
      display: inline-block;
      width: 40%;
      color: #bacee4;
      margin-right: 14px;
      text-align: right;
    }
    .text {
      display: inline-block;
      width: calc(50% - 14px);
    }
  }
}
</style>
