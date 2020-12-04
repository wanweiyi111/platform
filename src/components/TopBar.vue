<template>
  <section class="topbar clearfix">
    <div class="left-menu fl">
      <a
        href="/"
        class="logo fl"
      >
        <img
          :src="logo"
          alt="logo"
        />
      </a>
    </div>
    <div class="right fr">
      <div class="timeBox ellipsis">{{nowTime}}</div>
      <Warning></Warning>
      <a-dropdown class="fr">
        <a
          class="ant-dropdown-link"
          href="#"
        >
          <a-avatar
            style="backgroundColor:#2db7f5"
            icon="user"
          />
        </a>
        <a-menu
          slot="overlay"
          @click="onSwitchAccount"
          class="manage-menu"
        >
          <a-menu-item key="1">
            {{userInfo.userName}}
            <span class="iconfont iconsign-out-alt"></span>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <div class="center">智慧灯杆管理云平台</div>
  </section>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { Avatar } from "ant-design-vue";
import Warning from "@/components/Warning.vue";
import baseMixin from "@/mixins/base.js";
import MapMixin from "@/mixins/map.js";
import Power from "@/api/PowerManager.js";
import logo from "@/assets/console/huazhi-logo-110px.svg";
const power = new Power();

export default {
  mixins: [baseMixin, MapMixin],
  components: {
    Warning,
    aAvatar: Avatar,
  },
  props: {
    title: String,
  },
  data() {
    return {
      logo,
      nowTime: "",
    };
  },
  created() {
    this.checkLogin();
    this.nowTimes();
  },
  computed: {
    ...mapGetters(["showStatus"]),
    ...mapState(["curProject"]),
    ...mapState(["userInfo"]),
  },
  mounted() {
    this.backCenter();
  },
  methods: {
    ...mapMutations(["changeShowStatus"]),
    switchComponent: (val) => {
      this.$store.dispatch("showStatusAction", val);
    },
    // 返回首页
    goHome() {
      this.$router.go(-1);
    },
    backCenter() {
      this.setCenter(this.curProject);
    },
    // 退出登录
    async onSwitchAccount() {
      let res = await power.logout();
      if (res.code != "200") {
        this.$message.warning("登出失败");
        return;
      }
      this.$router.replace("/login");
      sessionStorage.clear();
    },
    // 显示当前时间
    timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? "0" + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1;
      let date =
        new Date(timeStamp).getDate() < 10
          ? "0" + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate();
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? "0" + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds();
      let week = new Date(timeStamp).getDay();
      let weeks = ["日", "一", "二", "三", "四", "五", "六"];
      let getWeek = "星期" + weeks[week];
      this.nowTime =
        year +
        "年" +
        month +
        "月" +
        date +
        "日" +
        " " +
        hh +
        ":" +
        mm +
        ":" +
        ss +
        getWeek;
    },
    nowTimes() {
      this.timeFormate(new Date());
      setInterval(this.nowTimes, 1000);
      this.clear();
    },
    clear() {
      clearInterval(this.nowTimes);
      this.nowTimes = null;
    },
  },
};
</script>

<style scoped lang="less">
.logo {
  padding-right: 75px;
}
.ctrl-panel {
  > dt {
    height: 36px;
    line-height: 36px;
    font-weight: normal;
    background: rgba(2, 22, 82, 0.8);
  }
}
</style>