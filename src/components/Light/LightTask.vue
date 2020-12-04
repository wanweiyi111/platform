<template>
  <!-- 照明--任务 -->
  <div>
    <a-table
      :columns="columns"
      :dataSource="dataList"
      :rowSelection="{onSelect: onSelectRow,onSelectAll: onSelectAllRow}"
      :pagination="false"
      :scroll="{x:1400,y:470}"
    />
    <a-pagination
      :total="paginationLightTask.total"
      :current="paginationLightTask.current"
      :showTotal="total => `共 ${total} 条`"
      @change="changePage"
    />
  </div>
</template>

<script>
import _ from "lodash";
import Api from "@/api";

const api = new Api();

const columns = [
  {
    title: "序号",
    dataIndex: "id",
    width: 40
  },
  {
    title: "计划名称",
    dataIndex: "taskName",
    width: 120
  },
  {
    title: "所属控制器",
    dataIndex: "resourceName",
    width: 120
  },
  {
    title: "单灯数量",
    dataIndex: "enquipmentCount",
    width: 60
  },
  {
    title: "计划状态",
    dataIndex: "status",
    width: 60,
    scopedSlots: { customRender: "status" }
  },
  {
    title: "日期段",
    dataIndex: "dateRange",
    width: 120
  },
  {
    title: "触发时间",
    dataIndex: "pointInTime",
    width: 100
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    width: 120
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 120,
    scopedSlots: { customRender: "operation" }
  }
];

export default {
  data() {
    return {
      columns,
      dataList: [],
      paginationLightTask: {
        //照明--任务分页数据
        current: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0 //总数
      }
    };
  },

  created() {
    this.loadlightTaskList();
  },
  methods: {
    // 获取照明--任务列表数据
    async loadlightTaskList(flag) {
      if (flag) this.paginationLightTask.current = 1;
      let params = `/${this.paginationLightTask.current}/${this.paginationLightTask.pageSize}`;
      let res = await api
        .lightTaskQueryList(params, { resourceName: this.taskSearchdata })
        .catch(err => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code !== 200) {
        return;
      }
      this.paginationLightTask.total = res.totalNum;
      this.dataListLightTask = this.processingData(res.data);
    },
    // 处理接口返回的数据，给列表设置唯一key
    processingData(data) {
      let processedData = data.map((_, index) => {
        if (_.resourceType == 2) {
          delete _.children;
        }
        _.onOff = false;
        _["key"] = index + 1;

        return _;
      });
      return processedData;
    },
    // 照明--任务列表分页
    lightTaskChangePage(page) {
      this.paginationLightTask.current = page;
      this.loadlightTaskList();
    },

    // 删除照明任务信息
    async lightTaskDelete() {
      if (_.isEmpty(this.selectedRowsData)) {
        this.$message.warning("请选择要删除的信息！");
        return;
      }
      let params = `ids=${this.lightDeleteData.ids}`;
      let res = await api.lightTaskRemove(params).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== 200) {
        this.$message.warning(res.msg);
        return;
      }
      this.loadlightTaskList();
      this.$message.success("删除成功！");
    },

    // 照明任务根据ID修改任务状态
    async lightTaskChangeState(data) {
      let params = `/${data.id}/${data.planStateCode}`;
      let res = await api.lightTaskModifyStatus(params).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning("修改失败！");
        return;
      }
      this.loadlightTaskList();
      this.$message.success("修改成功！");
    },
    // 照明任务查看任务关联详情
    async showModalTaskInfo(id) {
      this.visibleTaskInfo = true;
      let res = await api.lightGroupQueryGroupLight(id).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code != 200) {
        this.$message.warning("请求失败！");
        return;
      }
      this.dataListTaskInfo = res.data;
    },
    // 照明任务隐藏任务详情对话框
    cancelTaskInfo() {
      this.visibleTaskInfo = false;
    },
    selectedRows(selectedRows) {
      this.$emit("selectRows", selectedRows);
    },
    // 选择列表信息
    onSelectRow(record, selected, selectedRows) {
      this.selectedRows(selectedRows);
    },
    // 选择全部
    onSelectAllRow(selected, selectedRows) {
      this.selectedRows(selectedRows);
    }
  }
};
</script>
