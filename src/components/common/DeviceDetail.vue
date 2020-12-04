<template>
  <div :style="showMoreLight?'':'overflow:auto;height:210px;'">
    <a-collapse accordion v-model="activeCollKey" class="light-detail">
      <a-collapse-panel header="基本信息" key="1">
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">设备编码</a-col>
          <a-col :span="20">{{model.equipmentCode}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">资源名称</a-col>
          <a-col :span="4">{{model.equipmentName}}</a-col>
          <a-col :span="4" class="ar gray">设备型号</a-col>
          <a-col :span="4">{{model.equipmentModel}}</a-col>
          <a-col :span="4" class="ar gray">设备厂商</a-col>
          <a-col :span="4">{{model.manufacturerName}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <!-- <a-col :span="4" class="ar gray">设备MAC</a-col>
          <a-col :span="4">{{model.equipmentMac}}</a-col> -->
          <a-col :span="4" class="ar gray" v-if="model.groupName">所属分组</a-col>
          <a-col :span="4" v-if="model.groupName">{{model.groupName}}</a-col>
          <a-col :span="4" class="ar gray" v-if="model.controllerType">所属集中控制器</a-col>
          <a-col :span="4" v-if="model.controllerType">{{model.controllerType}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">安装位置</a-col>
          <a-col :span="4">{{model.location}}</a-col>
          <a-col :span="4" class="ar gray">经度</a-col>
          <a-col :span="4">{{model.longitude}}</a-col>
          <a-col :span="4" class="ar gray">纬度</a-col>
          <a-col :span="4">{{model.latitude}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray" v-if="type !== 'environment'">安装时间</a-col>
          <a-col :span="4" v-if="type !== 'environment'">{{model.installationTime | time}}</a-col>
          <a-col :span="4" class="ar gray">入网时间</a-col>
          <a-col :span="4">{{model.onlineTime | time}}</a-col>
          <a-col :span="4" class="ar gray">归属智慧杆</a-col>
          <a-col :span="4">{{model.poleName}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">联网状态</a-col>
          <a-col :span="4">{{model.networkState | formatNetworkState}}</a-col>
          <a-col :span="4" class="ar gray">设备状态</a-col>
          <a-col :span="4">{{model.equipmentStatus | formatEquipmentStatus}}</a-col>
          <a-col :span="4" class="ar gray" v-if="model.equipmentIp">资源IP</a-col>
          <a-col :span="4" v-if="model.equipmentIp">{{model.equipmentIp}}</a-col>
        </a-row>
        <a-row :gutter="10" v-if="model.deviceId">
          <a-col :span="4" class="ar gray">资源ID</a-col>
          <a-col :span="4">{{model.deviceId}}</a-col>          
        </a-row>
      </a-collapse-panel>
      <a-collapse-panel v-if="type === 'light'" header="规格参数" key="2">
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">开关状态</a-col>
          <a-col :span="4">{{model.onOff=='1'?'开':'关'}}</a-col>
          <a-col :span="4" class="ar gray">亮度</a-col>
          <a-col :span="4">{{model.brightness}}</a-col>
          <a-col :span="4" class="ar gray">电压(mV)</a-col>
          <a-col :span="4">{{model.voltage}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">电流(mA)</a-col>
          <a-col :span="4">{{model.current}}</a-col>
          <a-col :span="4" class="ar gray">功率(W)</a-col>
          <a-col :span="4">{{model.activePower}}</a-col>
          <a-col :span="4" class="ar gray">是否校时</a-col>
          <a-col :span="4">{{model.timing}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">策略模式</a-col>
          <a-col :span="4">{{model.policyMode}}</a-col>
          <a-col :span="4" class="ar gray">控制模式</a-col>
          <a-col :span="4">{{model.ctrlMode}}</a-col>
        </a-row>
      </a-collapse-panel>
      <!-- <a-collapse-panel v-else-if="type === 'camera'" header="规格参数" key="2">
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">ONVIF用户名</a-col>
          <a-col :span="4">{{model.onvifName}}</a-col>
          <a-col :span="4" class="ar gray">ONVIF用户密码</a-col>
          <a-col :span="4">{{model.onvifPasswd}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">主码流</a-col>
          <a-col :span="4">{{model.mainStream_url}}</a-col>
          <a-col :span="4" class="ar gray">子码流</a-col>
          <a-col :span="4">{{model.secondSubstream_url}}</a-col>
          <a-col :span="4" class="ar gray">三码流</a-col>
          <a-col :span="4">{{model.thirdSubstream_url}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">主码流宽度</a-col>
          <a-col :span="4">{{model.mainWidth}}</a-col>
          <a-col :span="4" class="ar gray">子码流宽度</a-col>
          <a-col :span="4">{{model.secondWidth}}</a-col>
          <a-col :span="4" class="ar gray">三码流宽度</a-col>
          <a-col :span="4">{{model.thirdWidth}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">主码流高度</a-col>
          <a-col :span="4">{{model.mainHeight}}</a-col>
          <a-col :span="4" class="ar gray">子码流高度</a-col>
          <a-col :span="4">{{model.secondHeight}}</a-col>
          <a-col :span="4" class="ar gray">三码流高度</a-col>
          <a-col :span="4">{{model.thirdHeight}}</a-col>
        </a-row>
      </a-collapse-panel> -->
      <a-collapse-panel v-else-if="type === 'display'" header="规格参数" key="2">
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">是否播放节目</a-col>
          <a-col :span="4">{{model.onPlay == '1' ? '是' : '否'}}</a-col>
          <a-col :span="4" class="ar gray">屏幕开关状态</a-col>
          <a-col :span="4">{{model.onOffText}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">屏幕亮度</a-col>
          <a-col :span="4">{{model.brightness}}</a-col>
          <a-col :span="4" class="ar gray">屏幕宽度</a-col>
          <a-col :span="4">{{model.screenWidth}}</a-col>
          <a-col :span="4" class="ar gray">屏幕高度</a-col>
          <a-col :span="4">{{model.screenHeight}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">开机时间</a-col>
          <a-col :span="4">{{model.uptime}}</a-col>
          <a-col :span="4" class="ar gray">内存容量</a-col>
          <a-col :span="4">{{model.memoryTotal}}</a-col>
          <a-col :span="4" class="ar gray">内存空闲量</a-col>
          <a-col :span="4">{{model.memoryFree}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">存储容量</a-col>
          <a-col :span="4">{{model.storageTotal}}</a-col>
          <a-col :span="4" class="ar gray">存储空闲量</a-col>
          <a-col :span="4">{{model.storageFree}}</a-col>
          <a-col :span="4" class="ar gray">色温</a-col>
          <a-col :span="4">{{model.colortemp}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">音量</a-col>
          <a-col :span="4">{{model.volume}}</a-col>
          <a-col :span="4" class="ar gray">刷新率</a-col>
          <a-col :span="4">{{model.fps}}</a-col>
        </a-row>
      </a-collapse-panel>
      <a-collapse-panel v-else-if="type === 'environment'" header="规格参数" key="2">
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">温度</a-col>
          <a-col :span="4">{{model.temperature}} ℃</a-col>
          <a-col :span="4" class="ar gray">湿度</a-col>
          <a-col :span="4">{{model.humidity}} rh</a-col>
          <a-col :span="4" class="ar gray">风向</a-col>
          <a-col :span="4">{{model.windDirection||0}} °度</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">风速</a-col>
          <a-col :span="4">{{model.windSpeed||0}} m/s</a-col>
          <a-col :span="4" class="ar gray">PM10</a-col>
          <a-col :span="4">{{model.pm10}} ug/m³</a-col>
          <a-col :span="4" class="ar gray">PM2.5</a-col>
          <a-col :span="4">{{model.pm25||'-'}} ug/m³(微克每立方米）</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="4" class="ar gray">噪声</a-col>
          <a-col :span="4">{{model.noise}} db</a-col>
          <a-col :span="4" class="ar gray">气压</a-col>
          <a-col :span="4">{{model.pressure}} （hPa百帕）</a-col>
          <a-col :span="4" class="ar gray">雨量</a-col>
          <a-col :span="4">{{model.rainfall||0}} （mm毫米）</a-col>
        </a-row>
      </a-collapse-panel>
      <a-collapse-panel v-else-if="type === 'radar'" header="规格参数" key="2">
        <a-row :gutter="10">
          <a-col :span="6" class="ar gray">雷达中心频率</a-col>
          <a-col :span="6">{{model.radarFrequency | valueWithUnit('KHZ')}}</a-col>
          <a-col :span="6" class="ar gray">探测最大距离</a-col>
          <a-col :span="6">{{model.maxValidDistance | valueWithUnit('m')}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="6" class="ar gray">距离分辨率</a-col>
          <a-col :span="6">{{model.distanceResolution | valueWithUnit('m')}}</a-col>
          <a-col :span="6" class="ar gray">最大测速</a-col>
          <a-col :span="6">{{model.maxDetectionSpeed | valueWithUnit('km/m')}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="6" class="ar gray">水平角度</a-col>
          <a-col :span="6">{{model.horizontalAngle | valueWithUnit('deg')}}</a-col>
          <a-col :span="6" class="ar gray">垂直角度</a-col>
          <a-col :span="6">{{model.verticalAngle | valueWithUnit('deg')}}</a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="6" class="ar gray">最大目标跟踪数</a-col>
          <a-col :span="6">{{model.maxTargetTrackNum | valueWithUnit('k')}}</a-col>
          <a-col :span="6" class="ar gray">发现目标的个数</a-col>
          <a-col :span="6">{{model.targetNum | valueWithUnit('个')}}</a-col>
        </a-row>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
// import CtrlPanel from "@/components/CtrlPanel.vue";

export default {
  name: "DeviceDetail",
  props: {
    model: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: "light"
    },
    showMoreLight: Boolean
  },
  data() {
    return {
      activeCollKey: "1"
    };
  },
  created() {
    if (this.type === "radar") {
      this.activeCollKey = "2";
    }
  },
  filters: {
    valueWithUnit(val, unit) {
      return val == undefined ? "" : `${val} ${unit}`;
    }
  }
};
</script>
