import http from './http';

class Api {
    _get(url, params) {
        return http.get(url, { params });
    }
    _delete(url, config) {
        return http.delete(url, config);
    }
    _post(url, data) {
        return http.post(url, data);
    }
    _put(url, data) {
        return http.put(url, data);
    }
    _patch(url, data) {
        return http.patch(url, data);
    }

    listLights(params) {
        return this._get('/listLights', params);
    }

    findByNameOrLocation(data) {
        return this._post('/light/info/findByNameOrLocation', data);
    }

    /**
     * 获取照明--分组列表数据
     * @param {String} 分页数据
     * @searchData {*} 搜索数据
     */
    lightGroupQueryList(params, searchData) {
        return this._post(`/light/group/query/list${params}`, searchData);
    }

    // 修改照明--分组列表信息
    lightGroupModify(params) {
        return this._put('/light/group/modify', params);
    }

    // 获取照明指定分组信息
    lightGroupQuery(params) {
        return this._get(`/light/group/query/${params}`);
    }

    // 照明--分组新建分组
    lightGroupAdd(params) {
        return this._post(`/light/group/add`, params);
    }

    // 照明--分组根据当前ID获取未分组的灯
    lightGroupGetLight(params) {
        return this._get(`/light/info/lightListWithoutGroupLight`, params);
    }
    // 照明--分组给分组添加灯
    lightGroupGlAdd(params) {
        return this._post(`/light/group/gl/add`, params);
    }
    // 照明--分组删除指定ID分组信息集合
    lightGroupRemove(params) {
        return this._delete(`/light/group/remove?${params}`);
    }

    /**
     * 获取照明--任务列表数据
     * @param {String} 分页数据
     * @searchData {*} 搜索数据
     */
    lightTaskQueryList(params, searchData) {
        return this._post(`/light/task/query/list${params}`, searchData);
    }

    // 照明--任务删除任务和资源关系信息
    lightTaskRemove(params) {
        return this._delete(`/light/task/remove?${params}`);
    }

    // 修改照明--任务状态
    lightTaskModifyStatus(params) {
        return this._patch(`/light/task/modify/status${params}`);
    }

    // 照明任务查看任务关联信息
    lightGroupQueryGroupLight(params) {
        return this._get(`/light/group/query/group/light/${params}`);
    }
    // 照明任务获取未排任务的分组
    lightGroupInfoListWithoutTaskResource(params) {
        return this._get(`/light/group/query/groupInfoListWithoutTaskResource/${params}`);
    }
    //照明--任务获取任务信息
    lightTaskQueryInfo(params) {
        return this._get(`/light/task/query/${params}`);
    }
    // 照明--任务编辑修改任务信息
    lightTaskModifyInfo(data) {
        return this._put(`/light/task/modify`, data);
    }
    //照明任务新建任务
    lightTaskAdd(data) {
        return this._post('/light/task/add', data);
    }

    setBrightness(data) {
        return this._post('/light/exe/setBrightness', data);
    }

    setOnOff(data) {
        return this._post('/light/exe/setOnOff', data);
    }

    /**
     * 根据设备名称或安装地理信息查询照明设备
     * @param {*} data
     */
    findByProjectId(data) {
        return this._post('/light/info/findByProjectId', data);
    }
    /**
     * 删除照明设备基础信息
     * @param {*} data
     */
    deleteLightInfo(data) {
        return this._post('/light/info/deleteLightInfo', data);
    }

    /**
     * 根据设备id查询设备基础信息和运行信息
     * @param {*} data
     */
    findByInfoAndRun(data) {
        return this._post('/light/info/findByInfoAndRun', data);
    }

    /**
     * 根据设备id查询设备基础信息和运行信息
     * @param {*} data
     */
    findByProjectIdPaged(data) {
        return this._post('/light/info/findByProjectIdPaged1', data);
    }
    /**
     * 智慧杆清单
     */
    getDeviceList(searchData) {
        return this._post(`/pole/equipment/findEquipmentList`, searchData);
    }

    /**
     * 设备管理--新增灯
     */
    addLight(data) {
        return this._post('/light/info/saveLightInfo', data);
    }
    updateLightInfo(data) {
        return this._post('/light/info/updateLightInfo', data);
    }
    /**
     * 智慧杆清单11
     */
    getModelList(searchData) {
        return this._post(`/pole/info/findModelList`, searchData);
    }
    /**
     * 测试登录
     */
    isLogin() {
        return this._get('http://127.0.0.1:3000/send')
    }
    /***
     * 登录
     */
    login(data) {
        return this._post('http://127.0.0.1:3000/login', data);
    }

    findByOnNetCount(data) {
        return this._post('/light/info/findByOnNetCount', data);
    }

    // 首页环境监测
    homeSensorFindByProjectId(data) {
        return this._post(`/sensor/info/findByProjectId`, data);
    }

    getUserInfoByToken(token) {
        return this._get(`/token/user/getUserInfoByToken?token=${token}`);
    }

    userList() { }
}
export default Api;
