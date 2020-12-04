import Vue from 'vue';
import _ from 'lodash';
import JsLoader from '@/libs/JsLoader.js';

import PoleFault from "@/assets/map-marks/pole-fault.svg";
// import PoleOn from "@/assets/map-marks/pole-on.svg";
// import PoleOff from "@/assets/map-marks/pole-off.svg";
// import PoleOffLine from "@/assets/map-marks/pole-off.svg";
// import PoleCheck from "@/assets/map-marks/pole-select.svg";
import PoleOn from "@/assets/console/pole-on.svg";
import PoleOff from "@/assets/console/pole-off.svg";
import PoleOffLine from "@/assets/console/pole-off-line.svg";
import PoleCheck from "@/assets/console/pole-check.svg";

import LampFault from "@/assets/map-marks/lamp-fault.svg";
import LampOn from "@/assets/map-marks/lamp-on.svg";
import LampOff from "@/assets/map-marks/lamp-off.svg";
import LampOffLine from "@/assets/map-marks/lamp-off.svg";
import LampCheck from "@/assets/map-marks/lamp-select.svg";

import CameraFault from "@/assets/map-marks/camera-fault.svg";
import CameraOn from "@/assets/map-marks/camera-on.svg";
import CameraOff from "@/assets/map-marks/camera-off.svg";
import CameraOffLine from "@/assets/map-marks/camera-off.svg";
import CameraCheck from "@/assets/map-marks/camera-select.svg";

import LEDFault from "@/assets/map-marks/led-fault.svg";
import LEDOn from "@/assets/map-marks/led-on.svg";
import LEDOff from "@/assets/map-marks/led-off.svg";
import LEDOffLine from "@/assets/map-marks/led-off.svg";
import LEDCheck from "@/assets/map-marks/led-select.svg";

import WifiFault from "@/assets/map-marks/wifi-fault.svg";
import WifiOn from "@/assets/map-marks/wifi-on.svg";
import WifiOff from "@/assets/map-marks/wifi-off.svg";
import WifiOffLine from "@/assets/map-marks/wifi-off.svg";
import WifiCheck from "@/assets/map-marks/wifi-select.svg";

import parkingGreen from '@/assets/map-marks/parking-green.png';
import parkingRed from '@/assets/map-marks/parking-red.png';
import parkingYellow from '@/assets/map-marks/parking-yellow.png';
let heatmap, ScatterPoint;
// const styleList3d = [
//     PoleFault3d,
//     PoleOn3d,
//     PoleOff3d,
//     PoleOffLine3d,
//     PoleCheck3d,

//     LampFault3d,
//     LampOn3d,
//     LampOff3d,
//     LampOffLine3d,
//     LampCheck3d,

//     CameraFault3d,
//     CameraOn3d,
//     CameraOff3d,
//     CameraOffLine3d,
//     CameraCheck3d,

//     LEDFault3d,
//     LEDOn3d,
//     LEDOff3d,
//     LEDOffLine3d,
//     LEDCheck3d,

//     WifiFault3d,
//     WifiOn3d,
//     WifiOff3d,
//     WifiOffLine3d,
//     WifiCheck3d,

//     environmentFault3d,
//     environmentOn3d,
//     environmentOff3d,
//     null,
//     null,

//     radarFault3d,
//     radarOn3d,
//     radarOff3d,
//     null,
//     null
// ];

const styleList = [
    PoleFault,
    PoleOn,
    PoleOff,
    PoleOffLine,
    PoleCheck,

    LampFault,
    LampOn,
    LampOff,
    LampOffLine,
    LampCheck,

    CameraFault,
    CameraOn,
    CameraOff,
    CameraOffLine,
    CameraCheck,

    LEDFault,
    LEDOn,
    LEDOff,
    LEDOffLine,
    LEDCheck,

    WifiFault,
    WifiOn,
    WifiOff,
    WifiOffLine,
    WifiCheck,

    parkingGreen,
    parkingRed,
    parkingYellow
];

const viewMode = '2D';

class MapAip {
    _complete = false;
    styleObjectArr = [];
    taskQueue = [];
    gltfObjList = [];
    constructor() {

    }

