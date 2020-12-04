<template>
  <div>
    <a-table
      class="Application_table"
      :columns="columns"
      :dataSource="dataList"
      :rowKey="record => record.id"
      :pagination="devicePagination"
      @change="changePageDevice"
    >
      <template
        slot="LongitudeLatitudeState"
        slot-scope="text,record"
      >{{record.longitude}}，{{record.latitude}}
      </template>
      <template
        slot="parkingStatus"
        slot-scope="text, record"
      >
        <a-badge
          :status="Number(record.parkingStatus)?'processing':'success'"
          :text="Number(record.parkingStatus)?'使用中':'闲置中'"
        />
      </template>
      <div
        slot="action"
        slot-scope="text, record"
        class="action_btn"
      >
        <a-tooltip title="详情">
          <a-icon
            type="eye"
            @click="showModalEquipInfo(record)"
          />
        </a-tooltip>
        <a-tooltip title="明细">
          <a-icon
            class="pl10"
            type="snippets"
            @click="showModalEquipList(record.parkingCode)"
          />
        </a-tooltip>
        <a-tooltip title="监控">
          <a-icon
            class="pl10"
            type="video-camera"
            @click="showModalViewCamera(record.cameraEquipmentCode)"
          />
        </a-tooltip>
        <a-tooltip title="编辑">
          <a-icon
            class="pl10"
            type="edit"
            @click="showModalParkingEdit(record)"
          />
        </a-tooltip>
        <a-tooltip title="删除">
          <a-icon
            class="pl10"
            type="delete"
            @click="showModalDeleteInfo(record.id)"
          />
        </a-tooltip>
      </div>
    </a-table>

    <!-- 查看设备信息 -->
    <a-modal
      title="车位信息"
      class="application_modal"
      :visible="visibleEquipInfo"
      :width="600"
      :closable="false"
    >
      <template slot="footer">
        <a-button
          type="primary"
          @click="handleModelEquipOk"
        >关闭</a-button>
      </template>
      <a-descriptions
        title=""
        size="small"
        :column=2
        bordered
      >
        <a-descriptions-item label="车位编号">
          {{equipInfoView.parkingCode}}
        </a-descriptions-item>

        <a-descriptions-item label="安装位置">
          {{equipInfoView.parkingAddress}}
        </a-descriptions-item>
        <a-descriptions-item label="安装时间">
          {{equipInfoView.createDate}}
        </a-descriptions-item>
        <a-descriptions-item label="车位状态">
          <a-badge
            :status="Number(equipInfoView.parkingStatus)?'processing':'success'"
            :text="Number(equipInfoView.parkingStatus)?'使用中':'闲置中'"
          />
        </a-descriptions-item>
        <a-descriptions-item label="经度">
          {{equipInfoView.longitude}}
        </a-descriptions-item>
        <a-descriptions-item label="纬度">
          {{equipInfoView.latitude}}
        </a-descriptions-item>
        <a-descriptions-item
          label="车位描述"
          :span="2"
        >
          {{equipInfoView.parkingDesc}}
        </a-descriptions-item>
        <a-descriptions-item
          label="监控设备编码"
          :span="2"
        >
          {{equipInfoView.cameraEquipmentCode}}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>

    <!-- 查看车位记录 start-->
    <ModalParkingDetail
      :code="currentParkingCode"
      :visible="visibleEquipList"
      @returnParkingDetailVisible="returnParkingDetailVisible"
    />
    <!-- 查看车位记录 end-->

    <!-- 查看监控  start-->
    <a-modal
      class="application_modal"
      v-model="visibleViewCamera"
      title="查看监控"
      ok-text="确认"
      cancel-text="取消"
      :footer="null"
      @cancel="handleModelVideoCancel"
    >
      <div>
        <a-row class="mb10">
          <a-col :span="12">设备名称：{{cameraInfo.equipmentName}}</a-col>
          <a-col
            :span="12"
            class="ar"
          >
            <a-button
              type="dashed"
              ghost
              icon="fullscreen"
              @click="fullscreenClick('video' + cameraInfo.id)"
            >全屏</a-button>
          </a-col>
        </a-row>
        <VideoInfo
          :id="'video' + cameraInfo.id"
          :curDevice="cameraInfo"
          v-if="visibleViewCamera"
        />
      </div>
    </a-modal>
    <!-- 查看监控  end-->
  </div>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import ModalParkingDetail from "@/components/Etc/ModalParkingDetail.vue";
