<template>
  <div>
    <a-table
      class="Application_table"
      :columns="columns"
      :dataSource="dataList"
      :pagination="false"
    >
      <template
        slot="eventStatus"
        slot-scope="text, record"
      >{{record.eventStatus|formatEventStatus}}</template>
      <template
        slot="equipmentStatus"
        slot-scope="text, record"
      >{{record.equipmentStatus|formatEquipmentStatus}}</template>
    </a-table>
    <a-modal
      title="编辑事件"
      width="35%"
      :visible="visible"
      cancelText="取消"
      okText="保存"
      :destroyOnClose="true"
      @cancel="visible=false"
      @ok="validate"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
      >
        <a-form-item label="处理状态">
          <a-select v-decorator="['eventStatus']">
            <a-select-option value="0">待处理</a-select-option>
            <a-select-option value="1">处理中</a-select-option>
            <a-select-option value="2">已解决</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import _ from "lodash";
import Api from "@/api/Lock";
import baseMixin from "@/mixins/base.js";

const api = new Api();

const columns = [
  {
    title: "名称",
    dataIndex: "equipmentName",
    width: 120,
  },
  {
    title: "设备状态",
    dataIndex: "equipmentStatus",
    scopedSlots: { customRender: "equipmentStatus" },
    width: 120,
  },
  {
    title: "开启时间",
    dataIndex: "openTime",
    width: 120,
  },
  {
    title: "关闭时间",
    dataIndex: "closeTime",
    width: 120,
  },
  {
    title: "开锁方式",
    dataIndex: "openMethod",
    width: 60,
  },
  {
    title: "所属灯杆",
    dataIndex: "lightPoleInformation",
    width: 120,
  },
  {
    title: "安装位置",
    dataIndex: "location",
    width: 100,
  },
];

export default {
  mixins: [baseMixin],
  data() {
    return {
      columns,
      visible: false,
      form: this.$form.createForm(this),
      dataList: [],
      curEvent: {},
      paginationLightTask: {
        current: 1, //当前页
        pageSize: 10, //每页显示条数
        total: 0, //总数
      },
    };
  },

  created() {
    this.loadData({});
  },
  methods: {
    // 获取照明--任务列表数据
    async loadData(params) {
      let opt = Object.assign(params, { projectId: this.projectId });
      let res = await api.historyList(opt).catch((err) => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.dataList = res.data.list;
      //   this.setMapMarks(this.allDevice, "pole");
    },
    startEdit(record) {
      this.visible = true;
      this.curEvent = record;
    },
    validate(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        if (!error) {
          let params = Object.assign({}, values, {
            id: this.curEvent.id,
          });
          api
            .updateById(params)
            .then((res) => {
              if (_.isEmpty(res) || res.code !== "200") {
                return;
              }
              this.loadData({});
              this.visible = false;
              this.$message.success("编辑成功");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
  },
};
</script>
