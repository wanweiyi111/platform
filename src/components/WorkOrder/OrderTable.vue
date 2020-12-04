<template>
  <!-- 新建/编辑分组 -->
  <div class="orderTable">
    <div slot="tabBarExtraContent" class="pd-t5 ctrBar">
      <span>
        工单类型：
        <a-select class="mr5" size="small" defaultValue="a1" @change="changeType" placeholder="请选择">
          <a-select-option key="a1" value="a1">请选择</a-select-option>
          <a-select-option v-for="(item, index) in OrderType" :key="index" :value="index">{{item}}</a-select-option>
        </a-select>
      </span>
      <span>
        工单状态：
        <a-select
          class="mr5"
          size="small"
          defaultValue="a1"
          @change="changeState"
          placeholder="请选择"
        >
          <a-select-option key="a1" value="a1">请选择</a-select-option>
          <a-select-option v-for="(item, index) in OrderState" :key="index" :value="index">{{item}}</a-select-option>
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
      </span>
      <a-button type="primary" icon="plus" size="small" class="mr5" @click="showModel">创建工单</a-button>
    </div>
    <a-table
      :columns="columns"
      :dataSource="sheetList"
      :rowKey="record => record.id"
      @change="changePage"
      :pagination="pagination"
    >
      <template slot="Ctrl" slot-scope="item">
        <div class="ctrGroup">
          <a-popconfirm
            title="Are you sure delete this task?"
            @confirm="confirm((item.id))"
            okText="确定删除"
            cancelText="再想想"
          >
            <i class="iconfont icontimes" title="删除"></i>
          </a-popconfirm>
          <i class="iconfont iconcog" @click="edit(item)" title="编辑"></i>
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
      {{isEdit?'编辑工单':'添加工单'}}
      <div class="modalContent">
        <a-row class="infoItem arow">
          <a-col :span="24" class="acol">
            <span class="title">工单主题</span>
            <span class="ctrData">
              <a-input class="sourceData" v-model="showData.sheetTitle" placeholder="请输入资源名称" />
            </span>
          </a-col>
          <a-col :span="24" class="acol">
            <span class="title">工单类型</span>
            <span class="ctrData">
              <a-select
                defaultValue="0"
                size="small"
                class="sourceData"
                v-model="showData.sheetType"
                @change="selectSheetType"
              >
                <a-select-option
                  v-for="(item,index) in OrderType"
                  :value="index"
                  v-bind:key="index"
                >{{item}}</a-select-option>
              </a-select>
            </span>
          </a-col>
          <a-col :span="24" class="acol">
            <span class="title">工单状态</span>
            <span class="ctrData">
              <a-select
                defaultValue="0"
                size="small"
                class="sourceData"
                v-model="showData.sheetState"
                @change="selectSheetType"
              >
                <a-select-option
                  v-for="(item,index) in OrderState"
                  :value="index"
                  v-bind:key="index"
                >{{item}}</a-select-option>
              </a-select>
            </span>
          </a-col>
          <a-col :span="24" class="acol">
            <span class="title">工单内容</span>
            <span class="ctrData">
              <a-textarea placeholder="请输入内容" :rows="4" v-model="showData.sheetContent" />
            </span>
          </a-col>
          <a-col :span="24" class="acol">
            <span class="title">指派时间</span>
            <span class="ctrData">
              <a-date-picker
                @change="changeTime1"
                :defaultValue="moment(showData.appointTime,'YYYY/MM/DD hh:mm:ss')"
              />
            </span>
          </a-col>

          <a-col :span="24" class="acol">
            <span class="title">计划完成时间</span>
            <span class="ctrData">
              <a-date-picker
                @change="changeTime2"
                :defaultValue="moment(showData.plantCompletionTime,'YYYY/MM/DD hh:mm:ss')"
              />
            </span>
          </a-col>
          <a-col :span="24" class="acol">
            <span class="title">实际完成时间</span>
            <span class="ctrData">
              <a-date-picker
                @change="changeTime3"
                :defaultValue="moment(showData.actualCompletionTime,'YYYY/MM/DD hh:mm:ss')"
              />
            </span>
          </a-col>
          <a-col :span="24" class="acol">
            <span class="title">负责人</span>
            <span class="ctrData">
              <a-input class="sourceData" v-model="showData.appointPerson" placeholder="请输入责任人" />
            </span>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
import utils from "@/utils/";
import Log from "@/api/Log";
import baseMixin from "@/mixins/base.js";
import CONFIG_LIST from "@/config";
import { Popconfirm } from "ant-design-vue";

const { OrderState, OrderType } = CONFIG_LIST;
let api = new Log();
const columns = [
  {
    title: "序号",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "工单类型",
    dataIndex: "sheetType",
    key: "sheetType"
  },
  {
    title: "工单内容",
    dataIndex: "sheetContent",
    key: "sheetContent"
  },
  {
    title: "工单主题",
    dataIndex: "sheetTitle",
    key: "sheetTitle"
  },
  {
    title: "工单状态",
    dataIndex: "sheetState",
    key: "sheetState"
  },
  {
    title: "指派时间",
    dataIndex: "appointTime",
    key: "appointTime"
  },
  {
    title: "指派责任人",
    dataIndex: "appointPerson",
    key: "appointPerson"
  },
  {
    title: "计划完成时间",
    dataIndex: "plantCompletionTime",
    key: "plantCompletionTime"
  },
  {
    title: "实际完成时间",
    dataIndex: "actualCompletionTime",
    key: "actualCompletionTime"
  },
  {
    title: "创建人",
    dataIndex: "createBy",
    key: "createBy"
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime"
  },
  {
    title: "更新人",
    dataIndex: "updater",
    key: "updater"
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    key: "updateTime"
  },
  {
    title: "操作",
    width: "10%",
    key: "Ctrl",
    scopedSlots: { customRender: "Ctrl" }
  }
];
const orderTpe = [
  {
    待指派: 1,
    审核中: 2,
    己驳回: 3,
    处理中: 4,
    己完成: 5
  },
  {
    All: 0,
    业务工单: 1,
    运维工单: 2
  }
];

