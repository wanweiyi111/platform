<template>
  <a-menu
    class="sideMenu"
    mode="inline"
    :open-keys="curMenuParentId"
    :selected-keys="curMenuId"
    :style="{height:fullheight-97 +'px'}"
    @openChange="onOpenChange"
  >
    <template v-for="item in menu">
      <a-menu-item
        :key="item.id"
        v-if="!item.hasChildren"
      >
        <router-link :to="item.path||''">
          <i
            class="iconfont"
            :class="item.icon"
          ></i>
          <span class="name">{{item.permissionName}}</span>
        </router-link>
      </a-menu-item>
      <a-sub-menu
        :key="item.id"
        v-else
      >
        <span
          class="item-title"
          slot="title"
        >
          <i
            class="iconfont"
            :class="item.icon"
          ></i>
          <span class="name">{{item.permissionName}}</span>
        </span>
        <a-menu-item
          v-for="item2 in item.children"
          :key="item2.id"
          @click="setMapCenter(item2.location)"
        >
          <router-link :to="item2.path||''">
            <i
              class="iconfont"
              :class="item2.icon"
            ></i>
            <span class="name">{{item2.permissionName}}</span>
          </router-link>
        </a-menu-item>
      </a-sub-menu>
    </template>
  </a-menu>
</template>

<script>
import baseMixin from "@/mixins/base.js";
import { mapState, mapMutations } from "vuex";
import _ from "lodash";

export default {
  mixins: [baseMixin],
  props: {
    type: String,
    fullheight: Number,
  },
  data() {
    return {
      data_list: [],
      openKeys: [],
      rootSubmenuKeys: [], // 根目录
      menuDate: [
        {
          id: 20016,
          path: "/application-manage",
          icon: "iconth",
          permissionName: "应用管理",
          hasChildren: true,
          children: [
            {
              hasChildren: false,
              hasParent: true,
              icon: "iconlightbulb1",
              id: 40308,
              parentId: 20016,
              path: "/application-manage/light",
              permissionName: "智慧照明",
            },
            // {
            //   hasChildren: false,
            //   hasParent: true,
            //   icon: "iconlightbulb1",
            //   id: 40318,
            //   parentId: 20016,
            //   path: "/application-manage/PLClight",
            //   permissionName: "PLC照明",
            // },
            {
              hasChildren: false,
              hasParent: true,
              icon: "iconscreen",
              id: 40309,
              parentId: 20016,
              path: "/application-manage/display",
              permissionName: "信息发布",
            },
            {
              hasChildren: false,
              hasParent: true,
              icon: "iconwebcam",
              id: 40310,
              parentId: 20016,
              path: "/application-manage/camera",
              permissionName: "安防监控",
            },
            {
              hasChildren: false,
              hasParent: true,
              icon: "iconleaf",
              id: 40311,
              parentId: 20016,
              path: "/application-manage/environment-monitor",
              permissionName: "环境监测",
            },
            {
              hasChildren: false,
              hasParent: true,
              icon: "iconwifi",
              id: 40313,
              parentId: 20016,
              path: "/application-manage/wifi",
              permissionName: "智慧WIFI",
            },
            {
              hasChildren: false,
              hasParent: true,
              icon: "iconleida",
              id: 40312,
              parentId: 20016,
              path: "/application-manage/radar",
              permissionName: "智慧雷达",
            },
            {
              hasChildren: false,
              hasParent: true,
              icon: "iconlock-alt",
              id: 40314,
              parentId: 20016,
              path: "/application-manage/smart-lock",
              permissionName: "智能锁柜",
            },
            {
              hasChildren: false,
              hasParent: true,
              icon: "iconengine-warning",
              id: 40315,
              parentId: 20016,
              path: "/application-manage/police",
              permissionName: "应急呼叫",
            },
            {
              hasChildren: false,
              hasParent: true,
              icon: "iconbroadcast-tower",
              id: 40316,
              parentId: 20016,
              path: "/application-manage/broad-cast",
              permissionName: "公共广播",
            },
          ],
        },
      ],
      menu: [], // 菜单数据
    };
  },
  created() {
    this.menu = this.permissions.menus;
    if (this.menu.length > 0) {
      this.menu.map((item) => {
        this.rootSubmenuKeys.push(item.id);
      });
    }
    if (
      this.userInfo.permissions.menus &&
      _.isArray(this.userInfo.permissions.menus)
    ) {
      this.data_list = this.userInfo.permissions.menus.sort((a, b) => {
        return a.orderNum - b.orderNum;
      });
      this.data_list.forEach((item) => {
        if (!_.isArray(item.children)) {
          return;
        }
        item.children = item.children.sort((a, b) => {
          return a.orderNum - b.orderNum;
        });
      });
    }
  },
  computed: {
    ...mapState(["userInfo", "curMenuId", "curMenuParentId"]),
  },
  methods: {
    ...mapMutations(["setCurrentMenu", "setCurrentParentMenu"]),
    setMapCenter() {
      if (this.type !== "map") return "";
    },
    // 只展开一个自己菜单
    onOpenChange(openKeys) {
      let curMenuParent = null;
      const latestOpenKey = openKeys.find(
        (key) => this.curMenuParentId.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        curMenuParent = openKeys;
      } else {
        curMenuParent = latestOpenKey ? latestOpenKey : null;
      }
      this.setCurrentParentMenu(curMenuParent);
    },
    // 点击对应菜单item
    menuClick(val) {
      console.log("菜单点击", val);
    },
    // 选中
    menuSelect(val) {
      console.log("菜单点击", val);
    },
  },
};
</script>

<style lang="less">
/********* overwrite ant style**********/
ul.ant-dropdown-menu {
  width: 136px;
  background: rgba(0, 10, 39, 1);
  box-shadow: inset 0 0 2px 0 #35b0e6;
}
li.ant-dropdown-menu-item,
div.ant-dropdown-menu-submenu-title {
  padding: 13px 12px;
  border-bottom: 1px solid rgba(28, 102, 162, 1);
}
.ant-menu-inline-collapsed {
  > .ant-menu-item {
    .name {
      display: none;
    }
  }
}
</style>
