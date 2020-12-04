<template>
  <section class="topbarManage clearfix">
    <div class="fl">
      <a
        class="logo"
        @click="goHome"
      >
        <img
          :src="logo"
          alt="logo"
        />
      </a>
    </div>
    <div class="topbarManage_right fr clearfix">
      <div class="user fr">
        <a-dropdown>
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
      <div class="waring-box fr">
        <Warning></Warning>
      </div>
    </div>
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
    aAvatar: Avatar,
    Warning,
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
      console.log("点击");
      this.$router.push({ path: "/" });
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
</style>