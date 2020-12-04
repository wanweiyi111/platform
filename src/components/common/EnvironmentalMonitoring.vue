<template>
  <div class="EnvironmentalMonitoring">
    <img
      :src="lightsIcon"
      alt
      id="bgimg"
      style="display:none"
    />

    <a-carousel>
      <div
        v-for="item in environmentData"
        :key="item.id"
      >
        <a-row>
          <a-col :span="24">
            <ul class="envirList envirMani">
              <li style="color:#fbb941">
                <span style="font-size:24px;">
                  {{ item.temperature || 0 }}
                  <i style="font-size:12px;">℃</i>
                </span>
                <span>温度</span>
              </li>
              <li>
                <i
                  class="iconfont iconcloud-sun-rain"
                  style="font-size:58px;"
                  v-if="item.rainfall > 0"
                ></i>
                <span
                  class="iconfont iconsun"
                  style="font-size:60px; color:#fdd872"
                  v-else
                ></span>
              </li>
              <li style="color:#27c64a">
                <span style="font-size:24px;">{{ item.pm25 || 0 }}
                  <i style="font-size:12px;">ug/m³</i>
                </span>
                <span>PM 2.5</span>
              </li>
            </ul>
          </a-col>
          <a-col
            :span="24"
            class="envirLine"
          >
            <a-carousel autoplay>
              <ul class="envirList carouselBox">
                <li>
                  <span>
                    <span
                      class="iconfont iconzaoyin"
                      style="font-size:12px;"
                    ></span>
                    <span>噪音</span>
                  </span>
                  <span style="font-size:24px;">{{ item.noise || 0 }}</span>
                  <span>dB/A</span>
                </li>
                <li>
                  <span>
                    <span
                      class="iconfont iconraindrops"
                      style="font-size:12px;"
                    ></span>
                    <span>雨量</span>
                  </span>
                  <span style="font-size:24px;">{{ item.rainfall || 0 }}</span>
                  <span>mm</span>
                </li>
                <li>
                  <span>
                    <span
                      class="iconfont icondewpoint"
                      style="font-size:12px;"
                    ></span>
                    <span>湿度</span>
                  </span>
                  <span style="font-size:24px;">{{ item.humidity || 0 }}</span>
                  <span>%</span>
                </li>
                <li>
                  <span>
                    <span
                      class="iconfont iconPM"
                      style="font-size:12px;"
                    ></span>
                    <span>PM10</span>
                  </span>
                  <span style="font-size:24px;">{{ item.pm10 || 0 }}</span>
                  <span>ug/m³</span>
                </li>
              </ul>
              <ul class="envirList carouselBox">
                <li>
                  <span>
                    <span
                      class="iconfont iconqiya"
                      style="font-size:12px;"
                    ></span>
                    <span>气压</span>
                  </span>
                  <span style="font-size:24px;">{{ item.pressure || 0 }}</span>
                  <span>h/Pa</span>
                </li>
                <li>
                  <span>
                    <span
                      class="iconfont iconwind"
                      style="font-size:12px;"
                    ></span>
                    <span>风速</span>
                  </span>
                  <span style="font-size:24px;">{{ item.windSpeed || 0 }}</span>
                  <span>m/s</span>
                </li>
                <li>
                  <span>
                    <span
                      class="iconfont iconwind"
                      style="font-size:12px;"
                    ></span>
                    <span>风向</span>
                  </span>
                  <span style="font-size:24px;">{{ item.windDirection || 0 }}°</span>
                  <!-- <span>m/s</span> -->
                </li>
              </ul>
            </a-carousel>
          </a-col>
        </a-row>

      </div>
    </a-carousel>
  </div>
</template>

<script>
import lightsIcon from "@/assets/images/lightBar.jpg";
import { Carousel } from "ant-design-vue";

export default {
  components: {
    aCarousel: Carousel,
  },
  props: {
    environmentData: Array,
  },
  data() {
    return {
      lightsIcon: lightsIcon,
    };
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="less">
.envirLine {
  border-top: 1px solid #44538e;
  padding-top: 5%;
}
.envirList {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #fff;
  li {
    width: 30%;
    display: flex;
    flex-direction: column;
    text-align: center;
    .iconfont {
      padding-right: 5px;
    }
  }
}
.carouselBox {
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: center;
  li {
    float: left;
    width: 25%;
  }
}

.envirMani {
  padding: 2% 0;
}
</style>
