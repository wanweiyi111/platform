<template>
  <div class="CameraCtrl">
    <a-row
      :gutter="16"
      class="bottom-sidebar"
      id="CameraCtrlBox"
    >
      <a-col :span="24">
        <CtrlPanel :hide-title="false">
          <dd
            slot="content"
            class="pd-x20"
          >
            <a-tabs
              :tabBarGutter="2"
              @change="callback"
            >
              <a-tab-pane
                tab="实时监控"
                key="1"
              >
                <Live />
              </a-tab-pane>
              <a-tab-pane
                tab="历史回放"
                key="2"
              >
                <Demand type="demand" />
              </a-tab-pane>
              <div
                slot="tabBarExtraContent"
                class="pd-t5"
              >
                <a
                  href="/"
                  class="toCamera"
                >
                  <i class="iconfont iconangle-left"></i>
                  <!-- 安防列表 -->
                  返回首页
                </a>
              </div>
            </a-tabs>
          </dd>
        </CtrlPanel>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import CtrlPanel from "@/components/CtrlPanel.vue";
import Live from "./Live";
import Demand from "./Demand";

export default {
  components: {
    CtrlPanel,
    Live,
    Demand,
    // Warnning,
  },
  props: {
    model: Object,
  },
  data() {
    return {};
  },
  created() {
    // window.player.dispose();
  },
  computed: {},
  methods: {
    callback(e) {
      console.log("回调", e);
      // window.player.dispose();
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less">
.CameraCtrl {
  .bottom-sidebar {
    height: calc(100% - 100px) !important;
    .toCamera {
      color: #97e9ff;
      font-size: 14px;
    }
  }
}
</style>
