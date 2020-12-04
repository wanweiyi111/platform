<template>
  <!-- 设置设备权限 -->
  <a-modal
    class="application_modal"
    :maskClosable="false"
    :title="`车位${code}明细`"
    :visible="visible"
    :width="850"
    :closable="false"
    v-if="visible"
  >
    <template slot="footer">
      <a-button
        type="primary"
        @click="handleCancel"
      >关闭</a-button>
    </template>
    <a-row>
      <a-col :span="8"></a-col>
    </a-row>
    <a-table
      class="Application_table"
      :columns="columns"
      :rowKey="record => record.serial"
      :data-source="dataList"
      :pagination="paginationPage"
      @change="changePagination"
    >
      <template
        slot="parkingTime"
        slot-scope="text, record"
      >
        {{record.parkingTime || '-'}}
      </template>
      <template
        slot="paymentChannel"
        slot-scope="text, record"
      >
        {{record.paymentChannel | formatEtcPaymentChannelText }}
      </template>
      <template
        slot="paymentStatus"
        slot-scope="text, record"
      >
        {{record.paymentStatus | formatEtcPaymentStatusText}}
      </template>
    </a-table>
  </a-modal>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import Etc from "@/api/Etc";

const api = new Etc();

const columns = [
  {
    title: "序号",
    dataIndex: "serial",
  },
  {
    title: "车牌",
    dataIndex: "carCode",
    width: 90,
  },
  {
    title: "入库时间",
    dataIndex: "inTime",
  },
  {
    title: "出库时间",
    dataIndex: "outTime",
  },
  {
    title: "停车时长(小时)",
    dataIndex: "parkingTime",
    width: 80,
    align: "center",
    scopedSlots: { customRender: "parkingTime" },
  },
  {
    title: "费用(RMB)",
    dataIndex: "fee",
    width: 80,
    align: "center",
  },
  {
    title: "支付方式",
    width: 80,
    align: "center",
    scopedSlots: { customRender: "paymentChannel" },
  },
  {
    title: "支付状态",
    width: 80,
    align: "center",
    scopedSlots: { customRender: "paymentStatus" },
  },
];

export default {
  mixins: [baseMixin],
  components: {},
  props: {
    code: String,
    visible: Boolean,
  },
  data() {
    return {
      columns,
      dataList: [],
      paginationPage: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共 ${total} 条`,
      },
    };
  },
  watch: {
    code(val) {
      let value = val;
      console.log("更新", val);
      this.paginationPage.current = 1;
      let params = {
        parkingCode: value,
      };
      this.loadDevicePermission(params);
    },
  },
  mounted() {},
  created() {},
  methods: {
    // 关闭modal
    handleCancel() {
      console.log("关闭");
      // this.visible = false;
      this.$emit("returnParkingDetailVisible", false);
    },
    // 分页
    changePagination(page) {
      console.log("分页", page);
      this.paginationPage.current = page.current;
      let param = {
        parkingCode: this.code,
      };
      this.loadDevicePermission(param);
    },

    // 获取设备数据
    async loadDevicePermission(param) {
      param.pageNum = this.paginationPage.current;
      param.pageSize = this.paginationPage.pageSize;
      let res = await api.findDetailByParkingCode(param);
      if (res.code != "200") {
        this.$message.warning("加载失败");
        return;
      }
      let list = res.data.list;
      if (list) {
        list.map((_, idx) => {
          _.serial = _.id + String(idx);
          return _;
        });
      }
      this.dataList = list;
      this.paginationPage.current = res.data.pageNum;
      this.paginationPage.total = res.data.total;
      console.log("当前数据", this.dataList);
    },
  },
};
</script>