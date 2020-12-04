import Vue from 'vue';
import utils from '@/utils';

Vue.filter('time', function (value) {
  if (!value) return '';
  return utils.toTime(value);
});

Vue.filter('date', function (value) {
  if (!value) return '';
  return utils.toDate(value);
});

Vue.filter('fromNow', function (value) {
  if (!value) return '';
  return utils.fromNow(value);
});

Vue.filter('formatNetworkState', function (networkState) {
  return utils.getNetworkStateText(networkState);
});

Vue.filter('formatEquipmentStatus', function (equipmentStatus) {
  return utils.getEquipmentStatusText(equipmentStatus);
});

Vue.filter('formatEventStatus', function (eventStatus) {
  return utils.getEventStatus(eventStatus);
});
Vue.filter('formatWifiStatus', function (wifiType) {
  return utils.getWifiStatus(wifiType);
});
// 告警类型
Vue.filter('formatWarningFaultType', function (faultType) {
  return utils.getWarningFaultTypeText(faultType);
});
// 设备类型 
Vue.filter('formatEquipmentTypeText', function (EquipmentType) {
  return utils.getEquipmentTypeText(EquipmentType);
});
// ETC 支付渠道 
Vue.filter('formatEtcPaymentChannelText', function (Channel) {
  return utils.getParkingPaymentChannelText(Channel);
});
// ETC 支付状态
Vue.filter('formatEtcPaymentStatusText', function (Status) {
  return utils.getParkingPaymentStatusText(Status);
});