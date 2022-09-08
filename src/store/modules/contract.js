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
  updatingContractId: undefined,
  lookingContractId: undefined
}
  
const mutations = {
  SET_CONTRACT_INFO: (state, info) => {
    state.info = info
  },
  SET_UPDATING_CONTRACT_ID: (state, contract_id) => {
    state.updatingContractId = contract_id
  },
  SET_LOOKING_CONTRACT_ID: (state, contract_id) => {
    state.lookingContractId = contract_id
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
  },
  setUpdatingContractId({ commit }, contract_id) {
    commit('SET_UPDATING_CONTRACT_ID', contract_id)
  },
  setLookingContractId({ commit }, contract_id) {
    commit('SET_LOOKING_CONTRACT_ID', contract_id)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
