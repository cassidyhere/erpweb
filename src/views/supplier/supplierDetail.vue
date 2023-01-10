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
              <span>{{ scope.row.material_name }}</span>
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
          <el-table-column label="是否可供应材料" min-width="130" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.relate" active-color="#13ce66"></el-switch>
            </template>
          </el-table-column>
          <!-- <el-table-column type="selection" min-width="55" /> -->
          <el-table-column min-width="200">
            <template slot="header">
              <el-switch
                v-model="onlyRelate"
                active-text="只显示可供应材料">
              </el-switch>
            </template>
            <el-table-column align="right" min-width="200">
              <template slot="header">
                <el-input v-model="mkey" size="small" placeholder="输入关键字搜索" @input="handleSearchMaterial"></el-input>
              </template>
            </el-table-column>
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
  fetchSupplierDetail,
  fetchSupplierMaterials,
  createSupplier,
  updateSupplier
} from '@/api/supplier'

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      status: undefined,
      onlyRelate: true,  // 只显示可供应材料
      supplier_id: undefined,
      temp: {},
      mkey: undefined,
      temp_materials: [],
      materials: [],

      rules: {
        supplier_name: [{ required: true, message: '请输入工程名称', trigger: 'change' }],
        contact: [{ required: true, message: '请输入联系人', trigger: 'change' }],
        eliminate: [{ required: true, message: '请选择是否淘汰', trigger: 'change' }],
        msg: [{ required: true, message: '请输入供应信息', trigger: 'change' }],
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
