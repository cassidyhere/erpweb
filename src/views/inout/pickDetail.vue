<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :model="temp"
      :rules="rules"
      label-width="140px"
      style="width: 70%;"
    >
      <el-form-item class="head-item" label="关联采购单:" prop="purchase_order_name">
        <span v-if="dialogStatus==='get'">{{ temp.purchase_order_name }}</span>
        <el-select
          v-else 
          v-model="temp.purchase_order_name"
          filterable placeholder="请选择"
          @change="selectPurchaseOrder"
        >
          <el-option-group
            v-for="group in purchase_orders"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.id"
              :label="item.order_name"
              :value="item.order_name"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item class="head-item" label="关联采购合同:" prop="contract_name">
            <span>{{ temp.contract_name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item class="head-item" label="关联供应商:" prop="supplier_name">
            <span>{{ temp.supplier_name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item class="head-item" label="关联工程:" prop="engineer_name">
            <span>{{ temp.engineer_name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item class="head-item" label="总金额(元):" prop="total">
            <span>{{ temp.total }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="下单时间" prop="handling_time" class="head-item">
            <span v-if="status==='detail'">{{ temp.handling_time }}</span>
            <el-date-picker
              v-else
              v-model="temp.handling_time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width: 200px;"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="下单用户:" prop="handler" class="head-item">
            <span v-if="dialogStatus==='get'">{{ temp.handler }}</span>
            <el-input v-else v-model="temp.handler" style="width: 150px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark" style="width: 50%;">
        <span v-if="status==='detail'">{{ temp.remark }}</span>
        <el-input v-else v-model="temp.remark" type="textarea" maxlength="128" show-word-limit />
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
      style="width:70%; margin-left:110px; margin-bottom:20px; margin-right:10px"
    >
      <el-table-column label="材料类别" width="180">
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
      <el-table-column label="单位" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="status!=='detail'" label="未进仓数量" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.unwarehouse_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="200">
        <template slot-scope="scope">
          <span v-if="status==='detail'">{{ scope.row.inout_quantity }}</span>
          <el-input v-else v-model="scope.row.inout_quantity" size="small" @input="calcTotal"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="220">
        <template slot-scope="scope">
          <span v-if="status==='detail'">{{ scope.row.remark }}</span>
          <el-input v-else v-model="scope.row.remark" size="small"></el-input>
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" @click="updateData" style="margin-left: 110px;">确定</el-button>
    <el-button @click="cancel">取消</el-button>

  </div>
</template>

<script>
import { updateWarehouse, createWarehouse } from '@/api/inout'
import { fetchOrderElOptionGroup, fetchOrder } from '@/api/purchase'
import { getNowTime } from '@/utils/common'

export default {
  data() {
    return {
      status: undefined,
      inout_id: undefined,
      temp: {},
      mkey: undefined,
      temp_materials: [],
      purchase_orders: [],
      rules: {
        purchase_order_name: [{ required: true, message: '请选择关联采购单', trigger: 'change' }],
        handling_time: [{ required: true, message: '请选择下单时间', trigger: 'change' }],
        handler: [{ required: true, message: '请输入下单用户', trigger: 'change' }]
      }
    }
  },

  created() {
    console.log('this.$route.path:', this.$route.path )
    if (this.$route.path.endsWith('update') || this.$route.path.endsWith('detail')) {
      // 先从传参找order_id，找不到再从store找
      var inout_id = this.$route.params.inout_id
      if (this.$route.path.endsWith('update')) {
        this.status = 'update'
        if (inout_id === parseInt(inout_id, 10)) {
          this.$store.dispatch('inout/setUpdatingInId', inout_id)
        } else {
          inout_id = this.$store.getters.updatingInId
        }
      } else {
        this.status = 'detail'
        if (inout_id === parseInt(inout_id, 10)) {
          this.$store.dispatch('order/setLookingInId', inout_id)
        } else {
          inout_id = this.$store.getters.lookingInId
        }
      }
      // 没有订单则返回列表页
      if (inout_id === undefined) {
        this.cancel()
      } else {
        this.inout_id = inout_id
      }
      // 获取订单明细
      fetchOrder({ inout_id: inout_id }).then(res => {
        this.temp = Object.assign({}, res)
        this.temp_materials = this.temp.materials
      })

    } else {
      this.status = 'create'
      // 从store找
      this.temp = this.$store.getters.inInfo
      this.temp_materials = this.temp.materials
      if (this.temp.handling_time === undefined) {
        this.temp.handling_time = getNowTime()
      }
    }

    fetchOrderElOptionGroup().then(res => {
      this.purchase_orders = res.el_option_group
    })
  },

  methods: {
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var data = Object.assign({}, this.temp)
          data.materials = data.materials.filter(m => m.inout_quantity !== undefined)
          var f = this.status === "update" ? updateWarehouse : createWarehouse
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
      this.$store.dispatch('tagsView/delVisitedViewByPath', '/warehouse/in/' + this.status)
      this.$store.dispatch('inout/clearInInfo')
      this.$router.push({
        name: 'warehouse'
      })
    },
    selectPurchaseOrder(order_name) {
      for (let i = 0; i < this.purchase_orders.length; i++) {
        var options = this.purchase_orders[i].options
        var right = false
        for (let j = 0; j < options.length; j++) {
          if (options[j].order_name === order_name) {
            this.temp.purchase_order_id = options[j].id
            fetchOrder({ order_id: this.temp.purchase_order_id }).then(res => {
              this.temp.contract_name = res.contract_name
              this.temp.engineer_name = res.engineer_name
              this.temp.supplier_name = res.supplier_name
              this.temp_materials = this.temp.materials = res.materials
            })
            right = true
            break
          }
        }
        if (right === true) {
          break
        }
      }
      console.log('this.temp:', this.temp)
    },
    calcTotal() {
      this.temp.total = undefined
      var n = 0.0
      var materials = this.temp.materials
      for (let i = 0; i < materials.length; i++) {
        if (isNaN(materials[i].inout_quantity) || isNaN(materials[i].price)) {
          continue
        } else {
          n = n + materials[i].inout_quantity * materials[i].price
        }
      }
      this.temp.total = n
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
