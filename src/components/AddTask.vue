<template>
  <div class="AddTask">
    <CtrlPanel :split-line="true"
               class="bottom-sidebar"
               style="overflow: auto; height: 520px;">
      <template v-slot:title>
        <span class="f16">{{ titleTag }}</span>
        <span class="f16 goBackList"
              @click="goBackList">
          <i class="iconfont iconangle-left"></i>任务列表
        </span>
      </template>
      <template v-slot:content>
        <div class="content">
          <a-row class="timePicker arow">
            <a-col :span="8">
              <span class="title">任务名称</span>
              <a-input placeholder="在这里输入"
                       class="rightPart"
                       v-model="taskName" />
            </a-col>
            <a-col :span="8">
              <span class="title">播放类型</span>
              <a-tree-select
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
            <a-col :span="8">
              <span class="title">播放时间段</span>
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
          </a-row>
          <a-row class="selectTask arow">
            <a-col :span="8">
              <span class="title">选择节目</span>
              <a-tree-select
                :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                :treeData="mediaData"
                :defaultValue="defaultValue"
                :value="mediaValue"
                @change="mediaChange"
                treeCheckable
                :showCheckedStrategy="SHOW_PARENT"
                searchPlaceholder="Please select"
                class="rightPart"
              />
              <!--<input type="text" placeholder="在这里输入" class="rightPart" />-->
            </a-col>
            <a-col :span="8">
              <div class="displayE">
                <span class="title1">显示环境信息</span>
                <a-switch :checked="evData" @change="evOnChange" class="swBtn" />
              </div>
              <div class="isUseful">
                <span class="title1">是否有效</span>
                <a-switch :checked="swData" @change="enableOnChange" class="swBtn" />
              </div>
            </a-col>
            <a-col :span="8"></a-col>
          </a-row>
          <div class="diviceGroup">
            <p>选择设备</p>
            <a-table
              :columns="columns"
              :dataSource="deviceList"
              :rowSelection="rowSelection"
              :rowKey="record => record.id"
            />
          </div>
          <div class="btnGroup">
            <span class="save" @click="submitData">保存</span>
            <span class="cancel" @click="cancel">取消</span>
          </div>
          <a-modal okText='确定' cancelText='取消' title="请选择时间日期规则" :visible="visible" @ok="handleOk" @cancel="handleCancel">
            <a-row class="selectTask arow" v-for="index in modelLine" v-bind:key="index">
              <a-col
                :span="3"
                v-for="_index in 7"
                v-bind:key="_index"
                class="timeItem"
                v-if="7 * index - (7 - _index) <= modelNum"
                @click="getModelData(7 * index - (7 - _index), $event)"
              >{{ 7 * index - (7 - _index) }}</a-col>
            </a-row>
          </a-modal>
        </div>
      </template>
    </CtrlPanel>
  </div>
</template>

<script>
//:rowSelection="{onSelect: onSelectRow,onSelectAll: onSelectAllRow,onChange:onChange}"
import CtrlPanel from "@/components/CtrlPanel.vue";
import baseMixin from "@/mixins/base.js";
import { TreeSelect } from "ant-design-vue";
import _ from "lodash";
import Api from "@/api/Display";
import moment from "moment";
moment.locale('zh-cn');

