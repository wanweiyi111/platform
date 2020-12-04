<template>
  <!-- 信息发布分组给组添加大屏 -->
  <div class="group-add-screen">
    <a-modal
      title="屏幕信息"
      class="application_modal"
      :centered="true"
      :visible="visible"
      @cancel="cancelGroupAddScreen"
      okText='确定'
      cancelText='取消'
    >
      <a-form :form="formGroupAddScreen">
        <a-form-item
          label="大屏"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-select
            mode="multiple"
            v-decorator="[
          'list',
          {rules: [{ required: true, message: '请选择屏幕!' }]}
        ]"
          >
            <a-select-option
              v-for="item in withoutScreenList"
              :key="item.id"
              :value="item.id"
            >{{item.equipmentName}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button
          key="back"
          @click="cancelGroupAddScreen"
        >取消</a-button>
        <a-button
          key="submit"
          type="primary"
          @click="handleGroupAddScreen"
        >确认</a-button>
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
  },
  data() {
    return {
      formGroupAddScreen: this.$form.createForm(this),
      withoutScreenList: [],
      groupId: "",
    };
  },

  created() {
    this.$bus.on("currentGroupAddScreen", (record) => {
      this.groupId = record.id || record.groupId;
    });

    this.$bus.on("displayGetWithoutGroupScreen", () => {
      this.displayGetWithoutGroupScreen();
    });
  },

  methods: {
    // 信息发布--分组获取没有分组的屏幕信息
    async displayGetWithoutGroupScreen() {
      let res = await display
        .screenListWithoutGroupScreen({ projectId: this.projectId })
        .catch((err) => {
          console.log(err);
        });

      if (_.isEmpty(res) || res.code != 200) {
        return;
      }
      this.withoutScreenList = res.data;
    },
    // 信息发布--分组给分组添加屏幕
    handleGroupAddScreen(e) {
      e.preventDefault();
      this.formGroupAddScreen.validateFields((err, values) => {
        if (!err) {
          let obj = Object.assign({ groupId: [this.groupId] }, values);
          this.screenGroupAddscreen(obj);
        }
      });
    },
    // 分组添加新屏幕
    async screenGroupAddscreen(values) {
      values.projectId = this.projectId;
      let res = await display.screenGroupGlAdd(values).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning(res.msg);
        return;
      }

      this.$message.success("屏幕添加成功");
      this.$bus.emit("loadQueryListGroup");
      this.cancelGroupAddScreen();
    },

    // 隐藏分组添加屏幕信息对话框
    cancelGroupAddScreen() {
      this.formGroupAddScreen.resetFields();
      this.$bus.emit("showModelGroupAddScreen");
    },
  },
};
</script>