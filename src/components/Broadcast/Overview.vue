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
        slot="networkState"
        slot-scope="text, record"
      >
        <a-badge
          :status="Number(record.networkState)?'success':'default'"
          :text="Number(record.networkState)?'正常':'离线'"
        />
      </template>
      <template
        slot="equipmentStatus"
        slot-scope="text, record"
      >
        <a-badge
          :status="Number(record.equipmentStatus)?'success':'error'"
          :text="Number(record.equipmentStatus)?'正常':'故障'"
        />
      </template>
      <template
        slot="onOffStatus"
        slot-scope="text, record"
      >
        <a-switch
          :checked="Number(record.onOff)?true:false"
          checked-children="开"
          un-checked-children="关"
          @click="switchChange(record,$event)"
        />
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
        <a-tooltip title="设置音量">
          <a-icon
            type="sound"
            :style="{ paddingLeft: '10px',color: Number(record.onOff)?'':'#666' }"
            :class="Number(record.onOff)?'':'noClick'"
            @click="showModalVolumeInfo(record)"
          />
        </a-tooltip>
      </div>
    </a-table>

    <!-- 查看设备信息 -->
    <a-modal
      title="设备信息"
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
    </a-modal>

    <!-- 设备音频节目 start-->
    <a-modal
      title="设备音频"
      class="application_modal"
      :visible="visibleMediaInfo"
      :width="700"
      :closable="false"
      okText="确认"
      cancelText="取消"
      @ok="handleMediaOk"
      @cancel="handleMediaCancel"
    >
      <a-row class="mb10">
        <a-col :span="8">
          <a-input-search
            placeholder="请输入音频名称"
            v-model="mediaInput"
            @search="searchMedia"
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
        <a-col :span="6"></a-col>
        <a-col :span="10">
          <a-row style="line-height: 36px;">
            <a-col :span="8">设置音量：</a-col>
            <a-col :span="12">
              <a-slider
                :min="0"
                :max="100"
                v-model="modalVol"
                class="slider"
                @afterChange="modalVolAfter"
              />
            </a-col>
            <a-col :span="4">{{modalVol}}%</a-col>
          </a-row>
        </a-col>
      </a-row>
      <MediaList
        :type="mediaType"
        :searchValue="mediaObj"
        @returnSelectedRow="returnSelectedRow"
      ></MediaList>
    </a-modal>
    <!-- 设备音频节目 end-->

    <!-- 设置音量  start-->
    <a-modal
      class="application_modal"
      v-model="visibleSetVolume"
      title="音量设置"
      ok-text="确认"
      cancel-text="取消"
      :maskClosable="false"
      :closable="false"
    >
      <template slot="footer">
        <a-button
          type="primary"
          @click="handleModelSetVolumeCancel"
        >关闭</a-button>
      </template>
      <a-row style="lineHeight:38px;">
        <a-col :span="4">音频音量:</a-col>
        <a-col :span="20">
          <a-row>
            <a-col :span="20">
              <a-slider
                :min="0"
                :max="100"
                :disabled="!Boolean(equipInfoView.onOff)"
                v-model="equipInfoView.vol"
                class="slider"
                @afterChange="onSliderafterChange(equipInfoView.equipmentCode, $event)"
              />
            </a-col>
            <a-col :span="4">{{equipInfoView.vol}}%</a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-modal>
    <!-- 设置音量  end-->
  </div>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import MediaList from "@/components/Broadcast/MediaList.vue";
import Broadcast from "@/api/Broadcast";

import { Badge, Tooltip, Switch } from "ant-design-vue";

const api = new Broadcast();

