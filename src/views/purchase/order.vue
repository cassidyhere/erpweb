<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.key" placeholder="输入关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出excel
      </el-button>
      <el-button :loading="loading" class="filter-item" type="primary" @click="handleUpload">
        上传excel
      </el-button>
      <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购订单" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购合同" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contract_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已支付金额" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单日期" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进仓状态" width="200" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.warehouse_status===1">未进仓</span>
          <span v-else-if="scope.row.warehouse_status===2">已进仓</span>
          <span v-else>全部进仓</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="200" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.audit_status===1" size="mini" type="primary" @click="handleAuditOrder(scope.row.id)">
            审核
          </el-button>
          <el-button v-else size="mini" type="info" disabled>
            已审核
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.audit_status===1"
            size="mini"
            type="info"
            plain
            @click="handleUpdateOrder(scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.audit_status===1"
            size="mini"
            type="danger"
            plain
            @click="handleDeleteOrder(scope.row.id)"
          >
            刪除
          </el-button>
          <el-button
            v-if="scope.row.audit_status===2 && scope.row.status===1"
            size="mini"
            type="primary"
            plain
            @click="handleGetOrder(scope.row.id)"
          >
            查看
          </el-button>
          <el-button
            v-if="scope.row.audit_status===2 && scope.row.status===1"
            size="mini"
            type="primary"
            plain
            @click="handleInOrder(scope.row.id)"
          >
            入仓
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog
      :title="textMap[dialogStatus]"
      width="1200px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="120px"
        size="small"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="采购订单" prop="order_name">
          <span v-if="dialogStatus==='get'">{{ temp.order_name }}</span>
          <el-input v-else v-model="temp.order_name" />
        </el-form-item>
        <el-form-item label="采购合同" prop="contract_name">
          <span v-if="dialogStatus==='get'">{{ temp.contract_name }}</span>
          <el-select v-else v-model="temp.contract_name" placeholder="请选择" @change="selectContract">
            <el-option
              v-for="item in contracts"
              :key="item.contract_id"
              :label="item.contract_name"
              :value="item.contract_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.contract_id===1" label="供应商名称" prop="supplier_name">
          <span v-if="dialogStatus==='get'">{{ temp.supplier_name }}</span>
          <el-select v-else v-model="temp.supplier_name" placeholder="请选择" @change="selectSupplier">
            <el-option
              v-for="item in suppliers"
              :key="item.supplier_id"
              :label="item.supplier_name"
              :value="item.supplier_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单金额(元)" prop="total">
          <span>{{ temp.total }}</span>
        </el-form-item>
        <el-form-item label="下单时间" prop="order_time">
          <span v-if="dialogStatus==='get'">{{ temp.order_time }}</span>
          <el-date-picker
            v-else
            v-model="temp.order_time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <span v-if="dialogStatus==='get'">{{ temp.remark }}</span>
          <el-input v-else v-model="temp.remark" type="textarea" maxlength="128" show-word-limit />
        </el-form-item>
      </el-form>

      <el-row v-if="temp.contract_id===1">
        <el-col :span="21.6">
          <div style="font-weight: 700; margin-left:50px; margin-bottom:10px;">订单内容</div>
          <el-table
            v-loading="listLoading"
            :data="temp.materials"
            element-loading-text="Loading"
            fit
            height="350"
            highlight-current-row
            style="width:92%; margin-left:50px; margin-bottom:10px; margin-right:10px"
            @selection-change="handleSelectionChange"
          >
            <el-table-column v-if="dialogStatus!=='get'" type="selection" width="55" />
            <el-table-column label="材料类别" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.category_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="材料名称" width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.editing">
                  <el-autocomplete
                    v-model="scope.row.material_name"
                    :fetch-suggestions="querySearchMaterial"
                    size="small"
                    placeholder="请输入内容"
                    @select="selectMaterial(scope.row.material_name, scope.row)"
                    @blur="renullMaterial(scope.row)"
                  />
                </template>
                <span v-else>{{ scope.row.material_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="价格" width="150">
              <template slot-scope="scope">
                <template v-if="dialogStatus!=='get'">
                  <el-input v-model="scope.row.price" size="small" />
                </template>
                <span v-else>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="150">
              <template slot-scope="scope">
                <template v-if="dialogStatus!=='get'">
                  <el-input v-model="scope.row.number" size="small" @input="calcTotal(scope.row)" />
                </template>
                <span v-else>{{ scope.row.number }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="dialogStatus==='get'" label="已入仓数量" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.warehoused_number }}</span>
              </template>
            </el-table-column>
            <el-table-column label="总价" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.total }}</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" width="220">
              <template slot-scope="scope">
                <template v-if="dialogStatus!=='get'">
                  <el-input v-model="scope.row.remark" size="small" />
                </template>
                <span v-else>{{ scope.row.remark }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col v-if="dialogStatus!=='get'" :span="2.4">
          <div class="bottom" style="width:3%;">
            <p><el-button class="el-icon-plus" @click.prevent="addRow()" /></p>
            <p><el-button class="el-icon-minus" @click.prevent="delRow()" /></p>
          </div>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="21.6">
          <div style="font-weight: 700; margin-left:50px; margin-bottom:10px;">订单内容</div>
          <el-table
            v-loading="listLoading"
            :data="temp.materials"
            element-loading-text="Loading"
            fit
            height="350"
            highlight-current-row
            style="width:92%; margin-left:50px; margin-bottom:10px; margin-right:10px"
            @sort-change="sortChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column v-if="dialogStatus!=='get'" type="selection" width="55" />
            <el-table-column label="材料类别" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.category_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="材料名称" width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.editing">
                  <el-autocomplete
                    v-model="scope.row.material_name"
                    :fetch-suggestions="querySearchMaterial"
                    size="small"
                    placeholder="请输入内容"
                    @select="selectMaterial(scope.row.material_name, scope.row)"
                    @blur="renullMaterial(scope.row)"
                  />
                </template>
                <span v-else>{{ scope.row.material_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="价格" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="150">
              <template slot-scope="scope">
                <template v-if="dialogStatus!=='get'">
                  <el-input v-model="scope.row.number" size="small" @input="calcTotal(scope.row)" />
                </template>
                <span v-else>{{ scope.row.number }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="dialogStatus==='get'" label="已入仓数量" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.warehoused_number }}</span>
              </template>
            </el-table-column>
            <el-table-column label="总价" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.total }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="备注" width="220">
              <template slot-scope="scope">
                <template v-if="dialogStatus!=='get'">
                  <el-input v-model="scope.row.remark" size="small"></el-input>
                </template>
                <span v-else>{{ scope.row.remark }}</span>
              </template>
            </el-table-column> -->
          </el-table>
        </el-col>
        <el-col v-if="dialogStatus!=='get'" :span="2.4">
          <div class="bottom" style="width:3%;">
            <p><el-button class="el-icon-plus" @click.prevent="addRow()" /></p>
            <p><el-button class="el-icon-minus" @click.prevent="delRow()" /></p>
          </div>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          v-if="dialogStatus!=='get'"
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="createInTitle"
      width="1200px"
      :visible.sync="inDialogFormVisible"
    >
      <el-row>
        <el-col :span="21.6">
          <div style="font-weight: 700; margin-left:50px; margin-bottom:10px;">新建入仓单</div>
          <el-table
            v-loading="listLoading"
            :data="in_materials"
            element-loading-text="Loading"
            fit
            height="350"
            highlight-current-row
            style="width:92%; margin-left:50px; margin-bottom:10px; margin-right:10px"
            @sort-change="sortChange"
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
            <el-table-column label="价格" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.number }}</span>
              </template>
            </el-table-column>
            <el-table-column label="已入仓数量" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.warehoused_number }}</span>
              </template>
            </el-table-column>
            <el-table-column label="拟入仓数量" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.warehousing_number }}</span>
              </template>
            </el-table-column>
            <el-table-column label="入仓数量" width="150">
              <template slot-scope="scope">
                <el-input v-model="scope.row.warehouse_number" size="small" />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="inDialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="createInOrder()"
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
import {
  fetchContractList,
  fetchContractNames,
  fetchContractDetail,
  fetchContractEngineers,
  fetchContractSuppliers,
  createContract,
  updateContract,
  finishContract,
  auditContract,
  importContractExcel,
  fetchOrderList,
  fetchOrderNames,
  fetchOrderDetail,
  createOrder,
  updateOrder,
  auditOrder,
  importOrderExcel,
  fetchOrderMaterialList,
  createOrderMaterial,
  updateOrderMaterial,
  importOrderMaterialExcel,
  deleteOrder
} from '@/api/purchase'
import { fetchSupplierDetail } from '@/api/supplier'

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    var checkTotal = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('合同金额不能为空或为0'))
      }
      setTimeout(() => {
        if (isNaN(Number(value))) {
          callback(new Error('请输入数字值'))
        } else {
          if (value <= 0) {
            callback(new Error('合同金额不能小于等于0'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    return {
      // filter
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        audit_status: undefined,
        key: undefined,
        sort_by: null,
        ascending: 1
      },
      listLoading: true,
      list: null,
      total: 0,
      temp: {
        order_name: '',
        contract_id: '',
        contract_name: '',
        supplier_id: null,
        supplier_name: '',
        total: 0,
        order_time: '',
        remark: '',
        audit_status: null,
        materials: [],
        active_materials: []
      },
      downloadLoading: false,
      loading: false,

      // dialog
      dialogFormVisible: false,
      inDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增',
        get: '查看'
      },
      rules: {
        order_name: [{ required: true, message: '请输入采购单名称', trigger: 'change' }],
        contract_name: [{ required: true, message: '请选择采购合同', trigger: 'change' }],
        supplier_name: [{ required: true, message: '请选择供应商名称', trigger: 'change' }],
        total: [{ required: true, validator: checkTotal, trigger: 'change' }],
        order_time: [{ required: true, message: '请选择签订日期', trigger: 'blur' }]
      },
      createInTitle: '新建进仓单',

      materials: [],
      categories: [],
      engineers: [],
      suppliers: [],
      contracts: [],
      in_materials: []
    }
  },

  created() {
    this.getList()
    fetchContractNames().then(res => {
      this.contracts = res.purchase_contract_names
    })
    fetchContractSuppliers().then(res => {
      this.suppliers = res.suppliers
    })
  },

  methods: {
    // filter
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchOrderList(this.listQuery).then(res => {
        this.list = res.purchase_order_list
        this.total = res.total_num
        this.listLoading = false
      })
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
        contract_name: '',
        supplier_id: null,
        supplier_name: '',
        engineer_id: null,
        engineer_name: '',
        total: 0,
        sign_time: '',
        sign_user: '',
        remark: '',
        audit_status: null,
        materials: [],
        active_materials: []
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['engineer_code', 'engineer_name', 'contact', 'phone', 'fax', 'address']
        const filterVal = ['engineer_code', 'engineer_name', 'contact', 'phone', 'fax', 'address']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        return v[j]
      }))
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
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    handleAuditOrder(order_id) {
      var data = { order_id: order_id }
      auditOrder(data).then(() => {
        this.getList()
      })
    },
    handleUpdateOrder(order_id) {
      const data = { order_id: order_id }
      fetchOrderDetail(data).then(res => {
        this.temp = Object.assign({}, res) // copy obj
        this.dialogStatus = 'get'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleDeleteOrder(order_id) {
      const data = { order_id: order_id }
      deleteOrder(data).then(() => {
        this.$message.success('删除成功') // 需要引入elemrnt
        this.getList()
      })
    },
    handleGetOrder(order_id) {
      const data = { order_id: order_id }
      fetchOrderDetail(data).then(res => {
        this.temp = Object.assign({}, res) // copy obj
        this.dialogStatus = 'get'
        this.dialogFormVisible = true
      })
    },
    handleInOrder(order_id) {
      const data = { order_id: order_id }
      fetchOrderDetail(data).then(res => {
        this.in_materials = []
        for (let i = 0; i < res.materials.length; i++) {
          this.in_materials[i] = res.materials[i]
        } // copy obj
        this.inDialogFormVisible = true
      })
    },

    // dialog
    selectContract(contract_name) {
      this.getIdByContractName(contract_name)
      if (this.temp.contract_id !== 1) {
        var data = { contract_id: this.temp.contract_id }
        fetchContractDetail(data).then(res => {
          this.createActiveMaerials(res.materials)
          this.temp.supplier_id = res.supplier_id
        })
      } else {
        this.temp.materials = this.temp.active_materials = []
      }
    },
    getIdByContractName(name) {
      for (let i = 0; i < this.contracts.length; i++) {
        if (this.contracts[i].contract_name === name) {
          this.temp.contract_id = this.contracts[i].id
          break
        }
      }
    },
    selectSupplier(supplier_name) {
      this.getIdBySupplierName(supplier_name)
      const query = { supplier_id: this.temp.supplier_id }
      fetchSupplierDetail(query).then(res => {
        this.temp.materials = res.materials
        this.createActiveMaerials(res.materials)
      })
    },
    createActiveMaerials(a) {
      var active_materials = []
      for (let i = 0; i < a.length; i++) {
        active_materials[i] = a[i]
      }
      this.temp.active_materials = active_materials
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    querySearchMaterial(queryString, cb) {
      console.log('queryString:', queryString)
      if (!Array.isArray(this.temp.active_materials) || this.temp.active_materials.length === 0) {
        const query = { supplier_id: this.temp.supplier_id }
        fetchSupplierDetail(query).then(res => {
          this.temp.active_materials = res.materials
          var materials = this.temp.active_materials
          var results = queryString ? materials.filter(this.createStateFilter(queryString)) : materials

          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            cb(results)
          }, 30 * Math.random())
        }).catch(err => {
          console.log(err)
          var results = []
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            cb(results)
          }, 30 * Math.random())
        })
        console.log('this.temp.active_materials:', this.temp.active_materials)
      } else {
        var materials = this.temp.active_materials
        console.log('this.temp.active_materials2:', this.temp.active_materials)
        var results = queryString ? materials.filter(this.createStateFilter(queryString)) : materials

        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 30 * Math.random())
      }
    },
    createStateFilter(queryString) {
      console.log('queryString2:', queryString)
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    selectMaterial(value, row) {
      var category_name = null
      var category_id = null
      var material_id = null
      var price = null
      this.temp.active_materials.forEach((v, i) => {
        if (value === v.value) {
          category_name = v.category_name
          category_id = v.category_id
          material_id = v.material_id
          price = v.price
        }
      })
      row.category_name = category_name
      row.category_id = category_id
      row.material_id = material_id
      row.price = price
    },
    renullMaterial(row) {
      var renull = true
      this.materials.forEach((v, i) => {
        if (row.material_name === v.value) {
          renull = false
        }
      })
      if (renull === true) {
        row.material_name = null
        row.material_id = null
        row.category_name = null
        row.category_id = null
        row.price = null
        row.number = null
        row.total = null
      }
    },
    calcTotal(row) {
      row.total = Number(row.price) * Number(row.number)
      this.calcTempTotal()
    },
    calcTempTotal() {
      var n = 0.0
      var materials = this.temp.materials
      for (let i = 0; i < materials.length; i++) {
        if (isNaN(materials[i].number) || isNaN(materials[i].price)) {
          continue
        } else {
          n = n + materials[i].number * materials[i].price
        }
      }
      this.temp.total = n
      console.log('this.temp.total:', this.temp.total)
    },
    addRow() {
      var list = {
        category_name: '',
        material_name: '',
        category_id: null,
        material_id: null,
        remark: '',
        price: null,
        number: 0,
        total: 0,
        editing: true
      }
      this.temp.materials.unshift(list)
    },
    delRow() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        const val = this.multipleSelection[i]
        this.temp.materials.forEach((v, i) => {
          if (val.category_id === v.category_id && val.material_id === v.material_id) {
            this.temp.materials.splice(i, 1)
          }
        })
      }
      this.calcTempTotal()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.getIdByEngineerName(this.temp.engineer_name)
          this.getIdBySupplierName(this.temp.supplier_name)
          createOrder(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.getIdByEngineerName(this.temp.engineer_name)
          this.getIdBySupplierName(this.temp.supplier_name)
          const tempData = Object.assign({ contract_id: this.temp.id }, this.temp)
          updateContract(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    getIdByEngineerName(name) {
      for (let i = 0; i < this.engineers.length; i++) {
        if (this.engineers[i].engineer_name === name) {
          this.temp.engineer_id = this.engineers[i].engineer_id
          break
        }
      }
    },
    getIdBySupplierName(name) {
      for (let i = 0; i < this.suppliers.length; i++) {
        if (this.suppliers[i].supplier_name === name) {
          this.temp.supplier_id = this.suppliers[i].supplier_id
          break
        }
      }
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
