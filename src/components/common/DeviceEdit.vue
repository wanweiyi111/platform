<template>
  <CtrlPanel :split-line="true" :class="['light-edit-box', {view: !isEdit, edit: isEdit}]">
    <dt slot="title">
      {{model.equipmentName}}
      <span class="font12 white2">编号{{model.equipmentCode}}</span>
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
          <span class="ant-form-text">{{model.equipmentTypeText}}</span>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="控制器类型">
          <span class="ant-form-text">{{model.controllerType}}</span>
        </a-form-item>       
        <a-form-item v-bind="formItemLayout" label="资源名称">
          <a-input
            v-decorator="['equipmentName', { initialValue: model.equipmentName }]"
            size="small"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="经度">
          <a-input v-decorator="['longitude', { initialValue: model.longitude }]" size="small" />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="纬度">
          <a-input v-decorator="['latitude', { initialValue: model.latitude }]" size="small" />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="设备ID">
          <a-input v-decorator="['deviceId', { initialValue: model.deviceId }]" size="small" />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="设备IP">
          <a-input v-decorator="['equipmentIp', { initialValue: model.equipmentIp }]" size="small" />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="摄像头参数" v-if="model.equipmentType===4128">
          <a-textarea v-decorator="['otherParameters', { initialValue: model.otherParameters }]" size="small" placeholder="请输入摄像头参数"/>
        </a-form-item>
      </a-form>
    </dd>
    <dd slot="content" class="pd-x15" style="line-height:1.8" v-else>
      <DeviceDetail :model="model" :type="type" :showMoreLight="showMoreLight"></DeviceDetail>
    </dd>
  </CtrlPanel>
</template>

<script>
import CtrlPanel from "@/components/CtrlPanel.vue";
import DeviceDetail from "@/components/common/DeviceDetail.vue";
import utils from "@/utils";
import Api from "@/api";
import Camera from "@/api/Camera.js";
import Display from "@/api/Display.js";
import Environment from "@/api/Environment.js";
import Radar from "@/api/Radar";

const api = new Api();
const camera = new Camera();
const display = new Display();
const environment = new Environment();
const radar = new Radar();

const MapEntity = {
  light: api,
  camera: camera,
  display: display,
  environment: environment,
  radar
};
const SaveFunc = {
  light: "updateLightInfo",
  camera: "updateCameraInfos",
  display: "updateScreenInfos",
  environment: "updateInfos",
  radar: "updateInfos"
};

export default {
  name: "DeviceEdit",
  props: {
    model: {
      required: true,
      type: Object
    },
    edit: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "light"
    },
    showMoreLight: Boolean
  },
  components: {
    CtrlPanel,
    DeviceDetail
  },
  created() {
    this.setEditProps();
  },
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      },
      isEdit: this.edit
    };
  },
  watch: {
    model(newVal) {
      this.setEditProps();
    }
  },
  methods: {
    setEditProps() {
      this.model.equipmentTypeText = utils.getEquipmentTypeText(
        this.model.equipmentType
      );
    },
    startEdit() {
      this.isEdit = true;
    },
    save() {
      try {
        this.form.validateFields(async (err, fieldsValue) => {
          if (err) {
            return;
          }
          fieldsValue.id = this.model.id;
          const res = await MapEntity[this.type][SaveFunc[this.type]]({
            list: [fieldsValue]
          });
          if (res.code == "200") {
            this.$message.success("保存成功");
            this.isEdit = false;
            this.model = Object.assign(this.model, fieldsValue);
            this.$bus.emit("updateComplete", this.type);
          } else {
            this.$message.error(res.msg);
          }
        });
      } catch (err) {
        console.warn(err);
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
   /* &.view {
     height: 263px;
  } */
  &.edit {
    height: 415px;
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
