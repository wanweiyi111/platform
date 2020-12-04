<template>
  <div class="left-main-menu-wrap">
    <a-dropdown :overlayStyle="overlayStyle">
      <slot></slot>
      <a-menu slot="overlay">
        <template v-for="item in data_list">
          <a-menu-item :key="item.id" v-if="!item.hasChildren">
            <router-link :to="item.path||''">
              <i :class="item.icon"></i>
              {{item.permissionName}}
            </router-link>
          </a-menu-item>
          <a-sub-menu :key="item.id" v-else>
            <span slot="title">
              <i :class="item.icon"></i>
              <span>{{item.permissionName}}</span>
            </span>
            <a-menu-item
              v-for="item2 in item.children"
              :key="item2.id"
              @click="setMapCenter(item2.location)"
            >
              <router-link :to="item2.path||''">
                <i :class="item2.icon"></i>
                {{item2.permissionName}}
              </router-link>
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import baseMixin from "@/mixins/base.js";
import { mapState } from "vuex";
import _ from "lodash";

export default {
  mixins: [baseMixin],
  props: {
    type: String
  },
  data() {
    return {
      overlayStyle: {
        height: "52px"
      },
      data_list: []
    };
  },
  created() {
    if (
      this.userInfo.permissions.menus &&
      _.isArray(this.userInfo.permissions.menus)
    ) {
      this.data_list = this.userInfo.permissions.menus.sort((a, b) => {
        return a.orderNum - b.orderNum;
      });
      this.data_list.forEach(item => {
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
    ...mapState(["userInfo"])
  },
  methods: {
    setMapCenter(val) {
      if (this.type !== "map") return "";
      // MAP.setZoomAndCenter(17, val);
    }
  }
};
</script>

<style lang="less">
/********* overwrite ant style**********/
ul.ant-dropdown-menu {
  // height: 276px;
  width: 136px;
  // background-image: linear-gradient(
  //   180deg,
  //   rgba(15, 75, 160, 0.3) 0%,
  //   rgba(6, 27, 124, 0.2) 67%
  // );
  background: rgba(0, 10, 39, 1);
  box-shadow: inset 0 0 2px 0 #35b0e6;
}
li.ant-dropdown-menu-item,
div.ant-dropdown-menu-submenu-title {
  padding: 13px 12px;
  border-bottom: 1px solid rgba(28, 102, 162, 1);
}
</style>
