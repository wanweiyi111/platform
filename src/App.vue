<template>
  <div class="root">
    <a-spin class="loading" v-show="httpCount > 0">
      <a-icon slot="indicator" type="loading" style="font-size: 48px" spin />
    </a-spin>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      httpCount: false,
    };
  },
  created() {
    this.$bus.off("loading").on("loading", (count) => {
      // debugger;
      this.httpCount = count;
    });
  },
};
</script>

<style lang="less">
html,
body {
  height: 100%;
  position: relative;
}
.root {
  height: 100%;
}

.loading {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1000;
  transform: translate(-50%, -50%);
}
</style>
