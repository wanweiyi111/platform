<template>
  <div class="LightInfoRigth">
    <img :src="this.lightsIcon" alt id="bgimg" style="display:none" @load="this.imgOnload" />
    <Box :title="title" :total="total" v-bind:showNotice="false" type="RightMenu" v-if="imgLoaded">
      <a-row type="flex" justify="space-around" align="middle" class="arow">
        <ChartRingSingle v-for="(item, index) in data" :key="index" :chartBoxId="'LightInfoBar' + (index + 1)" :chartText="item.chartText" :chartVal="item.chartVal"></ChartRingSingle>
        <!-- <ChartRingSingle chartBoxId="LightInfoBar1" chartText="在线率" :chartVal="10"></ChartRingSingle>
        <ChartRingSingle chartBoxId="LightInfoBar2" chartText="离线率" :chartVal="40"></ChartRingSingle>
        <ChartRingSingle chartBoxId="LightInfoBar3" chartText="故障率" :chartVal="80"></ChartRingSingle> -->
      </a-row>
    </Box>
  </div>
</template>

<script>
import ChartRingSingle from "@/components/common/ChartRingSingle.vue"; // @ is an alias to /src
import Box from "@/components/Box.vue"; // @ is an alias to /src
import lightsIcon from '@/assets/images/lightBar.jpg';

export default {
  components: {
    Box,
    ChartRingSingle
  },
  props: {
    title: String,
    data: Array,
    total: {
      type: String,
      default: ''
    }
    // chartVal: Number,
    // chartText: String
  },
  data() {
    return {
      imgLoaded: false,
      lightsIcon: lightsIcon
    };
  },
  created() {

  },
  methods: {
    imgOnload() {
      this.$data.imgLoaded = true;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.LightInfoRigth {
  width: 150px;
  height: 400px;
  .box {
    height: 400px;
  }

  .arow {
    padding: 20px 14px;
    & > div {
      margin-bottom: 13px;
    }
  }
}
</style>
