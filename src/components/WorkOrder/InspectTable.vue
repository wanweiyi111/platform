<template>
  <!-- 新建/编辑分组 -->
  <div class="orderTable">
    <div
      slot="tabBarExtraContent"
      class="pd-t5 ctrBar"
    >
      <span>
        类型：
        <a-select
          class="mr5"
          size="small"
          defaultValue="a1"
          @change="changeType"
          placeholder="请选择"
        >
          <a-select-option
            key="a1"
            value="a1"
          >请选择</a-select-option>
          <a-select-option
            v-for="(item, index) in InspectDeviceType"
            :key="index"
            :value="index"
          >{{item}}</a-select-option>
        </a-select>
      </span>
      <span>
        状态：
        <a-select
          class="mr5"
          size="small"
          defaultValue="a1"
          @change="changeState"
          placeholder="请选择"
        >
          <a-select-option
            key="a1"
            value="a1"
          >请选择</a-select-option>
          <a-select-option
            v-for="(item, index) in InspectState"
            :key="index"
            :value="index"
          >{{item}}</a-select-option>
        </a-select>
      </span>
      <span>
        时间：
        <a-range-picker
          showTime
          size="small"
          class="mr5"
          style="width: 200px;"
          @change="changeDateRange"
          :placeholder="['开始时间', '结束时间']"
        />
        <!-- <a-input-search
          @keydown.enter="startSearch"
          placeholder="请输入关键词"
          size="small"
          style="width: 130px;"
        />-->
      </span>
      <a-button
        type="primary"
        icon="plus"
        size="small"
        class="mr5"
        @click="showModel"
      >创建巡检</a-button>
    </div>
    <a-table
      :columns="columns"
      :dataSource="checkRecodeList"
      :rowKey="record => record.id"
      :pagination="pagination"
      @change="changePage"
    >
      <template
        slot="Ctrl"
        slot-scope="item"
      >
        <div class="ctrGroup">
          <a-popconfirm
            title="Are you sure delete this task?"
            @confirm="confirm((item.id))"
            okText="确定删除"
            cancelText="再想想"
          >
            <i
              class="iconfont icontimes"
              title="删除"
            ></i>
          </a-popconfirm>
          <i
            class="iconfont iconcog"
            @click="edit(item)"
            title="编辑"
          ></i>
        </div>
      </template>
    </a-table>
    <a-modal
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="modalWidth"
      :destroyOnClose="true"
      class="modelBox"
      okText='确定'
      cancelText='取消'
    >
      {{isEdit?'编辑编辑':'添加巡检'}}
      <div class="modalContent">
        <a-row class="infoItem arow">
          <a-col
            :span="24"
            class="acol"
          >
            <span class="title">联系电话</span>
            <span class="ctrData">
              <a-input
                class="sourceData"
                v-model="showData.tel"
                placeholder="请输入联系电话"
              />
            </span>
          </a-col>
          <a-col
            :span="24"
            class="acol"
          >
            <span class="title">已巡检数量</span>
            <span class="ctrData">
              <a-input
                class="sourceData"
                v-model="showData.checkedNum"
                placeholder="请输入已巡检数量"
              />
            </span>
          </a-col>
          <a-col
            :span="24"
            class="acol"
          >
            <span class="title">设备类型</span>
            <span class="ctrData">
              <a-select
                defaultValue="0"
                size="small"
                class="sourceData"
                v-model="showData.devType"
                @change="selectSheetType"
              >
                <a-select-option
                  v-for="(item,index) in InspectDeviceType"
                  :value="index"
                  v-bind:key="index"
                >{{item}}</a-select-option>
              </a-select>
            </span>
          </a-col>

          <a-col
            :span="24"
            class="acol"
          >
            <span class="title">巡检状态</span>
            <span class="ctrData">
              <a-select
                defaultValue="0"
                size="small"
                class="sourceData"
                v-model="showData.checkState"
                @change="selectSheetType"
              >
                <a-select-option
                  v-for="(item,index) in InspectState"
                  :value="index"
                  v-bind:key="index"
                >{{item}}</a-select-option>
              </a-select>
            </span>
          </a-col>
          <a-col
            :span="24"
            class="acol"
          >
            <span class="title">实际巡检时间</span>
            <span class="ctrData">
              <a-date-picker
                @change="changeTime1"
                :defaultValue="moment(showData.installTime,'YYYY/MM/DD')"
              />
            </span>
          </a-col>

          <a-col
            :span="24"
            class="acol"
          >
            <span class="title">计划巡检开始时间</span>
            <span class="ctrData">
              <a-date-picker
                @change="changeTime2"
                :defaultValue="moment(showData.checkTimeFrom,'YYYY/MM/DD')"
              />
            </span>
          </a-col>

          <a-col
            :span="24"
            class="acol"
          >
            <span class="title">计划巡检结束时间</span>
            <span class="ctrData">
              <a-date-picker
                @change="changeTime3"
                :defaultValue="moment(showData.checkTimeTo,'YYYY/MM/DD')"
              />
            </span>
          </a-col>

          <a-col
            :span="24"
            class="acol"
          >
            <span class="title">选择项目</span>
            <span class="ctrData">
              <a-select
                defaultValue="0"
                size="small"
                class="sourceData"
                v-model="showData.projectId"
                @change="selectSheetType"
              >
                <a-select-option :value="10020">10020</a-select-option>
              </a-select>
            </span>
          </a-col>

          <a-col
            :span="24"
            class="acol"
          >
            <span class="title">负责人</span>
            <span class="ctrData">
              <a-input
                class="sourceData"
                v-model="showData.keepPerson"
                placeholder="请输入责任人"
              />
            </span>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import moment from "moment";
