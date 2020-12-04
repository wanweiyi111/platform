<template>
  <div class="manage-con">
    <a-row>
      <a-col :span="24">
        <div class="Application-con_header">
          <div class="top">
            <i class="iconfont iconwifi"></i>
            <span style="paddingLeft:10px">智慧WIFI</span>
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
                智慧WIFI
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
                  <a-form-item label="联网状态">
                    <a-select
                      v-decorator="[
                        'equipState',
                        { rules: [{message: '请选择联网状态' }] },
                      ]"
                      placeholder="请选择联网状态"
                    >
                      <a-select-option value="1">正常</a-select-option>
                      <a-select-option value="0">离线</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
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
            @change="changeTabs"
          >
            <a-tab-pane
              tab="概览"
              key="1"
            >
              <a-table
                class="Application_table"
                :rowKey="record => record.index"
                :columns="columns"
                :dataSource="dataList"
                :pagination="pageInfo"
                :bordered="false"
                @change="changeTable"
                size="middle"
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
                  slot="operation"
                  slot-scope="text,record"
                  class="action_btn"
                >
                  <a-tooltip
                    placement="top"
                    title="查看详情"
                  >
                    <a-icon
                      type="eye"
                      @click.stop="() => showModalEquipInfo(record)"
                    ></a-icon>
                  </a-tooltip>
                  <a-tooltip title="使用记录">
                    <a-icon
                      type="snippets"
                      :style="{ paddingLeft: '10px' }"
                      @click.stop="() => showInfo(record)"
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
          label="安装位置"
          :span="2"
        >
          {{equipInfoView.location}}
        </a-descriptions-item>
        <a-descriptions-item
          label="安装时间"
          :span="2"
        >
          {{equipInfoView.installationTime}}
        </a-descriptions-item>
        <!-- <a-descriptions-item label="设备厂家">
          {{equipInfoView.manufacturerName}}
        </a-descriptions-item> -->
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
        style="marginTop:10px;"
        bordered
      >
        <a-descriptions-item label="上传总流量">
          {{equipInfoView.totalUpFlow||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="WIFI总下行（下载流量）">
          {{equipInfoView.totalDownFlow||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="CPU使用率">
          {{equipInfoView.cpuUsage||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="无线用户数量">
          {{equipInfoView.wifiAssocSum||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="运行时长">
          {{equipInfoView.uptime||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="MAC地址">
          {{equipInfoView.macAddr||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="实时上传流量">
          {{equipInfoView.currentUpFlow||'-'}}
        </a-descriptions-item>
        <a-descriptions-item label="实时下载流量">
          {{equipInfoView.currentDownFlow||'-'}}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
    <a-modal
      class="application_modal"
      title="WIFI用户使用记录"
      :visible="infoVisible"
      :width="1100"
      :footer="null"
      @cancel="handleModelUserOk"
    >
      <WifiHistory :code="equipInfoView.equipmentCode"></WifiHistory>
    </a-modal>
  </div>
</template>

<script>
import _ from "lodash";
import { mapMutations } from "vuex";
import MapMixin from "@/mixins/map.js";
import baseMixin from "@/mixins/base.js";
import Wifi from "@/api/Wifi";
import WifiHistory from "@/components/Wifi/WifiHistory.vue";
import { Tooltip } from "ant-design-vue";

let wifi = new Wifi();
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
    title: "归属智慧杆",
    dataIndex: "poleName",
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
    dataIndex: "networkState",
    scopedSlots: {
      customRender: "networkState",
    },
  },
  {
    title: "设备状态",
    width: 80,
    align: "center",
    scopedSlots: { customRender: "equipmentStatus" },
  },
  {
    title: "操作",
    width: 50,
    align: "center",
    scopedSlots: {
      customRender: "operation",
    },
  },
];

export default {
  mixins: [baseMixin, MapMixin],
  components: {
    WifiHistory,
    aTooltip: Tooltip,
  },
  data() {
    return {
      infoVisible: false,
      tabKey: "1",
      deviceOpt: {},
      pageInfo: {
        total: 1,
        current: 1,
        pageSize: 10,
        showTotal: (total) => `共 ${total} 条`,
      },
      columns,
      dataList: [],
      activeCollKey: "1",
      curLight: {},
      searchForm: this.$form.createForm(this, { name: "advanced_search" }),
      visibleEquipInfo: false, // 查看详情 modal
      equipInfoView: {}, // 详情数据
    };
  },

  created() {
    let routeData = this.$route;
    let currentMenuId = routeData.meta.id || "";
    let currentMenuParentId = routeData.meta.parentId || "";
    this.setCurrentMenu(currentMenuId);
    this.setCurrentParentMenu(currentMenuParentId);
    this.loadList();
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
          this.deviceOpt.equipmentName = values.equipName;
        }
        if (values.equipState) {
          this.deviceOpt.networkState = values.equipState;
        }
        this.pageInfo.current = 1;
        this.loadList();
      });
    },
    // 搜索重置
    handleReset() {
      this.searchForm.resetFields();
      this.deviceOpt.equipmentName = "";
      this.deviceOpt.networkState = "";
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
    showInfo(item) {
      this.infoVisible = true;
      this.equipInfoView = item;
    },
    // 关闭记录modal
    handleModelUserOk() {
      this.equipInfoView = {};
      this.infoVisible = false;
    },
    changeTabs(key) {
      this.tabKey = key;
    },
    changeTable(pagination) {
      this.pageInfo.current = pagination.current;
      this.loadList();
    },
    async loadList() {
      let page = this.pageInfo;
      let pageOpt = `current=${page.current}&size=${page.pageSize}`;
      let opt = Object.assign(this.deviceOpt, { projectId: this.projectId });

      let res = await wifi.findByProjectIdPaged(pageOpt, opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      let reformList = res.data.records.map((item, index) => {
        return Object.assign(item, { index: index });
      });

      this.pageInfo.current = res.data.current;
      this.pageInfo.total = res.data.total;
      this.dataList = reformList;
    },
  },
};
</script>
<style lang="less">
</style>