import VideoInfo from "@/components/video/VideoInfo.vue";
import Etc from "@/api/Etc";

import { Badge, Tooltip } from "ant-design-vue";

import Camera from "@/api/Camera.js";
const cameraApi = new Camera();
const api = new Etc();

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    width: 60,
    align: "center",
  },
  {
    title: "车位编号",
    dataIndex: "parkingCode",
    width: 80,
    align: "center",
  },
  {
    title: "车位描述",
    dataIndex: "parkingDesc",
    ellipsis: true,
  },
  {
    title: "车位地点",
    dataIndex: "parkingAddress",
    ellipsis: true,
  },
  {
    title: "车位经纬度",
    dataIndex: "LongitudeLatitudeState",
    scopedSlots: { customRender: "LongitudeLatitudeState" },
    width: 120,
  },
  {
    title: "车位状态",
    dataIndex: "parkingStatus",
    scopedSlots: { customRender: "parkingStatus" },
    width: 80,
    align: "center",
  },
  {
    title: "操作",
    align: "center",
    width: 150,
    scopedSlots: {
      customRender: "action",
    },
  },
];

export default {
  mixins: [baseMixin],
  components: {
    aBadge: Badge,
    aTooltip: Tooltip,
    ModalParkingDetail,
    VideoInfo,
  },
  props: {
    searchValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      columns,
      dataList: [],
      devicePagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal: (total) => `共 ${total} 条`,
      },
      visibleEquipInfo: false, // 查看设备信息modal
      equipInfoView: {}, // 查看设备信息-数据
      visibleEquipList: false, // 查看车位记录modal
      currentParkingCode: "", // 查看车位记录 当前车位号
      visibleViewCamera: false,
      cameraInfo: {}, // 监控流信息
    };
  },
  watch: {
    searchValue: {
      handler(value) {
        let param = value;
        this.devicePagination.current = 1;
        this.loadData(param);
      },
      deep: true,
    },
  },
  created() {
    this.devicePagination.current = 1;
    this.loadData({});
  },
  methods: {
    // 删除
    showModalDeleteInfo(id) {
      let parkingId = id;
      const _this = this;
      this.$modal.confirm({
        title: "确定要删除吗?",
        okText: "确定",
        cancelText: "取消",
        centered: true,
        class: "application_modal",
        onOk() {
          _this.loadDeleteData({ id: parkingId });
          _this.loadData({});
        },
        onCancel() {},
      });
    },
    // 编辑
    showModalParkingEdit(val) {
      let value = val;
      this.$emit("returnParkingEdit", value);
    },
    // 查看车位记录
    showModalEquipList(code) {
      let parkingCode = code;
      this.currentParkingCode = parkingCode;
      this.visibleEquipList = true;
    },
    // 关闭车位
    returnParkingDetailVisible(val) {
      this.visibleEquipList = val;
    },
    // 弹出modal
    showModalEquipInfo(val) {
      this.equipInfoView = val;
      this.visibleEquipInfo = true;
    },
    // 关闭modal
    handleModelEquipOk() {
      this.visibleEquipInfo = false;
      this.equipInfoView = {};
    },
    // 分页
    changePageDevice(pagination) {
      this.devicePagination.current = pagination.current;
      let params = {};
      if (this.searchValue) {
        params = this.searchValue;
      }
      this.loadData(params);
    },
    // 查看监控 -打开
    showModalViewCamera(record) {
      let value = record;
      let param = {
        equipmentCode: value,
      };
      this.loadCameraData(param);
      this.visibleViewCamera = true;
    },
    // 查看监控 关闭
    handleModelVideoCancel() {
      this.cameraInfo = {};
      this.visibleViewCamera = false;
      clearInterval();
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
    // 获取监控
    async loadCameraData(params) {
      let res = await cameraApi.findByCamera(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.cameraInfo = res.data;
    },

    // 数据删除
    async loadDeleteData(params) {
      let res = await api.deleteInfo(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.$message.success("车位删除成功");
    },

    // 获取数据
    async loadData(params) {
      params.pageNum = this.devicePagination.current;
      params.pageSize = this.devicePagination.pageSize;
      let opt = Object.assign(params, { projectId: this.projectId });
      let res = await api.findParkingSpaceList(opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.dataList = res.data.list;
      this.devicePagination.current = res.data.pageNum;
      this.devicePagination.total = res.data.total;
    },
  },
};
</script>
