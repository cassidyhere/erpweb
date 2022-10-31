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
            <span v-if="temp.link_contract==='true' || temp.audit_status===2">{{ temp.engineer_name }}</span>
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
        <el-col :span="8">
          <el-form-item label="订单金额(元):" prop="total" class="head-item">
            <span>{{ temp.total }}</span>
          </el-form-item>
        </el-col>
        <el-col v-if="temp.link_contract==='true'" :span="8">
          <el-form-item label="合同可用金额(元):" prop="leftover_total" class="head-item">
            <span>{{ temp.leftover_total }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
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
      </el-row>
      <el-form-item label="备注:" prop="remark" style="width: 50%;">
        <el-input v-model="temp.remark" type="textarea" maxlength="128" show-word-limit />
      </el-form-item>
      <el-form-item label="材料列表:" class="head-item" style="margin-top:30px">
        <el-table
          :data="temp_materials"
          element-loading-text="Loading"
          fit
          border
          max-height="800px"
          highlight-current-row
          :header-cell-style="{background:'#F1F3F7', color: 'black'}"
          style="width:90%"
        >
          <el-table-column label="材料类别" min-width="110" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.category_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="材料名称" min-width="190" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.material_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" min-width="190" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.specification }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" min-width="110" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="价格(元)" min-width="110" align="center">
            <template slot-scope="scope">
              <span v-if="temp.link_contract==='true' || temp.audit_status===2">{{ scope.row.price }}</span>
              <el-input v-else v-model="scope.row.price" size="small" @input="handleUpdatePrice(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="110" align="center">
            <template slot-scope="scope">
              <span v-if="temp.audit_status===2">{{ scope.row.number }}</span>
              <el-input v-else v-model="scope.row.number" size="small" @input="handleUpdateNumber(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="200" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="right" min-width="150">
            <template slot="header" slot-scope="scope">
              <el-input v-model="mkey" size="small" placeholder="输入关键字搜索" @input="handleSearchMaterial(scope.row)"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="updateData" style="margin-left: 110px;">确定</el-button>
    <el-button @click="cancel">取消</el-button>

  </div>
</template>

<script>
import { createOrder, updateOrder, fetchOrder, fetchContractExecuting, fetchContractInfo } from '@/api/purchase'
import { fetchBuildingList } from '@/api/engineer'
import { fetchActives, fetchSupplierMaterials } from '@/api/supplier'
import { getNowTime, getName, isNumeric } from '@/utils/common'

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
      rules: {
        order_name: [{ required: true, message: '请输入采购订单名称', trigger: 'blur' }],
        link_contract: [{ required: true, message: '请选择是否关联采购合同', trigger: 'blur' }],
        // contract_name: [{ required: true, message: '请选择采购合同名称', trigger: 'change' }],
        supplier_name: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
        engineer_name: [{ required: true, message: '请选择工程', trigger: 'blur' }],
        from_basecamp: [{ required: true, message: '请选择是否从总仓下单', trigger: 'blur' }],
        sign_time: [{ required: true, message: '请选择签订日期', trigger: 'blur' }],
      }
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
  },

  methods: {
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
      this.temp.total = 0
      const query = { supplier_id: item.supplier_id }
      fetchSupplierMaterials(query).then(res => {
        this.temp_materials = this.temp.materials = res.materials
      })
      console.log('this.temp.materials:', this.temp.materials)
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
      if (!isNumeric(row.price) || Number(row.price) <= 0) {
        row.price = null
      }
      this.calcTotal()
    },
    handleUpdateNumber(row) {
      if (!isNumeric(row.number) || Number(row.number) < 0) {
        row.number = null
      }
      this.calcTotal()
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
      console.log('this.temp.total:', this.temp.total)
    },
    handleSearchMaterial() {
      if (typeof this.mkey === 'string' && this.mkey !== '') {
        var ret = []
        var materials = this.temp.materials
        for (var i = 0; i < materials.length; i++) {
          if (materials[i].category_name.indexOf(this.mkey) !== -1 ||
              materials[i].material_name.indexOf(this.mkey) !== -1 ||
              materials[i].specification.indexOf(this.mkey) !== -1 ||
              materials[i].unit.indexOf(this.mkey) !== -1
          ) {
            console.log('here', materials[i])
            ret.push(materials[i])
          }
        }
        this.temp_materials = ret
      } else {
        this.temp_materials = this.temp.materials
      }
      return this.temp_materials
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
