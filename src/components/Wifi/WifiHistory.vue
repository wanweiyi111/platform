<template>
  <dl class="wifi-history">
    <dt>
      时间选择：
      <a-range-picker
        size="small"
        class="mr5"
        @change="rangeChange"
        :placeholder="['开始时间', '结束时间']"
      />
    </dt>
    <dd>
      <a-table
        class="Application_table"
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="dataList"
        :pagination="pageInfo"
        @change="toPage"
        :bordered="false"
        size="middle"
      >
        <template
          slot="userStatus"
          slot-scope="text, record"
        >
          <span>{{record.userStatus|formatWifiStatus}}</span>
        </template>
        <template
          slot="userUpTotalFlow"
          slot-scope="text, record"
        >
          <span>{{Math.round(record.userUpTotalFlow/1000)}}</span>
        </template>
        <template
          slot="userDownTotalFlow"
          slot-scope="text, record"
        >
          <span>{{Math.round(record.userDownTotalFlow/1000)}}</span>
        </template>
        <template
          slot="connectionDuration"
          slot-scope="text, record"
        >
          <span>{{Math.round(record.connectionDuration/1000)}}</span>
        </template>
      </a-table>
    </dd>
  </dl>
</template>

<script>
import Api from "@/api/Wifi.js";
import utils from "@/utils/";
const api = new Api();

const columns = [
  {
    title: "序号",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "userStatus",
    scopedSlots: {
      customRender: "userStatus",
    },
  },
  {
    title: "网络类型",
    dataIndex: "netWorkType",
  },
  {
    title: "用户的信号连接强度",
    dataIndex: "sign",
  },
  {
    title: "用户MAC地址",
    dataIndex: "macAddr",
  },
  {
    title: "连接时长(秒)",
    scopedSlots: {
      customRender: "connectionDuration",
    },
  },
  {
    title: "上传使用流量(KB)",
    scopedSlots: {
      customRender: "userUpTotalFlow",
    },
  },
  {
    title: "下载使用总流量(KB)",
    scopedSlots: {
      customRender: "userDownTotalFlow",
    },
  },
];
export default {
  props: {
    code: {
      type: String,
    },
  },
  data() {
    return {
      showImgVisible: false,
      columns,
      queryObj: {
        code: this.code,
      },
      pageInfo: {
        total: 0,
        current: 1,
        showTotal: (total) => `共 ${total} 条`,
      },
      dataList: [],
    };
  },
  created() {
    this.loadList();
  },
  watch: {
    code(val) {
      this.code = val;
    },
  },
  methods: {
    search() {
      this.pageInfo.current = 1;
      this.loadList();
    },
    async loadList() {
      try {
        this.queryObj.current = Number(this.pageInfo.current);
        this.queryObj.code = this.code;
        let res = await api.findByEquipmentCode(this.queryObj);
        if (res.code != 200) {
          this.$message.error(res.msg);
          return;
        }
        this.pageInfo.current = res.data.current;
        this.pageInfo.total = res.data.total;
        this.dataList = res.data.records;
      } catch (err) {
        this.$message.error(err);
      }
    },
    toPage(page) {
      this.pageInfo.current = page.current;
      this.loadList();
    },
    rangeChange(dates) {
      this.queryObj.startTime = utils.toTime(dates[0]);
      this.queryObj.endTime = utils.toTime(dates[1]);
      this.loadList();
    },
  },
};
</script>

<style lang="less" scoped>
.wifi-history {
  margin-top: -24px;
  > dt {
    padding: 8px 0;
  }
}
</style>