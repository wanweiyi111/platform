<template>
  <a-row>
    <a-col :span="24">
      <Breadcrumb />
      <router-link
        class="fr font14 white1"
        style="margin-top:-30px;margin-bottom:30px"
        to="/application-manage/broad-cast?tabKey=3"
      >&lt; 返回节目列表</router-link>
    </a-col>
    <a-col :span="24">
      <div class="ProgrameCteate">
        <a-form
          class="application_from ant-advanced-search-form"
          :form="form"
          layout="inline"
        >
          <a-row class="arow">
            <a-col
              :span="12"
              class="inputName"
            >
              <div class="leftPart">节目名称</div>
              <div class="rightPart">
                <a-input
                  placeholder
                  v-model="programName"
                />
              </div>
            </a-col>
          </a-row>
          <a-row class="arow chooseMedia">
            <a-col :span="12">
              <div class="leftPart">添加内容</div>
              <span @click="openMediaModal">
                <a-icon
                  type="plus"
                  class="pr5"
                />选择媒体
              </span>
            </a-col>
          </a-row>
          <a-row class="arow addMedia">
            <a-col :span="24">
              <div class="leftPart">已添加媒体</div>
              <div class="rightPart">
                <a-table
                  class="Application_table"
                  :columns="columnsMedio"
                  :dataSource="mediaList"
                  :rowKey="record => record.id"
                  :pagination="false"
                  :scroll="{y:500}"
                >
                  <template
                    slot="duration"
                    slot-scope="text, record"
                  >{{record.length}} 秒</template>
                  <div
                    slot="action"
                    slot-scope="text, record, index"
                    class="action_btn"
                    v-if="index+1 !== mediaList.length"
                  >
                    <a-tooltip title="删除">
                      <a-icon
                        type="delete"
                        :style="{ paddingLeft: '10px' }"
                        @click="delMedia(index)"
                      />
                    </a-tooltip>
                  </div>
                </a-table>
              </div>
            </a-col>
          </a-row>
          <a-row class="arow btnGroup">
            <a-col
              :span="24"
              class="ac"
            >
              <a-button
                type="primary"
                icon="save"
                @click="operation('save')"
                class="mr5"
              >保存</a-button>
              <a-button
                icon="delete"
                @click="operation('cancel')"
              >取消</a-button>
            </a-col>
          </a-row>

        </a-form>
      </div>
    </a-col>
    <a-modal
      class="application_modal"
      :visible="showListModal"
      width="600"
      okText="确定"
      cancelText="取消"
      @ok="selectDone"
      @cancel="cancelSelect"
    >
      <section class="media-list clearfix">
        <a
          href="javascript:;"
          class="item"
          :class="{selected: item.checkedStatus}"
          v-for="item in sourceMediaList"
          :key="item.id"
          @click="selectMedia(item)"
        >
          <div class="topPart">
            <PlayAudio
              :audioValue="item"
              v-if="item.type == 6"
            />
          </div>
          <div
            class="ellipsis bottomPart"
            :title="item.mediaName"
          >{{item.mediaName}}</div>
        </a>
      </section>
      <a-pagination
        v-if="queryObj.current"
        v-model="queryObj.current"
        :total="queryObj.total"
        @change="pageChange"
      />
    </a-modal>
  </a-row>
</template>

<script>
import _ from "lodash";
import Broadcast from "@/api/Broadcast.js";
import baseMixin from "@/mixins/base.js";
import { setTimeout } from "timers";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";
import PlayAudio from "@/components/Broadcast/PlayAudio.vue";
import { Tooltip } from "ant-design-vue";

