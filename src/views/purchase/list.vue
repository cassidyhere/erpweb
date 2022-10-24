<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="listQuery"
      label-width="100px"
      style="width: 70%; min-width: 1200px;"
    >
      <el-row>
        <el-col :span="5">
          <el-form-item label="采购单编号:">
            <el-input v-model="listQuery.order_code" style="width: 140px;" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="经手人:">
            <el-input v-model="listQuery.insert_user" style="width: 140px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="供应商:">
            <el-input v-model="listQuery.supplier" style="width: 140px;" />
          </el-form-item>
        </el-col>
        <el-col :span="5.5">
          <el-form-item label="审核状态:">
            <el-radio v-model="listQuery.audit_status" label=1>未审核</el-radio>
            <el-radio v-model="listQuery.audit_status" label=2>已审核</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="工程:">
            <el-input v-model="listQuery.engineer" style="width: 140px;" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="材料:">
            <el-input v-model="listQuery.key" style="width: 140px;" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <div class="filter-container" style="margin-left: 800px;">
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
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
      :header-cell-style="{background:'#F1F3F7'}"
    >
      <el-table-column label="ID" prop="id" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购单编号" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经手人" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.engineer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.insert_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料名称" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.material_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料规格" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购数量" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价(元)" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额(元)" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已到货数量" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.warehoused_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购单审核状态" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.audit_status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="200" align="center">
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
