import apiBase from './index'

class Display extends apiBase {
  constructor() {
    super()
  }
  /**
   * 根据设备名称或安装地理信息查询照明设备
   * @param {*} data
   */
  findByProjectId(data) {
    return this._post('/screen/info/findByProjectId', data)
  }

  /**
   * 根据设备id查询设备基础信息和运行信息
   * @param {*} data
   */
  findByInfoAndRun(data) {
    return this._post('/screen/info/findByInfoAndRun', data)
  }

  /**
   * 根据设备id查询设备基础信息和运行信息
   * @param {*} data
   */
  findByProjectIdPaged(data) {
    return this._post('/screen/info/findByProjectIdPaged', data)
  }

  // 获取信息发布--媒体库列表数据
  screenMediaQueryList(params, searchData) {
    return this._post(`/screen/media/query/list/${params}`, searchData)
  }
  //获取媒体列表
  getMediaList(params) {
    return this._get(
      `/screen/task/query/list/programInfo?projectId=${
        params.projectId
      }&taskId=${params.taskId || ''}`
    )
  }

  // 获取信息发布--媒体库下载
  screenMediaFileDownload(params) {
    return this._get(`/screen/media/file/download/path?id=${params}`)
  }

  // 获取信息发布--媒体库审核
  screenMediaModStatus(params) {
    return this._post(`/screen/media/mod/status`, params)
  }

  // 获取信息发布--媒体库删除
  screenMediaRemove(params) {
    return this._post(`/screen/media/remove`, params)
  }

  // 获取信息发布--节目库列表数据
  screenProgramQueryList(params, searchData) {
    return this._post(`/screen/program/query/list${params}`, searchData)
  }

  // 获取信息发布--节目库审核
  screenProgramModStatus(params) {
    return this._post(`/screen/program/mod/status`, params)
  }

  // 获取信息发布--节目库删除
  screenProgramRemove(params) {
    return this._post(`/screen/program/remove`, params)
  }

  // 获取信息发布--节目预览
  screenProgramQuery(params) {
    return this._get(`/screen/program/query/${params}`)
  }

  programAdd(data) {
    return this._post('/screen/program/add', data)
  }

  // 获取信息发布--分组列表数据
  screenGroupQueryList(params, searchData) {
    return this._post(`/screen/group/query/list/${params}`, searchData)
  }
  // 获取信息发布--新建分组
  screenGroupAdd(params) {
    return this._post(`/screen/group/add`, params)
  }

  // 信息发布--分组删除指定ID分组信息集合
  screenGroupRemove(params) {
    return this._delete(`/screen/group/remove?${params}`)
  }
  // 信息发布修改--分组列表信息
  screenGroupModify(params) {
    return this._put('/screen/group/modify', params)
  }

  // 信息发布分组获取没有分组的屏幕信息
  screenListWithoutGroupScreen(params) {
    return this._get(`/screen/group/screenListWithoutGroupScreen`, params)
  }
  // 信息发布分组获取分组的屏幕信息
  screenListGroupScreen(params) {
    return this._get(
      `/screen/task/query/list/groupInfo?projectId=${
        params.projectId
      }&taskId=${params.taskId || ''}`
    )
  }

  // 信息发布--分组给分组添加屏幕
  screenGroupGlAdd(params) {
    return this._post(`/screen/group/gl/add`, params)
  }
  // 获取信息发布--任务列表数据
  screenTaskQueryList(params, searchData) {
    return this._post(`/screen/task/query/list${params}`, searchData)
  }

  // 获取指定任务信息
  screenTaskQuery(params) {
    return this._get(`/screen/task/query/${params}`)
  }
  // 修改信息发布任务状态
  screenTaskModifyStatus(params) {
    return this._post(`/screen/task/mod/status`, params)
  }

  // 删除指定ID任务信息集合
  screenTaskRemove(params) {
    return this._delete(`/screen/task/remove?${params}`)
  }
  /**
   * 设置开关屏幕
   * @param {*} data
   */
  setOnOff(data) {
    return this._post('/screen/exe/setOnOff', data)
  }
  /**
   *截屏
   * @param {*} data
   */
  setScreenshot(data) {
    return this._post('/screen/exe/setScreenshot', data)
  }
  /**
   *获取截屏列表
   * @param {*} data
   */
  getScreenshot(id, data) {
    return this._post(`/screen/info/query/screenshot/${id}/1/10000`, data)
  }

  /**
   * 设置屏幕亮度
   * @param {*} data
   */
  setBrightness(data) {
    return this._post('/screen/exe/setBrightness', data)
  }

  /**
   * 设置屏幕重启
   * @param {*} data
   */
  reboot(data) {
    return this._post('/screen/exe/reboot', data)
  }

  setDownloadProgram(data) {
    return this._post('/screen/exe/setDownloadProgram', data)
  }

  uploadMedia(data) {
    return this._post('/screen/media/file/upload', data)
  }
  /**
   * 获取设备未分组的设备群组列表
   * @param {*} data
   */
  screenGroupInfoListWithoutTaskResource(params) {
    return this._get(
      `/screen/group/query/groupInfoListWithoutTaskResource`,
      params
    )
  }

  mediaRemove(data) {
    return this._post('/screen/media/remove', data)
  }
  /**
   * 新建任务提交数据
   */
  addTask(params) {
    return this._post('/screen/task/add', params)
  }
  /**
   * 修改任务提交数据
   */
  editTask(params) {
    return this._put('/screen/task/modify', params)
  }
  /**
   * 设备管理--新增摄像头
   */
  addDisplay(data) {
    return this._post('/screen/info/saveScreenInfo', data)
  }

  updateScreenInfos(data) {
    return this._post('/screen/info/updateScreenInfos', data)
  }
  /**
   * 创建节目
   */
  createMedia(data) {
    return this._post('/screen/program/add', data)
  }
  /**
   * 创建节目
   */
  modifiedMedia(data) {
    return this._put('/screen/program/modify', data)
  }
  /**
   * 获取节目
   */
  getMediaInfo(data) {
    return this._get(
      `/screen/program/query/${data.prejectId}/${data.programId}`
    )
  }

  findByOnNetCount(data) {
    return this._post('/screen/info/findByOnNetCount', data)
  }

  /**
   * 获取LED大屏列表数据
   * @param {*} data
   */
  deviceFindByProjectIdPaged(data) {
    return this._post('/screen/info/findByProjectIdPaged', data)
  }
  // 删除LED大屏列表信息
  deleteScreenInfo(data) {
    return this._post('/screen/info/deleteScreenInfo', data)
  }
  // 修改保存LED大屏列表信息
  deviceSaveScreenInfo(data) {
    return this._post('/screen/info/saveScreenInfo', data)
  }
  //跟大屏获取节目列表
  getProgramsByScreen(data, opt) {
    return this._post(`/screen/info/program/${data.projectId}/${data.id}`, data)
  }
  //大屏节目编辑
  programsAdd(data) {
    return this._post('/screen/info/program/add', data)
  }
  /**
   * 播放默认 节目
   * @param {*} data
   */
  playDefaultProgram(data) {
    return this._post('/screen/exe/playDefaultProgram', data)
  }
}

export default Display
