import apiBase from './index';

class Report extends apiBase {
    constructor() {
        super()
    }
    /**
     *获取全部设备数量
     */
    geAallDevice(data) {
        return this._post('/report/info/findByOnNetCount', data);
    }
    /**
     *获取照明周报表
     */
    getLightReport(data) {
        return this._post('/report/info/findByReportList', data);
    }
    /**
     *获取照明月表
     */
    findByReportListMonth(data) {
        return this._post('/report/info/findByReportListMonth', data);
    }
    /**
     * 首页节能照明报表
     */
    getDeviceLightReport(data) {
        return this._post('/report/info/findByReportList', data);
    }
}
export default Report;