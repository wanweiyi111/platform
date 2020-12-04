<template>
  <div class="login-page">
    <div class="login-form">
      <div class="titleBox">
        <img
          :src="logoImg"
          class="logo"
          alt="logo"
        />
        <span>智慧灯杆管理系统</span>
      </div>
      <a-form :form="form">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="用户名"
        >
          <a-input
            v-decorator="[
          'username',
          {rules: [{ required: true, message: '请输入用户名' }]}
        ]"
            placeholder="请输入用户名"
            maxlength="30"
          />
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="密码"
          class="mb10"
        >
          <a-input
            type="password"
            v-on:keydown.enter="login"
            v-decorator="[
          'password',
          {rules: [{ required: true, message: '请输入密码' }]}
        ]"
            placeholder="请输入密码"
            maxlength="20"
          />
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="验证码"
          class="mb15"
        >
          <a-row>
            <a-col :span="17">
              <a-input
                v-on:keydown.enter="login"
                v-decorator="[
          'code',
          {rules: [{ required: true, message: '请输入图片上的验证码' }]}
        ]"
                placeholder="请输入图片上的验证码"
                maxlength="6"
              />
            </a-col>
            <a-col
              :span="7"
              class="ar"
            >
              <a
                href="javascript:;"
                @click="refreshTS"
              >
                <img
                  :src="'/api/token/logon/getVerificationCode?t='+timestamp"
                  style="height:32px;"
                  alt
                />
              </a>
            </a-col>
          </a-row>
        </a-form-item>
        <a-row>
          <a-col :span="6"></a-col>
          <a-col
            :span="16"
            class="ac"
          >
            <a-button
              type="primary"
              size="default"
              @click="login"
              :disabled="loading"
            >登录</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div
      class="canvaszz"
      :style="{height: screenHeight+'px'}"
    ></div>
    <canvas
      :id="starsId"
      :style="{height: screenHeight+'px'}"
    ></canvas>
    <div class="footer">2020 华智有为 版权所有</div>
  </div>
</template>

<script>
import "animate.css";
import Power from "@/api/PowerManager.js";
import Stars from "@/utils/starsCanvas.js";
import logo from "@/assets/console/huazhi-logo-110px.svg";
import { mapState, mapMutations } from "vuex";

const power = new Power();

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

export default {
  components: {},
  props: {},
  data() {
    return {
      formItemLayout,
      form: this.$form.createForm(this),
      timestamp: new Date().getTime(),
      loading: false,
      starsId: "starts",
      screenHeight: window.innerHeight, // 屏幕高度
      logoImg: logo,
    };
  },
  watch: {
    screenHeight: function (val) {
      // 监听屏幕高度变化
      var oIframe = document.getElementById("login");
      oIframe.style.height = Number(val) + "px"; // '120'是页面布局调整，可去除
    },
  },
  created() {
    sessionStorage.removeItem("permissions");
  },
  mounted() {
    Stars(this.starsId, 230, 1000, 60, 2, 500000, 0.8);
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    ...mapMutations(["setloginInfo"]),
    async login(e) {
      e.preventDefault();
      this.loading = true;
      this.form.validateFields(async (error, values) => {
        // debugger;
        if (error) {
          return;
        }
        try {
          let res = await power.login(values);
          if (res.code !== "200") {
            this.loading = false;
            this.$message.warning(res.msg);
            return;
          }
          this.setloginInfo(res.data);
          sessionStorage.setItem("loginData", JSON.stringify(res.data));
          this.$message.success(res.msg || "登录成功");
          this.loading = false;
          this.$router.replace("/");
        } catch (err) {
          this.loading = false;
          this.$message.error(err);
        }
      });
    },
    refreshTS() {
      this.timestamp = new Date().getTime();
      this.form.resetFields(["code"]);
    },
    starsGo(data) {
      Stars(data);
    },
  },
};
</script>

<style lang="less">
.login-page {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  overflow: hidden;

  .footer {
    width: 100%;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10px;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
  }
}
canvas {
  width: 100%;
  height: auto;
  display: inline-block;
  vertical-align: baseline;
  position: absolute;
  z-index: -1;
}
.canvaszz {
  width: 100%;
  background: url("../assets/login/in_top_bj.png") no-repeat;
  position: absolute;
  z-index: 10;
  filter: alpha(opacity=20);
  -moz-opacity: 0.2;
  -khtml-opacity: 0.2;
  opacity: 0.2;
}

.login-form {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 12;
  transform: translate(-50%, -50%);
  width: 532px;
  padding: 50px 24px;
  box-shadow: 0 0 4px 0 rgba(0, 15, 67, 0.1);
  border-radius: 10px;
  font-size: 20px;
  color: #fff;
  .titleBox {
    font-size: 32px;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -95px;
    left: 0;
    right: 0;
    .logo {
      margin-bottom: 20px;
    }
  }
  &.wide {
    height: 252px;
  }
  .notice {
    color: #ffa1a1;
    i {
      padding-right: 5px;
    }
  }
  .title {
    text-align: right;
    padding-right: 15px;
  }
  input {
    background: #8ad3ff;
    border: 1px solid #93afcf;
    border-radius: 3px;
  }
  button {
    display: block;
    width: 100%;
    height: 45px;
    border-radius: 4px;
    cursor: pointer;
  }
  input {
    color: #011147;
    width: 100%;
    &.active {
      background: #ffa1a1;
    }
  }

  .name,
  .pwd,
  .submit,
  .notice {
    margin-bottom: 20px;
    height: 33px;
    line-height: 33px;
    width: 100%;
  }

  .ant-form-item {
    margin-bottom: 10px;
  }
}
</style>