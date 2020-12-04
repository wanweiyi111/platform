import api from "@/api/";

const state = {
    lightInfoList: []
}

// 定义 getters
const getters = {
    lightInfoList: (status) => status.lightInfoList,
}

const actions = {
    async findByNameOrLocation({ commit, state }) {
        let res = await api.findByNameOrLocation().catch((err) => {
            console.log(err);
        });
        if (!res || res.code !== 200) {
            commit("lightInfoList", []);
            return;
        }
        commit("lightInfoList", res.data);
    }
}

const mutations = {
        lightInfoList(state, result) {
            state.lightInfoList = result;
        }
    }
    // 最后统一导出
export default {
    state,
    getters,
    actions,
    mutations
}