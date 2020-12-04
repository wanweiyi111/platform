import apiBase from './index';

class Radar extends apiBase {
  constructor() {
    super()
  }
  // 雷达跟踪目标
  findAllTarget(data) {
    return this._post('/radar/target/findAllTarget', data);
  }
  // 删除雷达设备基础信息
  deleteInfo(data) {
    return this._post('/radar/info/deleteInfo', data);
  }
  // 根据Code查询雷达信息
  findByEquipmentCode(data) {
    return this._post('/radar/info/findByEquipmentCode', data);
  }
  // 根据项目id查询雷达统计设备
  findByOnNetCount(data) {
    return this._post('/radar/info/findByOnNetCount', data);
  }
  // 根据项目ID查询雷达信息
  findByProjectId(data) {
    return this._post('/radar/info/findByProjectId', data);
  }
  // 根据项目id分页雷达设备
  findByProjectIdPaged(data) {
    return this._post('/radar/info/findByProjectIdPaged', data);
  }
  // 根据ID查询雷达信息
  getInfo(data) {
    return this._post('/radar/info/getInfo', data);
  }
  // 批量更新雷达信息
  updateInfos(data) {
    return this._post('/radar/info/updateInfos', data);
  }

  // 批量删除项目信息
  deleteProjectInfo(data) {
    return this._post('/radar/project/deleteProjectInfo', data);
  }
  // 获取指定项目信息
  getProjectInfo(data) {
    return this._post('/radar/project/getProjectInfo', data);
  }
  // 保存项目基础信息
  saveAndFlushProjectInfo(data) {
    return this._post('/radar/project/saveAndFlushProjectInfo', data);
  }
  // 更新项目基础信息
  updateProjectInfo(data) {
    return this._post('/radar/project/updateProjectInfo', data);
  }
  // 监控目标信息list
  findTargetList(data) {
    return this._post('/radar/target/findTargetList', data);
  }
  // 监控报表(天报表)信息list
  findReportList(data) {
    return this._post('/radar/target/findReportList', data);
  }
  // 监控报表(周报表)信息list
  findReportListWeek(data) {
    return this._post('/radar/target/findReportListWeek', data);
  }
  // 监控报表(月报表)信息list
  findReportListMonth(data) {
    return this._post('/radar/target/findReportListMonth', data);
  }

}

export default Radar;
