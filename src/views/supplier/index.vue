<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="搜索关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
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
      style="width: 100%;"
      :max-height="tableHeight"
      :default-sort="{prop: 'id', order: 'ascending'}"
      stripe
      :header-cell-style="{background:'#F1F3F7', color: 'black', 'font-size': '16px', padding: '4px'}"
      :cell-style="{'padding': '3px', 'font-size': '16px', 'font-weight': 600}"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" prop="supplier_name" sortable="custom" min-width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应信息" min-width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.msg }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" min-width="130" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contact }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" min-width="130" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="传真" min-width="130" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fax }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" min-width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="140" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="info" plain @click="handleUpdate(scope.row)">查看</el-button>
          <el-button
            v-if="scope.row.status!='deleted' && scope.row.can_delete===true"
            size="mini"
            type="danger"
            plain
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog
      :title="textMap[dialogStatus]"
      width="900px"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="100px"
        size="small"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item v-if="dialogStatus==='update'" label="供应商编号" prop="supplier_code">
          <el-input v-model="temp.supplier_code" :disabled="true" />
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplier_name">
          <el-input v-model="temp.supplier_name" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="temp.contact" style="width: 150px;" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone" style="width: 150px;" />
        </el-form-item>
        <el-form-item label="传真" prop="fax">
          <el-input v-model="temp.fax" style="width: 150px;" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" type="textarea" maxlength="128" show-word-limit />
        </el-form-item>
      </el-form>

      <el-row>
        <el-col :span="21.6">
          <div style="font-weight: 700; margin-left:50px; margin-bottom:10px;">供应材料</div>
          <el-table
            :data="temp.materials"
            element-loading-text="Loading"
            fit
            height="350"
            highlight-current-row
            style="width:92%; margin-left:50px; margin-bottom:10px; margin-right:10px"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="材料类别" width="180">
              <template slot-scope="scope">
                <template v-if="scope.row.editing">
                  <el-autocomplete
                    v-model="scope.row.category_name"
                    :fetch-suggestions="querySearchCategory"
                    size="small"
                    placeholder="请输入内容"
                    @select="selectCategory(scope.row.category_name, scope.row)"
                    @blur="renullCategory(scope.row)"
                  />
                </template>
                <span v-else>{{ scope.row.category_name }}</span>
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
                <!-- </el-form-item> -->
              </template>
            </el-table-column>
            <el-table-column label="备注" width="220">
              <template slot-scope="scope">
                <template v-if="scope.row.editing">
                  <el-input v-model="scope.row.remark" size="small" />
                </template>
                <span v-else>{{ scope.row.remark }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="2.4">
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
          type="primary"
          @click="dialogStatus==='create'?handleCreateSupplier():handleUpdateSupplier()"
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
import fileDownload from 'js-file-download'
import {
  fetchList,
  fetchSupplierDetail,
  createSupplier,
  updateSupplier,
  importSupplierExcel,
  downloadSupplierExcel,
  fetchCategoryList,
  fetchMaterialList,
  deleteSupplier
} from '@/api/supplier'

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
      downloadLoading: false,
      loading: false,

      // table
      list: null,
      listLoading: true,
      total: 0,

      // dialog
      materials: [],
      categories: [],
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        supplier_id: null,
        supplier_code: '',
        supplier_name: '',
        contact: '',
        phone: '',
        fax: '',
        address: '',
        remark: '',
        materials: []
      },
      rules: {
        supplier_name: [{ required: true, message: '请输入工程名称', trigger: 'change' }]
      },
      multipleSelection: [],
      tableHeight: "100px"
    }
  },

  created() {
    this.getList()
    fetchMaterialList().then(res => {
      this.materials = res.material_list
    })
    fetchCategoryList().then(res => {
      this.categories = res.category_list
    })
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
    handleCreate() {
      this.$router.push({name: 'createSupplier'})
    },
    resetTemp() {
      this.temp = {
        supplier_code: '',
        supplier_name: '',
        contact: '',
        phone: '',
        fax: '',
        address: '',
        remark: '',
        materials: []
      }
    },
    handleDownload() {
      this.downloadLoading = true
      downloadSupplierExcel(this.listQuery).then(res => {
        fileDownload(res.data, '供应商列表.xlsx')
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
      this.uploadFile(rawFile)
    },
    uploadFile(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel
      importSupplierExcel(rawFile).then(() => {
        this.$message.success('添加成功') // 需要引入elemrnt
      })
    },

    // table
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id' || prop === 'supplier_name') {
        this.listQuery.sort_by = prop
      }
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
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(res => {
        this.list = res.supplier_list
        this.total = res.total_num
        this.listLoading = false
      })
    },
    handleUpdate(row) {
      this.$router.push({
        name: 'updateSupplier',
        params: { supplier_id: row.id }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该供应商, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSupplier(row).then(() => {
          this.$message.success('删除成功!') // 需要引入elemrnt
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },

    // dialog
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    querySearchCategory(queryString, cb) {
      var categories = this.categories
      var results = queryString ? categories.filter(this.createStateFilter(queryString)) : categories

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 30 * Math.random())
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    selectCategory(value, row) {
      var renull = null
      this.materials.forEach((v, i) => {
        if ((row.material_name === v.value) && (v.category_name === value)) {
          renull = false
        }
      })
      if (renull === true) {
        row.category_name = null
        row.material_name = null
      }
    },
    renullCategory(row) {
      var renull = true
      this.categories.forEach((v, i) => {
        if (row.category_name === v.value) {
          renull = false
        }
      })
      if (renull === true) {
        row.category_name = null
        row.material_name = null
      }
    },
    querySearchMaterial(queryString, cb) {
      var materials = this.materials
      var results = queryString ? materials.filter(this.createStateFilter(queryString)) : materials

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 30 * Math.random())
    },
    selectMaterial(value, row) {
      var category_name = null
      var category_id = null
      var material_id = null
      this.materials.forEach((v, i) => {
        if (value === v.value) {
          category_name = v.category_name
          category_id = v.category_id
          material_id = v.id
          return
        }
      })
      row.category_name = category_name
      row.category_id = category_id
      row.material_id = material_id
      console.log(row)
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
      }
    },
    addRow() {
      var list = {
        category_id: null,
        category_name: '',
        material_id: null,
        material_name: '',
        remark: '',
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
    },
    handleCreateSupplier() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createSupplier(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '新建供应商成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdateSupplier() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({ supplier_id: this.temp.id }, this.temp)
          updateSupplier(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新供应商信息成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
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
