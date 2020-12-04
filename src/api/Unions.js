import apiBase from './index';

class Unions extends apiBase {
    constructor() {
        super()
    }

    /**
     * 查询所有设备异常信息
     * @param {*} data 
     */
    findException(data) {
        return this._post('/unions/exception/findException', data);
    }


    queryList(data, pageInfo) {
        return this._post(`/unions/rule/query/list/${pageInfo.current}/${pageInfo.pageSize}`, data);
    }

    listAction() {
        return this._get('/unions/rule/list/action');
    }

    listTrigger() {
        return this._get('/unions/rule/list/trigger');
    }

    addRule(data) {
        return this._post('/unions/rule/add', data);
    }

    deleteRule(data) {
        return this._delete('/unions/rule/delete', { data, "Content-Type": "application/json" });
    }

    modifyRule(data) {
        return this._put('/unions/rule/modify', data);
    }

    ruleQuery(id) {
        return this._get(`/unions/rule/query/${id}`);
    }
}

export default Unions;