<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增预算分析表
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出excel
      </el-button>
      <el-button :loading="loading" class="filter-item" type="primary" @click="handleUpload">
        上传excel
      </el-button>
      <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料类别" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.category_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总金额" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="400" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="200" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.audit_status===1" size="mini" type="primary" @click="handleAuditBudget(scope.row.id)">
            审核
          </el-button>
          <el-button v-else size="mini" type="info" disabled>
            已审核
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.audit_status===1"
            size="mini"
            type="success"
            plain
            @click="handleEditBudget(scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.audit_status===1"
            size="mini"
            type="danger"
            plain
            @click="handleDeleteBudget(scope.row.id)"
          >
            刪除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="textMap[dialogStatus]"
      width="1100px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="100px"
        size="small"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="材料类别" prop="category_name">
          <el-select v-model="temp.category_name" placeholder="请选择" @change="selectCategory">
            <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" type="textarea" maxlength="128" show-word-limit />
        </el-form-item>
      </el-form>

      <el-row>
        <el-col :span="21.6">
          <div style="font-weight: 700; margin-left:50px; margin-bottom:10px;">供应材料</div>
          <el-table
            v-loading="listLoading"
            :data="temp.materials"
            element-loading-text="Loading"
            fit
            height="350"
            highlight-current-row
            style="width:92%; margin-left:50px; margin-bottom:10px; margin-right:10px"
            @sort-change="sortChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="材料名称" width="180">
              <template slot-scope="scope">
                <template v-if="scope.row.editing">
                  <el-autocomplete
                    v-model="scope.row.material_name"
                    :fetch-suggestions="querySearchMaterial"
                    size="small"
                    placeholder="请输入内容"
                    @select="selectMaterial(scope.row.material_name, scope.row)"
                    @blur="renullMaterial(scope.row)"
                  ></el-autocomplete>
                </template>
                <span v-else>{{ scope.row.material_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单价" width="150">
              <template slot-scope="scope">
                <template v-if="scope.row.editing">
                  <el-autocomplete
                    v-model="scope.row.price"
                    :fetch-suggestions="querySearchMaterial"
                    size="small"
                    placeholder="请输入内容"
                    @select="selectMaterial(scope.row.price, scope.row)"
                    @blur="renullMaterial(scope.row)"
                  ></el-autocomplete>
                </template>
                <span v-else>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="150">
              <template slot-scope="scope">
                <template v-if="scope.row.editing">
                  <el-input v-model="scope.row.quantity" size="small"></el-input>
                </template>
                <span v-else>{{ scope.row.quantity }}</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" width="220">
              <template slot-scope="scope">
                <template v-if="scope.row.editing">
                  <el-input v-model="scope.row.remark" size="small"></el-input>
                </template>
                <span v-else>{{ scope.row.remark }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="2.4">
          <div class="bottom" style="width:3%;">
            <p><el-button class="el-icon-plus" @click.prevent="addRow()"></el-button></p>
            <p><el-button class="el-icon-minus" @click.prevent="delRow()"></el-button></p>
          </div>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import {
  createEngineerBudget,
  auditEngineerBudget,
  updateEngineerBudget,
  deleteEngineerBudget,
  fetchBudgetList,
  fetchBudgetDetail
} from '@/api/engineer'
import { fetchCategoryList, fetchMaterialList } from '@/api/supplier'

export default {
  directives: { waves },
  data() {
    return {
      engineer_id: null,
      materials: [],
      categories: [],

      // filter
      downloadLoading: false,
      loading: false,

      // table
      listLoading: true,
      list: null,
      total: 0,

      // dialog
      temp: {
        engineer_id: null,
        category_id: null,
        budget_id: null,
        budget_name: '',
        category_name: '',
        remark: '',
        materials: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: { update: '编辑', create: '新增', get: '查看' },
      rules: {
        category_name: [{ required: true, message: '请输入材料类别名称', trigger: 'change' }]
      }
    }
  },

  created() {
    this.engineer_id = this.$route.params.engineer_id
    if (this.engineer_id !== parseInt(this.engineer_id, 10) && this.$router.path !== '/engineer') {
      this.$router.replace('/engineer')
    }
    this.getList()
    fetchMaterialList().then(res => {
      this.materials = res.material_list
    })
    fetchCategoryList().then(res => {
      this.categories = res.category_list
    })
  },

  methods: {
    // filter
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        engineer_id: null,
        category_id: null,
        budget_name: '',
        category_name: '',
        remark: '',
        materials: []
      }
    },
    handleDownload() {
      this.downloadLoading = true
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel
      importEngineerExcel(rawFile).then(() => {
        this.$message.success('添加成功') // 需要引入elemrnt
      })
    },

    // table
    getList() {
      this.listLoading = true
      const data = { engineer_id: this.engineer_id }
      fetchBudgetList(data).then(res => {
        this.list = res.budget_list
        this.total = res.total_num
        this.listLoading = false
      })
    },
    handleAuditBudget(budget_id) {
      const data = { engineer_id: this.engineer_id, budget_id: budget_id }
      auditEngineerBudget(data).then(() => {
        this.getList()
      })
    },
    handleEditBudget(budget_id) {
      const data = { budget_id: budget_id }
      fetchBudgetDetail(data).then(res => {
        this.temp = Object.assign({}, res)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleDeleteBudget(budget_id) {
      const data = { engineer_id: this.engineer_id, budget_id: budget_id }
      deleteEngineerBudget(data).then(() => {
        this.$message.success('删除成功') // 需要引入elemrnt
        this.getList()
      })
    },

    // dialog
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    querySearchCategory(queryString, cb) {
      var categories = this.categories
      var results = queryString ? categories.filter(this.createStateFilter(queryString)) : categories

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 30 * Math.random())
    },
    selectCategory(category_name) {
      this.temp.remark = ''
      this.temp.materials = []
      var renull = null
      this.categories.forEach((v, i) => {
        if (category_name === v.value) {
          this.temp.category_id = v.id
          renull = false
        }
      })
      if (renull === true) {
        this.temp.category_name = null
      }
    },
    renullCategory(row) {
      var renull = true
      this.categories.forEach((v, i) => {
        if (row.category_name === v.value) {
          renull = false
        }
      })
      if (renull === true) {
        row.category_name = null
        row.material_name = null
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    querySearchMaterial(queryString, cb) {
      var category_id = this.temp.category_id
      var materials = this.materials.filter(item=>item.category_id === category_id)
      var results = queryString ? materials.filter(this.createStateFilter(queryString)) : materials

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 30 * Math.random())
    },
    selectMaterial(value, row) {
      var category_name = null
      var category_id = null
      var material_id = null
      this.materials.forEach((v, i) => {
        if (value === v.value) {
          category_name = v.category_name
          category_id = v.category_id
          material_id = v.id
          return
        }
      })
      row.category_name = category_name
      row.category_id = category_id
      row.material_id = material_id
    },
    renullMaterial(row) {
      var renull = true
      this.materials.forEach((v, i) => {
        if (row.material_name === v.value) {
          renull = false
        }
      })
      if (renull === true) {
        row.material_name = null
        row.material_id = null
        row.category_name = null
        row.category_id = null
      }
    },
    addRow() {
      var list = {
        category_name: '',
        material_name: '',
        category_id: null,
        material_id: null,
        remark: '',
        quantity: 0,
        editing: true
      }
      this.temp.materials.push(list)
    },
    delRow() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        const val = this.multipleSelection[i]
        this.temp.materials.forEach((v, i) => {
          if (val.category_id === v.category_id && val.material_id === v.material_id) {
            this.temp.materials.splice(i, 1)
          }
        })
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.engineer_id = this.engineer_id
          createEngineerBudget(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({ engineer_id: this.engineer_id }, this.temp)
          updateEngineerBudget(tempData).then(() => {
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
</style>
