import apiBase from './index';

class LocalApi extends apiBase {
    constructor() {
        super()
    }
    /**
     *一键告警
     */
    postAlarm(data) {
        return this._post('/report/dashboard/stateAlarmNumMonthly', data);
    }
    /**
     *照明能耗
     */
    postLightReport(data) {
        return this._post('/report/dashboard/stateLightEnergyMonthly', data);
    }
    /**
     *WIFI数据
     */
    postWifi(data) {
        return this._post('/report/dashboard/stateWifiLogonUserMonthly', data);
    }
    /**
     * 告警按類型統計  /异常事件
     */
    postAlarmType(data) {
        return this._post('/report/dashboard/stateExceptionNumMonthly', data);
    }
    /**
     * 设备数量統計
     */
    postEquipment(data) {
        return this._post('/report/dashboard/stateDeviceNumByType', data);
    }
    /**
     * 在线率统计
     */
    postOnLineEquipment(data) {
        return this._post('/report/dashboard/statAllDevStatus', data);
    }
}
export default LocalApi;