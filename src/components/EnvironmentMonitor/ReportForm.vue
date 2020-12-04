<template>
  <a-col v-if="showRight" :span="bottomSpan.right" class="acol OneVideoInfo">
    <CtrlPanel :split-line="true">
      <dt slot="title">环境监控</dt>
      <dd slot="content">
        <a-collapse accordion class="light-detail">
          <div>
            <a-table
              :columns="columns"
              :dataSource="curLight"
              :rowKey="record => record.id"
              :pagination="false"
            />
          </div>
        </a-collapse>
      </dd>
    </CtrlPanel>
  </a-col>
</template>

<script>
import CtrlPanel from "@/components/CtrlPanel.vue";
const columns = [
  {
    title: "名称",
    dataIndex: "name",
    width: "15%"
  },
  {
    title: "值",
    dataIndex: "value",
    width: "40%"
  },
  {
    title: "预警",
    dataIndex: "pm25",
    width: "15%"
  }
];
export default {
  components: {
    CtrlPanel
  },
  props: {
    curLight: Array,
    bottomSpan: Object,
    showRight: Boolean
  },
  data() {
    return {
      columns
    };
  },
  created() {},
  computed: {},
  methods: {}
};
</script>

<style lang="less">
.OneVideoInfo.acol {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 531px;
  color: #ddfdff;
  font-size: 14px;
  // width: 100%;
  // height: 100%;
  .toCtrl {
    color: #98feff;
    float: right;
  }
  .ctrl-panel {
    padding: 0 14px;
    width: 100%;
    height: 100%;
  }
  .playVideo {
    width: 100%;
    height: 300px;
    margin: 20px 0;
  }
  .acol8 {
    margin-bottom: 10px;
    .gray {
      display: inline-block;
      width: 40%;
      color: #bacee4;
      margin-right: 14px;
      text-align: right;
    }
    .text {
      display: inline-block;
      width: calc(50% - 14px);
    }
  }
}
</style>
