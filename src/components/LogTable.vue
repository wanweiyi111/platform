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
      title: "序号",
      dataIndex: "id",
      width: 40,
    },
    {
      title: "时间",
      dataIndex: "date",
      width: 190,
    },
    {
      title: "IP地址",
      dataIndex: "ip",
      width: 140,
    },
    {
      title: "用户名",
      dataIndex: "userName",
      width: 150,
    },
    {
      title: "操作类型",
      dataIndex: "type",
      width: 100,
    },
    {
      title: "操作内容",
      dataIndex: "record",
    },
  ],
  [
    {
      title: "序号",
      dataIndex: "id",
      width: 40,
    },
    {
      title: "时间",
      dataIndex: "date",
      width: 190,
    },
    {
      title: "级别",
      dataIndex: "level",
      width: 60,
    },
    {
      title: "来源",
      dataIndex: "source",
    },
    {
      title: "详情",
      dataIndex: "detail",
    },
  ],
  [
    {
      title: "序号",
      dataIndex: "id",
      width: 40,
    },
    {
      title: "应用类型",
      dataIndex: "type",
    },
    {
      title: "操作人员",
      dataIndex: "userName",
    },
    {
      title: "操作记录",
      dataIndex: "record",
    },
    {
      title: "操作时间",
      dataIndex: "date",
      width: 190,
    },
    {
      title: "操作结果",
      dataIndex: "result",
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
  ],
  [
    {
      title: "序号",
      dataIndex: "id",
      width: 40,
    },
    {
      title: "操作人ID",
      dataIndex: "createById",
    },
    {
      title: "操作时间",
      dataIndex: "createTime",
      width: 150,
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
      title: "设备类型",
      dataIndex: "equipmentType",
      width: 100,
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
    },
    queryObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      columns,
      dataList: [],
      // pagination: { current: 1, pageSize: 10 }
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
        this.queryObj.projectId = this.projectId;
        let res = await log[func](this.pageInfo, this.queryObj);
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