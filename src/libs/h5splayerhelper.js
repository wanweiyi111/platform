import { H5sPlayerWS, H5sPlayerHls, H5sPlayerRTC } from './h5splayernew.js'
/** 
 * Check on iOS platform
*/
function H5siOS() {

  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ];

  if (navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()) { return true; }
    }
  }

  return false;
}

/** 
 *=================H5Player Create
 *
 */

function H5sPlayerCreate(conf) {
  var player;

  if (H5siOS()) {
    player = new H5sPlayerRTC(conf);
  } else {
    player = new H5sPlayerWS(conf);
  }
  return player;
}

// 2020-9-28 新增视频历史回放
function H5sPlayerRecordCreate(conf) {
  var player;
  player = new H5sPlayerRTC(conf);
  return player;
}

/** 
 *=================H5Player Delete
 *
 */
function H5sPlayerDelete(player) {
  // delete player;

  return true;
}

export { H5siOS, H5sPlayerCreate, H5sPlayerRecordCreate }

