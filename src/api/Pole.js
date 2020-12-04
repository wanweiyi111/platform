import apiBase from './index'

class Pole extends apiBase {
  constructor() {
    super()
  }

  findByProjectId(data) {
    return this._post('/pole/info/findByProjectId', data)
  }
  /**
   * 通过设备类型查询设备清单 /info/addEquipmentList
   */
  getDeviceListByDeviceType(data) {
    return this._post('/pole/info/addEquipmentList', data)
  }
  /***
   * 添加设备到智慧杆
   */
  addDeviceToPole(data) {
    return this._post('/pole/equipment/addEquipmentToPole', data)
  }

  /**
   * 智慧杆清单
   */
  getPoleList(data) {
    return this._post(`/pole/equipment/findEquipmentList`, data)
  }
  /***
   * 添加设备
   */
  addPoleDevice(data) {
    return this._post(`/pole/info/savePoleInfo`, data)
  }
  /***
   * 分组清单
   */
  groupList(data) {
    return this._post(`/pole/info/findGroupList`, data)
  }

  /**
   * 智慧杆及灯柱上挂载的设备信息
   * @param {*} data
   */
  findBindings(data) {
    return this._post(`/pole/info/findBindings`, data)
  }

  /**
   * 智慧杆及灯柱上挂载的设备信息(根据设备类型区分)
   * @param {*} data
   */
  findBindingsByType(data) {
    return this._post(`/pole/info/findBindingsByType`, data)
  }

  /***
   * 通过设备code查询数据
   */
  getInfoByDeviceCode(data, type) {
    return this._post(`/${type}/info/findByEquipmentCode`, data)
  }

  /***
   * 通过设备code和设备类型查询设备基础数据以外的特殊数据
   */
  getInfoByDeviceEquipmentCodes(data) {
    return this._post(`/pole/equipment/findByEquipmentCodes`, data)
  }

  /***
   * 通过设备code查询设备的告警信息
   */
  getWarningMessageByCode(data) {
    return this._post(`/unions/exception/findByEquipmentCodes`, data)
  }

  // 更新设备告警信息
  updateAlarmMsg(data) {
    return this._post(`/unions/exception/updateAlarmMsg`, data)
  }

  /***
   * 更新智慧杆信息
   */
  updatePoleInfos(data) {
    return this._post(`/pole/info/updatePoleInfos`, data)
  }
  /***
   * 获取单个智慧杆信息
   */
  getPoleInfo(data) {
    return this._post(`/pole/info/getPoleInfo`, data)
  }
  /***
   * 解绑智慧杆和设备的关系
   */
  deleteByPoleId(data) {
    return this._post(`/pole/equipment/deleteByEquipmentId`, data)
  }
  /**
   * 获取智慧杆上灯信息
   */
  findLightCodeList(data) {
    return this._get(`/pole/info/findLightCodeList/${data}`)
  }
  /***
   * 项目初始化获取设备列表
   */
  findAllEquipmentWithout(data) {
    return this._post(`/pole/equipment/findAllEquipmentWithout`, data)
  }
  /***
   * 项目初始化获取项目列表
   */
  getProjectList(data) {
    return this._post(`/token/project/getProjectInfo`, data)
  }
  /***
   * 项目初始化提交数据
   */
  saveBindProject(data) {
    return this._post(`/pole/equipment/saveBindProject`, data)
  }
}

export default Pole
