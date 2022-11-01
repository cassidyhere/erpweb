<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="listQuery"
      label-width="100px"
      style="width: 100%; min-width: 1400px;"
    >
      <el-row>
        <el-col :span="3.5">
          <el-input v-model="listQuery.key" placeholder="输入关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :span="5">
          <el-form-item label="审核状态:">
            <el-radio v-model="listQuery.audit_status" label=1>未审核</el-radio>
            <el-radio v-model="listQuery.audit_status" label=2>已审核</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
            导出excel
          </el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :max-height="tableHeight"
      stripe
      :header-cell-style="{background:'#F1F3F7', color: 'black', 'font-size': '16px', padding: '4px'}"
      :cell-style="{'padding': '3px', 'font-size': '16px', 'font-weight': 600}"
    >
      <el-table-column label="ID" prop="id" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购单编号" min-width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" min-width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经手人" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.engineer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" min-width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.insert_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料名称" min-width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.material_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料规格" min-width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" min-width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购数量" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价(元)" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额(元)" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已到货数量" min-width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.warehoused_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购单审核状态" min-width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.audit_status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
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
import { fetchPurchaseList, downloadPurachaseExcel } from '@/api/purchase'

export default {
  components: { Pagination },
  directives: { waves },

  data() {
    return {
      // filter
      listQuery: {
        page: 1,
        limit: 20,
        order_code: undefined,
        insert_user: undefined,
        supplier: undefined,
        audit_status: undefined,
        engineer: undefined,
        key: undefined,
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
      fetchPurchaseList(this.listQuery).then(res => {
        this.list = res.purchase_list
        this.total = res.total_num
        this.listLoading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      downloadPurachaseExcel(this.listQuery).then(res => {
        fileDownload(res.data, '采购明细.xlsx')
        this.downloadLoading = false
      })
    },
    getAutoHeight() {
      // 窗口高度减去表格外元素的高度
      let h = window.innerHeight - 84 - 20 - 102-53 - 42 - 20 - 30
      // 最小高度
      h = h > 500 ? h : 500
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
