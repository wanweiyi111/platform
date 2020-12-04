<template>
  <div class="DeviceListBox">
    <a-table
      class="Application_table"
      :columns="currentColumns"
      :rowKey="record => record.id"
      :dataSource="pageDevice"
      :pagination="pageInfo"
      :customRow="cusRow"
      :rowClassName="getRowClass"
      :bordered="false"
      :rowSelection="rowSelection"
      @change="changePage"
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
      <div
        slot="onOffStatus"
        slot-scope="text, record"
      >
        <a-popconfirm
          okText="确认"
          cancelText="取消"
          @confirm="() => onPopconfirmSwite(record)"
          v-if="type=='light'|| type=='display'"
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
        <a-switch
          disabled
          :checked="Number(record.onOff)?true:false"
          checked-children="开"
          un-checked-children="关"
          v-else
        />
      </div>
      <span
        slot="editDisplay"
        slot-scope="text, record"
      >
        <i
          class="iconfont iconexclamation-circle"
          @click.stop="showDialog(record)"
        ></i>
      </span>
      <span
        slot="view"
        slot-scope="text, record"
      >
        <i
          class="iconfont iconcog editDisplay"
          @click.stop="editDisplay(record)"
        ></i>
        <i
          class="iconfont iconexclamation-circle"
          @click.stop="showDialog(record)"
        ></i>
      </span>
    </a-table>
    <a-modal
      class="application_modal"
      :visible="visibleEdit"
      @cancel="handleCancel"
      :destroyOnClose="true"
      title="设置默认播放节目"
      @ok="handleOk"
      :width="800"
      okText='确定'
      cancelText='取消'
    >
      <div class="setProgram">
        <a-input-search
          @keydown.enter="loadProgram"
          @change="inputChange"
          placeholder="请输入关键词"
          style="width: 234px;bottom:2px;margin-right:10px"
          size="small"
        />
      </div>
      <a-table
        :columns="editColumns"
        :dataSource="programs"
        :rowSelection="{ onChange: onSelectRow, selectedRowKeys }"
        :rowKey="record => record.programId"
      />
    </a-modal>
    <a-modal
      class="application_modal"
      title="设备状态记录"
      :visible="deviceVisible"
      @ok="deviceHandleOk"
      @cancel="deviceVisible=false"
      okText='确定'
      cancelText='取消'
      :width="700"
      :afterClose="afterClose"
    >
      <a-range-picker
        style="width: 200px;margin-bottom:20px"
        @change="changeDateRange"
        :placeholder="['开始时间', '结束时间']"
      />
      <i
        class="iconfont iconsync refresh"
        @click="refresh"
      ></i>
      <a-table
        class="Application_table"
        :columns="deviceColumns"
        :dataSource="deviceInfo"
        :pagination="devicePageInfo"
        :bordered="false"
        @change="changePageDevice"
        size="middle"
      >
        <template
          slot="networkState"
          slot-scope="text, record"
        >
          <span>{{record.networkState|formatNetworkState}}</span>
        </template>
        <template
          slot="equipmentStatus"
          slot-scope="text, record"
        >
          <span>{{record.equipmentStatus|formatEquipmentStatus}}</span>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import _ from "lodash";
import utils from "@/utils/";
import MapMixin from "@/mixins/map.js";
import baseMixin from "@/mixins/base.js";
import mapApi from "@/libs/MapApi.js";
import Camera from "@/api/Camera.js";
import Display from "@/api/Display";
import Radar from "@/api/Radar";
import RunTime from "@/api/RunTime";
import Environment from "@/api/Environment";
import MqttClient from "@/libs/MqttClient.js";
import Api from "@/api";

import { Badge, Popconfirm } from "ant-design-vue";

let st = 0;
const api = new Api();
const camera = new Camera();
const display = new Display();
const environment = new Environment();
const radar = new Radar();
const rt = new RunTime();
const typeArr = ["light", "camera", "display"];
const MapEntity = {
  light: api,
  camera: camera,
  display: display,
  environment: environment,
  radar,
};
const EntityIndex = [
  "",
  "light",
  "camera",
  "display",
  "environment",
  "radar",
  "etc",
];
const DeleteFunc = {
  light: "deleteLightInfo",
  camera: "delCamare",
  display: "deleteScreenInfo",
  environment: "",
  radar: "deleteInfo",
};

