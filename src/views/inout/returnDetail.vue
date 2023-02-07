<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :model="temp"
      :rules="rules"
      label-width="140px"
      style="min-width: 1200px; max-width: 2000px"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item v-if="status==='update'" class="head-item" label="入仓单编号:" prop="order_code">
            <span>{{ temp.order_code }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="head-item" label="供应商:" prop="supplier_name">
            <span v-if="status==='update' && temp.audit_status===2">{{ temp.supplier_name }}</span>
            <el-select
              v-else
              v-model="temp.supplier_name"
              filterable
              placeholder="请选择"
              @change="selectSupplier"
            >
              <el-option
                v-for="item in suppliers"
                :key="item.supplier_id"
                :label="item.supplier_name"
                :value="item.supplier_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="head-item" label="总金额(元):" prop="total">
            <span>{{ temp.total }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="退货日期" prop="inout_time" class="head-item">
            <span v-if="status==='update' && temp.audit_status===2">{{ temp.inout_time }}</span>
            <el-date-picker
              v-else
              v-model="temp.inout_time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width: 200px;"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item v-if="status==='update'" class="head-item" label="下单用户:" prop="total">
            <span>{{ temp.insert_user }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark" style="width: 50%;">
        <el-input v-model="temp.remark" type="textarea" maxlength="128" show-word-limit />
      </el-form-item>
      <el-form-item label="材料列表" class="head-item" style="margin-top:30px">
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
          <el-button v-if="temp.audit_status===1" plain class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addRow">
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
          <el-table-column label="采购合同" max-width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.contract_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="采购订单" max-width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.order_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="材料类别" max-width="140" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.category_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="材料名称" max-width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.material_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" max-width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.specification }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" max-width="140" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="temp.audit_status!==2" label="库存数量" max-width="140" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.inventory_quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="temp.audit_status!==2" label="可用数量" max-width="140" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.available_quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" max-width="140" align="center">
            <template slot-scope="scope">
              <span v-if="status==='update' && temp.audit_status===2">{{ scope.row.inout_quantity }}</span>
              <el-input v-else v-model="scope.row.inout_quantity" size="small" @input="handleUpdateQuantity(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单价(元)" max-width="140" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="小计金额(元)" min-width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.row_total }}</span>
            </template>
          </el-table-column>
          <el-table-column label="说明" max-width="220" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" size="small"></el-input>
            </template>
          </el-table-column>
          <!-- <el-table-column align="right" min-width="150">
            <template slot="header">
              <el-input v-model="mkey" size="small" placeholder="输入关键字搜索" @input="handleSearchMaterial"></el-input>
            </template>
          </el-table-column> -->
        </el-table>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="updateData" style="margin-left: 110px;">确定</el-button>
    <el-button @click="cancel">取消</el-button>

  </div>
</template>

<script>
import { updateReturn, createReturn, fetchInout } from '@/api/inout'
import { fetchInventorySuppliers } from '@/api/inventory'
import { fetchSupplierInventories } from '@/api/supplier'
import { getNowTime, isNumeric, calcTotal2, clacRowTotal } from '@/utils/common'

export default {
  data() {
    return {
      listQuery: {
        category_name: undefined,
        material_name: undefined,
        specification: undefined        
      },
      status: undefined,
      inout_id: undefined,
      temp: {},
      temp_materials: [],
      suppliers: [],
      rules: {
        supplier_name: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        inout_time: [{ required: true, message: '请选择下单时间', trigger: 'change' }],
        order_user: [{ required: true, message: '请输入下单用户', trigger: 'change' }]
      }
    }
  },

  created() {
    if (this.$route.path.endsWith('update')) {
      this.status = 'update'
      // 先从传参找inout_id，找不到再从store找
      var inout_id = this.$route.params.inout_id
      if (inout_id === parseInt(inout_id, 10)) {
        this.$store.dispatch('inout/setUpdatingReturnId', inout_id)
      } else {
        inout_id = this.$store.getters.updatingReturnId
      }
      // 没有订单则返回列表页
      if (inout_id === undefined) {
        this.cancel()
      } else {
        this.inout_id = inout_id
        // 获取订单明细
        fetchInout({ inout_id: inout_id, order_type: 5 }).then(res => {
          this.temp = Object.assign({}, res)
          this.temp_materials = this.temp.materials
        })
      }
    } else {
      this.status = 'create'
      // 从store找
      this.temp = this.$store.getters.returnInfo
      this.temp_materials = this.temp.materials
      if (this.temp.inout_time === undefined) {
        this.temp.inout_time = getNowTime()
      }
    }

    fetchInventorySuppliers().then(res => {
      this.suppliers = res.suppliers
    })
  },

  methods: {
    selectSupplier(supplier_id) {
      this.temp.supplier_id = supplier_id
      fetchSupplierInventories({ supplier_id: supplier_id }).then(res => {
        this.temp_materials = this.temp.materials = res.materials
      })
    },
    cancel() {
      this.$store.dispatch('tagsView/delVisitedViewByPath', '/warehouse/return/' + this.status)
      this.$store.dispatch('inout/clearReturnInfo')
      this.$router.push({ name: 'return' })
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var data = Object.assign({}, this.temp)
          data.materials = data.materials.filter(m => m.inout_quantity !== undefined)
          var f = this.status === "update" ? updateReturn : createReturn
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

    handleUpdateQuantity(row) {
      console.log('row:', row)
      if (!isNumeric(row.inout_quantity) || Number(row.inout_quantity) < 0) {
        row.inout_quantity = null
      } else if (row.inout_quantity > row.available_quantity) {
        row.inout_quantity = row.available_quantity
      }
      row.row_total = clacRowTotal(row.inout_quantity, row.price)
      this.temp.total = calcTotal2(this.temp.materials)
    },
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
