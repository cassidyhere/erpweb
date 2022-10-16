const state = {
  updatingId: undefined,
  info: {
    engineer_code: undefined,
    engineer_name: undefined,
    winner: "胜博",
    total: undefined,
    party_a: undefined,
    party_b: undefined,
    sign_time: undefined,
    remark: undefined,
    engineer_types: [],
    extension: undefined,
    settlement: undefined,
    status: 0
  },
  test: []
}
  
const mutations = {
  SET_UPDATING_ID: (state, engineer_id) => {
    state.updatingId = engineer_id
  },
  SET_ENGINEER_INFO: (state, info) => {
    state.info = info
  }
}

const actions = {
  setEngineerId({ commit }, engineer_id) {
    commit('SET_UPDATING_ID', engineer_id)
  },
  setEngineerInfo({ commit }, info) {
    commit('SET_ENGINEER_INFO', info)
  },
  clearEngineerInfo({ commit }) {
    const info = {
      engineer_code: undefined,
      engineer_name: undefined,
      winner: "胜博",
      total: undefined,
      party_a: undefined,
      party_b: undefined,
      sign_time: undefined,
      remark: undefined,
      engineer_types: [],
      extension: undefined,
      settlement: undefined,
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
