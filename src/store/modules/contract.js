const state = {
  info: {
    id: undefined,
    contract_code: undefined,
    contract_name: undefined,
    supplier_id: undefined,
    supplier_name: undefined,
    engineer_id: undefined,
    engineer_name: undefined,
    total: undefined,
    sign_time: undefined,
    sign_user: undefined,
    remark: undefined,
    materials: [],
    from_basecamp: "false",
    audit_status: undefined,
    status: undefined,
    ordered_total: undefined,
    payment: undefined,
    end_time: undefined
  },
  test: []
}
  
const mutations = {
  SET_CONTRACT_INFO: (state, info) => {
    state.info = info
  }
}

const actions = {
  setContractInfo({ commit }, info) {
    commit('SET_CONTRACT_INFO', info)
  },
  clearContractInfo({ commit }) {
    const info = {
      id: undefined,
      contract_code: undefined,
      contract_name: undefined,
      supplier_id: undefined,
      supplier_name: undefined,
      engineer_id: undefined,
      engineer_name: undefined,
      total: undefined,
      sign_time: undefined,
      sign_user: undefined,
      remark: undefined,
      materials: [],
      from_basecamp: "false",
      audit_status: undefined,
      status: undefined,
      ordered_total: undefined,
      payment: undefined,
      end_time: undefined
    }
    commit('SET_CONTRACT_INFO', info)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