    pushQueue(funName, args) {
        this.taskQueue.push({ funName, args });
    }
    /**
     * 初始化地图
     */
    init(continer, initOpt) {
        JsLoader('https://webapi.amap.com/maps?v=1.4.15&key=c35a39e8ca8a5ba74fec3ec69cef0c70&plugin=AMap.GltfLoader,AMap.ToolBar', 'AMap')
            .then(AMap => {
                styleList.forEach(item => {
                    this.styleObjectArr.push({
                        url: item,
                        size: new AMap.Size(40, 60), // 图标大小
                        anchor: new AMap.Pixel(10, 10) // 图标显示位置偏移量，基准点为图标左上角
                    })
                });

                initOpt = Object.assign(initOpt || {}, {
                    // center: [114.216023, 22.719399],
                    resizeEnable: true, //是否监控地图容器尺寸变化
                    zoom: 17, //伸缩等级
                    pitch: 55,
                    // rotation: 15, //偏转角度
                    viewMode, //3D模式
                    showBuildingBlock: true,
                    expandZoomRange: true,
                    zooms: [3, 20],
                    // features: ['road', 'building', 'point'], //地图覆盖物 'bg', 
                    // showLabel: false, //不显示地图文字标记
                    // mapStyle: "amap://styles/0ed12973b09108ea18176ff0addf9167" //设置地图的显示样式
                    mapStyle: "amap://styles/a5be9b0b78d82df2a9658b9f0e3462df"
                });
                // console.log('当前像素大小', this.map.getGridSize())
                this.map = new AMap.Map(continer, initOpt);
                // 设置地图复位放大缩小控制按钮
                this.map.addControl(new AMap.ToolBar({
                    position: 'RB',
                    ruler: false,
                    direction: false
                }));
                // this.object3Dlayer = new AMap.Object3DLayer();
                this.map.on('complete', () => {
                    this._complete = true;
                    Vue.bus.emit('mapComplete');
                    // this.gltfLoader = new AMap.GltfLoader();
                    // this.map.add(this.object3Dlayer);
                    if (this.taskQueue.length > 0) {
                        this.taskQueue.forEach(item => {
                            this[item.funName](...item.args);
                        });
                    }
                    // this.setCenter(114.560881, 23.113661);
                    this.setLight();
                });
            })
            .catch(err => {
                console.log("地图加载失败", err);
            });
    }

