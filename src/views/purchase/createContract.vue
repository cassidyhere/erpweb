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
          <el-form-item label="总仓" prop="winner" class="head-item">
            <el-radio v-model="temp.from_basecamp" label=true>是</el-radio>
            <el-radio v-model="temp.from_basecamp" label=false>否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工程名称" prop="engineer_name" class="head-item">
            <el-select v-model="temp.engineer_name" placeholder="请选择" style="width: 200px;">
              <el-option
                v-for="item in engineers"
                :key="item.engineer_id"
                :label="item.engineer_name"
                :value="item.engineer_name">
              </el-option>
            </el-select>
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
        <el-input placeholder="搜索材料" style="width: 200px;" class="filter-item" />
        <el-button class="filter-item" type="primary" icon="el-icon-search">
          搜索
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="temp.materials"
      element-loading-text="Loading"
      fit
      height="800px"
      highlight-current-row
      row-style="height:10px;"
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

    <el-button type="primary" @click="createData" style="margin-left: 110px;">立即创建</el-button>
    <el-button @click="cancel">取消</el-button>

  </div>
</template>

<script>
import { createContract } from '@/api/purchase'
import { fetchActives, fetchSupplierMaterials } from '@/api/supplier'

export default {
  data() {
    return {
      engineers: [],
      suppliers: [],
      rules: {
        contract_name: [{ required: true, message: '请输入工采购合同名称', trigger: 'change' }],
        supplier_name: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        total: [{ required: true, message: '请输入总金额', trigger: 'change' }],
        sign_time: [{ required: true, message: '请选择签订日期', trigger: 'blur' }],
      }
    }
  },

  created() {
    this.temp = this.$store.getters.contractInfo
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createEngineer(this.temp).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.$store.dispatch('tagsView/delVisitedViewByPath', '/engineer/create', 'createEngineer')
            this.$store.dispatch('engineer/clearEngineerInfo')
            this.$router.push({
              name: 'engineer'
            })
          })
        }
      })
    },
    cancel() {
      this.$store.dispatch('tagsView/delVisitedViewByPath', '/engineer/create', 'createEngineer')
      this.$store.dispatch('engineer/clearEngineerInfo')
      this.$router.push({
        name: 'engineer'
      })
    },
    querySearchSupplier(queryString, cb) {
      var suppliers = this.suppliers;
      var results = queryString ? suppliers.filter(this.createFilter(queryString)) : suppliers;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (suppliers) => {
        return (suppliers.supplier_name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      };
    },
    handleSelectSupplier(item) {
      this.temp.supplier_id = item.supplier_id
      this.temp.supplier_name = item.supplier_name
      const query = { supplier_id: item.supplier_id }
      fetchSupplierMaterials(query).then(res => {
        this.temp.materials = res.materials
      })
      console.log('this.temp.materials:', this.temp.materials)
    }
  }
}
</script>

<style scoped>
.app-container{
  font-weight: 400;
}
.head-item{
  margin-bottom: 10px;
}
</style>
