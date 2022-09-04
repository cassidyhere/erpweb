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
          <el-button v-if="scope.row.audit_status===1" size="mini" type="primary" @click="handleAuditWarehouse(scope.row.id)">
            审核
          </el-button>
          <el-button v-else size="mini" type="info" disabled>
            已审核
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="handleGetWarehouse(scope.row.id)">
            查看
          </el-button>
          <el-button v-if="scope.row.audit_status===1" size="mini" type="danger" @click="handleDeleteWarehouse(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog
      :title="textMap[dialogStatus]"
      width="1000px"
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
        <el-form-item label="关联采购单:" prop="purchase_order_name">
          <span v-if="dialogStatus==='get'">{{ temp.purchase_order_name }}</span>
          <el-select v-else v-model="temp.purchase_order_name" filterable placeholder="请选择" @change="selectPurchaseOrder">
            <el-option-group
              v-for="group in purchase_orders"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.id"
                :label="item.order_name"
                :value="item.order_name"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-row type="flex" style="width: 600px;">
          <el-col :span="12">
            <el-form-item label="关联采购合同:" prop="contract_name">
              <span>{{ temp.contract_name }}</span>
            </el-form-item>
          </el-col>
          <el-form-item label="关联供应商:" prop="supplier_name">
            <span>{{ temp.supplier_name }}</span>
          </el-form-item>
        </el-row>
        <el-row type="flex" style="width: 600px;">
          <el-col :span="12">
            <el-form-item label="关联工程:" prop="engineer_name">
              <span>{{ temp.engineer_name }}</span>
            </el-form-item>
          </el-col>
          <el-form-item label="总金额(元):" prop="total">
            <span>{{ temp.total }}</span>
          </el-form-item>
        </el-row>
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
            <el-table-column label="材料类别" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.category_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="材料名称" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.material_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单位" width="100" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.unit }}</span>
              </template>
            </el-table-column>
            <el-table-column label="规格" width="130" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.specification }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单价(元)" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="dialogStatus!=='get'" label="未进仓数量" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.unwarehouse_number }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="120">
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
          @click="dialogStatus==='create'?handleCreateWarehouse():handleUpdateWarehouse()"
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
import { fetchInoutList, fetchInout, deleteInout, createWarehouse, auditWarehouse } from '@/api/inout'
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
        contarct_name: undefined,
        supplier_name: undefined,
        engineer_name: undefined,
        total: undefined,
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
    fetchOrderElOptionGroup().then(res => {
      this.purchase_orders = res.el_option_group
    })
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
        contarct_name: undefined,
        supplier_name: undefined,
        engineer_name: undefined,
        total: undefined,
        remark: undefined,
        handler: undefined,
        handling_time: undefined,
        materials: []
      }
    },
    handleUpload() {

    },

    // table
    getList() {
      this.listLoading = true
      fetchInoutList(this.listQuery).then(res => {
        this.list = res.order_list
        this.total = res.total_num
        this.listLoading = false
      })
    },
    handleAuditWarehouse(warehouse_order_id) {
      this.$confirm('确认审核该单据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { warehouse_order_id: warehouse_order_id }
        auditWarehouse(data).then(() => {
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },
    handleGetWarehouse(warehouse_order_id) {
      const data = { order_id: warehouse_order_id, order_type: 1  }
      fetchInout(data).then(res => {
        this.temp = Object.assign({}, res) // copy obj
        this.dialogStatus = 'get'
        this.dialogFormVisible = true
      })
    },
    handleDeleteWarehouse(warehouse_order_id) {
      this.$confirm('此操作将永久删除该单据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { order_id: warehouse_order_id, order_type: 1 }
        deleteInout(data).then(() => {
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
            this.temp.purchase_order_id = options[j].id
            fetchOrderDetail({ order_id: this.temp.purchase_order_id }).then(res => {
              this.temp = Object.assign({}, res)
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
    },
    handleCreateWarehouse() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createWarehouse(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '新建供应商成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    }
  }
}
</script>
