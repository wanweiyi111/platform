<template>
  <div class="manage-con">
    <a-row>
      <a-col :span="24">
        <div class="Application-con_header">
          <div class="top">
            <i class="iconfont iconlightbulb1"></i>
            <span>智慧照明</span>
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
                智慧照明
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
                  <a-form-item :label="Number(tabKey)==1?'设备名称':'名称'">
                    <a-input
                      v-decorator="[
                      'equipName',
                      {rules: [{ message: '请输入' + Number(tabKey)==1?'设备名称':'名称' }]},
                    ]"
                      :placeholder="Number(tabKey)==1?'请输入设备名称':'请输入名称'"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="设备状态"
                    v-if="Number(tabKey)==1"
                  >
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
            @change="tabsCallback"
            :activeKey="tabKey"
          >
            <a-tab-pane
              key="1"
              tab="概览"
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
                  <a-popconfirm
                    okText="确认"
                    cancelText="取消"
                    @confirm="() => onPopconfirmSwite(record)"
                  >
                    <span slot="title">
                      确定{{Number(record.onOff)?'关闭':'开启'}}该状态？
                    </span>

                    <a-switch
                      :checked="Number(record.onOff)?true:false"
                      checked-children="开"
                      un-checked-children="关"
                    />
                  </a-popconfirm>
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
                  <a-tooltip title="状态记录">
                    <a-icon
                      type="snippets"
                      :style="{ paddingLeft: '10px' }"
                      @click="showModalEquipStates(record.equipmentCode)"
                    />
                  </a-tooltip>
                  <a-tooltip title="设置亮度">
                    <a-icon
                      type="bulb"
                      :style="{ paddingLeft: '10px',color: Number(record.onOff)?'':'#666' }"
                      :class="Number(record.onOff)?'':'noClick'"
                      @click="showModalSetBrightness(record)"
                    />
                  </a-tooltip>
                </div>
              </a-table>
            </a-tab-pane>
            <a-tab-pane
              key="2"
              tab="分组"
            >
              <div class="tab-btns">
                <a-button
                  type="dashed "
                  icon="plus"
                  class="mr15"
                  @click="showModalAddGroup"
                >新建分组</a-button>
                <a-button
                  type="dashed"
                  icon="delete"
                  @click="lightGroupDelete"
                  :disabled="isDisabledBtn"
                >删除分组</a-button>
              </div>
              <a-table
                class="Application_table"
                :columns="columnsGrouping"
                :data-source="dataListLightGroup"
                :pagination="paginationLightGroup"
                :bordered="false"
                :rowSelection="{onSelect: onSelectRow,onSelectAll: onSelectAllRow}"
                :rowKey="record => record.id"
                @change="changePageLightGroup"
              >
                <span
                  slot="netkState"
                  slot-scope="text, record"
                  v-if="!record.children"
                >
                  <a-badge
                    :status="Number(record.networkState)?'success':'default'"
                    :text="Number(record.networkState)?'正常':'离线'"
                  />

                </span>
                <span
                  slot="workStatus"
                  slot-scope="text, record"
                  v-if="!record.children"
                >
                  <a-badge
                    :status="Number(record.equipmentStatus)?'success':'error'"
                    :text="Number(record.equipmentStatus)?'正常':'故障'"
                  />
                </span>
                <div
                  slot="action"
                  slot-scope="text, record"
                  class="action_btn"
                >
                  <!-- 资源类型（resourceType）为1时可编辑修改信息，为2时不可修改；级别（rank）是child(子节点) -->
                  <div v-if="!record.rank">
                    <a-tooltip
                      title="编辑"
                      v-if="record.resourceType===1"
                    >
                      <a-icon
                        type="edit"
                        @click="() => lightGroupingEdit(record.id)"
                      />
                    </a-tooltip>
                    <a-tooltip
                      title="添加设备"
                      v-if="record.resourceType==1"
                    >
                      <a-icon
                        type="plus"
                        :style="{ paddingLeft: '10px' }"
                        @click="() => lightGroupingAddLight(record.id)"
                      />
                    </a-tooltip>
                    <a-popconfirm
                      okText="确认"
                      cancelText="取消"
                      @confirm="() => onPopconfirmSwite(record)"
                    >
                      <span slot="title">
                        确定{{Number(record.light)?'关闭':'开启'}}？
                      </span>
                      <a-switch
                        v-if="record.resourceType == 1"
                        checkedChildren="开启"
                        unCheckedChildren="关闭"
                        class="ml10"
                        :checked="Number(record.light)?true:false"
                      />
                    </a-popconfirm>
                  </div>
                </div>
              </a-table>
            </a-tab-pane>
            <a-tab-pane
              key="3"
              tab="任务"
            >
              <div class="tab-btns">
                <a-button
                  type="dashed "
                  icon="plus"
                  class="mr15"
                  @click="goNewTask"
                >新建任务
                </a-button>
                <a-button
                  type="dashed"
                  icon="delete"
                  @click="lightTaskDelete"
                >删除任务</a-button>
              </div>
              <a-table
                class="Application_table"
                :columns="columnsTask"
                :data-source="dataListLightTask"
                :pagination="paginationLightTask"
                :bordered="false"
                :loading="loadingTableLightTask"
                :rowSelection="{onSelect: onSelectRow,onSelectAll: onSelectAllRow}"
                :rowKey="record => record.id"
                @change="changePageLightTask"
              >
                <!-- 操作 -->
                <template
                  slot="action"
                  slot-scope="text, record"
                >
                  <div
                    class="action_btn"
                    v-if="!record.rank"
                  >
                    <a-tooltip title="编辑">
                      <a-icon
                        type="edit"
                        @click="() => lightAddTask(record)"
                      />
                    </a-tooltip>
                    <a-tooltip title="修改状态">
                      <a-icon
                        :style="{ paddingLeft: '10px' }"
                        :type="record.statusCode==1?'eye':'eye-invisible'"
                        @click="() => lightTaskChangeState(record)"
                      />
                    </a-tooltip>
                  </div>
                </template>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
    <!-- 新建分组 -->
    <a-modal
      class="application_modal"
      :title="addGroupTitle"
      v-model="visible"
      @cancel="handleCancel"
    >
      <a-form :form="addGroup">
        <a-form-item
          label="组名"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input v-decorator="[
              'groupName',
              { rules: [{ required: true, message: '请输入组名!' }] }
            ]" />
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button
          key="back"
          @click="handleCancel"
        >取消</a-button>
        <a-button
          key="submit"
          type="primary"
          @click="handleAddGroup"
        >确认</a-button>
      </template>
    </a-modal>

    <!-- 给分组添加灯 -->
    <a-modal
      class="application_modal"
      title="灯信息"
      v-model="visibleGroupAddLight"
      @cancel="cancelGroupAddLight"
    >
      <a-form :form="groupAddLight">
        <a-form-item
          label="路灯名"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-select
            mode="multiple"
            v-decorator="[
              'list',
              { rules: [{ required: true, message: '请选择灯!' }] }
            ]"
          >
            <a-select-option
              v-for="item in lightList"
              :key="item.id"
              :value="item.id"
            >{{ item.equipmentName }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button
          key="back"
          @click="cancelGroupAddLight"
        >取消</a-button>
        <a-button
          key="submit"
          type="primary"
          @click="handleGroupAddLight"
        >确认</a-button>
      </template>
    </a-modal>
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
        :column=2
        :style="{paddingTop:'15px'}"
        bordered
      >
        <a-descriptions-item label="开关状态">
          {{Number(equipInfoView.onOff)?'开启':'关闭'}}
        </a-descriptions-item>
        <a-descriptions-item label="亮度">
          {{equipInfoView.brightness}}
        </a-descriptions-item>
        <a-descriptions-item label="电压(mV)">
          {{equipInfoView.voltage}}
        </a-descriptions-item>
        <a-descriptions-item label="电流(mA)">
          {{equipInfoView.current}}
        </a-descriptions-item>
        <a-descriptions-item label="功率(W)">
          {{equipInfoView.activePower}}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
    <!-- 查看设备状态记录 -->
    <a-modal
      title="设备状态记录"
      class="application_modal"
      :visible="visibleEquipStates"
      :width="700"
      :footer="null"
      @cancel="handleModelEquipStatesOk"
    >
      <a-form
        :form="EquipStatesForm"
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
            @click="handleReset"
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
      </a-table>
    </a-modal>
    <!-- 概览-设置亮度 -->
    <a-modal
      class="application_modal"
      v-model="visibleSetBrightness"
      title="亮度设置"
      ok-text="确认"
      cancel-text="取消"
      @ok="handleModelSetBrightnessOk"
      :closable="false"
    >
      <template slot="footer">
        <a-button
          type="primary"
          @click="handleModelSetBrightnessOk"
        >关闭</a-button>
      </template>
      <a-row style="lineHeight:38px;">
        <a-col :span="4">照明亮度:</a-col>
        <a-col :span="20">
          <a-row>
            <a-col :span="20">
              <a-slider
                :min="0"
                :max="100"
                :disabled="!Boolean(equipInfoView.onOff)"
                v-model="equipInfoView.brightness"
                class="slider"
                @afterChange="onSliderafterChange(equipInfoView.equipmentCode, $event)"
              />
            </a-col>
            <a-col :span="4">{{equipInfoView.brightness}}%</a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import _ from "lodash";
import MapMixin from "@/mixins/map.js";
import baseMixin from "@/mixins/base.js";
import utils from "@/utils/";
import Api from "@/api";
import RunTime from "@/api/RunTime";
import { mapMutations } from "vuex";
import { Tooltip, Popconfirm } from "ant-design-vue";

const api = new Api();
const rt = new RunTime();
// 照明概览
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
// 照明概览-设备状态
const columnsEqiopStates = [
  {
    title: "ID",
    dataIndex: "id",
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
    dataIndex: "netkState",
    width: 80,
    align: "center",
    scopedSlots: { customRender: "netkState" },
  },
  {
    title: "工作状态",
    width: 80,
    align: "center",
    dataIndex: "workStatus",
    scopedSlots: { customRender: "workStatus" },
  },
  {
    title: "电压(mV)",
    dataIndex: "voltage",
  },
  {
    title: "电流(mA)",
    dataIndex: "current",
  },
];

// 照明分组colums数据
const columnsGrouping = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "资源名称",
    dataIndex: "resourceName",
    ellipsis: true,
  },
  {
    title: "安装位置",
    dataIndex: "location",
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
    title: "操作",
    dataIndex: "action",
    width: 150,
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];

