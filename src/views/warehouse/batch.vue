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
      <el-button class="filter-item" type="success" @click="handleInventory">
        切换库存概览
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
      :max-height="tableHeight"
      :default-sort="{prop: 'id', order: 'ascending'}"
      stripe
      :header-cell-style="{'text-align':'center', background:'#F1F3F7', color: 'black', 'font-size': '14px', 'padding': '0px'}"
      :cell-style="{'padding': '0.5px', 'color': 'black', 'font-size': '14px', 'font-weight': 400}"
      @sort-change="sortChange"
    >
      <!-- <el-table-column label="ID" prop="id" sortable="custom" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="采购合同编号" prop="contract_code" sortable="custom" min-width="120" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.contract_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购单编号" prop="order_code" sortable="custom" min-width="100" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.order_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料类别" prop="category_name" sortable="custom" min-width="100" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.category_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料名称" prop="material_name" sortable="custom" min-width="260" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.material_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" min-width="40" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" min-width="150" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="inventory_quantity" sortable="custom" min-width="70" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.inventory_quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平均单价(元)" prop="price" sortable="custom" min-width="120" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="预用库存" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lock_quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可用库存" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.available_quantity }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="总价(元)" prop="total" sortable="custom" min-width="90" align="right">
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
import { fetchInventoryBatchList, downloadInventoryBatchExcel } from '@/api/inventory'

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
      fetchInventoryBatchList(this.listQuery).then(res => {
        this.list = res.inventory_batch_list
        this.total = res.total_num
        this.listLoading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      downloadInventoryBatchExcel(this.listQuery).then(res => {
        fileDownload(res.data, '库存批次明细.xlsx')
        this.downloadLoading = false
      })
    },
    handleInventory() {
      this.$router.push({ name: 'inventory' })
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
