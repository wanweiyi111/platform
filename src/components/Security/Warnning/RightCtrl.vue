<template>
  <div class="WarnningRight">
    <div class="dataPicker">
      <a-date-picker @change="onChange" class="picker" placeholder="请选择回放日期" />
    </div>
    <p>历史清单</p>
    <ul class="remandList">
      <a-row class="item" v-for="(item,index) in listData" v-bind:key="index">
        <a-col :span="8" class="left ellipsis" :title="item.lastUpdateDate">{{item.faultType}}</a-col>
        <a-col
          :span="8"
          class="middle ellipsis"
          :title="item.lastUpdateDate"
        >{{item.faultDescription}}</a-col>
        <a-col :span="8" class="right ellipsis" :title="item.lastUpdateDate">{{item.lastUpdateDate}}</a-col>
      </a-row>
    </ul>
  </div>
</template>

<script>
import Camera from "@/api/Camera.js";
import _ from "lodash";
import utils from "@/utils/";
import baseMixin from "@/mixins/base.js";
let camera = new Camera();

export default {
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      listData: []
    };
  },
  created() {
    // camera.isLogin();
    this.getWarnningList(this.projectId, "2019-08-21T04:08:46.101Z");
  },
  computed: {},
  methods: {
    onChange(val) {
      this.getWarnningList(this.projectId, val);
    },
    async getWarnningList(projectId, lastUpdate, cameraId) {
      let opt = {
        projectId: projectId
      };
      if (cameraId) {
        opt.cameraId = cameraId;
      }
      if (lastUpdate) {
        opt.lastUpdate = lastUpdate;
      }
      let res = await camera.getCameraWarnningList(opt).catch(err => {
        console.log(err);
      });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      } else {
        res.data &&
          res.data.map((item, index) => {
            item.lastUpdateDate = utils.toDay(item.lastUpdateDate);
          });
        this.listData = res.data;
      }
    }
  }
};
</script>

<style lang="less">
.WarnningRight {
  /*** overwrite ant style***/
  .ant-input {
    color: #ddfdff;
    border: none;
  }
  .ant-calendar-date-panel,
  .ant-calendar-input-wrap {
    background: rgba(2, 22, 82, 0.7);
  }
  /*** overwrite ant style***/
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
    height: 480px;
    overflow-y: scroll;
    .item {
      cursor: pointer;
      height: 34px;
      line-height: 34px;
      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
      .right {
        text-align: right;
      }
    }
  }
}
</style>
