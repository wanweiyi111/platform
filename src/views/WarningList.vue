<template>
  <div class="warningRule">
    <CtrlPanel
      :hide-title="true"
      class="bottom-sidebar"
      :style="{height: showMore ? '580px' : 'auto'}"
    >
      <dd
        slot="content"
        class="pd-x20"
      >
        <a-tabs @change="changeTabs">
          <a-tab-pane
            tab="告警列表"
            key="1"
          >
            <a-table
              :columns="columns"
              :rowKey="record => record.exceptionId"
              :dataSource="dataList"
              :bordered="false"
              :pagination="pageInfo"
              @change="changePage"
              size="middle"
            ></a-table>
          </a-tab-pane>

          <a-tab-pane
            tab="告警规则管理"
            key="2"
          >
            <a-table
              :columns="columns2"
              :rowKey="record => record.exceptionId"
              :dataSource="contentList"
              :bordered="false"
              :pagination="pageInfo2"
              @change="alarmChange"
              size="middle"
            >
              <div
                slot="equipmentTy"
                slot-scope="text, record"
              >{{EquipmentTypeEnum[record.equipmentType]}}</div>

              <div
                slot="action"
                slot-scope="text, record"
              >
                <a
                  href="javascript:;"
                  class="white1 mr5"
                  @click.stop="startEdit(record)"
                >
                  <a-icon type="edit" />
                </a>
                <a-popconfirm
                  title="确定要删除吗？"
                  @confirm="startDel(record)"
                  okText="确定"
                  cancelText="取消"
                >
                  <a
                    href="javascript:;"
                    class="white1"
                  >
                    <a-icon type="delete" />
                  </a>
                </a-popconfirm>
              </div>
            </a-table>
          </a-tab-pane>

          <div
            class="pd-t5"
            slot="tabBarExtraContent"
            v-if="tabKey == 1"
          >
            <a
              href="javascript:;"
              class="mr15 white2"
              @click="changePanelSize"
            >
              <a-icon
                v-if="!showMore"
                type="arrow-up"
              />
              <a-icon
                v-else
                type="arrow-down"
              />
            </a>
            <a-select
              size="small"
              class="mr15"
              defaultValue="null"
              v-model="queryObj.faultType"
              @change="loadList"
              style="width: 120px;"
            >
              <a-select-option value="null">全部告警类型</a-select-option>
              <a-select-option value="error">告警</a-select-option>
              <a-select-option value="fault">故障</a-select-option>
              <a-select-option value="event">事件</a-select-option>
            </a-select>

            <a-input-search
              v-model="queryObj.searchText"
              @search="loadList"
              placeholder="输入关键词"
              style="width: 150px;bottom:2px"
              class="mr5"
              size="small"
            />
          </div>
          <div
            class="pd-t5"
            slot="tabBarExtraContent"
            v-if="tabKey == 2"
          >
            <a
              href="javascript:;"
              class="mr15 white2"
              @click="changePanelSize"
            >
              <a-icon
                v-if="!showMore"
                type="arrow-up"
              />
              <a-icon
                v-else
                type="arrow-down"
              />
            </a>

            <a-input-search
              v-model="queryObj.faultDescription"
              @keydown.enter="alarmRule"
              placeholder="请输入关键词"
              style="width: 130px;bottom:2px"
              size="small"
            />
            <a-button
              type="primary"
              icon="plus-circle"
              size="small"
              @click="loadList2"
            >添加规则</a-button>
          </div>
        </a-tabs>
      </dd>
    </CtrlPanel>

    <a-modal
      :title="modalType === 'add' ? '新增条件' : '新增条件'"
      :visible="!!modalType"
      cancelText="取消"
      okText="保存"
      @cancel="cancelNew"
      @ok="addAlarmRule"
      :width="740"
    >
      <!-- <a-row class="infoItem arow">
            <a-col :span="12">
              <span class="title">设备类型</span>
              <span class="ctrData">
                <a-tree-select
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  :treeData="deviceType"
                  treeDefaultExpandAll
                  v-model="deviceTypeVal"
                  class="sourceData"
                >
                  <span
                    style="color: #08c"
                    slot="title"
                    slot-scope="{key, value}"
                    v-if="key='0-0-1'"
                  >Child Node1 {{value}}</span>
                </a-tree-select>
              </span>
            </a-col>
            <a-col :span="12">
              <span class="title">资源名称</span>
              <span class="ctrData">
                <a-input class="sourceData" v-model="deviceName" />
              </span>
            </a-col>
          </a-row>
          <a-row class="infoItem arow">
            <a-col :span="12">
              <span class="title">设备厂家</span>
              <span class="ctrData">
                <a-tree-select
                  :treeData="deviceType"
                  treeDefaultExpandAll
                  v-model="deviceManufactor"
                  class="sourceData"
                >
                  <span
                    style="color: #08c"
                    slot="title"
                    slot-scope="{key, value}"
                    v-if="key='0-0-1'"
                  >Child Node1 {{value}}</span>
                </a-tree-select>
              </span>
            </a-col>
            <a-col :span="12">
              <span class="title">设备编号</span>
              <span class="ctrData">
                <a-input class="sourceData" v-model="deviceNo" />
              </span>
            </a-col>
          </a-row>
          <a-row class="infoItem arow">
            <a-col :span="12">
              <span class="title">设备型号</span>
              <span class="ctrData">
                <a-tree-select
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  :treeData="deviceType"
                  treeDefaultExpandAll
                  v-model="deviceModel"
                  class="sourceData"
                >
                  <span
                    style="color: #08c"
                    slot="title"
                    slot-scope="{key, value}"
                    v-if="key='0-0-1'"
                  >Child Node1 {{value}}</span>
                </a-tree-select>
              </span>
            </a-col>
            <a-col :span="12">
              <span class="title">设备MAC</span>
              <span class="ctrData">
                <a-input class="sourceData" v-model="deviceMAC" />
              </span>
            </a-col>
          </a-row>
          <a-row class="infoItem arow">
            <a-col :span="12">
              <span class="title">设备版本型号</span>
              <span class="ctrData">
                <a-input class="sourceData" v-model="equipmentVersion" />
              </span>
            </a-col>
            <a-col :span="12">
              <span class="title">IP地址</span>
              <span class="ctrData">
                <a-input class="sourceData" v-model="deviceIP" />
              </span>
            </a-col>
          </a-row> -->
      <!-- <a-row class="infoItem arow">
            <a-col :span="12">
              <span class="title">归属智慧杆</span>
              <span class="ctrData">
                <a-tree-select
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  :treeData="deviceType"
                  treeDefaultExpandAll
                  v-model="lightAscription"
                  class="sourceData"
                >
                  <span
                    style="color: #08c"
                    slot="title"
                    slot-scope="{key, value}"
                    v-if="key='0-0-1'"
                  >Child Node1 {{value}}</span>
                </a-tree-select>
              </span>
            </a-col>
            <a-col :span="12">
              <span class="title">安装时间</span>
              <span class="ctrData">
                <a-date-picker @change="onTimeChange" />
              </span>
            </a-col>
          </a-row> -->

      <a-form :form="formPowerUser">
        <a-row
          :gutter="24"
          class="infoItem arow"
        >
          <a-col :span="12">
            <a-form-item
              label="规则名称"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                v-model="warningObj.ruleName"
                maxlength="11"
              ></a-input>
            </a-form-item>
            <!-- <span class="title">规则名称</span>
            <span class="ctrData">
                <a-input class="sourceData" v-model="warningObj.ruleName" />
            </span> -->
          </a-col>

          <a-col :span="12">
            <a-form-item
              label="告警规则描述"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                v-model="warningObj.alarmComment"
                maxlength="11"
              ></a-input>
            </a-form-item>
            <!-- <span class="title">告警规则描述</span>
            <span class="ctrData">
                <a-input class="sourceData" v-model="warningObj.alarmComment" />
            </span> -->
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="设备类型"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-select
                @change="findAttributeList"
                v-model="warningObj.equipmentType"
              >
                <a-select-option
                  v-for="item in projectList"
                  :key="item.id"
                  :value="item.id"
                >{{item.projectName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="事件类型"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-select
                :disabled="!warningObj.equipmentType"
                @change="findConditionList"
                v-model="warningObj.attribute"
              >
                <a-select-option
                  v-for="item in attributeList"
                  :key="item.id"
                  :value="item.id"
                >{{item.attributeName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row
          :gutter="24"
          class="mr15"
          style="align-items:center;display:flex"
        >
          <a-col :span="12">
            <a-form-item
              label="条件"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-select
                :disabled="!warningObj.equipmentType"
                @change="findConditionCode"
                v-model="warningObj.conditionId"
              >
                <a-select-option
                  v-for="item in conditionList"
                  :key="item.id"
                  :value="item.id"
                >{{item.conditionName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                :disabled="!warningObj.equipmentType"
                v-model="warningObj.threshold"
                maxlength="11"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="设备名称"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-select
                :disabled="!warningObj.equipmentType"
                @change="getInfoType"
                v-model="warningObj.equipmentName"
                maxlength="32"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="指令"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                :disabled="!warningObj.equipmentType"
                v-model="warningObj.instruct"
                maxlength="32"
              ></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                :disabled="!warningObj.equipmentType"
                v-model="warningObj.equipmentNumber"
                maxlength="32"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

    </a-modal>
  </div>
</template>


<script>
import Unions from "@/api/Unions.js";
import CtrlPanel from "@/components/CtrlPanel.vue";
import MapMixin from "@/mixins/map.js";
import baseMixin from "@/mixins/base.js";
import WarningRule from "@/api/WarningRule.js";
import _ from "lodash";
import utils from "@/utils/";
import { Popconfirm } from "ant-design-vue";

const unions = new Unions();
const warningRule = new WarningRule();

const columns = [
  {
    title: "序号",
    dataIndex: "exceptionId",
  },
  {
    title: "告警位置",
    dataIndex: "location",
  },
  {
    title: "告警资源名称",
    dataIndex: "equipmentName",
  },
  {
    title: "所属智慧杆",
    dataIndex: "poleName",
  },
  {
    title: "经度",
    dataIndex: "longitude",
  },
  {
    title: "纬度",
    dataIndex: "latitude",
  },
  {
    title: "设备型号",
    dataIndex: "equipmentModel",
  },
  {
    title: "告警类型",
    dataIndex: "faultTypeText",
  },
  {
    title: "告警设备",
    dataIndex: "equipmentTypeText",
  },
  {
    title: "告警描述",
    dataIndex: "faultDescription",
  },
  {
    title: "告警时间",
    dataIndex: "createTime",
  },
  {
    title: "持续时长",
    dataIndex: "duringTimeText",
  },
  {
    title: "告警处理状态",
    dataIndex: "faultStatusText",
  },
];

const columns2 = [
  {
    title: "序号",
    dataIndex: "id",
  },
  {
    title: "设备类型",
    dataIndex: "equipmentTy",
    scopedSlots: { customRender: "equipmentTy" },
  },
  {
    title: "事件类型",
    dataIndex: "attribute",
  },
  {
    title: "条件描述",
    dataIndex: "alarmComment",
  },
  {
    title: "条件",
    dataIndex: "conditionName",
  },
  {
    title: "具体内容",
    dataIndex: "threshold",
  },
  {
    title: "操作",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
  },
];

let EquipmentTypeEnum = {
  1: "智慧杆",
  2: "盒子",
  4096: "IoT设备",
  4112: "路灯",
  4144: "大屏",
  4128: "摄像头",
  4160: "公共WIFI",
  4176: "环境传感器",
};

export default {
  mixins: [baseMixin, MapMixin],
  components: {
    CtrlPanel,
    aPopconfirm: Popconfirm,
  },
  data() {
    return {
      EquipmentTypeEnum,

      //tab1
      pageInfo: { pageNum: 1, pageSize: 14 },
      queryObj: { faultType: "null" },
      columns,
      dataList: [],

      //tab2
      columns2,
      contentList: [],
      pageInfo2: {
        pageNum: 0,
        pageSize: 14,
      },
      attributeList: [],
      conditionList: [],
      warningObj: {
        alarmComment: "",
        attribute: "",
        attributeId: "",
        conditionId: "",
        conditionName: "",
        equipmentName: "",
        equipmentNumber: "",
        equipmentType: "",
        ruleName: "",
        threshold: "",
        id: "",
      },

      formPowerUser: this.$form.createForm(this),
      projectList: [
        {
          id: "4112",
          projectName: "路灯",
        },
        {
          id: "4144",
          projectName: "大屏",
        },
        {
          id: "4128",
          projectName: "摄像头",
        },
        {
          id: "4176",
          projectName: "环境传感器",
        },
        {
          id: "4192",
          projectName: "雷达",
        },
      ],
      roleList: [],
      deptList: [],

      tabKey: "1",
      showMore: false,
      modalType: "",
      visibleDetail: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      // RegionOptions,
      form: this.$form.createForm(this, { name: "register" }),
      formConfig: {
        rules: [{ type: "string", required: true, message: "请输入" }],
      },
    };
  },
  created() {
    this.loadList();
  },
  methods: {
    changeTabs(key) {
      this.tabKey = key;
      if (key == 2) {
        this.alarmRule();
      }
    },

    changePanelSize() {
      this.showMore = !this.showMore;
    },

    loadList2() {
      this.modalType = "add";
      // curEditRecord = null;
      // this.loadCameraList();
    },

    startEdit(item) {
      // curEditRecord = item;
      this.modalType = "edit";
      this.warningObj.id = item.id;
      this.warningObj.alarmComment = item.alarmComment;
      this.warningObj.attribute = item.attribute;
      this.warningObj.attributeId = item.attributeId;
      this.warningObj.conditionId = item.conditionId;
      this.warningObj.conditionName = item.conditionName;
      this.warningObj.equipmentName = item.equipmentName;
      this.warningObj.equipmentNumber = item.equipmentNumber;
      this.warningObj.equipmentType = item.equipmentType;
      this.warningObj.ruleName = item.ruleName;
      this.warningObj.threshold = item.threshold;
      // this.$nextTick(() => this.form.setFieldsValue(item));
    },

    async startDel(item) {
      try {
        let res = await warningRule.deleteAlarmRule({ id: item.id });
        if (_.isEmpty(res) || res.code != 200) {
          this.$message.error(res.msg || "删除失败");
          return;
        }
        this.$message.success("删除成功");
        this.alarmRule();
      } catch (err) {
        // console.warn(err);
      }
    },

    cancelNew() {
      this.modalType = "";
    },

    async loadList() {
      for (var p in this.queryObj) {
        if (!this.queryObj[p] || this.queryObj[p] === "null") {
          delete this.queryObj[p];
        }
      }
      try {
        let option = Object.assign(this.queryObj, this.pageInfo);
        let res = await unions.findException(option);
        if (res.code !== "200") {
          this.dataList = [];
          return;
        }
        this.pageInfo = {
          current: res.data.pageNum,
          total: res.data.total,
          pageSize: res.data.pageSize,
        };
        this.dataList = res.data.list.map((item) => {
          item.occurrenceTime = utils.toTime(item.occurrenceTime);
          item.duringTimeText = utils.fromNow(item.duringTime);
          // item.duringTimeText = utils.toTime(item.duringTime * 1000);
          item.faultStatusText = utils.getWarningFaultStatusText(
            item.faultStatus
          );
          item.faultTypeText = utils.getWarningFaultTypeText(item.faultType);
          item.equipmentTypeText = utils.getEquipmentTypeText(
            item.equipmentType
          );
          return item;
        });
      } catch (err) {
        this.$message.warning(err);
      }
    },

    async alarmRule() {
      let option = Object.assign(this.queryObj, this.pageInfo2);
      let res = await warningRule.alarmRule(option);
      if (!res || res.code !== "200") {
        return;
      }
      this.pageInfo2 = {
        current: res.data.pageNum,
        total: res.data.total,
        pageSize: res.data.pageSize,
      };
      this.contentList = res.data.content;
    },

    async findAttributeList(findAttributeList) {
      // let attribute = parseInt(findAttributeList);
      this.warningObj.equipmentType = findAttributeList;
      let res = await warningRule.findAttributeList({
        equipmentType: findAttributeList,
      });
      if (res.code !== "200") {
        return;
      }
      this.attributeList = res.data;
    },

    async findConditionList(id) {
      let idList = [
        "1",
        "2",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
      ];
      let conditionType = "";
      let attribute = "";
      if (idList.includes(id + "")) {
        conditionType = 1;
      } else if (id == "3") {
        conditionType = 2;
      }
      if (id == 1) {
        attribute = "亮度";
      } else if (id == 2) {
        attribute = "电流";
      } else if (id == 3) {
        attribute = "开关";
      } else if (id == 4) {
        attribute = "电压";
      } else if (id == 5) {
        attribute = "亮度";
      } else if (id == 6) {
        attribute = "pm25";
      } else if (id == 7) {
        attribute = "pm10";
      } else if (id == 8) {
        attribute = "噪声";
      } else if (id == 9) {
        attribute = "温度";
      } else if (id == 10) {
        attribute = "湿度";
      } else if (id == 11) {
        attribute = "风向";
      } else if (id == 12) {
        attribute = "风速";
      } else if (id == 13) {
        attribute = "气压";
      } else if (id == 14) {
        attribute = "雨量";
      } else if (id == 15) {
        attribute = "辐射";
      } else if (id == 16) {
        attribute = "紫外";
      }

      this.warningObj.attribute = attribute;
      this.warningObj.attributeId = id;
      let res = await warningRule.findConditionList({
        conditionType: conditionType,
      });
      if (res.code !== "200") {
        return;
      }
      this.conditionList = res.data;
    },

    async findConditionCode(id) {
      let conditionName = "";
      if (id == 1) {
        conditionName = "等于";
      } else if (id == 2) {
        conditionName = "小于";
      } else if (id == 3) {
        conditionName = "大于";
      } else if (id == 4) {
        conditionName = "小于等于";
      } else if (id == 5) {
        conditionName = "大于等于";
      } else if (id == 6) {
        conditionName = "是";
      } else if (id == 7) {
        conditionName = "非";
      }
      this.warningObj.conditionName = conditionName;

      let res = await warningRule.getInfoType();
      console.log(res, "+++++00++");
      if (res.code !== "200") {
        return;
      }
    },

    async getInfoType(getInfoType) {
      // this.warningObj.equipmentName = getInfoType;
    },

    getInfoEquipment() {},

    async addAlarmRule() {
      this.form.validateFields(async (err, fieldsValue) => {
        if (err) {
          return;
        }
        try {
          let res;
          if (this.modalType === "add") {
            let option = Object.assign(this.warningObj);
            // let res = await warningRule.addAlarmRule(option);
            res = await warningRule.addAlarmRule(option);
            if (res.code !== "200") {
              return;
            }
            this.$message.success("新增成功");
            this.modalType = "";
            this.alarmRule();
          } else {
            let option = Object.assign(this.warningObj);
            // res = await warningRule.updataAlarmRule([fieldsValue]);
            res = await warningRule.updataAlarmRule(option);
            if (res.code !== "200") {
              return;
            }
            this.$message.success("更新成功");
            this.modalType = "";
            this.alarmRule();
          }
        } catch (err) {
          this.$message.error(err || "新建失败");
        }
      });
    },

    changePage(pagination) {
      this.pageInfo.current = pagination.current;
      this.pageInfo.pageNum = pagination.current;
      this.pageInfo.pageSize = pagination.pageSize;
      this.loadList();
    },

    alarmChange(pagination) {
      // this.pageInfo2.current = pagination.current;
      // this.pageInfo2.size = pagination.size;
      // this.pageInfo2.pageSize = pagination.pageSize;
      this.pageInfo2.current = pagination.current;
      this.pageInfo2.pageNum = pagination.current;
      this.pageInfo2.pageSize = pagination.pageSize;
      this.alarmRule();
    },
  },
};
</script>


<style scoped lang="less">
span.ant-select-arrow .ant-select-arrow-icon {
  color: #fff;
}
.modelBox {
  border: 1px solid red;
  font-size: 14px;
  color: #bacee4;
  .infoItem {
    width: 100%;
    margin-bottom: 10px;
    span {
      display: inline-block;
    }
    .title {
      width: 35%;
      text-align: right;
      padding-right: 10px;
    }
    .ctrData {
      width: 65%;
      .sourceData {
        border-radius: 10px;
        width: 100%;
      }
    }
  }
  .ant-modal-content {
    width: calc(100% - 624px);
  }
}
</style>