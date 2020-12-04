<template>
  <div
    class="sudeTree"
    ref="sudeTree"
    :style="{height:fullheight-52 +'px', overflowY: 'auto'}"
  >
    <div v-if="states && treeData.length>0">
      <!-- <a-icon type="appstore" /> -->
      <a-icon
        type="bars"
        :style="{ fontSize: '26px',color:'#fff' }"
      />
      <!-- <a-icon type="gold" /> -->
    </div>
    <div v-else>
      <a-tree
        :tree-data="treeData"
        show-icon
        :default-expand-all="autoExpandParent"
        :default-selected-keys="[projectId]"
        @select="onSelect"
        v-if="treeData.length>0"
      >
        <i
          slot="dg"
          type="dg"
          class="iconfont icondg"
          style="font-size:14px"
        ></i>
      </a-tree>
      <div
        class="white2 ac"
        v-else
      >暂无数据</div>
    </div>

    <!-- <a-icon type="caret-left" :rotate="props.isActive ? 90 : -90" /> -->
  </div>
</template>

<script>
export default {
  props: {
    treeData: Array,
    fullheight: Number,
    projectId: Number,
    states: Boolean, // 展开或关闭侧边栏
  },
  data() {
    return {
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
    };
  },
  mounted() {
    this.autoExpandParent = true;
  },
  methods: {
    // 伸缩按钮
    // stretchBtn() {
    //   console.log("前", this.openSide);
    //   this.openSide = !this.openSide;
    //   this.$emit("listenChildSideState", this.openSide);
    //   console.log("后", this.openSide);
    // },
    onSelect(keys) {
      let key = keys[0] || 0;
      console.log("当前key", key);
      if (!key) {
        this.$message.warning("已是最新数据");
      } else if (key != 10020) {
        this.$emit("listenChildSideId", key);
      }
    },
    onCheck(checkedKeys, info) {
      console.log("onCheck", checkedKeys, info);
    },
    onExpand() {
      console.log("Trigger Expand");
    },
  },
};
</script>

<style scoped lang="less">
</style>
