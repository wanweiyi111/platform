<template>
  <div class="manage-con">
    <a-row>
      <a-col :span="24">
        <Breadcrumb :modifyTitle="modelTitle" />
        <router-link
          class="fr font14 white1"
          to="/application-manage/light?tabKey=3"
          :style="{marginTop: '-23px',marginBottom: '10px'}"
        >
          <a-icon type="rollback" /> 返回任务列表
        </router-link>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <div
          class="application_from lightTask_from"
          :style="{height:fullHeight-195 + 'px'}"
        >
          <a-row>
            <a-col :span="24">
              <a-form :form="lightAddTask">
                <div class="form-title">基本模板
                </div>
                <a-row :gutter="24">
                  <a-col :span="8">
                    <a-form-item
                      label="计划名称:"
                      :label-col="{ span: 8 }"
                      :wrapper-col="{ span: 16 }"
                    >
                      <a-input
                        :maxLength="30"
                        v-decorator="[
                        'taskName',
                        {
                          rules: [{ required: true, message: '请输入计划名称' }]
                        }
                      ]"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      label="时间段:"
                      :label-col="{ span: 8 }"
                      :wrapper-col="{ span: 16 }"
                    >
                      <a-range-picker
                        format="YYYY/MM/DD"
                        :placeholder="['开始时间', '结束时间']"
                        style="width:100%"
                        v-decorator="[
                        'dateRange',
                        { rules: [{ required: true, message: '请选择时间点' }] }
                      ]"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      label="是否有效:"
                      :label-col="{ span: 8 }"
                      :wrapper-col="{ span: 16 }"
                    >
                      <a-switch
                        checkedChildren="是"
                        unCheckedChildren="否"
                        v-model="defaultStatusCode"
                        v-decorator="['statusCode',{ initialValue: false }]"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>

                <div class="form-title">规则条件
                </div>
                <a-row
                  :gutter="24"
                  v-for="(k) in lightAddTask.getFieldValue('keys')"
                  :key="k"
                >
                  <a-col :span="8">
                    <a-form-item
                      label="触发条件:"
                      :label-col="{ span: 8 }"
                      :wrapper-col="{ span: 16 }"
                    >
                      <a-tree-select
                        dropdownClassName="application_dropdown"
                        v-decorator="[`taskType[${k}]`, {rules: [{ required: true, message: '请选择触发条件' }]}]"
                        :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                        :treeData="taskTypeList"
                        @change="handleSelectChange"
                      ></a-tree-select>
                    </a-form-item>
                  </a-col>
                  <a-col
                    :span="8"
                    v-if="selectType"
                  >
                    <a-form-item
                      label="智慧杆列表:"
                      :label-col="{ span: 8 }"
                      :wrapper-col="{ span: 16 }"
                    >
                      <a-select
                        dropdownClassName="application_dropdown"
                        v-decorator="[`taskDevice[${k}]`,{rules: [{ required: true, message: '请选择触发智慧杆' }]}]"
                      >
                        <a-select-option
                          v-for="(item, index) in LightCodeList"
                          v-bind:key="index"
                          :value="item.lightCode"
                          :defaultValue="[`taskDevice[${k}]`]"
                        >{{ item.poleName }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      label="时间点:"
                      :label-col="{ span: 8 }"
                      :wrapper-col="{ span: 16 }"
                    >
                      <a-time-picker
                        format="HH:mm"
                        placeholder="请选择时间"
                        style="width:100%"
                        v-decorator="[
                        `taskTime[${k}]`,
                        { rules: [{ required: true, message: '请选择时间点' }] }
                      ]"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col
                    :span="8"
                    class="add-task-control"
                  >
                    <a-form-item
                      label="灯光控制:"
                      :label-col="{ span: 8 }"
                      :wrapper-col="{ span: 16 }"
                    >
                      <a-form-item :style="{ display: 'inline-block',marginTop: '5px'}">
                        <a-switch
                          checkedChildren="开"
                          unCheckedChildren="关"
                          class="fl mr5"
                          v-decorator="[`opened[${k}]`, { valuePropName: switchStatus[k]===1?'checked':'null' }]"
                        />
                      </a-form-item>
                      <a-form-item :style="{ display: 'inline-block' }">
                        <a-slider
                          :min="0"
                          :max="10"
                          class="fl"
                          style="width:70px; top:-2px;margin-left:10px"
                          v-decorator="[`brightness[${k}]`, { initialValue: 0 }]"
                        />
                      </a-form-item>
                      <a-icon
                        v-if="lightAddTask.getFieldValue('keys').length > 1"
                        class="delebtn dynamic-delete-button"
                        type="minus-circle-o"
                        style="color:#FF6666"
                        :disabled="
                        lightAddTask.getFieldValue('keys').length === 1
                      "
                        @click="() => lightTaskConditionRemove(k)"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 添加条件 -->
                <a-row style="margin-bottom:10px">
                  <a-button
                    class="add-condition"
                    type="dashed "
                    @click="lightTaskConditionAdd"
                  >
                    <a-icon type="plus"></a-icon>添加条件
                  </a-button>
                </a-row>

                <div class="form-title">添加设备
                </div>
                <a-row style="margin-top:10px">
                  <a-table
                    class="Application_table"
                    :columns="columns"
                    :rowKey="record => record.id"
                    :dataSource="dataList"
                    :rowSelection="rowSelection"
                    :pagination="false"
                  />
                </a-row>
                <a-row
                  :gutter="24"
                  style="margin-top:20px"
                >
                  <a-col style="text-align:center">
                    <a-button>
                      <router-link to="/application-manage/light?tabKey=3">取消</router-link>
                    </a-button>
                    <a-button
                      type="primary"
                      @click="handleAddTask"
                      style="margin-left:10px;"
                    >保存</a-button>
                  </a-col>
                </a-row>
              </a-form>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>

  </div>
