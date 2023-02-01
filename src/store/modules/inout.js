const state = {
  // in
  inInfo: {
    id: undefined,
    purchase_order_id: undefined,
    purchase_order_name: undefined,
    contarct_name: undefined,
    supplier_name: undefined,
    engineer_name: undefined,
    total: undefined,
    remark: undefined,
    order_user: undefined,
    inout_time: undefined,
    materials: []
  },
  updatingInId: undefined,
  lookingInId: undefined,
  // pick
  pickInfo: {
    id: undefined,
    engineer_id: undefined,
    engineer_name: undefined,
    total: undefined,
    remark: undefined,
    order_user: undefined,
    inout_time: undefined,
    materials: []
  },
  updatingPickId: undefined,
  lookingPickId: undefined,
  // slip
  slipInfo: {
    id: undefined,
    purchase_order_id: undefined,
    purchase_order_name: undefined,
    contarct_name: undefined,
    supplier_name: undefined,
    engineer_name: undefined,
    total: undefined,
    remark: undefined,
    order_user: undefined,
    inout_time: undefined,
    materials: []
  },
  updatingSlipId: undefined,
  lookingSlipId: undefined,
  // return
  returnInfo: {
    id: undefined,
    supplier_name: undefined,
    total: undefined,
    remark: undefined,
    order_user: undefined,
    inout_time: undefined,
    materials: []
  },
  updatingReturnId: undefined,
  lookingReturnId: undefined
}
  
const mutations = {
  // in
  SET_IN_INFO: (state, info) => {
    state.inInfo = info
  },
  SET_UPDATING_IN_ID: (state, order_id) => {
    state.updatingInId = order_id
  },
  SET_LOOKING_IN_ID: (state, order_id) => {
    state.lookingInId = order_id
  },
  // pcik
  SET_PICK_INFO: (state, info) => {
    state.pickInfo = info
  },
  SET_UPDATING_PICK_ID: (state, order_id) => {
    state.updatingPickId = order_id
  },
  SET_LOOKING_PICK_ID: (state, order_id) => {
    state.lookingPickId = order_id
  },
  // slip
  SET_SLIP_INFO: (state, info) => {
    state.slipInfo = info
  },
  SET_UPDATING_SLIP_ID: (state, order_id) => {
    state.updatingSlipId = order_id
  },
  SET_LOOKING_SLIP_ID: (state, order_id) => {
    state.lookingSlipId = order_id
  },
  // return
  SET_RETURN_INFO: (state, info) => {
    state.returnInfo = info
  },
  SET_UPDATING_RETURN_ID: (state, order_id) => {
    state.updatingReturnId = order_id
  },
  SET_LOOKING_IRETURN_ID: (state, order_id) => {
    state.lookingReturnId = order_id
  }
}

const actions = {
  // in
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
      order_user: undefined,
      inout_time: undefined,
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
  // pick
  setPickInfo({ commit }, info) {
    commit('SET_PICK_INFO', info)
  },
  clearPickInfo({ commit }) {
    const info = {
      id: undefined,
      engineer_id: undefined,
      engineer_name: undefined,
      total: undefined,
      remark: undefined,
      order_user: undefined,
      inout_time: undefined,
      materials: []
    }
    commit('SET_PICK_INFO', info)
  },
  setUpdatingPickId({ commit }, order_id) {
    commit('SET_UPDATING_PICK_ID', order_id)
  },
  setLookingPickId({ commit }, order_id) {
    commit('SET_LOOKING_PICK_ID', order_id)
  },
  // slip
  setSlipInfo({ commit }, info) {
    commit('SET_SLIP_INFO', info)
  },
  clearSlipInfo({ commit }) {
    const info = {
      id: undefined,
      purchase_order_id: undefined,
      purchase_order_name: undefined,
      contarct_name: undefined,
      supplier_name: undefined,
      engineer_name: undefined,
      total: undefined,
      remark: undefined,
      order_user: undefined,
      inout_time: undefined,
      materials: []
    }
    commit('SET_SLIP_INFO', info)
  },
  setUpdatingSlipId({ commit }, order_id) {
    commit('SET_UPDATING_SLIP_ID', order_id)
  },
  setLookingSlipId({ commit }, order_id) {
    commit('SET_LOOKING_SLIP_ID', order_id)
  },
  // return
  setReturnInfo({ commit }, info) {
    commit('SET_RETURN_INFO', info)
  },
  clearReturnInfo({ commit }) {
    const info = {
      id: undefined,
      supplier_name: undefined,
      total: undefined,
      remark: undefined,
      order_user: undefined,
      inout_time: undefined,
      materials: []
    }
    commit('SET_RETURN_INFO', info)
  },
  setUpdatingReturnId({ commit }, order_id) {
    commit('SET_UPDATING_RETURN_ID', order_id)
  },
  setLookingReturnId({ commit }, order_id) {
    commit('SET_LOOKING_RETURN_ID', order_id)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
