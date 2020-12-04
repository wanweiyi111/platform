<template>
  <div class="manage-con">
    <Breadcrumb />
    <NewAddTask />
  </div>
</template>

<script>
import NewAddTask from "@/components/Broadcast/AddTask.vue";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
export default {
  components: {
    NewAddTask,
    Breadcrumb,
  },
  created() {},
};
</script>
<style lang="less" scoped>
</style>
>
