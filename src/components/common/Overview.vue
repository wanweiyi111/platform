<template>
  <a-table
    :columns="columns"
    :rowKey="record => record.id"
    :dataSource="dataList"
    :pagination="pagination"
    :loading="loading"
    :customRow="cusRow"
    :rowClassName="getRowClass"
    :bordered="false"
    :rowSelection="{onSelect: onSelectChange, onSelectAll: onSelectChange}"
    size="middle"
    @change="changePage"
  >
    <span slot="action" slot-scope="text, record" v-if="edit">
      <a href="javascript:;" class="white1 mr5" @click.stop="showDetail(record)">
        <i class="iconfont iconeye"></i>
      </a>
      <a href="javascript:;" class="white1 mr5" @click.stop="location(record)">
        <i class="iconfont iconmap-marker-alt"></i>
      </a>
      <a href="javascript:;" class="white1" @click.stop="startEdit(record)">
        <i class="iconfont iconcog"></i>
      </a>
    </span>
  </a-table>
</template>

<script>
import _ from "lodash";
import Api from "@/api";
import baseMixin from "@/mixins/base.js";
import MapMixin from "@/mixins/map.js";

const api = new Api();

export default {
  mixins: [baseMixin, MapMixin],
  props: {
    dataList: {
      type: Array
    },
    columns: {
      type: Array,
      required: true
    },
    edit: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rowSelection: this.edit ? rowSelection : null,
      loading: false,
      queryObj: {},
      selectedRowIndex: -1,
      changePageEvent: _.debounce(this.onScrollBottom, 150)
    };
  },
  created() {
    let vm = this;
    this.$bus.off('mapMarksClick').on("mapMarksClick", ev => {
      // debugger;
      for (let i = 0, len = vm.dataList.length; i < len; i++) {
        // let item = this.dataList[i];
        if (vm.dataList[i].id === ev.data.id) {
          vm.selectedRowIndex = i;
          return;
        }
      }
      vm.selectedRowIndex = -1;
    });

    if (this.edit) {
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i]["key"] === "action") {
          return;
        }
      }
      this.columns.push({
        title: "",
        key: "action",
        scopedSlots: { customRender: "action" }
      });
    }
  },
  mounted() {
    // document
    //   .querySelector("#overview .ant-table-body")
    //   .addEventListener("scroll", this.changePageEvent);
  },
  methods: {
    onScrollBottom(event) {
      let el = event.target;
      let clientHeight = el.clientHeight,
        offsetHeight = el.scrollHeight,
        scrollTop = el.scrollTop;
      let position = offsetHeight - clientHeight - scrollTop;
      if (position <= 10) {
        this.$bus.emit("overviewScrollBottom");
      }
    },
    cusRow(record, index) {
      if (this.edit) {
        return false;
      }
      return {
        on: {
          click: () => {
            this.selectedRowIndex = index;
            this.$emit("selectedRow", record);
          }
        }
      };
    },
    getRowClass(record, index) {
      return index === this.selectedRowIndex ? "selected-row" : "";
    },
    location(record) {
      this.setCenter(record);
    },
    async showDetail(item, isEdit) {
      let params = Object.assign({}, this.queryObj, { id: item.id });
      try {
        let res = await api.findByInfoAndRun(params);
        if (res.code !== "200") {
          return;
        }
        this.$bus.emit("selectedRow", res.data, isEdit);
        this.$emit("selectedRow", res.data, isEdit);
      } catch (err) {
        console.warn(err);
      }
    },
    startEdit(item) {
      this.showDetail(item, true);
    },
    changePage(pageInfo) {
      this.$emit("change", pageInfo);
    },
    onSelectChange(record, selected, selectedRows) {
      this.$emit('selectedRows', selectedRows);
    }
  }
};
</script>

<style lang="less">
.selected-row {
  background: rgba(138, 199, 247, 0.1);
}
</style>
