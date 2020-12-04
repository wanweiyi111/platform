<template>
  <div class="manage-con">
    <a-row>
      <a-col :span="24">
        <div class="Application-con_header">
          <Breadcrumb />
          <div class="search">
            <a-form
              class="ant-advanced-search-form"
              layout="inline"
              :form="searchForm"
              @submit="handleSearch"
            >
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item label="设备名称">
                    <a-input
                      v-decorator="[
                      'equipName',
                      {rules: [{ message: '请输入设备名称' }]},
                    ]"
                      placeholder="请输入设备名称"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="设备状态">
                    <a-select
                      v-decorator="[
                        'equipmentStatus',
                        { rules: [{message: '请选择设备状态' }] },
                      ]"
                      placeholder="请选择设备状态"
                    >
                      <a-select-option value="1">在线</a-select-option>
                      <a-select-option value="0">故障</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col
                  :span="8"
                  :style="{ textAlign: 'right' }"
                >
                  <a-button
                    type="primary"
                    html-type="submit"
                    icon="search"
                  >
                    搜索
                  </a-button>
                  <a-button
                    icon="delete"
                    :style="{ marginLeft: '8px' }"
                    @click="handleReset"
                  >
                    清空
                  </a-button>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-tabs
          class="Application_tabs"
          :activeKey="tabKey"
          @change="changeTabs"
        >
          <a-tab-pane
            key="1"
            tab="概览"
          >
            <Summary
              ref="Summary"
              :searchObj="SummaryObj"
            ></Summary>
          </a-tab-pane>
          <!-- <a-tab-pane
            tab="开关锁记录"
            key="2"
          >
            <History ref="History"></History>
          </a-tab-pane> -->
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import MapMixin from "@/mixins/map.js";
import baseMixin from "@/mixins/base.js";
import { mapMutations } from "vuex";
import Summary from "@/components/SmartLock/Summary.vue";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
export default {
  mixins: [baseMixin, MapMixin],
  components: {
    Summary,
    Breadcrumb,
  },
  data() {
    return {
      tabKey: "1",
      SummaryObj: {},
      columns: [],
      searchForm: this.$form.createForm(this, { name: "advanced_search" }),
    };
  },
  created() {
    let routeData = this.$route;
    let currentMenuId = routeData.meta.id || "";
    let currentMenuParentId = routeData.meta.parentId || "";
    this.setCurrentMenu(currentMenuId);
    this.setCurrentParentMenu(currentMenuParentId);
  },
  methods: {
    ...mapMutations(["setCurrentMenu", "setCurrentParentMenu"]),
    // 搜索
    handleSearch(e) {
      e.preventDefault();
      this.searchForm.validateFields((error, values) => {
        if (error) {
          return;
        }
        let obj = {};
        obj.equipmentName = values.equipName;
        obj.equipmentStatus = values.equipmentStatus;
        this.SummaryObj = obj;
        this.$bus.emit("loadLockData", true, this.SummaryObj); // 智能锁
      });
    },
    // 搜索重置
    handleReset() {
      this.searchForm.resetFields();
      this.SummaryObj = {};
    },
    changeTabs(key) {
      this.tabKey = key;
    },
  },
};
</script>
<style lang="less">
.ctrl-lock {
  .serchBar {
    width: 200px;
  }

  .serchBar {
    margin-left: 20px;
  }

  .ant-calendar-picker-input.ant-input {
    border-radius: 10px;
  }
}
</style>