const api = new Broadcast();
const columnsMedio = [
  {
    title: "ID",
    dataIndex: "id",
    width: 80,
    align: "center",
    ellipsis: true,
  },
  {
    title: "音频名称",
    dataIndex: "mediaName",
    ellipsis: true,
  },
  {
    title: "音频时长",
    scopedSlots: {
      customRender: "duration",
    },
  },
  {
    title: "操作",
    width: 80,
    scopedSlots: {
      customRender: "action",
    },
  },
];
export default {
  name: "DisplayProgramCreate",
  mixins: [baseMixin],
  components: {
    Breadcrumb,
    PlayAudio,
    aTooltip: Tooltip,
  },
  data() {
    return {
      token: sessionStorage.getItem("token"),
      display: true,
      type: 6,
      programId: "",
      tips: this.$route.query.programId ? "节目修改成功" : "节目创建成功",
      priority: "",
      programName: "",
      x: "",
      y: "",
      width: "",
      height: "",
      queryObj: { current: 1, pageSize: 10, total: 0 },
      form: this.$form.createForm(this),
      sourceMediaList: [],
      mediaList: [],
      previewImage: "",
      showListModal: false,
      colValue: {
        labelCol: { span: 3 },
        wrapperCol: { span: 20 },
      },
      selectMediaStatus: false,
      columnsMedio,
    };
  },
  created() {
    this.programId = this.$route.query.programId || "";
    this.getInfo(this.programId);
    this.programName = this.$route.query.programName || "";
  },
  computed: {},

  methods: {
    pageChange(pages) {
      this.loadAudioData({ current: pages, pageSize: 10 });
    },
    delMedia(index) {
      let _index = index === 0 ? index + 1 : index;
      this.mediaList.splice(index, _index);
    },
    setTime(obj, e) {
      obj.duration = e.target.value;
      this.mediaList &&
        this.mediaList.map((item, index) => {
          if (item.mediaId === obj.mediaId) {
            this.mediaList[index] = obj;
          }
        });
    },
    operation(type) {
      if (type === "save") {
        let url = this.programId ? "modifiedMedia" : "createMedia";
        if (this.programName.length === 0) {
          this.$message.error("请输入节目名字");
          return;
        }
        console.log("url", url);
        let ids = [];
        this.mediaList.forEach((item) => {
          ids.push(item.id);
        });
        let opt = {
          programName: this.programName,
          type: this.type,
          projectId: this.projectId,
          mediaIds: ids,
        };
        if (this.programId) {
          opt.programId = this.programId;
        }
        api[url](opt)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success(this.tips);
              setTimeout(() => {
                this.$router.push(
                  "/application-manage/broad-cast/list?tabKey=3"
                );
              }, 2000);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$router.push("/application-manage/broad-cast/list?tabKey=3");
      }
    },
    async ok() {
      this.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        if (_.isEmpty(this.mediaList)) {
          this.$message.warning("请选择媒体");
          return;
        }
        values.ids = this.mediaList.map((item) => item.response.id);
        api
          .programAdd(values)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success(this.tips);
              setTimeout(() => {
                this.$router.push(
                  "/application-manage/broad-cast/list?tabKey=3"
                );
              }, 2000);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    preview(file) {
      this.previewImage = file.response.url;
    },
    changeMedia(val) {
      this.display = val;
    },
    // 获取音频列表
    async loadAudioData(params) {
      let opt = `${params.current}/${params.pageSize}`;
      let res = await api
        .broadcastMediaQueryList(opt, {
          statusCode: 1,
        })
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      this.sourceMediaList = res.data.list;
      this.queryObj.current = res.data.pageNum;
      this.queryObj.total = res.data.total;
    },
    openMediaModal() {
      this.showListModal = true;
      this.loadAudioData(this.queryObj);
    },
    selectMedia(item) {
      let currentData = item;
      this.sourceMediaList.map((item) => {
        if (currentData.id == item.id) {
          item.checkedStatus = true;
        }
        return item;
      });
      if (this.isMediaSelected(item.id)) {
        return;
      }
      this.mediaList.push({
        type: currentData.type,
        id: currentData.id,
        length: currentData.length,
        mediaName: currentData.mediaName,
      });
    },
    isMediaSelected(id) {
      return this.mediaList.findIndex((item) => item.uid === id) > -1;
    },
    selectDone() {
      this.showListModal = false;
    },
    cancelSelect() {
      // this.mediaList = [];
      this.showListModal = false;
    },
    backToList() {
      this.$router.push("/application-manage/broad-cast/list?tabKey=3");
    },
    getInfo(programId) {
      let params = `${this.projectId}/${programId}`;
      api
        .getMediaInfo(params)
        .then((res) => {
          if (res.code == "200") {
            let data = res.data;
            this.display = data.display ? true : false;
            this.type = data.type;
            this.mediaList = data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.media-list {
  width: 100%;
  height: 100%;
  padding-top: 35px;
  .item {
    float: left;
    width: 210px;
    height: 136px;
    text-align: center;
    margin: 0 25px 35px 0;
    border: 1px solid #3778d3;
    position: relative;

    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    .topPart {
      height: 100%;
      img,
      video {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .bottomPart {
      line-height: 32px;
      color: #fff;
    }
    > .icon-check {
      position: absolute;
      right: 3px;
      top: 3px;
      color: aliceblue;
      display: none;
    }

    &.selected {
      border-color: #fbb941;
      > .icon-check {
        display: block;
      }
    }
  }
}
.ant-form-item {
  width: 100%;
}
.ant-form-item-control-wrapper {
  width: 100% !important;
}
.ProgrameCteate {
  .arow {
    width: 100%;
    margin-top: 15px;
  }
  &.bottom-sidebar {
    height: 600px;
  }
  input {
    height: 32px;
    line-height: 32px;
  }
  .rightPart,
  .leftPart {
    display: inline-block;
    &.leftPart {
      padding-right: 17px;
      width: 20%;
      text-align: right;
      &.showE {
        padding-right: 0;
        text-align: left;
        display: inline-block;
      }
      &.location {
        text-align: left;
      }
    }
    &.rightPart {
      width: 80%;
      vertical-align: top;
      &.rightSW {
        width: 10%;
      }
    }
  }

  .inputName {
    .rightPart {
      vertical-align: middle;
    }
    input {
      width: 328px;
    }
  }
  .baseInfo {
    .rightPart {
      vertical-align: middle;
    }
    input {
      width: 105px;
      margin: 0 15px;
    }
  }
  .chooseMedia {
    span {
      cursor: pointer;
      display: inline-block;
      text-align: center;
      width: 154px;
      height: 32px;
      line-height: 32px;
      border: 1px solid #98feff;
      border-radius: 2px;
      color: #98feff;
    }
  }
  .addMedia {
    .leftPart {
      width: 10%;
    }
    .rightPart {
      min-height: 80px;
      border: 1px dashed #93afcf;
      border-radius: 3px;
      padding: 10px;
      overflow-y: scroll;
      li {
        width: 170px;
        border: 2px solid rgba(152, 254, 255, 0.5);
        float: left;
        margin-left: 10px;
        margin-bottom: 8px;
        font-size: 12px;
        color: #ddfdff;
        padding-bottom: 5px;
        position: relative;
        .delBtn {
          cursor: pointer;
          display: inline-block;
          width: 20px;
          height: 20px;
          position: absolute;
          right: -6px;
          top: -11px;
          color: #ff7373;
          .iconfont {
            border-radius: 50%;
            background-color: #fff;
          }
        }
        input {
          width: 140px;
          height: 28px;
        }
        span {
          padding: 0 5px;
          display: block;
        }
        .view {
          display: inline-block;
          width: 100%;
          height: 71px;
          img,
          video {
            width: 100%;
            height: 71px;
          }
        }
        .name {
          margin: 10px 0;
        }
        .time {
          font-size: 12px;
          color: #bacee4;
        }
      }
    }
  }
  .showpriority {
    .leftPart {
      width: 10%;
    }
    input {
      width: 106px;
    }
  }
  .btnGroup {
    margin: 34px auto;
    // margin-left: 34px 0 0 40%;
  }
}
</style>
