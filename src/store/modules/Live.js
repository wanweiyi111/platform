import api from "@/api/";

const state = {
    videoNum: '',
    selectedVideo: ''
}

// 定义 getters
const getters = {
    getSelectVideo: (status) => status.selectedVideo,
}

const actions = {
    async selectVideo({ commit, state }) {
        commit("selectedVideo", res.data);
    }
}

const mutations = {
    selectedVideo(state, result) {
        state.selectedVideo = result;
    }
}
// 最后统一导出
export default {
    state,
    getters,
    actions,
    mutations
}