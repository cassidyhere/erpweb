const state = {
  inInfo: {
    id: undefined,
    purchase_order_id: undefined,
    purchase_order_name: undefined,
    contarct_name: undefined,
    supplier_name: undefined,
    engineer_name: undefined,
    total: undefined,
    remark: undefined,
    handler: undefined,
    handling_time: undefined,
    materials: []
  },
  updatingInId: undefined,
  lookingInId: undefined
}
  
const mutations = {
  SET_IN_INFO: (state, info) => {
    state.inInfo = info
  },
  SET_UPDATING_IN_ID: (state, order_id) => {
    state.updatingInId = order_id
  },
  SET_LOOKING_IN_ID: (state, order_id) => {
    state.lookingInId = order_id
  }
}

const actions = {
  setInInfo({ commit }, info) {
    commit('SET_IN_INFO', info)
  },
  clearInInfo({ commit }) {
    const info = {
      id: undefined,
      purchase_order_id: undefined,
      purchase_order_name: undefined,
      contarct_name: undefined,
      supplier_name: undefined,
      engineer_name: undefined,
      total: undefined,
      remark: undefined,
      handler: undefined,
      handling_time: undefined,
      materials: []
    }
    commit('SET_IN_INFO', info)
  },
  setUpdatingInId({ commit }, order_id) {
    commit('SET_UPDATING_IN_ID', order_id)
  },
  setLookingInId({ commit }, order_id) {
    commit('SET_LOOKING_IN_ID', order_id)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
