<template>
  <a-row class="Demand">
    <a-col
      :span="17"
      id="LeftVideo"
    >
      <a-table
        class="Application_table"
        :columns="columns"
        :dataSource="playList"
        :rowKey="record => record.id"
      >
        <span
          class="play"
          slot="operation"
          slot-scope="text,record"
          @click="playVideo(record)"
        >
          <i class="iconfont iconplay"></i>
        </span>
      </a-table>
    </a-col>
    <a-col :span="7">
      <RightCtrl :getPlayback="getPlayback" />
    </a-col>
    <a-modal
      class="application_modal"
      title="查看"
      :visible="playerVisiable"
      :footer="null"
      @cancel="handleCancel"
      :width="600"
      :afterClose="afterClose"
    >
      <div class="ac">
        <!-- <video
          controls
          autoplay
          muted
          preload="auto"
          width="400"
          height="400"
          class="img-fluid"
        >
          <source
            :src="selectedPlayback.src"
            type="video/mp4"
          />
        </video> -->
        <!-- <video :src="selectedPlayback.src"></video> -->
        <RecordVideo
          :videoInfo="selectedPlayback"
          id="record"
          :videoHeight=350
        />
      </div>
    </a-modal>
  </a-row>
</template>

<script>
import RecordVideo from "@/components/common/RecordVideo.vue";
import RightCtrl from "./RightCtrl.vue";
const columns = [
  {
    title: "开始时间",
    dataIndex: "strStartTime",
    key: "strStartTime",
  },
  {
    title: "结束时间",
    dataIndex: "strEndTime",
    key: "strEndTime",
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  components: {
    RecordVideo,
    RightCtrl,
  },
  props: {
    type: String,
  },
  data() {
    return {
      columns,
      selectedPlayback: {},
      playerVisiable: false,
      playList: [],
    };
  },
  created() {},
  computed: {},
  methods: {
    afterClose() {
      console.log("关闭之后");
    },
    handleCancel() {
      this.playerVisiable = false;
    },
    getPlayback(item) {
      this.playList = item;
    },
    playVideo(item) {
      this.playerVisiable = true;
      this.selectedPlayback = item;
      for (let i in this.playList) {
        if (item.id == this.playList[i].id) {
          this.selectedPlayback.src = this.playList[i].strPath;
        }
      }
    },
  },
};
</script>

<style lang="less">
.playBox {
  video {
    width: 100%;
    margin: 0 auto;
  }
}
.Demand {
  .play {
    cursor: pointer;
  }
}
</style>
