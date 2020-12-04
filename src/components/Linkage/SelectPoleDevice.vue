<template>
  <div class="clearfix pt5">
    <a
      href="javascript:;"
      v-for="item in equipmentDOS"
      :key="item.id"
      @click="selectDevice(item)"
      :class="['circle',{active: isSelectedDevice(item.id)}]"
      :title="item.equipmentName"
    >
      <i :class="['iconfont', 'icon'+item.iconfont]"></i>
    </a>
  </div>
</template>
<script>
import utils from "@/utils";
import Pole from "@/api/Pole.js";
import baseMixin from "@/mixins/base.js";

const pole = new Pole();

export default {
  mixins: [baseMixin],
  props: {
    poleId: {
      type: String,
      required: true
    },
    maxCount: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      queryObj: {
        id: this.poleId || '',
      },
      poleInfoDO: {},
      equipmentDOS: [],
      selectedDevice: []
    };
  },
  created() {
    this.loadPoleInfo();
  },
  watch: {
    poleId: function(newVal, oldVal) {
      // debugger;
      if (newVal === oldVal) {
        return;
      }
      this.queryObj.id = this.poleId;
      this.loadPoleInfo();
    }
  },
  methods: {
    async loadPoleInfo() {
      if (!this.queryObj.id || this.queryObj.id === "undefined") {
        return;
      }
      try {
        let res = await pole.findBindings(this.queryObj);
        if (res.code != "200") {
          this.poleInfoDO = {};
          this.equipmentDOS = [];
          return;
        }
        this.poleInfoDO = res.data.poleInfoDO;
        this.equipmentDOS = res.data.equipmentDOS;
        this.equipmentDOS.forEach(item => {
          item.iconfont = utils.getDeviceIconByType(item.equipmentType);
          return item;
        });
        this.$emit("loadedPoleInfo", this.poleInfoDO);
      } catch (err) {
        this.$message.error(err.toString());
      }
    },
    selectDevice(item) {
      const index = this.selectedDevice.indexOf(item);
      if (index > -1) {
        this.selectedDevice.splice(index, 1);
        return;
      }
      if (this.maxCount === 1) {
        this.selectedDevice.splice(0, 1);
      }
      if (this.selectedDevice.length >= this.maxCount) {
        this.$message.warning("最多只能选择两个设备进行关联");
        return;
      }
      this.selectedDevice.push(item);
      this.$emit("selectedDevice", this.selectedDevice);
    },
    isSelectedDevice(id) {
      const res = this.selectedDevice.filter(item => {
        return item.id === id;
      });
      return res.length > 0;
    }
  }
};
</script>