import apiBase from './index';

class Report extends apiBase {
    constructor() {
        super()
    }
    /**
     *wifi列表
     */
    findByProjectId(data) {
        return this._post('/wifi/run/findByProjectIdPaged', data);
    }
    // 分页+搜索
    findByProjectIdPaged(data, param) {
        return this._post(`/wifi/run/findByProjectIdPaged?${data}`, param);
    }
    /**
     *wifi侧报表
     */
    findByOnNetCount(data) {
        return this._post('/wifi/info/findByOnNetCount', data);
    }
    /**
     *根据code查询设备
     */
    findByEquipmentCode(data) {
        return this._post(`/wifi/user/findByEquipmentCode?current=${data.current}&size=10`, data);
    }
}
export default Report;