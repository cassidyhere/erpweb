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
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :max-height="tableHeight"
      :default-sort="{prop: 'id', order: 'descending'}"
      stripe
      :header-cell-style="{'text-align':'center', background:'#F1F3F7', color: 'black', 'font-size': '14px', 'padding': '0px'}"
      :cell-style="{'padding': '0.5px', 'color': 'black', 'font-size': '14px', 'font-weight': 400}"
      @sort-change="sortChange"
    >
      <!-- <el-table-column label="ID" sortable="custom" prop="id" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="单据编号" prop="order_code" min-width="100" align="left">
        <template slot-scope="scope">
          {{ scope.row.order_code }}
        </template>
      </el-table-column>
      <el-table-column label="单据类型" prop="flag" min-width="80" align="left">
        <template slot-scope="scope">
          {{ scope.row.flag }}
        </template>
      </el-table-column>
      <el-table-column label="材料名称" prop="material_name" min-width="260" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.material_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料类别" prop="category_name" min-width="100" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.category_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" prop="specification" min-width="150" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" min-width="40" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出入库数量" min-width="90" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.inout_quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="起始数量" min-width="80" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.start_quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结存数量" min-width="80" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.end_quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出入库时间" min-width="90" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.inout_time }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { fetchInventoryRecord } from '@/api/inventory'

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
        ascending: 0
      },
      loading: false,
      list: null,
      listLoading: true,
      total: 0,
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
      fetchInventoryRecord(this.listQuery).then(res => {
        this.list = res.inventory_records
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