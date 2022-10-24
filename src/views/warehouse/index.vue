<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出excel
      </el-button>
      <el-button class="filter-item" type="success" @click="handleBatch">
        切换库存批次明细
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
      :default-sort="{prop: 'id', order: 'ascending'}"
      :header-cell-style="{background:'#F1F3F7'}"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料类别" prop="category_name" sortable="custom" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.category_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料名称" prop="material_name" sortable="custom" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.material_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平均单价(元)" prop="price" sortable="custom" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="inventory_quantity" sortable="custom" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inventory_quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总价" prop="total" sortable="custom" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
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
import { fetchInventoryList, downloadInventoryExcel } from '@/api/inventory'

export default {
  components: { Pagination },
  directives: { waves },

  data() {
    return {
      // filter
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        sort_by: null,
        ascending: 1
      },
      listLoading: true,
      list: null,
      total: 0,
      downloadLoading: false,
      loading: false
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
      fetchInventoryList(this.listQuery).then(res => {
        this.list = res.inventory_list
        this.total = res.total_num
        this.listLoading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      downloadInventoryExcel(this.listQuery).then(res => {
        fileDownload(res.data, '库存概览.xlsx')
        this.downloadLoading = false
      })
    },
    handleBatch() {
      this.$router.push({ name: 'inventory-batch' })
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
