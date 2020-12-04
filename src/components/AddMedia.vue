<template>
  <div class="AddMedia">
    <CtrlPanel :split-line="true" class="bottom-sidebar">
      <template v-slot:title>
        <span class="f16">新建节目</span>
        <span class="f16 goBackList" @click="goBackList">
          <i class="iconfont iconangle-left"></i>节目列表
        </span>
      </template>
      <template v-slot:content>
        <div class="content">
          <a-row class="inputName arow">
            <a-col :span="3" class="leftPart">节目名称：</a-col>
            <a-col :span="20" class="rightPart">
              <input type="text" placeholder="在这里输入" />
              <div>
                <div class="widthBox">
                  <span>宽</span>
                  <input type="text" class="inputW" />
                </div>
                <div class="heightBox">
                  <span>高</span>
                  <input type="text" class="inputH" />
                </div>
              </div>
            </a-col>
          </a-row>
          <a-row class="uploadImg arow">
            <a-col :span="3" class="leftPart">选择媒体：</a-col>
            <a-col :span="20" class="rightPart">
              <a-upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                :fileList="fileList"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div v-if="fileList.length < 3">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel" okText='确定'
              cancelText='取消'>
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </a-col>
          </a-row>
          <a-row class="inputDes arow">
            <a-col :span="3" class="leftPart">文字内容：</a-col>
            <a-col :span="20" class="rightPart">
              <textarea name id cols="30" rows="10"></textarea>
            </a-col>
          </a-row>
          <div class="btnGroup">
            <span class="save">保存</span>
            <span class="cancel">取消</span>
          </div>
        </div>
      </template>
    </CtrlPanel>
  </div>
</template>

<script>
import CtrlPanel from "@/components/CtrlPanel.vue";

export default {
  components: {
    CtrlPanel
  },
  props: {
    msg: String
  },
  data() {
    return {
      previewVisible: false,
      previewImage: "",
      fileList: [
        {
          uid: "-1",
          name: "xxx.png",
          status: "done",
          url:
            "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        }
      ]
    };
  },
  methods: {
    handleCancel() {
      this.$data.previewVisible = false;
    },
    handlePreview(file) {
      this.$data.previewImage = file.url || file.thumbUrl;
      this.$data.previewVisible = true;
    },
    handleChange({ fileList }) {
      this.$data.fileList = fileList;
    },
    goBackList() {}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.AddMedia {
  margin: 0 auto;
  font-size: 14px;
  color: #ddfdff;
  //overwrite Component style
  .bottom-sidebar {
    height: 434px;
    width: calc(100% - 20px);
    .goBackList {
      float: right;
      font-size: 14px;
      margin-right: 20px;
      color: #97e9ff;
      cursor: pointer;
    }
  }

  .ant-upload-list-item {
    .ant-upload-list-item-done {
      border: 2px solid rgba(152, 254, 255, 0.5);
    }
  }
  //overwrite Component style

  .content {
    padding: 26px;
    height: 330px;
    .arow {
      width: 100%;
      margin-bottom: 15px;
    }
    input,
    textarea {
      border: 1px solid rgba(28, 102, 162, 0.8);
      border-radius: 3px;
      background: none;
    }

    .inputName {
      .rightPart {
        height: 32px;
        line-height: 32px;
        input:nth-child(1) {
          width: 60%;
          margin-right: 50px;
        }
        & > div {
          // display: inline-block;
          width: calc(40% - 50px);
          float: right;
          & > div {
            width: 50%;
          }
          .inputW {
            margin-right: 32px;
          }
          .inputW,
          .inputH {
            width: 74%;
            margin-left: 15px;
          }
          .widthBox {
            float: left;
          }
          .heightBox {
            text-align: right;
            float: right;
          }
        }
      }
    }

    .uploadImg {
      .rightPart {
        padding: 10px;
        height: 155px;
        overflow-y: scroll;
        border: 1px dashed rgba(28, 102, 162, 0.8);
      }
    }
    .inputDes {
      textarea {
        width: 100%;
        height: 59px;
      }
    }

    .btnGroup {
      width: 166px;
      margin: 0 auto;
      span {
        display: inline-block;
        cursor: pointer;
        width: 78px;
        height: 33px;
        line-height: 33px;
        text-align: center;
        border-radius: 0 3px 0 3px;
        &.save {
          margin-right: 10px;
          background: rgba(151, 233, 255, 0.1);
          box-shadow: inset 0 0 3px 0 rgba(59, 249, 251, 0.5);
        }
        &.cancel {
          background: rgba(151, 233, 255, 0.1);
          box-shadow: inset 0 0 3px 0 rgba(59, 249, 251, 0.5);
        }
      }
    }
  }
}
</style>
