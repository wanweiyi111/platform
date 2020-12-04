<template>
  <div v-bind:class="this.isWide?'box wide':'box'">
    <div class="header">
      <div class="title">
        {{title}}
        <span style="float: right">{{total}}</span>
        <!-- <span
          style="float: right"
          v-if="mode ==='homeVideo'"
          class="video4"
          @click="showVideo4"
        >四宫格配置</span> -->
      </div>
      <div class="sw_btn" v-if="mode === 'radar'">
        <span class="online">人流量</span>
        <!--span class="warn">速度分布</span-->
      </div>
      <div class="sw_btn" v-else-if="type != 'RightMenu'&&mode !== 'environmental'">
        <span class="online">{{titleArr[titleNum||0][0]}}</span>
        <span class="offline">{{titleArr[titleNum||0][1]}}</span>
        <span class="err">{{titleArr[titleNum||0][2]}}</span>
      </div>
      <!-- <div class="sw_btn" v-if="mode === 'environmental'">
        <a-button-group size="small">
          <a-button type="primary" icon="left" @click="changeContent('left')" />
          <a-button type="primary" icon="right" @click="changeContent('right')" />
        </a-button-group>
      </div>-->
    </div>
    <div class="content">
      <slot></slot>
    </div>
    <a-modal :visible="visible" @cancel="handleCancel" :width="730" @ok="handleOk" okText='确定'
    cancelText='取消'>
      <a-transfer
        :dataSource="mockData"
        :listStyle="{
      width: '300px',
      height: '300px',
    }"
        :targetKeys="targetKeys"
        @change="handleChange"
        :render="renderItem"
      ></a-transfer>
    </a-modal>
  </div>
</template>

<script>
    import baseMixin from "@/mixins/base.js";
    import Media from "@/api/Media.js";
    let media = new Media();
    export default {
        mixins: [baseMixin],
        props: {
            cameraList: Array,
            title: String,
            type: String,
            titleNum: Number,
            freshVideoList: Function,
            mode: String,
            total: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                visible: false,
                isWide: document.body.clientWidth >= 1218 ? true : false,
                titleArr: [
                    ["在线", "离线", "故障"],
                    ["节能量(kw/h)", "亮灯率", "故障率"]
                ],
                modeContent: "left",
                mockData: [],
                targetKeys: [],
                dataList: []
            };
        },
        watch: {
            cameraList: {
                deep: true,
                immediate: true, // 这句重要
                handler(val) {
                    if (val) {
                        this.dataList = val;
                        this.getMock();
                    }
                }
            }
        },
        methods: {
            async handleOk() {
                let opt = {
                    codes: this.targetKeys,
                    projectId: this.projectId
                };
                let res = await media.saveDisplay(opt);
                if (_.isEmpty(res) || res.code !== "200") {
                    return;
                }
                this.$message.success("成功");
                this.visible = false;
                this.freshVideoList();
            },
            handleCancel() {
                this.visible = false;
            },
            showVideo4() {
                this.visible = true;
            },
            changeContent(val) {
                this.$bus.emit("changeMode", val);
            },
            getMock() {
                const targetKeys = [];
                const mockData = [];
                let dataList = this.dataList;
                for (let i = 0; i < dataList.length; i++) {
                    const data = {
                        key: dataList[i].equipmentCode,
                        title: dataList[i].equipmentName
                    };
                    mockData.push(data);
                }
                this.mockData = mockData;
                this.targetKeys = targetKeys;
            },
            renderItem(item) {
                const customLabel = < span class = "custom-item" > {
                    item.title
                } < /span>;

                return {
                    label: customLabel, // for displayed item
                    value: item.title // for title and filter matching
                };
            },
            handleChange(targetKeys, direction, moveKeys) {
                if (targetKeys.length > 4 && direction === "right") {
                    this.$message.error("只能选择四个展示的摄像头");
                    return;
                }
                this.targetKeys = targetKeys;
            }
        }
    };
</script>
<style lang="less">
    .video4 {
        cursor: pointer;
    }
</style>