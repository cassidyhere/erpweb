<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.key" placeholder="关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button type="primary" icon="el-icon-search" class="filter-item"  @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出excel
      </el-button>     
    </div>

    <el-table
      :data="list"
      v-loading="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :max-height="tableHeight"
      :header-cell-style="{background:'#F1F3F7'}"
      :default-sort="{prop: 'id', order: 'descending'}"
      @sort-change="sortChange"
    >
      <el-table-column fixed label="ID" prop="id" sortable="custom" align="center" width="40">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed label="项目名称" prop="engineer_name" sortable="custom" width="240" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.engineer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工程性质" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.engineer_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中标情况" width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.winner }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工程金额(元)" prop="total" sortable="custom" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签订增项" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.extension }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算价(元)" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.settlement }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内部暂定成本(元)" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tentative_cost }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计利润(%)" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.expected_profit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款(%)" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.collection_percent }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已收款(已实收)" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.collection }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已付款" align="center">
        <el-table-column label="变压器" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.payment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="母线槽" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.payment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="箱柜" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.payment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电缆" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.payment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="桥架" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.payment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务费" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.payment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设计费" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.payment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业应交税金" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.payment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分包及人工" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.payment }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="已付款合计" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应付未付款" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rest }}</span>
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
import { fetchEngineerStats } from '@/api/engineer'
import '@/directive/table-sticky.js'

export default {
  components: { Pagination },
  directives: { waves },

  data() {
    return {
      // filter
      listQuery: {
        page: 1,
        limit: 20,
        key: undefined,
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchEngineerStats(this.listQuery).then(res => {
        this.list = res.engineer_list
        this.total = res.total_num
        this.listLoading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      downloadEngineerExcel(this.listQuery).then(res => {
        fileDownload(res.data, '资金流概况表.xlsx')
        this.downloadLoading = false
      })
    },
    getAutoHeight() {
      // 窗口高度减去表格外元素的高度
      let h = window.innerHeight - 84 - 20 - 56 - 96 - 20 - 30
      // 最小高度
      h = h > 600 ? h : 600
      this.$nextTick(() => {
        this.tableHeight = h
      })
    },
  }
}
</script>

<style scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
</style>