import utils from "@/utils/";
import Log from "@/api/Log";
import baseMixin from "@/mixins/base.js";
import CONFIG_LIST from "@/config";
import { Popconfirm } from "ant-design-vue";

const { InspectDeviceType, InspectState } = CONFIG_LIST;
let api = new Log();
const columns = [
  {
    title: "序号",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "项目",
    dataIndex: "project",
    key: "project",
  },
  {
    title: "设备类型",
    dataIndex: "devType",
    key: "devType",
  },
  {
    title: "设备数量",
    dataIndex: "devNum",
    key: "devNum",
  },
  {
    title: "已巡检数量",
    dataIndex: "checkedNum",
    key: "checkedNum",
  },
  {
    title: "计划巡检开始时间",
    dataIndex: "checkTimeFrom",
    key: "checkTimeFrom",
  },
  {
    title: "计划巡检结束时间",
    dataIndex: "checkTimeTo",
    key: "checkTimeTo",
  },
  {
    title: "实际巡检完成时间",
    dataIndex: "installTime",
    key: "installTime",
  },
  {
    title: "巡检状态",
    dataIndex: "checkState",
    key: "checkState",
  },
  {
    title: "维护责任人",
    dataIndex: "keepPerson",
    key: "keepPerson",
  },
  {
    title: "联系电话",
    dataIndex: "tel",
    key: "tel",
  },
  {
    title: "创建人",
    dataIndex: "createBy",
    key: "createBy",
  },
  {
    title: "操作",
    width: "10%",
    key: "Ctrl",
    scopedSlots: { customRender: "Ctrl" },
  },
];
const InspeckType = [
  {
    全部: 0,
    智慧照明: 1,
    LED大屏: 2,
    安防监控: 3,
    环境传感器: 4,
    雷达: 5,
    充电桩: 6,
    WIFI: 7,
  },
  {
    未完成: 1,
    已完成: 2,
    已放弃: 3,
  },
];