const columns = [
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
    dataIndex: "networkState",
    scopedSlots: { customRender: "networkState" },
    width: 80,
    align: "center",
  },
  {
    title: "设备状态",
    dataIndex: "equipmentStatus",
    scopedSlots: { customRender: "equipmentStatus" },
    width: 80,
    align: "center",
  },
  {
    title: "播放状态",
    width: 80,
    align: "center",
    dataIndex: "onOffStatus",
    scopedSlots: { customRender: "onOffStatus" },
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
    aSwitch: Switch,
    MediaList,
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
      visibleMediaInfo: false, // 设置音频节目
      modalVol: 10, // 设置音频节目-音量
      mediaType: "modal", //适用于modal媒体库列表
      mediaInput: "",
      mediaObj: {},
      selectedRowKeys: [], // 设置节目 已选择row
      selectedTime: [], //设置节目 已选择音频时长
      visibleSetVolume: false,
      currentOnOffStatus: false, // 当前开关按钮状态
    };
  },
  watch: {
    searchValue: {
      handler(value) {
        let param = value;
        this.loadData(param);
      },
      deep: true,
    },
  },
  created() {
    this.loadData({});
  },
  methods: {
    // 弹出modal
    showModalEquipInfo(val) {
      this.equipInfoView = val;
      this.visibleEquipInfo = true;
    },
    // 关闭modal
    handleModelEquipOk() {
      this.equipInfoView = {};
      this.visibleEquipInfo = false;
    },
    changePageDevice(pagination) {
      this.devicePagination.current = pagination.current;
      let params = {};
      if (this.searchValue) {
        params = this.searchValue;
      }
      this.loadData(params);
    },
    // 开关状态
    switchChange(val, e) {
      let state = e;
      let currentBroadcastInfo = val;
      let currentCode = [];
      currentCode.push(currentBroadcastInfo.equipmentCode);

      // 先初始化
      this.currentOnOffStatus = false;
      this.equipInfoView = {};
      // 再赋值
      this.equipInfoView = currentBroadcastInfo;
      this.currentOnOffStatus = state;

      if (state) {
        this.showModalMediaInfo();
      } else {
        const _this = this;
        this.$modal.confirm({
          title: "确定要停止播放吗?",
          okText: "确定",
          cancelText: "取消",
          centered: true,
          class: "application_modal",
          onOk() {
            let params = {
              deviceIds: currentCode,
              fileId: _this.equipInfoView.fileId,
              onOff: 0,
            };
            _this.loadPlayData(params);
            _this.$message.success("已停止播放");
            _this.devicePagination.current = 1;
            _this.loadData({});
          },
          onCancel() {},
        });
      }
    },
    // 弹出设置节目modal
    showModalMediaInfo() {
      this.visibleMediaInfo = true;
    },
    // 设置节目 返回选择row
    returnSelectedRow(val, time) {
      let rowKey = val;
      this.selectedTime = time;
      this.selectedRowKeys = rowKey;
    },
    // 设置节目 设置音量
    modalVolAfter(val) {
      this.modalVol = val;
    },
    // 设置节目 -确定
    handleMediaOk() {
      let listData = this.dataList;
      let currentBroadcastInfo = this.equipInfoView;
      let defaultVol = currentBroadcastInfo.vol || 10;
      if (this.selectedRowKeys.length > 0) {
        let currentCode = [];
        currentCode.push(currentBroadcastInfo.equipmentCode);
        let currentOnOff = 1;
        let params = {
          deviceIds: currentCode,
          fileId: this.selectedRowKeys,
          time: this.selectedTime,
          onOff: currentOnOff,
          volume: Number((this.modalVol * 0.56).toFixed(2)),
        };
        // let paramsVolum = {
        //   deviceIds: currentCode,
        //   volume: defaultVol,
        // };
        this.loadPlayData(params);
        // this.loadVolumeData(paramsVolum);
        this.dataList = this.setOnOffData(
          listData,
          currentBroadcastInfo.id,
          this.currentOnOffStatus,
          this.selectedRowKeys,
          defaultVol
        );
        this.handleMediaCancel();
      } else {
        this.$message.warning("请选择音频节目");
      }
    },
    // 设置节目 -取消
    handleMediaCancel() {
      this.visibleMediaInfo = false;
      this.mediaInput = "";
      this.mediaObj = {};
      this.selectedRowKeys = [];
    },

    // 开关按钮 onOff数据
    setOnOffData(data, currentId, state, fileId, vol) {
      let newData = (data || []).map((item) => {
        if (item.id == currentId) {
          item.onOff = state ? "1" : "0";
          item.brightness = 10;
          item.fileId = fileId;
          item.vol = vol;
        }
        return item;
      });
      return newData;
    },
    // 设置节目 -搜索
    searchMedia() {
      let obj = {};
      obj.mediaName = this.mediaInput;
      this.mediaObj = obj;
    },
    // 弹出音量modal
    showModalVolumeInfo(value) {
      this.equipInfoView = value;
      this.equipInfoView.vol = this.modalVol;
      this.visibleSetVolume = true;
    },
    // 设置音量 -关闭
    handleModelSetVolumeCancel() {
      this.equipInfoView = {};
      this.visibleSetVolume = false;
    },
    // 设置音量 -silde
    onSliderafterChange(code, val) {
      let paramsVolum = {
        deviceIds: [code],
        volume: Number((val * 0.56).toFixed(2)), // 后台最大音量56 传过去需转换
      };
      this.loadVolumeData(paramsVolum);
    },
    // 播放开关
    async loadPlayData(params) {
      let res = await api.hornOnOff(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
    },
    // 音量调整
    async loadVolumeData(paramsVolum) {
      let res = await api.hornVolume(paramsVolum).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.$message.success(res.msg);
    },
    // 获取数据
    async loadData(params) {
      params.pageNum = this.devicePagination.current;
      params.pageSize = this.devicePagination.pageSize;
      let opt = Object.assign(params, { projectId: this.projectId });
      let res = await api.findByProjectIdPaged(opt).catch((err) => {
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
