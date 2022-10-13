<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :model="temp"
      :rules="rules"
      label-width="110px"
      style="width: 70%; min-width: 1200px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item class="head-item" label="合同名称:" prop="contract_name" style="width: 50%;">
            <el-input v-model="temp.contract_name" style="width: 300px;" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-if="status!=='create'" class="head-item" label="合同编号:" prop="contract_code">
            <span>{{ temp.contract_code }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
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
        <el-col :span="8">
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
          <el-form-item label="合同金额(元):" prop="total" class="head-item">
            <span v-if="temp.audit_status===2">{{ temp.total }}</span>
            <el-input v-else v-model="temp.total" style="width: 200px;" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签订时间:" prop="sign_time" class="head-item">
            <span v-if="temp.audit_status===2">{{ temp.sign_time }}</span>
            <el-date-picker
              v-else
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
          <el-form-item label="签订用户:" prop="sign_user" class="head-item">
            <span>{{ temp.sign_user }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注:" prop="remark" style="width: 50%;">
        <el-input v-model="temp.remark" type="textarea" maxlength="128" show-word-limit />
      </el-form-item>
      <el-form-item label="材料列表:" class="head-item" style="margin-top:30px">
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
          <span v-if="temp.audit_status===2">{{ scope.row.price }}</span>
          <el-input v-else v-model="scope.row.price" size="small" @blur="handleUpdatePrice(scope.row)"></el-input>
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
import { createContract, updateContract, fetchContract } from '@/api/purchase'
import { fetchBuildingList } from '@/api/engineer'
import { fetchActives, fetchSupplierMaterials } from '@/api/supplier'
import { getNowTime, getName, isNumeric } from '@/utils/common'

export default {
  data() {
    return {
      status: undefined,
      contract_id: undefined,
      temp: {},
      mkey: undefined,
      temp_materials: [],
      engineers: [],
      suppliers: [],
      rules: {
        contract_name: [{ required: true, message: '请输入采购合同名称', trigger: 'change' }],
        supplier_name: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        engineer_name: [{ required: true, message: '请选择工程', trigger: 'change' }],
        from_basecamp: [{ required: true, message: '', trigger: 'change' }],
        total: [
          { required: true, message: '请输入总金额', trigger: 'change' },
          {
            transform(value) {
              return Number(value);
            },
            validator(rule, value, callback) {
              if (Number.isFinite(value) && value >= 0) {
                callback();
              } else {
                callback(new Error("请输入不小于0的数字"));
              }
            },
            trigger: "blur",
          }
        ],
        sign_time: [{ required: true, message: '请选择签订日期', trigger: 'blur' }],
      }
    }
  },

  created() {
    if (this.$route.path.endsWith('update')) {
      this.status = 'update'
      // 先从传参找contract_id，找不到再从store找
      var contract_id = this.$route.params.contract_id
      if (contract_id === parseInt(contract_id, 10)) {
        this.$store.dispatch('contract/setUpdatingContractId', contract_id)
      } else {
        contract_id = this.$store.getters.updatingContractId
      }
      // 没有合同则返回列表页
      if (contract_id === undefined) {
        this.cancel()
      } else {
        this.contract_id = contract_id
        // 获取合同明细
        fetchContract({ contract_id: this.contract_id }).then(res => {
          this.temp = Object.assign({}, res)
          this.temp_materials = this.temp.materials
        })
      }
    } else {
      this.status = 'create'
      // 从store找
      this.temp = this.$store.getters.contractInfo
      this.temp_materials = this.temp.materials
      if (this.temp.contract_name === undefined) {
        this.temp.contract_name = getName('采购合同')
      }
      if (this.temp.sign_time === undefined) {
        this.temp.sign_time = getNowTime()
      }
    }

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
          var f = this.status === "create" ? createContract : updateContract
          f(this.temp).then(() => {
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
      this.$store.dispatch('tagsView/delViewByPath', '/purchase/contract/update')
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
    handleUpdatePrice(row) {
      console.log('row:', row)
      if (!isNumeric(row.price) || Number(row.price) <= 0) {
        row.price = null
      }
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
