import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import CtrlHome from './views/CtrlHome.vue'

Vue.use(Router)

const RouteJump = resolve => require(["@/views/platform/RouteJump.vue"], resolve)
// const RouteJumpCrumbs = resolve => require(["@/views/platform/RouteJumpCrumbs.vue"], resolve)
const ApplicationLight = resolve => require(["@/views/ApplicationLight.vue"], resolve)
const ApplicationLightTaskAdd = resolve => require(["@/views/ApplicationLightTaskAdd.vue"], resolve)
const ApplicationPLCLight = resolve => require(["@/views/ApplicationPLCLight.vue"], resolve)
const ApplicationDisplayList = resolve => require(["@/views/display/List.vue"], resolve)
const ApplicationDisplayUpload = resolve => require(["@/views/display/Upload.vue"], resolve)
const ApplicationDisplayAddProgram = resolve => require(["@/views/display/AddProgram.vue"], resolve)
const ApplicationDisplayAddTask = resolve => require(["@/views/display/AddTask.vue"], resolve)
const ApplicationEnvironmentMonitor = resolve => require(["@/views/ApplicationEnvironmentMonitor.vue"], resolve)
const ApplicationCamera = resolve => require(["@/views/ApplicationCamera.vue"], resolve)
const ApplicationWifi = resolve => require(["@/views/ApplicationWifi.vue"], resolve)
const ApplicationRadar = resolve => require(["@/views/ApplicationRadar.vue"], resolve)
const ApplicationLock = resolve => require(["@/views/ApplicationLock.vue"], resolve)
const ApplicationPolice = resolve => require(["@/views/ApplicationPolice.vue"], resolve)
const ApplicationBroadcastList = resolve => require(["@/views/broadcast/List.vue"], resolve)
const ApplicationBroadcastAddTask = resolve => require(["@/views/broadcast/AddTask.vue"], resolve)
const ApplicationBroadcastAddProgram = resolve => require(["@/views/broadcast/AddProgram.vue"], resolve)