// 照明任务colums数据
const columnsTask = [
  {
    title: "ID",
    width: 80,
    align: "center",
    dataIndex: "id",
  },
  {
    title: "计划名称",
    dataIndex: "taskName",
    ellipsis: true,
  },
  {
    title: "所属控制器",
    ellipsis: true,
    dataIndex: "resourceName",
  },
  {
    title: "日期段",
    dataIndex: "dateRange",
  },
  {
    title: "触发点",
    dataIndex: "pointInTime",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    width: 140,
    ellipsis: true,
  },
  {
    title: "计划状态",
    width: 80,
    align: "center",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "操作",
    width: 80,
    align: "center",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
  },
];

// 照明任务详情colums数据
const columnsTaskInfo = [
  {
    title: "ID",
    dataIndex: "id",
    width: "40%",
  },
  {
    title: "资源名称",
    dataIndex: "resourceName",
    width: "60%",
    scopedSlots: { customRender: "resourceName" },
  },
];
export default {
  mixins: [baseMixin, MapMixin],
  components: {
    aTooltip: Tooltip,
    aPopconfirm: Popconfirm,
  },
  data() {
    return {
      // columns,
      columnsGrouping, //照明--分组colums数据
      columnsTask, //照明--任务colums数据
      columnsTaskInfo,
      allDevice: [], //照明--概览列表数据
      dataListLightGroup: [], //照明--分组列表数据
      dataListLightTask: [], //照明--任务列表数据
      paginationLightGroup: {
        //照明--分组分页数据
        current: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0, //总数
        showTotal: (total) => `共 ${total} 条`, // 显示总数
      },
      paginationLightTask: {
        //照明--任务分页数据
        current: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0, //总数
        showTotal: (total) => `共 ${total} 条`, // 显示总数
      },
      loadingTableLightTask: false,
      tabKey: "1",
      visible: false, // 是否显示新建分组modal
      addGroupTitle: "新建组",
      addGroup: this.$form.createForm(this),
      groupAddLight: this.$form.createForm(this),
      ChartOpt: [],
      funModules: "grouping",
      selectedRowsData: [], //选择的列表信息数据
      lightDeleteData: {},
      isEdit: false, //判断是编辑还是新建
      isDisabledBtn: false, //是否禁用分组删除按钮
      lightGroupId: "",
      hoverDevice: {},
      groupSearchdata: "", //分组搜索数据
      taskSearchdata: "", //任务搜索数据
      visibleTaskInfo: false, //任务信息对话框
      dataListTaskInfo: [], //任务信息详情数据
      lightList: [], //未分组的灯
      visibleGroupAddLight: false, //给分组添加灯的对话框
      currentGroupId: "",
      sliderChartData: [],
      chartTitle: "路灯数",
      searchForm: this.$form.createForm(this, { name: "advanced_search" }),
      equipObj: {}, // 概览参数
      columnsView,
      allDevicePageInfo: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共 ${total} 条`, // 显示总数
      },
      visibleEquipInfo: false, // 查看设备信息modal
      equipInfoView: {}, // 查看设备信息-数据
      modalActiveKey: ["1"], // 查看设备信息-当前展开栏
      visibleEquipStates: false, // 设备状态记录modal
      equipStatesList: [], // 设备状态记录
      equipStatesObj: {
        // 带参
        // equipmentCode: "",
        // startTime: "",
        // projectId: "",
        // endTime: "",
        // page: 1,
      },
      equipStatesPageInfo: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共 ${total} 条`, // 显示总数
      },
      EquipStatesForm: this.$form.createForm(this, { name: "equipStatesForm" }), //设备状态记录 搜索表单
      columnsEqiopStates,
      loadingTableEquipStates: false,
      visibleSetBrightness: false, // 设置亮度
    };
  },
  created() {
    let routeData = this.$route;
    let currentMenuId = routeData.meta.id || "";
    let currentMenuParentId = routeData.meta.parentId || "";
    this.setCurrentMenu(currentMenuId);
    this.setCurrentParentMenu(currentMenuParentId);

    this.tabKey = this.$route.query.tabKey || "1";
    this.loadlightGroupingList();
    this.loadlightTaskList();
    this.handlePostDevice();
  },
  methods: {
    ...mapMutations(["addCtrlMsgId", "setCurrentMenu", "setCurrentParentMenu"]),
    // tabs回调
    tabsCallback(key) {
      this.tabKey = key;
      this.handleReset();
    },
    // 设备概览-开关
    onPopconfirmSwite(e) {
      let objVal = e;
      console.log("当前tab", this.tabKey);
      if (this.tabKey == 1) {
        this.setOnOff(objVal);
      } else if (this.tabKey == 2) {
        this.setOnOffGroupLights(objVal);
      }
    },
    // 选择列表信息
    onSelectRow(record, selected, selectedRows) {
      this.selectedRowsData = selectedRows;
      this.getLightRowData(selectedRows);
    },
    // 选择全部
    onSelectAllRow(selected, selectedRows) {
      this.selectedRowsData = selectedRows;
      this.getLightRowData(selectedRows);
    },
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
        if (this.tabKey == 1) {
          this.allDevicePageInfo.current = 1;
          this.handlePostDevice();
        } else if (this.tabKey == 2) {
          this.paginationLightGroup.current = 1;
          this.loadlightGroupingList();
        } else {
          this.paginationLightTask.current = 1;
          this.loadlightTaskList();
        }
      });
    },
    // 搜索重置
    handleReset() {
      this.searchForm.resetFields();
      this.EquipStatesForm.resetFields();
      this.equipObj.equipmentName = "";
      this.equipObj.equipmentStatus = "";
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
    // 照明概览
    async handlePostDevice() {
      this.equipObj.pageNum = this.allDevicePageInfo.current;
      this.equipObj.pageSize = this.allDevicePageInfo.pageSize;
      this.equipObj.projectId = this.projectId;
      let res = await api.findByProjectIdPaged(this.equipObj);
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      let ligthData = res.data;
      this.allDevice = ligthData.list;
      this.allDevicePageInfo.current = ligthData.pageNum;
      this.allDevicePageInfo.total = ligthData.total;
    },
    /* 设备状态记录 */
    async handlePostEquipStates() {
      this.equipStatesObj.page = this.equipStatesPageInfo.current;
      this.equipStatesObj.projectId = this.projectId;
      let res = await rt.light(this.equipStatesObj);
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.equipStatesPageInfo.current = res.data.current;
      this.equipStatesPageInfo.total = res.data.total;
      this.equipStatesList = res.data.records;
      this.loadingTableEquipStates = false; // 表格loding
      this.visibleEquipStates = true; // 数据加载完 再显示modal
    },
    // 设置亮度-打开modal
    showModalSetBrightness(val) {
      this.equipInfoView = val;
      this.visibleSetBrightness = true;
    },
    // 设置亮度-关闭modal
    handleModelSetBrightnessOk() {
      this.visibleSetBrightness = false;
    },
    // 设置亮度
    async onSliderafterChange(code, val) {
      let opt = { level: val, deviceIds: [code], projectId: this.projectId };
      let res = await api.setBrightness(opt);
      if (res.code != "200") {
        this.$message.error(res.msg);
        return;
      }
      this.$message.success("修改成功");
    },
    // 照明概况-分页
    changePageDevice(pages) {
      this.allDevicePageInfo.current = pages.current;
      this.handlePostDevice();
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
      this.EquipStatesForm.resetFields();
    },
    // 设备状态记录 时间选择
    changeDateRange(dates) {
      console.log("时间选择", dates);
      this.equipStatesObj.startTime = dates[0].format(utils.fsTime);
      this.equipStatesObj.endTime = dates[1].format(utils.fsTime);
    },
    // 设备状态记录 搜索
    handleSubmitEquipStates(e) {
      e.preventDefault();
      this.EquipStatesForm.validateFields((err, values) => {
        if (err) {
          return;
        }
        if (values.rangepicker.length > 0) {
          this.equipStatesPageInfo.current = 1;
          this.handlePostEquipStates();
        } else {
          this.$message.info("请选择时间搜索");
        }
      });
    },
    //  设备状态记录 分页
    changePageEquipStates(pages) {
      this.equipStatesPageInfo.current = pages.current;
      this.handlePostEquipStates();
    },
    // 照明概览-列表开关
    async setOnOff(obj) {
      let equipInfo = obj;
      const onOff = Number(equipInfo.onOff) ? 0 : 1;
      try {
        const messageId = this.createMsgId(equipInfo, "onoff");
        this.addCtrlMsgId(messageId);
        const data = {
          messageId,
          deviceIds: [equipInfo.equipmentCode],
          onOff: onOff,
        };
        let res = await api.setOnOff(data);
        if (res.code !== "200") {
          this.$message.error(res.msg);
        } else {
          this.handlePostDevice();
          this.$message.success(res.msg);
        }
      } catch (err) {
        this.$message.error(err.toString());
      }
    },
    // 处理接口返回的数据，给列表设置唯一key
    processingData(data, mode) {
      console.log(mode);
      let processedData =
        data &&
        data.map((_, index) => {
          if (_.resourceType == 2) {
            delete _.children;
          }
          _.onOff = false;
          _["key"] = index + 1;
          return _;
        });
      return processedData;
    },
    // 照明分组各功能逻辑-----------------------------------------START
    // 获取照明--分组列表数据
    async loadlightGroupingList(flag) {
      if (flag) this.paginationLightGroup.current = 1;
      let params = `/${this.paginationLightGroup.current}/${this.paginationLightGroup.pageSize}`;
      let res = await api
        .lightGroupQueryList(params, {
          resourceName: this.equipObj.equipmentName,
          projectId: this.projectId,
        })
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code != 200) {
        return;
      }
      this.paginationLightGroup.current = res.data.current;
      this.paginationLightGroup.total = res.data.total;
      this.dataListLightGroup = this.processingData(res.data.records);
    },
    // 照明--分组列表分页
    changePageLightGroup(pages) {
      this.paginationLightGroup.current = pages.current;
      this.loadlightGroupingList();
    },
    // 照明分组点击列表编辑按钮显示编辑对话框
    async lightGroupingEdit(id) {
      this.showModalAddGroup();
      this.addGroupTitle = "编辑组";
      let res = await api.lightGroupQuery(id).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        return;
      }
      console.log("bianji", res);
      this.addGroup.setFieldsValue({
        groupName: res.data.resourceName,
      });
      this.lightGroupId = res.data.id;
      this.isEdit = true;
    },
    // 照明--分组根据当前ID获取未分组的灯
    async lightGroupingAddLight(id) {
      this.visibleGroupAddLight = true;
      this.currentGroupId = id;
      let res = await api
        .lightGroupGetLight({ projectId: this.projectId })
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code != 200) {
        return;
      }
      this.lightList = res.data;
    },
    // 取消/隐藏分组添加灯信息对话框
    cancelGroupAddLight() {
      this.groupAddLight.resetFields();
      this.visibleGroupAddLight = false;
    },
    // 照明--分组给分组添加灯
    handleGroupAddLight(e) {
      e.preventDefault();
      this.groupAddLight.validateFields((err, values) => {
        if (!err) {
          let obj = Object.assign({ groupId: [this.currentGroupId] }, values);
          this.lightGroupAddLight(obj);
        }
      });
    },
    // 分组添加新灯
    async lightGroupAddLight(values) {
      let res = await api.lightGroupGlAdd(values).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning(res.msg);
        return;
      }
      this.paginationLightGroup.current = 1;
      this.paginationLightGroup.total = res.data.total;
      this.dataListLightGroup = this.processingData(res.data.records);
      this.$message.success("路灯添加成功");
      this.cancelGroupAddLight();
    },
    // 照明分组根据ID修改分组信息
    async lightGroupingModified(modifiedData) {
      let res = await api.lightGroupModify(modifiedData).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning("修改失败！");
        return;
      }
      this.paginationLightGroup.current = res.data.current;
      this.paginationLightGroup.total = res.data.total;
      this.dataListLightGroup = this.processingData(res.data.records);
      this.$message.success("修改成功！");
      this.handleCancel();
    },

    // 显示新增分组对话框
    showModalAddGroup() {
      this.visible = true;
      this.addGroupTitle = "新建组";
    },
    // 照明分组新建分组
    async lightGroupAddGroup(formData) {
      formData.projectId = this.projectId;
      let res = await api.lightGroupAdd(formData).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != "200") {
        this.$message.warning(res.msg);
        return;
      }
      this.loadlightGroupingList();
      this.handleCancel();
      this.$message.success("分组新建成功");
    },
    // 导入新分组
    handleAddGroup(e) {
      e.preventDefault();
      this.addGroup.validateFields((err, values) => {
        if (!err) {
          if (this.isEdit) {
            let modifiedData = {};
            modifiedData["id"] = this.lightGroupId;
            modifiedData["resourceName"] = values["groupName"];
            this.lightGroupingModified(modifiedData);
            this.isEdit = false;
          } else {
            this.lightGroupAddGroup(values);
          }
        }
      });
    },
    // 取消/隐藏新增分组对话框
    handleCancel() {
      this.visible = false;
      this.addGroup.resetFields();
    },
    // 组开关状态
    async setOnOffGroupLights(record) {
      let { children, light, id } = record;
      let onOff = Number(light) ? 0 : 1;
      if (!children.length) {
        this.$message.warning("分组中没有灯！");
        return;
      }
      let deviceIds = [];
      children.forEach((light) => deviceIds.push(light.equipmentCode));
      onOff = Number(light) ? 0 : 1;
      let res = await api
        .setOnOff({
          deviceIds,
          onOff,
        })
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code != 200) {
        return;
      }
      for (let i in this.dataListLightGroup) {
        if (this.dataListLightGroup[i].id == id) {
          this.dataListLightGroup[i].light = this.dataListLightGroup[i].light
            ? 0
            : 1;
        }
      }
      this.$message.success(res.msg);
    },
    // 获取列表已选数据
    getLightRowData(data) {
      this.selectedRowsData = data;
      // 当选择了未分组的灯时，禁用删除按钮
      this.isDisabledBtn = (data || []).map((_) => _.light).some((_) => _ == 1);
      this.disposalGroupData(data);
      console.log("选择行", data);
    },
    disposalGroupData(selectedRowsData) {
      // 当选择了未分组的灯时，禁用删除按钮，light为1是未分组的灯，0是已分组的灯
      let groupId = ""; //当前分组Id
      let lightId = ""; //当前灯所属分组的Id
      let groupIds = ""; //分组Id
      let lightIds = ""; //灯的Id
      let ids = "";
      selectedRowsData.forEach((_) => {
        if (_.rank) {
          groupIds = _.groupId;
          lightId = _.groupId;
          lightIds += _.id + ",";
          if (groupId == lightId) {
            lightIds = "";
          }
        } else {
          groupIds += _.id + ",";
          groupId = _.id;
          lightIds = "";
        }
        ids += _.id + ",";
      });
      console.log("选择灯", lightIds);
      this.lightDeleteData = { groupIds, lightIds, ids };
    },
    // 删除照明分组信息
    async lightGroupDelete() {
      if (_.isEmpty(this.selectedRowsData)) {
        this.$message.warning("请选择要删除的信息！");
        return;
      }
      let params = `groupIds=${this.lightDeleteData.groupIds}&lightIds=${this.lightDeleteData.lightIds}`;
      let res = await api.lightGroupRemove(params).catch((err) => {
        console.log(err);
      });
      console.log("删除", res);
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning(res.msg);
        return;
      }
      // this.loadlightGroupingList();
      this.paginationLightGroup.current = res.data.current;
      this.paginationLightGroup.total = res.data.total;
      this.dataListLightGroup = this.processingData(res.data.records);
      this.$message.success("删除成功！");
    },
    // 照明分组功能逻辑-----------------------------------------END

    // 照明--任务功能逻辑-----------------------------------------START
    // 获取照明--任务列表数据
    async loadlightTaskList(flag) {
      this.loadingTableLightTask = true;
      if (flag) this.paginationLightTask.current = 1;
      let params = `/${this.paginationLightTask.current}/${this.paginationLightTask.pageSize}`;
      let res = await api
        .lightTaskQueryList(params, {
          resourceName: this.equipObj.equipmentName || "",
          projectId: this.projectId,
        })
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code !== 200) {
        return;
      }
      this.paginationLightTask.current = res.currentPage;
      this.paginationLightTask.total = res.totalNum;
      this.dataListLightTask = this.processingData(res.data, "lightTask");
      this.loadingTableLightTask = false;
    },
    // 照明--任务列表分页
    changePageLightTask(pages) {
      this.paginationLightTask.current = pages.current;
      this.loadlightTaskList();
    },
    // 照明-任务-新建
    goNewTask() {
      this.$router.push({
        path: "/application-manage/light-add-task",
        query: { modelTitle: "新建照明任务" },
      });
    },

    // 删除照明任务信息
    async lightTaskDelete() {
      if (_.isEmpty(this.selectedRowsData)) {
        this.$message.warning("请选择要删除的信息！");
        return;
      }
      let params = `ids=${this.lightDeleteData.ids}`;
      let res = await api.lightTaskRemove(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== 200) {
        this.$message.warning(res.msg);
        return;
      }
      this.loadlightTaskList();
      this.$message.success("删除成功！");
    },

    // 照明任务根据ID修改任务状态
    async lightTaskChangeState(data) {
      let planStateCode = data.statusCode == 1 ? 0 : 1;
      let params = `/${data.id}/${planStateCode}/${this.projectId}`;
      let res = await api.lightTaskModifyStatus(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning("修改失败！");
        return;
      }
      this.paginationLightTask.current = res.currentPage;
      this.paginationLightTask.total = res.totalNum;
      this.dataListLightTask = this.processingData(res.data);
      this.$message.success("修改成功！");
    },
    // 照明任务查看任务关联详情
    async showModalTaskInfo(id) {
      this.visibleTaskInfo = true;
      let res = await api.lightGroupQueryGroupLight(id).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning("请求失败！");
        return;
      }
      this.dataListTaskInfo = res.data;
    },
    // 照明任务隐藏任务详情对话框
    cancelTaskInfo() {
      this.visibleTaskInfo = false;
    },
    // 任务编辑
    lightAddTask(record) {
      let taskId = record.taskId;
      // let statusCode = record.statusCode;
      this.$router.push({
        path: "/application-manage/light-add-task",
        query: { modelTitle: "编辑照明任务", taskId },
      });
    },
    // 照明--任务功能逻辑-----------------------------------------END
  },
};
</script>

