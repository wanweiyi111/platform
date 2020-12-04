<template>
  <div class="manage-con">
    <Breadcrumb />
    <a-row>
      <a-col :span="24">
        <div class="search">
          <a-form
            class="ant-advanced-search-form"
            layout="inline"
            :form="searchForm"
            @submit="handleSearch"
          >
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item label="关键词">
                  <a-input
                    v-decorator="[
                      'equipName',
                      {rules: [{ message: '请输入关键词' }]},
                    ]"
                    placeholder="请输入关键词"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="类型">
                  <a-select
                    dropdownClassName="application_dropdown"
                    v-decorator="[
                        'equipState',
                        { rules: [{message: '请选择类型' }] },
                      ]"
                    placeholder="请选择类型"
                    style="width:150px"
                  >
                    <a-select-option
                      v-for="(item, index) in typeList"
                      :key="index"
                      :value="tabKey==5?item.value:item"
                    >{{tabKey ==5?item.name:item}}</a-select-option>
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
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-tabs
          class="Application_tabs"
          :default-active-key="tabKey"
          @change="changeTabs"
        >
          <!-- <a-tab-pane
            tab="登录日志"
            key="1"
          >
            <LogTable
              :tabKey="tabKey"
              :query="queryObj"
              ref="table1"
            ></LogTable>
          </a-tab-pane> -->
          <a-tab-pane
            tab="操作日志"
            key="2"
          >
            <LogTable
              :tabKey="tabKey"
              :query="queryObj"
              ref="table2"
            ></LogTable>
          </a-tab-pane>
          <a-tab-pane
            tab="异常日志"
            key="3"
          >
            <LogTable
              :tabKey="tabKey"
              :query="queryObj"
              ref="table3"
            ></LogTable>
          </a-tab-pane>
          <a-tab-pane
            tab="应用日志"
            key="4"
          >
            <LogTable
              :tabKey="tabKey"
              :query="queryObj"
              ref="table4"
            ></LogTable>
          </a-tab-pane>
          <a-tab-pane
            tab="指令执行日志"
            key="5"
          >
            <LogTable
              :tabKey="tabKey"
              :query="queryObj"
              ref="table5"
            ></LogTable>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
    <!-- <section class="ctrl-light">
      <CtrlPanel
        :hide-title="true"
        class="bottom-sidebar high"
      >
        <dd
          slot="content"
          class="pd-x10"
        >
          <a-tabs
            :tabBarGutter="2"
            @change="changeTabs"
            :activeKey="tabKey"
          >

            <div
              slot="tabBarExtraContent"
              class="pd-t5"
            >
              类型：
              <a-select
                class="mr5"
                style="width: 110px;"
                size="small"
                defaultValue="a1"
                @change="changeType"
                placeholder="请选择"
              >
                <a-select-option
                  key="a1"
                  value="a1"
                >请选择</a-select-option>
                <a-select-option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :value="item"
                >{{item}}</a-select-option>
              </a-select>时间：
              <a-range-picker
                :format="dateFormat"
                showTime
                size="small"
                class="mr5"
                style="width: 200px;"
                @change="changeDateRange"
                :placeholder="['开始时间', '结束时间']"
              />
              <a-input-search
                @keydown.enter="startSearch"
                placeholder="请输入关键词"
                size="small"
                style="width: 130px;"
              />
            </div>
          </a-tabs>
        </dd>
      </CtrlPanel>
    </section> -->
  </div>
</template>

<script>
import utils from "@/utils";
import moment from "moment";
import { mapMutations } from "vuex";

import baseMixin from "@/mixins/base.js";
import LogTable from "@/components/Operation/LogTable.vue";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
import Log from "@/api/Log.js";
import { EquipmentTypeEnum } from "@/utils/enum.js";

const log = new Log();

export default {
  mixins: [baseMixin],
  components: { LogTable, Breadcrumb },
  data() {
    return {
      dateFormat: "YYYY/MM/DD",
      tabKey: "2",
      typeList: [],
      searchForm: this.$form.createForm(this, { name: "advanced_search" }),
      queryObj: {},
    };
  },
  created() {
    let routeData = this.$route;
    let currentMenuId = routeData.meta.id || "";
    let currentMenuParentId = routeData.meta.parentId || "";
    this.setCurrentMenu(currentMenuId);
    this.setCurrentParentMenu(currentMenuParentId);

    this.loadTypes();
  },
  methods: {
    ...mapMutations(["setCurrentMenu", "setCurrentParentMenu"]),
    moment,
    reloadTable(key) {
      let tabKey = Number(key) ? key : this.tabKey;
      this.$refs["table" + tabKey].LoadLogList();
    },
    // 搜索
    handleSearch(e) {
      e.preventDefault();
      this.searchForm.validateFields((error, values) => {
        const searchKeyMap = {
          1: "",
          2: "record",
          3: "detail",
          4: "record",
          5: "searchText",
        };
        const searchType = {
          1: "",
          2: "type",
          3: "level",
          4: "type",
          5: "equipmentType",
        };
        if (error) {
          return;
        }
        this.queryObj[searchKeyMap[this.tabKey]] = values.equipName;
        if (values.equipState) {
          this.queryObj[searchType[this.tabKey]] = values.equipState;
        }
        console.log("搜索", values);
        this.pageInfo.current = 1;
        this.reloadTable();
      });
    },
    // 搜索重置
    handleReset() {
      this.searchForm.resetFields();
      this.queryObj = {};
    },
    changeDateRange(dates) {
      try {
        this.queryObj.beginDate = dates[0].format(utils.fsTime);
        this.queryObj.startDate = dates[0].format(utils.fsTime);
        this.queryObj.endDate = dates[1].format(utils.fsTime);
        this.reloadTable();
      } catch (err) {
        console.info(err);
      }
    },
    // tab切换
    changeTabs(key) {
      let value = key;
      this.tabKey = value;
      this.queryObj = {};
      this.loadTypes();
    },
    startSearch(ev) {
      const searchKeyMap = {
        1: "",
        2: "record",
        3: "detail",
        4: "record",
        5: "searchText",
      };

      this.queryObj[searchKeyMap[this.tabKey]] = ev.target.value;
      this.reloadTable();
    },
    changeType(val) {
      val = val === "a1" ? "" : val;
      if (this.tabKey === "3") {
        this.queryObj.level = val;
      } else if (this.tabKey === "2" || this.tabKey === "4") {
        this.queryObj.type = val;
      } else if (this.tabKey === "5") {
        this.queryObj.equipmentType = val;
      }
      this.queryObj.projectId = this.projectId;
      if (!val) {
        delete this.queryObj.level;
        delete this.queryObj.type;
      }
      this.reloadTable();
    },
    // 获取不同栏目类型
    async loadTypes() {
      if (this.tabKey === "5") {
        let keys = Object.keys(EquipmentTypeEnum);
        let type = [];
        keys.map((item) => {
          type.push({
            value: item,
            name: utils.getEquipmentTypeText(item),
          });
        });
        this.typeList = type;
        console.log("类型列表", this.typeList);
        return;
      }
      const funcMap = {
        1: "",
        2: "operationsTypes",
        3: "exceptionsLevels",
        4: "applicationsTypes",
        5: "execLogQuery",
      };
      try {
        let res = await log[funcMap[this.tabKey]]();
        if (res.code !== "200") {
          this.typeList = [];
          return;
        }
        this.typeList = res.data;
      } catch (err) {
        this.typeList = [];
        console.info(err);
      }
    },
  },
};
</script>