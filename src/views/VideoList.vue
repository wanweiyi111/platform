<template>
  <section class="ctrl-video-list">
    <CtrlPanel class="bottom-sidebar" :splitLine="true">
      <dt slot="title" class="split-line">
        安防清单
        <div class="toBack">
          <a href="/ctrl/camera" class="toCamera">
            <i class="iconfont iconangle-left"></i>
            安防列表
          </a>
        </div>
      </dt>
      <dd slot="content" class="pd-x20">
        <a-row class="videoBox">
          <a-col :span="6" v-for="(item, index) in videoList" :key="index" class="videoItem">
            <Video :id="'homeVideo'+index" />
            <p class="ellipsis">{{item.equipmentName}}</p>
          </a-col>
        </a-row>
      </dd>
    </CtrlPanel>
  </section>
</template>

<script>
import _ from "lodash";
import Camera from "@/api/Camera.js";
import { mapActions, mapGetters } from "vuex";
import utils from "@/utils/";
import Unions from "@/api/Unions.js";
import MapMixin from "@/mixins/map.js";
import baseMixin from "@/mixins/base.js";
import CtrlPanel from "@/components/CtrlPanel.vue";
import Video from "@/components/common/Video.vue";

const unions = new Unions();
let camera = new Camera();

export default {
  name: "linkage",
  mixins: [baseMixin, MapMixin],
  components: {
    CtrlPanel,
    Video
  },
  data() {
    return {
      pageInfo: { current: 1, pageNum: 1, pageSize: 10 },
      linkList: [],
      curRule: {},
      videoList: []
    };
  },
  computed: {
    ...mapGetters(["poleList"]),
    type() {
      return _.isEmpty(this.curRule) ? "1" : this.curRule.rule.type;
    }
  },
  created() {
    this.loadAllDevice();
    this.loadPageDevice();
    this.loadVideoList();
  },
  methods: {
    ...mapActions(["loadAllPoles"]),
    async loadAllDevice() {
      try {
        // let res = await pole.findByProjectId(this.queryObj);
        if (_.isEmpty(this.poleList)) {
          this.loadAllPoles(this.queryObj).then(() => {
            this.createMarks();
          });
        } else {
          this.createMarks();
        }
      } catch (err) {
        console.info(err);
      }
    },

    createMarks() {
      this.setMapMarks(this.poleList, 'pole');
    },
    async loadPageDevice() {
      try {
        // debugger;
        let res = await unions.queryList(this.queryObj, this.pageInfo);
        if (res.code != 200) {
          return;
        }
        this.linkList = res.data.list.map(item => {
          item.type = utils.getLinkageTypeText(item.type);
          item.status = utils.getLinkageStatusText(item.status);
          return item;
        });
        this.pageInfo.current = res.data.pageNum;
        this.pageInfo.pageNum = res.data.pageNum;
        this.pageInfo.pageSize = res.data.pageSize;
      } catch (err) {
        console.log(err);
      }
    },
    async loadVideoList() {
      let opt = {
        codeList: [
          "1020-f82d132f9bb018ca-2004-ffff-ed35",
          "A013",
          "A014",
          "A015",
          "A016",
          "A017",
          "A018",
          "A019",
          "A020",
          "A021",
          "A022",
          "A023",
          "A024",
          "A025",
          "A026",
          "A027"
        ]
      };
      let res = await camera.findStreamUrl(opt).catch(err => {
        console.log(err);
      });
      if (res.code === "200") {
        this.videoList = res.data;
      }
    }
  }
};
</script>
<style lang="less">
.ctrl-video-list {
  .videoBox {
    margin-top: 20px;
    .videoItem {
      margin-bottom: 10px;
      p {
        color: #98feff;
      }
    }
  }
  .bottom-sidebar.ctrl-panel {
    height: calc(100% - 100px) !important;
    dd.pd-x20 {
      overflow-y: scroll;
    }
    .toBack {
      float: right;
      .toCamera {
        color: #98feff;
        float: right;
      }
    }
  }
}
</style>