<template>
  <a-row>
    <a-col :span="24">
      <div
        class="application_from AddTask"
        :style="{height:fullHeight-195 + 'px'}"
      >
        <a-row class="timePicker arow">
          <a-col :span="12">
            <span class="title"><i class="tip">*</i>任务名称</span>
            <a-input
              placeholder="在这里输入"
              class="rightPart"
              v-model="taskName"
            />
          </a-col>
          <a-col :span="12">
            <span class="title"><i class="tip">*</i>播放类型</span>
            <a-tree-select
              dropdownClassName="application_dropdown"
              :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
              :treeData="playType"
              placeholder="Please select"
              treeDefaultExpandAll
              :value="playValue"
              @change="playChange"
              class="rightPart"
            >
              <span
                style="color: #08c"
                slot="title"
                slot-scope="{ key, value }"
                v-if="(key = '0-0-1')"
              >Child Node1 {{ value }}</span>
            </a-tree-select>
          </a-col>
        </a-row>
        <a-row class="timePicker arow">
          <a-col :span="12">
            <span class="title"><i class="tip">*</i>播放时间段</span>
            <div class="rightPart">
              <a-time-picker
                class="endTime"
                @change="timePickerChange"
                :value="moment(startTime, 'HH:mm')"
              ></a-time-picker>
              <a-time-picker
                class="endTime"
                @change="timePickerChange1"
                :value="moment(endTime, 'HH:mm')"
              ></a-time-picker>
            </div>
          </a-col>
          <a-col :span="12">
            <span class="title"><i class="tip">*</i>选择节目</span>
            <a-tree-select
              dropdownClassName="application_dropdown"
              :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
              :treeData="mediaData"
              v-model="mediaValue"
              @change="mediaChange"
              :showCheckedStrategy="SHOW_PARENT"
              searchPlaceholder="请选择节目"
              class="rightPart"
            />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <span class="title font12">显示环境信息</span>
            <a-switch
              :checked="evData"
              @change="evOnChange"
              class="swBtn"
            />
          </a-col>
          <a-col :span="12">
            <span class="title">是否有效</span>
            <a-switch
              :checked="swData"
              @change="enableOnChange"
              class="swBtn"
            />
          </a-col>
        </a-row>
        <div class="diviceGroup">
          <p><i class="tip">*</i>选择分组</p>
          <a-table
            class="Application_table"
            :columns="columns"
            :dataSource="deviceList"
            :rowSelection="rowSelection"
            :rowKey="record => record.id"
            :scroll="{x:0,y: fullHeight-595 }"
          />
        </div>
        <div class="btnGroup">
          <a-button
            type="primary"
            icon="save"
            @click="submitData"
            class="mr5"
          >保存</a-button>
          <a-button
            icon="delete"
            @click="cancel"
          >取消</a-button>
        </div>

      </div>
    </a-col>
    <a-modal
      class="application_modal"
      okText='确定'
      cancelText='取消'
      title="请选择时间日期规则"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-row
        class="selectTask arow"
        v-for="index in modelLine"
        v-bind:key="index"
      >
        <template v-for="_index in 7">
          <a-col
            :span="3"
            v-bind:key="_index"
            class="timeItem"
            v-if="7 * index - (7 - _index) <= modelNum"
            @click="getModelData(7 * index - (7 - _index), $event)"
          >
            {{ 7 * index - (7 - _index) }}
          </a-col>
        </template>
      </a-row>
    </a-modal>
  </a-row>

</template>

