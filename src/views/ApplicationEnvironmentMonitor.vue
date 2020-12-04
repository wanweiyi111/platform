<template>
  <div class="manage-con">
    <a-row>
      <a-col :span="24">
        <div class="Application-con_header">
          <div class="top">
            <i class="iconfont iconleaf"></i>
            <span :style="{paddingLeft:'10px'}">环境监测</span>
          </div>
          <div class="bread">
            <a-breadcrumb>
              <a-breadcrumb-item href="">
                <a-icon type="home" />
              </a-breadcrumb-item>
              <a-breadcrumb-item href="">
                <span>应用管理</span>
              </a-breadcrumb-item>
              <a-breadcrumb-item>
                环境监测
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          <div class="search">
            <a-form
              class="ant-advanced-search-form"
              layout="inline"
              :form="searchForm"
              @submit="handleSearch"
            >
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item label="设备名称">
                    <a-input
                      v-decorator="[
                      'equipName',
                      {rules: [{ message: '请输入设备名称' }]},
                    ]"
                      placeholder="请输入设备名称"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="设备状态">
                    <a-select
                      v-decorator="[
                        'equipState',
                        { rules: [{message: '请选择设备状态' }] },
                      ]"
                      placeholder="请选择设备状态"
                    >
                      <a-select-option value="1">正常</a-select-option>
                      <a-select-option value="0">故障</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col
                  :span="8"
                  :style="{ textAlign: 'right' }"
                >
                  <a-button
                    type="primary"
                    html-type="submit"
                    icon="search"
                  >
                    搜索
                  </a-button>
                  <a-button
                    icon="delete"
                    :style="{ marginLeft: '8px' }"
                    @click="handleReset"
                  >
                    清空
                  </a-button>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </div>
      </a-col>
      <a-col :span="24">
        <div class="table">
          <a-tabs
            class="Application_tabs"
            default-active-key="1"
            @change="callback"
          >
            <a-tab-pane
              key="1"
              tab="概览"
            >
              <a-table
                class="Application_table"
                :columns="columnsGrouping"
                :data-source="allDevice"
                :bordered="false"
                :rowKey="record => record.id"
              >
                <span
                  slot="netkState"
                  slot-scope="text, record"
                >
                  <a-badge
                    :status="Number(record.networkState)?'success':'default'"
                    :text="Number(record.networkState)?'正常':'离线'"
                  />

                </span>
                <span
                  slot="workStatus"
                  slot-scope="text, record"
                >
                  <a-badge
                    :status="Number(record.equipmentStatus)?'success':'error'"
                    :text="Number(record.equipmentStatus)?'正常':'故障'"
                  />
                </span>
                <span
                  slot="onOffStatus"
                  slot-scope="text, record"
                >
                  <a-switch
                    disabled
                    :checked="Number(record.onOff)?true:false"
                    checked-children="开"
                    un-checked-children="关"
                  />

                </span>
                <div
                  slot="action"
                  slot-scope="text, record"
                  class="action_btn"
                >
                  <a-tooltip title="查看详情">
                    <a-icon
                      type="eye"
                      @click="showModalEquipInfo(record)"
                    />
                  </a-tooltip>
                </div>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
    <!-- 查看设备信息 -->
    <a-modal
      title="设备信息"
      class="application_modal"
      :visible="visibleEquipInfo"
      :width="600"
      :footer="null"
      @cancel="handleModelEquipOk"
    >
      <a-descriptions
        title="基本信息"
        size="small"
        :column=2
        bordered
      >
        <a-descriptions-item
          label="设备名称"
          :span="2"
        >
          {{equipInfoView.equipmentName}}
        </a-descriptions-item>
        <a-descriptions-item
          label="设备ID"
          :span="2"
        >
          {{equipInfoView.equipmentCode}}
        </a-descriptions-item>
        <a-descriptions-item
          label="归属智慧杆"
          :span="2"
        >
          {{equipInfoView.poleName}}
        </a-descriptions-item>
        <a-descriptions-item label="安装位置">
          {{equipInfoView.location}}
        </a-descriptions-item>
        <a-descriptions-item label="安装时间">
          {{equipInfoView.installationTime}}
        </a-descriptions-item>
        <a-descriptions-item label="经度">
          {{equipInfoView.longitude}}
        </a-descriptions-item>
        <a-descriptions-item label="纬度">
          {{equipInfoView.latitude}}
        </a-descriptions-item>
        <a-descriptions-item label="联网状态">
          {{Number(equipInfoView.networkState)?'在线':'离线'}}
        </a-descriptions-item>
        <a-descriptions-item label="设备状态">
          {{Number(equipInfoView.equipmentStatus)?'在线':'故障'}}
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions
        title="规则参数"
        size="small"
        :column=3
        :style="{paddingTop:'15px'}"
        bordered
      >
        <a-descriptions-item label="温度(℃)">
          {{equipInfoView.temperature}}
        </a-descriptions-item>
        <a-descriptions-item label="湿度(rh)">
          {{equipInfoView.humidity}}
        </a-descriptions-item>
        <a-descriptions-item label="风向(°)">
          {{equipInfoView.windDirection||0}}
        </a-descriptions-item>
        <a-descriptions-item label="风速(m/s)">
          {{equipInfoView.windSpeed||0}}
        </a-descriptions-item>
        <a-descriptions-item label="PM10(ug/m³)">
          {{equipInfoView.pm10||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="PM2.5(ug/m³)">
          {{equipInfoView.pm25||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="噪声(db)">
          {{equipInfoView.noise}}
        </a-descriptions-item>
        <a-descriptions-item label="气压(hPa)">
          {{equipInfoView.pressure||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="雨量(mm)">
          {{equipInfoView.rainfall||'-'}}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>

  </div>
</template>

<script>
import _ from "lodash";
import MapMixin from "@/mixins/map.js";
import { mapMutations } from "vuex";
import { Tooltip } from "ant-design-vue";
import Environment from "@/api/Environment";

const environment = new Environment();

// 环境监测colums数据
const columnsGrouping = [
  {
    title: "设备编码",
    dataIndex: "equipmentNumber",
    ellipsis: true,
  },
  {
    title: "设备名称",
    dataIndex: "equipmentName",
    ellipsis: true,
  },
  {
    title: "安装位置",
    dataIndex: "location",
    ellipsis: true,
  },
  {
    title: "归属智慧杆",
    dataIndex: "poleName",
    ellipsis: true,
  },
  {
    title: "联网状态",
    width: 80,
    align: "center",
    dataIndex: "netkState",
    scopedSlots: { customRender: "netkState" },
  },
  {
    title: "设备状态",
    width: 80,
    align: "center",
    dataIndex: "workStatus",
    scopedSlots: { customRender: "workStatus" },
  },
  {
    title: "开关状态",
    width: 80,
    align: "center",
    dataIndex: "onOffStatus",
    scopedSlots: { customRender: "onOffStatus" },
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 50,
    align: "cetner",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  mixins: [MapMixin],
  data() {
    return {
      dataList: [],
      bottomSpan: {
        left: 24,
        right: 10,
      },
      activeCollKey: "1",
      curDevice: {},
      lightSwitch: true,
      tabKey: 1,
      equipmentName: "",
      pagination: {
        current: 1,
        pageSize: 10,
        showTotal: (total) => `共 ${total} 条`,
      },
      showMoreLight: false,
      searchForm: this.$form.createForm(this, { name: "advanced_search" }),
      columnsGrouping,
      allDevice: [], // 环境-概览数据
      allDevicePageInfo: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      equipObj: {
        current: 1,
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      visibleEquipInfo: false, // 查看设备信息modal
      equipInfoView: {}, // 查看设备信息-数据
    };
  },
  components: {
    aTooltip: Tooltip,
  },
  created() {
    let routeData = this.$route;
    let currentMenuId = routeData.meta.id || "";
    let currentMenuParentId = routeData.meta.parentId || "";
    this.setCurrentMenu(currentMenuId);
    this.setCurrentParentMenu(currentMenuParentId);
    this.handlePostDevice();
  },
  methods: {
    ...mapMutations(["addCtrlMsgId", "setCurrentMenu", "setCurrentParentMenu"]),
    // 搜索
    handleSearch(e) {
      e.preventDefault();
      this.searchForm.validateFields((error, values) => {
        if (error) {
          return;
        }

        if (values.equipName) {
          this.equipObj.equipmentName = values.equipName;
        }
        if (values.equipState) {
          this.equipObj.equipmentStatus = values.equipState;
        }
        this.handlePostDevice();
      });
    },
    // 搜索重置
    handleReset() {
      this.searchForm.resetFields();
      this.equipObj.equipmentName = "";
      this.equipObj.equipmentStatus = "";
    },
    // 弹出modal
    showModalEquipInfo(val) {
      this.equipInfoView = val;
      this.visibleEquipInfo = true;
    },
    // 关闭modal
    handleModelEquipOk() {
      this.visibleEquipInfo = false;
      console.log("关闭");
    },
    handleModelEquipCancel(e) {
      console.log("关闭", e);
    },
    selectedRow(record) {
      this.curDevice = record;
      this.bottomSpan.left = 14;
    },
    //切换tab回调
    callback(key) {
      this.tabKey = key;
      if (key === "2") {
        this.bottomSpan.left = 24;
      }
    },
    // 概览
    async handlePostDevice() {
      // let reqData = {};
      this.equipObj.projectId = this.projectId;
      let res = await environment.environmentList(this.equipObj);
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      let deviceData = res.data;
      this.allDevice = deviceData.list;
      this.allDevicePageInfo.current = deviceData.pageNum;
      this.allDevicePageInfo.pageSize = deviceData.pageSize;
      this.allDevicePageInfo.total = deviceData.total;
    },
  },
};
</script>
<style lang="less">
.bottom-sidebar.monitor {
  &.high {
    height: 550px;
  }
  .OneVideoInfo.acol {
    height: 264px;
  }
}
</style>

