<template>
  <div class="manage-con">
    <a-row>
      <a-col :span="24">
        <div class="Application-con_header">
          <div class="top">
            <i class="iconfont iconwebcam"></i>
            <span style="paddingLeft:10px">安防监控</span>
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
                安防监控
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          <div
            class="search"
            v-if="tabKey==1"
          >
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
            :activeKey="tabKey"
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
                :pagination="allDevicePageInfo"
                :bordered="false"
                :rowKey="record => record.id"
                @change="changePageDevice"
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
                  <a-tooltip title="查看监控">
                    <a-icon
                      type="video-camera"
                      style="paddingLeft:10px"
                      @click="showModalVideoInfo(record)"
                    />
                  </a-tooltip>
                  <a-tooltip title="查看记录">
                    <a-icon
                      type="snippets"
                      :style="{ paddingLeft: '10px' }"
                      @click="showModalEquipStates(record.equipmentCode)"
                    />
                  </a-tooltip>
                </div>
              </a-table>
            </a-tab-pane>
            <a-tab-pane
              tab="实时监控"
              key="2"
            >
              <Live />
            </a-tab-pane>
            <a-tab-pane
              tab="历史回放"
              key="3"
            >
              <Demand type="demand" />
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
    <!-- 查看设备信息 -->
    <a-modal
      class="application_modal"
      :visible="visibleEquipInfo"
      title="设备信息"
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
        <a-descriptions-item
          label="安装时间"
          :span="2"
        >
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
        <a-descriptions-item
          label="规则参数"
          :span="2"
        >
          {{equipInfoView.otherParameters}}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
    <!-- 查看监控 -->
    <a-modal
      class="application_modal"
      :visible="visibleVideoInfo"
      title="查看监控"
      :width="700"
      :afterClose="afterClose"
      :footer="null"
      @cancel="handleModelVideoOk"
    >
      <div>
        <a-row class="mb10">
          <a-col :span="12">设备名称：{{equipInfoView.equipmentName}}</a-col>
          <a-col
            :span="12"
            class="ar"
          >
            <a-button
              type="dashed"
              ghost
              icon="fullscreen"
              @click="fullscreenClick('video' + equipInfoView.id)"
            >全屏</a-button>
          </a-col>
        </a-row>
        <VideoInfo
          :id="'video' + equipInfoView.id"
          :curDevice="equipInfoView"
          v-if="visibleVideoInfo"
        />
      </div>
    </a-modal>
    <!-- 查看设备状态记录 -->
    <a-modal
      title="设备状态记录"
      class="application_modal"
      :visible="visibleEquipStates"
      :width="600"
      :footer="null"
      @cancel="handleModelEquipStatesOk"
    >
      <a-form
        :form="equipStatesForm"
        layout="inline"
        @submit="handleSubmitEquipStates"
      >
        <a-form-item label="时间">
          <a-range-picker
            class="application_range"
            style="width: 200px;margin-bottom:20px"
            @change="changeDateRange"
            :placeholder="['开始时间', '结束时间']"
            :allow-clear="false"
            v-decorator="['rangepicker']"
          />
        </a-form-item>
        <a-form-item>
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
            @click="handleStatesReset"
          >
            清空
          </a-button>
        </a-form-item>
      </a-form>
      <a-table
        class="Application_table"
        :columns="columnsEqiopStates"
        :dataSource="equipStatesList"
        :pagination="equipStatesPageInfo"
        :bordered="false"
        @change="changePageEquipStates"
        size="middle"
        :rowKey="record => record.runtimeId"
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
          slot="switchingStatus"
          slot-scope="text, record"
        >
          <a-switch
            disabled
            :checked="Number(record.switchingState)?true:false"
            checked-children="开"
            un-checked-children="关"
          />
        </span>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import VideoInfo from "@/components/video/VideoInfo.vue";
import Live from "@/components/Security/Live";
import Demand from "@/components/Security/Demand";
import MapMixin from "@/mixins/map.js";
import baseMixin from "@/mixins/base.js";
import utils from "@/utils/";
import _ from "lodash";
import Camera from "@/api/Camera.js";
import RunTime from "@/api/RunTime";
import { mapState, mapMutations } from "vuex";
import { Tooltip } from "ant-design-vue";

const camera = new Camera();
const rt = new RunTime();

// 监控概览
const columnsView = [
  {
    title: "ID",
    dataIndex: "id",
    align: "center",
    width: 60,
  },
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
    align: "center",
    width: 100,
    scopedSlots: { customRender: "action" },
  },
];

// 监控概览-设备状态
const columnsEqiopStates = [
  {
    title: "ID",
    dataIndex: "runtimeId",
    align: "center",
    width: 100,
  },
  {
    title: "时间",
    dataIndex: "createTime",
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
    title: "开关状态",
    width: 80,
    align: "center",
    dataIndex: "switchingStatus",
    scopedSlots: { customRender: "switchingStatus" },
  },
];

