<template>
  <!-- 设置设备权限 -->
  <a-modal
    class="application_modal"
    :centered="true"
    :maskClosable="false"
    title="设置设备权限"
    :visible="visible"
    :width="1000"
    @cancel="handleCancel"
    okText='确定'
    cancelText='取消'
    v-if="visible"
  >
    <a-table
      class="Application_table"
      :columns="columns"
      :rowKey="record => record.equipmentCode"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :dataSource="dataList"
      :pagination="false"
      :defaultExpandAllRows="true"
      :scroll="{y:500}"
    >
    </a-table>
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >取消</a-button>
      <a-button
        key="submit"
        type="primary"
        @click="handleSave"
      >保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import CONFIG_LIST from "@/config";
import PowerManager from "@/api/PowerManager";

const power = new PowerManager();

const { DeviceType } = CONFIG_LIST;

const columns = [
  // {
  //   title: "ID",
  //   dataIndex: "id",
  // },
  {
    title: "设备",
    dataIndex: "equipmentName",
  },
  {
    title: "设备编码",
    dataIndex: "equipmentCode",
  },
  {
    title: "所属位置",
    dataIndex: "location",
  },
];

export default {
  mixins: [baseMixin],
  components: {},
  props: {
    visible: Boolean,
    showModel: Function,
  },
  data() {
    return {
      columns,
      dataList: [],
      equipmentName: {
        camareInfo: "4128",
        lightInfo: "4112",
        environmentalInfo: "4176",
        displayInfo: "4144",
        radarInfo: "4192",
      },
      equiType: DeviceType,
      plainValues: [],
      currentInfoCodes: [],
      permissionList: [],
      currentRecord: [],
      selectedRowKeys: [],
      parentIds: [],
    };
  },
  mounted() {
    this.$bus.on("initFormProject", (record, isEdit) => {
      this.isEdit = isEdit;
      this.id = record.id;
      this.initFormProject(record, isEdit);
    });
    this.$bus.on("getDevicePermission", async (record) => {
      this.currentRecord = record;
      await this.loadDevicePermission(record.projectId);
      this.powerGetProjectDevice(record.projectId, record.userName);
    });
  },
  created() {},
  methods: {
    onSelectChange(selectedRowKeys, $even) {
      let rowData = $even;
      let _permissionList = [];
      // console.log("selectedRowKeys changed: ", selectedRowKeys, $even);
      rowData.map((item) => {
        if (item.equipmentModel) {
          _permissionList.push({
            equipmentId: item.equipmentCode,
            equipmentType: item.equipmentType,
            userId: this.currentRecord.id,
            projectId: this.currentRecord.projectId,
            userName: this.currentRecord.userName,
          });
        }
      });
      this.permissionList = _permissionList;
      // this.selectedRowKeys = selectedRowKeys;
      // console.log("选中的", this.permissionList, this.selectedRowKeys, rowData);
    },
    // onSelectAllChange(selected, selectedRows, changeRows) {
    //   console.log("选中所有的", selected, selectedRows, changeRows);
    // },
    // 获取设备数据
    async loadDevicePermission(projectId) {
      let parentIds = [];
      let res = await power.powerFindAllEquipments({ projectId: projectId });
      if (res.code != "200") {
        this.$message.warning("加载失败");
        return;
      }
      let data =
        res.data &&
        res.data.map((_) => {
          if (_.children && _.children.length == 0) {
            delete _.children;
          }
          _.equipmentName = this.equiType[_.equipmentType];
          _.id = _.equipmentType;
          _.equipmentCode = _.equipmentType;
          parentIds.push(_.equipmentType);

          return _;
        });
      this.dataList = data;
      this.parentIds = parentIds;
      // console.log("设备数据", data, parentIds);
    },

    // 获取用户关联项目的设备权限
    async powerGetProjectDevice(projectId, userName) {
      this.permissionList = [];
      let params = `userName=${userName}&projectId=${projectId}`;
      let res = await power.powerGetProjectDevice(params);
      if (res.code != "200") {
        this.$message.warning("加载失败");
        return;
      }
      // console.log("用户关联的项目", res.data);
      this.selectedRowKeys = res.data;
      !_.isEmpty(res.data) &&
        this.dataList.forEach((item) => {
          let _data = item["children"];
          _data.map((_item) => {
            if (_item.equipmentModel) {
              if (res.data.includes(_item.equipmentCode)) {
                // this.selectedRowKeys.push(_item.id);
                this.permissionList.push({
                  equipmentId: _item.equipmentCode,
                  equipmentType: _item.equipmentType,
                  userId: this.currentRecord.id,
                  projectId: this.currentRecord.projectId,
                  userName: this.currentRecord.userName,
                });
              }
            }
          });
        });
    },
    getPlainOptions(record) {
      let plainOptions = [];
      plainOptions.push({
        value: record.equipmentCode,
      });

      return plainOptions;
    },

    // 关闭对话框
    handleCancel() {
      this.selectedRowKeys = []; // 初始化选中框
      this.showModel();
    },
    // 添加设备权限更新列表数据
    loadPowerUserList() {
      this.$bus.emit("loadPowerUserList");
    },
    // 添加设备权限
    handleSave(e) {
      e.preventDefault();
      if (this.permissionList.length > 0) {
        this.powerProjectAdd();
      } else {
        this.$message.error("请至少选择一个设备");
      }
    },
    // 新建项目
    async powerProjectAdd() {
      let data = Array.from(
        new Set(this.permissionList.map((_) => JSON.stringify(_)))
      ).map((_) => JSON.parse(_));
      let res = await power.powerAddProjectDevice(data).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.data.code !== "200") {
        this.$message.warning("设备权限新增失败");
        return;
      }
      this.$message.success("设备权限新增成功");
      this.handleCancel();
      this.loadPowerProjectList();
    },
  },
};
</script>