<template>
  <dl class="mapTips" :style="{width: width, height: height}">
    <slot name="header"></slot>
    <slot name="content"></slot>
  </dl>
</template>
<script>
export default {
  name: 'InfoWindowBox',
  props: {
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 120
    }
  }
  
}
</script>
<style lang="less">
.mapTips {
  font-size: 14px;
  color: #ddfdff;
  background-image: linear-gradient(180deg, rgba(15,75,160,0.30) 0%, rgba(6,27,124,0.20) 67%);
  box-shadow: inset 0 0 2px 0 #35B0E6;
  border: 1px solid #154e9c;
  border-radius: 10px;
  span {
    display: inline-block;
    line-height: 30px;
  }
  .title {
    width: 56px;
    color: #7ec3fa;
    margin-right: 14px;
    text-align: right;
  }
  .data {
  }
}
</style>