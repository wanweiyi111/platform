<template>
  <div class="warning">
    <!-- <span class="num">
      <i class="iconfont iconbell"></i>
      {{alertQueue.length}}
    </span>
    <CtrlPanel :class="['warning-box', {show: isShowAlert}]" :split-line="true">
      <dt slot="title">
        告警信息
        <router-link to="/ctrl/warning" class="fr font14 mr15">全部 &gt;</router-link>
      </dt>
      <dd slot="content" class="warn-table">
        <a-table
          :columns="alertColumns"
          rowKey="code"
          :dataSource="alertQueue"
          :pagination="false"
          :bordered="false"
          :showHeader="false"
          size="middle"
        >
          <template slot="msg" slot-scope="text, record">
            <span
              :class="{'red2': record.level === 'error', orange: record.level === 'warning'}"
            >[{{record.levelText}}]</span>
            {{record.msg||"未定义"}}
          </template>
          <template slot="time" slot-scope="text, record">{{record.timeStamp | fromNow}}</template>
        </a-table>
      </dd>
    </CtrlPanel>-->
    <div
      class="alertBox"
      @click="goAlarm"
    >
      <div class="alertTitil">
        <a-badge
          :count="alertQueue.length"
          :overflow-count="99"
          title="告警提示"
        >
          <i class="iconfont iconbell"></i>
        </a-badge>
      </div>
      <div
        class="alertList"
        v-if="alertQueue.length>0"
      >
        <a-carousel autoplay>
          <div
            v-for="(item,index) in alertQueue"
            :key="index"
            class="alertItem"
          >
            <i class="level">[{{item.levelText}}]</i>
            {{item.msg}} - {{item.timeStamp | fromNow}}
            <!-- {{item.msg}} - {{item.timeStamp | fromNow}} -->
          </div>
        </a-carousel>
      </div>
      <div
        class="alertList"
        v-else
      >暂无告警信息！</div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import { mapGetters, mapMutations } from "vuex";
import MqttClient from "@/libs/MqttClient.js";
import utils from "@/utils";
import { Carousel, Badge } from "ant-design-vue";

const SessionKey = "WarningList";
let timer = null;

export default {
  data() {
    return {
      alertColumns: [
        {
          title: "标题",
          dataIndex: "msg",
          scopedSlots: { customRender: "msg" },
        },
        {
          title: "时间",
          dataIndex: "timestamp",
          scopedSlots: { customRender: "time" },
        },
      ],
      isShowAlert: false,
    };
  },
  components: {
    ACarousel: Carousel,
    aBadge: Badge,
  },
  computed: {
    ...mapGetters(["alertQueue"]),
  },
  created() {
    if (this.alertQueue.length === 0) {
      let queue = sessionStorage.getItem(SessionKey);
      if (_.isString(queue) && queue.length > 0) {
        try {
          queue = JSON.parse(queue);
        } catch (err) {
          console.info(err);
        }
      }
      if (_.isArray(queue) && queue.length > 0) {
        this.pushAlertQueue(queue);
      }
    }
    const mqtt = new MqttClient();
    const client = mqtt.client;

    client.on("message", this.message.bind(this));
  },
  methods: {
    ...mapMutations(["pushAlertQueue"]),
    message(topic, message, packet) {
      // debugger;
      if (topic.indexOf("Exception") === -1) {
        return;
      }
      let msgObj = JSON.parse(packet.payload.toString());

      if (!msgObj.msg) {
        // console.warn('收到未定义消息', msgObj);
        return;
      }
      msgObj.levelText = utils.getWarningFaultTypeText(msgObj.level);
      this.pushAlertQueue(msgObj);
      sessionStorage.setItem(SessionKey, JSON.stringify(this.alertQueue));
      console.log("告警信息", this.alertQueue);
      // this.showAlert();
    },
    goAlarm() {
      this.$router.push({ path: "/application-manage/alarm" });
    },
    showAlert() {
      this.isShowAlert = true;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.isShowAlert = false;
      }, 3000);
    },
  },
};
</script>
<style lang="less" scoped>
</style>