<template>
  <div class="add-user">
    <a-modal
      class="application_modal"
      :centered="true"
      :title="modelTitle"
      :visible="visible"
      :width="840"
      @cancel="handleCancel"
      okText='确定'
      cancelText='取消'
    >
      <a-form :form="formPowerUser">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="用户名"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                maxlength="10"
                :disabled="isEdit"
                v-decorator="['userName',{rules: [{ required: !isEdit, message: '请输入用户名' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="真实姓名"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                maxlength="10"
                :disabled="isEdit"
                v-decorator="['realName',{rules: [{ required: !isEdit, message: '请输入真实名称' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="手机号码"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                maxlength="11"
                v-decorator="['mobile',{rules: [{ required: true, message: '请输入手机号码' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="Email"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                maxlength="32"
                v-decorator="['email',{rules: [{ required: true, message: '请输入邮箱' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="关联项目"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-select
                dropdownClassName="application_dropdown"
                :disabled="isEdit"
                v-decorator="['projectId',{rules: [{ required: !isEdit, message: '请选择关联项目' }]}]"
              >
                <a-select-option
                  v-for="item in projectList"
                  :key="item.id"
                  :value="item.id"
                >{{item.projectName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="关联角色"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-select
                dropdownClassName="application_dropdown"
                :disabled="isEdit"
                v-decorator="['roleId',{rules: [{ required: !isEdit, message: '请选择关联角色' }]}]"
              >
                <a-select-option
                  v-for="item in roleList"
                  :key="item.roleId"
                  :value="item.roleId"
                >{{item.roleName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="到期时间"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-date-picker
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择时间"
                style="width:100%"
                :disabled="isEdit"
                v-decorator="['endEffectivePeriod',{rules: [{ required: !isEdit, message: '请选择时间' }]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="所属部门"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-select
                dropdownClassName="application_dropdown"
                v-decorator="['deptId',{rules: [{ required: true, message: '请选择关联角色' }]}]"
              >
                <a-select-option
                  v-for="item in deptList"
                  :key="item.deptId"
                  :value="item.deptId"
                >{{item.deptName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="新密码"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                type="password"
                v-decorator="['passWord',{rules: [{ required: true, message: '请输入密码' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="确认新密码"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-input
                type="password"
                v-decorator="['confirmPassword',{rules: [{ required: true, message: '请确认密码' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
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
import utils from "@/utils/";
import moment from "moment";
import PowerManager from "@/api/PowerManager";

const power = new PowerManager();
export default {
  components: {},
  props: {
    visible: Boolean,
    showModel: Function,
    modelTitle: String,
  },

  data() {
    return {
      formPowerUser: this.$form.createForm(this),
      projectList: [],
      roleList: [],
      deptList: [],
      isEdit: false,
    };
  },
  created() {
    this.powerUserQueryProjectList();
    this.powerUserQueryRoleList();
    this.powerUserQueryDeptList();
  },
  mounted() {
    this.$bus.on("initFormAddUser", (record, isEdit) => {
      this.isEdit = isEdit;
      this.initFormAddUser(record, isEdit);
    });
  },
  methods: {
    moment,
    // 编辑用户填充表单
    initFormAddUser(record, isEdit) {
      if (isEdit) {
        this.$nextTick(() => {
          this.formPowerUser.setFieldsValue({
            userName: record.userName,
            realName: record.realName,
            mobile: record.mobile,
            email: record.email,
            projectId: record.projectName,
            roleId: record.roleName,
            endEffectivePeriod: moment(
              record.endEffectivePeriod,
              "YYYY-MM-DD hh:mm:ss"
            ),
            deptId: record.deptName,
          });
        });
      }
    },
    handleCancel() {
      this.formPowerUser.resetFields();
      this.isEdit = false;
      this.showModel();
    },
    // 新建/编辑用户后更新列表数据
    loadPowerUserList() {
      this.$bus.emit("loadPowerUserList");
    },
    // 确认新建/编辑用户
    handleSave(e) {
      e.preventDefault();
      this.formPowerUser.validateFields((err, values) => {
        if (!err) {
          if (this.isEdit) {
            this.powerUserUpdate(values);
          } else {
            this.powerUserAdd(values);
          }
        }
      });
    },
    // 新建用户
    async powerUserAdd(values) {
      let data = this.clearFormData(values);
      let res = await power.powerUserAddUser(data).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.data.code !== "200") {
        this.$message.warning(res.data.message);
        return;
      }
      this.$message.success("新增用户成功");
      this.handleCancel();
      this.loadPowerUserList();
    },
    // 编辑修改个人信息
    async powerUserUpdate(values) {
      let data = this.clearFormData(values);
      if (data["passWord"] !== data["confirmPassword"]) {
        this.$message.warning("密码不一致");
        return;
      } else {
        delete data["confirmPassword"];
      }

      let res = await power.powerUserUpdateUser(data).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.data.code !== "200") {
        this.$message.warning(res.data.message);
        return;
      }
      this.$message.success("信息修改成功");
      this.handleCancel();
      this.loadPowerUserList();
    },
    // 获取关联项目数据
    async powerUserQueryProjectList() {
      let res = await power.powerUserQueryProjectList().catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.projectList = res.data;
    },
    // 获取关联角色数据
    async powerUserQueryRoleList() {
      let res = await power.powerUserQueryRoleList().catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.roleList = res.data;
    },
    // 获取关联部门数据
    async powerUserQueryDeptList() {
      let res = await power.powerUserQueryDeptList().catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.deptList = res.data;
    },
    // 整理表单数据
    clearFormData(values) {
      let data = {};

      Object.getOwnPropertyNames(values).forEach((key) => {
        if (key !== "endEffectivePeriod") {
          data[key] = values[key];
        }
        data["endEffectivePeriod"] = utils.toTime(values["endEffectivePeriod"]);
      });
      if (this.isEdit) {
        this.projectList.forEach((_) => {
          if (data["projectId"] === _.projectName) {
            data["projectId"] = _.id + "";
          }
        });
        this.roleList.forEach((_) => {
          if (data["roleId"] === _.roleName) {
            data["roleId"] = _.roleId + "";
          }
        });
        this.deptList.forEach((_) => {
          if (data["deptId"] === _.deptName) {
            data["deptId"] = _.deptId + "";
          }
        });
      }
      return data;
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-input-disabled {
  background-color: transparent;
  color: #ddfdff;
  border-color: transparent;
}
/deep/.ant-select-disabled .ant-select-selection {
  background-color: transparent;
  color: #ddfdff;
  border-color: transparent;
}
</style>
