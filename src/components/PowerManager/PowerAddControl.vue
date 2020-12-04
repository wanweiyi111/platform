<template>
  <div class="add-control">
    <a-modal
      class="application_modal"
      :centered="true"
      :title="modelTitle"
      :visible="visible"
      @cancel="handleCancel"
      okText='确定'
      cancelText='取消'
    >
      <a-form :form="formAddControl">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              label="名称"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                maxlength="64"
                v-decorator="['permissionName',{rules: [{ required: true, message: '请输入权限名称' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="URL地址"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                maxlength="64"
                v-decorator="['perms',{rules: [{ required: true, message: '请输入URL地址' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
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
        >保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import _ from "lodash";
import PowerManager from "@/api/PowerManager";

const power = new PowerManager();
export default {
  components: {},
  props: {
    visible: Boolean,
    showModel: Function,
    modelTitle: String,
  },
  data() {
    return {
      formAddControl: this.$form.createForm(this),
      isEdit: false,
      record: {},
    };
  },
  mounted() {
    this.$bus.on("initFormAddControl", (record, isEdit) => {
      this.isEdit = isEdit;
      this.record = record;
      this.initFormAddControl(record, isEdit);
    });
  },
  methods: {
    // 编辑用户填充表单
    initFormAddControl(record, isEdit) {
      if (isEdit) {
        this.$nextTick(() => {
          this.formAddControl.setFieldsValue({
            permissionName: record.permissionName,
            perms: record.perms,
          });
        });
      }
    },
    // 关闭对话框
    handleCancel() {
      this.formAddControl.resetFields();
      this.isEdit = false;
      this.showModel();
    },
    // 新建/编辑权限后更新列表数据
    loadPowerControlList() {
      this.$bus.emit("loadPowerControlList");
    },
    // 确认新建/编辑权限
    handleSave(e) {
      e.preventDefault();
      this.formAddControl.validateFields((err, values) => {
        if (!err) {
          if (this.isEdit) {
            this.powerControlUpdate(values);
          } else {
            this.powerControlAdd(values);
          }
        }
      });
    },
    // 新建控制权限
    async powerControlAdd(values) {
      values["parentId"] = this.record.parentId;
      values["type"] = this.record.type;
      let res = await power.powerColumnAddPermission(values).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.data.code !== "200") {
        this.$message.warning(res.data.message || "权限新建失败");
        return;
      }
      this.$message.success("权限新建成功");
      this.$emit("getControlAdd", res.data);
      this.handleCancel();
      
    },
    // 编辑控制权限
    async powerControlUpdate(values) {
      values["id"] = this.record.id;
      values["parentId"] = this.record.parentId;
      values["type"] = this.record.type;
      let res = await power.powerColumnUpdateMenu(values).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.data.code !== "200") {
        this.$message.warning(res.data.message || "权限修改成功");
        return;
      }
      this.$message.success("权限修改成功");
      this.$emit("getControlAdd", res.data);
      this.handleCancel();
      
    },
  },
};
</script>