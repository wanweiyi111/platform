import apiBase from './index';

class Media extends apiBase {
    constructor() {
        super()
    }
    /***
     * 流媒体Media
     */

    GetSrcWithoutDevice(data) {
        return this._post(`/camera/info/findByCameraList`, data);
    }
    /***
     * 开始和停止录制视频
     */
    ManualRecordStartAndStop(data) {
        return this._get(`/v1/${data.type}?token=${data.token}&duration=300&session=${data.session}`);
    }
    /***
     * 设置截图
     */
    Snapshot(data) {
        return this._get(`/v1/Snapshot?token=${data.token}&session=${data.session}`);
    }
    /***
     * 获取点播列表和指定摄像头截图
     */
    getSnapshotAndRecord(data) {
        return this._get(`/v1/Search?type=${data.type}&token=${data.token}&start=${data.startTime}&end=${data.endTime}&session=${data.session}`);
    }
    /***
   * 四宫格视频清单
   */
    video4List(data) {
        return this._post('/camera/info/findDisplay', data);
    }
    /***
     * 设置四宫格
     */
    saveDisplay(data) {
        return this._post('/camera/info/saveDisplay', data);
    }
}

export default Media;