// const columns =;
const columns = [
  {
    title: "序号",
    align: "center",
    dataIndex: "programId",
  },
  {
    title: "节目名称",
    dataIndex: "programName",
  },
  {
    title: "创建时间",
    dataIndex: "update_time",
  },
];

const vm = {
  mixins: [baseMixin, MapMixin],
  props: {
    type: {
      type: String,
      default: "light",
    },
    enableDelete: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      deviceOpt: {
        equipmentCode: "",
        startTime: "",
        projectId: "",
        endTime: "",
        page: 1,
      },
      devicePageInfo: { total: 1, current: 1, pageSize: 10 },
      deviceColumns: [
        {
          title: "序号",
          dataIndex: "id",
          width: 60,
        },
        {
          title: "时间",
          dataIndex: "createTime",
        },
        {
          title: "联网状态",
          dataIndex: "networkState",
          width: 80,
          scopedSlots: { customRender: "networkState" },
        },
        {
          title: "工作状态",
          dataIndex: "equipmentStatus",
          scopedSlots: { customRender: "equipmentStatus" },
        },
      ],
      deviceInfo: [],
      deviceVisible: false,
      editColumns: columns,
      programs: [],
      visibleEdit: false,
      columns: [
        {
          title: "设备编码",
          dataIndex: "equipmentNumber",
          align: "center",
        },
        {
          title: "设备名称",
          dataIndex: "equipmentName",
        },
        {
          title: "安装位置",
          dataIndex: "location",
        },
        {
          title: "归属智慧杆",
          dataIndex: "poleName",
        },
        {
          title: "联网状态",
          scopedSlots: {
            customRender: "networkState",
          },
        },
        {
          title: "设备状态",
          scopedSlots: { customRender: "equipmentStatus" },
        },
        {
          title: "开关状态",
          scopedSlots: { customRender: "onOffStatus" },
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: {
            customRender: this.customFun(),
          },
        },
      ],
      pageDevice: [],
      rowSelection: this.enableDelete
        ? { onSelect: this.onSelectChange, onSelectAll: this.onSelectChange }
        : null,
      // queryObj: { projectId: this.$store.state.curProject.id },
      selectedRowIndex: -1,
      selectedDevices: [],
      selectedPrograme: [],
      selectedRowKeys: [],
      deviceId: 0,
    };
  },
  components: {
    aBadge: Badge,
    aPopconfirm: Popconfirm,
  },
  created() {
    let _this = this;
    this.loadAllDevice();
    this.loadPageDevice();
    //鼠标点击图标，显示详情
    this.$bus.off("mapMarksClick").on("mapMarksClick", (ev) => {
      let item = _this.getDetailByMapId(ev.data.id);
      _this.$bus.emit("selectedRow", item, false);
      _this.$emit("selectedRow", item, false);
    });
    this.$bus.off("changeQueryObj").on("changeQueryObj", (obj, tabKey) => {
      if (tabKey && EntityIndex[tabKey] !== this.type) {
        return;
      }
      this.queryObj = Object.assign(this.queryObj, obj);
      console.log("传参", this.queryObj);
      this.loadPageDevice();
    });
    if (this.enableDelete) {
      this.$bus.off("deleteDevices").on("deleteDevices", this.deleteDevices);
    }
    this.$bus.off("updateComplete").on("updateComplete", (type) => {
      if (_this.type !== type) {
        return;
      }
      _this.loadPageDevice();
      _this.loadAllDevice();
    });
    const mqtt = new MqttClient();
    const client = mqtt.client;

    client.on("message", this.message.bind(this));

    //雷达和环境传感器无开关
    if (this.type === "radar" || this.type === "environment") {
      this.columns.splice(8, 1);
    }
    if (this.type === "camera") {
      this.columns.splice(8, 2);
    }
    if (this.type !== "camera") {
      if (this.type == "display") {
        // this.deviceColumns.push(
        //   {
        //   title: "亮度",
        //   dataIndex: "brightness"
        // }
        // )
      } else {
        this.deviceColumns.push(
          // {
          //   title: "亮度",
          //   dataIndex: "brightness"
          // },
          {
            title: "电压(V)",
            dataIndex: "voltage",
          },
          {
            title: "电流(A)",
            dataIndex: "current",
          }
        );
      }
    }
  },
  computed: {
    currentColumns() {
      let radarColumns = this.columns.slice(0, this.columns.length - 1);
      return this.type === "radar" ? radarColumns : this.columns;
    },
    ...mapState(["ctrlMsgIds"]),
  },
  methods: {
    afterClose() {
      clearInterval(st);
    },
    refresh() {
      this.getDeviceInfo();
    },
    changePageDevice(pagination) {
      this.devicePageInfo.current = pagination.current;
      this.deviceOpt.page = pagination.current;
      this.getDeviceInfo();
    },
    changeDateRange(dates) {
      this.deviceOpt.startTime = dates[0].format(utils.fsTime);
      this.deviceOpt.endTime = dates[1].format(utils.fsTime);
      this.getDeviceInfo();
    },
    customFun() {
      let custom = "";
      if (typeArr.indexOf(this.type) >= 0) {
        custom = typeArr.indexOf(this.type) === 2 ? "view" : "editDisplay";
      }
      return custom;
    },
    showDialog(item) {
      this.deviceOpt.equipmentCode = item.equipmentCode;
      this.deviceOpt.projectId = item.projectId;
      this.getDeviceInfo();
      // st = setInterval(()=>{
      //   this.getDeviceInfo();
      // },10000)
    },
    async getDeviceInfo() {
      if (typeArr.indexOf(this.type) >= 0) {
        let res = await rt[this.type](this.deviceOpt);
        if (_.isEmpty(res) || res.code !== "200") {
          return;
        }
        this.devicePageInfo.current = res.data.current;
        this.devicePageInfo.total = res.data.total;
        this.deviceInfo = res.data.records;
        this.deviceVisible = true;
      }
    },
    deviceHandleOk() {
      this.deviceVisible = false;
    },
    getCheckboxProps() {
      return { props: { disabled: false } };
    },
    toSelectedPrograme(list) {
      let tmp = [];
      list.map((item) => {
        tmp.push(item.programId);
      });
      return tmp;
    },
    onSelectRow(selectedNum, selectedRows) {
      if (selectedRows.length >= 2) {
        this.selectedRowKeys = [selectedNum[selectedNum.length - 1]];
      } else {
        this.selectedRowKeys = selectedNum;
      }
      this.selectedPrograme = this.toSelectedPrograme(selectedRows);
    },
    ...mapMutations(["removeCtrlMsgId"]),
    message(topic, message, packet) {
      // debugger;
      if (topic.indexOf("Operation") === -1) {
        return;
      }
      let msgObj = JSON.parse(packet.payload.toString());
      console.info("msgObj", msgObj);
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
      this.removeCtrlMsgId(msgObj.msgId);
      setTimeout(() => {
        this.loadPageDevice();
        this.loadAllDevice();
      }, 1000);
    },
    inputChange(e) {
      this.equipmentName = e.target.value;
    },
    async getProgram(id) {
      let tmp = [];
      let res = await display.getProgramsByScreen({
        id: id,
        projectId: this.projectId,
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      res.data.map((item) => {
        if (item.checked === 1) {
          this.selectedRowKeys = [];
          this.selectedRowKeys.push(item.programId);
        }
        tmp.push({
          checked: item.checked,
          programId: item.programId,
          programName: item.programName,
          update_time: utils.toDate(item.update_time),
        });
      });
      this.programs = tmp;
    },
    loadProgram() {
      this.getProgram(this.deviceId, { programName: this.equipmentName });
    },
    // 获取照明概览列表数据
    async loadAllDevice() {
      try {
        this.queryObj.projectId = this.projectId;
        let res = await MapEntity[this.type].findByProjectId(this.queryObj);
        if (_.isEmpty(res) || res.code !== "200") {
          return;
        }
        this.allDevice = res.data.map((item, idx) => {
          if (item.checked === 1) {
            this.selectedRowKeys = [idx];
          }
          return item;
        });
        this.setMapMarks(this.allDevice, this.type);
        console.log("照明概览", this.allDevice);
      } catch (err) {
        console.warn("查询所有设备坐标时出错", err);
      }
    },
    getDetailByMapId(id) {
      let item = {};
      for (let i = 0, len = this.allDevice.length; i < len; i++) {
        item = this.allDevice[i];
        if (item.id === id) {
          return item;
        }
      }
      return {};
    },
    async loadPageDevice() {
      try {
        this.queryObj.projectId = this.projectId;
        let reqData = Object.assign(this.queryObj, this.pageInfo);
        let res;
        if (this.type === "camera") {
          res = await MapEntity[this.type].findByProjectId(reqData);
          res.data.list = res.data;
        } else if (this.type === "etc") {
          let _reqData = Object.assign(reqData, { functionType: "etc" });
          res = await MapEntity["camera"].findByProjectId(_reqData);
          res.data.list = res.data;
        } else {
          res = await MapEntity[this.type].findByProjectIdPaged(reqData);
        }

        if (_.isEmpty(res) || res.code !== "200") {
          return;
        }

        this.setPageInfo(res);
        this.pageDevice = res.data.list.map((item) => {
          item.onOffText = utils.getOnOffText(item.onOff);
          item.installationTime = utils.toTime(item.installationTime);
          item.productionDate = utils.toTime(item.productionDate);
          item.offlineTime = utils.toTime(item.offlineTime);
          item.onlineTime = utils.toTime(item.onlineTime);
          item.networkStateText = utils.getNetworkStateText(item.networkState);
          item.equipmentStatusText = utils.getEquipmentStatusText(
            item.equipmentStatus
          );
          return item;
        });
      } catch (err) {
        console.info(err);
      }
    },
    cusRow(record, index) {
      if (this.edit) {
        return false;
      }
      return {
        on: {
          click: () => {
            this.selectedDevices = record;
            record.longitude && this.setCenter(record);
            this.selectedRowIndex = index;
            this.$emit("selectedRow", record);
            this.$bus.emit("selectedRow", record);
            if (this.type === "radar") {
              this.getRadarTargetInfo(record);
            }
          },
        },
      };
    },
    async showDetail(item, isEdit) {
      this.$bus.emit("selectedRow", item, isEdit || false);
      this.$emit("selectedRow", item, isEdit || false);
    },
    async getRadarTargetInfo(record) {
      let heatData = [],
        pointData = [];
      let res = await radar.findAllTarget({
        equipmentCode: [record.equipmentCode],
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      res.data[0].targetDOS.map((item) => {
        if (!item) {
          return;
        }
        heatData.push({
          lng: item.targetLongitude,
          lat: item.targetLatitude,
          // count: item.targetNum
          count: 20,
        });
        pointData.push({
          lnglat: [item.targetLongitude, item.targetLatitude],
          name: item.location,
          style: 2,
        });
      });
      mapApi.swPointHeatMap(heatData, pointData);
    },
    getRowClass(record, index) {
      return index === this.selectedRowIndex ? "selected-row" : "";
    },
    location(record) {
      this.setCenter(record);
    },
    startEdit(item) {
      this.showDetail(item, true);
    },
    changePage(pageInfo) {
      pageInfo.pageNum = pageInfo.current;
      this.pageInfo = pageInfo;
      this.loadPageDevice();
    },
    onSelectChange(record, selected, selectedRows) {
      this.selectedDevices = selectedRows;
      this.$emit("selectedRows", selectedRows);
    },
    async deleteDevices(tabKey) {
      try {
        const key = EntityIndex[tabKey];
        if (key !== this.type) {
          return;
        }
        const data = {
          ids: this.selectedDevices.map((item) => item.id).join(","),
        };
        let res = await MapEntity[key][DeleteFunc[key]](data);
        if (res.code === "200") {
          this.$message.success(res.msg || "删除成功");
          this.loadPageDevice();
        } else {
          this.$message.error(res.msg);
        }
      } catch (err) {
        console.info(err);
      }
    },
    editDisplay(item) {
      this.deviceId = item.id;
      this.getProgram(item.id, {});
      this.visibleEdit = true;
    },
    handleCancel() {
      this.visibleEdit = false;
    },
    async handleOk() {
      let opt = {
        screenId: this.deviceId,
        programId: this.selectedPrograme[this.selectedPrograme.length - 2],
      };
      let res = await display.programsAdd(opt);
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.$message.success("成功");
      this.visibleEdit = false;
    },
  },
};

export default vm;
</script>

<style lang="less">
.refresh {
  display: inline-block;
  margin-left: 10px;
}
.DeviceListBox {
  .editDisplay {
    cursor: pointer;
    margin-right: 10px;
  }
}
.selected-row {
  background: rgba(138, 199, 247, 0.1);
}
.iconfont {
  cursor: pointer;
}
</style>
