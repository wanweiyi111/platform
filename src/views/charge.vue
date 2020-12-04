<template>
  <div class="ctrl-light">
    <a-row
      :gutter="16"
      :class="['bottom-sidebar',{high: showMoreLight}]"
    >
      <a-col :span="bottomSpan.left">
        <CtrlPanel :hide-title="true">
          <dd
            slot="content"
            class="pd-x10"
          >
            <a-tabs>
              <a-tab-pane
                tab="充电桩概览"
                key="1"
              >
                <Summary ref="Summary"></Summary>
              </a-tab-pane>
              <div
                slot="tabBarExtraContent"
                class="pd-t5"
              >
                <a
                  href="javascript:;"
                  class="mr15 white2"
                  @click="showMoreLight = !showMoreLight"
                >
                  <a-icon
                    v-if="!showMoreLight"
                    type="arrow-up"
                  />
                  <a-icon
                    v-else
                    type="arrow-down"
                  />
                </a>
                <a-input-search
                  v-model="queryObj.searchText"
                  @search="search"
                  placeholder="搜索设备名称"
                  class="mr5"
                  style="width: 130px;bottom:2px;"
                  size="small"
                />
                <!-- <a-button icon="delete" size="small" @click="batchDelete">删除</a-button> -->
              </div>
            </a-tabs>
          </dd>
        </CtrlPanel>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import _ from "lodash";
import MapMixin from "@/mixins/map.js";
import baseMixin from "@/mixins/base.js";
import CtrlPanel from "@/components/CtrlPanel.vue";
import Summary from "@/components/Charge/Summary.vue";
const Ecolumns = [
  {
    title: "序号",
    dataIndex: "id",
  },
  {
    title: "资源名称",
    dataIndex: "equipmentName",
  },
  {
    title: "联网状态",
    dataIndex: "networkState",
  },
  {
    title: "设备状态",
    dataIndex: "equipmentStatus",
  },
  {
    title: "安装位置",
    dataIndex: "location",
  },
];
export default {
  mixins: [baseMixin, MapMixin],
  components: {
    CtrlPanel,
    Summary,
  },
  data() {
    return {
      allDeviceInfo: {},
      queryObj: {},
      columns: [],
      showRight: false,
      Ecolumns,
      showMoreLight: false,
      bottomSpan: {
        left: 24,
        right: 10,
      },
    };
  },
  created() {},
  methods: {
    search(data) {
      console.log(data, "==========");
      this.$refs.Summary.loadData(this.queryObj);
    },
    setData(data) {
      if (_.isEmpty(data)) {
        this.bottomSpan.left = 24;
      } else {
        this.bottomSpan.left = 14;
      }
    },
  },
};
</script>