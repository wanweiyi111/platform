const paymentStatusText = { 0: '未支付', 1: '已支付', 2: '已下单' };
export function getPaymentStatus(status) {
  return paymentStatusText[status] || '';
}

const paymentChannelText = { 1: '微信支付', 2: '支付宝支付', 3: '银联支付' };
export function getPaymentChannel(channel) {
  return paymentChannelText[channel] || '';
}

const dataExceptionFlag = { 0: '无异常', '-1': '异常', '-2': '手动创建的' }
export function getDataExceptionFlag(flag) {
  return dataExceptionFlag[flag] || '';
}

const parkingStatus = { '0': '空置', '1': '使用中', '2': '异常' }
export function getParkingStatus(flag) {
  return parkingStatus[flag] || '';
}

export let EquipmentTypeEnum = {
  '1': "智慧杆",
  '2': "盒子",
  '4096': "IoT设备",
  '4112': '智慧照明',
  '4128': '安防监控',
  '4129': '智慧WIFI',
  '4144': '信息发布',
  '4176': '环境监测',
  '4192': '智慧雷达',
  '4208': '智能柜锁',
  '4240': '应急呼叫',
  '4272': '公共广播',
  '8193': '充电桩',
};