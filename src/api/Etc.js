import apiBase from './index';

class Etc extends apiBase {
  constructor() {
    super()
  }

  //查询车位信息列表
  findParkingSpaceList(data) {
    return this._post(`/etc/info/findParkingSpaceList`, data);
  }

  /**
   * 保存车位信息
   * @param {*} data 
   */
  saveInfo(data) {
    return this._post(`/etc/info/saveInfo`, data);
  }

  /**
   * 查询车位收费记录列表
   * @param {*} data 
   */
  findDetailByParkingCode(data) {
    return this._post(`/etc/detail/findDetailByParkingCode`, data);
  }

  /**
   * 批量更新车位信息
   * @param {*} data 
   */
  updateInfos(data) {
    return this._post(`/etc/info/updateInfos`, data);
  }

  /**
   * 删除车位信息
   * @param {*} data 
   */
  deleteInfo(data) {
    return this._post(`/etc/info/deleteInfo`, data);
  }

  /**
   * 查询车位收费信息报表
   * @param {*} data 
   */
  findDetailReport(data) {
    return this._post(`/etc/detail/findDetailReport`, data);
  }
  /**
   * etc财务报表
   * @param {*} data 
   */
  findEtcFee(data) {
    return this._post(`/etc/report/findEtcFee`,data);
  }
  /**
   * etc运营报表----日均周转率
   * @param {*} data 
   */
  findTurnoverRate(data) {
    return this._post(`/etc/report/findAvailabilityAndTurnover`,data);
  }
   /**
   * etc运营报表----车位利用率
   * @param {*} data 
   */
  findAvailability(data) {
    return this._post(`/etc/report/findAvailability`,data);
  }
   /**
   * etc运营报表----支付方式饼图
   * @param {*} data 
   */
  findPaymentChannelReport(data) {
    return this._post(`/etc/report/findPaymentChannelReport`,data);
  }
   /**
   * etc运营报表----订单支付情况饼图
   * @param {*} data 
   */
  findTransactionNumber(data) {
    return this._post(`/etc/report/findTransactionNumber`,data);
  }
}

export default Etc;