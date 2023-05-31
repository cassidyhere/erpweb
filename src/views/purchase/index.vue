<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item away">
        工程:
        <el-input v-model="listQuery.engineer" placeholder="输入关键字" style="width: 150px;" @keyup.enter.native="handleFilter" />
      </div>
      <div class="filter-item away">
        供应商:
        <el-input v-model="listQuery.supplier" placeholder="输入关键字" style="width: 150px;" @keyup.enter.native="handleFilter" />
      </div>
      <div class="filter-item away">
        合同:
        <el-input v-model="listQuery.contract_name" placeholder="输入关键字" style="width: 150px;" @keyup.enter.native="handleFilter" />
      </div>
      <div class="filter-item away">
        签订日期:
        <el-date-picker
          v-model="listQuery.sign_time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 220px;"
        />
      </div>
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
      :max-height="tableHeight"
      stripe
      :header-cell-style="{'text-align':'center', background:'#F1F3F7', color: 'black', 'font-size': '14px', 'padding': '0px'}"
      :cell-style="{'padding': '0.5px', 'color': 'black', 'font-size': '14px', 'font-weight': 400}"
      :default-sort="{prop: 'id', order: 'descending'}"
      @sort-change="sortChange"
    >
      <!-- <el-table-column label="ID" prop="id" sortable="custom" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="合同编号" prop="contract_code" sortable="custom" min-width="100" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.contract_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工程名称" prop="engineer_name" sortable="custom" min-width="480" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.engineer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" prop="supplier_name" sortable="custom" min-width="320" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同金额(元)" prop="total" sortable="custom" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已使用金额(元)" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ordered_total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可用金额(元)" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.leftover_total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已支付金额(元)" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签订日期" prop="sign_time" sortable="custom" width="90" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.sign_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完结日期" prop="end_time" sortable="custom" width="90" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.end_time }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" min-width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            plain
            @click.native.stop="handleUpdateContract(scope.row.id)"
          >
            查看
          </el-button>
          <el-button
            v-if="scope.row.audit_status===1"
            size="mini"
            type="danger"
            plain
            @click.native.stop="handleDeleteContract(scope.row.id)"
          >
            刪除
          </el-button>
          <!-- <el-button
            v-if="scope.row.audit_status===2 && scope.row.status===1"
            size="mini"
            type="primary"
            plain
            @click.native.stop="handleCreateOrder(scope.row.id)"
          >
            下采购单
          </el-button> -->
          <!-- <el-button
            v-if="scope.row.audit_status===2 && scope.row.status===1"
            size="mini"
            type="primary"
            plain
            @click="handleFinishContract(scope.row.id)"
          >
            完结合同
          </el-button> -->
          <el-button
            v-if="scope.row.status===1"
            size="mini"
            type="success"
            plain
            @click.native.stop="handleDownloadContract(scope.row.id, scope.row.contract_name)"
          >
            导出
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="80" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.audit_status===1" size="mini" type="primary" @click.native.stop="handleAuditContract(scope.row.id)">
            审核
          </el-button>
          <el-button v-else size="mini" type="info">
            已审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="filter-container">
      <div class="filter-item away">
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      </div>
      <div class="filter-item away" style="margin-top: 15px; margin-left: 20px">
        <span>金额合计：{{ total_amount }}</span>
      </div>
    </div>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import fileDownload from 'js-file-download'
import { fetchContractList, auditContract, deleteContract, downloadContractExcel, importContractExcel } from '@/api/purchase'

export default {
  components: { Pagination },
  directives: { waves },

  data() {
    return {
      // filter
      listQuery: {
        page: 1,
        limit: 20,
        audit_status: undefined,
        status: undefined,
        sort_by: 'id',
        ascending: 0,
        engineer: undefined,
        supplier: undefined,
        contracrt_name: undefined,
        sign_time: undefined,
      },
      listLoading: true,
      list: null,
      total: 0,
      downloadLoading: false,
      loading: false,
      tableHeight: "100px",
      total_amount: 0
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
      fetchContractList(this.listQuery).then(res => {
        this.list = res.purchase_contract_list
        this.total = res.total_num
        this.total_amount = res.total_amount
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
      importContractExcel(rawFile).then(() => {
        this.$message.success('添加成功') // 需要引入elemrnt
        this.getList()
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
      this.$router.push({
        name: 'createOrder',
        params: { contract_id: contract_id }
      })
    },
    handleFinishContract(contract_id) {
    },
    handleDownloadContract(contract_id, contracrt_name) {
      this.downloadLoading = true
      downloadContractExcel({ contract_id: contract_id }).then(res => {
        fileDownload(res.data, contracrt_name + '.xlsx')
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
/deep/.el-table .cell, 
/deep/.el-table__cell:first-child .cell {
  padding-left: 5px;
  padding-right: 5px;
}
/deep/.el-table th.el-table__cell>.cell {
  padding-left: 3px;
  padding-right: 0px;
}
</style>
