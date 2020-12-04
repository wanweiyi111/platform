<template>
  <a-row>
    <a-col :span="24">
      <Breadcrumb />
      <router-link
        class="fr font14 white1"
        style="margin-top:-30px;margin-bottom:30px"
        to="/application-manage/display?tabKey=2"
      >&lt; 返回媒体列表</router-link>
    </a-col>
    <a-col :span="24">
      <div class="application_from">
        <a-row
          type="flex"
          justify="start"
          align="top"
        >
          <a-col :span="24">
            <a-upload-dragger
              class="application_upload"
              name="files"
              accept="image/png, image/jpeg, audio/*, video/*"
              :multiple="true"
              :defaultFileList="fileList"
              @handleChange="uploadChange"
              :remove="remove"
              :action="actionUrl"
              :headers="token"
              style="display:block;"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">点击上传 或者 拖拽图片，视频到这里，支持 png, jpeg, gif, mp4格式</p>
            </a-upload-dragger>
          </a-col>
        </a-row>
        <div class="mar-y10 ac">
          <a-button
            type="primary"
            @click="ok"
          >返回</a-button>
        </div>
      </div>
    </a-col>
  </a-row>

</template>
<script>
import Display from "@/api/Display.js";
import baseMixin from "@/mixins/base.js";
import Breadcrumb from "@/components/common/NewBreadcrumb.vue";

const display = new Display();

export default {
  mixins: [baseMixin],
  name: "DisplayUpload",
  components: {
    Breadcrumb,
  },
  data() {
    return {
      fileList: [],
      actionUrl: "",
      token: { Authentication: sessionStorage.getItem("token") },
    };
  },
  created() {
    this.actionUrl = `/api/screen/media/file/upload/${this.projectId}`;
  },
  methods: {
    uploadChange(fileList) {
      let info = fileList;
      // this.uploadData(fileList.fileList);
      if (info.file.status !== "uploading") {
        this.$message.success("上传成功");
      }
    },
    // async uploadData(data) {
    //   data.push({ projectId: this.projectId });
    //   const formData = new FormData();
    //   data.forEach(file => {
    //     if (file.projectId) {
    //       formData.append("projectId", file.projectId);
    //     } else {
    //       formData.append("files[]", file);
    //     }
    //   });
    //   console.log(formData, "=============");
    //   let res = await api.uploadMedia(formData).catch(err => {
    //     console.log(err);
    //   });
    //   if (_.isEmpty(res) || res.code !== "200") {
    //     return;
    //   }
    // },
    beforeUpload() {
      // console.log(fileList);
    },
    async remove(file) {
      return new Promise(async (resolve, reject) => {
        console.log("remove", file);
        const res = await display
          .mediaRemove({
            list: [file.response.data.mediaId],
          })
          .catch((err) => {
            console.log(err);
            reject(false);
          });
        if (res.code === "200") {
          this.$message.success("删除成功");
          resolve(true);
        } else {
          this.$message.error(res.msg || "删除失败");
          reject(false);
        }
      });
    },
    ok() {
      this.$router.push("/application-manage/display?tabKey=2");
    },
  },
};
</script>
<style lang="less">
</style>
