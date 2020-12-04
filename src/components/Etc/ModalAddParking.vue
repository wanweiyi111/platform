<template>
  <a-modal
    class="application_modal"
    :centered="true"
    :title="id?'编辑车位':'新建车位'"
    :visible="visible"
    :maskClosable="false"
    :closable="false"
    :keyboard="false"
    @cancel="handleCancel"
    okText='确定'
    cancelText='取消'
    v-if="visible"
  >
    <a-form :form="formProject">
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item
            label="车位编号"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-input
              maxlength="10"
              v-decorator="['parkingCode',{rules: [{ required: true, message: '请输入车位编号' }]}]"
              placeholder="请输入车位编号"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="车位描述"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-input
              maxlength="10"
              v-decorator="['parkingDesc',{rules: [{ required: true, message: '请输入车位描述' }]}]"
              placeholder="请输入车位描述"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col
          :span="24"
          v-if="!id"
        >
          <a-form-item
            label="车位地区"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <area-cascader
              :level="1"
              type="text"
              placeholder="请选择地区"
              :data="pcaa"
              v-decorator="['parkingRegion',{rules: [{ required: true, message: '请选择车位地区' }]}]"
              @change="areaChange"
            ></area-cascader>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="详细地址"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-input
              v-decorator="['parkingAddress',{rules: [{ required: true, message: '请输入详细地址' }]}]"
              placeholder="请输入详细地址"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="经度"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-input
              maxlength="11"
              v-decorator="['longitude',{rules: [{ required: true, message: '请输入经度' }]}]"
              placeholder="请输入经度"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="纬度"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-input
              maxlength="10"
              v-decorator="['latitude',{rules: [{ required: true, message: '请输入纬度' }]}]"
              placeholder="请输入纬度"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item
        label="监控摄像头"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-select
          dropdownClassName="application_dropdown"
          v-decorator="[
          'cameraEquipmentCode',
          { rules: [{ required: true, message: '请选择监控摄像头' }] },
        ]"
          placeholder="请选择监控摄像头"
        >
          <a-select-option
            v-for="item in camerList"
            :key="item.value"
            :value="item.value"
          >
            {{item.name}}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >取消</a-button>
      <a-button
        key="submit"
        type="primary"
        @click="handleSave"
      >{{id?'更新':'保存'}}</a-button>
    </template>
  </a-modal>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import { pcaa } from "area-data";
import "vue-area-linkage/dist/index.css";
import Camera from "@/api/Camera";
import Etc from "@/api/Etc";
const cameraApi = new Camera();
const etcApi = new Etc();
export default {
  mixins: [baseMixin],
  props: {
    visible: Boolean,
  },
  data() {
    return {
      formProject: this.$form.createForm(this),
      isEdit: false,
      id: "",
      camerList: [], // 监控列表
      areaRegion: [], // 地区
      areaText: "",
      pcaa: pcaa, // 地区数据
      parkingInfo: {}, //车位信息
    };
  },
  mounted() {
    this.$bus.on("initFormProject", (record) => {
      this.id = record.id;
      this.parkingInfo = record;
      this.initFormProject(record);
    });
  },
  created() {
    this.loadCamerList();
  },
  methods: {
    // 地区选择
    areaChange(val) {
      let value = val;
      let valueString = value.join("");
      this.areaText = valueString;
      this.formProject.setFieldsValue({
        parkingAddress: valueString,
      });
    },
    // 编辑用户填充表单
    initFormProject(record) {
      this.$nextTick(() => {
        this.formProject.setFieldsValue({
          cameraEquipmentCode: record.cameraEquipmentCode,
          parkingCode: record.parkingCode,
          parkingDesc: record.parkingDesc,
          parkingAddress: record.parkingAddress,
          longitude: record.longitude,
          latitude: record.latitude,
        });
      });
    },
    // 关闭对话框
    handleCancel() {
      this.formProject.resetFields();
      this.isEdit = false;
      this.$emit("returnVisibleStatus", false);
    },

    // 新建/编辑用户后更新列表数据
    loadParkingList(val) {
      this.$emit("returnAddParking", val);
    },
    // 确认新建/编辑用户
    handleSave(e) {
      e.preventDefault();
      this.formProject.validateFields((err, values) => {
        if (!err) {
          if (this.id) {
            this.loadUpdataParking(values);
          } else {
            this.loadAddParking(values);
          }
          this.handleCancel();
        }
      });
    },
    // 新增车位
    async loadAddParking(param) {
      let res = await etcApi.saveInfo(param).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning(res.msg);
        return;
      }
      this.$message.success("车位新增成功");
      this.loadParkingList(res.data);
    },
    // 编辑车位
    async loadUpdataParking(param) {
      param.id = this.id;
      let arrParam = [];
      arrParam.push(param);
      let res = await etcApi.updateInfos(arrParam).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning(res.msg);
        return;
      }
      this.$message.success("车位更新成功");
      this.loadParkingList(res.data);
    },
    // 获取监控列表
    async loadCamerList() {
      let res = await cameraApi
        .findByCameraList({ projectId: this.projectId })
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning(res.data.message);
        return;
      }
      let list = res.data;
      let camerList = [];
      if (list) {
        list.map((item) => {
          camerList.push({
            value: item.equipmentCode,
            name: item.poleName + "-" + item.equipmentName,
          });
        });
      }
      this.camerList = camerList;
    },
  },
};
</script>
<style lang="less">
.area-select {
  color: #bacee4;
  border-radius: 2px;
  border-color: #93afcf;
  background-color: transparent;
  &.large {
    width: 100%;
    line-height: 15px;
  }
}
</style>