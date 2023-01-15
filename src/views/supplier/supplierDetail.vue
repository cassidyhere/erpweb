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
        <div  class="filter-container">
          <el-input placeholder="搜索关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button plain class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button plain class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addRow">
            新增一行
          </el-button>
        </div>
        <el-table
          :data="materials"
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
              <span v-if="scope.row.type === 'new'" >{{ scope.row.material_name }}</span>
              <el-autocomplete
                v-else
                v-model="scope.row.material_name"
                value-key="material_name"
                :fetch-suggestions="querySearchMaterial"
                placeholder="请输入内容"
                @select="handleSelectMaterial(scope.row)"
                style="width: 200px;"
              />
            </template>
          </el-table-column>
          <el-table-column label="单位" min-width="150" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" min-width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.specification }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="220" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="140" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" plain @click="delRow(scope.row)">删除</el-button>
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
import {
  fetchSupplierDetail,
  fetchSupplierMaterials,
  createSupplier,
  updateSupplier
} from '@/api/supplier'

export default {
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined
      },

      status: undefined,
      supplier_id: undefined,
      temp: {},
      mkey: undefined,
      materials: [],
      search_categories: [],
      search_materials: [],

      rules: {
        supplier_name: [{ required: true, message: '请输入工程名称', trigger: 'change' }],
        contact: [{ required: true, message: '请输入联系人', trigger: 'change' }],
        eliminate: [{ required: true, message: '请选择是否淘汰', trigger: 'change' }],
        address: [{ required: true, message: '请输入地址', trigger: 'change' }],
      }
    }
  },

  created() {
    if (this.$route.path.endsWith('update')) {
      this.status = 'update'
      // 先从传参找contract_id，找不到再从store找
      var supplier_id = this.$route.params.supplier_id

      this.supplier_id = supplier_id
      fetchSupplierDetail({ supplier_id: this.supplier_id }).then(res => {
        this.temp = Object.assign({}, res)
        this.materials = this.temp.materials
      })
      fetchSupplierMaterials({ supplier_id: this.supplier_id }).then(res => {
        // this.materials = Object.assign({}, res)
        this.materials = res.materials
        this.total = res.total_num
        this.listLoading = false
      })

    }
  },

  mounted() {
    this.getAutoHeight()
    const self = this;
    window.onresize = function() {
      self.getAutoHeight();
    };
  },

  methods: {
    addRow() {
      var list = {
        category_id: null,
        category_name: '',
        material_id: null,
        material_name: '',
        remark: '',
        editing: true
      }
      this.materials.unshift(list)
    },

    delRow(row) {
      this.materials.forEach((v, i) => {
        if (row.material_id === v.material_id) {
          this.materials.splice(i, 1)
        }
      })
    },

    querySearchMaterial(queryString, cb) {
      var materials = this.materials;
      var results = queryString ? materials.filter(this.createMaterialFilter(queryString)) : materials;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createMaterialFilter(queryString) {
      return (materials) => {
        return (materials.material_name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      };
    },
    handleSelectMaterial(row) {
      this.temp.contract_id = item.contract_id
      this.temp.contract_name = item.contract_name
      this.temp.total = 0
      fetchContractInfo({ contract_id: item.contract_id }).then(res => {
        Object.assign(this.temp, res)
        this.temp_materials = this.temp.materials
      })
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
