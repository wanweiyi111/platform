<template>
  <router-view></router-view>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  components: {},
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

