<template>
  <section class="summary-sidebar">
    <a-row class="item">
      <a-col :span="11">
        <i class="iconfont iconlightbulb"></i>
      </a-col>
      <a-col :span="13">
        <div class="font16 white1">
          <i class="iconfont iconlightbulb"></i>
          {{allDeviceInfo.light.allTotal}}
        </div>
        <div class="font16 red2">
          <i class="iconfont iconlightbulb-slash"></i>
          {{allDeviceInfo.light.errorTotal}}
        </div>
      </a-col>
    </a-row>
    <a-row class="item">
      <a-col :span="11">
        <i class="iconfont iconrectangle-portrait"></i>
      </a-col>
      <a-col :span="13">
        <div class="font16 white1">
          <i class="iconfont iconrectangle-portrait"></i>
          {{allDeviceInfo.screen.allTotal}}
        </div>
        <div class="font16 red2">
          <i class="iconfont iconrectangle-portrait-slash"></i>
          {{allDeviceInfo.screen.errorTotal}}
        </div>
      </a-col>
    </a-row>
    <a-row class="item">
      <a-col :span="11">
        <i class="iconfont iconwebcam"></i>
      </a-col>
      <a-col :span="13">
        <div class="font16 white1">
          <i class="iconfont iconwebcam"></i>
          {{allDeviceInfo.camera.allTotal}}
        </div>
        <div class="font16 red2">
          <i class="iconfont iconwebcam-slash"></i>
          {{allDeviceInfo.camera.errorTotal}}
        </div>
      </a-col>
    </a-row>
    <a-row class="item">
      <a-col :span="11">
        <i class="iconfont iconjzjc3-copy"></i>
      </a-col>
      <a-col :span="13">
        <div class="font16 white1">
          <i class="iconfont iconjzjc3-copy"></i>
          {{allDeviceInfo.sensor.allTotal}}
        </div>
        <div class="font16 red2">
          <i class="iconfont iconwifi-slash"></i>
          {{allDeviceInfo.sensor.errorTotal}}
        </div>
      </a-col>
    </a-row>
  </section>
</template>

<script>
export default {
  props: {
    allDeviceInfo: Object
  }
};
</script>
<style lang="less">
.summary-sidebar.right-sidebar {
  i {
    display: inline-block;
    margin-top: -10px;
  }
}
</style>