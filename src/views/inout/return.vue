<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="搜索关键字"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
      <!-- <el-button :loading="loading" class="filter-item" type="primary" @click="handleUpload">
        上传excel
      </el-button> -->
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :default-sort="{prop: 'id', order: 'descending'}"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退货单编号" prop="order_code" sortable="custom" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.order_code }}
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" prop="supplier_name" sortable="custom" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总金额" prop="total" sortable="custom" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单日期" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="80" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.audit_status===1" size="mini" type="primary" @click="handleAuditReturn(scope.row.id)">
            审核
          </el-button>
          <el-button v-else size="mini" type="info" disabled>
            已审核
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="handleGetReturn(scope.row.id)">
            查看
          </el-button>
          <el-button v-if="scope.row.audit_status===1" size="mini" type="danger" @click="handleDeleteReturn(scope.row.id)">
            删除
          </el-button>
          <!-- <el-button
            size="mini"
            type="success"
            plain
            @click="handleDownloadReturn(scope.row.id, scope.row.order_code)"
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
import fileDownload from 'js-file-download'
import { fetchInoutList, deleteInout, auditReturn, downloadReturnExcel } from '@/api/inout'

export default {
  components: { Pagination },
  directives: { waves },

  data() {
    return {
      // filter
      listQuery: {
        order_type: 5,
        page: 1,
        limit: 20,
        status: undefined,
        audit_status: undefined,
        key: undefined,
        sort_by: 'id',
        ascending: 1
      },
      loading: false,
      list: null,
      listLoading: true,
      total: 0,
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
      fetchInoutList(this.listQuery).then(res => {
        this.list = res.order_list
        this.total = res.total_num
        this.listLoading = false
      })
    },
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

    handleCreate() {
      this.$store.dispatch('inout/clearReturnInfo')
      this.$router.push({
        name: 'createReturn'
      })
    },
    handleUpload(inout_id) {
      this.$router.push({
        name: 'updateReturn',
        params: { inout_id: inout_id }
      })
    },
    handleGetReturn(inout_id) {
      this.$router.push({
        name: 'updateReturn',
        params: { inout_id: inout_id }
      })
    },

    handleAuditReturn(return_order_id) {
      this.$confirm('确认审核该单据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { return_order_id: return_order_id }
        auditReturn(data).then(() => {
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },
    handleDeleteReturn(return_order_id) {
      this.$confirm('此操作将永久删除该单据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { order_id: return_order_id, order_type: 5 }
        deleteInout(data).then(() => {
          this.$message.success('删除成功!') // 需要引入elemrnt
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },
    handleDownloadReturn(inout_id, order_code) {
      this.downloadLoading = true
      downloadReturnExcel({ return_order_id: inout_id }).then(res => {
        fileDownload(res.data, order_code + '.xlsx')
        this.downloadLoading = false
      })
    }
  }
}
</script>
