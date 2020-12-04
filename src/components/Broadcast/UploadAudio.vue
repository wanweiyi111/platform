<template>
  <a-row>
    <a-row>
      <a-col :span="5">上传：</a-col>
      <a-col :span="19">
        <a-upload-dragger
          class="application_upload"
          name="files"
          accept="audio/*"
          :defaultFileList="defaultList"
          @change="uploadChange"
          :showUploadList="false"
          :action="actionUrl"
          :headers="token"
          style="display:block;"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="font14">点击上传 或者 拖拽音频，支持 mp3格式</p>
        </a-upload-dragger>
      </a-col>
    </a-row>
    <a-row class="mt10">
      <a-col :span="5">已上传文件：</a-col>
      <a-col :span="19">
        <template v-if="defaultList.length>0">
          <div
            v-for="(item,index) in defaultList"
            :key="index"
          >
            <div
              class="application-upload clearfix mb10"
              v-if="currenFile.uid !== item.uid || currenFile.status !=='uploading'"
            >
              <div class="fl">
                <a-icon type="customer-service" />
              </div>
              <div
                class="fl pl5"
                style="width:325px;"
              >
                <div class="font12">{{item.name}}</div>
              </div>
              <div class="fr">
                <a-icon
                  type="delete"
                  @click="remove(item, index)"
                />
              </div>
            </div>
            <!-- <div
              class="application-upload clearfix mb10"
              v-if="currenFile.uid !==item.uid"
            >
              <div class="fl">
                <a-icon type="customer-service" />
              </div>
              <div
                class="fl pl5"
                style="width:325px;"
              >
                <div class="font12">{{item.name}}</div>
              </div>
              <div class="fr">
                <a-icon
                  type="delete"
                  @click="remove(item, index)"
                />
              </div>
            </div> -->
          </div>
          <div
            class="clearfix mb10"
            v-if="currenFile.status == 'uploading'"
          >
            <div class="fl">
              <a-icon
                type="redo"
                :spin="true"
              />
            </div>
            <div
              class="fl pl5"
              style="width:325px;"
            >
              <div class="font12">{{currenFile.name}}</div>
              <div>
                <a-progress
                  :strokeWidth="2"
                  :percent="currenFile.percent"
                  size="small"
                  status="active"
                />
              </div>
            </div>
          </div>
        </template>
        <div
          class="font12 gray"
          v-else
        >暂未上传文件</div>
      </a-col>
    </a-row>
    <a-row>
      <a-col
        class="ar"
        span="24"
        :style="{ marginTop: '15px' }"
      >
        <a-button @click="handleCancel">
          取消
        </a-button>
      </a-col>
    </a-row>

  </a-row>
</template>

<script>
import _ from "lodash";
import baseMixin from "@/mixins/base.js";
import Broadcast from "@/api/Broadcast";
import { Progress } from "ant-design-vue";
const api = new Broadcast();

export default {
  mixins: [baseMixin],
  components: {
    aProgress: Progress,
  },
  data() {
    return {
      fileList: [],
      defaultList: [],
      fileData: {},
      actionUrl: "",
      uploading: false,
      token: { Authentication: sessionStorage.getItem("token") },
    };
  },
  computed: {
    currenFile() {
      let data = this.fileData.file;
      let obj = {};
      if (data) {
        obj.status = data.status;
        obj.name = data.name;
        obj.uid = data.uid;
        obj.percent = Number(data.percent.toFixed(2));
      }
      return obj;
    },
  },
  created() {
    this.actionUrl = `/api/unions/media/file/upload/${this.projectId}`;
  },
  methods: {
    // 直接上传
    uploadChange(data) {
      let info = data;
      this.fileData = info;
      this.defaultList = info.fileList;
      if (this.fileData.file.status !== "uploading") {
        this.$message.success("上传成功");
      }
    },
    // 直接上传 -- 取消
    handleCancel() {
      this.defaultList = [];
      this.$emit("uploadCancel", this.uploading);
    },
    // 上传
    async upload(params) {
      let res = await api.broadcastMediaFileUpload(this.projectId, params);
      if (res.code !== "200") {
        return;
      }
      this.fileList = [];
      this.uploading = false;
      this.$message.success("upload successfully.");
    },
    // 删除
    async remove(file, indx) {
      return new Promise(async (resolve, reject) => {
        console.log("remove", file);
        const res = await api
          .broadcastMediaRemove({
            list: [file.response.data.mediaId],
          })
          .catch((err) => {
            console.log(err);
            reject(false);
          });
        if (_.isEmpty(res)) {
          this.$message.error(res.msg || "删除失败");
          reject(false);
        } else {
          this.$message.success("删除成功");
          this.defaultList.splice(indx, 1);
          resolve(true);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.application-upload {
  .fr {
    display: none;
  }
  &:hover {
    .fr {
      display: block;
    }
  }
}
</style>
