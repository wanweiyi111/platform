<template>
  <div class="application_title">
    <div class="top">
      <i
        class="iconfont"
        :class="breadData.meta.icon?breadData.meta.icon:''"
      ></i>
      <span style="paddingLeft:10px">{{modifyTitle?modifyTitle:breadData.meta.title}}</span>
    </div>
    <div class="bread">
      <a-breadcrumb>
        <a-breadcrumb-item href="/">
          <a-icon type="home" />
        </a-breadcrumb-item>
        <template v-for="(item,index) in levelBread">
          <a-breadcrumb-item
            :key="index"
            :href="item.path"
            v-if="item.path"
          >{{item.title}}</a-breadcrumb-item>
          <a-breadcrumb-item
            :key="index"
            :href="item.path"
            v-else
          >{{item.title}}</a-breadcrumb-item>
        </template>
      </a-breadcrumb>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    description: {
      type: String,
      defaule: "暂无数据",
    },
    modifyTitle: {
      type: String,
      defaule: "",
    },
  },
  data() {
    return {
      breadData: {},
      levelBread: [],
    };
  },
  computed: {
    breadcrumb() {
      let title = "";
      title = this.modifyTitle;
      return title;
    },
  },
  created() {
    let routeData = this.$route;
    this.breadData = routeData;
    let breadDatas = routeData.matched;
    let modifyData = [];
    let removalData = []; // 去重判断
    breadDatas.map((item) => {
      if (item.path != "/platform") {
        if (removalData.indexOf(item.meta.title) == -1) {
          modifyData.push({
            title: item.meta.title,
            icon: item.meta.icon,
            path: item.path,
          });
          removalData.push(item.meta.title);
        }
      }
    });
    // 修改面包屑标题
    if (this.breadcrumb) {
      modifyData[modifyData.length - 1].title = this.breadcrumb;
    }
    this.levelBread = modifyData;
    if (routeData.name == "add-program") {
      if (routeData.query.programId) {
        this.$route.meta.title = "编辑节目";
      } else {
        this.$route.meta.title = "新建节目";
      }
    } else if (routeData.name == "add-task") {
      if (routeData.query.taskId) {
        this.$route.meta.title = "编辑任务";
      } else {
        this.$route.meta.title = "新建任务";
      }
    } else if (routeData.name == "light-task") {
      if (routeData.query.taskId) {
        this.$route.meta.title = "编辑照明任务";
      } else {
        this.$route.meta.title = "新建照明任务";
      }
    }
  },
};
</script>