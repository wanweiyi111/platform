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
              v-if="tabkey==1"
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
            <a-row
              :gutter="24"
              v-else
            >
              <a-col :span="6">
                <a-input-search
                  placeholder="请输入雷达/归属杆名称"
                  v-model="queryObjDetail.searchText"
                  @search="searchDetail"
                >
                  <a-button
                    type="primary"
                    style="border-color: rgba(255,255,255,0.5);"
                    slot="enterButton"
                  >
                    <a-icon type="search" />搜索
                  </a-button>
                </a-input-search>
              </a-col>
            </a-row>
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
              tab="概览"
              key="1"
            >
              <a-table
                class="Application_table"
                :columns="columnsView"
                :data-source="allDevice"
                :pagination="pagination"
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
            <a-tab-pane
              tab="明细"
              key="2"
            >
              <RadarStatistics :qo="qo"></RadarStatistics>
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
import RadarStatistics from "@/components/Radar/RadarStatistics.vue";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
import baseMixin from "@/mixins/base.js";
import { mapMutations } from "vuex";
import { Tooltip } from "ant-design-vue";
import Radar from "@/api/Radar";

const radar = new Radar();

// 雷达概览
const columnsView = [
  {
    title: "序号",
    dataIndex: "id",
    align: "center",
    width: 60,
  },
  {
    title: "设备名称",
    dataIndex: "equipmentName",
    ellipsis: true,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
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
    align: "center",
    width: 100,
    scopedSlots: { customRender: "action" },
  },
];
// 雷达明细
const columnsDetailedView = [
  {
    title: "序号",
    dataIndex: "id",
    align: "center",
    width: 60,
  },
  {
    title: "设备名称",
    dataIndex: "equipmentName",
    ellipsis: true,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
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
    align: "center",
    width: 100,
    scopedSlots: { customRender: "action" },
  },
];

export default {
  mixins: [baseMixin],
  components: {
    RadarStatistics,
    aTooltip: Tooltip,
    Breadcrumb,
  },
  data() {
    return {
      dataList: [],
      bottomSpan: {
        left: 24,
        right: 10,
      },
      activeCollKey: "1",
      curDevice: {},
      queryObj: { projectId: this.$store.state.curProject.id },
      lightSwitch: true,
      // equipmentName: "",
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tabKey: "1",
      sliderChartData: [],
      chartTitle: "雷达数",
      allTotal: "",
      showMoreLight: false,
      qo: {},
      columnsView,
      tabkey: "1",
      allDevice: [],
      searchForm: this.$form.createForm(this, { name: "advanced_search" }),
      equipObj: {
        // current: 1,
        // equipmentName: "",
        // equipmentStatus: "",
        // pageNum: 1,
        // pageSize: 10,
        // total: 5,
      },
      equipInfoView: {}, // 详情数据
      visibleEquipInfo: false,
      columnsDetailedView,
      queryObjDetail: {}, // 明细关键字搜索
    };
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
    ...mapMutations(["setCurrentMenu", "setCurrentParentMenu"]),
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
    // 雷达概览
    async handlePostDevice() {
      try {
        this.equipObj = this.pagination;
        this.equipObj.projectId = this.projectId;
        let res = await radar.findByProjectIdPaged(this.equipObj);
        if (_.isEmpty(res) || res.code !== "200") {
          return;
        }
        let deviceData = res.data;
        this.allDevice = deviceData.list;
        this.pagination.current = deviceData.pageNum;
        this.pagination.pageSize = deviceData.pageSize;
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
