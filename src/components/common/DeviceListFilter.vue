<template>
  <div class="pd-t5">
    <a href="javascript:;" class="mr15 white2" @click="changePanelSize">
      <a-icon v-if="!showMore" type="arrow-up" />
      <a-icon v-else type="arrow-down" />
    </a>
    <a-select defaultValue size="small" class="mr15" @change="changeEquipmentStatus">
      <a-select-option value>全部</a-select-option>
      <a-select-option value="1">正常</a-select-option>
      <a-select-option value="0">故障</a-select-option>
    </a-select>
    <a-range-picker size="small" class="mr5" @change="rangeChange" :placeholder="['开始时间', '结束时间']"/>
    <a-input-search
      v-model="queryObj.equipmentName"
      @search="changeQueryObj"
      placeholder="搜索设备名称"
      style="width: 130px;bottom:2px"
      size="small"
    />
  </div>
</template>
<script>
import utils from "@/utils/";
export default {
  data() {
    return {
      showMore: false,
      queryObj: {}
    };
  },
  methods: {
    rangeChange(dates) {
      this.queryObj.startDate = utils.toDate(dates[0])+" 00:00:00";
      this.queryObj.endDate = utils.toDate(dates[1])+" 23:59:59";
      this.$bus.emit("changeQueryObj", this.queryObj);
    },
    changeQueryObj() {
      this.$bus.emit("changeQueryObj", this.queryObj);
    },
    changeEquipmentStatus(val) {
      this.queryObj.equipmentStatus = val;
      this.changeQueryObj();
    },
    changePanelSize() {
      this.showMore = !this.showMore;
      // this.$parent.showMoreLight = this.showMore;
      this.$emit("changePanelSize", this.showMore);
    }
  }
};
</script>