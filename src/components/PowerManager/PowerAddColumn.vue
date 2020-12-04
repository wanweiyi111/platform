<template>
  <!-- 新建/编辑栏目 -->
  <div class="add-programa">
    <a-modal
      class="application_modal"
      :centered="true"
      :title="modelTitle"
      :visible="visible"
      @cancel="handleCancel"
      okText='确定'
      cancelText='取消'
    >
      <a-form :form="formColumn">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              label="栏目名称"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                maxlength="10"
                v-decorator="['permissionName',{rules: [{ required: true, message: '请输入栏目名称' }]}]"
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
                maxlength="32"
                v-decorator="['path']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="ICON"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                maxlength="32"
                v-decorator="['icon']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="上级页面"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-tree-select
                dropdownClassName="application_dropdown"
                v-decorator="['parentId']"
                :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                :treeData="treeData"
              ></a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="排序"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                maxlength="4"
                v-decorator="['orderNum']"
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
      formColumn: this.$form.createForm(this),
      isEdit: false,
      id: "",
      treeData: [], //上级页面树形结构数据
    };
  },
  mounted() {
    this.$bus.on("initFormColumn", (record, isEdit) => {
      this.isEdit = isEdit;
      this.id = record.id;
      this.initFormColumn(record, isEdit);
    });
    this.powerMenuQueryList();
    // this.$bus.on("powerMenuQueryList", () => {
    //   this.powerMenuQueryList();
    // });
  },

  methods: {
    // 获取上级页面数据
    async powerMenuQueryList() {
      let res = await power.powerColumnQueryTreeList().catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning(res.data.message);
        return;
      }
      let data = res.data.rows;
      this.treeData = this.clearTreeData(data);
    },
    // 数据整理
    clearTreeData(data) {
      let newData = [];
      for (let i = 0; i < data.length; i++) {
        newData.push({
          title: data[i].menuName,
          value: data[i].id + "",
          key: data[i].id,
        });
        if (data[i].children && data[i].children.length !== 0) {
          var oChild = data[i].children;
          newData[i]["children"] = this.clearTreeData(oChild);
        }
      }
      return newData;
    },
    // 编辑栏目表单初始化
    initFormColumn(record, isEdit) {
      if (isEdit) {
        this.$nextTick(() => {
          this.formColumn.setFieldsValue({
            permissionName: record.permissionName,
            path: record.path,
            parentId: [record.parentId],
            icon: record.icon,
            orderNum: record.orderNum,
          });
        });
      }
    },
    // 关闭对话框
    handleCancel() {
      this.formColumn.resetFields();
      this.isEdit = false;
      this.showModel();
    },
    // 新建/编辑栏目后更新列表数据
    loadPowerColumnList() {
      this.$bus.emit("loadPowerColumnList");
    },
    // 确认新建/编辑栏目
    handleSave(e) {
      e.preventDefault();
      this.formColumn.validateFields((err, values) => {
        if (!err) {
          if (this.isEdit) {
            this.powerColumnUpdate(values);
          } else {
            this.powerColumnAdd(values);
          }
        }
      });
    },
    // 新建栏目
    async powerColumnAdd(values) {
      values["type"] = 0;
      let res = await power.powerColumnAddPermission(values).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.data.code !== "200") {
        this.$message.warning(res.data.message || "栏目信息新建失败");
        return;
      }
      this.$message.success("栏目新增成功");
      this.handleCancel();
      this.loadPowerColumnList();
    },

    // 编辑修改栏目
    async powerColumnUpdate(values) {
      values["type"] = 0;
      values["id"] = this.id;
      // values["parentId"] = values["parentId"][0];
      let res = await power.powerColumnUpdateMenu(values).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.data.code !== "200") {
        this.$message.warning(res.data.message || "栏目信息修改失败");
        return;
      }
      this.$message.success("栏目信息修改成功");
      this.handleCancel();
      this.loadPowerColumnList();
    },
  },
};
</script>
