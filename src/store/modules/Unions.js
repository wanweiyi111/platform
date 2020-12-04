import _ from "lodash";
import Unions from "@/api/Unions.js";
import Pole from "@/api/Pole.js";

const unions = new Unions();
const pole = new Pole();

const state = {
  poleList: [],
  triggerList: [],
  actionList: [],
  ruleObj: {}
}

// 定义 getters
const getters = {
  triggerList: (state) => equipmentType => {
    if (!equipmentType) {
      return state.triggerList;
    }
    return state.triggerList.filter(item => item.equipmentType == equipmentType)
  },
  actionList: (state) => equipmentType => {
    if (!equipmentType) {
      return state.actionList;
    }
    return state.actionList.filter(item => item.equipmentType == equipmentType)
  },
  poleList: state => state.poleList,
  ruleObj: state => state.ruleObj
}

const actions = {
  listTrigger({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await unions.listTrigger();
        if (!res || res.code !== '200') {
          commit("triggerList", []);
          reject();
          return;
        }
        commit("triggerList", res.data);
        resolve(res);
      } catch (err) {
        reject(err);
        // console.info(err);
      }
    });
  },
  listAction({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await unions.listAction();
        if (!res || res.code !== '200') {
          commit("actionList", []);
          reject();
          return;
        }
        commit("actionList", res.data);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  },
  loadAllPoles({ commit }, queryObj) {
    return new Promise((resolve, reject) => {
      _.isObject(queryObj) && delete queryObj.id;
      pole.findByProjectId(queryObj).then(res => {
        if (!res || res.code !== '200') {
          commit("setPoleList", []);
          reject()
          return;
        }
        commit("setPoleList", res.data);
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    });
  },
  queryRule({ commit }, id) {
    return new Promise((resolve, reject) => {
      unions.ruleQuery(id).then(res => {
        if (!res || res.code !== '200') {
          commit("setUnionRuleObj", {});
          reject()
          return;
        }
        commit("setUnionRuleObj", res.data);
        resolve(res.data);
      }).catch(err => {
        reject(err);
      })
    });
  }
}

const mutations = {
  triggerList(state, result) {
    state.triggerList = result;
  },
  actionList(state, result) {
    state.actionList = result;
  },
  setPoleList(state, list) {
    state.poleList = list;
  },
  setUnionRuleObj(state, obj) {
    // state.ruleObj = obj;
    state.ruleObj = { ...state.ruleObj, ...obj };
    console.warn('setUnionRuleObj', state.ruleObj)
  }
}
// 最后统一导出
export default {
  state,
  getters,
  actions,
  mutations
}