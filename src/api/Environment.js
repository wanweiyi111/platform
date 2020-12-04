import apiBase from './index';

class Environment extends apiBase {
    constructor() {
        super()
    }
    /**
     * 设备管理---新增环境监控
     */
    addEnvironment(data) {
        return this._post('/sensor/info/saveEnvInfo', data);
    }
    /***
     * 编辑环境传感器
     */
    updateInfos(data) {
        return this._post('/sensor/info/updateInfos', data);
    }

    // updateProjectInfo(data) {
    //     return this._post('/envSensor/info/updateProjectInfo', data);
    // }

    /***
     * 环境监控列表
     */
    environmentList(data) {
        return this._post('/sensor/info/findByProjectIdPaged', data);
    }

    findByProjectIdPaged(data) {
        return this._post('/sensor/info/findByProjectIdPaged', data);
    }

    findByProjectId(data) {
        return this._post('/sensor/info/findByProjectId', data);
    }
    // 获取环境报表数据
    findByTimeDimension(data) {
        return this._post('/report/sensor/runtime/findByTimeDimension', data);
    }
}

export default Environment;