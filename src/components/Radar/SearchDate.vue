<template>
  <div class="search-date pd-t5">
    <a href="javascript:;" class="mr15 white2" @click="changePanelSize">
      <a-icon :type="showMore ? 'arrow-down' : 'arrow-up'"/>
    </a>
    <a-date-picker
        :disabledDate="disabledStartDate"
        showTime
        format="YYYY-MM-DD HH:mm:ss"
        v-model="qo.startDate"
        placeholder="Start"
        @openChange="handleStartOpenChange"
        @ok="search"
    />
    <a-date-picker
        :disabledDate="disabledEndDate"
        showTime
        format="YYYY-MM-DD HH:mm:ss"
        placeholder="End"
        v-model="qo.endDate"
        :open="endOpen"
        @openChange="handleEndOpenChange"
        @ok="search"
    />
    <a-input-search
        v-model="qo.searchText"
        @search="search"
        placeholder="输入关键词"
        style="width: 130px;bottom:2px"
    />
  </div>
</template>

<script>
  import moment from 'moment';
  import utils from "@/utils";
  export default {
    name: "SearchDate",
    data() {
      return {
        qo: {
          startDate: null,
          endDate: null,
          searchText: ''
        },
        endOpen: false,
        showMore: false
      }
    },
    methods: {
      // =date picker = start=
      disabledStartDate(startDate) {
        const endDate = this.qo.endDate;
        if (!startDate || !endDate) {
          return false;
        }
        return startDate.valueOf() > endDate.valueOf();
      },
      disabledEndDate(endDate) {
        const startDate = this.qo.startDate;
        if (!endDate || !startDate) {
          return false;
        }
        return startDate.valueOf() >= endDate.valueOf();
      },
      handleStartOpenChange(open) {
        if (!open) {
          this.endOpen = true;
        }
      },
      handleEndOpenChange(open) {
        this.endOpen = open;
      },
      // =date picker = end=
      changePanelSize() {
        this.showMore = !this.showMore;
        this.$emit("changePanelSize", this.showMore);
      },
      getPayload () {
        let payload = {}
        let {startDate, endDate, searchText} = this.qo
        if (startDate) {
          payload['startDate'] = utils.toTime(startDate)
        }
        if (endDate) {
          payload['endDate'] = utils.toTime(endDate)
        }
        searchText = searchText.trim()
        if (searchText) {
          payload['searchText'] = searchText
        }
        return payload
      },
      search() {
        this.$emit("search", this.getPayload());
      }
    },
    created() {
      let startDate = new Date()
      this.qo.startDate = moment(startDate)
      this.qo.endDate = moment(startDate.getTime() + 3600000)
    }
  }
</script>

<style scoped>
.search-date >>> .ant-calendar-picker {
  margin-right: 20px;
}
.search-date >>> .ant-calendar-picker .ant-calendar-picker-icon{
  color: rgba(255, 255, 255, 0.8);
}
.search-date >>> .ant-calendar-picker .ant-calendar-picker-clear:hover{
  color: rgba(255, 255, 255, 0.9);
  background-color: #06286f;
}
.search-date >>> .ant-input {
  border-radius: 20px;
}
</style>
<style>
  .ant-calendar {
    border: 1px solid #1861a5;
  }
  .ant-calendar-header,
  .ant-calendar-input-wrap{
    border-bottom: 1px solid #1861a5;
  }
  .ant-calendar-footer{
    border-top: 1px solid #1861a5;
  }
  .ant-calendar-time .ant-calendar-footer .ant-calendar-today-btn,
  .ant-calendar-time .ant-calendar-footer .ant-calendar-time-picker-btn{
    color: #fff;
  }
  .ant-calendar-selected-day .ant-calendar-date {
    background-color: #5ca4a7;
  }
</style>