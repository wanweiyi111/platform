import moment from 'moment';
moment.locale('zh-cn');
class Utils {
    msgNetError = '服务器或网络错误';
    fsTime = 'YYYY-MM-DD HH:mm:ss';
    fsDate = 'YYYY-MM-DD';
    fsDay = 'MM/DD HH:mm';
    fsHour = 'HH:mm';
    toUnixStamp(ts) {
        if (typeof ts !== 'number') {
            return ts;
        }
        if (ts % 1000 === 0) {
            return ts / 1000;
        }
        return ts;
    }

    toJsStamp(ts) {
        if (typeof ts !== 'number') {
            return ts;
        }
        if (ts.toString().length < 13) {
            return ts * 1000;
        }
        return ts;
    }

    toTime(ts) {
        if (!ts) {
            return '';
        }
        // ts = this.toUnixStamp(ts);
        return moment(ts).format(this.fsTime);
    }

    toDate(ts) {
        if (!ts) {
            return '';
        }
        // ts = this.toUnixStamp(ts);
        // return moment(ts).format(this.fsDate);
        return moment(ts).format(this.fsDate)
    }

    toDay(ts) {
        if (!ts) {
            return '';
        }
        // ts = this.toUnixStamp(ts);
        return moment(ts).format(this.fsDay);
    }

    toHours(ts) {
        if (!ts) {
            return '';
        }
        // ts = this.toUnixStamp(ts);
        return moment(ts).format(this.fsHour);
    }

    fromNow(ts) {
        if (!ts) {
            return '';
        }
        // let value = moment(ts).format("YYYY.MM.DD hh:mm:ss");
        let value = moment.unix(ts).format("YYYY.MM.DD hh:mm:ss");
        // return moment(value);
        return moment(value).fromNow();
    }

    getDeviceIconByType(equipmentType) {
        // const DeviceMap = {
        //     "3": "lightbulb",
        //     "4": "rectangle-portrait",
        //     "5": "webcam",
        //     "6": "wifi"
        // };
        // const DeviceMap = {
        //     '4096': "IoT设备",
        //     '1': "智慧杆",
        //     '2': "盒子",
        //     '4112': "路灯",
        //     '4144': "大屏",
        //     '4128': "摄像头",
        //     '4160': "公共WIFI",
        //     '4176': "环境传感器",
        // };
        const DeviceMap = {
            '4096': "iotid",
            '1': "智慧杆",
            '2': "box",
            '4112': "lightbulb",
            '4144': "rectangle-portrait",
            '4128': "webcam",
            '4160': "wifi",
            '4176': "zu",
            '4192': "leida",
        };

        return DeviceMap[equipmentType];
    }

    getEquipmentTypeByType(type) {
        // const DeviceMap = {
        //     '4096': "IoT设备",
        //     '1': "智慧杆",
        //     '2': "盒子",
        //     '4112': "路灯",
        //     '4144': "大屏",
        //     '4128': "摄像头",
        //     '4160': "公共WIFI",
        //     '4176': "环境传感器",
        // };

        const DeviceMap = {
            'iot': "4096",
            'pole': "1",
            'box': "2",
            'light': "4112",
            'display': "4144",
            'camera': "4128",
            'wifi': "4160",
            'environment': "4176",
            'radar': "4192"
        };

        return DeviceMap[type];
    }

    getEquipmentTypeText(equipmentType) {
        //         DEVICE("IoT设备", 4096),     //十六进制码:0x1000
        // POLE("智慧杆", 1),
        // EDGE_BOX("盒子", 2),
        // LAMP("路灯", 4112),          //0x1010
        // SCREEN("大屏", 4144),        //0x1030
        // CAMERA("摄像头", 4128),       //0x1020
        // WIFI("公共WIFI", 4160),      //0x1040
        // ENV_SENSOR("环境传感器", 4176),

        const MapEq = {
            '4096': "IoT设备",
            '4112': '智慧照明',
            '4128': '安防监控',
            '4129': '智慧WIFI',
            '4144': '信息发布',
            '4176': '环境监测',
            '4192': '智慧雷达',
            '4208': '智能柜锁',
            '4240': '应急呼叫',
            '4272': '公共广播',
            '8193': '充电桩',
            '1': "智慧杆",
            '2': "盒子",
            '8': '充电桩',
            '9': '智能锁',
            '10': '一键呼叫',
            '11': '智能水尺',
            '12': '水浸传感器',
            '13': '智能井盖'
        };

        return MapEq[equipmentType] || '';
    }

    getNetworkStateText(networkState) {
        const map = {
            '0': '离线',
            '1': '在线'
        };

        return map[networkState] || networkState;
    }

    getEquipmentStatusText(equipmentStatus) {
        const map = {
            // '-1': '故障',
            '0': '故障',
            '1': '正常'
        }
        return map[equipmentStatus] || equipmentStatus;
    }

    getWarningFaultStatusText(faultStatus) {
        const MapFaultStatus = {
            '0': '未解决',
            '1': '已解决'
        };

        return MapFaultStatus[faultStatus] || '';
    }
    getEventStatus(eventStatus) {
        const MapEventStatus = {
            '0': '待处理',
            '1': '处理中',
            '2': '已解决'
        };

        return MapEventStatus[eventStatus] || '';
    }
    getWifiStatus(wifiType) {
        const MapEventStatus = {
            'wifi_user_up': '上线',
            'wifi_user_down': '下线',
            'wifi_user': '当前在线'
        };

        return MapEventStatus[wifiType] || '';
    }

    getWarningFaultTypeText(faultType) {
        const levelMap = {
            error: "告警",
            fault: "故障",
            event: "事件"
        };
        return levelMap[faultType] || '';
    }

    getLinkageTypeText(type) {
        return type === 1 ? '单杆联动' : '双杆联动';
    }
    getLinkageStatusText(status) {
        return status === 1 ? '有效' : '失效';
    }

    getOnOffText(onOff) {
        return onOff == '1' ? '开' : '关';
    }
    // ETC 支付渠道
    getParkingPaymentChannelText(faultType) {
        const levelMap = {
            0: "未支付",
            1: "微信支付",
            2: "支付宝支付",
            3: "银联支付",
            4: "ETC支付",
        };
        return levelMap[faultType] || '-';
    }
    // ETC 支付状态
    getParkingPaymentStatusText(faultType) {
        const levelMap = {
            0: "未支付",
            1: "已支付",
            2: "已下单",
        };
        return levelMap[faultType] || '-';
    }

    uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    /*
        指定长度和基数
    */
    uuid2(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [],
            i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    }

    isInteger(obj) {
        return typeof obj === 'number' && obj % 1 === 0
    }

    numToFixed(num, digits) {
        if (this.isInteger(num)) {
            return num;
        }
        return num.toFixed(digits)
    }
}

export default new Utils();