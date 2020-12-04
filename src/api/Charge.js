import apiBase from './index';

class Charge extends apiBase {
    constructor() {
        super()
    }
    /**
    * 根据项目id分页设备，支持模糊查询：电站名称+电站位置描述
    * @param {*} data
    */
   findByProjectIdPaged(data) {
        return this._post('/charger/info/findByProjectIdPaged', data)
    }

}

export default Charge;