export default {
  mixins: [baseMixin],
  components: {
    aPopconfirm: Popconfirm,
  },
  props: {
    visible: Boolean,
    modalTitle: String,
  },
  computed: {
    ...mapGetters(["showStatus"]),
    ...mapState(["curProject"]),
    ...mapState(["userInfo"]),
  },
  data() {
    return {
      InspeckType,
      moment,
      InspectState,
      InspectDeviceType,
      columns,
      checkRecodeList: [],
      pagination: {
        total: 10,
        current: 1,
        pageSize: 10,
      },
      queryOpt: {
        checkTimeFrom: "", //开始时间
        devType: "0", //类型
        checkState: "", //状态
        checkTimeTo: "", //结束时间
      },
      submitOpt: {
        projectId: "",
        project: "",
        devType: "",
        devNum: 0,
        checkState: "",
        checkedNum: 2,
        tel: "",
        checkTimeFrom: "2010-01-01 00:00:00",
        checkTimeTo: "2010-01-01 00:00:0",
        installTime: "2010-01-01 00:00:0",
        creater: "",
        keepPerson: "",
        creater: this.$store.state.userInfo.id,
        updater: "",
      },
      sheetContent: "",
      sheetTitle: "",
      isEdit: false,
      visible: false,
      modalWidth: 600,
      appointPersonList: [
        { name: "郝圆", id: 1 },
        { name: "郝圆1", id: 2 },
        { name: "郝圆2", id: 3 },
      ],
      editData: [],
      showData: [],
    };
  },
  created() {
    this.loadList("checkRecodeList", this.pagination, this.queryOpt);
  },
  mounted() {},
  methods: {
    changePage(pagination) {
      this.pagination.current = pagination.current;
      this.loadList("checkRecodeList", this.pagination, this.queryOpt);
    },
    async confirm(id) {
      let res = await api.delRecode({ id: id }).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.$message.success("删除成功");
      this.loadList("checkRecodeList", this.pagination, this.queryOpt);
    },
    edit(item) {
      let { editData } = this;
      editData = {
        id: item.id,
        // projectId: item.projectId,
        project: item.project,
        devType: item.devType,
        devNum: item.devNum,
        checkState: item.checkState,
        checkedNum: item.checkedNum,
        tel: item.tel,
        checkTimeFrom: item.checkTimeFrom,
        checkTimeTo: item.checkTimeTo,
        installTime: item.installTime,
        keepPerson: item.keepPerson,
        updater: this.$store.state.userInfo.id,
      };
      this.editData = editData;
      this.visible = true;
      this.isEdit = true;
      this.showData = this.editData;
    },
    changeTime1(time, time2) {
      this.submitOpt.installTime = time.format(utils.fsTime);
    },
    changeTime2(time, time2) {
      this.submitOpt.checkTimeFrom = time.format(utils.fsTime);
    },
    changeTime3(time, time2) {
      this.submitOpt.checkTimeTo = time.format(utils.fsTime);
    },
    startSearch() {},
    changeDateRange(dates) {
      //   this.queryOpt.beginDate = dates[0].format(utils.fsTime);
      //   this.queryOpt.endDate = dates[1].format(utils.fsTime);
      this.loadList("checkRecodeList", this.pagination, {
        checkTimeFrom: dates[0].format(utils.fsTime),
        checkTimeTo: dates[1].format(utils.fsTime),
      });
    },
    async handleOk() {
      let type = this.isEdit ? "editRecode" : "addRecode";
      this.visible = false;
      let opt;
      if (this.isEdit) {
        this.editData.devType = this.InspeckType[0][this.editData.devType];
        this.editData.checkState = this.InspeckType[1][
          this.editData.checkState
        ];
        opt = this.editData;
      } else {
        opt = this.submitOpt;
      }

      let res = await api[type](opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      } else {
        this.loadList("checkRecodeList", this.pagination, this.queryOpt);
      }
    },
    handleCancel() {
      this.visible = false;
    },
    selectSheetType(data) {
      // console.log(data);
    },
    showModel() {
      // if (this.submitOpt.creater) {
      //   for (const key in this.submitOpt) {
      //     this.submitOpt[key] = "";
      //   }
      // }
      this.visible = true;
      this.showData = this.submitOpt;
    },
    changeType(data) {
      this.loadList("checkRecodeList", this.pagination, {
        devType: data,
      });
    },
    changeState(data) {
      this.loadList("checkRecodeList", this.pagination, {
        checkState: data,
      });
    },
    async loadList(type, pagination, queryOpt) {
      let res = await api[type](pagination, queryOpt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.pagination.total = res.data.pages * 10;
      this.pagination.current = res.data.pageNum;
      let _list = res.data.list || res.data;
      _list.map((item, idx) => {
        item.checkTimeFrom = utils.toDate(item.checkTimeFrom);
        item.checkTimeTo = utils.toDate(item.checkTimeTo);
        item.installTime = utils.toDate(item.installTime);
        item.createTime = utils.toDate(item.createTime);
        item.devType = InspectDeviceType[item.devType];
        item.checkState = InspectState[item.checkState];
      });
      this.editData = _list;
      this[type] = _list;
    },
  },
};
</script>
<style lang="less">
.orderTable {
  .ctrGroup {
    i {
      cursor: pointer;
      margin-right: 5px;
    }
  }
}
.ant-select-selection {
  border-radius: 5px;
}
.ant-select-sm .ant-select-selection--single {
  height: 32px;
}
.modalContent {
  margin-top: 24px;
  width: calc(100% - 20px);
  .infoItem {
    width: 100%;
    margin-top: 10px;
    .acol {
      margin: 10px 0 10px 0;
    }
    span {
      display: inline-block;
    }
    .title {
      width: 15%;
      text-align: right;
      padding-right: 10px;
      vertical-align: top;
    }
    .ctrData {
      width: 423px;
      height: 32px;
      line-height: 32px;
      .sourceData {
        width: 100%;
        height: 100%;
      }
    }
    .ctrData1 {
      width: 85%;
      .oldGroup,
      .newGroup {
        width: 50%;
        float: left;
        &.no.oldGroup {
          width: 100%;
        }
        &.newGroup {
          .sourceData {
            width: 85%;
          }
        }
      }
      .inputLocation {
        width: 100%;
        margin-top: 5px;
        & .sourceData {
          width: 50%;
        }
      }
      .sourceData {
        border-radius: 10px;
        width: 100%;
        height: 32px;
        line-height: 32px;
        div {
          border: 1px solid red;
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }
}
</style>