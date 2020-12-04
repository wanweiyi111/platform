<template>
  <a-row>
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
              <a-row
                :gutter="24"
                v-if="this.tabKey == 1"
              >
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
              <a-row
                :gutter="24"
                v-if="this.tabKey == 2"
              >
                <a-col :span="8">
                  <a-form-item label="名称">
                    <a-input
                      v-decorator="[
                      'equipName',
                      {rules: [{ message: '请输入名称' }]},
                    ]"
                      placeholder="请输入名称"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="类型">
                    <a-select
                      v-decorator="[
                        'equipState',
                        { rules: [{message: '请选择类型' }] },
                      ]"
                      placeholder="请选择类型"
                    >
                      <a-select-option value="2">图片</a-select-option>
                      <a-select-option value="3">视频</a-select-option>
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
              <a-row v-if="this.tabKey == 3">
                <a-col :span="6">
                  <a-input-search
                    placeholder="请输入节目名称"
                    v-model="queryObjProgram.programName"
                    @search="searchProgram"
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
              <a-row v-if="this.tabKey == 4">
                <a-col :span="6">
                  <a-input-search
                    placeholder="请输入分组名称"
                    v-model="queryObjGroup.resourceName"
                    @search="searchGroup"
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
              <a-row v-if="this.tabKey == 5">
                <a-col :span="6">
                  <a-input-search
                    placeholder="请输入计划名称"
                    v-model="queryObjTask.resourceName"
                    @search="searchTask"
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
            </a-form>
          </div>
        </div>
      </a-col>
      <a-col :span="24">
        <div class="table">
          <a-tabs
            class="Application_tabs"
            :activeKey="tabKey"
            @change="changeTabs"
          >
            <a-tab-pane
              key="1"
              tab="概览"
            >
              <NewDeviceList
                type="display"
                @returnRowData="returnRowData"
              ></NewDeviceList>
            </a-tab-pane>
            <a-tab-pane
              tab="媒体库"
              key="2"
            >
              <div class="tab-btns">
                <a-button
                  type="dashed"
                  icon="plus"
                  class="mr15"
                >
                  <router-link to="/application-manage/display/upload">上传媒体</router-link>
                </a-button>
                <a-dropdown
                  :disabled="isAuditMedia"
                  overlayClassName="application_dropdown"
                >
                  <a-menu
                    slot="overlay"
                    @click="handleMedioClick"
                  >
                    <a-menu-item key="1">
                      <a-icon type="check" />通过
                    </a-menu-item>
                    <a-menu-item key="2">
                      <a-icon type="close" />驳回
                    </a-menu-item>
                  </a-menu>
                  <a-button
                    type="dashed"
                    :disabled="isAuditMedia"
                    :class="isAuditMedia?'disabled':''"
                  > 审核
                    <a-icon type="down" />
                  </a-button>
                </a-dropdown>
              </div>
              <DisplayMediaLibrary @displayPreview="displayPreview"></DisplayMediaLibrary>
            </a-tab-pane>
            <a-tab-pane
              tab="节目库"
              key="3"
            >
              <div class="tab-btns">
                <a-button
                  type="dashed"
                  icon="plus"
                  class="mr15"
                >
                  <router-link to="/application-manage/display/add-program">创建节目</router-link>
                </a-button>
                <a-dropdown
                  :disabled="isAuditProgram"
                  overlayClassName="application_dropdown"
                >
                  <a-menu
                    slot="overlay"
                    @click="handleProgramClick"
                  >
                    <a-menu-item key="1">
                      <a-icon type="check" />通过
                    </a-menu-item>
                    <a-menu-item key="2">
                      <a-icon type="close" />驳回
                    </a-menu-item>
                  </a-menu>
                  <a-button
                    type="dashed"
                    :disabled="isAuditProgram"
                    :class="isAuditProgram?'disabled':''"
                  > 审核
                    <a-icon type="down" />
                  </a-button>
                </a-dropdown>
              </div>
              <DisplayProgramLibrary @displayPreview="displayPreview"></DisplayProgramLibrary>
            </a-tab-pane>
            <a-tab-pane
              tab="分组"
              key="4"
            >
              <div class="tab-btns">
                <a-button
                  type="dashed"
                  icon="plus"
                  class="mr15"
                  @click="showModalAddGroup(false)"
                >
                  新建分组
                </a-button>
              </div>
              <DisplayGroup></DisplayGroup>
            </a-tab-pane>
            <a-tab-pane
              tab="任务"
              key="5"
            >
              <div class="tab-btns">
                <a-button
                  type="dashed"
                  icon="plus"
                  class="mr15"
                >
                  <router-link to="/application-manage/display/add-task?modelTitle=新建任务">新建任务</router-link>
                </a-button>
              </div>
              <DisplayTask></DisplayTask>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>

    <!-- 媒体、节目预览 -->
    <a-modal
      class="application_modal"
      title="预览"
      v-model="visiblePreview"
      :footer="null"
      @cancel="()=>visiblePreview=false"
      :key="mediaListKey"
      :width="600"
      okText='确定'
      cancelText='取消'
    >
      <a-carousel
        arrows
        :autoplay="true"
      >
        <div
          slot="prevArrow"
          class="custom-slick-arrow"
          style="left: 10px;zIndex: 1"
        >
          <a-icon type="left-circle" />
        </div>
        <div
          slot="nextArrow"
          class="custom-slick-arrow"
          style="right: 10px"
        >
          <a-icon type="right-circle" />
        </div>
        <div
          v-for="item in mediaList"
          :key="item.id"
          class="ac pd-y10"
        >
          <img
            v-if="item.type == 2"
            width="300"
            height="350"
            :src="item.url"
            style="margin:0 auto;"
            class="img-fluid"
          />
          <video
            v-else-if="item.type == 3"
            controls
            autoplay
            width="350"
            height="350"
            class="img-fluid"
          >
            <source
              :src="item.url+ '&token=' + token"
              type="video/mp4"
            />
          </video>
        </div>
      </a-carousel>
    </a-modal>

    <!-- 新建/编辑分组对话框 -->
    <DisplayAddGroup
      :visible="visibleAddGroup"
      :modalTitle="modalTitleGroup"
    ></DisplayAddGroup>

    <!-- 给分组添加屏幕信息 -->
    <DisplayGroupAddScreen :visible="visibleGroupAddScreen"></DisplayGroupAddScreen>

    <!-- 截图清单 -->
    <a-modal
      class="application_modal"
      title="截图记录"
      v-model="PicListPreview"
      :footer="null"
      centered
      @cancel="modalScreenshotCancal"
      :key="mediaListKey"
      :width="700"
    >
      <div class="setProgram">
        <a-range-picker
          @change="onRangTimeChange"
          :placeholder="['开始时间', '结束时间']"
        />
      </div>
      <a-table
        class="Application_table"
        :columns="PicColumns"
        :dataSource="PicList"
        :rowKey="record => record.id"
      >
        <span
          slot="preview"
          slot-scope="text, record"
        >
          <a-tooltip title="查看">
            <a-icon
              type="eye"
              @click="preView(record)"
            />
          </a-tooltip>
        </span>
      </a-table>
    </a-modal>
    <a-modal
      class="application_modal application_modal_body-center"
      title="查看截图"
      v-model="PicPreview"
      :footer="null"
      centered
      @cancel="()=>PicPreview=false"
      :key="mediaListKey"
      :width="600"
    >
      <img
        :src="PicURL"
        class="img-fluid"
      />
    </a-modal>
    <!-- 设置 start-->
    <a-modal
      class="application_modal"
      title="设置"
      v-model="visibleSet"
      :footer="null"
      centered
      @cancel="modalSetCancal"
      :width="600"
    >
      <a-descriptions
        title=""
        size="small"
        :column=2
        class="application_descriptions"
        bordered
      >
        <a-descriptions-item
          :span="2"
          label="播报默认节目"
        >
          <a-button
            shape="circle"
            icon="caret-right"
            :disabled="loading"
            @click="playDefault"
          />
        </a-descriptions-item>
        <a-descriptions-item label="截图">
          <a-button
            shape="circle"
            icon="scissor"
            :disabled="isScreenCapture"
            @click="setScreenshot"
          />
        </a-descriptions-item>
        <a-descriptions-item label="重启">
          <a-button
            shape="circle"
            icon="poweroff"
            @click="reboot"
          />
        </a-descriptions-item>
        <a-descriptions-item label="亮度设置">
          <a-row>
            <a-col :span="20">
              <a-slider
                :min="1"
                :max="100"
                v-model="currentRowData.brightness"
                :disabled="!Number(currentRowData.onOff)"
                @afterChange="setBrightness"
                :tipFormatter="aSliderTipFormatter"
              />
            </a-col>
            <a-col
              :span="4"
              style="line-height: 36px;padding-left:10px"
            >{{currentRowData.brightness||1}}%</a-col>
          </a-row>
        </a-descriptions-item>

      </a-descriptions>
    </a-modal>
    <!-- 设置 end-->
  </a-row>
