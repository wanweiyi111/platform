<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle" class="BottomMenu">
      <a-col
        :span="6"
        class="acolContainer"
        v-for="(item,index) in ChartOpt"
        :key="index"
      >
        <EchartCategory
          :Xaxis="item.Xaxis"
          :disVal="item.disVal"
          :chartText="item.chartText"
          :chartBoxId="index+'lingt'"
          :showTime="true"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import EchartCategory from "@/components/common/EchartCategory.vue"; // @ is an alias to /src

export default {
  components: {
    EchartCategory
  },
  props: {
    ChartOpt: Array
  },

  data() {
    return {
      cowLenth: this.ChartOpt.length
    };
  },

  created() {}
};
</script>

<style lang="less">
.BottomMenu {
}
</style>
