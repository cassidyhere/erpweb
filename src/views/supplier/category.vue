<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出excel
      </el-button>
      <el-button :loading="loading" class="filter-item" type="primary" @click="handleUpload">
        上传excel
      </el-button>
      <input
        ref="excel-upload-input"
        class="excel-upload-input"
        type="file"
        accept=".xlsx, .xls"
        @change="handleClick"
      >
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
      <el-table-column label="材料类别名称" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.category_name }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button
            v-if="scope.row.can_delete===true"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
          <el-button v-else size="mini" type="danger" disabled>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
        size="small"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="材料类别名称" prop="category_name">
          <el-input v-model="temp.category_name" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?handleCreateCategory():handleUpdateCategory()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import {
  fetchCategories,
  updateCategory,
  deleteCategory,
  createCategory,
  importCategoryExcel
} from '@/api/material'

export default {
  directives: { waves },

  data() {
    return {
      // filter
      downloadLoading: false,
      loading: false,

      // table
      list: null,
      listLoading: true,

      // dialog
      textMap: { update: '编辑', create: '新增' },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: undefined,
        category_name: ''
      },
      rules: {
        category_name: [{ required: true, message: '请输入材料类别', trigger: 'change' }]
      }
    }
  },

  created() {
    this.getList()
  },

  methods: {
    // filter
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
        id: undefined,
        category_name: ''
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['材料类别名称']
        const filterVal = ['category_name']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '材料类别表'
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
      this.uploadFile(rawFile)
    },
    uploadFile(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel
      importCategoryExcel(rawFile).then(() => {
        this.$message.success('添加成功') // 需要引入elemrnt
        this.getList()
      })
    },

    // table
    getList() {
      this.listLoading = true
      fetchCategories().then(res => {
        this.list = res.category_list
        this.listLoading = false
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(category_id) {
      this.$confirm('此操作将永久删除该材料类别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { category_id: category_id }
        deleteCategory(data).then(() => {
          this.$message.success('删除成功!') // 需要引入elemrnt
          this.getList()
        })
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },

    // dialog
    handleCreateCategory() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = { category_name: this.temp.category_name }
          createCategory(data).then(res => {
            this.dialogFormVisible = false
            this.$message.success('更新材料类别成功')
            this.getList()
          })
        }
      })
    },
    handleUpdateCategory() {
      console.log(this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = { category_id: this.temp.id, category_name: this.temp.category_name }
          updateCategory(data).then(() => {
            this.dialogFormVisible = false
            this.$message.success('更新材料类别成功')
            this.getList()
          })
        }
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
