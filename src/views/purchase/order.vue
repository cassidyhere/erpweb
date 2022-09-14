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
      <el-table-column label="采购订单" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购合同" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contract_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已支付金额" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单日期" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进仓状态" width="200" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.warehouse_status===1">未进仓</span>
          <span v-else-if="scope.row.warehouse_status===2">已进仓</span>
          <span v-else>全部进仓</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="200" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.audit_status===1" size="mini" type="primary" @click="handleAuditOrder(scope.row.id)">
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
            @click="handleUpdateOrder(scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.audit_status===1"
            size="mini"
            type="danger"
            plain
            @click="handleDeleteOrder(scope.row.id)"
          >
            刪除
          </el-button>
          <el-button
            v-if="scope.row.audit_status===2 && scope.row.status===1"
            size="mini"
            type="primary"
            plain
            @click="handleGetOrder(scope.row.id)"
          >
            查看
          </el-button>
          <el-button
            v-if="scope.row.audit_status===2 && scope.row.status===1"
            size="mini"
            type="primary"
            plain
            @click="handleInOrder(scope.row.id)"
          >
            入仓
          </el-button>
          <el-button
            v-if="scope.row.status===1"
            size="mini"
            type="success"
            plain
            @click="handleDownloadOrder(scope.row.id, scope.row.order_name)"
          >
            导出
          </el-button>
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
import {
  fetchOrderList,
  fetchOrderDetail,
  auditOrder,
  deleteOrder,
  downloadOrderExcel
} from '@/api/purchase'

export default {
  components: { Pagination },
  directives: { waves },

  data() {
    return {
      // filter
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        audit_status: undefined,
        key: undefined,
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
      fetchOrderList(this.listQuery).then(res => {
        this.list = res.purchase_order_list
        this.total = res.total_num
        this.listLoading = false
      })
    },
    handleCreate() {
      this.$store.dispatch('order/clearOrderInfo')
      this.$router.push({
        name: 'createOrder'
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
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    handleAuditOrder(order_id) {
      var data = { order_id: order_id }
      auditOrder(data).then(() => {
        this.getList()
      })
    },
    handleUpdateOrder(order_id) {
      this.$router.push({
        name: 'updateOrder',
        params: { order_id: order_id }
      })
    },
    handleDeleteOrder(order_id) {
      const data = { order_id: order_id }
      deleteOrder(data).then(() => {
        this.$message.success('删除成功') // 需要引入elemrnt
        this.getList()
      })
    },
    handleGetOrder(order_id) {
      this.$router.push({
        name: 'fetchOrder',
        params: { order_id: order_id }
      })
    },
    handleInOrder(order_id) {
      const data = { order_id: order_id }
      fetchOrderDetail(data).then(res => {
        this.in_materials = []
        for (let i = 0; i < res.materials.length; i++) {
          this.in_materials[i] = res.materials[i]
        } // copy obj
        this.inDialogFormVisible = true
      })
    },
    handleDownloadOrder(order_id, order_name) {
      this.downloadLoading = true
      downloadOrderExcel({ order_id: order_id }).then(res => {
        fileDownload(res.data, order_name + '.xlsx')
        this.downloadLoading = false
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