const api = new Api();
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const modelNum = 31;
const playType = [
  {
    title: "即时播放",
    value: "1",
    key: "1"
  },
  {
    title: "每天",
    value: "2",
    key: "2"
  },
  {
    title: "每周",
    value: "3",
    key: "3"
  },
  {
    title: "每月",
    value: "4",
    key: "4"
  }
];
//设备群组
const columns = [
  {
    title: "序号",
    dataIndex: "id",
    width: "5%",
    key: "id"
  },
  {
    title: "资源名称",
    dataIndex: "resourceName",
    key: "resourceName",
    width: "15%"
  },
  {
    title: "设备状态",
    dataIndex: "resourceType",
    width: "30%",
    key: "resourceType"
  },
  {
    title: "设备位置",
    dataIndex: "groupInfoDO",
    width: "50%",
    key: "groupInfoDO"
  }
];
//设备群组
export default {
  mixins: [baseMixin],
  components: {
    CtrlPanel
  },
  data() {
    return {
      chooseGroup: [],
      moment,
      taskType: "",
      taskId: this.$route.query.id,
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
      titleTag: "新建任务",
      selectedRowKeys: []
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
      return {
        selectedRowKeys,
        onChange: this.onChange,
        onSelect: this.onSelectRow,
        onSelectAll: this.onSelectAllRow
      };
    }
  },
  created() {
    this.titleTag = this.$route.query.title;
    this.getData("screenListGroupScreen", "deviceList", {
      taskId: this.taskId,
      projectId: this.projectId
    });
    //获取群组信息
    this.getData("getMediaList", "mediaData", {
      taskId: this.taskId,
      projectId: this.projectId
    }); //获取群组信息
    if (this.taskId) {
      this.getData("screenTaskQuery", "mediaValue", this.taskId);
    }
  },
  methods: {
    onChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      let tmp = [];
      selectedRows &&
        selectedRows.map(item => {
          tmp.push({ id: item.id });
        });
      this.groupList = tmp;
    },
    onSelectRow(record, selected, selectedRows) {
      // console.log(record, selected, selectedRows, "-------");
    },
    onSelectAllRow(selected, selectedRows, changeRows) {
      // console.log(selected, selectedRows, changeRows, "++++++++");
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
    handleOk(e) {
      this.selTime = this.modelTmp;
      this.visible = false;
    },
    handleCancel(e) {
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
            list.map((item, index) => {
              tmp.push({
                title: `${item.programName}`,
                value: item.programId,
                key: item.programId
              });
            });
          this[val] = tmp;
        } else if (type === "addTask" || type === "editTask") {
          this.$message.success("成功");
          this.$router.push("/ctrl/display?tabKey=5");
        } else if (type === "screenTaskQuery") {
          let list = res.data,
            tmp = [];
          list.programList &&
            list.programList.map((item, index) => {
              tmp.push(item.id);
            });
          this.defaultValue = tmp;
          this.mediaValue1 = tmp;
          this[val] = tmp;
          this.playValue = list.taskType + "";
          this.taskName = list.taskName;
          this.selectedRowKeys = list.groupList.map(_ => _.id);
          this.tmpId = list.id;
          // this.startTime = list.startTime;
          // this.endTime = list.endTime;
          this.swData = list.enabled ? true : false;
          this.evData = list.display ? true : false;
          this.$nextTick(function() {
            this.startTime = list.startTime;
            this.endTime = list.endTime;
          });
        } else if (type === "screenListGroupScreen") {
          res.data &&
            res.data.map((item, idx) => {
              if (item.checked) {
                this.chooseGroup.push(item);
              }
            });
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
      this.$router.push("/ctrl/display?tabKey=5");
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
      this.playValue = val;
    },
    mediaChange(idArr) {
      if(idArr.length>=2){
        idArr = idArr.slice(idArr.length-1);
      }
      this.mediaValue = idArr;
      this.mediaValue1 = [{id:idArr[0]}];
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
      let tmp = [];
      this.selectedRowKeys &&
        this.selectedRowKeys.map(item => {
          tmp.push({ id: item });
        });
      this.selectedRowKeys = tmp;
      // console.log(this.selectedRowKeys);
      let opt = {
        taskName: this.taskName,
        startTime: this.startTime,
        endTime: this.endTime,
        enabled: this.swData ? 1 : 0,
        display: this.evData ? 1 : 0,
        taskType: parseInt(this.playValue),
        value: this.selTime,
        groupList: this.groupList || this.selectedRowKeys,
        programList: this.mediaValue1 || []
      };
      if (this.taskId) {
        opt.taskId = this.taskId;
        opt.id = this.tmpId;
        this.getData("editTask", "", opt);
      } else {
        this.getData("addTask", "", opt);
      }
    },
    cancel() {
      this.$router.push("/ctrl/display?tabKey=5");
    }
  }
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
    text-align: left;
    text-indent: 30px;
    margin-right: 15px;
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
    width: 166px;
    margin: 0 auto;
    padding-bottom: 20px;
    span {
      display: inline-block;
      cursor: pointer;
      width: 78px;
      height: 33px;
      line-height: 33px;
      text-align: center;
      border-radius: 0 3px 0 3px;
      &.save {
        margin-right: 10px;
        background: rgba(151, 233, 255, 0.1);
        box-shadow: inset 0 0 3px 0 rgba(59, 249, 251, 0.5);
      }
      &.cancel {
        background: rgba(151, 233, 255, 0.1);
        box-shadow: inset 0 0 3px 0 rgba(59, 249, 251, 0.5);
      }
    }
  }
}
</style>
