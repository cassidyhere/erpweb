<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
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
      :header-cell-style="{background:'#F1F3F7', color: 'black'}"
    >
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款金额(元)" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.collection }}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计收款金额(元)" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cum_collection }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票金额(元)" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.invoice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计开票金额(元)" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cum_invoice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款时间" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.collect_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.audit_status===1" size="mini" type="primary" @click="handleAuditColection(scope.row.id)">
            审核
          </el-button>
          <el-button v-if="scope.row.audit_status===1" size="mini" type="danger" @click="handleDeleteCollection(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialogTitle"
      width="1100px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item label="收款金额(元):" prop="collection">
          <el-input v-model="temp.collection" style="width: 150px;" />
        </el-form-item>
        <el-form-item label="开票金额(元):" prop="invoice">
          <el-input v-model="temp.invoice" style="width: 150px;" />
        </el-form-item>
        <el-form-item label="收款时间:" prop="collect_time">
          <el-date-picker
            v-model="temp.collect_time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleCreateCollection()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { collectionHistory, engineerCollect, deleteCollection, auditCollection } from '@/api/engineer'

export default {
  directives: { waves },
  data() {
    return {
      temp: undefined,
      downloadLoading: false,
      loading: false,
      listLoading: true,
      list: null,
      total: 0,
      dialogFormVisible: false,
      dialogTitle: '新增',
      rules: {
        collection: [{ required: true, message: '请输入收款金额', trigger: 'change' }],
        collect_time: [{ required: true, message: '请选择收款时间', trigger: 'change' }]
      }
    }
  },

  created() {
    this.engineer_id = this.$route.params.engineer_id
    this.can_edit = this.$route.params.can_edit
    if (this.engineer_id !== parseInt(this.engineer_id, 10) && this.$router.path !== '/engineer') {
      this.$router.replace('/engineer')
    }
    this.resetTemp()
    this.getList()
  },

  methods: {
    handleCreate() {
      this.resetTemp()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        engineer_id: this.engineer_id,
        collection: undefined,
        invoice: undefined,
        collect_time: undefined
      }
    },
    handleDownload() {
      this.downloadLoading = true
    },
    getList() {
      this.listLoading = true
      const data = { engineer_id: this.engineer_id }
      collectionHistory(data).then(res => {
        this.list = res.collection_history
        this.total = res.total_num
        this.listLoading = false
      })
    },
    handleAuditColection(collection_id) {
      this.$confirm('确认审核该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { engineer_id: this.engineer_id, collection_id: collection_id }
        auditCollection(data).then(() => {
          this.$message.success('审核成功!') // 需要引入elemrnt
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消审核')
      })
    },
    handleDeleteCollection(collection_id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { engineer_id: this.engineer_id, collection_id: collection_id }
        deleteCollection(data).then(() => {
          this.$message.success('删除成功!') // 需要引入elemrnt
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },
    handleCreateCollection() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          engineerCollect(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '新建收款记录成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
  }
}
</script>

<style scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
</style>
