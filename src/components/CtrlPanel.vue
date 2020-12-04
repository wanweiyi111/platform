<template>
  <dl class="ctrl-panel">
    <slot name="title" v-if="hideTitle !== true" v-bind:class="classObject"></slot>
    <slot name="content"></slot>
  </dl>
</template>

<script>
export default {
  name: "CtrlPanel",
  props: {
    splitLine: {
      type: Boolean,
      default: false
    },
    hideTitle: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classObject: function() {
      return { "split-line": true};
    }
  },
  created() {
    // console.log("splitLine", this.splitLine);
  }
};
</script>
