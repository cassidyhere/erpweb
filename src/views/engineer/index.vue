<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.key" placeholder="输入关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出excel
      </el-button>
      <!-- <el-button :loading="loading" class="filter-item" type="primary" @click="handleUpload">
        上传excel
      </el-button> -->
      <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
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
      stripe
      :header-cell-style="{background:'#F1F3F7', color: 'black', 'font-size': '16px', padding: '4px'}"
      :cell-style="{'padding': '3px', 'font-size': '16px', 'font-weight': 600}"
      :default-sort="{prop: 'id', order: 'descending'}"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工程名称" prop="engineer_name" sortable="custom" min-width="240" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.engineer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工程类型" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.engineer_type }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="中标情况" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.winner }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="工程金额(元)" prop="total" sortable="custom" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签订增项" min-width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.extension }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算价(元)" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.settlement }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内部暂定成本(元)" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tentative_cost }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已收款(已实收)" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.collection }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签订日期" prop="sign_time" sortable="custom" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sign_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="audit_status" sortable="custom" width="120" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.audit_status===1" size="mini" type="primary" @click="handleAuditEngineer(scope.row.id)">
            审核
          </el-button>
          <el-button v-else size="mini" type="info" disabled>
            已审核
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" sortable="custom" width="120" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.audit_status===1" size="mini" type="success" disabled>
            初始
          </el-button>
          <el-button v-else-if="scope.row.status===1" size="mini" type="success" @click="handleUpdateStatus(scope.row.id)">
            初始
          </el-button>
          <el-button v-else-if="scope.row.status===2" size="mini" type="success" @click="handleUpdateStatus(scope.row.id)">
            施工中
          </el-button>
          <el-button v-else-if="scope.row.status===3" size="mini" type="success" @click="handleUpdateStatus(scope.row.id)">
            竣工
          </el-button>
          <el-button v-else-if="scope.row.status===4" size="mini" type="success" @click="handleUpdateStatus(scope.row.id)">
            保修
          </el-button>
          <el-button v-else size="mini" type="primary" disabled>
            完成合同
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="320" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="canEditDetail(scope.row.status)"
            size="mini"
            type="info"
            plain
            @click="handleUpdate(scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-if="canGetDetail(scope.row.status)"
            size="mini"
            type="info"
            plain
            @click="handleUpdate(scope.row.id)"
          >
            查看
          </el-button>
          <el-button
            v-if="scope.row.audit_status===1"
            size="mini"
            type="danger"
            plain
            @click="handleDelete(scope.row.id)"
          >
            刪除
          </el-button>
          <el-button
            v-if="canEditBudget(scope.row.audit_status, scope.row.status)"
            size="mini"
            type="primary"
            plain
            @click="handleBudget(scope.row.id)"
          >
            预算分析
          </el-button>
          <el-button
            v-if="canGetBudget(scope.row.audit_status, scope.row.status)"
            size="mini"
            type="primary"
            plain
            @click="handleBudget(scope.row.id)"
          >
            预算分析
          </el-button>
          <el-button
            v-if="canGetCost(scope.row.audit_status, scope.row.status)"
            size="mini"
            type="primary"
            plain
            @click="handleCost(scope.row.id)"
          >
            成本分析
          </el-button>
          <el-button
            v-if="canEditCollect(scope.row.audit_status, scope.row.status)"
            size="mini"
            type="success"
            plain
            @click="handleCollect(scope.row.id, true)"
          >
            收款
          </el-button>
          <el-button
            v-if="canGetCollect(scope.row.status)"
            size="mini"
            type="success"
            plain
            @click="handleCollect(scope.row.id, false)"
          >
            收款记录
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
  fetchList,
  auditEngineer,
  updateEngineerStatus,
  importEngineerExcel,
  downloadEngineerExcel,
  deleteEngineer
} from '@/api/engineer'

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

  mounted() {
    this.getAutoHeight()
    const self = this;
    window.onresize = function() {
      self.getAutoHeight();
    };
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
      fetchList(this.listQuery).then(res => {
        this.list = res.engineer_list
        this.total = res.total_num
        this.listLoading = false
      })
    },
    handleCreate() {
      // this.$store.dispatch('engineer/clearEngineerInfo')
      this.$router.push({
        name: 'createEngineer'
      })
    },
    handleDownload() {
      this.downloadLoading = true
      downloadEngineerExcel(this.listQuery).then(res => {
        fileDownload(res.data, '工程列表.xlsx')
        this.downloadLoading = false
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
    canEditDetail(status) {
      if (status !== 5) {
        return true
      }
      return false
    },
    canGetDetail(status) {
      if (status === 5) {
        return true
      }
      return false
    },
    canEditBudget(audit_status, status) {
      if (audit_status === 2 && status === 1) {
        return true
      }
      return false
    },
    canGetBudget(audit_status, status) {
      if (audit_status === 2 && status > 1) {
        return true
      }
      return false
    },
    canEditCollect(audit_status, status) {
      if (audit_status === 2 && status != 5) {
        return true
      }
      return false
    },
    canGetCollect(status) {
      if (status === 5) {
        return true
      }
      return false
    },
    canGetCost(audit_status, status) {
      if (audit_status === 2 && status > 1) {
        return true
      }
      return false
    },
    handleAuditEngineer(engineer_id) {
      this.$confirm('确认审核该工程?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { engineer_id: engineer_id }
        auditEngineer(data).then(() => {
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },
    handleUpdateStatus(engineer_id) {
      this.$confirm('此操作将永久更新工程状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { engineer_id: engineer_id }
        updateEngineerStatus(data).then(() => {
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },
    handleUpdate(engineer_id) {
      this.$router.push({
        name: 'updateEngineer',
        params: { engineer_id: engineer_id }
      })
    },
    handleDelete(engineer_id) {
      this.$confirm('此操作将永久删除该工程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { engineer_id: engineer_id }
        deleteEngineer(data).then(() => {
          this.$message.success('删除成功') // 需要引入elemrnt
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },
    handleBudget(engineer_id) {
      this.$router.push({
        name: 'budget',
        params: { engineer_id: engineer_id }
      })
    },
    handleCost(engineer_id) {
      this.$router.push({
        name: 'cost',
        params: { engineer_id: engineer_id }
      })
    },
    handleCollect(engineer_id, can_edit) {
      this.$router.push({
        name: 'collection',
        params: { engineer_id: engineer_id, can_edit: can_edit }
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
    },
    getStyle(obj, attr) {
      // 兼容IE浏览器
      let result = obj.currentStyle
        ? obj.currentStyle[attr].replace("px", "")
        : document.defaultView
            .getComputedStyle(obj, null)[attr].replace("px", "");
      return Number(result);
    }
  }
}
</script>

<style scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
.app-container {
  overflow: hidden;
}
</style>

