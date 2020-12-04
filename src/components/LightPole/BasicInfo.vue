<template>
  <a-card
    class="customCard customCard--light"
    title="基本信息"
    :bordered="false"
  >
    <a-row
      type="flex"
      justify="start"
      align="top"
      class="font12"
    >
      <a-col
        :span="8"
        class="mb5"
      >
        <a-row>
          <a-col :span="7"><b>杆体设备ID：</b></a-col>
          <a-col :span="17">{{infoData.equipmentNumber}}</a-col>
        </a-row>
      </a-col>
      <a-col
        :span="8"
        class="mb5"
      >
        <a-row>
          <a-col :span="7"><b>智慧杆名称：</b></a-col>
          <a-col :span="17">{{infoData.equipmentName}}</a-col>
        </a-row>
      </a-col>
      <a-col
        :span="8"
        class="mb5"
      >
        <a-row>
          <a-col :span="6"><b>产品型号：</b></a-col>
          <a-col :span="18">{{infoData.equipmentCode}}</a-col>
        </a-row>
      </a-col>
      <a-col
        :span="8"
        class="mb5"
      >
        <a-row>
          <a-col :span="7"><b>所属项目：</b></a-col>
          <a-col :span="17">{{infoData.installationCompany}}</a-col>
        </a-row>
      </a-col>

    </a-row>
  </a-card>
</template>

<script>
// import CtrlPanel from "@/components/CtrlPanel.vue";
// import CApi from "@/api/Pole";

// let api = new CApi();
export default {
  props: {
    infoData: Object,
  },

  data() {
    return {};
  },
  created() {
    // this.loadList("findBindings", { id: this.curLight.id }, "deviceList");
  },
  computed: {},
  methods: {},
};
</script>

<style lang="less" scoped>
.info {
  padding: 0 15px;
}
.item {
  float: left;
  width: 25%;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  .title {
    width: 40%;
    text-align: right;
  }
  .value {
    width: 60%;
  }
}
</style>
