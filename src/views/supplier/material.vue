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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-edit"
        @click="handleOpenCategory"
      >
        管理材料类别
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :header-cell-style="{background:'#F1F3F7'}"
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
      <el-table-column label="材料名称" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.material_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否淘汰" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ disabled_status[scope.row.status] }}</span>
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
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
          <el-button v-else size="mini" type="danger" disabled>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

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
        label-width="100px"
        size="small"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item v-if="dialogStatus==='update'" label="材料类别" prop="category_name">
          <el-input v-model="temp.category_name" :disabled="true" />
        </el-form-item>
        <el-form-item v-else label="材料类别" prop="category_name">
          <el-select v-model="temp.category_name" placeholder="请选择" @change="selectCategory">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.category_name"
              :value="item.category_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="材料名称" prop="material_name">
          <el-input v-model="temp.material_name" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="temp.unit" style="width: 150px;" />
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input v-model="temp.specification" style="width: 150px;" />
        </el-form-item>
        <el-form-item label="是否淘汰" prop="disused">
          <el-switch v-model="temp.disused" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" type="textarea" maxlength="128" show-word-limit />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?handleCreateMaterial():handleUpdateMaterial()"
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
  fetchList,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  fetchCategories
} from '@/api/material'

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
        status: null
      },

      // table
      list: null,
      listLoading: true,
      total: 0,
      disabled_status: { 1: '否', 2: '是' },

      // dialog
      categories: [],
      textMap: { update: '编辑', create: '新增' },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        category_id: undefined,
        material_id: undefined,
        material_name: '',
        unit: '',
        specification: '',
        remark: '',
        disused: undefined,
        status: undefined
      },
      rules: {
        category_name: [{ required: true, message: '请选择材料类别', trigger: 'change' }],
        material_name: [{ required: true, message: '请输入材料名称', trigger: 'change' }],
        unit: [{ required: true, message: '请输入单位', trigger: 'change' }],
        specification: [{ required: true, message: '请输入规格', trigger: 'change' }]
      }
    }
  },

  created() {
    this.getList()
    fetchCategories().then(res => {
      this.categories = res.category_list
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
        category_id: undefined,
        material_id: undefined,
        material_name: '',
        unit: '',
        specification: '',
        remark: '',
        disused: undefined,
        status: undefined
      }
    },
    handleOpenCategory() {
      this.$router.push({ name: 'category' })
    },

    // table
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(res => {
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
    selectCategory(caterory_name) {
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].category_name === caterory_name) {
          this.temp.category_id = this.categories[i].id
          break
        }
      }
    },
    handleCreateMaterial() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createMaterial(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '新建材料成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpdateMaterial() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({ material_id: this.temp.id }, this.temp)
          updateMaterial(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新材料信息成功',
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
