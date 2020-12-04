<template>
  <!-- 新建/编辑分组 -->
  <div class="add-group">
    <a-modal
      class="application_modal"
      :title="modalTitle"
      :centered="true"
      :visible="visible"
      @cancel="handleCancel"
      okText='确定'
      cancelText='取消'
    >
      <a-form :form="formAddGroup">
        <a-form-item
          label="组名"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input v-decorator="[
          'groupName',
          {rules: [{ required: true, message: '请输入组名!' }]}
        ]" />
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
          @click="handleAddGroup"
        >{{isEdit?"确定":"下一步"}}</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import _ from "lodash";
import Display from "@/api/Display";
import baseMixin from "@/mixins/base.js";

const display = new Display();
export default {
  mixins: [baseMixin],
  props: {
    visible: Boolean,
    modalTitle: String,
  },
  data() {
    return {
      formAddGroup: this.$form.createForm(this),
      isEdit: false,
      id: "",
    };
  },
  mounted() {
    this.$bus.on("initFormAddGroup", (record, isEdit) => {
      this.isEdit = isEdit;
      this.id = record.id;
      this.initFormAddGroup(record, isEdit);
    });
  },
  methods: {
    // 编辑用户填充表单
    initFormAddGroup(record, isEdit) {
      if (isEdit) {
        setTimeout(() => {
          this.formAddGroup.setFieldsValue({
            groupName: record.resourceName,
          });
        }, 0);
      }
    },

    // 隐藏新增分组对话框
    handleCancel() {
      this.formAddGroup.resetFields();
      this.isEdit = false;
      this.$bus.emit("showModalAddGroup", this.isEdit);
    },

    // 新建/编辑分组
    handleAddGroup(e) {
      e.preventDefault();
      this.formAddGroup.validateFields((err, values) => {
        if (!err) {
          if (this.isEdit) {
            let modifiedData = {};
            modifiedData["groupId"] = this.id;
            modifiedData["groupName"] = values["groupName"];
            this.displayGroupModified(modifiedData);
          } else {
            this.displayGroupAddGroup(values);
          }
        }
      });
    },
    // 信息发布分组新建分组
    async displayGroupAddGroup(formData) {
      formData.projectId = this.projectId;
      let res = await display.screenGroupAdd(formData).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning(res.msg);
        return;
      }
      // this.$message.success("分组新建成功");
      this.$bus.emit("loadQueryListGroup");
      this.handleCancel();
      // 下一步
      const IS_SHOW = true;
      this.$bus.emit("showModelGroupAddScreen", IS_SHOW);
      this.$bus.emit("currentGroupAddScreen", res.data);
    },
    // 信息发布分组根据ID修改分组信息
    async displayGroupModified(modifiedData) {
      let res = await display.screenGroupModify(modifiedData).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning("修改失败！");
        return;
      }
      this.$message.success("修改成功");
      this.$bus.emit("loadQueryListGroup");
      this.handleCancel();
    },
  },
};
</script>