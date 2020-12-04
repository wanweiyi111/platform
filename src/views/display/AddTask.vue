<template>
  <div class="manage-con">
    <Breadcrumb :modifyTitle="modelTitle" />
    <NewAddTask />
  </div>
</template>

<script>
import NewAddTask from "@/components/Display/NewAddTask.vue"; // @ is an alias to /src
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
export default {
  components: {
    NewAddTask,
    Breadcrumb,
  },
  data() {
    return {
      modelTitle: "新建任务",
    };
  },
  created() {
    let routeQuery = this.$route.query;
    this.modelTitle = routeQuery.modelTitle;
  },
};
</script>
<style lang="less" scoped>
</style>
>
