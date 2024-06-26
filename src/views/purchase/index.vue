<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.key" placeholder="输入关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
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
          <!-- <el-button
            v-if="scope.row.audit_status===2 && scope.row.status===1"
            size="mini"
            type="primary"
            plain
            @click="handleCreateOrder(scope.row.id)"
          >
            下采购单
          </el-button> -->
          <el-button
            v-if="scope.row.audit_status===2 && scope.row.status===1"
            size="mini"
            type="primary"
            plain
            @click="handleFinishContract(scope.row.id)"
          >
            完结合同
          </el-button>
          <!-- <el-button
            v-if="scope.row.status===1"
            size="mini"
            type="success"
            plain
            @click="handleDownloadContract(scope.row.id)"
          >
            导出
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { fetchContractList, auditContract, deleteContract } from '@/api/purchase'

export default {
  components: { Pagination },
  directives: { waves },

  data() {
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
      downloadLoading: false,
      loading: false,
    }
  },

  created() {
    this.getList()
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
      this.$store.dispatch('contract/clearContractInfo')
      this.$router.push({
        name: 'createContract'
      })
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
      this.listQuery.sort_by = prop
      if (order === 'ascending') {
        this.listQuery.ascending = 1
      } else if (order === 'descending') {
        this.listQuery.ascending = 0
      } else {
        this.listQuery.sort_by = null
        this.listQuery.ascending = null
      }
      this.handleFilter()
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
      this.$router.push({
        name: 'updateContract',
        params: { contract_id: contract_id }
      })
    },
    handleGetContract(contract_id) {
      this.$router.push({
        name: 'fetchContract',
        params: { contract_id: contract_id }
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
    handleCreateOrder(contract_id) {
    },
    handleFinishContract(contract_id) {
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
