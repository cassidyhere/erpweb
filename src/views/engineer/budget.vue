<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出excel
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :header-cell-style="{background:'#F1F3F7', color: 'black', 'font-size': '16px', padding: '4px'}"
      :cell-style="{'padding': '3px', 'font-size': '16px', 'font-weight': 500}"
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
          <el-button
            v-if="scope.row.audit_status===2"
            size="mini"
            type="primary"
            plain
            @click="handleGetBudget(scope.row.id)"
          >
            查看
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
          <el-input v-model="temp.category_name" disabled />
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
          >
            <el-table-column label="材料名称" width="170">
              <template slot-scope="scope">
                <span>{{ scope.row.material_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="关联采购合同" width="170">
              <template slot-scope="scope">
                <span>{{ scope.row.contract_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="关联采购订单" width="170">
              <template slot-scope="scope">
                <span>{{ scope.row.order_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单价(元)" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="100">
              <template slot-scope="scope">
                <template v-if="dialogStatus==='update'">
                  <el-input v-model="scope.row.quantity" size="small"></el-input>
                </template>
                <span v-else>{{ scope.row.quantity }}</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" width="200">
              <template slot-scope="scope">
                <template v-if="dialogStatus==='update'">
                  <el-input v-model="scope.row.remark" size="small"></el-input>
                </template>
                <span v-else>{{ scope.row.remark }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="dialogStatus!=='get'" type="primary" @click="dialogStatus==='update'?updateData():createData()">
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
    handleDownload() {
      this.downloadLoading = true
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
      this.$confirm('确认审核该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { engineer_id: this.engineer_id, budget_id: budget_id }
        auditEngineerBudget(data).then(() => {
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
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
    handleGetBudget(budget_id) {
      const query = { budget_id: budget_id, ignore_unplanned: 1 }
      fetchBudgetDetail(query).then(res => {
        this.temp = Object.assign({}, res)
        this.dialogStatus = 'get'
        this.dialogFormVisible = true
      })
    },
    handleDeleteBudget(budget_id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { engineer_id: this.engineer_id, budget_id: budget_id }
        deleteEngineerBudget(data).then(() => {
          this.$message.success('删除成功') // 需要引入elemrnt
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },

    // dialog
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
            this.getList()
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
