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
      <!-- <el-button :loading="loading" class="filter-item" type="primary" @click="handleUpload">
        上传excel
      </el-button> -->
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
      :max-height="tableHeight"
      stripe
      :header-cell-style="{background:'#F1F3F7', color: 'black', 'font-size': '16px', padding: '4px'}"
      :cell-style="{'padding': '3px', 'font-size': '16px', 'font-weight': 600}"
      :default-sort="{prop: 'id', order: 'descending'}"
      @sort-change="sortChange"
      @row-click="handleUpdateOrder"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购订单" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购合同" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contract_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工程" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.engineer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额(元)" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已支付金额(元)" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单日期" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进仓状态" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.warehouse_status===1">未进仓</span>
          <span v-else-if="scope.row.warehouse_status===2">已进仓</span>
          <span v-else>全部进仓</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="120" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.audit_status===1" size="mini" type="primary" @click.native.stop="handleAuditOrder(scope.row.id)">
            审核
          </el-button>
          <el-button v-else size="mini" type="info" disabled>
            已审核
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.audit_status===1"
            size="mini"
            type="danger"
            plain
            @click.native.stop="handleDeleteOrder(scope.row.id)"
          >
            刪除
          </el-button>
          <!-- <el-button
            v-if="scope.row.audit_status===2 && scope.row.status===1"
            size="mini"
            type="primary"
            plain
            @click.native.stop="handleInOrder(scope.row.id)"
          >
            入仓
          </el-button> -->
          <el-button
            v-if="scope.row.status===1"
            size="mini"
            type="success"
            plain
            @click.native.stop="handleDownloadOrder(scope.row.id, scope.row.order_name)"
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
  fetchOrder,
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
        sort_by: 'id',
        ascending: 0
      },
      listLoading: true,
      list: null,
      total: 0,
      downloadLoading: false,
      loading: false,
      tableHeight: "100px"
    }
  },

  created() {
    this.getList()
  },

  mounted() {
    this.getAutoHeight()
    const self = this;
    window.onresize = function() {
      self.getAutoHeight();
    };
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
    handleAuditOrder(order_id) {
      this.$confirm('确认审核该采购订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        auditOrder({ order_id: order_id }).then(() => {
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })     
    },
    handleUpdateOrder(row) {
      this.$router.push({
        name: 'updateOrder',
        params: { order_id: row.id }
      })
    },
    handleDeleteOrder(order_id) {
      this.$confirm('此操作将永久删除该采购订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrder({ order_id: order_id }).then(() => {
          this.$message.success('删除成功') // 需要引入elemrnt
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },
    handleInOrder(order_id) {
      this.$router.push({
        name: 'createIn',
        params: { order_id: order_id }
      })

      const data = { order_id: order_id }
      fetchOrder(data).then(res => {
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
    },
    getAutoHeight() {
      // 窗口高度减去表格外元素的高度
      let h = window.innerHeight - 84 - 20 - 56 - 32 - 20 - 30
      // 最小高度
      h = h > 600 ? h : 600
      this.$nextTick(() => {
        this.tableHeight = h
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
