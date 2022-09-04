<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="搜索关键字slip"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-button :loading="loading" class="filter-item" type="primary" @click="handleUpload">
        上传excel
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
    >
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联采购单" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.order_name }}
        </template>
      </el-table-column>
      <el-table-column label="关联采购合同" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contract_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联工程名称" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.engineer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总金额" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单日期" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.handling_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="80" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.audit_status===1" size="mini" type="primary" @click="handleAuditSlip(scope.row.id)">
            审核
          </el-button>
          <el-button v-else size="mini" type="info" disabled>
            已审核
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.audit_status===1" type="primary" size="mini" @click="handleUpdateSlip(scope.row.id)">
            编辑
          </el-button>
          <el-button v-else size="mini" type="info" @click="handleGetInout(scope.row.id)">
            查看
          </el-button>
          <el-button v-if="scope.row.audit_status===1" size="mini" type="danger" @click="handleDeleteSlip(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog
      :title="textMap[dialogStatus]"
      width="800px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="110px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item label="关联采购合同:" prop="purchase_order_name">
          <span v-if="dialogStatus==='get'">{{ temp.category_name }}</span>
          <el-select v-else v-model="temp.category_name" placeholder="请选择" @change="selectCategory">
            <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.category_name===1" label="关联采购单:" prop="purchase_order_name">
          <span v-if="dialogStatus==='get'">{{ temp.purchase_order_name }}</span>
          <el-select v-else v-model="temp.purchase_order_name" placeholder="请选择" @change="selectPurchaseOrder">
            <el-option
              v-for="item in purchase_orders"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间:" prop="handling_time">
          <span v-if="dialogStatus==='get'">{{ temp.handling_time }}</span>
          <el-date-picker
            v-else
            v-model="temp.handling_time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="下单用户:" prop="handler">
          <span v-if="dialogStatus==='get'">{{ temp.handler }}</span>
          <el-input v-else v-model="temp.handler" style="width: 150px;" />
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <span v-if="dialogStatus==='get'">{{ temp.remark }}</span>
          <el-input v-else v-model="temp.remark" type="textarea" maxlength="128" show-word-limit />
        </el-form-item>
      </el-form>

      <el-row>
        <el-col :span="21.6">
          <div style="font-weight: 700; margin-left:50px; margin-bottom:10px;">材料</div>
          <el-table
            :data="temp.materials"
            element-loading-text="Loading"
            fit
            height="350"
            highlight-current-row
            style="width:92%; margin-left:50px; margin-bottom:10px; margin-right:10px"
          >
            <el-table-column label="材料类别" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.category_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="材料名称" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.material_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="200">
              <template slot-scope="scope">
                <template v-if="dialogStatus!=='get'">
                  <el-input v-model="scope.row.inout_quantity" size="small" @input="calcTotal" />
                </template>
                <span v-else>{{ scope.row.inout_quantity }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?handleCreateSlip():handleUpdateSlip()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { fetchInoutList, fetchInout, createSlip, auditSlip } from '@/api/inout'
import { fetchOrderElOptionGroup, fetchOrderDetail } from '@/api/purchase'

export default {
  components: { Pagination },
  directives: { waves },

  data() {
    return {
      // filter
      listQuery: {
        order_type: 1,
        page: 1,
        limit: 20,
        status: undefined,
        audit_status: undefined,
        key: undefined,
        sort_by: null,
        ascending: 1
      },
      loading: false,

      // table
      list: null,
      listLoading: true,
      total: 0,

      // dialog
      purchase_orders: [],
      textMap: { update: '编辑', create: '新增', get: '查看' },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        purchase_order_id: undefined,
        purchase_order_name: undefined,
        contarct_id: undefined,
        contarct_name: undefined,
        remark: undefined,
        handler: undefined,
        handling_time: undefined,
        materials: []
      },
      rules: {
        purchase_order_name: [{ required: true, message: '请选择关联采购单', trigger: 'change' }],
        handling_time: [{ required: true, message: '请选择下单时间', trigger: 'change' }],
        handler: [{ required: true, message: '请输入下单用户', trigger: 'change' }]
      }
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        purchase_order_id: undefined,
        purchase_order_name: undefined,
        contarct_id: undefined,
        contarct_name: undefined,
        remark: undefined,
        handler: undefined,
        handling_time: undefined,
        materials: []
      }
    },

    // table
    getList() {
      this.listLoading = true
      fetchInoutList(this.listQuery).then(res => {
        this.list = res.material_list
        this.total = res.total_num
        this.listLoading = false
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({ disused: row.status === 2 }, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该材料, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMaterial(row).then(() => {
          this.$message.success('删除成功!') // 需要引入elemrnt
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },

    // dialog
    selectPurchaseOrder(order_name) {
      this.resetTemp()
      for (let i = 0; i < this.purchase_orders.length; i++) {
        var options = this.purchase_orders[i].options
        var right = false
        for (let j = 0; j < options.length; j++) {
          if (options[j].order_name === order_name) {
            this.temp.purchase_order_name = options[j].order_name
            this.temp.purchase_order_id = options[j].id
            this.temp.contract_name = options[j].contract_name
            this.temp.supplier_name = options[j].supplier_name
            this.temp.engineer_name = options[j].engineer_name
            fetchOrderDetail({ order_id: this.temp.purchase_order_id }).then(res => {
              this.temp.materials = res.materials
            })
            right = true
            break
          }
        }
        if (right === true) {
          break
        }
      }
      console.log('this.temp:', this.temp)
    },
    calcTotal() {
      this.temp.total = undefined
      var n = 0.0
      var materials = this.temp.materials
      for (let i = 0; i < materials.length; i++) {
        if (isNaN(materials[i].inout_quantity) || isNaN(materials[i].price)) {
          continue
        } else {
          n = n + materials[i].inout_quantity * materials[i].price
        }
      }
      this.temp.total = n
      console.log('this.temp.total:', this.temp.total)
    }
  }
}
</script>