    /**
     * 设置光照
     */
    setLight() {
        // //获取
        // var ambientLight = this.map.AmbientLight;   //获取环境光
        // var directionLight = this.map.DirectionLight; //获取平行光  

        // ambientLight.setIntensity(0);//修改强度
        // directionLight.setColor([0.9, 0, 0]);//修改颜色
        // directionLight.setDirection([0, -1, 2]);//修改方向
        // console.log('map light', ambientLight, directionLight)

        //修改
        try {
            this.map.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.6);
            this.map.DirectionLight = new AMap.Lights.DirectionLight([0, 0, 2000], [1, 1, 1], 0.9);
        } catch (err) {
            console.warn(err);
        }
    }

    /**
     * 添加海量标记
     * 参考：https://lbs.amap.com/api/javascript-api/guide/overlays/massmarker
     * @param {*} data 
     * var data = [{
          lnglat: [116.405285, 39.904989],
          name: 'beijing',
          id:1,
          style: 0  // 该数据的样式取值styleObjectArr对应的样式索引
        },{
          lnglat: [116.405285, 39.904989],
          name: 'beijing',
          id:1,
          style: 1
        } //, …,{}, …
        ];
     */
    addMassMarks(data) {
        if (!this._complete) {
            this.pushQueue('addMassMarks', arguments)
            return;
        }
        this.massMarks = new AMap.MassMarks(data, {
            zIndex: 999, // 海量点图层叠加的顺序
            zooms: [3, 20], // 在指定地图缩放级别范围内展示海量点图层
            style: this.styleObjectArr //多种样式对象的数组
        });

        // 将 massMarks 添加到地图实例
        this.massMarks.setMap(this.map);
        this.massMarks.on('click', ev => Vue.bus.emit('mapMarksClick', ev));
        this.massMarks.on('mouseover', ev => Vue.bus.emit('mapMarksMouseover', ev));
        this.massMarks.on('mouseout', ev => Vue.bus.emit('mapMarksMouseout', ev));
    }

    add3DMarks(data) {
        // debugger;
        if (!this._complete) {
            this.pushQueue('add3DMarks', arguments)
            return;
        }

        const _this = this;
        function eventData(ev, type) {
            var pixel = ev.pixel;
            var px = new AMap.Pixel(pixel.x, pixel.y);
            var obj = _this.map.getObject3DByContainerPos(px, [_this.object3Dlayer], false) || {};
            let lng, lat, coordKey;
            if (obj.object) {
                coordKey = 'Ml' in obj.object ? 'Ml' : 'Ll' in obj.object ? 'Ll' : 'Rl';
                lng = obj.object[coordKey].lng;
                lat = obj.object[coordKey].lat;
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    if (item.lnglat[0] === lng && item.lnglat[1] === lat) {
                        Vue.bus.emit(type, { type: type, data: item });
                        return;
                    }
                }
            }
        }

        this.map.on('click', function (ev) {
            eventData(ev, 'mapMarksClick')
        })
        this.map.on('mouseover', function (ev) {
            eventData(ev, 'mapMarksMouseover')
        })
        this.map.on('mouseout', function (ev) {
            eventData(ev, 'mapMarksMouseout')
        })

        data.forEach(item => {
            this.addOne3DMark(item);
        })

        this.map.setFitView();
        // var urlDuck = 'https://a.amap.com/jsapi_demos/static/gltf/Duck.gltf';

    }

    initGltfLoader() {
        if (!this.gltfLoader) {
            this.gltfLoader = new AMap.GltfLoader();
        }
    }

    addOne3DMark(item) {
        let _this = this;
        if (!this.gltfLoader) {
            throw new Error('gltfLoader not defined');
        }
        // this.gltfLoader.load(styleList3d[item.style], function (gltfObj) {
        //     gltfObj.setOption({
        //         position: new AMap.LngLat(item.lnglat[0] || 0, item.lnglat[1] || 0), // 必须
        //         scale: 100, // 非必须，默认1
        //         height: 0, // 非必须，默认0
        //         scene: 0, // 非必须，默认0
        //     });
        //     gltfObj.rotateX(90);
        //     // gltfObj.rotateZ(-20);
        //     gltfObj.deviceId = item.id;
        //     _this.object3Dlayer.add(gltfObj);
        //     _this.gltfObjList.push(gltfObj);
        // });
    }

    clearMarks() {
        /* if (viewMode === '3D') {
            this.clear3dMarks();
        } else {
            this.clearMassMarks();
        } */
        this.clear3dMarks();
        this.clearMassMarks();
    }

    /**
     * 清空所有标记点
     */
    clearMassMarks() {
        if (!this._complete) {
            this.pushQueue('clearMassMarks', arguments)
            return;
        }

        this.massMarks && this.massMarks.clear();
    }

    /**
     * 清空3D标记点
     */
    clear3dMarks() {
        if (!this._complete) {
            this.pushQueue('clear3dMarks', arguments)
            return;
        }

        // this.object3Dlayer && this.object3Dlayer.clear();
        this.object3Dlayer && this.gltfObjList.forEach(item => {
            this.object3Dlayer.remove(item);
        });
        this.gltfObjList = [];
    }

    /**
     * 设置地图中心点
     * @param {*} lng 
     * @param {*} lat 
     */
    setCenter(lng, lat) {
        if (!this._complete) {
            this.pushQueue('setCenter', arguments)
            return;
        }
        this.map.setCenter([lng, lat]);
    }

    /**
     * 同时设置地图层级与中心点
     * @param {*} zoom 
     * @param {*} lng 
     * @param {*} lat 
     */
    setZoomAndCenter(zoom, lng, lat) {
        if (!this._complete) {
            this.pushQueue('setZoomAndCenter', arguments)
            return;
        }
        this.map.setZoomAndCenter(zoom, [lng, lat]);
    }

    formatWindowOptions(option) {
        if (_.isElement(option) || _.isString(option)) {
            option = { option };
        }
        if (_.isArray(option.position)) {
            option.position = new AMap.LngLat(...option.position);
        }
        option.closeWhenClickMap = true;
        option.autoMove = true;
        // option.isCustom = true;

        return option;
    }

    /**
     * 在地图上打开信息窗口
     * @param {} content 传入 dom 对象，或者 html 字符串
     */
    showInfoWindow(option) {
        option = this.formatWindowOptions(option);
        // 创建 infoWindow 实例	
        this.infoWindow = new AMap.InfoWindow(option);

        // 打开信息窗体
        this.infoWindow.open(this.map);
    }

    closeInfoWindow() {
        // this.infoWindow.close();
    }

    showAdvancedInfoWindow(option) {
        option = this.formatWindowOptions(option);
        // 创建 infoWindow 实例	
        this.advancedInfoWindow = new AMap.AdvancedInfoWindow(option);

        // 打开信息窗体
        // this.advancedInfoWindow.open(this.map);
    }

    closeAdvancedInfoWindow() {
        // this.advancedInfoWindow.close();
    }

    /**
     * 根据不同的设备类型和状态值，获取对应的设备样式id
     * @param {设备类型: pole/智慧杆, lamp/灯, camera/摄像头, led/大屏, wifi} type 
     * @param {各设备的状态值} status 
     */
    getStyleIndex(deviceType, networkState, equipmentStatus) {
        const map = {
            pole: [1, 1, 1, 1, 1], //check, fault,off-line,off,on //智慧杆只有一种状态
            light: [5, 6, 7, 8, 9],
            camera: [10, 11, 12, 13, 14],
            display: [15, 16, 17, 18, 19],
            wifi: [20, 21, 22, 23, 24],
            environment: [25, 26, 27, 26, 26],
            radar: [30, 31, 32, 33, 34],
        };

        try {
            const standardIndex = this._getStandardStatus(networkState, equipmentStatus);
            return map[deviceType][standardIndex] || 0;
        } catch (err) {
            console.log('获取海量图标样式出错', err);
            return 0;
        }
    }

    getGltfObjById(id) {
        return this.gltfObjList.find(val => val.deviceId === id);
    }

    setMarkerChecked(id) {
        let gltfObj = this.getGltfObjById(id);
        // this.object3Dlayer.remove(gltfObj);
        gltfObj && gltfObj.setOption({
            scale: 600, // 非必须，默认1
        });
        // console.log('delete', gltfObj)
    }

    _getStandardStatus(networkState, equipmentStatus, active) {
        //设备状态（“1”为开启，“0”为关闭）
        //在网状态(“1”为在线，“0”为离线)
        if (active) {
            return 4; //checked
        }
        if (equipmentStatus == '1' && networkState === '1') {
            return 1; //on
        } else if (equipmentStatus == '0' && networkState === '1') {
            return 2; //off
        } else if (networkState === '0') {
            return 3; //offline
        }

        return 1;
    }
    //根据地图缩放等级来选择散点图还是热力图
    swPointHeatMap(heatData, pointData) {
        let _this = this;
        this.map.plugin(["AMap.Heatmap"], function () {
            heatmap = new AMap.Heatmap(_this.map, {
                radius: 100, //给定半径
                opacity: [0, 0.8]

            });
            heatmap.setDataSet({
                data: heatData,
                max: 100
            });
        });
        this.map.on('zoomchange', () => {
            let map_zoom = this.map.getZoom();
            if (map_zoom > 16) {
                heatmap && heatmap.show();
                ScatterPoint && ScatterPoint.hide()
            } else {
                heatmap && heatmap.hide()
                if (!ScatterPoint) {
                    ScatterPoint = new Loca.RoundPointLayer({
                        map: this.map
                    });
                    // 传入原始数据
                    ScatterPoint.setData(pointData, {
                        lnglat: 'lnglat'   // 指定坐标数据的来源，数据格式: 经度在前，维度在后，数组格式。
                    });
                    // 配置样式
                    ScatterPoint.setOptions({
                        unit: 'px',
                        style: {
                            radius: 8,     // 圆形半径，单位像素
                            color: '#b7eff7', // 填充颜色
                            borderWidth: 0.5,   // 边框宽度
                            borderColor: '#ffffff'  // 边框颜色
                        }
                    });
                    ScatterPoint.render();
                } else {
                    ScatterPoint.show();
                }
            }
        });
    }
    hideHeatMap(showType) {
        heatmap && heatmap[showType]();
        ScatterPoint && ScatterPoint[showType]();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new MapAip();
        }
        return this.instance;
    }
}

export default MapAip.getInstance();