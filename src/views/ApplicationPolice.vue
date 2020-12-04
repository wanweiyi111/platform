<template>
  <div class="manage-con">
    <a-row>
      <a-col :span="24">
        <div class="Application-con_header">
          <div class="top">
            <i class="iconfont iconengine-warning"></i>
            <span style="paddingLeft:10px">应急呼叫</span>
          </div>
          <div class="bread">
            <a-breadcrumb>
              <a-breadcrumb-item href="">
                <a-icon type="home" />
              </a-breadcrumb-item>
              <a-breadcrumb-item href="">
                <span>应用管理</span>
              </a-breadcrumb-item>
              <a-breadcrumb-item>
                应急呼叫
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          <div class="search">
            <a-form
              class="ant-advanced-search-form"
              layout="inline"
              :form="searchForm"
              @submit="handleSearch"
              v-if="tabKey == 1"
            >
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item label="设备名称">
                    <a-input
                      v-decorator="[
                      'equipmentName',
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
                        'equipState',
                        { rules: [{message: '请选择设备状态' }] },
                      ]"
                      placeholder="请选择设备状态"
                    >
                      <a-select-option value="1">正常</a-select-option>
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
            <a-row
              :gutter="24"
              v-else
            >
              <a-col :span="6">
                <a-input-search
                  placeholder="请输入关键词"
                  v-model="historyInput"
                  @search="searchHistory"
                >
                  <a-button
                    type="primary"
                    style="border-color: rgba(255,255,255,0.5);"
                    slot="enterButton"
                  >
                    <a-icon type="search" />搜索
                  </a-button>
                </a-input-search>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-tabs
          class="Application_tabs"
          @change="changeTabs"
        >
          <a-tab-pane
            tab="概览"
            key="1"
          >
            <Summary
              ref="Summary"
              :searchValue="summaryObj"
              @codeFunc="getCodeFunc"
            ></Summary>
          </a-tab-pane>
          <a-tab-pane
            tab="历史"
            key="2"
          >
            <History
              ref="History"
              :searchValue="historyObj"
            ></History>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>

  </div>
</template>

<script>
import _ from "lodash";
import { mapMutations } from "vuex";
import MapMixin from "@/mixins/map.js";
import baseMixin from "@/mixins/base.js";
import Summary from "@/components/Police/Summary.vue";
import History from "@/components/Police/History.vue";
export default {
  mixins: [baseMixin, MapMixin],
  components: {
    Summary,
    History,
  },
  data() {
    return {
      tabKey: "1",
      summaryObj: {},
      historyObj: {},
      visible: false,
      searchForm: this.$form.createForm(this, { name: "advanced_search" }),
      historyInput: "", // 历史关键词
      equipCode: [], // 设备编码
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
        console.log("搜索值", values);
        if (values.equipmentName) {
          obj.equipmentName = values.equipmentName;
        }
        if (values.equipState) {
          obj.equipmentStatus = values.equipState;
        }
        this.summaryObj = obj;
      });
    },
    // 搜索重置
    handleReset() {
      this.searchForm.resetFields();
      this.summaryObj.equipmentName = "";
      this.summaryObj.equipmentStatus = "";
    },
    changeTabs(key) {
      console.log("tab切换", key);
      this.tabKey = key;
      if (key == "1") {
        this.handleReset();
      } else {
        this.historyInput = "";
        this.historyObj = {};
      }
    },
    // 历史搜索
    searchHistory() {
      let obj = {};
      obj.equipmentName = this.historyInput;
      // obj.equipmentCodes = this.equipCode;
      this.historyObj = obj;
    },
    // 获取子组件设备编码
    getCodeFunc(data) {
      this.equipCode = data;
      // this.historyObj = {
      //   equipmentCodes: data,
      // };
    },
  },
};
</script>
<style lang="less">
.ctrl-police {
  .serchBar {
    width: 200px;
  }
}
</style>