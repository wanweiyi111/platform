let config = null;
const hostname = location.hostname;
if (hostname === '120.24.34.198') {
  config = {
    MQTT: {
      ip: hostname,
      port: '8083'
    },
    H5SS: {
      ip: hostname,
      port: '20199'
    }
  }
} else if (hostname === '27.17.34.234') {
  config = {
    MQTT: {
      ip: hostname,
      port: '28083'
    },
    H5SS: {
      ip: hostname,
      port: '18080'
    }
  }
} else if (hostname === '120.79.223.229') {
  config = {
    MQTT: {
      ip: '120.24.34.198',
      port: '8083'
    },
    H5SS: {
      ip: '120.24.34.198',
      port: '20199'
    }
  }
} else if (hostname === 'http://new.uvcity.cn/') {
  config = {
    MQTT: {
      ip: '120.24.34.198',
      port: '8083'
    },
    H5SS: {
      ip: '120.24.34.198',
      port: '20199'
    }
  }
} else if (hostname === 'localhost') {
  config = {
    MQTT: {
      ip: '120.24.34.198',
      port: '8083'
    },
    H5SS: {
      ip: '120.24.34.198',
      port: '20199'
    }
  }
} else {
  config = {
    MQTT: {
      ip: '120.24.34.198',
      port: '8083'
    },
    H5SS: {
      ip: '120.24.34.198',
      port: '20199'
    }
  }
}
config.title = '智慧灯杆管理系统';
window.EnvConfig = config;
// window.EnvConfig = {
//   MQTT: {
//     ip: '120.24.34.198',
//     port: '20003'
//   },
//   H5SS: {
//     ip: '120.24.34.198',
//     port: '18080'
//   }
// }