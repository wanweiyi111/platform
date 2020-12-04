<template>
  <div class="manage-con">
    <iframe
      frameborder="0"
      ref="otherIframe"
      name="iframepage"
      value="1234564"
    >
    </iframe>
  </div>
</template>

<script>
import MapMixin from "@/mixins/map.js";
import baseMixin from "@/mixins/base.js";
import { mapMutations } from "vuex";
import spon_base64 from "@/libs/new/spon_base64.js";

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
      // 1. 传入参数为： {"username":"test","password":"123456","isadmin":"1","display":"测试"}
      var username = "admin"; // 用户名
      var password = "admin"; // 密码
      var display = "测试"; // 显示名
      var isadmin = "1"; // 1为管理员， 0为普通用户
      var lang = "zh"; // 语言（zh/en)
      var theme = "green"; // 显示风格(green/black/darkgreen/black_red)
      var hidetitle = "0"; // 1:隐藏标题栏 0：显示标题栏【默认】
      var force = "0"; // 1：强制修改用户名，密码，以外部平台为主  0：验证XC9000系统本身的用户名，密码【默认】
      var logo = "1"; // 1: 显示LOGO 0：不显示LOGO【默认】
      var context =
        "{'username':'" +
        username +
        "','password':'" +
        password +
        "','display':'" +
        display +
        "','isadmin':'" +
        isadmin +
        "','lang':'" +
        lang +
        "','theme':'" +
        theme +
        "','hidetitle':'" +
        hidetitle +
        "','force':'" +
        force +
        "','logo':'" +
        logo +
        "'}";
      var b = new spon_base64();
      let encoderData = b.encode(context);

      let frame = this.$refs.otherIframe;
      frame.src =
        "http://192.168.3.142/index_empty.html?spon_token=" + encoderData;
      window.addEventListener("resize", this.handleResize);
    },
    handleResize() {
      this.fullHeight = document.documentElement.clientHeight;
      this.fullWidth = document.documentElement.clientWidth;
      let frame = this.$refs.otherIframe;
      frame.width = this.fullWidth - 230;
      frame.height = this.fullHeight - 100;
    },
  },
};
</script>

