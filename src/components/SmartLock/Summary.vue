<template>
  <div>
    <a-table
      class="Application_table"
      :columns="columns"
      :dataSource="dataList"
      :pagination="pagination"
      :rowKey="record => record.id"
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
      <template
        slot="onOffStatus"
        slot-scope="text, record"
      >
        <a-popconfirm
          okText="确认"
          cancelText="取消"
          @confirm="() => onPopconfirmSwite(record)"
        >
          <span slot="title">
            确定{{Number(record.onOff)?'关闭':'开启'}}？
          </span>
          <a-switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            class="ml10"
            :checked="Number(record.onOff)?true:false"
          />
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import { Popconfirm } from "ant-design-vue";
import Lock from "@/api/Lock";
const api = new Lock();

const columns = [
  {
    title: "序号",
    dataIndex: "id",
    width: 100,
    ellipsis: true,
  },
  {
    title: "资源名称",
    dataIndex: "equipmentName",
    ellipsis: true,
  },
  {
    title: "安装位置",
    dataIndex: "location",
    ellipsis: true,
  },
  {
    title: "联网状态",
    dataIndex: "networkState",
    scopedSlots: { customRender: "networkState" },
    width: 80,
  },
  {
    title: "设备状态",
    dataIndex: "equipmentStatus",
    scopedSlots: { customRender: "equipmentStatus" },
    width: 80,
  },
  {
    title: "开关状态",
    dataIndex: "onOffStatus",
    scopedSlots: { customRender: "onOffStatus" },
    align: "center",
    width: 100,
  },
];

export default {
  mixins: [baseMixin],
  components: {
    aPopconfirm: Popconfirm,
  },
  props: {
    searchObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      columns,
      dataList: [],
      pagination: {
        current: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0, //总数
        showTotal: (total) => `共 ${total} 条`, // 显示总数
      },
      searchValue: {},
      timer: "",
    };
  },
  created() {
    // 搜索
    this.$bus.on("loadLockData", (isSearch, searchData) => {
      if (isSearch) this.pagination.current = 1;
      this.searchValue = searchData;
      this.loadData(searchData);
    });
    this.loadData({});
  },
  methods: {
    // 设备-开关
    onPopconfirmSwite(e) {
      let objVal = e;
      let deviceIdsArr = [];
      const onOff = Number(objVal.onOff) ? 0 : 1;
      this.dataList = this.setOnOffData(this.dataList, objVal.id, onOff);
      deviceIdsArr.push(objVal.equipmentCode);
      const messageId = this.createMsgCodeId(objVal, "setOnOff");
      const params = {
        deviceIds: deviceIdsArr,
        durTime: 10,
        messageId,
        onOff,
      };
      this.loadSetOnOffData(params);
      let _this = this;
      this.timer = setTimeout(() => {
        // 开锁请求成功 又关掉
        _this.dataList = _this.setOnOffData(_this.dataList, objVal.id, 0);
      }, 3000);
      // console.log("开关值", messageId, onOff, deviceIdsArr, params);
    },
    // 分页
    changePage(page) {
      let parms = {};
      if (this.searchValue.equipmentName || this.searchValue.equipmentStatus) {
        parms = this.searchValue;
      }
      this.pagination.current = page.current;
      this.loadData(parms);
    },
    // 开关按钮 原数据处理  存储临时onOff数据值
    setOnOffData(data, currentId, state) {
      let newData = (data || []).map((item) => {
        if (item.id == currentId) {
          item.onOff = state ? "1" : "0";
        }
        return item;
      });
      return newData;
    },
    // 获取开关
    async loadSetOnOffData(params) {
      let res = await api.setOnOff(params).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.$message.success("操作成功");
    },
    // 获取列表数据 params搜索参数、show 重置页码1
    async loadData(params) {
      let obj = params;
      obj.pageNum = this.pagination.current;
      obj.pageSize = this.pagination.pageSize;
      let opt = Object.assign(obj, { projectId: this.projectId });
      let res = await api.findByProjectIdPaged(opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.pagination.current = res.data.pageNum;
      this.pagination.total = res.data.total;
      this.dataList = res.data.list;
      //   this.setMapMarks(this.allDevice, "pole");
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
};
</script>
