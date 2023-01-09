<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :model="temp"
      :rules="rules"
      label-width="110px"
      style="min-width: 1200px; max-width: 2000px"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="供应商名称" prop="supplier_name">
            <el-input v-model="temp.supplier_name" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="temp.contact" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="电话" prop="phone">
            <el-input v-model="temp.phone" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="传真" prop="fax">
            <el-input v-model="temp.fax" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机" prop="phone">
            <el-input v-model="temp.phone" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="淘汰" prop="eliminate">
            <el-radio-group v-model="temp.eliminate">
              <el-radio label=true>是</el-radio>
              <el-radio label=false>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="供应信息:" prop="msg" style="width: 50%;">
        <el-input v-model="temp.msg" type="textarea" maxlength="128" show-word-limit />
      </el-form-item>
      <el-form-item label="地址:" prop="address" style="width: 50%;">
        <el-input v-model="temp.address" type="textarea" maxlength="128" show-word-limit />
      </el-form-item>
      <el-form-item label="备注:" prop="remark" style="width: 50%;">
        <el-input v-model="temp.remark" type="textarea" maxlength="128" show-word-limit />
      </el-form-item>

      <el-form-item label="材料列表:" class="head-item" style="margin-top:30px">
        <el-table
          :data="temp_materials"
          element-loading-text="Loading"
          fit
          border
          max-height="800px"
          highlight-current-row
          stripe
          :header-cell-style="{background:'#F1F3F7', color: 'black', 'font-size': '16px', padding: '4px'}"
          :cell-style="{'padding': '3px', 'font-size': '16px', 'font-weight': 600}"
          style="width:90%"
        >
          <el-table-column label="材料类别" min-width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.category_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="材料名称" min-width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.material_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="200" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column type="selection" min-width="55" />
          <el-table-column align="right" min-width="150">
            <template slot="header">
              <el-input v-model="mkey" size="small" placeholder="输入关键字搜索" @input="handleSearchMaterial"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="handleUpdate" style="margin-left: 110px;">确定</el-button>
    <el-button @click="cancel">取消</el-button>
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
        supplier_name: [{ required: true, message: '请输入工程名称', trigger: 'change' }],
        contact: [{ required: true, message: '请输入联系人', trigger: 'change' }],
        eliminate: [{ required: true, message: '请选择是否淘汰', trigger: 'change' }],
        msg: [{ required: true, message: '请输入供应信息', trigger: 'change' }],
        address: [{ required: true, message: '请输入地址', trigger: 'change' }],
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
