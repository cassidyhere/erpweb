<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :model="temp"
      :rules="rules"
      label-width="140px"
      style="min-width: 1200px; max-width: 2000px"
    >
      <el-form-item v-if="status!=='create'" class="head-item" label="订单编号:" prop="order_code">
        <span>{{ temp.order_code }}</span>
      </el-form-item>
      <el-row>
        <el-col :span="10">
          <el-form-item class="head-item" label="订单名称:" prop="order_name">
            <el-input v-model="temp.order_name" style="width: 300px;" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否关联采购合同:" prop="link_contract" class="head-item">
            <el-radio-group v-if="temp.audit_status===2" v-model="temp.link_contract" disabled>
              <el-radio label=true>是</el-radio>
              <el-radio label=false>否</el-radio>
            </el-radio-group>
            <el-radio-group v-else v-model="temp.link_contract" @change="handleLinkContract">
              <el-radio label=true>是</el-radio>
              <el-radio label=false>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="temp.link_contract==='true'" :span="8">
          <el-form-item label="合同名称:" prop="contract_name" class="head-item">
            <span v-if="temp.audit_status===2">{{ temp.contract_name }}</span>
            <el-autocomplete
              v-else
              v-model="temp.contract_name"
              value-key="contract_name"
              :fetch-suggestions="querySearchContract"
              placeholder="请输入内容"
              @select="handleSelectContract"
              style="width: 200px;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="供应商名称:" prop="supplier_name" class="head-item">
            <span v-if="temp.link_contract==='true' || temp.audit_status===2">
              {{ temp.supplier_name }}
            </span>
            <el-autocomplete
              v-else
              v-model="temp.supplier_name"
              value-key="supplier_name"
              :fetch-suggestions="querySearchSupplier"
              placeholder="请输入内容"
              @select="handleSelectSupplier"
              style="width: 200px;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="总仓:" prop="from_basecamp" class="head-item">
            <el-radio-group 
              v-if="temp.link_contract==='true' || temp.audit_status===2" 
              v-model="temp.from_basecamp"
              disabled
            >
              <el-radio label=true>是</el-radio>
              <el-radio label=false>否</el-radio>
            </el-radio-group>
            <el-radio-group v-else v-model="temp.from_basecamp">
              <el-radio label=true>是</el-radio>
              <el-radio label=false>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-if="temp.from_basecamp==='false'" label="工程名称:" prop="engineer_name" class="head-item">
            <span v-if="temp.link_contract==='true' || (temp.audit_status===2 && temp.engineer_name!==null)">{{ temp.engineer_name }}</span>
            <el-autocomplete
              v-else
              v-model="temp.engineer_name"
              value-key="engineer_name"
              :fetch-suggestions="querySearchEngineer"
              placeholder="请输入内容"
              @select="handleSelectEngineer"
              style="width: 200px;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="合计总金额(元):" prop="total" class="head-item">
            <span>{{ temp.total }}</span>
          </el-form-item>
        </el-col>
        <el-col v-if="temp.link_contract==='true'" :span="5">
          <el-form-item label="合同可用金额(元):" prop="leftover_total" class="head-item">
            <span>{{ temp.leftover_total }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="下单时间:" prop="order_time" class="head-item">
            <span v-if="temp.audit_status===2">{{ temp.order_time }}</span>
            <el-date-picker
              v-else
              v-model="temp.order_time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width: 200px;"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="要求到货日期:" prop="arrival_time" class="head-item">
            <span v-if="temp.audit_status===2">{{ temp.arrival_time }}</span>
            <el-date-picker
              v-else
              v-model="temp.arrival_time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width: 200px;"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注:" prop="remark" style="width: 50%;">
        <el-input v-model="temp.remark" type="textarea" maxlength="128" show-word-limit />
      </el-form-item>
      <el-form-item label="材料列表:" class="head-item" style="margin-top:30px">
        <div  class="filter-container">
          <div class="filter-item away">
            类别:
            <el-input v-model="listQuery.category_name" placeholder="输入关键字" style="width: 150px;" @keyup.enter.native="handleSearchMaterial" />
          </div>
          <div class="filter-item away">
            材料名称:
            <el-input v-model="listQuery.material_name" placeholder="输入关键字" style="width: 150px;" @keyup.enter.native="handleSearchMaterial" />
          </div>
          <div class="filter-item away">
            规格:
            <el-input v-model="listQuery.specification" placeholder="输入关键字" style="width: 150px;" @keyup.enter.native="handleSearchMaterial" />
          </div>
          <el-button plain class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchMaterial">
            搜索
          </el-button>
          <el-button v-if="temp.link_contract==='false' && temp.audit_status!==2" plain class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addRow">
            新增一行
          </el-button>
        </div>
        <el-table
          :data="temp_materials"
          element-loading-text="Loading"
          fit
          border
          max-height="800px"
          highlight-current-row
          stripe
          :header-cell-style="{background:'#F1F3F7', color: 'black', 'font-size': '16px', padding: '4px'}"
          :cell-style="{'padding': '3px', 'font-size': '16px', 'font-weight': 600}"
          style="width:90%"
        >
          <el-table-column label="材料类别" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.category_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="材料名称" min-width="160" align="center">
            <template slot-scope="scope">
              <span v-if="temp.link_contract==='true' || temp.audit_status===2">{{ scope.row.material_name }}</span>
              <el-select
                v-else
                v-model="scope.row.material_name"
                filterable
                placeholder="请选择"
                @change="handleSelectMaterial(scope.row)"
              >
                <el-option
                  v-for="item in supplying_materials"
                  :key="item.material_id"
                  :label="item.material_name"
                  :value="item.material_id"
                >
                  <span>{{ item.material_name }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="规格" min-width="160" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.specification }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" min-width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="90" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.number" size="small" @input="handleUpdateNumber(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单价(元)" min-width="90" align="center">
            <template slot-scope="scope">
              <span v-if="temp.link_contract==='true'">{{ scope.row.price }}</span>
              <el-input v-else v-model="scope.row.price" size="small" @input="handleUpdatePrice(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="小计金额(元)" min-width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.total }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="temp.audit_status===2" label="已进仓数量" min-width="110" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.warehoused_number }}</span>
            </template>
          </el-table-column>
          <el-table-column label="说明" min-width="200" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                plain
                @click="delRow(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="updateData" style="margin-left: 140px;">确定</el-button>
    <el-button @click="cancel">取消</el-button>

  </div>
</template>

<script>
import { createOrder, updateOrder, fetchOrder, fetchContractExecuting, fetchContractInfo } from '@/api/purchase'
import { fetchBuildingList } from '@/api/engineer'
import { fetchActives } from '@/api/supplier'
import { getNowTime, getName, isNumeric } from '@/utils/common'
import { fetchSupplyingMaterials, fetchMaterial } from '@/api/material'

export default {
  data() {
    return {
      status: undefined,
      order_id: undefined,
      temp: {},
      mkey: undefined,
      temp_materials: [],
      contracts: [],
      engineers: [],
      suppliers: [],
      listQuery: {
        category_name: undefined,
        material_name: undefined,
        specification: undefined        
      },
      rules: {
        order_name: [{ required: true, message: '请输入采购订单名称', trigger: 'blur' }],
        link_contract: [{ required: true, message: '请选择是否关联采购合同', trigger: 'blur' }],
        contract_name: [{ required: true, message: '请选择采购合同名称', trigger: 'change' }],
        supplier_name: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        // engineer_name: [{ required: true, message: '请选择工程', trigger: 'change' }],
        from_basecamp: [{ required: true, message: '请选择是否从总仓下单', trigger: 'blur' }],
        sign_time: [{ required: true, message: '请选择签订日期', trigger: 'blur' }],
      },
      supplying_materials: [],
    }
  },

  created() {
    if (this.$route.path.endsWith('update')) {
      this.status = 'update'
      // 先从传参找order_id，找不到再从store找
      var order_id = this.$route.params.order_id
      if (order_id === parseInt(order_id, 10)) {
        this.$store.dispatch('order/setUpdatingOrderId', order_id)
      } else {
        order_id = this.$store.getters.updatingOrderId
      }
      // 没有订单则返回列表页
      if (order_id === undefined) {
        this.cancel()
      } else {
        this.order_id = order_id
        // 获取订单明细
        fetchOrder({ order_id: order_id }).then(res => {
          this.temp = Object.assign({}, res)
          this.temp_materials = this.temp.materials
        })
      }

    } else {
      this.status = 'create'
      var contract_id = this.$route.params.contract_id
      if (contract_id === undefined) {
        // 从store找
        this.temp = this.$store.getters.orderInfo
        this.temp_materials = this.temp.materials
      } else {
        fetchContractInfo({ contract_id: contract_id }).then(res => {
          Object.assign(this.temp, res)
          this.temp.link_contract = "true"
          this.temp_materials = this.temp.materials
        })
      }
      if (this.temp.order_name === undefined) {
        this.temp.order_name = getName('采购订单')
      }
      if (this.temp.order_time === undefined) {
        this.temp.order_time = getNowTime()
      }
      if (this.temp.arrival_time === undefined) {
        this.temp.arrival_time = getNowTime()
      }
    }

    fetchContractExecuting().then(res => {
      this.contracts = res.contracts
    })
    fetchBuildingList().then(res => {
      this.engineers = res.engineers
    })
    fetchActives().then(res => {
      this.suppliers = res.suppliers
    })
    fetchSupplyingMaterials().then(res => {
      this.supplying_materials = res.material_list
    })
  },

  methods: {
    handleSearchMaterial() {
      var materials = this.temp.materials
      var k = this.listQuery.category_name
      if (typeof k === 'string' && k !== '') {
        materials = materials.filter(m => m.category_name.indexOf(k) !== -1)
      }
      k = this.listQuery.material_name
      if (typeof k === 'string' && k !== '') {
        materials = materials.filter(m => m.material_name.indexOf(k) !== -1)
      }
      k = this.listQuery.specification
      if (typeof k === 'string' && k !== '') {
        materials = materials.filter(m => m.specification.indexOf(k) !== -1)
      }
      this.temp_materials = materials
      return this.temp_materials
    },

    addRow() {
      var list = {
        category_id: null,
        category_name: '',
        material_id: null,
        material_name: '',
        remark: '',
        editing: true
      }
      this.temp_materials.push(list)
    },
    delRow(row) {
      this.temp_materials.forEach((v, i) => {
        if (row.material_id === v.material_id) {
          this.temp_materials.splice(i, 1)
        }
      })
    },

    querySearchMaterial(queryString, cb) {
      var materials = this.supplying_materials;
      var results = queryString ? materials.filter(this.createMaterialFilter(queryString)) : materials;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createMaterialFilter(queryString) {
      return (materials) => {
        return (materials.material_name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      };
    },
    handleSelectMaterial(row) {
      fetchMaterial({material_id: row.material_name}).then(res => {
        row.category_name = res.category_name
        row.material_id = res.material_id
        row.material_name = res.material_name
        row.unit = res.unit
        row.specification = res.specification
      })
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var data = Object.assign({}, this.temp)
          data.materials = data.materials.filter(m => m.number !== undefined)
          var f = this.status === "create" ? createOrder : updateOrder
          f(data).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.cancel()
          })
        }
      })
    },
    cancel() {
      this.$store.dispatch('tagsView/delVisitedViewByPath', '/purchase/order/' + this.status)
      this.$store.dispatch('order/clearOrderInfo')
      this.$router.push({
        name: 'order'
      })
    },

    handleLinkContract() {
      this.temp.contract_id = undefined
      this.temp.contract_name = undefined
      this.temp.supplier_id = undefined
      this.temp.supplier_name = undefined
      this.temp.engineer_id = undefined
      this.temp.engineer_name = undefined
      this.temp.leftover_total = undefined
      this.temp.materials = this.temp_materials = []
      this.temp.total = 0
    },
    querySearchContract(queryString, cb) {
      var contracts = this.contracts;
      var results = queryString ? contracts.filter(this.createContractFilter(queryString)) : contracts;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createContractFilter(queryString) {
      return (contracts) => {
        return (contracts.contract_name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      };
    },
    handleSelectContract(item) {
      this.temp.contract_id = item.contract_id
      this.temp.contract_name = item.contract_name
      this.temp.total = 0
      fetchContractInfo({ contract_id: item.contract_id }).then(res => {
        Object.assign(this.temp, res)
        this.temp_materials = this.temp.materials
      })
    },

    querySearchSupplier(queryString, cb) {
      var suppliers = this.suppliers;
      var results = queryString ? suppliers.filter(this.createSupplierFilter(queryString)) : suppliers;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createSupplierFilter(queryString) {
      return (suppliers) => {
        return (suppliers.supplier_name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      };
    },
    handleSelectSupplier(item) {
      this.temp.supplier_id = item.supplier_id
      this.temp.supplier_name = item.supplier_name
    },

    querySearchEngineer(queryString, cb) {
      var engineers = this.engineers;
      var results = queryString ? engineers.filter(this.createEngineerFilter(queryString)) : engineers;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createEngineerFilter(queryString) {
      return (engineers) => {
        return (engineers.engineer_name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      };
    },
    handleSelectEngineer(item) {
      this.temp.engineer_id = item.engineer_id
      this.temp.engineer_name = item.engineer_name
    },
    handleUpdatePrice(row) {
      if (!isNumeric(row.price) || Number(row.price) < 0) {
        row.price = null
      }
      this.clacRowTotal(row)
      this.calcTotal()
    },
    handleUpdateNumber(row) {
      if (!isNumeric(row.number) || Number(row.number) < 0) {
        row.number = null
      }
      this.clacRowTotal(row)
      this.calcTotal()
    },
    clacRowTotal(row) {
      if (isNaN(row.number) || isNaN(row.price)) {
        row.total = null
      } else {
        row.total = (row.number * row.price).toFixed(2)
      }
    },
    calcTotal() {
      this.temp.total = undefined
      var total = 0.0
      var materials = this.temp.materials
      for (let i = 0; i < materials.length; i++) {
        if (isNaN(materials[i].number) || isNaN(materials[i].price)) {
          continue
        } else {
          total = total + materials[i].number * materials[i].price
        }
      }
      this.temp.total = total.toFixed(2)
    }
  }
}
</script>

<style scoped>
.app-container{
  font-weight: 400;
}
.head-item{
  /* margin-bottom: 10px; */
}
</style>