</template>

<script>
import _ from "lodash";
import Api from "@/api";
import poleApi from "@/api/Pole";
import moment from "moment";
import utils from "@/utils/";
import baseMixin from "@/mixins/base.js";
import { mapMutations } from "vuex";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";

const api = new Api();
const poleA = new poleApi();

const columns = [
  {
    title: "设备编号",
    dataIndex: "id",
  },
  {
    title: "资源名称",
    dataIndex: "resourceName",
    ellipsis: true,
  },
];
const taskTypeList = [
  { value: "1", label: "时间触发" },
  { value: "2", label: "经纬度触发" },
  { value: "3", label: "光照触发" },
];
export default {
  mixins: [baseMixin],
  components: { Breadcrumb },
  data() {
    return {
      fullHeight:
        document.documentElement.clientHeight || document.body.clientHeight,
      breadData: this.$route.meta,
      switchStatus: [],
      selectType: false,
      keys: 0,
      columns,
      taskTypeList,
      loading: false,
      dataList: [],
      groupData: [],
      groupId: "",
      modelTitle: "新建照明任务",
      defaultStatusCode: false,
      pagination: {
        //照明--分组分页数据
        current: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0, //总数
      },
      taskRolesId: [],
      taskId: "",
      selectedRowKeys: [],
      LightCodeList: "",
    };
  },
  beforeCreate() {
    this.lightAddTask = this.$form.createForm(this);
    this.lightAddTask.getFieldDecorator("keys", {
      initialValue: [0],
      preserve: true,
    });
  },
  created() {
    let routeData = this.$route;
    let currentMenuId = routeData.meta.id || "";
    let currentMenuParentId = routeData.meta.parentId || "";
    this.setCurrentMenu(currentMenuId);
    this.setCurrentParentMenu(currentMenuParentId);

    this.get_bodyHeight();
    let query = this.$route.query;
    if (query.taskId) {
      this.groupId = query.taskId;
    }
    this.modelTitle = query.modelTitle;
    this.loadList();
    this.findLightCodeList(this.projectId);
    this.loadlightTaskInfoList();
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        onSelect: this.onSelectRow,
        onSelectAll: this.onSelectAllRow,
      };
    },
  },
  methods: {
    ...mapMutations(["setCurrentMenu", "setCurrentParentMenu"]),
    moment,
    handleSelectChange(val) {
      this.selectType = val === "2";
    },

    onSelectChange(selectedRowKeys, selectedRows) {
      console.log("当前设备", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
      this.groupData = selectedRows;
    },
    // 获取未排任务的分组信息
    async loadList() {
      let res = await api
        .lightGroupInfoListWithoutTaskResource(this.projectId)
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code != 200) {
        return;
      }
      this.dataList = res.data;
    },
    //获取智慧杆上灯的信息
    async findLightCodeList(projectId) {
      let res = await poleA.findLightCodeList(projectId).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        return;
      }
      this.LightCodeList = res.data;
    },
    // 获取任务信息
    async loadlightTaskInfoList() {
      if (!this.groupId) {
        return;
      }

      let res = await api.lightTaskQueryInfo(this.groupId).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        return;
      }

      let data = res.data;
      console.log("当前任务", data);
      let arr = data.taskRoles.map((val, index) => index);
      const { lightAddTask } = this;
      const keys = lightAddTask.getFieldValue("keys");
      const nextKeys = [...new Set([...arr, ...keys])];
      this.keys = nextKeys[nextKeys.length - 1];
      lightAddTask.setFieldsValue({
        keys: nextKeys,
      });
      let taskTypeArr = [];
      let taskDeviceArr = [];
      let taskTimeArr = [];
      let openedArr = [];
      let brightnessArr = [];
      data.taskRoles.forEach((_) => {
        taskDeviceArr.push(_["equipmentCode"]);
        taskTypeArr.push(_["taskType"].toString());
        taskTimeArr.push(moment(_["taskStartTime"], "YYYY-MM-DD hh:mm:ss"));
        openedArr.push(_["opened"]);
        brightnessArr.push(_["brightness"]);
        this.taskRolesId.push(_["id"]);
      });
      this.defaultStatusCode = data.statusCode ? true : false;
      this.taskId = data.taskId;
      for (let i = 0; i < this.LightCodeList.length; i++) {
        if (this.LightCodeList[i].lightCode == taskDeviceArr) {
          taskDeviceArr = this.LightCodeList[i].poleName;
          break;
        }
      }
      setTimeout(() => {
        this.lightAddTask.setFieldsValue({
          taskName: data.taskName,
          dateRange: [
            moment(data.startDate, "YYYY/MM/DD"),
            moment(data.endDate, "YYYY/MM/DD"),
          ],
          statusCode: data.statusCode == 1 ? true : false,
          taskType: taskTypeArr,
          taskDevice: taskDeviceArr,
          taskTime: taskTimeArr,
          opened: openedArr,
          brightness: brightnessArr,
        });
        this.switchStatus = this.lightAddTask.getFieldValue("opened");
        console.log(this.switchStatus, "======");
        // this.defaultStatusCode = this.lightAddTask.getFieldValue("statusCode");
        let selectedRowKeys = data.groupData.map((_) => _.id);
        this.onSelectChange(selectedRowKeys, data.groupData);
        this.dataList = [...this.dataList, ...data.groupData];
      }, 0);
    },
    // 选择列表信息
    onSelectRow(record, selected, selectedRows) {
      this.groupData = selectedRows;
    },
    // 选择全部
    onSelectAllRow(selected, selectedRows) {
      this.groupData = selectedRows;
    },
    // 确认新建任务
    handleAddTask(e) {
      e.preventDefault();
      this.lightAddTask.validateFields((err, values) => {
        if (!err) {
          console.log("表单值", values);
          if (this.groupId) {
            this.lightTaskModifyInfo(values);
          } else {
            this.lightTaskAddTask(values);
          }
        }
      });
    },
    // 新建任务
    async lightTaskAddTask(values) {
      if (_.isEmpty(this.groupData)) {
        this.$message.warning("至少选择一条设备信息");
        return;
      }
      let data = this.clearFormData(values);
      let res = await api.lightTaskAdd(data).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning(res.msg);
        return;
      }
      this.$message.success("任务新建成功");
      this.$router.push("/application-manage/light?tabKey=3");
    },
    // 编辑修改任务信息
    async lightTaskModifyInfo(values) {
      if (_.isEmpty(this.groupData)) {
        this.$message.warning("至少选择一条设备信息");
        return;
      }
      let data = this.clearFormData(values);
      let res = await api.lightTaskModifyInfo(data).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning(res.msg);
        return;
      }
      console.log("修改", res);
      this.$message.success("任务修改成功");
      this.$router.push("/application-manage/light?tabKey=3");
    },
    clearFormData(values) {
      const { lightAddTask } = this;
      const keys = lightAddTask.getFieldValue("keys");
      let data = {};
      let taskRoles = [];
      data["taskName"] = values["taskName"];
      data["startDate"] = utils.toDate(values["dateRange"][0]["_d"]);
      data["endDate"] = utils.toDate(values["dateRange"][1]["_d"]);
      data["statusCode"] = values["statusCode"] === true ? 1 : 0;
      (data["projectId"] = this.projectId),
        (data["groupData"] = this.groupData);
      if (this.groupId) {
        data["taskId"] = this.taskId;
      }
      for (let i = 0; i < keys.length; i++) {
        if (this.groupId) {
          taskRoles.push({
            id: this.taskRolesId[i],
            // taskType: values["taskType"][i] === "时间触发" ? 0 : 1,
            taskType: values["taskType"][i],
            taskStartTime: utils.toHours(values["taskTime"][i]["_d"]),
            opened: values["opened"][i] || 0,
            brightness: values["brightness"][i],
            equipmentCode: this.selectType ? values["taskDevice"][i] : "",
          });
        } else {
          taskRoles.push({
            taskType: values["taskType"][i],
            taskStartTime: utils.toHours(values["taskTime"][i]["_d"]),
            opened: values["opened"][i] === true ? 1 : 0,
            brightness: values["brightness"][i],
            equipmentCode: this.selectType ? values["taskDevice"][i] : "",
          });
        }
      }
      data["taskRoles"] = taskRoles;
      return data;
    },

    // 添加条件
    lightTaskConditionAdd() {
      const { lightAddTask } = this;
      const keys = lightAddTask.getFieldValue("keys");
      const nextKeys = keys.concat(++this.keys);
      lightAddTask.setFieldsValue({
        keys: nextKeys,
      });
    },
    // 删除条件
    lightTaskConditionRemove(k) {
      const { lightAddTask } = this;
      const keys = lightAddTask.getFieldValue("keys");
      if (keys.length === 1) {
        return;
      }

      lightAddTask.setFieldsValue({
        keys: keys.filter((key) => key !== k),
      });
    },
    // 获取屏幕高度
    get_bodyHeight() {
      //动态获取浏览器高度
      const that = this;
      window.addEventListener("resize", () => {
        let fullHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        that.fullHeight = fullHeight;
      });
    },
  },
};
</script>
<style scoped lang="less">
.add-task {
  .bottom-sidebar.high {
    height: 623px;
  }
  .add-task-title {
    line-height: 30px;
    color: #fff;
    font-size: 16px;
    margin-top: 15px;
    margin-bottom: 20px;
  }
  .router-link {
    color: #fff;
    font-size: 14px;
  }
  .form-text {
    font-size: 12px;
  }
  .ant-form-item {
    margin-bottom: 10px;
  }

  /deep/.ant-calendar-picker-container {
    background: rgba(2, 22, 82);
  }
  .add-task-control {
    /deep/.ant-form-item-control {
      top: 3px;
    }

    /deep/.ant-input-number {
      width: 60px;
      top: -8px;
    }
  }
  .add-condition {
    font-size: 12px;
  }
  /deep/.ant-select-selection {
    border-radius: 2px;
  }
  .dynamic-delete-button {
    cursor: pointer;
    font-size: 24px;
    color: #999;
    transition: all 0.3s;
    margin-left: 10px;
  }
  .dynamic-delete-button:hover {
    color: #777;
  }
  .dynamic-delete-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
