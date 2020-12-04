<template>
  <!-- 权限管理--新增/编辑角色 -->
  <div class="application_from">
    <a-row>
      <a-col :span="24">
        <Breadcrumb :modifyTitle="modelTitle" />
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form :form="powerAddRole">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item
                label="角色名称："
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input
                  :disabled="isDisabled"
                  maxlength="10"
                  v-decorator="['roleName',{rules: [{ required: true, message: '请输入角色名称' }]}]"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="角色描述："
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
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
              <a-form-item
                label="角色权限"
                :label-col="{ span: 2 }"
                :wrapper-col="{ span: 22 }"
              >
                <a-table
                  class="Application_table"
                  :columns="columns"
                  :rowKey="record => record.id"
                  :dataSource="dataList"
                  :pagination="false"
                  :row-selection="rowSelection"
                  :customRow="cusRow"
                  :scroll="{y:500}"
                >
                  <template
                    slot="operation"
                    slot-scope="text, record"
                  >
                    <!-- <div
                      v-for="(item,idx) in getPlainOptions(record)"
                      :key="idx"
                    >
                      <a-checkbox
                        :checked="plainValues.includes(item.id)"
                        :disabled="isDisabled"
                        :default-value="plainValues"
                        @change="onChange"
                      >
                        {{ item.label }}
                      </a-checkbox>
                    </div> -->
                    <a-checkbox-group
                      :disabled="isDisabled"
                      v-model="plainValues"
                      :default-value="plainValues"
                      :options="getPlainOptions(record)"
                      @change="onCheckboxChange"
                    />
                  </template>
                </a-table>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row
            :gutter="24"
            style="margin-top:20px"
          >
            <a-col style="text-align:center">
              <a-button>
                <router-link to="/system/power?tabKey=2">{{isDisabled?"返回":'取消'}}</router-link>
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
      </a-col>
    </a-row>
  </div>
</template>

<script>
import _ from "lodash";
import { mapMutations } from "vuex";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
import PowerManager from "@/api/PowerManager";
import { Checkbox } from "ant-design-vue";

const power = new PowerManager();

