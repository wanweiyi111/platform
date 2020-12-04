<template>
  <div
    class="DemandRight"
    id="DemandRight"
  >
    <div class="dataPicker">
      <a-row>
        <a-col :span="16">
          <a-range-picker
            @change="onChange"
            :format="dateFormat"
            :placeholder="['开始时间', '结束时间']"
          />
        </a-col>
        <a-col
          :span="8"
          style="textAlign:right"
        >
          <a-button
            type="primary"
            icon="search"
            @click="goSearch"
          >
            搜索
          </a-button>
        </a-col>
      </a-row>

    </div>
    <!-- <p>历史清单</p> -->
    <ul class="remandList">
      <span v-if="cameraList.length===0">暂无数据</span>
      <li
        v-for="(item,index) in cameraList"
        v-bind:key="index"
        @click="selCemare(item,index)"
        v-bind:class="selNum===index?'active':''"
      >
        <span
          class="left ellipsis"
          :title="item.equipmentName"
        >{{item.equipmentName}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import Media from "@/api/Media.js";
import utils from "@/utils/";
import baseMixin from "@/mixins/base.js";
let media = new Media();

export default {
  mixins: [baseMixin],
  components: {},
  props: {
    getPlayback: Function,
  },
  data() {
    return {
      dateFormat: "YYYY/MM/DD",
      cameraList: [],
      selNum: "",
      timeData: {}, // 选择时间
    };
  },
  created() {
    this.getCameraList();
  },
  computed: {},
  methods: {
    goSearch() {
      if (this.cameraList[this.selNum]) {
        let opt = {
          startTime: this.timeData.startTime,
          endTime: this.timeData.endTime,
          type: "record",
          token: this.cameraList[this.selNum].token,
        };
        this.getPlaybackList(opt);
      } else {
        this.$message.warning("暂未选择设备");
      }
    },
    selCemare(item, idx) {
      this.selNum = idx;
    },
    //安防列表获取
    async getCameraList() {
      let res = await media
        .GetSrcWithoutDevice({
          projectId: this.projectId,
        })
        .catch((err) => {
          console.log(err);
        });
      if (res && res.code === "200") {
        res.data.map((item, idx) => {
          this.cameraList.push({
            no: idx,
            token: item.strToken,
            equipmentName: item.equipmentName,
            host: item.serverName && item.serverName.replace("http://", ""),
            selected: false,
          });
        });
      }
    },
    onChange(val) {
      this.timeData = {
        startTime: val[0].format(utils.fsTime),
        endTime: val[1].format(utils.fsTime),
      };
    },
    async getPlaybackList(data) {
      let res = await media.getSnapshotAndRecord(data);
      if (res.record && res.record.length > 0) {
        let tmp = [];
        res.record.map((item, idx) => {
          let fileName = item.strPath.split("\\").pop().split("/").pop();
          tmp.push({
            id: idx,
            filename: fileName,
            src: `http://${this.cameraList[this.selNum].host}${item.strPath}`,
            token: item.strToken,
            host: this.cameraList[this.selNum].host,
            strStartTime: item.strStartTime,
            strEndTime: item.strEndTime,
          });
        });
        this.getPlayback(tmp);
      }
    },
  },
};
</script>

<style lang="less">
/*** overwrite ant style***/
.ant-input {
  color: #ddfdff;
  // border: none;
}
.ant-calendar-date-panel,
.ant-calendar-input-wrap {
  background: rgba(2, 22, 82, 0.7);
}
/*** overwrite ant style***/
.DemandRight {
  font-size: 14px;
  color: #ddfdff;
  padding-left: 15px;
  p {
    margin: 20px 0 15px 0;
    color: #7ec3fa;
  }
  .dataPicker {
    width: 100%;
    .picker {
      width: 100%;
      border: 1px solid #18599b;
      border-radius: 3px;
    }
  }
  .remandList {
    font-size: 12px;
    height: 500px;
    overflow-y: scroll;
    li {
      cursor: pointer;
      height: 34px;
      line-height: 34px;
      padding: 0 5px;
      .right {
        float: right;
        font-size: 12px;
      }
      &.active {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}
</style>
