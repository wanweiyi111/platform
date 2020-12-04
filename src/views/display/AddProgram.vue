<template>
  <a-row>
    <a-col :span="24">
      <Breadcrumb :modifyTitle="modelTitle" />
      <router-link
        class="fr font14 white1"
        style="margin-top:-30px;margin-bottom:30px"
        to="/application-manage/display?tabKey=3"
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
            <a-col :span="12">
              <div class="leftPart showE">显示环境信息</div>
              <div class="rightPart rightSW">
                <a-switch
                  :checked="display"
                  @change="changeMedia"
                />
              </div>
            </a-col>
          </a-row>
          <a-row class="arow baseInfo">
            <a-col :span="12">
              <div class="leftPart">宽和高</div>
              <div class="rightPart">
                <span class="widthBox">
                  <span class="width">宽</span>
                  <a-input
                    placeholder
                    v-model="width"
                  />
                </span>
                <span class="heightBox">
                  <span class="height">高</span>
                  <a-input v-model="height" />
                </span>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="leftPart location">位置</div>
              <div class="rightPart">
                <span class="widthBox">
                  <span class="width">横轴</span>
                  <a-input
                    placeholder
                    v-model="x"
                  />
                </span>
                <span class="heightBox">
                  <span class="height">纵轴</span>
                  <a-input
                    placeholder
                    v-model="y"
                  />
                </span>
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
              <draggable
                v-model="mediaList"
                class="rightPart"
              >
                <transition-group>
                  <li
                    v-for="(item,index) in mediaList"
                    v-bind:key="index"
                  >
                    <span class="view">
                      <img
                        v-if="item.type == 2"
                        :src="item.url"
                        class="img-fluid"
                      />
                      <video
                        v-else-if="item.type == 3"
                        controls
                        autoplay
                        class="img-fluid"
                      >
                        <source
                          :src="item.url+ '&token=' + token"
                          type="video/mp4"
                        />
                      </video>
                    </span>
                    <span class="name ellipsis">{{item.mediaName}}</span>
                    <span class="setTime">
                      <a-input
                        placeholder
                        @change="setTime(item,$event)"
                        :defaultValue="item.duration"
                      />秒
                    </span>
                    <span
                      class="delBtn"
                      v-if="index+1 !== mediaList.length"
                      @click="delMedia(index)"
                    >
                      <i class="iconfont icontimes-circle"></i>
                    </span>
                  </li>
                </transition-group>
              </draggable>
            </a-col>
          </a-row>
          <a-row class="arow showpriority">
            <a-col :span="24">
              <div class="leftPart">显示层级</div>
              <div class="rightPart">
                <a-input
                  placeholder
                  v-model="priority"
                />
                <span class="font12 gray pl5">数字越小，显示越在上面</span>
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
          <a-modal
            class="application_modal"
            :visible="showListModal"
            :centered="true"
            width="660"
            height="440"
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
                  <img
                    v-if="item.type == 2"
                    :src="item.url"
                    class="img-fluid"
                  />
                  <video
                    v-else-if="item.type == 3"
                    controls
                    autoplay
                    class="img-fluid"
                  >
                    <source
                      :src="item.url+ '&token=' + token"
                      type="video/mp4"
                    />
                  </video>
                </div>
                <div
                  class="ellipsis bottomPart"
                  :title="item.mediaName"
                >{{item.mediaName}}</div>
              </a>
            </section>
            <a-pagination
              v-model="queryObj.current"
              :total="queryObj.total"
              @change="pageChange"
            />
          </a-modal>
          <a-modal
            class="application_modal"
            :visible="!!previewImage"
            :footer="null"
            @cancel="previewImage=''"
          >
            <img
              alt="example"
              style="width: 100%"
              :src="previewImage"
            />
          </a-modal>
        </a-form>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import _ from "lodash";
import Display from "@/api/Display.js";
import draggable from "vuedraggable";
import baseMixin from "@/mixins/base.js";
import { setTimeout } from "timers";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";

