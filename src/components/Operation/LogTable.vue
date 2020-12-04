<template>
  <a-table
    class="Application_table"
    :columns="columns[tabKey]"
    :rowKey="record => record.id"
    :dataSource="dataList"
    :pagination="pageInfo"
    :bordered="false"
    size="middle"
    @change="changePage"
  ></a-table>
</template>

<script>
import utils from "@/utils";
import Log from "@/api/Log.js";
import baseMixin from "@/mixins/base.js";

const log = new Log();
const columns = [
  null,
  [],
  [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "内容",
      dataIndex: "record",
    },
    {
      title: "用户名",
      dataIndex: "userName",
      width: 150,
    },
    {
      title: "IP地址",
      dataIndex: "ip",
      width: 130,
    },
    {
      title: "类型",
      dataIndex: "type",
      width: 80,
    },
    {
      title: "时间",
      dataIndex: "date",
      width: 150,
    },
  ],
  [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "详情",
      dataIndex: "detail",
    },
    {
      title: "来源",
      dataIndex: "source",
    },
    {
      title: "类型",
      dataIndex: "level",
      width: 60,
    },
    {
      title: "时间",
      dataIndex: "date",
      width: 150,
    },
  ],
  [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "操作记录",
      dataIndex: "record",
    },
    {
      title: "操作人员",
      dataIndex: "userName",
    },
    {
      title: "操作结果",
      dataIndex: "result",
    },
    {
      title: "类型",
      dataIndex: "type",
      width: 60,
    },
    {
      title: "操作时间",
      dataIndex: "date",
      width: 150,
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
  ],
  [
    {
      title: "ID",
      dataIndex: "createById",
    },
    {
      title: "设备编号",
      dataIndex: "equipmentCode",
    },
    {
      title: "设备名称",
      dataIndex: "equipmentName",
    },
    {
      title: "类型",
      dataIndex: "equipmentType",
      width: 80,
    },
    {
      title: "执行方法",
      dataIndex: "execMethod",
    },
    {
      title: "执行参数",
      dataIndex: "execParam",
    },
    {
      title: "执行状态",
      dataIndex: "execStatus",
    },
    // {
    //   title: "回调消息",
    //   dataIndex: "messageData"
    // },
    {
      title: "回调消息ID",
      dataIndex: "messageId",
    },
    {
      title: "项目id",
      dataIndex: "projectId",
      width: 60,
    },
    {
      title: "操作时间",
      dataIndex: "createTime",
      width: 130,
    },
  ],
];

const typeMap = {
  1: "",
  2: "operationsList",
  3: "exceptionsList",
  4: "applicationsList",
  5: "execLogQuery",
};

const execStatus = {
  0: "失败",
  1: "成功",
  2: "异常",
  3: "执行中",
};

export default {
  mixins: [baseMixin],
  props: {
    tabKey: {
      type: String,
      required: true,
      default: () => "",
    },
    query: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      columns,
      dataList: [],
      // pagination: { current: 1, pageSize: 10 }
      // pageInfo: {
      //   current: 1,
      //   pageSize: 10,
      //   total: 0,
      //   showTotal: (total) => `共 ${total} 条`,
      // },
    };
  },
  created() {
    this.LoadLogList();
  },
  methods: {
    async LoadLogList() {
      let func = typeMap[this.tabKey];
      if (!func) {
        return;
      }
      try {
        let page = {};
        if (this.tabKey === "5") {
          page.pageNum = this.pageInfo.current;
          page.pageSize = this.pageInfo.pageSize;
        } else {
          page = this.pageInfo;
        }
        this.query.projectId = this.projectId;
        let res = await log[func](page, this.query);
        if (res.code !== "200") {
          return;
        }
        if (this.tabKey === "5") {
          this.dataList = res.data.list.map((item) => {
            item.equipmentType = utils.getEquipmentTypeText(item.equipmentType);
            item.execStatus = execStatus[item.execStatus];
            return item;
          });
        } else {
          this.dataList = res.data.list.map((item) => {
            item.date = utils.toTime(item.date);
            return item;
          });
        }

        this.setPageInfo(res);
        // this.pagination.total = res.data.total;
        // this.pagination.current = res.data.pageNum;
      } catch (err) {
        console.info(err);
      }
    },
    changePage(pagination) {
      this.pageInfo.current = pagination.current;
      this.pageInfo.pageNum = pagination.current;
      this.LoadLogList();
    },
  },
};
</script>