<template>
  <div class="manage-con">
    <a-row>
      <a-col :span="24">
        <div class="Application-con_header">
          <Breadcrumb />
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
                  <a-form-item label="告警状态">
                    <a-select
                      v-decorator="[
                        'equipState',
                        { rules: [{message: '请选择告警状态' }] },
                      ]"
                      placeholder="请选择告警状态"
                    >
                      <a-select-option value="error">告警</a-select-option>
                      <a-select-option value="fault">故障</a-select-option>
                      <a-select-option value="event">事件</a-select-option>
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
              tab="列表"
              key="1"
            >
              <a-table
                class="Application_table"
                :columns="columnsView"
                :data-source="allDevice"
                :pagination="pagination"
                :bordered="false"
                :rowKey="record => record.exceptionId"
                @change="changeTable"
              >

                <template
                  slot="longitudeLatitudeState"
                  slot-scope="text, record"
                >
                  {{record.longitude}},{{record.latitude}}
                </template>
                <template
                  slot="faultTypeState"
                  slot-scope="text, record"
                >
                  {{record.faultType | formatWarningFaultType}}
                </template>
                <template
                  slot="equipmentTypeState"
                  slot-scope="text, record"
                >
                  {{record.equipmentType| formatEquipmentTypeText}}
                </template>
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
      class="application_modal"
      :visible="visibleEquipInfo"
      title="雷达信息"
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
        :column=2
        :style="{paddingTop:'15px'}"
        bordered
      >
        <a-descriptions-item label="雷达中心频率(KHZ)">
          {{equipInfoView.radarFrequency||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="探测最大距离(m)">
          {{equipInfoView.maxValidDistance||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="距离分辨率(m)">
          {{equipInfoView.distanceResolution||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="最大测速(km/m)">
          {{equipInfoView.maxDetectionSpeed||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="水平角度(deg)">
          {{equipInfoView.horizontalAngle||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="垂直角度(deg)">
          {{equipInfoView.verticalAngle||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="最大目标跟踪数(k)">
          {{equipInfoView.maxTargetTrackNum||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="发现目标的个数(个)">
          {{equipInfoView.targetNum||'-'}}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import _ from "lodash";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
import baseMixin from "@/mixins/base.js";
import { mapMutations } from "vuex";
import { Tooltip } from "ant-design-vue";
import Unions from "@/api/Unions";

const api = new Unions();

// 列表
const columnsView = [
  {
    title: "ID",
    dataIndex: "exceptionId",
    align: "center",
  },
  {
    title: "设备名称",
    dataIndex: "equipmentName",
    ellipsis: true,
  },
  {
    title: "所属智慧杆",
    dataIndex: "poleName",
    ellipsis: true,
  },
  {
    title: "位置",
    dataIndex: "location",
    ellipsis: true,
  },
  {
    title: "告警描述",
    dataIndex: "faultDescription",
  },
  {
    title: "告警设备",
    dataIndex: "equipmentTypeState",
    scopedSlots: { customRender: "equipmentTypeState" },
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
    title: "类型",
    width: 60,
    scopedSlots: { customRender: "faultTypeState" },
  },
  {
    title: "告警时间",
    dataIndex: "createTime",
  },
  // {
  //   title: "操作",
  //   dataIndex: "action",
  //   align: "center",
  //   width: 100,
  //   scopedSlots: { customRender: "action" },
  // },
];

export default {
  mixins: [baseMixin],
  components: {
    aTooltip: Tooltip,
    Breadcrumb,
  },
  data() {
    return {
      dataList: [],
      queryObj: {},
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共 ${total} 条`,
      },
      tabKey: "1",
      qo: {},
      columnsView,
      allDevice: [],
      searchForm: this.$form.createForm(this, { name: "advanced_search" }),
      equipObj: {},
      equipInfoView: {}, // 详情数据
      visibleEquipInfo: false,
      queryObjDetail: {}, // 明细关键字搜索
    };
  },
  created() {
    let routeData = this.$route;
    let currentMenuId = routeData.meta.id || "";
    let currentMenuParentId = routeData.meta.parentId || "";
    this.setCurrentMenu(currentMenuId);
    this.setCurrentParentMenu(currentMenuParentId);

    this.loadData();
  },
  methods: {
    ...mapMutations(["setCurrentMenu", "setCurrentParentMenu"]),
    // 搜索
    handleSearch(e) {
      e.preventDefault();
      this.searchForm.validateFields((error, values) => {
        if (error) {
          return;
        }

        if (values.equipName) {
          this.equipObj.searchText = values.equipName;
        }
        if (values.equipState) {
          this.equipObj.faultType = values.equipState;
        }
        this.pagination.current = 1;
        this.loadData();
      });
    },
    // 搜索重置
    handleReset() {
      this.searchForm.resetFields();
      this.equipObj.searchText = "";
      this.equipObj.faultType = "";
      // this.EquipStatesForm.resetFields();
    },
    // 打开详情modal
    showModalEquipInfo(val) {
      this.equipInfoView = val;
      this.visibleEquipInfo = true;
    },
    // 关闭详情modal
    handleModelEquipOk() {
      this.equipInfoView = {};
      this.visibleEquipInfo = false;
    },
    changeTable(pagination) {
      this.pagination.current = pagination.current;
      this.loadData();
    },

    // 列表
    async loadData() {
      try {
        this.equipObj.pageNum = this.pagination.current;
        this.equipObj.pageSize = this.pagination.pageSize;
        this.equipObj.projectId = this.projectId;
        let res = await api.findException(this.equipObj);
        if (_.isEmpty(res) || res.code !== "200") {
          return;
        }
        let deviceData = res.data;
        this.allDevice = deviceData.list;
        this.pagination.current = deviceData.pageNum;
        this.pagination.total = deviceData.total;
      } catch (err) {
        console.info(err);
      }
    },
    //切换tab回调
    callback(key) {
      this.tabkey = key;
    },
    // 明细搜索
    searchDetail() {
      this.qo = this.queryObjDetail;
    },
  },
};
</script>
