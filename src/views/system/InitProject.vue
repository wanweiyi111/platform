<template>
  <!-- 权限管理--添加权限控制 -->
  <div class="createProject">
    <a-row>
      <a-col :spam="24">
        <Breadcrumb />
      </a-col>
    </a-row>
    <a-row class="projectInfo">
      <a-col :span='8'>
        <span class="title">项目编码</span>
        <a-auto-complete
          style="width: 200px"
          @select="onSelect"
          @search="handleSearch"
          placeholder="请输入项目编码"
          dropdownClassName="application_dropdown"
        >
          <template slot="dataSource">
            <a-select-option
              v-for="item in dataSource"
              :key="item.id"
              :value="item.id+'/'+item.projectName"
            >{{item.projectName}}</a-select-option>
          </template>
        </a-auto-complete>
      </a-col>
      <a-col :span='8'>
        <span class="title">项目名字</span>
        <span>{{projectName}}</span>
      </a-col>
      <a-col :span='8'>
        <a-button
          class="mr5"
          type="primary"
          icon="save"
          @click="save"
        >保存</a-button>
      </a-col>
    </a-row>
    <a-table
      class="Application_table"
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="equipmentList"
      :pagination="false"
      :rowSelection="rowSelection"
      :scroll="{y:500}"
    >
    </a-table>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import MapMixin from "@/mixins/map.js";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
import CONFIG_LIST from "@/config";
import API from "@/api/Pole";
import _ from "lodash";
let api = new API();
const { DeviceType } = CONFIG_LIST;
const columns = [
  {
    title: "资源分类与名称",
    dataIndex: "equipmentName",
  },
  {
    title: "设备型号",
    dataIndex: "equipmentModel",
    width: 120,
  },
  {
    title: "设备MAC",
    dataIndex: "equipmentMac",
    width: 160,
  },
  {
    title: "设备编号",
    dataIndex: "id",
    width: 160,
  },
];
export default {
  mixins: [MapMixin],
  components: { Breadcrumb },
  props: {
    model: Object,
  },
  data() {
    return {
      projectId: "",
      projectList: [],
      dataSource: [],
      projectName: "",
      columns,
      equipmentList: [],
      submitData: [],
      topType: [],
      selectedRowKeys: [], // 选中值
    };
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        getCheckboxProps: (record) => ({
          props: {
            disabled:
              !record.childrenLength && record.id == record.equipmentType,
          },
        }),
        onChange: this.onChangeSelect,
      };
    },
  },
  created() {
    // 左侧菜单 -s
    let routeData = this.$route;
    let currentMenuId = routeData.meta.id || "";
    let currentMenuParentId = routeData.meta.parentId || "";
    this.setCurrentMenu(currentMenuId);
    this.setCurrentParentMenu(currentMenuParentId);
    // 左侧菜单 -end

    this.loadList("findAllEquipmentWithout", {}, "equipmentList");
    this.loadList("getProjectList", {}, "projectList");
  },
  methods: {
    ...mapMutations(["setCurrentMenu", "setCurrentParentMenu"]),
    onChangeSelect(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      let selectData = selectedRows;
      let selected = [];
      // let ids = [];

      selectData.map((item) => {
        if (!item.equipmentType) {
          item.equipmentType = 1;
        }
        if (item.id != Number(item.equipmentType)) {
          selected.push({
            ids: [],
            equipmentType: item.equipmentType || 1,
            projectId: this.projectId,
          });
        }
      });
      selectData.map((item) => {
        if (item.id != Number(item.equipmentType)) {
          selected.map((_item, idx) => {
            if (
              item.equipmentType == _item.equipmentType ||
              item.equipmentType == null
            ) {
              selected[idx].ids.push(item.id);
            }
          });
        }
      });
      // 数组对象去重
      let b = new Map();
      let res = selected.filter(
        (item) => !b.has(item.equipmentType) && b.set(item.equipmentType, true)
      );
      this.submitData = res;
    },
    async loadList(type, opt, data) {
      let res = await api[type](opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      if (type === "findAllEquipmentWithout") {
        let _data = res.data;
        let processedData = (_data || []).map((_) => {
          if (_.children && _.children.length == 0) {
            delete _.children;
          }
          _.childrenLength = _.children ? _.children.length : 0;
          _.id = Number(_.equipmentType);
          _.equipmentName = DeviceType[_.equipmentType];
          return _;
        });
        this[data] = processedData;
      } else {
        this[data] = res.data;
      }
    },
    handleSearch(value) {
      let id = parseInt(value);
      this.loadList("getProjectList", { id: id }, "dataSource");
    },
    onSelect(value) {
      let data = value.split("/");
      // this.submitData.projectId = parseInt(data[0]);
      this.projectId = parseInt(data[0]);
      this.projectName = data[1];
      this.submitData.map((item, idx) => {
        this.submitData[idx]["projectId"] = parseInt(data[0]);
      });
    },
    save() {
      if (!this.projectName) {
        this.$message.error("请选择项目");
      } else if (this.submitData.length < 1) {
        this.$message.error("请选择具体设备");
      } else {
        this.loadSaveData();
        this.cancel();
        this.loadList("findAllEquipmentWithout", {}, "equipmentList");
      }
    },
    async loadSaveData() {
      let param = this.submitData;
      // let opt = Object.assign(param, { projectId: this.projectId });
      let res = await api.saveBindProject(param).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.$message.success("提交成功");
    },
    cancel() {
      this.submitData = [];
      this.topType = [];
    },
  },
};
</script>
<style lang="less">
.createProject {
  .projectInfo {
    color: #ddfdff;
    margin-bottom: 20px;
    .title {
      display: inline-block;
      margin-right: 10px;
    }
    input {
      border-radius: 10px;
    }
  }
}
</style>