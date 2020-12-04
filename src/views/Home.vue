<template>
  <div class="home">
    <TopBar />
    <router-view v-show="showStatus"></router-view>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import TopBar from "@/components/TopBar.vue"; // @ is an alias to /src
// import Api from "@/api/";

let modal = null;

export default {
  components: {
    // Map,
    TopBar,
  },
  data() {
    return {
      // showStatus: this.$store.state.showStatus
    };
  },
  created() {
    // this.findByNameOrLocation();
    let userInfo = JSON.parse(sessionStorage.getItem("loginData"));
    this.setloginInfo(userInfo);
    this.$bus.on("http-blocked", (msg) => {
      if (modal) {
        modal.destroy();
      }
      modal = this.$modal.error({ title: "提示", content: msg });
    });
  },
  computed: {
    ...mapState(["userInfo", "token"]),
    ...mapGetters(["showStatus"]),
  },
  methods: {
    ...mapActions(["findByNameOrLocation", "getUserInfoByToken"]),
    ...mapMutations(["setloginInfo"]),
  },
};
</script>

<style lang="less">
.home {
  height: 100%;
  position: relative;
}
</style>
