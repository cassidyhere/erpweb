const state = {
  info: {
    engineer_name: undefined,
    winner: "胜博",
    total: undefined,
    party_a: undefined,
    party_b: undefined,
    sign_time: undefined,
    remark: undefined,
    engineer_types: [],
    status: 0
  },
  test: []
}
  
const mutations = {
  SET_ENGINEER_INFO: (state, info) => {
    state.info = info
  }
}

const actions = {
  setEngineerInfo({ commit }, info) {
    commit('SET_ENGINEER_INFO', info)
  },
  clearEngineerInfo({ commit }) {
    const info = {
      engineer_name: undefined,
      winner: "胜博",
      total: undefined,
      party_a: undefined,
      party_b: undefined,
      sign_time: undefined,
      remark: undefined,
      engineer_types: [],
      status: 0
    }
    commit('SET_ENGINEER_INFO', info)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
