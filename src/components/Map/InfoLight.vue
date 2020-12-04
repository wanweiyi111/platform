<template>
  <section class="mapTips">
    <div class="header">基本信息</div>
    <div class="content">
      <a-row type="flex" justify="space-around" align="middle" class="BottomMenu">
        <a-col span="12" class="leftContent">
          <span class="title">规格</span>
          <span class="data">10m</span>
        </a-col>
        <a-col span="12" class="rightContent">
          <span class="title">分组</span>
          <span class="data">分组01</span>
        </a-col>
      </a-row>
      <a-row type="flex" justify="space-around" align="middle" class="BottomMenu">
        <a-col span="12" class="leftContent">
          <span class="title">安装时间</span>
          <span class="data">2019-9-9</span>
        </a-col>
        <a-col span="12" class="rightContent">
          <span class="title">安装位置</span>
          <span class="data">龙岗</span>
        </a-col>
      </a-row>
      <a-row type="flex" justify="space-around" align="middle" class="BottomMenu">
        <a-col span="12" class="leftContent">
          <span class="title">经度</span>
          <span class="data">{{this.lightsI.lnglat.P.toFixed(5)}}</span>
        </a-col>
        <a-col span="12" class="rightContent">
          <span class="title">纬度</span>
          <span class="data">{{this.lightsI.lnglat.Q.toFixed(5)}}</span>
        </a-col>
      </a-row>
    </div>
  </section>
</template>

<script>
// import InfoWindowBox from './InfoWindowBox.vue';
import { mapGetters } from "vuex";

export default {
  // components: {
  //   InfoWindowBox
  // },
  props: {
    lightsInfo: Object
  },
  data() {
    return {
      lightsI: {
        lnglat: {
          P: 0,
          Q: 0
        }
      }
    };
  },
  computed: {
    ...mapGetters(["OneLightInfo"])
  },
  created() {
    // console.log(this.lightsInfo);
  },
  methods: {
    onChildChanged(newval) {
      this.$store.dispatch("getOneLightInfo");
      this.$data.lightsI.lnglat = newval["lnglat"];
    }
  }
};
</script>

<style lang="less">
//地图tips样式
.mapTips {
  font-size: 14px;
  color: #ddfdff;
  width: 380px;
  // background: url(../../assets/images/home-block-bg.svg) no-repeat;
  // background-size: cover;
  // background-position: center center;
  padding: 10px;
  span {
    display: inline-block;
    line-height: 30px;
  }
  .title {
    width: 75px;
    color: #7ec3fa;
    margin-right: 14px;
    text-align: right;
  }
  .data {
  }
}
</style>
