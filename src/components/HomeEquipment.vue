<template>
  <ul class="equipmentTotal">
    <template v-for="(item, index) in equipData">
      <li :key="index">
        <div class="left">
          <img
            :src="addImgStatus(item.name)"
            :alt="item.name"
          />
        </div>
        <a
          class="right"
          @click="toCtrl(addPathStatus(item.name))"
        >
          <span class="name ellipsis">{{item.name}}</span>
          <span class="num">{{item.value|| 0}}</span>
        </a>
      </li>
    </template>
  </ul>
</template>

<script>
import baseMixin from "@/mixins/base.js";
import equipmentA from "@/assets/console/big-screen-60px.svg";
import equipmentB from "@/assets/console/lighting-60px.svg";
import equipmentC from "@/assets/console/security-60px.svg";
import equipmentD from "@/assets/console/environment-60px.svg";
import equipmentE from "@/assets/console/sos-60px.svg";
import equipmentF from "@/assets/console/wifi-60px.svg";
import equipmentG from "@/assets/console/smart-lock-60px.svg";
import equipmentH from "@/assets/console/broadcast-60px.svg";
import equipmentR from "@/assets/console/radar-60px.svg";

export default {
  mixins: [baseMixin],
  props: {
    equipData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      previewVisible: false,
      previewImage: "",
      equipmentData: [
        {
          name: "信息发布",
          path: "/application-manage/display",
        },
        {
          name: "智慧照明",
          path: "/application-manage/light",
        },
        {
          name: "安防监控",
          path: "/application-manage/camera",
        },
        {
          name: "环境监测",
          path: "/application-manage/environment-monitor",
        },
        {
          name: "应急呼叫",
          path: "/application-manage/police",
        },
        {
          name: "智慧WiFi",
          path: "/application-manage/wifi",
        },
        {
          name: "智能柜锁",
          path: "/application-manage/smart-lock",
        },
        {
          name: "公共广播",
          path: "/application-manage/broad-cast",
        },
        {
          name: "智慧雷达",
          path: "/application-manage/radar",
        },
      ],
      equipmentIcos: [
        equipmentA,
        equipmentB,
        equipmentC,
        equipmentD,
        equipmentE,
        equipmentF,
        equipmentG,
        equipmentH,
        equipmentR,
      ],
    };
  },
  created() {},
  watch: {
    equipData: {
      handler(value) {
        return value;
      },
      deep: true,
    },
  },
  methods: {
    // 跳转地址
    toCtrl(paths) {
      this.$router.push({
        path: paths,
      });
    },
    addImgStatus(i) {
      switch (i) {
        case "信息发布":
          return equipmentA;
        case "智慧照明":
          return equipmentB;
        case "安防监控":
          return equipmentC;
        case "环境监测":
          return equipmentD;
        case "应急呼叫":
          return equipmentE;
        case "智慧WiFi":
          return equipmentF;
        case "智能柜锁":
          return equipmentG;
        case "公共广播":
          return equipmentH;
        case "智慧雷达":
          return equipmentR;
      }
    },
    addPathStatus(i) {
      switch (i) {
        case "信息发布":
          return this.equipmentData[0].path;
        case "智慧照明":
          return this.equipmentData[1].path;
        case "安防监控":
          return this.equipmentData[2].path;
        case "环境监测":
          return this.equipmentData[3].path;
        case "应急呼叫":
          return this.equipmentData[4].path;
        case "智慧WiFi":
          return this.equipmentData[5].path;
        case "智能柜锁":
          return this.equipmentData[6].path;
        case "公共广播":
          return this.equipmentData[7].path;
        case "智慧雷达":
          return this.equipmentData[8].path;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.equipmentTotal {
  overflow: hidden;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  li {
    width: 33%;
    overflow: hidden;
    .left {
      width: 45%;
      float: left;
      display: flex;
      justify-content: center;
    }
    .right {
      width: 55%;
      float: right;
      text-align: left;
      padding-top: 5px;
      font-size: 12px;
      color: #fff;
      .num {
        font-size: 16px;
        font-weight: bold;
        color: #2e8b57;
      }
    }
    span {
      display: block;
    }
    img {
      width: 45px;
      height: 45px;
    }
  }
  // li:nth-child(3n) {
  //   float: right;
  // }
}
</style>
