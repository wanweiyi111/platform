import axios from 'axios'
import router from '@/router'
import Vue from 'vue'

let permissions = []
function getPermisions() {
  if (!permissions || permissions.length === 0) {
    permissions = JSON.parse(sessionStorage.getItem('permissions'))
  }
  return permissions
}

/**
 * 判断url是否被屏蔽
 * @param {*} url
 */
function isUrlAllowed(url) {
  // debugger;
  if (!url) {
    return false
  }
  let permissions = getPermisions(),
    item = ''
  let arr = url.split('?')
  url = arr[0]
  url = url.replace(/\/\d+\/\d+/g, '').replace(/\/\d+/g, '')

  if (!permissions || permissions.length === 0) {
    return true
  }
  for (var i = 0, len = permissions.length; i < len; i++) {
    item = permissions[i]
    if (!item) {
      continue
    }
    if (item.includes(url)) {
      return true
    }
  }

  return false
}

let httpCount = 0

// 使用由库提供的配置的默认值来创建实例
// 此时超时配置的默认值是 `0`
const http = axios.create()

// 覆写库的超时默认值
// 现在，在超时前，所有请求都会等待 2.5 秒
http.defaults.timeout = 8000
http.defaults.baseURL = '/api/'

// 添加请求拦截器
http.interceptors.request.use(
  function(config) {
    // let permissions = sessionStorage.getItem('permissions')
    // let arr = config.url.split('?')
    // let url = arr[0] + '/'
    // if (permissions && permissions.length > 0 && permissions.includes(url)) {
    //   const msg = '您没有此操作权限';
    //   Vue.bus.emit('http-blocked', msg);
    //   return Promise.reject(new Error(msg));
    // }
    Vue.bus.emit('loading', ++httpCount)

    config.headers = {
      Authentication: sessionStorage.getItem('token') || ''
    }
    // 在发送请求之前做些什么
    return config
  },
  function(error) {
    Vue.bus.emit('loading', --httpCount)
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
http.interceptors.response.use(
  function(response) {
    Vue.bus.emit('loading', --httpCount);
    if(response.data.code == '401') {
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    }
    // 对响应数据做点什么
    return response.data
  },
  function(error) {
    Vue.bus.emit('loading', --httpCount)
    //拦截未登录的请求跳转到登陆页
    let status = error.response.status
    switch (status) {
      case 401:
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
        break
      default:
        return Promise.reject(error)
    }
  }
)

export default http
