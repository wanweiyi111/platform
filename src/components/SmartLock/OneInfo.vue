<template>
    <CtrlPanel :split-line="false" class="OneInfoBox">
        <dt slot="title">{{this.curObj.equipmentName}} 
            <a-switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              class="ml10"
              v-model="onOff"
              @change="setOnOff"
            />
        </dt>
        <dd slot="content">
            <a-row>
                <a-col :span="12">
                    <a-row>
                        <a-col :span="10" class="_title">联网状态</a-col>
                        <a-col :span="14" class="text">{{this.curObj.networkState|formatNetworkState}}</a-col>
                    </a-row>
                </a-col>
                <a-col :span="12">
                    <a-row>
                        <a-col :span="10" class="_title">安装位置</a-col>
                        <a-col :span="14" class="text">{{this.curObj.location}}</a-col>
                    </a-row>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12">
                    <a-row>
                        <a-col :span="10" class="_title">归属灯杆</a-col>
                        <a-col :span="14" class="text">{{this.curObj.lightPoleInformation}}</a-col>
                    </a-row>
                </a-col>
                <a-col :span="12">
                    <a-row>
                        <a-col :span="10" class="_title">设备状态</a-col>
                        <a-col :span="14" class="text">{{this.curObj.equipmentStatus|formatEquipmentStatus}}</a-col>
                    </a-row>
                </a-col>
            </a-row>
        </dd>
    </CtrlPanel>
</template>

<script>
    import CtrlPanel from "@/components/CtrlPanel.vue";
    import CApi from "@/api/Pole";
    import _ from "lodash";
    import baseMixin from "@/mixins/base.js";

    let api = new CApi();
    const deviceType = [{
            title: "设备类型",
            dataIndex: "equipmentType",
            key: "equipmentType"
        },
        {
            title: "设备名称",
            dataIndex: "equipmentName",
            key: "equipmentName"
        },
        {
            title: "设备状态",
            dataIndex: "equipmentStatus"
        },
        {
            title: "亮度",
            dataIndex: "brightness"
        },
        {
            title: "开关状态",
            dataIndex: "onOff"
        },
        {
            title: "安装时间",
            dataIndex: "installationTime",
            key: "installationTime"
        }
    ];
    export default {
        mixins: [baseMixin],
        components: {
            CtrlPanel
        },
        props: {
            bottomSpan: Object,
            curObj: Object
        },

        data() {
            return {
                onOff:false,
                deviceType,
            };
        },
        created() {
        },
        computed: {},
        methods: {
            async loadList(type, opt, val) {
                let _opt = Object.assign({
                        projectId: this.projectId
                    },
                    opt
                );
                let res = await api[type](_opt).catch(err => {
                    console.log(err);
                });
                this[val] = res.data.list;
            },
            setOnOff(){
                // console.log(this.curObj)
            }
        }
    };
</script>

<style lang="less">
    .OneInfoBox {
        position: absolute;
        right: 0;
        bottom: 10px;
        color: #ddfdff;
        font-size: 7px;
        width: 100%;
        min-height: 360px;
        padding: 10px;
        ._title{
            color: #BACEE4;
        }
        .text{
            vertical-align: middle;
            color: #DDFDFF;
            text-indent: 0.5em;
        }
    }
</style>