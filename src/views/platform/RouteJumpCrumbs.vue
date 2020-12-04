<template>
  <a-row>
    <a-col :span="24">
      <div class="Application-con_header">
        <Breadcrumb />
      </div>
    </a-col>
    <a-col class="mt20">
      <router-view></router-view>
    </a-col>
  </a-row>

</template>

<script>
import { mapMutations } from "vuex";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {
    // 左侧菜单 -s
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

