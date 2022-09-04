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
          <el-button v-if="scope.row.audit_status===1" size="mini" type="primary" @click="handleAuditPick(scope.row.id)">
            审核
          </el-button>
          <el-button v-else size="mini" type="info" disabled>
            已审核
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="handleGetPick(scope.row.id)">
            查看
          </el-button>
          <el-button v-if="scope.row.audit_status===1" size="mini" type="danger" @click="handleDeletePick(scope.row.id)">
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
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item label="工程:" prop="engineer_name">
          <span v-if="dialogStatus==='get'">{{ temp.engineer_name }}</span>
          <el-select v-else v-model="temp.engineer_name" filterable placeholder="请选择" @change="selectEngineer">
            <el-option
              v-for="item in engineers"
              :key="item.engineer_id"
              :label="item.engineer_name"
              :value="item.engineer_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联采购合同:" prop="contract_name">
          <span v-if="dialogStatus==='get'">{{ temp.contract_name }}</span>
          <el-select v-else v-model="temp.contract_name" filterable placeholder="请选择" @change="selectPurchaseContract">
            <el-option
              v-for="item in purchase_contracts"
              :key="item.contract_id"
              :label="item.contract_name"
              :value="item.contract_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.contract_id===1" label="关联采购单:" prop="purchase_order_name">
          <span v-if="dialogStatus==='get'">{{ temp.purchase_order_name }}</span>
          <el-select v-else v-model="temp.purchase_order_name" filterable placeholder="请选择" @change="selectPurchaseOrder">
            <el-option
              v-for="item in basecamp_orders"
              :key="item.purchase_order_id"
              :label="item.order_name"
              :value="item.order_name"
            />
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
            <el-table-column label="单价(元)" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.price }}</span>
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
            <el-table-column v-if="dialogStatus!=='get'" label="可用数量" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.available_quantity }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="120">
              <template slot-scope="scope">
                <template v-if="dialogStatus!=='get'">
                  <el-input v-model="scope.row.inout_quantity" size="small" />
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
          @click="dialogStatus==='create'?handleCreatePick():handleUpdatePick()"
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
import { fetchInoutList, fetchInout, deleteInout, createPick, auditPick } from '@/api/inout'
import { fetchInventoryContracts, fetchInventoryBasecampOrders, fetchInventoryContractMaterials } from '@/api/inventory'
import { fetchContractEngineers } from '@/api/purchase'

export default {
  components: { Pagination },
  directives: { waves },

  data() {
    return {
      // filter
      listQuery: {
        order_type: 2,
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
      engineers: [],
      purchase_contracts: [],
      basecamp_orders: [],
      textMap: { update: '编辑', create: '新增', get: '查看' },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        purchase_order_id: undefined,
        purchase_order_name: undefined,
        contract_id: undefined,
        contract_name: undefined,
        engineer_id: undefined,
        engineer_name: undefined,
        total: undefined,
        remark: undefined,
        handler: undefined,
        handling_time: undefined,
        materials: []
      },
      rules: {
        engineer_name: [{ required: true, message: '请选择关联工程', trigger: 'change' }],
        contract_name: [{ required: true, message: '请选择关联采购合同', trigger: 'change' }],
        purchase_order_name: [{ required: true, message: '请选择关联采购单', trigger: 'change' }],
        handling_time: [{ required: true, message: '请选择下单时间', trigger: 'change' }],
        handler: [{ required: true, message: '请输入下单用户', trigger: 'change' }]
      }
    }
  },

  created() {
    this.getList()
    fetchContractEngineers().then(res => {
      this.engineers = res.engineers
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
        contract_name: undefined,
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
    handleAuditPick(pick_order_id) {
      this.$confirm('确认审核该单据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { pick_order_id: pick_order_id }
        auditPick(data).then(() => {
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },
    handleGetPick(pick_order_id) {
      const data = { order_id: pick_order_id, order_type: 2 }
      fetchInout(data).then(res => {
        this.temp = Object.assign({}, res) // copy obj
        this.dialogStatus = 'get'
        this.dialogFormVisible = true
      })
    },
    handleDeletePick(pick_order_id) {
      this.$confirm('此操作将永久删除该单据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { order_id: pick_order_id, order_type: 2 }
        deleteInout(data).then(() => {
          this.$message.success('删除成功!') // 需要引入elemrnt
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },

    // dialog
    selectEngineer(engineer_name) {
      this.temp.contract_id = undefined
      this.temp.contract_name = undefined
      this.temp.purchase_order_id = undefined
      this.temp.purchase_order_name = undefined
      this.temp.materials = undefined
      for (let i = 0; i < this.engineers.length; i++) {
        if (this.engineers[i].engineer_name === engineer_name) {
          this.temp.engineer_id = this.engineers[i].engineer_id
          break
        }
      }
      const data = { engineer_id: this.temp.engineer_id }
      fetchInventoryContracts(data).then(res => {
        this.purchase_contracts = res.contract_list
      })
    },
    selectPurchaseContract(contract_name) {
      for (let i = 0; i < this.purchase_contracts.length; i++) {
        if (this.purchase_contracts[i].contract_name === contract_name) {
          this.temp.contract_id = this.purchase_contracts[i].purchase_contract_id
          break
        }
      }
      if (this.temp.contract_id !== 1) {
        const data = { contract_id: this.temp.contract_id }
        fetchInventoryContractMaterials(data).then(res => {
          this.temp.materials = res.material_list
        })
      } else {
        const data = { engineer_id: this.temp.engineer_id }
        fetchInventoryBasecampOrders(data).then(res => {
          this.basecamp_orders = res.order_list
          console.log('this.basecamp_orders:', this.basecamp_orders)
        })
      }
    },
    selectPurchaseOrder(order_name) {
      for (let i = 0; i < this.basecamp_orders.length; i++) {
        if (this.basecamp_orders[i].order_name === order_name) {
          this.temp.purchase_order_id = this.basecamp_orders[i].purchase_order_id
          break
        }
      }
      const data = {
        contract_id: this.temp.contract_id,
        purchase_order_id: this.temp.purchase_order_id
      }
      fetchInventoryContractMaterials(data).then(res => {
        this.temp.materials = res.material_list
      })
    },
    handleCreatePick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createPick(this.temp).then(() => {
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
