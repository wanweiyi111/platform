<template>
  <div class="manage-con">
    <Breadcrumb />
    <LightPole />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import LightPole from "@/components/LightPole/index.vue";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
export default {
  components: {
    LightPole,
    Breadcrumb,
  },
  created() {
    let routeData = this.$route;
    let currentMenuId = routeData.meta.id || "";
    let currentMenuParentId = routeData.meta.parentId || "";
    this.setCurrentMenu(currentMenuId);
    this.setCurrentParentMenu(currentMenuParentId);
  },
  methods: {
    ...mapMutations(["setCurrentMenu", "setCurrentParentMenu"]),
  },
};
</script>
<style lang="less" scoped>
.ant-select-dropdown {
  z-index: 99999999;
}
.CameraView {
  // height: 100%;
  position: relative;
}
</style>