export default new Router({
  mode: 'history',
  // mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/',
          component: CtrlHome,
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/platform',
      name: 'platform',
      meta: {
        title: '管理平台'
      },
      component: () => import('./views/platform/Management.vue'),
      children: [
        {
          path: '/application-manage',
          name: 'applicationManage',
          redirect: "application-manage/light",
          meta: {
            "title": "应用管理",
            id: 20016,
            "icon": "dashboard"
          },
          component: RouteJump,
          children: [
            {
              path: 'light',
              meta: {
                parentId: 20016,
                id: 20017,
                "title": "智慧照明",
                "icon": "iconlightbulb1"
              },
              component: ApplicationLight,
            },
            {
              path: 'PLClight',
              meta: {
                parentId: 20016,
                id: 40422,
                "title": "PLC照明",
                "icon": "iconlightbulb"
              },
              component: ApplicationPLCLight,
            },
            {
              path: 'camera',
              meta: {
                parentId: 20016,
                id: 20009,
                "title": "安防监控",
                "icon": "iconwebcam"
              },
              component: ApplicationCamera,
            },
            {
              path: 'display',
              meta: {
                parentId: 20016,
                id: 20008,
                "title": "信息发布",
                "icon": "iconscreen"
              },
              component: RouteJump,
              redirect: "./display/list",
              children: [{
                path: 'list',
                meta: {
                  parentId: 20016,
                  id: 20008,
                  "title": "信息发布",
                  "icon": "iconscreen"
                },
                component: ApplicationDisplayList,
              },
              {
                path: 'upload',
                meta: {
                  parentId: 20016,
                  id: 20008,
                  "title": "添加媒体",
                  "icon": "iconupload"
                },
                component: ApplicationDisplayUpload,
              },
              {
                path: 'add-program',
                meta: {
                  parentId: 20016,
                  id: 20008,
                  "title": "新建节目",
                  "icon": "iconindent"
                },
                component: ApplicationDisplayAddProgram,
              }, {
                path: 'add-task',
                meta: {
                  parentId: 20016,
                  id: 20008,
                  "title": "新建任务",
                  "icon": "iconclipboard-list-check"
                },
                component: ApplicationDisplayAddTask,
              }]
            },
            {
              path: 'environment-monitor',
              meta: {
                parentId: 20016,
                id: 20007,
                "title": "环境监测",
                "icon": "iconleaf"
              },
              component: ApplicationEnvironmentMonitor,
            },
            {
              path: 'wifi',
              meta: {
                parentId: 20016,
                id: 40333,
                "title": "智慧WIFI",
                "icon": "iconwifi"
              },
              component: ApplicationWifi
            },
            {
              path: 'radar',
              meta: {
                parentId: 20016,
                id: 20018,
                "title": "智慧雷达",
                "icon": "iconleida"
              },
              component: ApplicationRadar
            },
            {
              path: 'smart-lock',
              meta: {
                parentId: 20016,
                id: 40348,
                "title": "智能柜锁",
                "icon": "iconlock-alt"
              },
              component: ApplicationLock
            },
            {
              path: 'police',
              meta: {
                parentId: 20016,
                id: 40326,
                "title": "应急呼叫",
                "icon": "iconengine-warning"
              },
              component: ApplicationPolice
            },
            {
              path: 'broad-cast',
              meta: {
                parentId: 20016,
                id: 40351,
                "title": "公共广播",
                "icon": "iconbroadcast-tower"
              },
              component: RouteJump,
              redirect: "/application-manage/broad-cast/list",
              children: [{
                path: 'list',
                meta: {
                  parentId: 20016,
                  id: 40351,
                  "title": "公共广播",
                  "icon": "iconbroadcast-tower"
                },
                component: ApplicationBroadcastList,
              },
              {
                path: 'add-program',
                meta: {
                  parentId: 20016,
                  id: 40351,
                  "title": "创建节目",
                  "icon": "iconindent"
                },
                component: ApplicationBroadcastAddProgram,
              },
              {
                path: 'add-task',
                meta: {
                  parentId: 20016,
                  id: 40351,
                  "title": "新建任务",
                  "icon": "iconclipboard-list-check"
                },
                component: ApplicationBroadcastAddTask,
              }]
            },
            {
              path: 'light-add-task',
              meta: {
                parentId: 20016,
                id: 20017,
                "title": "新建照明任务",
                "icon": "edit"
              },
              component: ApplicationLightTaskAdd,
            },
            {
              path: 'manager-device',
              component: () => import('./views/LightPoleDeviceManager.vue')
            },
            {
              path: 'linkage',
              redirect: "linkage/list",
              meta: {
                parentId: 20016,
                id: 20010,
                "title": "联动管理",
                "icon": "iconcompress-arrows-alt"
              },
              component: RouteJump,
              children: [{
                path: 'list',
                meta: {
                  parentId: 20016,
                  id: 20010,
                  "title": "联动管理",
                  "icon": "iconcompress-arrows-alt"
                },
                component: () => import('./views/application/linkage/Linkage.vue')
              }]

            },
            {
              path: 'other-broad-cast',
              meta: {
                id: 40420,
                parentId: 20016,
                "title": "智慧广播",
                "icon": "iconbroadcast-tower"
              },
              component: () => import('./views/ApplicationOtherBroadcast.vue')
            },
            {
              path: 'alarm',
              meta: {
                parentId: 20016,
                id: 40424,
                "title": "设备告警",
                "icon": "iconexclamation-triangle"
              },
              component: () => import('./views/ApplicationAlarm.vue')
            },
            {
              path: 'etc',
              meta: {
                parentId: 20016,
                id: 40307,
                "title": "智慧停车",
                "icon": "icongas-pump"
              },
              component: () => import('./views/application/etc/ApplicationEtc.vue'),
            },
          ]
        },
        {
          path: '/system',
          meta: {
            id: 20005,
            "title": "系统管理",
            "icon": "iconcog"
          },
          redirect: "/system/power",
          component: RouteJump,
          children: [
            {
              path: 'power',
              redirect: "power/list",
              meta: {
                parentId: 20005,
                id: 20015,
                "title": "权限管理",
                "icon": "iconuser-lock"
              },
              component: RouteJump,
              children: [
                {
                  path: 'list',
                  meta: {
                    parentId: 20005,
                    id: 20015,
                    "title": "权限管理",
                    "icon": "iconuser-lock"
                  },
                  component: () => import('./views/system/Power.vue')
                },
                {
                  path: 'power-add-role',
                  meta: {
                    parentId: 20005,
                    id: 20015,
                    "title": "新建角色",
                    "icon": "iconuser-cog"
                  },
                  component: () => import('./views/system/PowerRoleAdd.vue')
                },
                {
                  path: 'power-control',
                  meta: {
                    parentId: 20005,
                    id: 20015,
                    "title": "添加权限",
                    "icon": "iconuser-cog"
                  },
                  component: () => import('./views/system/PowerApiControlAdd.vue')
                },
                {
                  path: 'init',
                  meta: {
                    parentId: 20005,
                    id: 20015,
                    "title": "项目初始化",
                    "icon": "iconwrench"
                  },
                  component: () => import('./views/system/PowerInitProject.vue')
                },
              ]
            },
            {
              path: 'init',
              meta: {
                parentId: 20005,
                id: 40314,
                "title": "项目初始化",
                "icon": "iconwrench"
              },
              component: () => import('./views/system/InitProject.vue')
            },
          ]
        },
        {
          path: '/resources',
          meta: {
            id: 20003,
            "title": "资源管理",
            "icon": "iconbox-full"
          },
          redirect: "/resources/light-pole",
          component: RouteJump,
          children: [
            {
              path: 'light-pole',
              meta: {
                parentId: 20003,
                id: 20011,
                "title": "智慧杆管理",
                "icon": "icondg"
              },
              component: () => import('./views/resources/LightPoleManager.vue')
            },
            {
              path: 'device-manager',
              meta: {
                parentId: 20003,
                id: 20012,
                "title": "设备管理",
                "icon": "iconbox-alt"
              },
              component: () => import('./views/resources/DeviceManager.vue')
            },
            {
              path: 'device-list',
              meta: {
                parentId: 20003,
                id: 20013,
                "title": "设备清单",
                "icon": "iconballot"
              },
              component: () => import('./views/resources/DeviceList.vue')
            },
          ]
        },
        {
          path: '/operation',
          meta: {
            id: 20004,
            "title": "运维管理",
            "icon": "iconclipboard-list-check"
          },
          redirect: "/operation/log",
          component: RouteJump,
          children: [
            {
              path: 'log',
              meta: {
                parentId: 20004,
                id: 20014,
                "title": "日志管理",
                "icon": "iconballot"
              },
              component: () => import('./views/operation/Log.vue')
            },
            {
              path: 'work-order',
              meta: {
                parentId: 20004,
                id: 40044,
                "title": "工单管理",
                "icon": "icongongdan"
              },
              component: () => import('./views/operation/WorkOrder.vue')
            },
            {
              path: 'device-inspect',
              meta: {
                parentId: 20004,
                id: 40046,
                "title": "巡检管理",
                "icon": "iconchangyongtubiao_zidongxunjian"
              },
              component: () => import('./views/operation/DeviceInspect.vue')
            },
          ]
        },
      ]
    },
    {
      path: '/ctrl',
      name: 'ctrl',
      meta: {
        title: '物联网应用平台'
      },
      component: Home,
      children: [
        // {
        //   path: 'video-list',
        //   name: 'video-list',
        //   component: () => import('./views/VideoList.vue')
        // },
        // {
        //   path: 'light-pole',
        //   name: 'light-pole',
        //   component: () => import('./views/LightPoleManager.vue')
        // },
        // {
        //   path: 'display',
        //   component: CtrlDisplay
        // },
        // {
        //   path: 'warning',
        //   component: () => import('./views/WarningList.vue')
        // },
        // {
        //   path: 'display-upload',
        //   component: () => import('./views/CtrlDisplayUpload.vue')
        // },
        // {
        //   path: 'info-add-task',
        //   component: () => import('./views/CtrlInfoTaskAdd.vue')
        // },
        // {
        //   path: 'device-manager',
        //   component: () => import('./views/DeviceManager.vue')
        // },
        // {
        //   path: 'power-management',
        //   component: () => import('./views/system/CtrlPowerManagement.vue')
        // },
        // {
        //   path: 'create-project',
        //   component: () => import('./views/CreateProject.vue')
        // },
        // {
        //   path: 'power-add-role',
        //   component: () => import('./views/CtrlPowerRoleAdd.vue')
        // },
        // {
        //   path: 'power-control',
        //   component: () => import('./views/CtrlPowerControl.vue')
        // },
        // {
        //   path: 'linkage',
        //   component: () => import('./views/Linkage.vue')
        // },
        // {
        //   path: 'linkage-edit',
        //   component: () => import('./views/LinkageOperat.vue'),
        //   props: true
        // },
        // {
        //   path: 'linkage-operat/:id',
        //   component: () => import('./views/LinkageOperat.vue'),
        //   props: true
        // },
        // {
        //   path: 'linkage-operat/:id/:id2',
        //   component: () => import('./views/LinkageOperat.vue'),
        //   props: true
        // },
        // {
        //   path: 'device-list',
        //   component: () => import('./views/DeviceList.vue')
        // },
        {
          path: 'manager-device',
          // name: "manager-device",
          component: () => import('./views/LightPoleDeviceManager.vue')
        },
        // {
        //   path: 'work-order',
        //   component: () => import('./views/WorkOrder.vue')
        // },
        // {
        //   path: 'log',
        //   component: () => import('./views/Log.vue')
        // },
        // {
        //   path: 'device-inspect',
        //   component: () => import('./views/DeviceInspect.vue')
        // },
        //语音识别
        // {
        //   path: 'voice',
        //   component: () => import('./views/Voice/index.vue')
        // },
        // {
        //   path: 'police',
        //   component: () => import('./views/police.vue')
        // }, {
        //   path: 'charge',
        //   component: () => import('./views/charge.vue')
        // }, {
        //   path: 'smart-lock',
        //   component: () => import('./views/SmartLock.vue')
        // }
      ]
    }
  ]
})
