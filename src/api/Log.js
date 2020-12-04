import apiBase from './index';

class Log extends apiBase {
  constructor() {
    super()
  }


  applicationsList(params, data) {
    return this._post(`/log/applications/list?pageNum=${params.current}&pageSize=${params.pageSize}`, data);
  }

  exceptionsList(params, data) {
    return this._post(`/log/exceptions/list?pageNum=${params.current}&pageSize=${params.pageSize}`, data);
  }

  operationsList(params, data) {
    return this._post(`/log/operations/list?pageNum=${params.current}&pageSize=${params.pageSize}`, data);
  }

  applicationsTypes() {
    return this._get('/log/applications/types');
  }

  exceptionsLevels() {
    return this._get('/log/exceptions/levels');
  }

  operationsTypes() {
    return this._get('/log/operations/types');
  }
  //工单饼图
  ringChart(data) {
    return this._post(`/log/devOps/workSheet/count/ringChart`, data);
  }
  //工单趋势图
  trendChart(data) {
    return this._post(`/log/devOps/workSheet/count/trendChart`, data);
  }
  //工单清单
  sheetList(params, data) {
    return this._post(`/log/devOps/workSheet/list?pageNum=${params.current}&pageSize=${params.pageSize}`, data);
  }
  //工单新建
  addOrder(data) {
    return this._post(`/log/devOps/workSheet/save`, data);
  }
  //工单删除
  delOrder(data) {
    return this._post(`/log/devOps/workSheet/delete`, data);
  }
  //工单编辑
  editOrder(data) {
    return this._post(`/log/devOps/workSheet/update`, data);
  }
  //巡检清单
  checkRecodeList(params, data) {
    return this._post(`/log/devOps/checkRecode/list?pageNum=${params.current}&pageSize=${params.pageSize}`, data);
  }
  //巡检新建
  addRecode(data) {
    return this._post(`/log/devOps/checkRecode/save`, data);
  }
  //巡检删除
  delRecode(data) {
    return this._post(`/log/devOps/checkRecode/delete`, data);
  }
  //巡检编辑
  editRecode(data) {
    return this._post(`/log/devOps/checkRecode/update`, data);
  }

  //查询控制日志/指令操作日志信息
  execLogQuery(params, data) {
    data = Object.assign(params, data);
    // console.info('execLogQuery', data);
    return this._post(`/unions/exec/log/query`, data);
  }
}

export default Log;