<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.key" placeholder="输入关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出excel
      </el-button>
      <el-button :loading="loading" class="filter-item" type="primary" @click="handleUpload">
        上传excel
      </el-button>
      <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :default-sort="{prop: 'id', order: 'ascending'}"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同名称" prop="contract_name" sortable="custom" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contract_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工程名称" prop="engineer_name" sortable="custom" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.engineer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" prop="supplier_name" sortable="custom" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同金额" prop="total" sortable="custom" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已使用金额" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.used_total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已支付金额" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签订日期" prop="sign_time" sortable="custom" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sign_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完结日期" prop="end_time" sortable="custom" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="200" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.audit_status===1" size="mini" type="primary" @click="handleAuditContract(scope.row.id)">
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
            type="info"
            plain
            @click="handleUpdateContract(scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.audit_status===1"
            size="mini"
            type="danger"
            plain
            @click="handleDeleteContract(scope.row.id)"
          >
            刪除
          </el-button>
          <el-button
            v-if="scope.row.audit_status===2 && scope.row.status===1"
            size="mini"
            type="primary"
            plain
            @click="handleGetContract(scope.row.id)"
          >
            查看
          </el-button>
          <el-button
            v-if="scope.row.audit_status===2 && scope.row.status===1"
            size="mini"
            type="primary"
            plain
            @click="handleBudget(scope.row.id)"
          >
            下采购单
          </el-button>
          <el-button
            v-if="scope.row.audit_status===2 && scope.row.status===1"
            size="mini"
            type="primary"
            plain
            @click="handleFinish(scope.row.id)"
          >
            完结合同
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

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
        label-width="120px"
        size="small"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="合同名称" prop="contract_name">
          <span v-if="dialogStatus==='get'">{{ temp.contract_name }}</span>
          <el-input v-else v-model="temp.contract_name" />
        </el-form-item>
        <el-form-item label="工程名称" prop="engineer_name">
          <span v-if="dialogStatus==='get'">{{ temp.engineer_name }}</span>
          <el-select v-else v-model="temp.engineer_name" placeholder="请选择">
            <el-option
              v-for="item in engineers"
              :key="item.engineer_id"
              :label="item.engineer_name"
              :value="item.engineer_name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplier_name">
          <span v-if="dialogStatus==='get'">{{ temp.supplier_name }}</span>
          <el-select v-else v-model="temp.supplier_name" placeholder="请选择" @change="selectSupplier">
            <el-option
              v-for="item in suppliers"
              :key="item.supplier_id"
              :label="item.supplier_name"
              :value="item.supplier_name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同金额(元)" prop="total">
          <span v-if="dialogStatus==='get'">{{ temp.total }}</span>
          <el-input v-else v-model="temp.total" style="width: 150px;" />
        </el-form-item>
        <el-form-item label="签订时间" prop="sign_time">
          <span v-if="dialogStatus==='get'">{{ temp.sign_time }}</span>
          <el-date-picker
            v-else
            v-model="temp.sign_time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签订用户" prop="sign_user">
          <span v-if="dialogStatus==='get'">{{ temp.sign_user }}</span>
          <el-input v-else v-model="temp.sign_user" style="width: 150px;" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <span v-if="dialogStatus==='get'">{{ temp.remark }}</span>
          <el-input v-else v-model="temp.remark" type="textarea" maxlength="128" show-word-limit />
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
            @selection-change="handleSelectionChange"
          >
            <el-table-column v-if="dialogStatus!=='get'" type="selection" width="55">
            </el-table-column>
            <el-table-column label="材料类别" width="180">
              <template slot-scope="scope">
                <!-- <template v-if="scope.row.editing">
                  <el-autocomplete
                    v-model="scope.row.category_name"
                    :fetch-suggestions="querySearchCategory"
                    size="small"
                    placeholder="请输入内容"
                    @select="selectCategory(scope.row.category_name, scope.row)"
                    @blur="renullCategory(scope.row)"
                  ></el-autocomplete>
                </template>
                <span v-else>{{ scope.row.category_name }}</span> -->
                <span>{{ scope.row.category_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="材料名称" width="200">
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
            <el-table-column label="价格" width="200">
              <template slot-scope="scope">
                <template v-if="dialogStatus!=='get'">
                  <el-input v-model="scope.row.price" size="small"></el-input>
                </template>
                <span v-else>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" width="220">
              <template slot-scope="scope">
                <template v-if="dialogStatus!=='get'">
                  <el-input v-model="scope.row.remark" size="small"></el-input>
                </template>
                <span v-else>{{ scope.row.remark }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="2.4" v-if="dialogStatus!=='get'">
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
        <el-button
          type="primary"
          v-if="dialogStatus!=='get'"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import {
  fetchContractList,
  fetchContractNames,
  fetchContractDetail,
  fetchContractEngineers,
  fetchContractSuppliers,
  createContract,
  updateContract,
  finishContract,
  auditContract,
  deleteContract,
  importContractExcel,
  fetchOrderList
} from '@/api/purchase'
import { fetchSupplierDetail } from '@/api/supplier'

export default {
  components: { Pagination },
  directives: { waves },

  data() {
    var checkTotal = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('合同金额不能为空或为0'))
      }
      setTimeout(() => {
        if (isNaN(Number(value))) {
          callback(new Error('请输入数字值'))
        } else {
          if (value <= 0) {
            callback(new Error('合同金额不能小于等于0'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    return {
      // filter
      listQuery: {
        page: 1,
        limit: 20,
        key: undefined,
        audit_status: undefined,
        status: undefined,
        sort_by: null,
        ascending: 1
      },
      listLoading: true,
      list: null,
      total: 0,
      temp: {
        contract_name: '',
        supplier_id: null,
        supplier_name: '',
        engineer_id: null,
        engineer_name: '',
        total: 0,
        sign_time: '',
        sign_user: '',
        remark: '',
        audit_status: null,
        materials: [],
        active_materials: []
      },
      downloadLoading: false,
      loading: false,

      // dialog
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '新增',
        get: '查看'
      },
      rules: {
        contract_name: [{ required: true, message: '请输入合同名称', trigger: 'change' }],
        supplier_name: [{ required: true, message: '请选择供应商名称', trigger: 'change' }],
        engineer_name: [{ required: true, message: '请选择工程名称', trigger: 'change' }],
        total: [{ required: true, validator: checkTotal, trigger: 'change' }],
        sign_time: [{ required: true, message: '请选择签订日期', trigger: 'blur' }]
      },
      engineers: [],
      suppliers: [],
      materials: []
    }
  },

  created() {
    this.getList()
    fetchContractEngineers().then(res => {
      this.engineers = res.engineers
    })
    fetchContractSuppliers().then(res => {
      this.suppliers = res.suppliers
    })
  },

  methods: {
    // filter
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchContractList(this.listQuery).then(res => {
        this.list = res.purchase_contract_list
        this.total = res.total_num
        this.listLoading = false
      })
    },
    handleCreate() {
      this.$store.dispatch('contracct/createContract')
      this.$router.push({
        name: 'createContract'
      })
    },
    resetTemp() {
      this.temp = {
        contract_name: '',
        supplier_id: null,
        supplier_name: '',
        engineer_id: null,
        engineer_name: '',
        total: 0,
        sign_time: '',
        sign_user: '',
        remark: '',
        audit_status: null,
        materials: [],
        active_materials: []
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['engineer_code', 'engineer_name', 'contact', 'phone', 'fax', 'address']
        const filterVal = ['engineer_code', 'engineer_name', 'contact', 'phone', 'fax', 'address']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        return v[j]
      }))
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
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    handleAuditContract(contract_id) {
      this.$confirm('确认审核该采购合同?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { contract_id: contract_id }
        auditContract(data).then(() => {
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },
    handleUpdateContract(contract_id) {
      const query = { contract_id: contract_id }
      fetchSupplierDetail(query).then(res => {
        this.temp = Object.assign({}, res)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleDeleteContract(contract_id) {
      this.$confirm('此操作将永久删除该采购合同, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { contract_id: contract_id }
        deleteContract(data).then(() => {
          this.$message.success('删除成功') // 需要引入elemrnt
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },
    handleGetContract(contract_id) {
      const query = { contract_id: contract_id }
      fetchContractDetail(query).then(res => {
        this.temp = Object.assign({}, res)
        this.dialogStatus = 'get'
        this.dialogFormVisible = true
      })
    },
    handleBudget(engineer_id) {
      this.$router.push({
        name: 'budget',
        params: { engineer_id: engineer_id }
      })
    },

    // dialog
    selectSupplier(supplier_name) {
      this.getIdBySupplierName(supplier_name)
      const query = { supplier_id: this.temp.supplier_id }
      fetchSupplierDetail(query).then(res => {
        this.temp.materials = this.temp.active_materials = res.materials
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    querySearchMaterial(queryString, cb) {
      if (!Array.isArray(this.temp.active_materials) || this.temp.active_materials.length === 0) {
        const query = { supplier_id: this.temp.supplier_id }
        fetchSupplierDetail(query).then(res => {
          this.temp.active_materials = res.materials
          var materials = this.temp.active_materials
          var results = queryString ? materials.filter(this.createStateFilter(queryString)) : materials

          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            cb(results)
          }, 30 * Math.random())
        }).catch(() => {
          var results = []
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            cb(results)
          }, 30 * Math.random())
        })
      } else {
        var materials = this.temp.active_materials
        var results = queryString ? materials.filter(this.createStateFilter(queryString)) : materials

        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 30 * Math.random())
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    selectMaterial(value, row) {
      var category_name = null
      var category_id = null
      var material_id = null
      this.temp.active_materials.forEach((v, i) => {
        if (value === v.value) {
          category_name = v.category_name
          category_id = v.category_id
          material_id = v.material_id
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
        editing: true
      }
      this.temp.materials.unshift(list)
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
          this.getIdByEngineerName(this.temp.engineer_name)
          this.getIdBySupplierName(this.temp.supplier_name)
          createContract(this.temp).then(() => {
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
          this.getIdByEngineerName(this.temp.engineer_name)
          this.getIdBySupplierName(this.temp.supplier_name)
          const tempData = Object.assign({ contract_id: this.temp.id }, this.temp)
          updateContract(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    getIdByEngineerName(name) {
      for (let i = 0; i < this.engineers.length; i++) {
        if (this.engineers[i].engineer_name === name) {
          this.temp.engineer_id = this.engineers[i].engineer_id
          break
        }
      }
    },
    getIdBySupplierName(name) {
      for (let i = 0; i < this.suppliers.length; i++) {
        if (this.suppliers[i].supplier_name === name) {
          this.temp.supplier_id = this.suppliers[i].supplier_id
          break
        }
      }
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
