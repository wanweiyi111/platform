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
              v-if="tabKey == 1"
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
                  placeholder="请输入名称"
                  v-model="mediaInput"
                  @search="searchMedia"
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
      <a-col :span="24">
        <div class="table">
          <a-tabs
            class="Application_tabs"
            :activeKey="tabKey"
            @change="callback"
          >
            <a-tab-pane
              key="1"
              tab="概览"
            >
              <Overview :searchValue="equipObj"></Overview>
            </a-tab-pane>
            <a-tab-pane
              key="2"
              tab="音频库"
            >
              <div class="tab-btns">
                <a-button
                  type="dashed"
                  icon="plus"
                  class="mr15"
                  @click="showModalUploadAudio"
                >上传音频
                </a-button>
              </div>
              <MediaList
                ref="mediaAudio"
                :searchValue="mediaObj"
              ></MediaList>
            </a-tab-pane>
            <a-tab-pane
              key="3"
              tab="节目库"
            >
              <div class="tab-btns">
                <a-button
                  type="dashed"
                  icon="plus"
                  class="mr15"
                >
                  <router-link to="/application-manage/broad-cast/add-program">创建节目</router-link>
                </a-button>
                <!-- <a-dropdown
                  :disabled="isAuditProgram"
                  overlayClassName="application_dropdown"
                >
                  <a-menu
                    slot="overlay"
                    @click="handleProgramClick"
                  >
                    <a-menu-item key="1">
                      <a-icon type="check" />通过
                    </a-menu-item>
                    <a-menu-item key="2">
                      <a-icon type="close" />驳回
                    </a-menu-item>
                  </a-menu>
                  <a-button
                    type="dashed"
                    :disabled="isAuditProgram"
                    :class="isAuditProgram?'disabled':''"
                  > 审核
                    <a-icon type="down" />
                  </a-button>
                </a-dropdown> -->
              </div>
              <ProgramList :searchValue="programObj"></ProgramList>
            </a-tab-pane>
            <a-tab-pane
              key="4"
              tab="分组"
            >
              <div class="tab-btns">
                <a-button
                  type="dashed"
                  icon="plus"
                  class="mr15"
                  @click="showModalAddGroup"
                >新建分组</a-button>
              </div>
              <GroupList
                ref="broadcastGroup"
                :searchValue="groupObj"
              ></GroupList>
            </a-tab-pane>
            <a-tab-pane
              key="5"
              tab="任务"
            >
              <div class="tab-btns">
                <a-button
                  type="dashed"
                  icon="plus"
                  class="mr15"
                >
                  <router-link to="/application-manage/broad-cast/add-task">新建任务</router-link>
                </a-button>
              </div>
              <TaskList :searchValue="taskObj"></TaskList>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
    <!-- 上传音频 start-->
    <a-modal
      class="application_modal"
      v-model="visibleUploadAudio"
      title="上传音频"
      :width="500"
      :closable="false"
      :footer="null"
    >
      <UploadAudio @uploadCancel="handleModelUploadAudioCancel" />
    </a-modal>
    <!-- 上传音频 end-->
    <!-- 新增分组 start-->
    <a-modal
      class="application_modal"
      v-model="visibleAddGroup"
      title="新增分组"
      :footer="null"
    >
      <a-form-model
        ref="ruleForm"
        :model="formAddGroup"
        :rules="formRules"
        :label-col="formLabelCol"
        :wrapper-col="formWrapperCol"
      >
        <a-form-model-item
          ref="name"
          label="分组名称"
          prop="name"
        >
          <a-input
            v-model="formAddGroup.name"
            @blur="
          () => {
            $refs.name.onFieldBlur();
          }
        "
          />
        </a-form-model-item>
        <a-form-model-item
          label="广播"
          prop="type"
        >
          <a-select
            mode="multiple"
            dropdownClassName="application_dropdown"
            v-model="formAddGroup.type"
          >
            <a-select-option
              v-for="item in withoutScreenList"
              :key="item.id"
              :value="item.id"
            >{{item.equipmentName}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          class="ar"
          :wrapper-col="{ span: 18 }"
        >
          <a-button
            style="margin-left: 10px;"
            @click="resetForm"
          >
            取消
          </a-button>
          <a-button
            type="primary"
            class="ml10"
            @click="onSubmit"
          >
            新增
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 新增分组 end-->
  </div>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import MapMixin from "@/mixins/map.js";
import { FormModel } from "ant-design-vue";
import Overview from "@/components/Broadcast/Overview.vue";
import MediaList from "@/components/Broadcast/MediaList.vue";
import ProgramList from "@/components/Broadcast/ProgramList.vue";
import GroupList from "@/components/Broadcast/GroupList.vue";
import TaskList from "@/components/Broadcast/TaskList.vue";
import UploadAudio from "@/components/Broadcast/UploadAudio.vue";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
import Broadcast from "@/api/Broadcast";
const api = new Broadcast();

export default {
  mixins: [baseMixin, MapMixin],
  components: {
    Overview,
    MediaList,
    ProgramList,
    GroupList,
    TaskList,
    aFormModel: FormModel,
    aFormModelItem: FormModel.Item,
    UploadAudio,
    Breadcrumb,
  },
  data() {
    return {
      tabKey: "1",
      searchForm: this.$form.createForm(this, { name: "advanced_search" }),
      equipObj: {},
      visibleEquipInfo: false, // 查看设备信息modal
      equipInfoView: {}, // 查看设备信息-数据
      mediaInput: "", // 音频库input
      mediaObj: {},
      isAuditProgram: false, // 节目审核是否可用
      programObj: {},
      groupObj: {},
      taskObj: {},
      visibleUploadAudio: false, // 上传音频
      visibleAddGroup: false, // 新增分组
      formLabelCol: { span: 6 },
      formWrapperCol: { span: 12 },
      formAddGroup: {
        name: "",
        type: [],
      },
      formRules: {
        name: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择广播" }],
      },
      withoutScreenList: [], // 添加广播 下拉选项
    };
  },
  created() {
    this.tabKey = this.$route.query.tabKey || "1";
  },
  methods: {
    // 搜索
    handleSearch(e) {
      e.preventDefault();
      this.searchForm.validateFields((error, values) => {
        if (error) {
          return;
        }
        console.log("搜索", values);
        let obj = {};
        if (values.equipName) {
          obj.equipmentName = values.equipName;
        }
        if (values.equipState) {
          obj.equipmentStatus = values.equipState;
        }
        this.equipObj = obj;
      });
    },
    // 搜索重置
    handleReset() {
      this.searchForm.resetFields();
      this.equipObj.equipmentName = "";
      this.equipObj.equipmentStatus = "";
    },

    //切换tab回调
    callback(key) {
      this.tabKey = key;
      this.mediaInput = "";
      this.$router.push({
        path: "/application-manage/broad-cast/list",
        query: { tabKey: key },
      });
    },
    // 音频库/节目库/分组/任务-搜索
    searchMedia() {
      let obj = {};
      if (this.tabKey == 2) {
        obj.mediaName = this.mediaInput;
        this.mediaObj = obj;
      } else if (this.tabKey == 3) {
        obj.programName = this.mediaInput;
        this.programObj = obj;
      } else if (this.tabKey == 4) {
        obj.resourceName = this.mediaInput;
        this.groupObj = obj;
      } else if (this.tabKey == 5) {
        obj.resourceName = this.mediaInput;
        this.taskObj = obj;
      }
    },
    // 节目库 - 审核
    handleProgramClick(val) {
      let status = val.key;
      console.log("审核", status);
      // this.displayProgramAuditClick(status);
    },
    // 音频库--上传音频modal
    showModalUploadAudio() {
      this.visibleUploadAudio = true;
    },
    // 音频库--取消
    handleModelUploadAudioCancel() {
      this.visibleUploadAudio = false;
      this.$refs.mediaAudio.loadData({});
    },
    // 分组 --新增分组modal
    showModalAddGroup() {
      this.visibleAddGroup = true;
      this.loadBroadcastData();
    },
    // 分组 --新增分组-确认
    handleModelAddGroupOk() {},
    // 分组 -- 新增分组form -确认
    onSubmit() {
      const _this = this;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let form = this.$refs.ruleForm.model;
          let formObj = {
            groupName: form.name,
          };
          _this.loadBroadcastGroupAdd(formObj);
          _this.visibleAddGroup = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 分组 -- 新增分组form -取消
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.visibleAddGroup = false;
    },
    // 分组 --现有广播列表
    async loadBroadcastData() {
      let prams = `projectId=${this.projectId}`;
      let res = await api
        .broadcastListWithoutGroupScreen(prams)
        .catch((err) => {
          console.log(err);
        });

      if (_.isEmpty(res) || res.code != 200) {
        return;
      }
      this.withoutScreenList = res.data;
    },
    // 分组 --新增分组
    async loadBroadcastGroupAdd(params) {
      let opt = Object.assign(params, { projectId: this.projectId });
      let res = await api.broadcastGroupAdd(opt);
      if (res.code !== "200") {
        return;
      }
      let data = res.data;
      let formData = this.$refs.ruleForm.model;
      let obj = {
        groupId: [data.groupId],
        list: formData.type,
      };
      this.loadBroadcastAdd(obj);
    },
    // 分组 --新增广播
    async loadBroadcastAdd(params) {
      let opt = Object.assign(params, { projectId: this.projectId });
      let res = await api.broadcastGroupGlAdd(opt);
      if (res.code !== 200) {
        return;
      }
      this.groupObj = {};
      console.log("新增成功");
      this.resetForm();
    },
  },
};
</script>

