import apiBase from './index';

class Police extends apiBase {
  constructor() {
    super()
  }
  /**
    * 一键求助列表
    */
  findByProjectIdPaged(data) {
    return this._post('/alarm/info/findByProjectIdPaged', data)
  }
  /**
    * 一键求助右侧统计
    */
  findByOnNetCount(data) {
    return this._post('/alarm/info/findByOnNetCount', data)
  }
  /**
    * 一键求助历史列表
    */
  findEventPaged(data) {
    return this._post('/alarm/event/findEventPaged', data)
  }
  /**
    * 一键求助报表
    */
  findEventHandlerCount(data) {
    return this._post('/alarm/report/findEventHandlerCount', data)
  }
  /**
    * 一键求助报表历史编辑
    */
  updateById(data) {
    return this._put('/alarm/event/updateById', data)
  }
}

export default Police;
