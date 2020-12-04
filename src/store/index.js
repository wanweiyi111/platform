import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import _ from 'lodash';
import LightInfo from './modules/LightInfo.js';
import Unions from './modules/Unions.js';
import Live from './modules/Live.js';
import Api from "@/api/";

const api = new Api();

Vue.use(Vuex);


const store = new Store({
    state: {
        token: '',
        userInfo: {},
        curProject: {},
        projectList: [],
        commonParams: {},
        showStatus: true,
        menuStatus: false,
        mapCenter: [114.121571, 22.601765],
        alertQueue: [],
        ctrlMsgIds: [],
        curMenuId: [], // 当前路由id
        curMenuParentId: [] // 当前路由父级id
    },
    getters: {
        showStatus(state) {
            return state.showStatus;
        },
        commonParams(state) {
            return state.commonParams;
        },
        alertQueue(state) {
            return state.alertQueue;
        },
        curMenuId(state) {
            return state.curMenuId;
        },
    },
    mutations: {
        setCurrentMenu(state, id) {
            state.curMenuId = []
            state.curMenuId.push(id)
        },
        setCurrentParentMenu(state, id) {
            state.curMenuParentId = []
            state.curMenuParentId.push(id)
        },
        changeShowStatus(state, type) {
            state[type] = !state[type];
        },
        setMapCenter(stata, val) {
            stata.mapCenter = val;
        },
        setCommonParams(state, val) {
            state.commonParams = val;
        },
        pushAlertQueue(state, item) {
            if (_.isArray(item)) {
                state.alertQueue.unshift(...item);
                return;
            }
            if (state.alertQueue.find(val => val.code === item.code)) {
                return;
            }
            if (state.alertQueue.length >= 10) {
                state.alertQueue.pop();
            }
            state.alertQueue.unshift(item);
        },
        setloginInfo(state, data) {
            sessionStorage.setItem('token', data.token);
            state.token = data.token;
            state.userInfo = data.user;
            state.userInfo.permissions = data.permissions;
            state.userInfo.roles = data.roles;
            state.projectList = data.project;
            state.curProject = data.project[0] || {};
        },
        addCtrlMsgId(state, msgId) {
            if (state.ctrlMsgIds.includes(msgId)) {
                return;
            }
            state.ctrlMsgIds.push(msgId);
        },
        removeCtrlMsgId(state, msgId) {
            if (state.ctrlMsgIds.includes(msgId)) {
                state.ctrlMsgIds.splice(state.ctrlMsgIds.indexOf(msgId), 1);
            }
        },
        setPermissions(state, data) {
            let p = null;
            if (_.isArray(data)) {
                p = data;
            } else {
                p = data.permissions;
            }

            // console.info('setPermissions', p);
            sessionStorage.setItem('permissions', JSON.stringify(p));
            state.permissions = p;
        }
    },
    actions: {
        showStatusAction(context, type) {
            context.commit('showStatus', type)
        },
        setMapCenterAction(context, val) {
            context.commit('setMapCenter', val)
        },
        async getUserInfoByToken({ commit }, token) {
            try {
                let res = await api.getUserInfoByToken(token);
                if (!res || res.code != 200) {
                    commit("setPermissions", []);
                    return;
                }
                commit("setPermissions", res.data);
            } catch (err) {
                commit("setPermissions", []);
                console.warn('getUserInfoByToken', err);
            }

        }
    },
    modules: {
        LightInfo,
        Unions,
        Live
    }
});

export default store