</template>

<script>
import _ from "lodash";
import utils from "@/utils/";
import Display from "@/api/Display";
import baseMixin from "@/mixins/base.js";
import MapMixin from "@/mixins/map.js";
import NewDeviceList from "@/components/common/NewDeviceList.vue";
import DisplayMediaLibrary from "@/components/Display/DisplayMediaLibrary.vue";
import DisplayProgramLibrary from "@/components/Display/DisplayProgramLibrary.vue";
import DisplayGroup from "@/components/Display/DisplayGroup.vue";
import DisplayAddGroup from "@/components/Display/DisplayAddGroup.vue";
import DisplayGroupAddScreen from "@/components/Display/DisplayGroupAddScreen.vue";
import DisplayTask from "@/components/Display/DisplayTask.vue";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
import MqttClient from "@/libs/MqttClient.js";
import { mapState, mapMutations } from "vuex";
import { Carousel, Tooltip } from "ant-design-vue";

const display = new Display();

// 信息发布任务colums数据
const PicColumns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "图片名称",
    dataIndex: "name",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "操作",
    dataIndex: "action",
    scopedSlots: {
      customRender: "preview",
    },
  },
];

export default {
  mixins: [baseMixin, MapMixin],
  components: {
    NewDeviceList,
    DisplayMediaLibrary,
    DisplayProgramLibrary,
    DisplayGroup,
    DisplayAddGroup,
    DisplayGroupAddScreen,
    DisplayTask,
    Breadcrumb,
    aCarousel: Carousel,
    aTooltip: Tooltip,
  },
  data() {
    return {
      token: sessionStorage.getItem("token"),
      PicColumns: PicColumns,
      pageDevice: [],
      hoverDevice: {},
      curDevice: {},
      deviceCtrl: {
        onOff: 1,
        level: 0,
      },
      queryObj: {},
      bottomSpan: {
        left: 24,
        right: 10,
      },
      tabKey: "1",
      queryObjMedia: { type: 0 }, //信息发布媒体库搜索数据
      queryObjProgram: {}, //信息发布节目库搜索数据
      queryObjGroup: {}, //信息发布分组搜索
      queryObjTask: {}, //信息任务分组搜索
      visiblePreview: false, //媒体库、节目库预览
      screenShotPreview: false, //预览
      screenShotURL: "",
      PicPreview: false, //预览 modal
      PicListPreview: false, //截图列表 modal
      picListId: null, // 当前节目id
      PicURL: "",
      PicList: [],
      cacheScreenShotURL: {},
      mediaList: [], //媒体、节目预览数据
      setBrightnessDeb: _.debounce(this.setBrightness, 300),
      visibleAddGroup: false, //新建编辑分组
      modalTitleGroup: "新建组",
      visibleGroupAddScreen: false,
      sliderChartData: [],
      chartTitle: "大屏数",
      showMoreLight: false,
      mediaListKey: 0,
      isAuditMedia: false, //媒体库是否可审核
      isAuditProgram: false, //节目库是否可审核
      startTime: "",
      endTime: "",
      loading: false,
      searchForm: this.$form.createForm(this, { name: "advanced_search" }),
      allDevicePageInfo: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共 ${total} 条`, // 显示总数
      },
      visibleEquipInfo: false, // 查看详情 modal
      equipInfoView: {}, // 详情数据
      searchData: {}, // 搜索值
      visibleSet: false, // 概览-操作-设置 modal
      currentRowData: {}, // 当前行数据
    };
  },
  computed: {
    ...mapState(["ctrlMsgIds"]),
    isScreenCapture() {
      return !(this.currentRowData.equipmentStatus == 1);
    },
  },
  created() {
    // this.setBrightnessDeb = _.debounce(this.setBrightness, 300);
    this.tabKey = this.$route.query.tabKey || "1";
    this.initStock();
    // 新建/编辑分组对话框
    this.$bus.on("showModalAddGroup", (isEdit) => {
      this.showModalAddGroup(isEdit);
    });

    // 给分组添加大屏对话框
    this.$bus.on("showModelGroupAddScreen", (isShow) => {
      this.showModelGroupAddScreen(isShow);
    });

    // 设置媒体库审核按钮状态
    this.$bus.on("displayMediaBtnStatus", (isAuditMedia) => {
      this.isAuditMedia = isAuditMedia;
    });

    // 设置节目库审核按钮状态
    this.$bus.on("displayProgramBtnStatus", (isAuditProgram) => {
      this.isAuditProgram = isAuditProgram;
    });
    // 清除媒体库搜索过滤数据
    this.$bus.on("clearQueryObjMedia", () => {
      this.queryObjMedia.mediaName = "";
      delete this.queryObjMedia.mediaName;
    });
    // 清除节目库搜索过滤数据
    this.$bus.on("clearQueryObjProgram", () => {
      this.queryObjProgram.programName = "";
      delete this.queryObjProgram.programName;
    });
    // 清除分组搜索过滤数据
    this.$bus.on("clearQueryObjGroup", () => {
      this.queryObjGroup.resourceName = "";
      delete this.queryObjGroup.resourceName;
    });
    // 清除任务搜索过滤数据
    this.$bus.on("clearQueryObjTask", () => {
      this.queryObjTask.resourceName = "";
      delete this.queryObjTask.resourceName;
    });
  },
  filters: {
    formatEquipmentStatus(equipmentStatus) {
      return utils.getEquipmentStatusText(equipmentStatus);
    },
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
        if (this.tabKey == 1) {
          if (values.equipName) {
            this.searchData.equipmentName = values.equipName;
          }
          if (values.equipState) {
            this.searchData.equipmentStatus = values.equipState;
          }
          this.$bus.emit("changeQueryObj", this.searchData);
        } else if (this.tabKey == 2) {
          if (values.equipName) {
            this.queryObjMedia.mediaName = values.equipName;
          }
          if (values.equipState) {
            this.queryObjMedia.type = values.equipState;
          }
          this.queryObjMedia.projectId = this.projectId;
          this.$bus.emit("loadQueryListMedia", true, this.queryObjMedia);
        }
      });
    },
    // 搜索重置
    handleReset() {
      this.searchForm.resetFields();
      if (this.tabKey == 1) {
        this.searchData.equipmentName = "";
        this.searchData.equipmentStatus = "";
      } else if (this.tabKey == 2) {
        this.queryObjMedia.mediaName = "";
        this.queryObjMedia.type = 0;
      }
    },
    // 概览分页
    changePageDevice(pagination) {
      this.allDevicePageInfo.current = pagination.current;
      // this.loadAllDevice();
    },

    // 操作-返回所属节目id的截图
    returnRowData(record, type) {
      console.log("类型", type, record);
      let val = record;
      this.currentRowData = val;
      if (type == 1) {
        this.getScreenshot(val.id);
      } else if (type == 2) {
        this.visibleSet = true;
      }
    },
    // 截图-modal关闭
    modalScreenshotCancal() {
      this.PicListPreview = false;
      this.startTime = "";
      this.endTime = "";
      this.PicList = [];
      this.currentRowData = {};
    },
    //截图预览
    preView(data) {
      this.PicPreview = true;
      this.PicURL = `${data.path}&token=${sessionStorage.getItem("token")}`;
    },
    //时间区间
    onRangTimeChange(value, date) {
      this.startTime = date[0];
      this.endTime = date[1];
      this.getScreenshot(this.currentRowData.id);
    },
    showModalSet() {
      this.visibleSet = true;
    },
    // 设置-modal关闭
    modalSetCancal() {
      this.visibleSet = false;
      this.currentRowData = {};
    },
    ...mapMutations(["addCtrlMsgId", "removeCtrlMsgId"]),

    aSliderTipFormatter(value) {
      return `亮度: ${value}%`;
    },
    initStock() {
      const mqtt = new MqttClient();
      const client = mqtt.client;
      client.on("message", this.handleMessageEvent.bind(this));
    },
    // 概览-设置-截图
    async setScreenshot() {
      this.$message.destroy();
      // if (this.hasOperate(this.currentRowData, "screenshot")) {
      //   this.$message.warning("上次指令操作未完成，请稍后");
      //   return;
      // }
      try {
        const messageId = this.createMsgId(this.currentRowData, "screenshot");
        this.addCtrlMsgId(messageId);
        const data = {
          messageId,
          deviceIds: [this.currentRowData.equipmentCode],
        };
        let res = await display.setScreenshot(data);
        if (res.code !== "200") {
          this.$message.error(res.msg);
        } else {
          this.$set(this.cacheScreenShotURL, messageId, res.data.url);
          this.$message.success(res.msg);
        }
      } catch (err) {
        this.$message.error(err.toString());
      }
    },
    /***获取截图 start */
    async getScreenshot(id) {
      let tmp = [];
      this.PicListPreview = true;
      let res = await display
        .getScreenshot(id, {
          startTime: this.startTime || "",
          endTime: this.endTime || "",
        })
        .catch((err) => {
          console.log(err);
        });
      if (!res || res.code !== "200") {
        return;
      }
      res.data.list.map((item) => {
        tmp.push({
          createTime: item.createTime,
          equipmentCode: item.equipmentCode,
          equipmentId: item.equipmentId,
          id: item.id,
          name: item.name,
          path: item.path,
        });
      });
      this.PicList = tmp;
    },
    /***获取截图 end*/
    handleMessageEvent(topic, message, packet) {
      if (topic.indexOf("Operation") === -1) {
        return;
      }
      let msgObj = JSON.parse(packet.payload.toString());
      //不存在本地的msgId，不做任何处理
      if (!this.ctrlMsgIds.includes(msgObj.msgId)) {
        return;
      }
      if (!msgObj.isSuccess) {
        this.$message.warning(msgObj.errMsg);
        return;
      }
      let arr = msgObj.msgId.split("-");
      if (arr[0] !== utils.getEquipmentTypeByType(this.type)) {
        return;
      }
      let msgId = msgObj.msgId;
      let screenShotURL = this.cacheScreenShotURL[msgId];
      if (msgId !== undefined && screenShotURL !== undefined) {
        this.screenShotURL = screenShotURL;
        this.screenShotPreview = true;
        this.removeCtrlMsgId(msgId);
      }
    },
    async loadPageDevice() {
      this.queryObj.projectId = this.queryObj;
      let res = await display
        .findByProjectIdPaged(this.queryObj)
        .catch((err) => {
          console.log(err);
        });
      if (!res || res.code !== "200") {
        return;
      }
      if (_.isEmpty(res.data.list)) {
        this.pageDevice = [];
      } else {
        this.pageDevice = res.data.list.map((item) => {
          item.networkStateText = utils.getNetworkStateText(item.networkState);
          item.equipmentStatusText = utils.getEquipmentStatusText(
            item.equipmentStatus
          );
          return item;
        });
      }
    },
    async selectedRow(item) {
      this.curDevice = item;
      try {
        this.deviceCtrl.onOff = this.curDevice.onOff == "1";
        this.deviceCtrl.level = this.curDevice.brightness;
      } catch {
        this.deviceCtrl.onOff = false;
        this.deviceCtrl.level = 0;
      }

      if (_.isEmpty(this.curDevice)) {
        this.bottomSpan.left = 24;
      } else {
        this.bottomSpan.left = 14;
      }
    },

    // 页面控制开始
    // 操作-设置-重启
    async reboot() {
      this.$message.destroy();
      console.log(this.currentRowData.equipmentCode);
      let res = await display
        .reboot({
          deviceIds: [this.currentRowData.equipmentCode],
          sec: 0,
        })
        .catch((err) => {
          console.log(err);
        });
      if (res.code !== "200") {
        this.$message.error(res.msg);
      } else {
        this.$message.success(res.msg);
      }
    },
    // 操作-设置-亮度
    async setBrightness() {
      const messageId = this.createMsgId(this.currentRowData, "level");
      this.addCtrlMsgId(messageId);
      let res = await display
        .setBrightness({
          messageId,
          deviceIds: [this.currentRowData.equipmentCode],
          level: this.currentRowData.brightness || 1,
        })
        .catch((err) => {
          console.log(err);
        });

      if (res.code !== "200") {
        this.$message.error(res.msg);
      } else {
        // this.currentRowData.brightness = this.deviceCtrl.level || 1;
        this.$message.success(res.msg);
        // this.$bus.emit("changeQueryObj", obj);
      }
    },
    //播放默认节目
    async playDefault(messageId) {
      this.$message.destroy();
      this.loading = true;
      messageId =
        typeof messageId === "string"
          ? messageId
          : this.createMsgId(this.currentRowData, "play");
      let programeRes = await display
        .playDefaultProgram({
          messageId,
          deviceIds: [this.currentRowData.equipmentCode],
        })
        .catch((err) => {
          console.log(err);
        });
      this.loading = false;
      if (programeRes.code !== "200") {
        this.$message.error(programeRes.msg);
      } else {
        this.$message.success(programeRes.msg);
      }
    },
    async setOnOff() {
      if (this.hasOperate(this.currentRowData, "onoff")) {
        this.$message.warning("上次指令操作未完成，请稍后");
        return;
      }
      const onOff = Number(this.currentRowData.onOff) ? 0 : 1;
      const messageId = this.createMsgId(this.currentRowData, "onoff");
      this.addCtrlMsgId(messageId);
      let res = await display
        .setOnOff({
          messageId,
          deviceIds: [this.currentRowData.equipmentCode],
          onOff,
        })
        .catch((err) => {
          console.log(err);
        });

      if (res.code !== "200") {
        this.$message.error(res.msg);
      } else {
        this.currentRowData.onOff = onOff.toString();
        this.currentRowData.onOffText = onOff == 1 ? "开" : "关";
        console.info("this.curDevice", this.currentRowData);
        this.$message.success(res.msg);
        //播放默认节目
        if (onOff === 1) {
          this.playDefault(messageId);
        }
        let obj = {
          onOff: this.currentRowData.onOff,
        };
        this.$bus.emit("changeQueryObj", obj);
      }
    },

    async play() {
      let res = await display
        .setDownloadProgram({
          deviceIds: [this.curDevice.equipmentCode],
        })
        .catch((err) => {
          console.log(err);
        });
      if (res.code !== "200") {
        this.$message.error(res.msg);
      } else {
        this.$message.success("播放成功");
      }
    },
    // 页面控制结束

    // 信息发布公共功能----------------------------------------------------STARTS
    // tabs页签切换
    changeTabs(key) {
      this.tabKey = key;
      this.$router.push({
        path: "/application-manage/display/list",
        query: { tabKey: key },
      });
    },

    // 信息发布媒体库、节目库预览
    async displayPreview(funModules, mediaList) {
      this.mediaListKey += 1;
      this.mediaList = [];
      if (funModules == "displayMediaLibrary") {
        this.mediaList.push(mediaList);
      } else if (funModules == "displayProgramLibrary") {
        await this.displayGetProgram(mediaList).then((res) => {
          this.mediaList = res;
        });
      }
      if (this.mediaList.length == 0) {
        this.$message.warning("没有节目");
        return;
      }
      console.log("预览列表", mediaList);
      this.visiblePreview = true;
    },
    async displayGetProgram(mediaList) {
      let opt = {
        prejectId: mediaList.projectId,
        programId: mediaList.programId,
      };
      let res = await display.getMediaInfo(opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res.data.regions) || res.code != 200) {
        this.$message.warning("没有节目");
        return;
      }
      return res.data.regions[0].items;
    },

    // 信息发布公共功能----------------------------------------------------END

    // -------------------------信息发布媒体库---START------------------------
    // 信息发布媒体库搜索
    searchMedia() {
      this.queryObjMedia.projectId = this.projectId;
      this.$bus.emit("loadQueryListMedia", true, this.queryObjMedia);
    },
    // 信息发布媒体库过滤媒体类型
    changeMediaType(val) {
      if (val == 0) {
        this.queryObjMedia.mediaName = "";
        delete this.queryObjMedia.mediaName;
        this.queryObjMedia.type = val;
      } else {
        this.queryObjMedia.type = val;
      }
      this.queryObjMedia.projectId = this.projectId;
      this.$bus.emit("loadQueryListMedia", true, this.queryObjMedia);
    },

    // 信息发布媒体审核
    handleMedioClick(val) {
      let status = val.key;
      console.log("审核", val);
      this.displayMediaAuditClick(status);
    },
    async displayMediaAuditClick(status) {
      this.$bus.emit("displayMediaAudit", status);
    },

    //信息发布媒体库删除媒体信息(可批量删除)
    async displayMediaDelete() {
      this.$bus.emit("displayMediaDelete");
    },
    // --------------------------信息发布媒体库---END-----------------------

    // --------------------------信息发布节目库---START-----------------------
    // 信息发布媒体库搜索
    searchProgram() {
      this.queryObjProgram.projectId = this.projectId;
      this.$bus.emit("loadQueryListProgram", true, this.queryObjProgram);
    },
    // 信息发布节目审核
    handleProgramClick(val) {
      let status = val.key;
      console.log("节目审核", val);
      this.$bus.emit("displayProgramAudit", status);
    },

    //信息发布节目库删除节目信息（可批量删除）
    async displayProgramDelete() {
      this.$bus.emit("displayProgramDelete");
    },

    // --------------------------信息发布节目库---END-----------------------

    // --------------------------信息发布分组-----START---------------------
    // 信息发布分组搜索
    searchGroup() {
      this.queryObjGroup.projectId = this.projectId;
      this.$bus.emit("loadQueryListGroup", true, this.queryObjGroup); //分组
    },
    // 新增/编辑分组对话框
    showModalAddGroup(isEdit) {
      this.visibleAddGroup = !this.visibleAddGroup;
      this.modalTitleGroup = isEdit ? "编辑组" : "新建组";
    },
    // 给分组添加大屏对话框
    showModelGroupAddScreen(isShow) {
      this.visibleGroupAddScreen = !this.visibleGroupAddScreen;
      if (isShow) this.$bus.emit("displayGetWithoutGroupScreen");
    },
    // ---------------------------信息发布分组---END----------------------

    // ---------------------------信息发布任务---START--------------------------
    // 信息发布任务搜索
    searchTask() {
      this.queryObjTask.projectId = this.projectId;
      this.$bus.emit("loadQueryListTask", true, this.queryObjTask);
    },

    //信息发布任务删除（可批量删除）
    displayTaskDelete() {
      this.$bus.emit("displayTaskDelete");
    },

    // --------------------------信息发布任务---END-----------------

    async loadSiderChart() {
      try {
        this.queryObj.projectId = this.projectId;
        let res = await display.findByOnNetCount(this.queryObj);
        if (res.code !== "200") {
          return;
        }
        let obj = res.data;
        this.chartTitle += " " + obj.allTotal;
        this.sliderChartData = [
          {
            chartText: "在线率",
            chartVal: Math.round((obj.onTotal / obj.allTotal) * 100) || 0,
          },
          {
            chartText: "离线率",
            chartVal: Math.round((obj.offTotal / obj.allTotal) * 100) || 0,
          },
          {
            chartText: "故障率",
            chartVal: Math.round((obj.errorTotal / obj.allTotal) * 100) || 0,
          },
        ];
      } catch (err) {
        console.info(err);
      }
    },
  },
};
</script>

<style  lang="less">
</style>
