/*****
 * 初始化地图挂载全局对象
 * 海量标点数据(标点类型)
 * 图层覆盖
 * 设置中心点
 * 地图浮框
 * 标点事件(hover、click、leave)
 *
 */

export default function(map, MAP, element) {
    this.map = map; //地图实例
    this.MAP = MAP; //地图对象
    this.labelMarker = null; //地图覆盖对象
    this.element = element //地图hover浮框DOM元素

    //创建地图画板
    let layer = new MAP.LabelsLayer({
        zooms: [3, 20],
        zIndex: 1000,
        animation: false, // 关闭标注避让，默认为开启，v1.4.15 新增属性        
        collision: false // 关闭标注淡入动画，默认为开启，v1.4.15 新增属性
    });
    map.add(layer);
    this.setMapCenter = function(val) {
            map.setZoomAndCenter(17, val);
        }
        /****
         * 添加地图标点
         * data Array 标点数据
         * lightsIcon Object 标点图标
         * clickCB  Function 鼠标点击标点事件
         * hoverCB  Function 鼠标悬停标点事件
         */
    this.setLabelMarker = function(data, lightsIcon, clickCB, hoverCB) {
        let markers = [];
        var curViewMode = map.getViewMode_();
        let viewData = {
            "2D": 3e3,
            "3D": 3e4
        };
        let positions = data.slice(0, viewData[curViewMode]);
        let icon = {
            type: "image",
            image: lightsIcon,
            size: [13.5, 47],
            anchor: "bottom-center",
            angel: 0,
            retina: true
        };

        for (let i = 0; i < positions.length; i++) {
            let curPosition = positions[i];
            let curData = {
                position: curPosition,
                icon
            };
            this.labelMarker = new MAP.LabelMarker(curData);
            this.labelMarker.on("mouseover", function(e) {
                var infoWindow = new MAP.InfoWindow({
                    isCustom: true, //使用自定义窗体
                    offset: new MAP.Pixel(16, -45) //窗体偏移位置
                });
                infoWindow.setContent(element);
                infoWindow.open(map, e.lnglat);
                hoverCB(e);
            });
            this.labelMarker.on("mouseout", function() {
                map.clearInfoWindow();
            });
            this.labelMarker.on("click", function(e) {
                clickCB(e)
            });
            // 一次性将海量点添加到图层
            layer.add(markers);
            markers.push(this.labelMarker);
        }
    }
}