export default {
  mixins: [MapMixin, baseMixin],
  components: {
    VideoInfo,
    Live,
    Demand,
    aTooltip: Tooltip,
  },
  props: {
    model: Object,
  },
  data() {
    return {
      curLight: null,
      tabKey: "1",
      showMoreLight: false,
      searchForm: this.$form.createForm(this, { name: "advanced_search" }),
      equipObj: {}, // 参数
      allDevice: [], // 概览数据
      allDevicePageInfo: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共 ${total} 条`, // 显示总数
      },
      columnsView,
      visibleEquipInfo: false, // 查看详情 modal
      equipInfoView: {}, // 详情数据
      visibleVideoInfo: false, // 查看视频 modal
      visibleEquipStates: false, // 查看设备状态记录 modal
      equipStatesForm: this.$form.createForm(this, { name: "equipStatesForm" }),
      equipStatesList: [], // 设备状态记录 数据
      equipStatesObj: {
        startTime: "",
        endTime: "",
      }, // 数据参数
      equipStatesPageInfo: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共 ${total} 条`, // 显示总数
      },
      columnsEqiopStates, // 设备状态记录 table-columns
    };
  },
  created() {
    let routeData = this.$route;
    let currentMenuId = routeData.meta.id || "";
    let currentMenuParentId = routeData.meta.parentId || "";
    this.setCurrentMenu(currentMenuId);
    this.setCurrentParentMenu(currentMenuParentId);
    this.tabKey = routeData.query.tabKey || "1";
    this.loadAllDevice();
  },
  computed: {
    ...mapState(["ctrlMsgIds"]),
  },
  methods: {
    ...mapMutations([
      "removeCtrlMsgId",
      "setCurrentMenu",
      "setCurrentParentMenu",
    ]),
    afterClose() {
      console.log("关闭之后");
    },
    // 全屏按钮
    fullscreenClick(element) {
      var elem = document.getElementById(element);
      this.setFullScreen(elem);
    },
    // 全屏功能
    setFullScreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
      //FireFox
      else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      }
      //Chrome等
      else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      }
      //IE11
      else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    },
    //切换tab回调
    callback(key) {
      let val = key;
      this.tabKey = val;
      this.$router.push({
        path: "/application-manage/camera",
        query: { tabKey: val },
      });
    },
    // 搜索
    handleSearch(e) {
      e.preventDefault();
      this.searchForm.validateFields((error, values) => {
        if (error) {
          return;
        }
        if (values.equipName) {
          this.queryObj.equipmentName = values.equipName;
        }
        if (values.equipState) {
          this.queryObj.equipmentStatus = values.equipState;
        }
        if (this.tabKey == 1) {
          this.allDevicePageInfo.current = 1;
          this.loadAllDevice();
        } else if (this.tabKey == 2) {
          this.loadlightGroupingList();
        } else {
          this.loadlightTaskList();
        }
      });
    },
    // 搜索重置
    handleReset() {
      this.searchForm.resetFields();
      this.queryObj.equipmentName = "";
      this.queryObj.equipmentStatus = "";
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
    // 概览分页
    changePageDevice(pagination) {
      this.allDevicePageInfo.current = pagination.current;
      this.loadAllDevice();
    },
    // 获取设备概览列表数据
    async loadAllDevice() {
      this.queryObj.pageNum = this.allDevicePageInfo.current;
      this.queryObj.pageSize = this.allDevicePageInfo.pageSize;
      this.queryObj.projectId = this.projectId;
      let res = await camera.findByProjectIdPaged(this.queryObj);
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.allDevice = res.data.list;
      this.allDevicePageInfo.current = res.data.pageNum;
      this.allDevicePageInfo.total = res.data.total;
    },
    // 打开查看监控 modal
    showModalVideoInfo(val) {
      let videoValue = val;
      if (videoValue.serverName) {
        videoValue.serverName = videoValue.serverName.replace("http://", "");
      }
      this.equipInfoView = videoValue;
      this.visibleVideoInfo = true;
    },
    // 关闭查看监控 modal
    handleModelVideoOk() {
      this.equipInfoView = {};
      this.visibleVideoInfo = false;
      clearInterval();
    },
    // 设备状态记录-打开
    showModalEquipStates(val) {
      let code = val;
      this.equipStatesObj.equipmentCode = code;
      this.handlePostEquipStates();
    },
    // 设备状态记录 关闭
    handleModelEquipStatesOk() {
      this.visibleEquipStates = false;
      this.equipStatesObj.equipmentCode = "";
      this.equipStatesObj.startTime = "";
      this.equipStatesObj.endTime = "";
      this.equipStatesForm.resetFields();
    },
    // 设备状态记录 时间选择
    changeDateRange(dates) {
      this.equipStatesObj.startTime = dates[0].format(utils.fsTime);
      this.equipStatesObj.endTime = dates[1].format(utils.fsTime);
    },
    // 设备状态记录 搜索
    handleSubmitEquipStates(e) {
      e.preventDefault();
      this.equipStatesForm.validateFields((err, values) => {
        if (err) {
          return;
        }
        console.log(values);
        this.equipStatesPageInfo.current = 1;
        this.handlePostEquipStates();
      });
    },
    // 设备状态记录 搜索重置
    handleStatesReset() {
      this.equipStatesForm.resetFields();
      this.equipStatesObj.startTime = "";
      this.equipStatesObj.endTime = "";
    },
    //  设备状态记录 分页
    changePageEquipStates(pagination) {
      this.equipStatesPageInfo.current = pagination.current;
      this.handlePostEquipStates();
    },
    /* 设备状态记录 */
    async handlePostEquipStates() {
      this.equipStatesObj.page = this.equipStatesPageInfo.current;
      this.equipStatesObj.projectId = this.projectId;
      let res = await rt.camera(this.equipStatesObj);
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.equipStatesPageInfo.current = res.data.pageNum;
      this.equipStatesPageInfo.total = res.data.total;
      this.equipStatesList = res.data.list;
      this.visibleEquipStates = true;
    },
  },
};
</script>
