const state = {
  info: {
    id: undefined,
    order_code: undefined,
    order_name: undefined,
    link_contract: "true",
    contract_id: undefined,
    contract_name: undefined,
    supplier_id: undefined,
    supplier_name: undefined,
    engineer_id: undefined,
    engineer_name: undefined,
    total: 0,
    leftover_total: undefined,
    sign_time: undefined,
    sign_user: undefined,
    remark: undefined,
    materials: [],
    from_basecamp: "false",
    audit_status: undefined,
    status: undefined,
    ordered_total: undefined,
    payment: undefined,
    end_time: undefined,
    arrival_time: undefined,
  },
  updatingOrderId: undefined,
  lookingOrderId: undefined
}
  
const mutations = {
  SET_ORDER_INFO: (state, info) => {
    state.info = info
  },
  SET_UPDATING_ORDER_ID: (state, order_id) => {
    state.updatingOrderId = order_id
  },
  SET_LOOKING_ORDER_ID: (state, order_id) => {
    state.lookingOrderId = order_id
  }
}

const actions = {
  setOrderInfo({ commit }, info) {
    commit('SET_ORDER_INFO', info)
  },
  clearOrderInfo({ commit }) {
    const info = {
      id: undefined,
      order_code: undefined,
      order_name: undefined,
      link_contract: "true",
      contract_id: undefined,
      contract_name: undefined,
      supplier_id: undefined,
      supplier_name: undefined,
      engineer_id: undefined,
      engineer_name: undefined,
      total: 0,
      leftover_total: undefined,
      sign_time: undefined,
      sign_user: undefined,
      remark: undefined,
      materials: [],
      from_basecamp: "false",
      audit_status: undefined,
      status: undefined,
      ordered_total: undefined,
      payment: undefined,
      end_time: undefined,
      arrival_time: undefined,
    }
    commit('SET_ORDER_INFO', info)
  },
  setUpdatingOrderId({ commit }, order_id) {
    commit('SET_UPDATING_ORDER_ID', order_id)
  },
  setLookingOrderId({ commit }, order_id) {
    commit('SET_LOOKING_ORDER_ID', order_id)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
