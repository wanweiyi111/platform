<template>
  <div class="manage-con">
    <iframe
      frameborder="0"
      ref="PLCIframe"
      name="iframepage"
      value="1212"
    >
    </iframe>
  </div>
</template>

<script>
import MapMixin from "@/mixins/map.js";
import baseMixin from "@/mixins/base.js";
import { mapMutations } from "vuex";

export default {
  name: "PLClight",
  mixins: [baseMixin, MapMixin],
  components: {},
  data() {
    return {
      fullWidth: document.documentElement.clientWidth,
      fullHeight: document.documentElement.clientHeight,
    };
  },
  created() {
    let routeData = this.$route;
    let currentMenuId = routeData.meta.id || "";
    let currentMenuParentId = routeData.meta.parentId || "";
    this.setCurrentMenu(currentMenuId);
    this.setCurrentParentMenu(currentMenuParentId);

    this.$nextTick(() => {
      this.initFrame();
    });
  },
  beforeDestroy: function () {
    window.removeEventListener("resize", this.handleResize);
  },
  mounted() {
    this.handleResize();
  },
  methods: {
    ...mapMutations(["setCurrentMenu", "setCurrentParentMenu"]),
    initFrame() {
      let frame = this.$refs.PLCIframe;
      frame.src =
        "http://120.24.34.198:60100/contents/road-light/home/home.html?username=admin&pwd=admin123#";

      window.addEventListener("resize", this.handleResize);
    },
    handleResize() {
      this.fullHeight = document.documentElement.clientHeight;
      this.fullWidth = document.documentElement.clientWidth;

      let frame = this.$refs.PLCIframe;
      frame.width = this.fullWidth - 230;
      frame.height = this.fullHeight - 100;
    },
  },
};
</script>

