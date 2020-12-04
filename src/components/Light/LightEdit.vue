<template>
  <CtrlPanel :split-line="true" :class="['light-edit-box', {view: !isEdit, edit: isEdit}]">
    <dt slot="title">
      {{curDevice.equipmentName}}
      <span class="font12 white2">编号{{curDevice.equipmentCode}}</span>
      <div class="fr clearfix" v-if="isEdit">
        <a-button type="primary" icon="save" size="small" @click="save" class="mr5">保存</a-button>
        <a-button size="small" @click="cancel">取消</a-button>
      </div>
      <div class="fr clearfix" v-else>
        <a-button icon="edit" size="small" @click="startEdit">编辑</a-button>
      </div>
    </dt>
    <dd slot="content" class="pd-x15" v-if="isEdit">
      <a-form id="editForm" :form="form">
        <a-form-item v-bind="formItemLayout" label="设备类型">
          <span class="ant-form-text">灯控</span>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="控制器类型">
          <span class="ant-form-text">单灯控制器</span>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="资源名称">
          <a-input
            v-decorator="['equipmentName', { initialValue: curDevice.equipmentName }]"
            size="small"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="经度">
          <a-input v-decorator="['longitude', { initialValue: curDevice.longitude }]" size="small" />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="纬度">
          <a-input v-decorator="['latitude', { initialValue: curDevice.latitude }]" size="small" />
        </a-form-item>
      </a-form>
    </dd>
    <dd slot="content" class="pd-x15" style="line-height:1.8" v-else>
      <DeviceDetail :model="curDevice"></DeviceDetail>
      <!-- <a-row class="gray">
        <a-col>基本信息</a-col>
      </a-row>
      <a-row :gutter="8" class="gray">
        <a-col :span="6" class="ar">所属分组</a-col>
        <a-col :span="6" class="al">{{curDevice.groupName}}</a-col>
        <a-col :span="6" class="ar">联网状态</a-col>
        <a-col :span="6" class="al">{{curDevice.networkState | formatNetworkState}}</a-col>
      </a-row>
      <a-row :gutter="8" class="gray">
        <a-col :span="6" class="ar">归属智慧杆</a-col>
        <a-col :span="6" class="al">{{curDevice.poleName}}</a-col>
        <a-col :span="6" class="ar">工作状态</a-col>
        <a-col :span="6" class="al">{{mapStatus[curDevice.equipmentStatus]}}</a-col>
      </a-row>
      <a-row :gutter="8" class="gray">
        <a-col :span="6" class="ar">所属集中器</a-col>
        <a-col :span="6" class="al">{{curDevice.gatewayInformation}}</a-col>
        <a-col :span="6" class="ar">安装位置</a-col>
        <a-col :span="6" class="al">{{curDevice.location}}</a-col>
      </a-row>
      <a-row class="gray">
        <a-col>规格参数</a-col>
      </a-row>
      <a-row :gutter="8" class="gray">
        <a-col :span="6" class="ar">电流</a-col>
        <a-col :span="6" class="al">{{curDevice.current}}</a-col>
        <a-col :span="6" class="ar">电压</a-col>
        <a-col :span="6" class="al">{{curDevice.voltage}}</a-col>
      </a-row>
      <a-row :gutter="8" class="gray">
        <a-col :span="6" class="ar">总电量</a-col>
        <a-col :span="6" class="al">{{curDevice.current}}</a-col>
        <a-col :span="6" class="ar">亮度</a-col>
        <a-col :span="6" class="al">{{curDevice.luminance}}</a-col>
      </a-row>
      <a-row :gutter="8" class="gray">
        <a-col :span="6" class="ar">有功功率(w)</a-col>
        <a-col :span="6" class="al">{{curDevice.activePower}}</a-col>
        <a-col :span="6" class="ar">无功功率(Var)</a-col>
        <a-col :span="6" class="al">{{curDevice.reactivePower}}</a-col>
      </a-row>
      <a-row :gutter="8" class="gray">
        <a-col :span="6" class="ar">功率因数</a-col>
        <a-col :span="6" class="al">{{curDevice.powerFactor}}</a-col>
        <a-col :span="6" class="ar">有功电能(kW-h)</a-col>
        <a-col :span="6" class="al">{{curDevice.activeElectricEnergy}}</a-col>
      </a-row>
      <a-row :gutter="8" class="gray">
        <a-col :span="6" class="ar">无功电能(kW-h)</a-col>
        <a-col :span="6" class="al">{{curDevice.reactiveElectricEnergy}}</a-col>
        <a-col :span="6" class="ar">视在电能(kW-h)</a-col>
        <a-col :span="6" class="al">{{curDevice.apparentpowerElectricEnergy}}</a-col>
      </a-row>
      <a-row :gutter="8" class="gray">
        <a-col :span="6" class="ar">运行时间(h)</a-col>
        <a-col :span="6" class="al">{{curDevice.runDuration}}</a-col>
        <a-col :span="6" class="ar">频率(Hz)</a-col>
        <a-col :span="6" class="al">{{curDevice.frequency}}</a-col>
      </a-row>
      <a-row :gutter="8" class="gray">
        <a-col :span="6" class="ar">温度(°C)</a-col>
        <a-col :span="6" class="al">{{curDevice.temperature}}</a-col>
      </a-row>-->
    </dd>
  </CtrlPanel>
</template>

<script>
import utils from "@/utils/";
import CtrlPanel from "@/components/CtrlPanel.vue";
import DeviceDetail from "@/components/common/DeviceDetail.vue";
import Api from "@/api";

const api = new Api();

export default {
  name: "LightEdit",
  props: {
    model: {
      required: true,
      type: Object
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CtrlPanel,
    DeviceDetail
  },
  created() {},
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      },
      curDevice: JSON.parse(JSON.stringify(this.model)),
      isEdit: this.edit,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      mapStatus: {
        "0": "开启",
        "1": "关闭",
        "2": "故障"
      }
    };
  },
  filters: {
    formatNetworkState(networkState) {
      return utils.getNetworkStateText(networkState);
    }
  },
  methods: {
    startEdit() {
      this.isEdit = true;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
    },
    async save() {
      const res = await api.addLight(this.curDevice);
      if (res.code == "200") {
        this.$message.success("保存成功");
        this.isEdit = false;
      } else {
        this.$message.error(res.msg);
      }
    },
    cancel() {
      this.isEdit = false;
    }
  }
};
</script>

<style lang="less">
.light-edit-box {
  position: absolute;
  bottom: 0;
  &.view {
    height: 350px;
  }
  &.edit {
    height: 468px;
  }
}
#editForm {
  .ant-form-item {
    margin-bottom: 3px;
    line-height: 2;
    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 2;
    }
    .ant-form-item-control-wrapper {
      .ant-input {
        border: 1px solid #93afcf;
        border-radius: 3px;
        border-radius: 3px;
      }
    }
  }
}
</style>
