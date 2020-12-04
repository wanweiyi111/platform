<template>
  <CtrlPanel class="bottom-sidebar">
    <dt slot="title"></dt>
    <dd slot="content"
        class="pd-x15">
      <div class="service-item service-item-taste">
        <h2 class="service-item-title">语音识别产品体验</h2>
        <div class="service-item-content service-item-taste-content">
          <div class="taste-content">
            <button class="taste-button ready-button"
                    id="taste_button">开始识别</button>
          </div>
          <div class="start-taste">
            <div class="start-taste-left">
              <div class="time-box">
                <span class="start-taste-line">
                  <hr class="hr hr1">
                  <hr class="hr hr2">
                  <hr class="hr hr3">
                  <hr class="hr hr4">
                  <hr class="hr hr5">
                  <hr class="hr hr6">
                  <hr class="hr hr7">
                  <hr class="hr hr8">
                  <hr class="hr hr9">
                  <hr class="hr hr10">
                </span>
                <span class="total-time"><span class="used-time">00: 00</span> / 01: 00</span></span>
              </div>
              <div class="start-taste-button">
                <button class="taste-button start-button">结束识别</button>
              </div>
            </div>
            <div class="output-box"
                 id="result_output"></div>
          </div>
        </div>
      </div>
    </dd>
  </CtrlPanel>
</template>

<script>
import './index.css'
import CtrlPanel from "@/components/CtrlPanel.vue";
import './index.js'

export default {
  components: { CtrlPanel },
  data () {
    return {

    };
  },
  created () { },
  methods: {

  }
};
</script>
<style lang="less">
.taste-button{
  border:1px solid red;
  z-index: 9999999;
}
</style>