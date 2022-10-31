<template>
  <div class="app-container">
    <div class="filter-container">
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
      style="width: 100%;"
      :header-cell-style="{background:'#F1F3F7', color: 'black', 'font-size': '16px', padding: '4px'}"
      :cell-style="{'padding': '3px', 'font-size': '16px', 'font-weight': 500}"
    >
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材料类别" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.category_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总金额(元)" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已累计付款" width="400" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="handleGetCost(scope.row.category_id)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="textMap[dialogStatus]"
      width="1100px"
      :visible.sync="dialogFormVisible"
    >
      <el-row>
        <el-col :span="21.6">
          <div style="font-weight: 700; margin-left:50px; margin-bottom:10px;">成本明细</div>
          <el-table
            v-loading="listLoading"
            :data="materials"
            element-loading-text="Loading"
            fit
            height="350"
            highlight-current-row
            style="width:92%; margin-left:50px; margin-bottom:10px; margin-right:10px"
          >
            <el-table-column label="材料名称" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.material_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.quantity }}</span>
              </template>
            </el-table-column>
            <el-table-column label="总金额(元)" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.total }}</span>
              </template>
            </el-table-column>
            <el-table-column label="已累计付款" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.payment }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { fetchCostList, fetchCostDetail } from '@/api/engineer'

export default {
  directives: { waves },
  data() {
    return {
      downloadLoading: false,
      loading: false,
      listLoading: true,
      list: null,
      total: 0,
      materials: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: { update: '编辑', create: '新增', get: '查看' }
    }
  },

  created() {
    this.engineer_id = this.$route.params.engineer_id
    if (this.engineer_id !== parseInt(this.engineer_id, 10) && this.$router.path !== '/engineer') {
      this.$router.replace('/engineer')
    }
    this.getList()
  },

  methods: {
    handleDownload() {
      this.downloadLoading = true
    },
    getList() {
      this.listLoading = true
      const data = { engineer_id: this.engineer_id }
      fetchCostList(data).then(res => {
        this.list = res.cost_list
        this.total = res.total_num
        this.listLoading = false
      })
    },
    handleGetCost(category_id) {
      const data = { engineer_id: this.engineer_id, category_id: category_id }
      fetchCostDetail(data).then(res => {
        this.materials = res.materials
        this.dialogStatus = 'get'
        this.dialogFormVisible = true
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
