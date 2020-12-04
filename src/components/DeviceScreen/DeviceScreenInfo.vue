<template>
  <!-- 设备管理--LED大屏详情 -->
  <a-col :span="10" class="acol OneCamareInfo">
    <CtrlPanel :split-line="false">
      <dt slot="title">
        {{curScreen.equipmentName}}
        <div class="ctrGroup" v-if="isScreenEdit||isScreenInfo">
          <span class="save" @click="ctrInfo('save')">保存</span>
          <span class="cancel" @click="ctrInfo('cancel')">取消</span>
        </div>
      </dt>
      <dd slot="content">
        <div v-if="!isScreenEdit||isScreenInfo">
          <a-collapse accordion class="light-detail">
            <p>基本信息</p>
            <a-row>
              <a-col :span="12" class="acol8">
                <span class="gray mr5">设备类型</span>
                <span class="text ellipsis">{{curScreen.equipmentType}}</span>
              </a-col>
              <a-col :span="12" class="acol8">
                <span class="gray mr5">联网状态</span>
                <span class="text ellipsis">{{curScreen.networkState}}</span>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" class="acol8">
                <span class="gray mr5">安装位置</span>
                <span class="text ellipsis">{{curScreen.location}}</span>
              </a-col>
              <a-col :span="12" class="acol8">
                <span class="gray mr5">工作状态</span>
                <span class="text ellipsis">{{curScreen.equipmentStatus}}</span>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" class="acol8">
                <span class="gray mr5">IP地址</span>
                <span class="text ellipsis">{{curScreen.equipmentIp}}</span>
              </a-col>
              <a-col :span="12" class="acol8">
                <span class="gray mr5">设备编号</span>
                <span class="text ellipsis">{{curScreen.equipmentCode}}</span>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" class="acol8">
                <span class="gray mr5">设备厂家</span>
                <span class="text ellipsis">{{curScreen.manufacturerName}}</span>
              </a-col>
              <a-col :span="12" class="acol8">
                <span class="gray mr5">设备型号</span>
                <span class="text ellipsis">{{curScreen.equipmentModel}}</span>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" class="acol8">
                <span class="gray mr5">归属智慧杆</span>
                <span class="text ellipsis">{{curScreen.poleName}}</span>
              </a-col>
              <a-col :span="12" class="acol8">
                <span class="gray mr5">安装时间</span>
                <span class="text ellipsis">{{curScreen.installationTime}}</span>
              </a-col>
            </a-row>
          </a-collapse>
        </div>
        <div v-if="isScreenEdit||isScreenInfo" class="isCamareEdit">
          <a-form :form="formScreenEdit">
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item label="设备类型" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                  <a-input disabled v-decorator="['equipmentType']"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="IP地址" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                  <a-input disabled v-decorator="['equipmentIp']"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item label="设备编号" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                  <a-input
                    v-decorator="['equipmentCode',{rules: [{ required: true, message: '请输入设备编号' }]}]"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="设备厂家" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                  <a-input
                    v-decorator="['manufacturerName',{rules: [{ required: true, message: '请输入设备厂家' }]}]"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="设备型号" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                  <a-input
                    v-decorator="['equipmentModel',{rules: [{ required: true, message: '请输入设备型号' }]}]"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="归属智慧杆" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                  <a-input
                    v-decorator="['poleName',{rules: [{ required: true, message: '请输入归属智慧杆' }]}]"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="安装时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                  <a-time-picker
                    format="HH:mm"
                    placeholder="请选择时间"
                    style="width:100%"
                    v-decorator="['installationTime',{rules: [{ required: true, message: '请选择时间' }]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </dd>
    </CtrlPanel>
  </a-col>
</template>

<script>
import moment from "moment";
import utils from "@/utils/";
import CtrlPanel from "@/components/CtrlPanel.vue";
import Display from "@/api/Display.js";
let api = new Display();

export default {
  components: {
    CtrlPanel
  },
  props: {
    curScreen: Object,
    isScreenEdit: Boolean,
    isScreenInfo: Boolean
  },
  data() {
    return {};
  },
  beforeCreate() {
    this.formScreenEdit = this.$form.createForm(this);
  },
  created() {
    this.setFormScreenEdit(this.curScreen);
    this.$bus.on("setFormScreen", item => {
      this.setFormScreenEdit(item);
    });
  },
  watch: {
    isScreenEdit() {
      this.setFormScreenEdit(this.curScreen);
    }
  },
  methods: {
    moment,
    setFormScreenEdit(item) {
      if (this.isScreenEdit) {
        const data = item;
        setTimeout(() => {
          this.formScreenEdit.setFieldsValue({
            equipmentType: data.equipmentType,
            equipmentIp: data.equipmentIp,
            equipmentCode: data.equipmentCode,
            manufacturerName: data.manufacturerName,
            equipmentModel: data.equipmentModel,
            poleName: data.poleName,
            installationTime: moment(
              data.installationTime,
              "YYYY-MM-DD hh:mm:ss"
            )
          });
        }, 0);
      }
    },
    ctrInfo(type) {
      if (type === "save") {
        this.submit();
      }
      this.$emit("changeScreenEdit", false);
    },
    submit() {
      this.formScreenEdit.validateFields((err, values) => {
        if (!err) {
          this.deviceScreenSaveInfo(values);
        }
      });
    },
    async deviceScreenSaveInfo(values) {
      let res = await api.deviceSaveScreenInfo(values).catch(err => {
        console.log(err);
      });
      if (res.code != 200) {
        this.$message.warning(res.msg);
        return;
      }
      this.$message.success("信息修改成功");
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
  .ant-input-disabled {
    background-color: transparent;
    color: #ddfdff;
    border-color: transparent;
  }
  .ant-form-item {
    margin-bottom: 10px;
  }
}
</style>
