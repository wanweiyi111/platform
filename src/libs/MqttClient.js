import mqtt from "mqtt";
// import _ from "lodash";
// import Config from "@/config/";

const { MQTT } = window.EnvConfig;

export default class {
  client = null;
  options = {
    connectTimeout: 4000 // 超时时间
    // 认证信息 按自己需求填写
    // clientId: "clientId123456",
    // username: "admin",
    // password: "public"
  };
  connectStatus = false;

  constructor() {
    try {
      this.client = mqtt.connect(`mqtt://${MQTT.ip}:${MQTT.port}/mqtt`, this.options);
      this.client.reconnecting = true;

      this.client.on("reconnect", error => {
        console.log("正在重连:", error);
      });

      this.client.on("error", error => {
        this.connectStatus = false;
        console.log("连接失败:", error);
      });

      this.client.on("connect", this.connected.bind(this));

      /* //监听mqtt的返回
      this.client.on("message", function (topic, message, packet) {
        console.log('mqtt msg:', topic, message, packet)
        topic = topic.toLowerCase();
        if (topic in this && _.isFunction(this[topic])) {
          this[topic](message, packet);
        }
      }); */
    } catch (err) {
      console.info(err);
    }
  }

  connected() {
    console.info("mqtt已连接");

    this.connectStatus = true;
    //订阅一个主题
    this.client.subscribe("Exception/+", { qos: 0 }, (err) => {
      if (!err) {
        this.client.publish("published", "Hello World from web");
      }
      console.info('Exception/+ 订阅成功');
    });

    this.client.subscribe('Operation/Callback', { qos: 0 }, err => {
      if (!err) {
        this.client.publish("published", "Operation callback");
      }
      console.info('Operation/Callback 订阅成功');
    })
  }

  publish(topic, content) {
    this.client.publish(topic, content);
  }

  exception() {

  }
}