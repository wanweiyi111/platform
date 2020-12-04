<template>
  <div>
    <a-empty
      :image="simpleImage"
      :description="description"
    />
  </div>

</template>
<script>
import { Empty } from "ant-design-vue";
export default {
  props: {
    description: {
      type: String,
      defaule: "暂无数据",
    },
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  },
};
</script>