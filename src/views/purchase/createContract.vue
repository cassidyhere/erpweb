<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :model="temp"
      :rules="rules"
      label-width="110px"
      style="width: 70%;"
    >
      <el-form-item class="head-item" label="合同名称" prop="contract_name" style="width: 50%;">
        <el-input v-model="temp.contract_name" />
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="供应商名称" prop="supplier_name" class="head-item">
            <el-autocomplete
              v-model="temp.supplier_name"
              value-key="supplier_name"
              :fetch-suggestions="querySearchSupplier"
              placeholder="请输入内容"
              @select="handleSelectSupplier"
              style="width: 200px;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总仓" prop="from_basecamp" class="head-item">
            <el-radio-group v-model="temp.from_basecamp">
              <el-radio label=true>是</el-radio>
              <el-radio label=false>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-if="temp.from_basecamp==='false'" label="工程名称" prop="engineer_name" class="head-item">
            <el-autocomplete
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
          <el-form-item label="合同金额(元)" prop="total" class="head-item">
            <el-input v-model="temp.total" style="width: 200px;" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签订时间" prop="sign_time" class="head-item">
            <el-date-picker
              v-model="temp.sign_time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width: 200px;"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签订用户" prop="sign_user" class="head-item">
            <el-input v-model="temp.sign_user" style="width: 200px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark" style="width: 50%;">
        <el-input v-model="temp.remark" type="textarea" maxlength="128" show-word-limit />
      </el-form-item>
      <el-form-item label="材料列表" prop="remark" class="head-item" style="margin-top:30px">
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
          <el-input v-model="scope.row.price" size="small"></el-input>
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
import { createContract } from '@/api/purchase'
import { fetchBuildingList } from '@/api/engineer'
import { fetchActives, fetchSupplierMaterials } from '@/api/supplier'

export default {
  data() {
    return {
      mkey: undefined,
      temp_materials: [],
      engineers: [],
      suppliers: [],
      rules: {
        contract_name: [{ required: true, message: '请输入工采购合同名称', trigger: 'change' }],
        supplier_name: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        engineer_name: [{ required: true, message: '请选择工程', trigger: 'change' }],
        from_basecamp: [{ required: true, message: '', trigger: 'change' }],
        total: [{ required: true, message: '请输入总金额', trigger: 'change' }],
        sign_time: [{ required: true, message: '请选择签订日期', trigger: 'blur' }],
      }
    }
  },

  created() {
    this.temp = this.$store.getters.contractInfo
    if (this.temp.sign_time === undefined) {
      this.getNowTime()
    }
    this.temp_materials = this.temp.materials
    fetchBuildingList().then(res => {
      this.engineers = res.engineers
    })
    fetchActives().then(res => {
      this.suppliers = res.suppliers
    })
  },

  methods: {
    getNowTime() {
      var now = new Date()
      var year = now.getFullYear() // 得到年份
      var month = now.getMonth() // 得到月份
      var date = now.getDate() // 得到日期
      month = month + 1
      month = month.toString().padStart(2, '0')
      date = date.toString().padStart(2, '0')
      var defaultDate = `${year}-${month}-${date}`
      this.$set(this.temp, 'sign_time', defaultDate)
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createContract(this.temp).then(() => {
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
      this.$store.dispatch('tagsView/delVisitedViewByPath', '/purchase/contract/create')
      this.$store.dispatch('contract/clearContractInfo')
      this.$router.push({
        name: 'contract'
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
