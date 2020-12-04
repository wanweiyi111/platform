<template>
  <a-row>
    <a-col :span="24">
      <a-row>
        <a-col :span="6">
          <a-input-search
            v-model="equipmentName"
            @search="loadPageDevice"
            placeholder="请输入关键词"
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
    </a-col>
    <a-col
      :span="24"
      style="marginTop:30px"
    >
      <a-tabs
        class="Application_tabs"
        default-active-key="1"
      >
        <a-tab-pane
          key="1"
          tab="列表"
        >
          <div class="tab-btns">
            <a-button
              type="dashed"
              icon="plus"
              @click="showModel"
            >添加智慧杆
            </a-button>
          </div>
          <a-table
            class="Application_table"
            :columns="columns"
            :dataSource="deviceList"
            :rowKey="record => record.id"
            @change="handleTableChange"
            :rowSelection="{onSelect: onSelectRow,onSelectAll: onSelectAllRow,onChange:onChange}"
            :pagination="pagination"
            :customRow="cusRow"
          >
            <div
              class="action_btn"
              slot="DelData"
              slot-scope="record"
            >
              <!-- <a-tooltip title="查看详情">
                <a-icon
                  type="eye"
                  @click="showModalEquipInfo(record)"
                />
              </a-tooltip> -->
              <a-tooltip title="编辑">
                <a-icon
                  class="pl10"
                  type="edit"
                  @click="editPole(record)"
                />
              </a-tooltip>
              <a-tooltip title="记录">
                <a-icon
                  class="pl10"
                  type="api"
                  @click="checkManagerDevice(record.id)"
                />
              </a-tooltip>
            </div>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-col>
    <a-modal
      class="application_modal modelBox "
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="modalWidth"
      okText='确定'
      cancelText='取消'
    >
      {{isEdit?'编辑智慧杆':'添加智慧杆'}}
      <div class="modalContent">
        <a-row class="infoItem arow">
          <a-col
            :span="24"
            class="acol"
          >
            <span class="title">设备Code</span>
            <span class="ctrData">
              <a-input
                class="sourceData"
                v-model="entity.equipmentCode"
                placeholder="请输入唯一的设备code"
              />
            </span>
          </a-col>
          <a-col
            :span="24"
            class="acol"
          >
            <span class="title">资源名称</span>
            <span class="ctrData">
              <a-input
                class="sourceData"
                v-model="entity.equipmentName"
                placeholder="请输入资源名称"
              />
            </span>
          </a-col>
          <a-col
            :span="24"
            class="acol"
          >
            <span class="title">设备型号</span>
            <span class="ctrData">
              <a-select
                defaultValue="0"
                size="small"
                class="sourceData"
                v-model="entity.equipmentModel"
                @change="lightSpecifications"
              >
                <a-select-option
                  v-for="(item,index) in ModelList"
                  :value="item.equipmentModel"
                  v-bind:key="index"
                >{{item.equipmentModel}}</a-select-option>
              </a-select>
            </span>
          </a-col>
          <a-col
            :span="24"
            class="acol"
          >
            <span class="title">所属分组</span>
            <span class="ctrData">
              <div v-bind:class="entity.groupName?'no oldGroup':'oldGroup'">
                <a-select
                  defaultValue="0"
                  size="small"
                  class="sourceData"
                  v-model="entity.groupName"
                  @change="changeGroup"
                >
                  <a-select-option
                    v-for="(item,index) in groupList"
                    :value="item.groupName"
                    v-bind:key="index"
                  >{{item.groupName}}</a-select-option>
                </a-select>
              </div>
              <div
                class="newGroup"
                v-if="!entity.groupName"
              >
                或者
                <a-input
                  class="sourceData"
                  v-model="entity.groupName"
                  placeholder="请输入组名"
                />
              </div>
            </span>
          </a-col>
          <a-col
            :span="24"
            class="acol"
          >
            <span class="title">安装位置</span>
            <span class="ctrData">
              <a-input
                class="sourceData"
                v-model="entity.location"
                placeholder="请输入安装位置"
              />
              <div class="inputLocation">
                <a-input
                  class="sourceData"
                  v-model="entity.longitude"
                  placeholder="请输入经度"
                />
                <a-input
                  class="sourceData"
                  v-model="entity.latitude"
                  placeholder="请输入纬度"
                />
              </div>
            </span>
          </a-col>
          <a-col :span="24">
            <span class="title">安装时间</span>
            <span class="ctrData">
              <a-date-picker
                @change="onTimeChange"
                format="YY-MM-DD HH:MM:SS"
                class="sourceData"
              />
            </span>
          </a-col>
        </a-row>
      </div>
    </a-modal>
    <a-col :span="24"></a-col>
    <!-- <OneInfo
      :curLight="curLight"
      :bottomSpan="bottomSpan"
      :showRight="showRight"
    /> -->

  </a-row>
</template>

