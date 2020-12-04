import apiBase from './index';

class Report extends apiBase {
    constructor() {
        super()
    }
    /**
     *摄像头
     */
    camera(data) {
        return this._post('/camera/runtime/list', data);
    }
    /**
     *大屏
     */
    display(data) {
        return this._post('/screen/runtime/list', data);
    }
    /**
     *灯
     */
    light(data) {
        return this._post('/light/runtime/list', data);
    }
    /**
     *雷达
     */
    radar(data) {
        return this._post('/radar/target/list', data);
    }
    /**
     *WIFI
     */
    wifi(data) {
        return this._post('/wifi/run/list', data);
    }
}
export default Report;