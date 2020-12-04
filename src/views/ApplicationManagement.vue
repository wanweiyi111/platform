<template>
  <div class="home Application-container">
    <TopBarManage />
    <div class="Application">
      <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-sider
          v-model="collapsed"
          collapsible
        >
          <SiderMenu type="menu">
            <a
              class="ant-dropdown-link"
              href="#"
            >
              <i class="iconfont iconoutdent"></i> 菜单
            </a>
          </SiderMenu>
        </a-layout-sider>
        <a-layout :style="{height:fullHeight-65+'px',overflow:'auto'}">
          <a-layout-content :style="{padding: '15px',}">
            <a-row>
              <a-col :span='24'>
                <router-view></router-view>
              </a-col>
            </a-row>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </div>
  </div>
</template>

<script>
import TopBarManage from "@/components/TopBarManage.vue"; // @ is an alias to /src
import SiderMenu from "@/components/SiderMenu.vue";
import { Layout } from "ant-design-vue";
export default {
  components: {
    TopBarManage,
    SiderMenu,
    aLayout: Layout,
    aLayoutSider: Layout.Sider,
    aLayoutContent: Layout.Content,
  },
  data() {
    return {
      collapsed: false,
      fullHeight:
        document.documentElement.clientHeight || document.body.clientHeight,
    };
  },
  created() {
    this.get_bodyHeight();
  },
  methods: {
    operationStretch() {
      this.collapsed != this.collapsed;
    },
    // 获取屏幕高度
    get_bodyHeight() {
      //动态获取浏览器高度
      const that = this;
      window.addEventListener("resize", () => {
        let fullHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        that.fullHeight = fullHeight;
      });
    },
  },
};
</script>
<style lang="less">
.ant-select-dropdown {
  z-index: 99999999;
}
.CameraView {
  height: 100%;
  position: relative;
}
</style>
>