<script>
const columns = [
  {
    title: "序号",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "资源名称",
    dataIndex: "equipmentName",
    key: "equipmentName",
  },
  {
    title: "规格",
    dataIndex: "equipmentModel",
    key: "equipmentModel",
  },
  {
    title: "安装位置",
    dataIndex: "location",
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
    title: "所属分组",
    dataIndex: "groupName",
    key: "groupName",
  },
  {
    title: "关联设备数量",
    dataIndex: "bingTotal",
    key: "bingTotal",
  },
  {
    title: "操作",
    key: "DelData",
    scopedSlots: { customRender: "DelData" },
  },
];
import _ from "lodash";
import OneInfo from "./OneInfo.vue";
// import _ from "lodash";
import _api from "@/api/Pole";
import utils from "@/utils/";
import MapMixin from "@/mixins/map.js";
import CONFIG_LIST from "@/config";
import baseMixin from "@/mixins/base.js";
import { Tooltip } from "ant-design-vue";

const { DeviceType, Off, NETkState } = CONFIG_LIST;

let api = new _api();
export default {
  mixins: [baseMixin, MapMixin],
  components: {
    OneInfo,
    aTooltip: Tooltip,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      DeviceType,
      Off,
      showRight: false,
      curLight: {},
      bottomSpan: {
        left: 24,
        right: 0,
      },
      modalWidth: document.body.clientHeight - 100,
      groupList: [],
      rowList: [],
      visible: false,
      columns,
      equipmentModel: "",
      equipmentName: "",
      pagination: {
        total: 20,
        current: 1,
        pageSize: 10,
      },
      deviceList: [],
      ModelList: [],
      entity: {},
      // deviceName: "",
      // groupName: "",
      // location: "",
      // diyName: "",
      // longitude: "",
      // latitude: "",
      // installTime: "",
      showMoreLight: false,
      isEdit: false,
      poleId: 0,
    };
  },
  created() {
    this.getData(
      { equipmentName: this.equipmentName },
      "deviceList",
      "getPoleList"
    );
    this.getData("", "ModelList", "getModelList");
    this.getData("", "groupList", "groupList");
    this.loadallDevice();
  },
  watch: {},
  methods: {
    editPole(item) {
      this.visible = true;
      this.isEdit = true;
      this.poleId = item.id;
      this.getData({ id: item.id }, "getPoleInfo", "getPoleInfo");
    },
    checkManagerDevice(id) {
      this.$router.push({
        path: "/ctrl/manager-device",
        query: { id: id, from: "pole" },
      });
    },
    async loadallDevice() {
      let res = await api
        .findByProjectId({ projectId: this.projectId })
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.allDevice = res.data.map((item) => {
        item.installationTime = utils.toTime(item.installationTime);
        item.productionDate = utils.toTime(item.productionDate);
        item.offlineTime = utils.toTime(item.offlineTime);
        item.onlineTime = utils.toTime(item.onlineTime);
        return item;
      });
      this.setMapMarks(this.allDevice, "pole");
    },
    cusRow(record) {
      // if (this.edit) {
      //   return false;
      // }
      return {
        on: {
          click: () => {
            this.setCenter(record);
            this.showRight = true;
            this.bottomSpan.left = 14;
            this.bottomSpan.right = 10;
            // this.curLight = record;
            this.getData({ id: record.id }, "curLight", "findBindings");
          },
        },
      };
    },
    onChange(selectedRowKeys, selectedRows) {
      let tmp = [];
      selectedRows &&
        selectedRows.map((item) => {
          tmp.push({ id: item.id });
        });
      this.rowList = tmp;
    },
    onSelectRow(record, selected, selectedRows) {
      console.log(record, selected, selectedRows, "-------");
    },
    onSelectAllRow(selected, selectedRows, changeRows) {
      console.log(selected, selectedRows, changeRows, "++++++++");
    },
    inputChange(e) {
      this.equipmentName = e.target.value;
    },
    loadPageDevice() {
      this.getData(
        { equipmentName: this.equipmentName },
        "deviceList",
        "getPoleList"
      );
    },
    async getData(data, type, apiType) {
      let opt = null;
      if (apiType === "updatePoleInfos") {
        opt = data;
      } else {
        opt = data
          ? Object.assign(data, { projectId: this.projectId })
          : { projectId: this.projectId };
      }
      if (type === "deviceList") {
        delete opt.equipmentName;
      }
      let res = await api[apiType](opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      if (type === "deviceList") {
        this[type] = res.data.list;
        this.pagination.total = res.data.pages * 10;
      } else if (type === "submit") {
        // this.deviceName = "";
        // this.equipmentModel = "";
        // this.groupName = "";
        // this.diyName = "";
        // this.location = "";
        // this.longitude = "";
        // this.latitude = "";
        this.entity = {};
        this.$message.success(this.isEdit ? "编辑成功" : "添加成功");
        this.visible = false;
      } else if (type === "curLight") {
        let dos = res.data.equipmentDOS;
        dos &&
          dos.map((item, idx) => {
            dos[idx].installationTime = utils.toDate(dos[idx].installationTime);
            dos[idx].equipmentType = DeviceType[dos[idx].equipmentType];
            dos[idx].onOff =
              Off[dos[idx].onOff === null ? "3" : dos[idx].onOff];
            dos[idx].equipmentStatus =
              NETkState[
                dos[idx].equipmentStatus === null
                  ? "3"
                  : dos[idx].equipmentStatus
              ];
          });
        res.data.equipmentDOS = dos;
        this[type] = res.data;
      } else if (type === "getPoleInfo") {
        this.entity = res.data;
        // let _data = res.data;
        // this.deviceName = _data.equipmentName;
        // this.equipmentModel = _data.equipmentModel;
        // this.longitude = _data.longitude;
        // this.groupName = _data.groupName;
        // this.latitude = _data.latitude;
        // this.location = _data.location;
        // this.installTime = _data.installTime;
      } else {
        this[type] = res.data;
      }
    },
    showModel() {
      this.visible = true;
    },
    handleOk() {
      if (
        this.entity.equipmentCode.length > 0 &&
        this.entity.equipmentModel.length > 0
      ) {
        /* let opt = {
          longitude: this.longitude,
          latitude: this.latitude,
          equipmentName: this.deviceName,
          installationTime: this.installTime,
          location: this.location,
          equipmentModel: this.equipmentModel,
          groupName: this.groupName || this.diyName
        }; */
        let opt = JSON.parse(JSON.stringify(this.entity));
        if (this.poleId) {
          opt.id = this.poleId;
          opt = {
            list: [opt],
          };
        }
        let type = this.isEdit ? "updatePoleInfos" : "addPoleDevice";
        this.getData(opt, "submit", type);
        this.getData(
          { equipmentName: this.entity.equipmentName },
          "deviceList",
          "getPoleList"
        );
      } else {
        this.$message.error("请输入智慧杆型号和名字");
      }
    },
    handleCancel() {
      this.visible = false;
    },
    batchDelete() {},
    handleTableChange(pagination) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.getData(
        {
          pageNum: pagination.current,
          pageSize: 10,
          equipmentName: this.equipmentName,
        },
        "deviceList",
        "getPoleList"
      );
    },
    lightSpecifications(val) {
      this.equipmentModel = val;
    },
    changeGroup(val) {
      this.groupName = val;
    },
    onTimeChange(time) {
      this.entity.installationTime = time.format(utils.fsTime);
      // this.installTime = time2;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.container {
  position: absolute;
  bottom: 15px;
  left: 10px;
  width: calc(100% - 20px);
}
.ant-modal-content {
  width: calc(100% - 524px);
}
.ant-select-sm .ant-select-selection--single {
  height: 32px;
}
.modalContent {
  margin-top: 24px;
  width: calc(100% - 20px);
  .infoItem {
    width: 100%;
    margin-top: 10px;
    .acol {
      margin: 10px 0 10px 0;
    }
    span {
      display: inline-block;
    }
    .title {
      width: 15%;
      text-align: right;
      padding-right: 10px;
      vertical-align: top;
    }
    .ctrData {
      width: 192px;
      height: 32px;
      line-height: 32px;
      .sourceData {
        width: 100%;
        height: 100%;
      }
    }
    .ctrData1 {
      width: 85%;
      .oldGroup,
      .newGroup {
        width: 50%;
        float: left;
        &.no.oldGroup {
          width: 100%;
        }
        &.newGroup {
          .sourceData {
            width: 85%;
          }
        }
      }
      .inputLocation {
        width: 100%;
        margin-top: 5px;
        & .sourceData {
          width: 50%;
        }
      }
      .sourceData {
        border-radius: 10px;
        width: 100%;
        height: 32px;
        line-height: 32px;
        div {
          border: 1px solid red;
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }
}
.LightPoleManager {
  .bottom-sidebar {
    height: 362px;
  }
  .bottom-sidebar.high {
    height: 623px;
  }
  .ctrGroup {
    i {
      margin-left: 15px;
      cursor: pointer;
    }
  }
  .content {
    padding: 0 20px;
    .editPole {
      cursor: pointer;
      margin-right: 10px;
    }
  }
  .f16 {
    display: inline-block;
    padding: 20px;
    color: #ddfdff;
  }
  .pd-t5 {
    position: absolute;
    right: 10px;
    top: 10px;
    .export {
      cursor: pointer;
      color: #97e9ff;
      padding: 5px 10px;
      margin-left: 10px;
      line-height: 1em;
      display: inline-block;
      border: 1px solid #97e9ff;
      border-radius: 15.5px;
      i {
        display: inline-block;
        margin: 0 5px;
      }
    }
  }
}
</style>
