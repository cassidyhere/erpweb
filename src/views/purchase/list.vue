<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item away">
        供应商:
        <el-input v-model="listQuery.supplier" placeholder="输入关键字" style="width: 140px;" @keyup.enter.native="handleFilter" />
      </div>
      <div class="filter-item away">
        材料名称:
        <el-input v-model="listQuery.material_name" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="handleFilter" />
      </div>
      <div class="filter-item away">
        材料规格:
        <el-input v-model="listQuery.specification" placeholder="输入关键字" style="width: 120px;" @keyup.enter.native="handleFilter" />
      </div>
      <div class="filter-item away">
        下单日期:
        <el-date-picker
          v-model="listQuery.order_time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 220px;"
        />
      </div>
      <div class="filter-item away">
        审核状态:
        <el-select v-model="listQuery.audit_status" placeholder="请选择" style="width: 100px;">
          <el-option
            v-for="item in auditStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="filter-item away">
        工程:
        <el-input v-model="listQuery.engineer" placeholder="输入关键字" style="width: 155px;" @keyup.enter.native="handleFilter" />
      </div>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
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
      :max-height="tableHeight"
      stripe
      :header-cell-style="{'text-align':'center', background:'#F1F3F7', color: 'black', 'font-size': '14px', 'padding': '0px'}"
      :cell-style="{'padding': '0.5px', 'color': 'black', 'font-size': '14px', 'font-weight': 400}"
    >
      <!-- <el-table-column label="ID" prop="id" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="采购单编号" width="100" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.order_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" min-width="320" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单日期" min-width="90" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.order_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料名称" min-width="160" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.material_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料规格" min-width="140" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" min-width="40" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购数量" min-width="65" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价(元)" min-width="80" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额(元)" min-width="80" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已到货数量" min-width="65" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.warehoused_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工程" min-width="480" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.engineer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经手人" min-width="60" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.order_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购单审核状态" min-width="75" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.audit_status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="200" align="left">
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
        supplier: undefined,
        material_name: undefined,
        specification: undefined,
        audit_status: undefined,
        engineer: undefined
      },
      auditStatus: [{
        value: 1,
        label: '未审核'
      }, {
        value: 2,
        label: '已审核'
      }],
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
/deep/.el-table .cell, 
/deep/.el-table__cell:first-child .cell,
/deep/.el-table th.el-table__cell>.cell {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