const display = new Display();

export default {
  name: "DisplayProgramCreate",
  mixins: [baseMixin],
  components: {
    draggable,
    Breadcrumb,
  },
  data() {
    return {
      token: sessionStorage.getItem("token"),
      display: true,
      type: 1,
      programId: this.$route.query.programId || "",
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
      modelTitle: "创建节目", // 页面名称
    };
  },
  created() {
    this.programId && this.getInfo();
    let routeQuery = this.$route.query;
    if (routeQuery.modelTitle) {
      this.modelTitle = routeQuery.modelTitle;
    }
  },
  computed: {},

  methods: {
    pageChange(pages) {
      this.setData({ current: pages, pageSize: 10 });
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
        this.mediaList &&
          this.mediaList.map((item, index) => {
            this.mediaList[index].duration = this.mediaList[index].duration
              ? this.mediaList[index].duration
              : "";
            this.mediaList[index].priority = index + 1;
          });
        if (this.programName.length === 0) {
          this.$message.error("请输入节目名字");
          return;
        }
        let opt = {
          programName: this.programName,
          type: this.type,
          display: this.display ? 1 : 0,
          projectId: this.projectId,
          regions: [
            {
              x: this.x,
              y: this.y,
              width: this.width,
              height: this.height,
              priority: this.priority,
              items: this.mediaList,
            },
          ],
        };
        if (this.programId) {
          opt.programId = this.programId;
          opt.regions[0].regionsId = this.regionsId;
          opt.regions[0].programId = this.programId;
        }
        display[url](opt)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success(this.tips);
              setTimeout(() => {
                this.$router.push("/application-manage/display/list?tabKey=3");
              }, 2000);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$router.push("/application-manage/display/list?tabKey=3");
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
        display
          .programAdd(values)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success(this.tips);
              setTimeout(() => {
                this.$router.push("/application-manage/display/list?tabKey=3");
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
    async setData(params) {
      //  let params = `${this.params.current}/${this.params.pageSize}`;
      let res = await display
        .screenMediaQueryList(`${params.current}/${params.pageSize}`, {
          statusCode: 1,
        })
        .catch((err) => {
          console.log(err);
        });
      if (_.isEmpty(res) || res.code !== "200") {
        return;
      }
      // res.data.list.map((item, idx) => {
      //   res.data.list[idx].url = item.url + '&token=' + sessionStorage.getItem('token');
      // })
      this.sourceMediaList = res.data.list;
      this.queryObj.current = res.data.pageNum;
      this.queryObj.total = res.data.total;
    },
    openMediaModal() {
      this.showListModal = true;
      this.setData(this.queryObj);
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
        type: item.type,
        mediaId: item.id,
        mediaName: item.mediaName,
        url: item.url,
        regionsId: item.regionsId,
        // mediaPath: item.filePath + '&token=' + sessionStorage.getItem('token')
        mediaPath: item.filePath,
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
      this.$router.push("/application-manage/display/list?tabKey=3");
    },
    getInfo() {
      let opt = {
        prejectId: this.projectId,
        programId: this.programId,
      };
      display
        .getMediaInfo(opt)
        .then((res) => {
          if (res.code == "200") {
            let data = res.data;
            this.programId = data.programId;
            this.display = data.display ? true : false;
            this.type = data.type;
            this.programName = data.programName;
            this.mediaList = data.regions[0].items;
            this.width = data.regions[0].width;
            this.height = data.regions[0].height;
            this.priority = data.regions[0].priority;
            this.x = data.regions[0].x;
            this.y = data.regions[0].y;
            this.regionsId = data.regions[0].regionsId;
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
    width: 155px;
    height: 136px;
    text-align: center;
    margin: 0 10px 35px 0;
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
      height: 185px;
      border: 1px dashed #93afcf;
      border-radius: 3px;
      padding: 10px;
      overflow-y: scroll;
      li {
        width: 119px;
        height: 165px;
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
          width: 83px;
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
