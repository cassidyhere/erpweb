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
      <el-table-column label="ID" sortable="custom" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入仓单编号" prop="order_code" sortable="custom" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.order_code }}
        </template>
      </el-table-column>
      <el-table-column label="关联采购单" prop="order_name" sortable="custom" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.order_name }}
        </template>
      </el-table-column>
      <el-table-column label="关联采购合同" prop="contract_name" sortable="custom" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contract_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联工程名称" prop="engineer_name" sortable="custom" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.engineer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总金额" prop="total" sortable="custom" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单日期" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="audit_status" sortable="custom" width="120" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.audit_status===1" size="mini" type="primary" @click="handleAuditWarehouse(scope.row.id)">
            审核
          </el-button>
          <el-button v-else size="mini" type="info" disabled>
            已审核
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="handleGetWarehouse(scope.row.id)">
            查看
          </el-button>
          <el-button v-if="scope.row.audit_status===1" size="mini" type="danger" @click="handleDeleteWarehouse(scope.row.id)">
            删除
          </el-button>
          <!-- <el-button
            size="mini"
            type="success"
            plain
            @click="handleDownloadIn(scope.row.id, scope.row.order_code)"
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
import { fetchInoutList, deleteInout, auditWarehouse, downloadInExcel } from '@/api/inout'

export default {
  components: { Pagination },
  directives: { waves },

  data() {
    return {
      listQuery: {
        order_type: 1,
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
      this.$store.dispatch('inout/clearInInfo')
      this.$router.push({
        name: 'createIn'
      })
    },
    handleUpload() {
    },
    handleGetWarehouse(warehouse_order_id) {
      this.$router.push({
        name: 'updateIn',
        params: { inout_id: warehouse_order_id }
      })
    },

    handleAuditWarehouse(warehouse_order_id) {
      this.$confirm('确认审核该单据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { warehouse_order_id: warehouse_order_id }
        auditWarehouse(data).then(() => {
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },
    handleDeleteWarehouse(warehouse_order_id) {
      this.$confirm('此操作将永久删除该单据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { order_id: warehouse_order_id, order_type: 1 }
        deleteInout(data).then(() => {
          this.$message.success('删除成功!') // 需要引入elemrnt
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },
    handleDownloadIn(inout_id, order_code) {
      this.downloadLoading = true
      downloadInExcel({ in_order_id: inout_id }).then(res => {
        fileDownload(res.data, order_code + '.xlsx')
        this.downloadLoading = false
      })
    }
  }
}
</script>