<script>
//:rowSelection="{onSelect: onSelectRow,onSelectAll: onSelectAllRow,onChange:onChange}"
import baseMixin from "@/mixins/base.js";
import { TreeSelect } from "ant-design-vue";
import _ from "lodash";
import Api from "@/api/Display";
import moment from "moment";
const api = new Api();
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const modelNum = 31;
const playType = [
  {
    title: "即时播放",
    value: "1",
    key: "1",
  },
  {
    title: "每天",
    value: "2",
    key: "2",
  },
  {
    title: "每周",
    value: "3",
    key: "3",
  },
  {
    title: "每月",
    value: "4",
    key: "4",
  },
];
//设备群组
const columns = [
  {
    title: "序号",
    dataIndex: "id",
    width: "80",
    align: "center",
  },
  {
    title: "资源名称",
    dataIndex: "resourceName",
    key: "resourceName",
    ellipsis: true,
  },
  {
    title: "设备状态",
    dataIndex: "resourceType",
    key: "resourceType",
  },
  {
    title: "设备位置",
    dataIndex: "groupInfoDO",
    key: "groupInfoDO",
    ellipsis: true,
  },
];
//设备群组
export default {
  mixins: [baseMixin],
  components: {},
  data() {
    return {
      fullHeight:
        document.documentElement.clientHeight || document.body.clientHeight,
      chooseGroup: [],
      moment,
      taskType: "",
      taskId: this.$route.query.taskId,
      tmpId: 0,
      data: [],
      open: false,
      open2: false,
      styleTime: false,
      playType,
      SHOW_PARENT,
      columns,
      deviceList: [],
      visible: false,
      modelNum,
      modelLine: Math.ceil(modelNum / 7),
      modelRow: Math.ceil(modelNum - this.modelLine * 7),
      mediaData: [],
      mediaValue: [],
      defaultValue: [],
      mediaValue1: "",
      swData: true,
      playValue: "",
      evData: true,
      startTime: 0,
      endTime: 0,
      modelTmp: [],
      selTime: [],
      groupList: "",
      taskName: "",
      selectedRowKeys: [],
    };
  },
  watch: {
    // value1(value) {
    //   console.log(value);
    // }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      console.log();
      return {
        selectedRowKeys,
        onChange: this.onChange,
      };
    },
  },
  created() {
    // 获取分组信息
    this.getData("screenListGroupScreen", "deviceList", {
      taskId: this.taskId,
      projectId: this.projectId,
    });
    //获取节目信息
    this.getData("getMediaList", "mediaData", {
      taskId: this.taskId,
      projectId: this.projectId,
    });
    //获取当前信息
    if (this.taskId) {
      this.getData("screenTaskQuery", "", this.taskId);
    }
  },
  methods: {
    onChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      console.log("分组", selectedRows);
      let tmp = [];
      selectedRows &&
        selectedRows.map((item) => {
          tmp.push({ id: item.id });
        });
      this.groupList = tmp;
    },
    //获取任务名字
    getName(e) {
      let val = e.target.value.trim();
      this.taskName = val;
    },
    //获取时间段
    timePickerChange(time, val) {
      if (!this.getTime(val, this.endTime)) {
        this.$message.error("开始时间不得晚于结束时间");
        return;
      }
      this.startTime = val;
    },
    timePickerChange1(time, val) {
      if (!this.getTime(this.startTime, val)) {
        this.$message.error("开始时间不得晚于结束时间");
        return;
      }
      this.endTime = val;
    },
    getTime(start, end) {
      let startTime = new Date((start || "00:00:00") + " 2019").getTime(),
        endTime = new Date((end || "24:00:00") + " 2019").getTime();
      return startTime - endTime < 0 || startTime - endTime === 0
        ? true
        : false;
    },
    //显示弹窗
    showModal() {
      this.visible = true;
    },
    handleOk() {
      this.selTime = this.modelTmp;
      this.visible = false;
    },
    handleCancel() {
      this.visible = false;
    },
    //
    //获取信息方法
    async getData(type, val, data) {
      let opt = data ? data : "";
      let res = await api[type](opt);
      if (_.isEmpty(res) || res.code != "200" || res.code != 200) {
        return;
      } else {
        if (type === "getMediaList") {
          let list = res.data;
          let tmp = [];
          list &&
            list.map((item) => {
              tmp.push({
                title: `${item.programName}`,
                value: item.programId,
                key: item.programId,
              });
            });
          this[val] = tmp;
        } else if (type === "addTask" || type === "editTask") {
          this.$message.success("成功");
          this.$router.push("/application-manage/display/list?tabKey=5");
        } else if (type === "screenTaskQuery") {
          let list = res.data,
            tmp = [],
            gtourpTmp = [],
            valTmp = [];
          list.groupList.map((_) => {
            gtourpTmp.push({ id: _.id });
          });
          list.programList.map((_) => {
            tmp.push({ id: _.id });
          });
          this.mediaValue1 = tmp;
          this.mediaValue = list.programList.map((_) => _.id)[0];
          this[val] = valTmp;
          this.playValue = list.taskType;
          this.taskName = list.taskName;
          this.selectedRowKeys = list.groupList.map((_) => _.id);
          this.groupList = gtourpTmp;
          this.tmpId = list.id;
          this.swData = list.enabled ? true : false;
          this.evData = list.display ? true : false;
          this.$nextTick(function () {
            this.startTime = list.startTime;
            this.endTime = list.endTime;
          });
        } else if (type === "screenListGroupScreen") {
          // res.data &&
          //   res.data.map((item) => {
          //     if (item.checked) {
          //       this.chooseGroup.push(item);
          //     }
          //   });
          this[val] = res.data;
        } else {
          this[val] = res.data;
        }
      }
    },
    handleOpenChange(open) {
      this.open = open;
    },
    handleClose() {
      this.open = false;
      this.open2 = false;
    },
    goBackList() {
      this.$router.push("/application-manage/display/list?tabKey=5");
    },
    getDaysInCurrentMonth() {
      let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      let month = new Date().getMonth();
      return days[month];
    },
    playChange(val) {
      if (val === "4") {
        this.modelNum = this.getDaysInCurrentMonth();
        this.visible = true;
      } else if (val === "3") {
        this.modelNum = 7;
        this.visible = true;
      }
      this.playValue = Number(val);
    },
    mediaChange(idArr) {
      console.log("选择节目", idArr);
      this.mediaValue = idArr;
      this.mediaValue1 = [{ id: idArr }];
    },
    enableOnChange(val) {
      this.swData = val;
    },
    evOnChange(val) {
      this.evData = val;
    },
    //获取用户自定义日期选择结果
    getModelData(val, e) {
      let className = e.target.className;
      if (className.indexOf("active") < 0) {
        e.target.className = `${className} active`;
      }
      if (this.modelTmp.indexOf(val) < 0) {
        this.modelTmp.push(val);
      }
    },
    //提交数据
    submitData() {
      this.$message.destroy();
      console.log("值", this.mediaValue, this.selectedRowKeys);
      if (!this.taskName) {
        this.errorTip("请输入任务名称");
      } else if (!this.playValue) {
        this.errorTip("请选择播放类型");
      } else if (!this.startTime) {
        this.errorTip("请选择开始时间");
      } else if (!this.endTime) {
        this.errorTip("请选择结束时间");
      } else if (this.mediaValue.length < 1) {
        this.errorTip("请选择节目");
      } else if (this.selectedRowKeys.length < 1) {
        this.errorTip("请选择分组");
      } else {
        let opt = {
          taskName: this.taskName,
          startTime: this.startTime,
          endTime: this.endTime,
          enabled: this.swData ? 1 : 0,
          display: this.evData ? 1 : 0,
          taskType: parseInt(this.playValue),
          value: this.selTime,
          groupList: this.groupList,
          programList: this.mediaValue1,
        };
        if (this.taskId) {
          opt.taskId = this.taskId;
          opt.id = this.tmpId;
          this.getData("editTask", "", opt);
        } else {
          this.getData("addTask", "", opt);
        }
      }
    },
    cancel() {
      this.$router.push("/application-manage/display/list?tabKey=5");
    },
    // 获取屏幕高度
    get_bodyHeight() {
      //动态获取浏览器高度
      const that = this;
      window.addEventListener("resize", () => {
        let fullHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        that.fullHeight = fullHeight;
      });
    },
    errorTip(val) {
      this.$message.error(val);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.modelAcol {
  text-align: center;
  height: 50px;
  line-height: 50px;
  cursor: pointer;
}
.timeItem {
  cursor: pointer;
  &.active {
    border-color: #1890ff;
    font-weight: bold;
    color: #1890ff;
  }
}
.AddTask {
  font-size: 14px;
  color: #ddfdff;
  /****日期弹窗样式***/
  .modalList {
    li {
      display: block;
      margin: 0 auto;
      color: rgba(0, 0, 0, 0.65);
      border-radius: 2px;
      width: 24px;
      height: 24px;
      line-height: 22px;
      border: 1px solid transparent;
      padding: 0;
      background: transparent;
      text-align: center;
      transition: background 0.3s ease;
    }
  }
  /****日期弹窗样式***/
  input,
  textarea {
    border: 1px solid rgba(28, 102, 162, 0.8);
    border-radius: 3px;
    background: none;
    color: #c2e4ff;
  }
  .title {
    display: inline-block;
    width: 25%;
    text-align: right;
    text-indent: 30px;
    margin-right: 15px;
    .tip {
      color: #f40;
      font-size: 18px;
      padding-right: 5px;
      position: relative;
      top: 6px;
    }
  }
  .diviceGroup {
    .tip {
      color: #f40;
      font-size: 18px;
      padding-right: 5px;
      position: relative;
      top: 6px;
    }
  }
  .rightPart {
    width: calc(75% - 15px);
  }
  //overwrite Component style
  .bottom-sidebar {
    padding: 20px;
    height: 675px;
    background-image: linear-gradient(
      180deg,
      rgba(15, 75, 160, 0.3) 0%,
      rgba(6, 27, 124, 0.2) 67%
    );
    box-shadow: inset 0 0 2px 0 #35b0e6;
    width: calc(100% - 20px);
    .goBackList {
      float: right;
      font-size: 14px;
      margin-right: 20px;
      color: #97e9ff;
      cursor: pointer;
    }
  }
  .timePicker {
    margin-bottom: 15px;
    .rightPart {
      display: inline-block;
    }
    .startTime,
    .endTime {
      width: 50%;
    }
  }
  .selectTask {
    // height: 50px;
    // line-height: 50px;
    .displayE,
    .isUseful {
      width: 50%;
      display: inline-block;
      text-align: left;
      text-indent: 30px;
      .swBtn {
        margin-left: 10px;
      }
    }
  }
  .diviceGroup {
    p {
      margin: 22px 0;
    }
  }
  .btnGroup {
    text-align: center;
    padding: 20px 0;
  }
}
</style>
