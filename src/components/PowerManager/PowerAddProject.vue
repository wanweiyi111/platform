<template>
  <div class="add-project">
    <a-modal
      class="application_modal"
      :centered="true"
      :title="modelTitle"
      :visible="visible"
      @cancel="handleCancel"
      okText='确定'
      cancelText='取消'
    >
      <a-form :form="formProject">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              label="项目名称"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                maxlength="10"
                v-decorator="['projectName',{rules: [{ required: true, message: '请输入项目名称' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="城市"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                maxlength="10"
                v-decorator="['city',{rules: [{ required: true, message: '请输入城市' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="区"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                maxlength="11"
                v-decorator="['district',{rules: [{ required: true, message: '请输入区' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="街道"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                maxlength="10"
                v-decorator="['street',{rules: [{ required: true, message: '请输入街道' }]}]"
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
      formProject: this.$form.createForm(this),
      isEdit: false,
      id: "",
    };
  },
  mounted() {
    this.$bus.on("initFormProject", (record, isEdit) => {
      this.isEdit = isEdit;
      this.id = record.id;
      this.initFormProject(record, isEdit);
    });
  },
  created() {},
  methods: {
    // 编辑用户填充表单
    initFormProject(record, isEdit) {
      if (isEdit) {
        this.$nextTick(() => {
          this.formProject.setFieldsValue({
            projectName: record.projectName,
            city: record.city,
            district: record.district,
            street: record.street,
          });
        });
      }
    },
    // 关闭对话框
    handleCancel() {
      this.formProject.resetFields();
      this.isEdit = false;
      this.showModel();
    },
    // 新建/编辑用户后更新列表数据
    loadPowerProjectList() {
      this.$bus.emit("loadPowerProjectList");
    },
    // 确认新建/编辑用户
    handleSave(e) {
      e.preventDefault();
      this.formProject.validateFields((err, values) => {
        if (!err) {
          if (this.isEdit) {
            this.powerProjectUpdate(values);
          } else {
            this.powerProjectAdd(values);
          }
        }
      });
    },
    // 新建项目
    async powerProjectAdd(values) {
      let res = await power.powerProjectAddProject(values).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.data.code !== "200") {
        this.$message.warning(res.data.message);
        return;
      }
      this.$message.success("项目新增成功");
      this.$emit("getProjectAdd", res.data);
      this.handleCancel();
      // this.loadPowerProjectList();
    },
    // 编辑修改项目
    async powerProjectUpdate(values) {
      // let data = this.clearFormData(values);
      values["id"] = this.id;
      let res = await power.powerProjectUpdateProject(values).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.data.code !== "200") {
        this.$message.warning(res.data.message);
        return;
      }
      this.$message.success("项目信息修改成功");
      this.$emit("getProjectAdd", res.data);
      this.handleCancel();
      // this.loadPowerProjectList();
    },
  },
};
</script>