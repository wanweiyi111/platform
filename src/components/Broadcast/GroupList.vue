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
      <!-- 分组联网状态 -->
      <template
        slot="networkState"
        slot-scope="text, record"
        v-if="record.networkState"
      >
        <a-badge
          :status="Number(record.networkState)?'success':'default'"
          :text="Number(record.networkState)?'正常':'离线'"
        />
      </template>
      <template
        slot="equipmentStatus"
        slot-scope="text, record"
        v-if="record.equipmentStatus"
      >
        <a-badge
          :status="Number(record.equipmentStatus)?'success':'error'"
          :text="Number(record.equipmentStatus)?'正常':'故障'"
        />
      </template>
      <div
        slot="operation"
        slot-scope="text, record"
        class="action_btn"
      >
        <template v-if="record.resourceType==1">
          <a-tooltip
            placement="top"
            title="编辑"
          >
            <a-icon
              type="edit"
              @click="() => showModalEditInfo(record)"
            />
          </a-tooltip>
          <a-tooltip
            placement="top"
            title="添加广播"
          >
            <a-icon
              type="plus"
              class="pl10"
              @click="() => showModalAddInfo(record)"
            />
          </a-tooltip>
        </template>
        <!-- 未分组的大屏信息不能被删除 -->
        <template v-if="!record.screen">
          <a-tooltip title="删除">
            <a-icon
              type="delete"
              class="pl10"
              @click="() => showModalDeleteInfo(record)"
            />
          </a-tooltip>
        </template>
      </div>
    </a-table>

    <!-- 编辑分组 -->
    <a-modal
      title="编辑组名"
      class="application_modal"
      :visible="visibleEditInfo"
      :width="500"
      :closable="false"
      :footer="null"
    >
      <a-form
        :form="formEditGroup"
        @submit="handleOk"
      >
        <a-form-item
          label="组名"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input v-decorator="[
          'groupName',
          {rules: [{ required: true, message: '请输入组名!' }]}
        ]" />
        </a-form-item>
        <a-row>
          <a-col
            :span="22"
            :style="{ textAlign: 'right' }"
          >
            <a-button @click="handleReset">
              取消
            </a-button>
            <a-button
              class="ml10"
              type="primary"
              html-type="submit"
            >
              确定
            </a-button>
          </a-col>
        </a-row>
      </a-form>

    </a-modal>
    <!-- 添加广播 -->
    <a-modal
      title="添加设备"
      class="application_modal"
      :visible="visibleAddInfo"
      :width="500"
      :closable="false"
      :footer="null"
    >
      <a-form
        :form="formAddInfo"
        @submit="handleAddOk"
      >
        <a-form-item
          label="广播"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-select
            mode="multiple"
            dropdownClassName="application_dropdown"
            placeholder="请选择屏幕"
            v-decorator="[
            'list',
            {rules: [{ required: true, message: '请选择屏幕' }]}]"
          >
            <a-select-option
              v-for="item in withoutScreenList"
              :key="item.id"
              :value="item.id"
            >{{item.equipmentName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-row>
          <a-col
            :span="22"
            :style="{ textAlign: 'right' }"
          >
            <a-button @click="handleAddReset">
              取消
            </a-button>
            <a-button
              class="ml10"
              type="primary"
              html-type="submit"
            >
              确定
            </a-button>
          </a-col>
        </a-row>
      </a-form>

    </a-modal>
  </div>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import Broadcast from "@/api/Broadcast";

import { Badge, Tooltip } from "ant-design-vue";

const api = new Broadcast();
// 列表
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    width: 80,
    align: "center",
    ellipsis: true,
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
    dataIndex: "networkState",
    scopedSlots: { customRender: "networkState" },
  },
  {
    title: "设备状态",
    width: 80,
    align: "center",
    dataIndex: "equipmentStatus",
    scopedSlots: { customRender: "equipmentStatus" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  mixins: [baseMixin],
  components: {
    aTooltip: Tooltip,
    aBadge: Badge,
  },
  props: {
    searchValue: {
      type: Object,
      default: () => ({}),
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
      visibleEditInfo: false, // 编辑分组modal
      equipInfoView: {}, // 查看设备信息-数据
      formEditGroup: this.$form.createForm(this),
      visibleAddInfo: false, // 添加广播 modal
      visibleDeleteInfo: false, // 添加广播 modal
      formAddInfo: this.$form.createForm(this),
      withoutScreenList: [], // 未分组的广播列表
    };
  },
  watch: {
    searchValue: {
      handler(value) {
        console.log("传参", value);
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
    // 处理接口返回的数据--去掉children为0
    processingData(data) {
      let processedData = (data || []).map((_) => {
        if (_.children && _.children.length == 0) {
          delete _.children;
        }
        return _;
      });
      return processedData;
    },
    // 编辑分组modal
    showModalEditInfo(val) {
      setTimeout(() => {
        this.formEditGroup.setFieldsValue({
          groupName: val.resourceName,
        });
      }, 0);

      this.equipInfoView = val;
      this.visibleEditInfo = true;
    },
    // 编辑分组--确定
    handleOk(e) {
      e.preventDefault();
      this.formEditGroup.validateFields((error, values) => {
        if (error) {
          return;
        }
        let currtData = this.equipInfoView;
        if (values.groupName != currtData.resourceName) {
          let parms = {
            groupId: currtData.id,
            groupName: values.groupName,
          };
          this.loadBroadcastGroupEdit(parms);
          this.visibleEditInfo = false;
        } else {
          this.visibleEditInfo = false;
        }
      });
    },
    // 编辑分组--取消
    handleReset() {
      this.formEditGroup.resetFields();
      this.equipInfoView = {};
      this.visibleEditInfo = false;
    },
    // 添加广播 --modal
    showModalAddInfo(val) {
      this.equipInfoView = val;
      this.loadBroadcastData();
      this.visibleAddInfo = true;
    },
    // 添加广播 --确认
    handleAddOk(e) {
      e.preventDefault();
      let currtData = this.equipInfoView;
      this.formAddInfo.validateFields((error, values) => {
        if (error) {
          return;
        }
        let params = {
          groupId: [currtData.id],
          list: values.list,
        };
        this.loadBroadcastAdd(params);
        this.loadData({});
        this.visibleAddInfo = false;
      });
    },
    // 添加广播 --取消
    handleAddReset() {
      this.formAddInfo.resetFields();
      this.equipInfoView = {};
      this.visibleAddInfo = false;
    },
    // 删除分组 --modal
    showModalDeleteInfo(val) {
      let currData = val;
      let groupIds = null;
      let params = ``;
      const _this = this;
      this.$modal.confirm({
        title: "确定要删除吗?",
        okText: "确定",
        cancelText: "取消",
        centered: true,
        class: "application_modal",
        onOk() {
          if (currData.children) {
            groupIds = currData.id;
            params = `groupIds=${groupIds}&screenIds=`;
          } else {
            groupIds = currData.groupId;
            params = `groupIds=${groupIds}&screenIds=${currData.id}`;
          }
          _this.loadDeleteData(params);
          _this.loadData({});
        },
        onCancel() {},
      });
    },
    // 分页
    changePageDevice(pagination) {
      console.log(pagination);
      this.devicePagination.current = pagination.current;
      let params = {};
      if (this.searchValue) {
        params = this.searchValue;
      }
      this.loadData(params);
    },
    // 删除分组
    async loadDeleteData(params) {
      let res = await api.broadcastGroupRemove(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res)) {
        return;
      }
    },
    // 添加广播 --新增广播
    async loadBroadcastAdd(params) {
      let opt = Object.assign(params, { projectId: this.projectId });
      let res = await api.broadcastGroupGlAdd(opt);
      if (res.code !== 200) {
        return;
      }
    },
    // 添加广播 --现有广播列表
    async loadBroadcastData() {
      let prams = `projectId=${this.projectId}`;
      let res = await api
        .broadcastListWithoutGroupScreen(prams)
        .catch((err) => {
          console.log(err);
        });

      if (_.isEmpty(res) || res.code != 200) {
        return;
      }
      this.withoutScreenList = res.data;
    },
    // 编辑分组
    async loadBroadcastGroupEdit(params) {
      let opt = Object.assign(params, { projectId: this.projectId });
      let res = await api.broadcastGroupModify(opt);
      if (res.code !== 200) {
        return;
      }
      console.log("编辑分组", res.data);
      this.loadData({});
    },

    // 获取数据
    async loadData(params) {
      let links = `${this.devicePagination.current}/${this.devicePagination.pageSize}`;
      let opt = Object.assign(params, { projectId: this.projectId });
      let res = await api.broadcastGroupQueryList(links, opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != "200") {
        return;
      }
      this.dataList = this.processingData(res.data.data);
      this.devicePagination.current = res.data.currentPage;
      this.devicePagination.total = res.data.totalNum;
    },
  },
};
</script>
