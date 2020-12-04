<template>
  <div class="ac pt15">
    <audio
      width="100%"
      controls
      :src="audioInfo.url+ '&token=' + token"
      type="audio/mp3"
    >
      您的浏览器不支持 audio 元素。
    </audio>
  </div>
</template>

<script>
export default {
  props: {
    audioValue: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      token: sessionStorage.getItem("token"),
    };
  },
  computed: {
    audioInfo() {
      return this.audioValue;
    },
  },
  created() {},
  methods: {},
};
</script>
<style lang="less" scoped>
audio {
  width: 100%;
  height: 54px;
}
</style>