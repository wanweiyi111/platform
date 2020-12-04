<template>
  <div class="manage-con">
    <a-row>
      <a-col :span="24">
        <div class="Application-con_header">
          <Breadcrumb />
          <div class="search">
            <a-row
              :gutter="24"
              v-if="tabkey==1"
            >
              <a-col :span="7">
                <a-input-search
                  placeholder="请输入关键字"
                  @search="searchDetail"
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
            <a-form
              class="ant-advanced-search-form"
              layout="inline"
              :form="searchForm"
              @submit="handleSearch"
              v-else
            >
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item label="车牌号">
                    <a-input
                      v-decorator="[
                      'carCode',
                      {rules: [{ message: '请输入车牌号' }]},
                    ]"
                      placeholder="请输入车牌号"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="车位地址">
                    <a-input
                      v-decorator="[
                      'parkingAddress',
                      {rules: [{ message: '请输入车位地址' }]},
                    ]"
                      placeholder="请输入车位地址"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="时间">
                    <a-range-picker
                      :format="dateFormat"
                      :placeholder="['开始时间', '结束时间']"
                      v-decorator="['rangePicker', {rules: [{type: 'array', message: '请选择时间' }]}]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="8"></a-col>
                <a-col :span="8"></a-col>
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
      <a-col :span="24">
        <div class="table">
          <a-tabs
            class="Application_tabs"
            :default-active-key="tabkey"
            @change="callback"
          >
            <a-tab-pane
              tab="车位管理"
              key="1"
            >
              <div class="tab-btns">
                <a-button
                  type="dashed"
                  icon="plus"
                  @click="showModalAddParking"
                >
                  新建车位
                </a-button>
              </div>
              <ParkingManager
                ref="parking"
                :searchValue="queryObjDetail"
                @returnParkingEdit="handleParkingEdit"
              />
            </a-tab-pane>
            <a-tab-pane
              tab="停车记录"
              key="2"
            >
              <ParkingRecord :searchValue="equipObj" />
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
    <!-- 新建/编辑车位 -->
    <ModalAddParking
      :visible="visibleEqAddInfo"
      @returnVisibleStatus="hideModelAddParking"
      @returnAddParking="handleAddParking"
    />
  </div>
</template>

<script>
import _ from "lodash";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
import ParkingManager from "@/components/Etc/ParkingManager.vue";
import ParkingRecord from "@/components/Etc/ParkingRecord.vue";
import ModalAddParking from "@/components/Etc/ModalAddParking.vue";
import baseMixin from "@/mixins/base.js";
import utils from "@/utils";
import { mapMutations } from "vuex";

export default {
  mixins: [baseMixin],
  components: {
    Breadcrumb,
    ParkingManager,
    ModalAddParking,
    ParkingRecord,
  },
  data() {
    return {
      tabkey: "1",
      searchForm: this.$form.createForm(this, { name: "advanced_search" }),
      equipObj: {
        // current: 1,
        // equipmentName: "",
        // equipmentStatus: "",
        // pageNum: 1,
        // pageSize: 10,
        // total: 5,
      },
      equipInfoView: {}, // 详情数据
      visibleEquipInfo: false,
      queryObjDetail: {}, // 关键字搜索
      keywordSearch: {},

      visibleEqAddInfo: false, // 新建车位 vidible
      dateFormat: "YYYY/MM/DD", // 日期格式
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
    // 车位管理 - 编辑
    handleParkingEdit(val) {
      let value = val;
      this.modelTitle = "编辑车位";
      this.visibleEqAddInfo = true;
      this.$bus.emit("initFormProject", value);
    },
    // 车位管理 -新建车位
    showModalAddParking() {
      this.visibleEqAddInfo = true;
    },
    // 车位管理 -新建车位 取消
    hideModelAddParking(val) {
      let state = val;
      this.visibleEqAddInfo = state;
    },
    // 新增车位
    handleAddParking(val) {
      console.log("新增车位", val);
      this.$refs.parking.loadData({});
    },
    // 搜索
    handleSearch(e) {
      e.preventDefault();
      this.searchForm.validateFields((error, values) => {
        if (error) {
          return;
        }
        let searchKeywords = values;
        let startDate = searchKeywords.rangePicker
          ? searchKeywords.rangePicker[0].format(utils.fsTime)
          : "";
        let endDate = searchKeywords.rangePicker
          ? searchKeywords.rangePicker[1].format(utils.fsTime)
          : "";
        let keyWords = {
          carCode: searchKeywords.carCode,
          parkingAddress: searchKeywords.parkingAddress,
          startDate: startDate,
          endDate: endDate,
        };
        this.equipObj = keyWords;
        console.log("搜索", searchKeywords.rangePicker, startDate, endDate);
      });
    },
    // 搜索重置
    handleReset() {
      this.searchForm.resetFields();
      this.equipObj = {};
    },
    //切换tab回调
    callback(key) {
      this.tabkey = key;
    },
    // 关键字搜索
    searchDetail(val) {
      let key = {
        searchText: val,
      };
      console.log("搜索", val);
      // this.keywordSearch = this.queryObjDetail;
      this.queryObjDetail = key;
    },
  },
};
</script>
