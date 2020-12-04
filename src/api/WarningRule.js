import apiBase from './index';

class WarningRule extends apiBase {
    constructor() {
        super()
    }
    /**
     * 分页查询警告规则
     * @param {*} data 
     */
    alarmRule() {
        return this._get('/unions/alarm/rule/list');
    }

    addAlarmRule(data) {
        return this._post('/unions/alarm/rule/add', data);
    }

    findAttributeList(data) {
        return this._post('/unions/alarm/rule/findAttributeList', data);
    }

    findConditionList(data) {
        return this._post('/unions/alarm/rule/findConditionList', data);
    }
    deleteAlarmRule(data) {
        return this._post('/unions/alarm/rule/delete', data);
    }
    updataAlarmRule(data) {
        return this._post('/unions/alarm/rule/update', data);
    }
    //获取设备类型列表 
    getInfoType() {
        return this._get('/unions/info/type/list');
    }
    //获取设备列表  
    getInfoEquipment(data) {
        return this._post('/unions/info/equipment/list', data);
    }
    //获取指令列表
    getInfoMethod(data) {
        return this._post('/unions/info/method/list', data);
    }



   
}
export default WarningRule;