const columns = [
  // {
  //   title: "ID",
  //   dataIndex: "id",
  // },
  {
    title: "列表",
    dataIndex: "menuName",
  },
  {
    title: "权限",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  components: {
    Breadcrumb,
    aCheckboxGroup: Checkbox.Group,
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
        total: 0, //总数
      },
      taskRolesId: [],
      isDisabled: false,
      plainValues: [],
      currentInfoIds: [],
      plainOptionsArr: [], // 复选框数据
      defaultValue: [], // 默认选中值
      currentClickValue: null, // 当前选中的行id
      selectedRowKeys: [],
    };
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        columnWidth: 80,
        selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: this.isDisabled,
            name: record.name,
          },
        }),
      };
    },
  },
  created() {
    let routeData = this.$route;
    let currentMenuId = routeData.meta.id || "";
    let currentMenuParentId = routeData.meta.parentId || "";
    this.setCurrentMenu(currentMenuId);
    this.setCurrentParentMenu(currentMenuParentId);

    this.roleId = this.$route.query.id;
    let routeQuery = this.$route.query;
    this.modelTitle = routeQuery.modelTitle;
    this.isDisabled = Boolean(routeQuery.isViewPermission); //是否查看权限
    if (this.isDisabled) {
      this.$nextTick(() => {
        this.loadPowerGetRoleInfo();
        this.loadPowerCheckRolePermission();
      });
    } else if (this.roleId) {
      this.$nextTick(() => {
        this.loadPowerPoleTreeList();
        this.loadPowerGetRoleInfo();
      });
    } else {
      this.loadPowerPoleTreeList();
    }
  },
  mounted() {},
  methods: {
    ...mapMutations(["setCurrentMenu", "setCurrentParentMenu"]),
    // table 行选择
    onSelectChange(selectedRowKeys, selectedRows) {
      // 初始化

      let RowsData = selectedRows;
      let RowsId = [];
      let ids = [];
      let finalIds = [];
      let original = this.plainValues.concat(this.selectedRowKeys);
      RowsData.forEach((item) => {
        // if (item.parentId) {
        //   ids.push(item.parentId);
        // }
        if (original.includes(item.id)) {
          let selectedIds = this.querySelectPowerId(item);
          finalIds = original.filter((_item) => selectedIds.includes(_item));
        } else {
          let selectedIds = this.querySelectPowerId(item);
          finalIds.push(...selectedIds);
        }
        if (item.id) {
          RowsId.push(item.id);
          ids.push(item.id);
        }
        ids.push(...finalIds);
      });
      this.plainValues = [...new Set(ids)];
      this.selectedRowKeys = [...new Set(selectedRowKeys), ...new Set(ids)];
    },
    // 根据列数据 返回权限id data:行数据
    querySelectPowerId(data) {
      let ids = [];
      if (data.buttonList) {
        data.buttonList.forEach((item) => {
          ids.push(item.id);
        });
      }
      return ids;
    },
    // 根据原数据， 构造列的权限复选框值
    getPlainOptions(record) {
      let plainOptions = [];
      record.buttonList &&
        record.buttonList.forEach((_) => {
          plainOptions.push({
            label: _.menuName,
            value: _.id,
          });
        });
      return plainOptions;
    },

    cusRow(record) {
      return {
        on: {
          click: () => {
            let currentId = [];
            this.currentClickValue = record.id;
            currentId.push(record.id);
            this.currentInfoIds = [...new Set(currentId)];
            console.log("行点击值", this.currentInfoIds);
          },
        },
      };
    },
    onCheckboxChange(checkedValues) {
      let oldData = this.selectedRowKeys;
      let newData = checkedValues;
      let finalData = [];
      let currentRowInfo = this.queryRowInfo(this.currentClickValue);
      let currentRowIds = this.querySelectPowerId(currentRowInfo);

      if (newData.length < 1) {
        console.log("无值", newData);
        currentRowIds.push(this.currentClickValue);
        if (oldData.length) {
          console.log("原数据", oldData.length);
          finalData = oldData.filter((item) => {
            return !currentRowIds.includes(item);
          });
        } else {
          console.log("其他", newData);
        }
      } else {
        console.log("有值", newData);
        if (oldData.length) {
          console.log("没有原数据是123", oldData);
          // 取差值
          let difference = currentRowIds
            .concat(newData)
            .filter((v) => !currentRowIds.includes(v) || !newData.includes(v));
          let worthyValue = currentRowIds.filter((item) => {
            return !difference.includes(item);
          });
          finalData = oldData
            .concat(worthyValue)
            .filter((_item) => !difference.includes(_item));
        } else {
          finalData.push(newData);
          finalData.push(this.currentClickValue);
          console.log("没有原数据是", oldData, finalData);
        }
      }
      console.log("最后的值", finalData, this.currentClickValue);

      this.plainValues = [...new Set(finalData)];
      this.selectedRowKeys = [...new Set(finalData)];
      console.log("去重后的值", this.plainValues);
    },
    // 权限选择
    checkboxChange(checkedValues) {
      let oldCheck = this.plainValues; // 原已选中数据
      let rowId = this.currentClickValue; // 行id
      let plainValues = oldCheck;
      let currentCheckboxId = [];
      let checkedValuesArr = checkedValues; // 当前选中ID
      // let newCheckedValues = [];
      if (checkedValuesArr.length < 1) {
        if (oldCheck.includes(rowId)) {
          let id = this.queryCheckboxId(
            this.currentClickValue,
            checkedValuesArr
          );
          currentCheckboxId.push(id, rowId); // 把行id和勾掉的复选框id push
          plainValues = plainValues.filter(
            // 删除掉currentCheckboxId包含的值
            (item) => !currentCheckboxId.includes(item)
          );
        }
        this.plainValues = [...new Set(plainValues)];
      } else {
        if (oldCheck.includes(rowId)) {
          let ids = this.queryCheckboxId(
            this.currentClickValue,
            checkedValuesArr
          );
          plainValues = plainValues.filter(
            // 删除掉currentCheckboxId包含的值
            (item) => !ids.includes(item)
          );
          plainValues.push(...checkedValuesArr);
          this.plainValues = [...new Set([...plainValues])];
        } else {
          plainValues.push(...checkedValuesArr, rowId);
          this.plainValues = [...new Set(oldCheck)];
        }
      }
    },
    // 根据行id 返回复选框权限id targetId
    queryCheckboxId(rowId, targetId) {
      let treeData = this.dataList;
      let targetIdArr = targetId;
      let currentIdList = [];
      let currentId = "";
      let currentTarge = null;
      treeData.find((_) => {
        if (_.id == rowId) {
          // 复选框id
          _.buttonList.forEach((item) => {
            currentIdList.push(item.id);
          });
        } else {
          if (_.children) {
            _.children.forEach((item) => {
              if (item.id == rowId) {
                item.buttonList.forEach((i) => {
                  currentIdList.push(i.id);
                });
              } else {
                if (item.children) {
                  item.children.forEach((items) => {
                    if (items.id == rowId) {
                      items.buttonList.forEach((i) => {
                        currentIdList.push(i.id);
                      });
                    } else {
                      console.log("还是没有");
                    }
                  });
                }
              }
            });
          }
        }
      });
      if (targetId.length > 0) {
        currentIdList = currentIdList.filter(
          // 删除掉currentCheckboxId包含的值
          (item) => !targetIdArr.includes(item)
        );
        currentTarge = currentIdList;
      } else {
        currentId = currentIdList[0];
        currentTarge = currentId;
      }
      return currentTarge;
    },
    // 根据行id 返回行数据
    queryRowInfo(rowid) {
      console.log("行id", rowid);
      let treeData = this.dataList;
      let rowData = {};
      treeData.forEach((item) => {
        if (item.id == rowid) {
          rowData = item;
        } else {
          console.log("一层");
          if (item.children) {
            item.children.forEach((_item) => {
              if (_item.id == rowid) {
                rowData = _item;
              } else {
                console.log("二层");
                if (_item.children) {
                  _item.children.forEach((__item) => {
                    if (__item.id == rowid) {
                      rowData = __item;
                    } else {
                      console.log("三级");
                      if (__item.children) {
                        __item.children.forEach((___item) => {
                          if (___item.id == rowid) {
                            rowData = ___item;
                          } else {
                            console.log("超过三级");
                          }
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
      return rowData;
    },
    // 获取菜单列表数据
    async loadPowerPoleTreeList() {
      let res = await power.powerQueryPoleTreeList().catch((err) => {
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
      let res = await power.powerGetRoleById(data).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("加载失败");
        return;
      }
      let ids = res.data.permissions;
      this.plainValues = ids && ids.map((_) => _.id);
      this.selectedRowKeys = [...this.plainValues];
      this.powerAddRole.setFieldsValue({
        roleName: res.data.roleName,
        remark: res.data.remark,
      });
      console.log("编辑获取权限", this.plainValues, this.selectedRowKeys);
    },
    // 查看角色权限信息
    async loadPowerCheckRolePermission() {
      let data = { roleId: this.roleId };
      let res = await power.powerCheckRolePermissionById(data).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("加载失败");
        return;
      }
      let rolePermissionList = res.data.rolePermissionList;
      let dataList = [];
      // 如果菜单没有任何权限，就把菜单数据过滤掉
      rolePermissionList.forEach((r) => {
        // if (!_.isEmpty(r.buttonList)) {
        //   dataList.push(r);
        // }
        dataList.push(r);
      });
      this.dataList = dataList;
      this.powerAddRole.setFieldsValue({
        roleName: res.data.roleName,
        remark: res.data.remark,
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
        ...new Set([
          ...this.plainValues,
          // ...this.selectedRowKeys,
          ...this.currentInfoIds,
        ]),
      ];
      let res = await power.powerRoleAddRole(values).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning(res.msg);
        return;
      }
      this.$message.success("角色新建成功");
      this.$router.push("/system/power?tabKey=2");
    },
    //编辑角色
    async powerRoleUpdateRole(values) {
      console.log(
        "传过来参",
        this.plainValues,
        // this.selectedRowKeys,
        this.currentInfoIds
      );
      values["permissionList"] = [
        ...new Set([
          ...this.plainValues,
          // ...this.selectedRowKeys,
          ...this.currentInfoIds,
        ]),
      ];
      console.log("参数", values["permissionList"]);
      values["roleId"] = this.roleId;
      let res = await power.powerRoleUpdateRole(values).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("角色修改失败");
        return;
      }
      this.$message.success("角色修改成功");
      this.$router.push("/system/power?tabKey=2");
    },
    // 新建角色
    async powerRoleAddRole1(values) {
      values["permissionList"] = [
        ...new Set([...this.plainValues, ...this.currentInfoIds]),
      ];
      let res = await power.powerRoleAddRole(values).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning(res.msg);
        return;
      }
      this.$message.success("角色新建成功");
      this.$router.push("/system/power?tabKey=2");
    },
    //编辑角色
    async powerRoleUpdateRole1(values) {
      values["permissionList"] = [
        ...new Set([...this.plainValues, ...this.currentInfoIds]),
      ];
      values["roleId"] = this.roleId;
      let res = await power.powerRoleUpdateRole(values).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        this.$message.warning("角色修改失败");
        return;
      }
      this.$message.success("角色修改成功");
      this.$router.push("/system/power?tabKey=2");
    },
  },
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
