import apiBase from './index';

class Lock extends apiBase {
  constructor() {
    super()
  }

  //智能锁概览
  findByProjectIdPaged(data) {
    return this._post(`/unions/lock/findByProjectIdPaged`, data);
  }
  //统计报表
  findByOnNetCount(data) {
    return this._post(`/unions/lock/findByOnNetCount`, data);
  }
  //记录列表
  historyList(data) {
    return this._post(`/unions/lock/run/list`, data);
  }
  //开关状态
  setOnOff(data) {
    return this._post(`/unions/lockExe/setOnOff`, data);
  }
}

export default Lock;