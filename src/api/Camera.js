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
    return this._post('/camera/info/findByCameraList', data)
  }

  findByCameraList(data) {
    return this._post('/camera/info/findByCameraList', data)
  }

  /**
   * 根据设备id查询设备基础信息和运行信息
   * @param {*} data
   */
  findByInfoAndRun(data) {
    return this._post('/camera/info/findByInfoAndRun', data)
  }

  /**
   * 根据设备id查询设备基础信息和运行信息
   * @param {*} data
   */
  findByProjectIdPaged(data) {
    return this._post('/camera/info/findByProjectIdPaged', data)
  }

  /***
   * 获取预置点列表
   */
  getPresupposeByCameraId(data) {
    return this._post('/camera/presuppose/findByCameraId', data)
  }

  /**
   * 删除、保存、应用预置点
   */
  effectPresent(data, type) {
    let urlArr = {
      set: '/camera/presuppose/savePresupposedDO',
      del: '/camera/presuppose/deleteByCameraIdAndPreId',
      effect: '/camera/exe/exePresupposed'
    }
    return this._post(urlArr[type], data)
  }
  /**
   * 安防列表
   */
  getCameraListByPrejectId(data) {
    return this._post('/camera/info/findByProjectId', data)
  }
  /**
   * 智慧杆操作
   */
  cameraEffect(data) {
    return this._post('/camera/exe/exePresupposed', data)
  }
  /***
   * 获取回放列表
   */
  getCameraDemandList(data) {
    return this._post('/camera/presuppose/findByCameraId', data)
  }
  /***
   * 获取告警列表
   */
  getCameraWarnningList(data) {
    return this._post('/camera/exception/findByLastUpdate', data)
  }
  /***
   *安防--历史回放列表(根据时间筛选)
   */
  getCameraDemandListByTime(data) {
    return this._post('/camera/history/searchByDate', data)
  }
  /**
   * 设备管理--新增摄像头
   */
  addCamare(data) {
    return this._post('/camera/info/saveCameraInfo', data)
  }

  updateCameraInfos(data) {
    return this._post('/camera/info/updateCameraInfos', data)
  }

  /**
   * 设备管理--删除摄像头
   */
  delCamare(data) {
    return this._post('/camera/info/deleteCameraInfo', data)
  }
  /***
   * 转动云台
   */
  movePtz(data) {
    return this._post('/camera/exe/movePtz', data)
  }
  /***
   * 九宫格视频清单
   */
  findStreamUrl(data) {
    return this._post('/camera/stream/findStreamUrl', data)
  }
  /***
   * 九宫格视频清单
   */
  setFocus(data) {
    return this._post('/camera/exe/zoom', data)
  }
  /**
  * 根据摄像头id查询流信息
  * @param {*} data
  */
  findByCamera(data) {
    return this._post('/camera/info/findByCamera', data)
  }
}

export default Display
