<template>
  <div class="AddTaskView">
    <Map />
    <TopBar />
    <AddTask />
  </div>
</template>

<script>
import AddTask from "@/components/AddTask.vue"; // @ is an alias to /src
import Map from "@/components/Map/Map.vue"; // @ is an alias to /src
import TopBar from "@/components/TopBar.vue"; // @ is an alias to /src
export default {
  components: {
    AddTask,
    Map,
    TopBar
  },
  created() {}
};
</script>
<style lang="less" scoped>
</style>
>
