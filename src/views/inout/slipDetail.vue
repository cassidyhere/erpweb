<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :model="temp"
      :rules="rules"
      label-width="140px"
      style="width: 70%; min-width: 1200px"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item v-if="status==='update'" class="head-item" label="退货单编号:" prop="order_code">
            <span>{{ temp.order_code }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="head-item" label="关联工程:" prop="engineer_name">
            <span v-if="status==='update' && temp.audit_status===2">{{ temp.engineer_name }}</span>
            <el-select
              v-else
              v-model="temp.engineer_name"
              filterable
              placeholder="请选择"
              @change="selectEngineer"
            >
              <el-option
                v-for="item in engineers"
                :key="item.engineer_id"
                :label="item.engineer_name"
                :value="item.engineer_id">
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
          <el-form-item label="下单时间" prop="order_time" class="head-item">
            <span v-if="status==='update' && temp.audit_status===2">{{ temp.order_time }}</span>
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
        <el-input v-model="mkey" placeholder="搜索材料" style="width: 200px;" class="filter-item" @keyup.enter.native="handleSearchMaterial" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchMaterial">
          搜索
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="temp_materials"
      element-loading-text="Loading"
      fit
      height="800px"
      highlight-current-row
      :header-cell-style="{background:'#F1F3F7'}"
      style="width:70%; margin-left:110px; margin-bottom:20px; margin-right:10px"
    >
      <el-table-column label="采购合同" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.contract_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购订单" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.order_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料类别" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.category_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料名称" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.material_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格(元)" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="temp.audit_status!==2" label="出仓数量" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.picked_quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="140">
        <template slot-scope="scope">
          <span v-if="status==='update' && temp.audit_status===2">{{ scope.row.inout_quantity }}</span>
          <el-input v-else v-model="scope.row.inout_quantity" size="small" @input="handleUpdateQuantity(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="220">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" size="small"></el-input>
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" @click="updateData" style="margin-left: 110px;">确定</el-button>
    <el-button @click="cancel">取消</el-button>

  </div>
</template>

<script>
import { updateSlip, createSlip, fetchInout } from '@/api/inout'
import { fetchHasPick, fetchPickedMaterials } from '@/api/engineer'
import { getNowTime, isNumeric } from '@/utils/common'

export default {
  data() {
    return {
      status: undefined,
      inout_id: undefined,
      temp: {},
      mkey: undefined,
      temp_materials: [],
      engineers: [],
      rules: {
        engineer_name: [{ required: true, message: '请选择关联工程', trigger: 'change' }],
        order_time: [{ required: true, message: '请选择下单时间', trigger: 'change' }],
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
        this.$store.dispatch('inout/setUpdatingSlipId', inout_id)
      } else {
        inout_id = this.$store.getters.updatingSlipId
      }
      // 没有订单则返回列表页
      if (inout_id === undefined) {
        this.cancel()
      } else {
        this.inout_id = inout_id
        // 获取订单明细
        fetchInout({ inout_id: inout_id, order_type: 3 }).then(res => {
          this.temp = Object.assign({}, res)
          this.temp_materials = this.temp.materials
        })
      }
    
    } else {
      this.status = 'create'
      // 从store找
      this.temp = this.$store.getters.slipInfo
      this.temp_materials = this.temp.materials
      if (this.temp.order_time === undefined) {
        this.temp.order_time = getNowTime()
      }
    }

    fetchHasPick().then(res => {
      this.engineers = res.engineers
    })
  },

  methods: {
    selectEngineer(engineer_id) {
      this.temp.engineer_id = engineer_id
      fetchPickedMaterials({ engineer_id: engineer_id }).then(res => {
        this.temp_materials = this.temp.materials = res.materials
      })
    },
    cancel() {
      this.$store.dispatch('tagsView/delVisitedViewByPath', '/warehouse/slip/' + this.status)
      this.$store.dispatch('inout/clearSlipInfo')
      this.$router.push({
        name: 'slip'
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var data = Object.assign({}, this.temp)
          data.materials = data.materials.filter(m => m.inout_quantity !== undefined)
          var f = this.status === "update" ? updateSlip : createSlip
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
      } else if (row.inout_quantity > row.picked_quantity) {
        row.inout_quantity = row.picked_quantity
      }
      this.calcTotal()
    },
    calcTotal() {
      this.temp.total = undefined
      var total = 0.0
      var materials = this.temp.materials
      for (let i = 0; i < materials.length; i++) {
        if (isNaN(materials[i].inout_quantity) || isNaN(materials[i].price)) {
          console.log('continue', materials[i].inout_quantity, materials[i].price)
          continue
        } else {
          console.log('cala', materials[i].inout_quantity, materials[i].price)
          
          total = total + materials[i].inout_quantity * materials[i].price
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