export default {
  mixins: [baseMixin],
  components: {
    aPopconfirm: Popconfirm,
  },
  props: {
    modalTitle: String
  },
  data() {
    return {
      orderTpe,
      moment,
      OrderState,
      OrderType,
      columns,
      editData: [],
      sheetList: [],
      pagination: {
        total: 10,
        current: 1,
        pageSize: 10
      },
      queryOpt: {
        plantCompletionTime: "", //开始时间
        sheetType: "0", //工单类型
        sheetStateList: [], //工单状态
        actualCompletionTime: "" //结束时间
      },
      submitOpt: {
        appointTime: "2019-01-01 00:00:00", //指派时间
        sheetState: "", //工单状态
        sheetTitle: "", //工单主题
        sheetContent: "", //工单内容
        sheetType: "", //工单类型
        creater: "", //创建人
        appointPerson: "", //创建人
        updater: "", //更新人
        plantCompletionTime: "2019-01-01 00:00:00", //计划时间
        actualCompletionTime: "2019-01-01 00:00:00" //实际时间
      },
      sheetContent: "",
      sheetTitle: "",
      isEdit: false,
      visible: false,
      modalWidth: 600,
      appointPersonList: [
        { name: "郝圆", id: 1 },
        { name: "郝圆1", id: 2 },
        { name: "郝圆2", id: 3 }
      ],
      showData: []
    };
  },
  created() {
    this.loadList("sheetList", this.pagination, this.queryOpt);
  },
  mounted() {},
  methods: {
    changePage(pagination) {
       this.pagination.current = pagination.current;
      this.loadList("sheetList", this.pagination, this.queryOpt);
    },
    async confirm(id) {
      let res = await api.delOrder({ id: id }).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.$message.success("删除成功");
      this.loadList("sheetList", this.pagination, this.queryOpt);
    },
    edit(item) {
      let editData = {
        updater: this.$store.state.userInfo.id,
        id: item.id,
        appointTime: item.appointTime + " 00:00:00", //指派时间
        sheetState: item.sheetState, //工单状态
        sheetTitle: item.sheetTitle, //工单主题
        sheetContent: item.sheetContent, //工单内容
        sheetType: item.sheetType, //工单类型
        appointPerson: item.appointPerson, //责任人
        plantCompletionTime: item.plantCompletionTime + " 00:00:00", //计划时间
        actualCompletionTime: item.actualCompletionTime + " 00:00:00" //实际时间
      };
      this.editData = editData;
      this.visible = true;
      this.isEdit = true;
      this.showData = this.editData;
    },
    changeTime1(time, time2) {
      this.submitOpt.appointTime = time.format(utils.fsTime);
    },
    changeTime2(time, time2) {
      this.submitOpt.plantCompletionTime = time.format(utils.fsTime);
    },
    changeTime3(time, time2) {
      this.submitOpt.actualCompletionTime = time.format(utils.fsTime);
    },
    startSearch() {},
    changeDateRange(dates) {
      //   this.queryOpt.beginDate = dates[0].format(utils.fsTime);
      //   this.queryOpt.endDate = dates[1].format(utils.fsTime);
      this.loadList("sheetList", this.pagination, {
        plantCompletionTime: dates[0].format(utils.fsTime),
        actualCompletionTime: dates[1].format(utils.fsTime)
      });
    },
    async handleOk() {
      let type = this.isEdit ? "editOrder" : "addOrder";
      this.visible = false;
      let opt;
      if (this.isEdit) {
        this.editData.projectId = this.projectId;
        this.editData.sheetState = this.orderTpe[0][this.editData.sheetState];
        this.editData.sheetType = this.orderTpe[1][this.editData.sheetType];
        opt = this.editData;
      } else {
        this.submitOpt.projectId = this.projectId;
        this.submitOpt.creater = this.$store.state.userInfo.id;
        this.submitOpt.updater = "";
        opt = this.submitOpt;
      }
      let res = await api[type](opt).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      } else {
        this.loadList("sheetList", this.pagination, this.queryOpt);
      }
    },
    handleCancel() {
      this.visible = false;
    },
    selectSheetType(data) {
      console.log(data);
    },
    showModel() {
      this.isEdit = false;
      this.visible = true;
      this.showData = this.submitOpt;
    },
    changeType(data) {
      this.loadList("sheetList", this.pagination, {
        sheetType: data
      });
    },
    changeState(data) {
      this.queryOpt.sheetStateList.push(Number(data) + 1)
      this.loadList("sheetList", this.pagination, this.queryOpt);
    },
    async loadList(type, pagination, queryOpt) {
      let res = await api[type](pagination, queryOpt).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.pagination.total = res.data.pages*10;
      this.pagination.current = res.data.pageNum;
      let _list = res.data.list || res.data;
      _list.map((item, idx) => {
        item.appointTime = utils.toDate(item.appointTime);
        item.plantCompletionTime = utils.toDate(item.plantCompletionTime);
        item.actualCompletionTime = utils.toDate(item.actualCompletionTime);
        item.createTime = utils.toDate(item.createTime);
        item.updateTime = utils.toDate(item.updateTime);
        item.sheetType = OrderType[item.sheetType];
        item.sheetState = OrderState[item.sheetState];
      });
      this.editData = _list;
      this[type] = _list;
    }
  }
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