const state = {
  info: {
    supplier_name: undefined,
    contact: undefined,
    phone: undefined,
    fax: undefined,
    telephone: undefined,
    remark: undefined,
    materials: [],
    eliminate: "false",
    msg: undefined,
    address: undefined,
  },
  updatingSupplierId: undefined
}
  
const mutations = {
  SET_SUPPLIER_INFO: (state, info) => {
    state.info = info
  },
  SET_UPDATING_SUPPLIER_ID: (state, supplier_id) => {
    state.updatingSupplierId = supplier_id
  }
}

const actions = {
  setSupplierInfo({ commit }, info) {
    commit('SET_SUPPLIER_INFO', info)
  },
  clearSupplierInfo({ commit }) {
    const info = {
      supplier_name: undefined,
      contact: undefined,
      phone: undefined,
      fax: undefined,
      telephone: undefined,
      remark: undefined,
      materials: [],
      eliminate: "false",
      msg: undefined,
      address: undefined,
    }
    commit('SET_SUPPLIER_INFO', info)
  },
  setUpdatingSupplierId({ commit }, supplier_id) {
    commit('SET_UPDATING_SUPPLIER_ID', supplier_id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
