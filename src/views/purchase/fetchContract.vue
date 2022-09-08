<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :model="temp"
      label-width="110px"
      style="width: 70%;"
    >
      <el-form-item class="head-item" label="合同名称:" prop="contract_name" style="width: 50%;">
        <span>{{ temp.contract_name }}</span>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="供应商名称:" prop="supplier_name" class="head-item">
            <span>{{ temp.supplier_name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总仓:" prop="from_basecamp" class="head-item">
             <el-radio-group v-model="temp.from_basecamp" disabled>
              <el-radio label=true>是</el-radio>
              <el-radio label=false>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-if="temp.from_basecamp==='false'" label="工程名称:" prop="engineer_name" class="head-item">
            <span>{{ temp.engineer_name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同金额(元):" prop="total" class="head-item">
            <span>{{ temp.total }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签订时间:" prop="sign_time" class="head-item">
            <span>{{ temp.sign_time }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签订用户:" prop="sign_user" class="head-item">
            <span>{{ temp.sign_user }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注:" prop="remark" style="width: 50%;">
        <span>{{ temp.remark }}</span>
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
      <el-table-column label="备注" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-button @click="cancel">返回</el-button>

  </div>
</template>

<script>
import { fetchContract } from '@/api/purchase'

export default {
  data() {
    return {
      temp: {},
      contract_id: undefined,
      mkey: undefined,
      temp_materials: [],
    }
  },

  created() {
    // 先从传参找contract_id，找不到再从store找
    var contract_id = undefined
    contract_id = this.$route.params.contract_id
    if (contract_id === parseInt(contract_id, 10)) {
      this.$store.dispatch('contract/setLookingContractId', contract_id)
    } else {
      contract_id = this.$store.getters.lookingContractId
    }

    if (contract_id === undefined) {
      this.cancel()
    }

    this.contract_id = contract_id
    const data = { contract_id: this.contract_id }
    fetchContract(data).then(res => {
      this.temp = Object.assign({}, res)
      this.temp_materials = this.temp.materials
    })
  },

  methods: {
    cancel() {
      this.$store.dispatch('tagsView/delVisitedViewByPath', '/purchase/contract/detail')
      this.$router.push({
        name: 'contract'
      })
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
  margin-bottom: 5px;
}
</style>
