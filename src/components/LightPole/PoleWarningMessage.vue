<template>
  <!-- 设备故障 -->
  <div class="failureMessage">
    <a-modal okText='确定' cancelText='取消' title="告警信息" :centered="true" :visible="visible" :width="1100" @cancel="handleCancel">
      <a-form :form="formPoleWarning">
        <a-collapse :defaultActiveKey="collapseActiveKey" @change="changeActivekey">
          <a-collapse-panel
            v-for="(k, i) in formPoleWarning.getFieldValue('keys')"
            :key="(k+1)+''"
            :header="'故障问题'+(k+1)"
          >
            <a-row>
              <a-col :span="24">
                <a-table
                  :columns="columns"
                  :rowKey="record => record.exceptionId"
                  :dataSource="clearFailureMessage(i)"
                  :pagination="false"
                ></a-table>
              </a-col>
            </a-row>
            <a-row style="color:#8AD3FF;">维修信息</a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="当前处理人" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                  <a-input maxlength="10" v-decorator="[`currentHandler[${i}]`]"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="处理时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                  <a-date-picker
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="选择时间"
                    style="width:100%"
                    v-decorator="[`resolutionTime[${i}]`]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="处理状态" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                  <a-tree-select
                    v-decorator="[`faultStatus[${i}]`]"
                    :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                    :treeData="treeData"
                  ></a-tree-select>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="处理描述" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
                  <a-input maxlength="10" v-decorator="[`solutionDescription[${i}]`]"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-collapse-panel>
        </a-collapse>
      </a-form>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" @click="handleSave">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import Pole from "@/api/Pole.js";
const pole = new Pole();
// 信息发布分组colums数据
const columns = [
  {
    title: "资源名称",
    dataIndex: "equipmentName"
  },
  {
    title: "设备型号",
    dataIndex: "equipmentModel"
  },
  {
    title: "告警类型",
    dataIndex: "faultType"
  },
  {
    title: "告警时间",
    dataIndex: "occurrenceTime"
  },
  {
    title: "告警描述",
    dataIndex: "faultDescription"
  },
  {
    title: "告警状态",
    dataIndex: "equipmentStatus"
  },
  {
    title: "持续时长",
    dataIndex: "duringTimeText"
  },
  {
    title: "处理状态",
    dataIndex: "faultStatus"
  }
];
const treeData = [
  {
    title: "未解决",
    value: "0",
    key: "0"
  },
  {
    title: "已解决",
    value: "1",
    key: "1"
  }
];

export default {
  props: {
    from: String,
    visible: Boolean,
    warningMessage: Array
  },
  data() {
    return {
      keys: 0,
      columns,
      treeData,
      dataList: [],
      collapseActiveKey: []
    };
  },
  beforeCreate() {
    this.formPoleWarning = this.$form.createForm(this);
    this.formPoleWarning.getFieldDecorator("keys", {
      initialValue: [0],
      preserve: true
    });
  },
  created() {
    this.initFormPoleWarning();
    this.collapseActiveKey = this.warningMessage.map((item, index) => {
      return index + 1 + "";
    });
  },

  methods: {
    moment,
    // 初始化故障信息表单
    initFormPoleWarning() {
      const { formPoleWarning } = this;
      let data = this.warningMessage;
      let arr = data && data.map((val, index) => index);
      const keys = formPoleWarning.getFieldValue("keys");
      const nextKeys = [...new Set([...arr, ...keys])];
      this.keys = nextKeys[nextKeys.length - 1];
      setTimeout(() => {
        formPoleWarning.setFieldsValue({
          keys: nextKeys
        });
      }, 0);

      let currentHandlerList = [];
      let resolutionTimeList = [];
      let faultStatusList = [];
      let solutionDescriptionList = [];
      data.forEach(_ => {
        currentHandlerList.push(_["currentHandler"]);
        resolutionTimeList.push(this.clearResolutionTime(_["resolutionTime"]));
        faultStatusList.push(_["faultStatus"]);
        solutionDescriptionList.push(_["solutionDescription"]);
      });
      setTimeout(() => {
        formPoleWarning.setFieldsValue({
          currentHandler: currentHandlerList,
          resolutionTime: resolutionTimeList,
          faultStatus: faultStatusList,
          solutionDescription: solutionDescriptionList
        });
      }, 0);
    },
    changeActivekey() {
      this.initFormPoleWarning();
    },
    clearFailureMessage(item) {
      return [this.warningMessage[item]];
    },
    clearResolutionTime(resolutionTime) {
      let date = "";
      if (resolutionTime) {
        date = moment(resolutionTime, "YYYY-MM-DD HH:mm:ss");
      } else {
        date = moment(new Date(), "YYYY-MM-DD HH:mm:ss");
      }
      return date;
    },

    // 关闭告警信息对话框
    handleCancel() {
      this.formPoleWarning.resetFields();
      this.$bus.emit("showWarningMessage");
    },
    // 更新告警信息
    handleSave(e) {
      e.preventDefault();
      this.formPoleWarning.validateFields((err, values) => {
        if (!err) {
          this.poleUpdateAlarmMsg(values);
        }
      });
    },
    async poleUpdateAlarmMsg(values) {
      let data = this.clearFormData(values);
      let res = await pole.updateAlarmMsg(data).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning(res.msg);
        return;
      }
      this.$message.success("告警信息修改成功");
      this.handleCancel();
      this.$bus.emit("getPoleInfo");
    },
    clearFormData(values) {
      const { formPoleWarning } = this;
      const keys = formPoleWarning.getFieldValue("keys");
      let data = [];
      for (let i = 0; i < keys.length; i++) {
        data.push({
          exceptionId: this.warningMessage[i].exceptionId,
          currentHandler: values["currentHandler"][i],
          solutionDescription: values["solutionDescription"][i],
          faultStatus: values["faultStatus"][i],
          resolutionTime: values["resolutionTime"][i]
        });
      }
      return data;
    }
  }
};
</script>
