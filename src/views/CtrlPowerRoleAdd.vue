<template>
  <!-- 权限管理--新增/编辑角色 -->
  <div class="add-role">
    <a-row class="bottom-sidebar high">
      <a-col>
        <CtrlPanel>
          <dt slot="title" class="clearfix pd-x20">
            {{modelTitle}}
            <router-link class="fr font14" to="/ctrl/power-management?tabKey=2">&lt;返回列表</router-link>
          </dt>
          <dd slot="content" class="pd-x20">
            <a-form :form="powerAddRole">
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="角色名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                      :disabled="isDisabled"
                      maxlength="10"
                      v-decorator="['roleName',{rules: [{ required: true, message: '请输入角色名称' }]}]"
                    ></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="角色描述" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                      :disabled="isDisabled"
                      maxlength="10"
                      v-decorator="['remark',{rules: [{ required: true, message: '请输入角色描述' }]}]"
                    ></a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row style="margin-top:10px">
                <a-col :span="24">
                  <a-form-item label="角色权限" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
                    <a-table
                      :columns="columns"
                      :rowKey="record => record.id"
                      :dataSource="dataList"
                      :pagination="false"
                      :customRow="cusRow"
                      :scroll="{x:1400,y:360}"
                    >
                      <template slot="operation" slot-scope="text, record">
                        <a-checkbox-group
                          :disabled="isDisabled"
                          :options="getPlainOptions(record)"
                          :value="plainValues"
                          @change="onChange"
                        ></a-checkbox-group>
                      </template>
                    </a-table>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24" style="margin-top:20px">
                <a-col style="text-align:center">
                  <a-button>
                    <router-link to="/ctrl/power-management?tabKey=2">{{isDisabled?"返回":'取消'}}</router-link>
                  </a-button>
                  <a-button
                    type="primary"
                    @click="handleAddRole"
                    style="margin-left:10px;"
                    v-if="!isDisabled"
                  >保存</a-button>
                </a-col>
              </a-row>
            </a-form>
          </dd>
        </CtrlPanel>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import _ from "lodash";
import PowerManager from "@/api/PowerManager";
import CtrlPanel from "@/components/CtrlPanel.vue";

const power = new PowerManager();

const columns = [
  {
    title: "列表",
    dataIndex: "menuName",
    width: 80
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 80,
    scopedSlots: { customRender: "operation" }
  }
];
export default {
  components: {
    CtrlPanel
  },
  data() {
    return {
      powerAddRole: this.$form.createForm(this),
      columns,
      dataList: [],
      roleId: "",
      modelTitle: "新建角色",
      pagination: {
        current: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0 //总数
      },
      taskRolesId: [],
      isDisabled: false,
      plainValues: [],
      currentInfoIds: []
    };
  },

  created() {
    this.roleId = this.$route.query.id;
    this.modelTitle = this.$route.query.modelTitle;
    this.isDisabled = this.$route.query.isViewPermission; //是否查看权限
    if (this.isDisabled) {
      this.loadPowerGetRoleInfo();
      this.loadPowerCheckRolePermission();
    } else if (this.roleId) {
      this.loadPowerPoleTreeList();
      this.loadPowerGetRoleInfo();
    } else {
      this.loadPowerPoleTreeList();
    }
  },
  methods: {
    getPlainOptions(record) {
      let plainOptions = [];
      record.buttonList &&
        record.buttonList.forEach(_ => {
          plainOptions.push({
            label: _.menuName,
            value: _.id
          });
        });
      return plainOptions;
    },

    cusRow(record) {
      return {
        on: {
          click: () => {
            this.currentInfoIds.push(record.id);
            this.currentInfoIds = [...new Set([...this.currentInfoIds])];
          }
        }
      };
    },
    onChange(checkedValues) {
      let plainValues = [];
      plainValues.push(...checkedValues);
      this.plainValues = [...new Set([...plainValues])];
    },

    // 获取菜单列表数据
    async loadPowerPoleTreeList() {
      let res = await power.powerQueryPoleTreeList().catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("加载失败");
        return;
      }
      this.dataList = res.data.rows;
    },
    // 根据角色ID获取角色信息
    async loadPowerGetRoleInfo() {
      let data = { roleId: this.roleId };
      let res = await power.powerGetRoleById(data).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("加载失败");
        return;
      }
      let ids = res.data.permissions;
      this.plainValues = ids && ids.map(_ => _.id);
      this.powerAddRole.setFieldsValue({
        roleName: res.data.roleName,
        remark: res.data.remark
      });
    },
    // 查看角色信息
    async loadPowerCheckRolePermission() {
      let data = { roleId: this.roleId };
      let res = await power.powerCheckRolePermissionById(data).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("加载失败");
        return;
      }
      let rolePermissionList = res.data.rolePermissionList;
      let dataList = [];
      // 如果菜单没有任何权限，就把菜单数据过滤掉
      rolePermissionList.forEach(r => {
        if (!_.isEmpty(r.buttonList)) {
          dataList.push(r);
        }
      });
      this.dataList = dataList;
      this.powerAddRole.setFieldsValue({
        roleName: res.data.roleName,
        remark: res.data.remark
      });
    },
    // 确认新建任务
    handleAddRole(e) {
      e.preventDefault();
      this.powerAddRole.validateFields((err, values) => {
        if (!err) {
          if (this.roleId) {
            this.powerRoleUpdateRole(values);
          } else {
            this.powerRoleAddRole(values);
          }
        }
      });
    },
    // 新建角色
    async powerRoleAddRole(values) {
      values["permissionList"] = [
        ...new Set([...this.plainValues, ...this.currentInfoIds])
      ];
      let res = await power.powerRoleAddRole(values).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning(res.msg);
        return;
      }
      this.$message.success("角色新建成功");
      this.$router.push("/ctrl/power-management?tabKey=2");
    },
    //编辑角色
    async powerRoleUpdateRole(values) {
      values["permissionList"] = [
        ...new Set([...this.plainValues, ...this.currentInfoIds])
      ];
      values["roleId"] = this.roleId;
      let res = await power.powerRoleUpdateRole(values).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("角色修改失败");
        return;
      }
      this.$message.success("角色修改成功");
      this.$router.push("/ctrl/power-management?tabKey=2");
    }
  }
};
</script>
<style scoped lang="less">
.add-role {
  /deep/.ant-input-disabled {
    background-color: transparent;
    color: #ddfdff;
    border-color: transparent;
  }
  /deep/.ant-checkbox-disabled .ant-checkbox-inner {
    background-color: #bbaaaa;
  }
  /deep/.ant-checkbox-disabled + span {
    color: #ddfdff;
  }
}
</style>
