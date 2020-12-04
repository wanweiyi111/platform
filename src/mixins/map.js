import mapApi from "@/libs/MapApi.js";
import _ from 'lodash';

export default {
    data() {
        return {
            hoverDevice: {}
        }
    },
    created() {
        this.clearMarks();
    },
    mounted() {
        this.bindMapEvents();
    },
    methods: {
        getDeviceInfoFromAllById(id) {
            if (!_.isArray(this.allDevice) || this.allDevice.length === 0) {
                console.info('this.allDevice 为空');
                return;
            }
            let item = null;
            for (let i = 0, len = this.allDevice.length; i < len; i++) {
                item = this.allDevice[i];
                if (item.id === id) {
                    return item;
                }
            }
            return item;
        },
        clearMarks() {
            mapApi.clearMarks();
            mapApi.closeInfoWindow();
        },
        /**
         * 在地图上设置灯的标记点
         * @param {*} data 
         * @param {*} type 
         */
        setMapMarks(data, type) {
            // mapApi.clearMarks();
            mapApi
            let marksData = []
            data.map(item => {
                marksData.push({
                    lnglat: [item.longitude, item.latitude],
                    name: item.equipmentName,
                    id: item.id,
                    style: mapApi.getStyleIndex(
                        type,
                        item.networkState,
                        item.onOff
                    ),
                    rawObject: item
                })
                return item
            });
            mapApi.addMassMarks(marksData);
        },

        bindMapEvents() {
            // console.info("this.$refs.hoverInfo", this.$refs.hoverInfo);
            let vm = this;
            let mapComp = this.$parent.$children[0];
            this.$bus.off('mapMarksMouseover').on("mapMarksMouseover", ev => {
                let data = ev.data;
                let infoComp = mapComp.$refs.hoverDevice;
                let hoverDevice = data.rawObject || this.getDeviceInfoFromAllById(data.id);
                if (!hoverDevice) {
                    hoverDevice = {};
                    return;
                }
                mapComp.hoverDevice = hoverDevice;

                if (!infoComp) {
                    console.warn('infoComp is undefined');
                    return;
                }
                mapApi.showInfoWindow({
                    content: infoComp.$el,
                    position: [ev.data.lnglat.lng, ev.data.lnglat.lat],
                    isCustom: false
                });
            });
            this.$bus.off('mapMarksClick');
            this.$bus.off('mapMarksMouseout').on('mapMarksMouseout', ev => {
                mapApi.closeInfoWindow();
            });
            this.$bus.on("mapMarksClick", ev => {
                vm.selectedRow && vm.selectedRow(ev.data);
            });
        },

        setMassMarks(data) {
            mapApi.addMassMarks(data);
        },

        setCenter(record) {
            if (!('longitude' in record)) {
                return;
            }
            mapApi.setCenter(record.longitude, record.latitude);
        },

        toProjectCenter(userInfo) {
            userInfo = userInfo || JSON.parse(sessionStorage.getItem("loginData"));
            let project = userInfo.project[0];
            this.setCenter(project);
        }
    }
}