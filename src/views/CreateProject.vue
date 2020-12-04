<template>
  <!-- 权限管理--添加权限控制 -->
  <div class="createProject">
    <a-row class="bottom-sidebar high">
      <a-col>
        <CtrlPanel>
          <dt slot="title"
              class="clearfix pd-x20">
            项目初始化

          </dt>
          <dd slot="content"
              class="pd-x20">
            <a-row class="projectInfo">
              <a-col :span='8'>
                <span class="title">项目编码</span>
                <a-auto-complete style="width: 200px"
                                 @select="onSelect"
                                 @search="handleSearch"
                                 placeholder="请输入项目编码">
                  <template slot="dataSource">
                    <a-select-option v-for="item in dataSource"
                                     :key="item.id"
                                     :value="item.id+'/'+item.projectName">{{item.projectName}}</a-select-option>
                  </template>
                </a-auto-complete>
              </a-col>
              <a-col :span='8'>
                <span class="title">项目名字</span>
                <span>{{projectName}}</span>
              </a-col>
              <a-col :span='8'>
                <a-button type="primary"
                          icon="save"
                          size="small"
                          @click="save"
                          class="mr5">保存</a-button>
              </a-col>
            </a-row>
            <a-table :columns="columns"
                     :rowKey="record => record.id"
                     :dataSource="equipmentList"
                     :pagination="false"
                     :rowSelection="rowSelection"
                     :scroll="{x:1400,y:470}">
              <template slot="operation"
                        slot-scope="text, record">
                <!-- <a-checkbox @change="selEquipment(record)"></a-checkbox> -->
              </template>
            </a-table>
          </dd>
        </CtrlPanel>
      </a-col>
    </a-row>

  </div>
</template>

<script>
import CtrlPanel from "@/components/CtrlPanel.vue";
import MapMixin from "@/mixins/map.js";
import CONFIG_LIST from "@/config";
import API from "@/api/Pole";
import _ from "lodash";
let api = new API();
const { DeviceType } = CONFIG_LIST;
const columns = [
  {
    title: "资源分类与名称",
    dataIndex: "_equipmentType",
    width: 120
  },
  {
    title: "设备型号",
    dataIndex: "equipmentModel",
    width: 120
  },
  {
    title: "设备MAC",
    dataIndex: "equipmentMac",
    width: 160
  },
  {
    title: "设备编号",
    dataIndex: "id",
    width: 160
  },
  {
    title: "添加到项目",
    dataIndex: "operation",
    width: 100,
    scopedSlots: { customRender: "operation" }
  }
];
export default {
  mixins: [MapMixin],
  components: {
    CtrlPanel,
  },
  props: {
    model: Object
  },
  data () {
    return {
      projectId: '',
      projectList: [],
      dataSource: [],
      projectName: '',
      columns,
      equipmentList: [],
      submitData: [],
      topType: [],
      rowSelection: {
/*         onChange: (selectedRowKeys, selectedRows) => {
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        }, */
        onSelect: (record, selected, selectedRows) => {
          let { submitData, topType, projectId } = this;
          submitData = [];
          topType = [];
          selectedRows && selectedRows.map((item, idx) => {
            if (item._children) {
              submitData.push({
                "ids": [],
                "equipmentType": item.equipmentType,
                "projectId": projectId
              })
              topType.push(item.equipmentType)
              item._children.map((_item, _idx) => {
                if (submitData[idx]['ids'].indexOf(_item.id) < 0) {
                  submitData[idx]['ids'].push(_item.id)
                }
              })
            } else {
              let index = topType.indexOf(item.parentEquipmentType);
              // console.log(index, '22222222222')
              if (index >= 0) {
                if (submitData[index]['ids'].indexOf(item.id) < 0) {
                  submitData[index]['ids'].push(item.id)
                }
              } else {
                submitData.push({
                  "ids": [item.id],
                  "equipmentType": item.parentEquipmentType,
                  "projectId": projectId
                })
                topType.push(item.parentEquipmentType)
              }
            }
          })
          this.submitData = submitData;
          this.topType = topType;
          // console.log(topType, '111111111111111')
          // console.log(submitData, '+++++++++++')
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selected, selectedRows, changeRows);
        },
      }
    };
  },
  created () {
    this.loadList('findAllEquipmentWithout', {}, 'equipmentList');
    this.loadList('getProjectList', {}, 'projectList');
  },
  methods: {
    async loadList (type, opt, data) {
      let res = await api[type](opt).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      if (type === 'findAllEquipmentWithout') {
        let _data = res.data;
        _data.map((item, index) => {
          _data[index]._equipmentType = DeviceType[item.equipmentType]
          _data[index]._children = item.children
          item.children.map((_item, _index) => {
            item.children[_index]._equipmentType = DeviceType[_item.equipmentType]
            item.children[_index].parentEquipmentType = item.equipmentType
          })
        })
        this[data] = _data;
      } else {
        this[data] = res.data;
      }
    },
    selEquipment (data) {
      console.log(data)
    },
    handleSearch (value) {
      let id = parseInt(value)
      this.loadList('getProjectList', { "id": id }, 'dataSource');
    },
    onSelect (value) {
      let data = value.split('/')
      this.submitData.projectId = parseInt(data[0])
      this.projectId = parseInt(data[0])
      this.projectName = data[1]
      this.submitData.map((item, idx) => {
        this.submitData[idx].projectId = parseInt(data[0])
      })
    },
    async save () {
      let res = await api.saveBindProject(this.submitData).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.$message.success('提交成功');
      this.cancel();
    },
    cancel () {
      this.submitData = []
      this.topType = []
    }
  }
};
</script>
<style lang="less">
.createProject {
  .projectInfo {
    color: #ddfdff;
    margin-bottom: 20px;
    .title {
      display: inline-block;
      margin-right: 10px;
    }
    input {
      border-radius: 10px;
    }
  }
}
</style>