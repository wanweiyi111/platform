<template>
  <section class="mapTips">
    <div class="header">基本信息</div>
    <div class="content">
      <a-row type="flex" justify="start" align="middle" class="BottomMenu">
        <a-col span="12" class="rightContent" v-if="device.equipmentName">
          <span class="title">设备名称</span>
          <span class="data">{{device.equipmentName}}</span>
        </a-col>
        <a-col span="12" class="leftContent" v-if="device.location||device.parkingAddress">
          <span class="title">位置</span>
          <span class="data">{{device.location||device.parkingAddress}}</span>
        </a-col>
      </a-row>
      <a-row type="flex" justify="start" align="middle" class="BottomMenu" v-if="!device.equipmentType">
        <a-col span="12" class="leftContent" v-if="device.bingTotal">
          <span class="title">挂载设备数</span>
          <span class="data">{{device.bingTotal}}</span>
        </a-col>
      </a-row>
      <a-row type="flex" justify="start" align="middle" class="BottomMenu" v-if="device.equipmentType === 4192">
        <a-col span="12" class="leftContent" v-if="device.targetNum">
          <span class="title">在线设备数</span>
          <span class="data">{{device.targetNum}}</span>
        </a-col>
      </a-row>
      <!-- <a-row type="flex" justify="start" align="middle" class="BottomMenu">
        <a-col span="12" class="leftContent" v-if="device.equipmentModel">
          <span class="title">型号</span>
          <span class="data">{{device.equipmentModel}}</span>
        </a-col>
        <a-col span="12" class="rightContent" v-if="device.manufacturerName">
          <span class="title">设备厂商</span>
          <span class="data">{{device.manufacturerName}}</span>
        </a-col>
      </a-row> -->
      <a-row type="flex" justify="start" align="middle" class="BottomMenu" v-if="device.equipmentType||device.parkingStatus">
        <a-col span="12" class="leftContent" v-if="device.onOff">
          <span class="title">开关状态</span>
          <span class="data">{{device.onOff==='0'?'关':'开'}}</span>
        </a-col>
        <a-col span="12" class="rightContent" v-if="device.equipmentStatus">
          <span class="title">设备状态</span>
          <span class="data">{{device.equipmentStatus|formatEquipmentStatus}}</span>
        </a-col>
        <a-col span="12" class="rightContent" v-if="device.parkingStatus">
          <span class="title">车位状态</span>
          <span class="data">{{parkingStatus[device.parkingStatus]}}</span>
        </a-col>
        <a-col span="12" class="rightContent" v-if="device.parkingDesc">
          <span class="title">车位描述</span>
          <span class="data">{{device.parkingDesc}}</span>
        </a-col>
      </a-row>
    </div>
  </section>
</template>

<script>
// import InfoWindowBox from './InfoWindowBox.vue';
// import { mapGetters } from "vuex";
export default {
  // components: {
  //   InfoWindowBox
  // },
  props: {
    device: Object
  },
  data(){
    return{
      parkingStatus:{ '0': '空置', '1': '使用中', '2': '异常' }
    }
  },
  created() {
  },
};
</script>

<style lang="less">
/*地图tips样式*/
.mapTips {
  font-size: 14px;
  color: #ddfdff;
  width: 380px;
  /* background: url(../../assets/images/home-block-bg.svg) no-repeat; */
  /* background-size: cover; */
  /* background-position: center center; */
  padding: 10px;
  span {
    display: inline-block;
    line-height: 30px;
  }
  .title {
    width: 85px;
    color: #7ec3fa;
    margin-right: 14px;
    text-align: right;
  }
  .data {
  }
}
</style>
