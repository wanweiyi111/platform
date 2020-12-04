<template>
  <!-- 设置设备权限 -->
  <div class="add-device-permission">
    <a-modal
      class="application_modal"
      :centered="true"
      title="设置设备权限"
      :visible="visible"
      :width="1000"
      @cancel="handleCancel"
      okText='确定'
      cancelText='取消'
    >
      <a-table
        class="Application_table"
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="dataList"
        :pagination="false"
      >
        <template
          slot="operation"
          slot-scope="text, record"
        >
          <a-checkbox-group
            :options="getPlainOptions(record)"
            :value="plainValues"
            @change="onChange($event, record)"
          ></a-checkbox-group>
        </template>
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
  </div>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import CONFIG_LIST from "@/config";
import PowerManager from "@/api/PowerManager";
const power = new PowerManager();
const { DeviceType } = CONFIG_LIST;

const columns = [
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
  {
    title: "授予权限",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
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
  created() {
    // this.loadDevicePermission();
  },
  methods: {
    // 获取设备数据
    async loadDevicePermission(projectId) {
      let res = await power.powerFindAllEquipments({ projectId: projectId });
      if (res.code != "200") {
        this.$message.warning("加载失败");
        return;
      }
      let data =
        res.data &&
        res.data.map((_, i) => {
          _.equipmentName = this.equiType[_.equipmentType];
          _.id = _.equipmentType + i;
          _.equipmentCode = _.equipmentType;
          return _;
        });
      this.dataList = data;
    },

    // 获取用户关联项目的设备权限
    async powerGetProjectDevice(projectId, userName) {
      let params = `userName=${userName}&projectId=${projectId}`;
      let res = await power.powerGetProjectDevice(params);
      if (res.code != "200") {
        this.$message.warning("加载失败");
        return;
      }
      !_.isEmpty(res.data) &&
        this.dataList.forEach((item) => {
          let _data = item["children"];
          _data.map((_item) => {
            if (res.data.includes(_item.equipmentCode)) {
              this.plainValues.push(_item.equipmentCode);
              this.permissionList.push({
                equipmentId: _item.equipmentCode,
                equipmentType: _item.equipmentType,
                userId: this.currentRecord.id,
                projectId: this.currentRecord.projectId,
                userName: this.currentRecord.userName,
              });
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

    onChange(checkedValues, record) {
      console.log('选择',checkedValues )
      let plainValues = [];
      let _permissionList = [];
      checkedValues.map((item) => {
        let _index = this.plainValues.indexOf(item);
        if (_index >= 0) {
          for (let i = 0; i < this.permissionList.length; i++) {
            if (this.permissionList[i].equipmentId === item) {
              _permissionList.push(this.permissionList[i]);
            }
          }
        } else {
          _permissionList.push({
            equipmentId: record.equipmentCode,
            equipmentType: record.equipmentType,
            userId: this.currentRecord.id,
            projectId: this.currentRecord.projectId,
            userName: this.currentRecord.userName,
          });
        }
      });
      plainValues.push(...checkedValues);
      this.plainValues = [...new Set([...plainValues])];
      this.permissionList = _permissionList;
      console.log()
    },
    // 关闭对话框
    handleCancel() {
      this.showModel();
    },
    // 添加设备权限更新列表数据
    loadPowerUserList() {
      this.$bus.emit("loadPowerUserList");
    },
    // 添加设备权限
    handleSave(e) {
      e.preventDefault();
      this.powerProjectAdd();
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