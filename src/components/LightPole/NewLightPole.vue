<template>
  <div
    class="lightPoleContent camareInfo"
    :style="{height:fullHeight-270 +'px'}"
  >
    <div
      class="lightPoleBox"
      ref="lightpoleBox"
      v-if="equiDataOdd.length>0 || equiDataEven.length>0"
    >
      <ul
        class="poleEqui"
        :class="{'poleEquiOdd': equiDataOdd.length>0}"
        :style="{height:fullHeight-280 +'px'}"
        v-if="equiDataOdd.length>0"
      >
        <li
          v-for="(item,index) in equiDataOdd"
          :key="index"
          :style="{width:fullHeight/10 + 'px',height:fullHeight/10 + 'px',top: 20*index + 10 + '%',left:2.5*(8-index)+ '%',}"
          :class="{'actionClass':equiActionOdd==item.code}"
          @click="sendParetCode(item.code)"
        >
          <div class="itemCon">
            <img
              :src="matchIco(item.code)"
              :class="{'sosImg':item.code==4240}"
            />
            <span class="name">{{item.name}}</span>
          </div>
        </li>
      </ul>
      <ul
        class="poleEqui"
        :class="{'poleEquiEven': equiDataEven.length>0}"
        v-if="equiDataEven.length>0"
      >
        <li
          v-for="(item,index) in equiDataEven"
          :key="index"
          :style="{width:fullHeight/10 + 'px',height:fullHeight/10 + 'px',top: 20*index + 10 + '%',right:1.2*(8-index)+ '%'}"
          :class="{'actionClass':equiActionEven==item.code}"
          @click="sendParetRightCode(item.code)"
        >
          <img
            :src="matchIco(item.code)"
            :class="{'sosImg':item.code==4240}"
          />
          <span class="name">{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div v-else>
      <NoData description="暂无设备信息" />
    </div>
  </div>
</template>

<script>
import NoData from "@/components/common/NoData.vue";
import Icobroadcast from "@/assets/new-lightplatform/ico_broadcast.svg";
import Icocamare from "@/assets/new-lightplatform/ico_camare.svg";
import Icoenvironment from "@/assets/new-lightplatform/ico_environment.svg";
import IcoLED from "@/assets/new-lightplatform/ico_LED.svg";
import Icolight from "@/assets/new-lightplatform/ico_light.svg";
import Icolock from "@/assets/new-lightplatform/ico_lock.svg";
import Icoradar from "@/assets/new-lightplatform/ico_radar.svg";
import Icosos from "@/assets/new-lightplatform/ico_sos.png";
import Icowifi from "@/assets/new-lightplatform/ico_wifi.svg";

// import CApi from "@/api/Pole";

// const { DeviceType } = CONFIG_LIST;

// let api = new CApi();
export default {
  props: {
    equiDataEven: Array,
    equiDataOdd: Array,
    // equiNum: Number,
    equiActionEven: String,
    equiActionOdd: String,
    fullHeight: Number,
  },
  components: {
    NoData,
  },

  data() {
    return {
      equiIco: [
        Icobroadcast,
        Icocamare,
        Icoenvironment,
        IcoLED,
        Icolight,
        Icolock,
        Icoradar,
        Icosos,
        Icowifi,
      ],
      equiList: [],
      lightWith: 0,
      noDataStyle: {
        color: "#f40",
      },
    };
  },
  created() {},
  watch: {},
  mounted() {},
  computed: {},
  methods: {
    // 对应图标
    matchIco(code) {
      let oldCode = parseInt(code);
      let ico = "";
      if (oldCode) {
        switch (oldCode) {
          case 4112:
            ico = Icolight;
            break;
          case 4128:
            ico = Icocamare;
            break;
          case 4129:
            ico = Icowifi;
            break;
          case 4144:
            ico = IcoLED;
            break;
          case 4176:
            ico = Icoenvironment;
            break;
          case 4192:
            ico = Icoradar;
            break;
          case 4208:
            ico = Icolock;
            break;
          case 4240:
            ico = Icosos;
            break;
          case 4272:
            ico = Icobroadcast;
            break;
        }
      }
      return ico;
    },
    //
    sendParetCode(value) {
      this.$emit("listenChildLeftCode", value);
    },
    sendParetRightCode(value) {
      this.$emit("listenChildRightCode", value);
    },
  },
};
</script>

<style lang="less">
</style>
