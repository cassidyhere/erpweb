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
          <el-form-item label="电话" prop="telephone">
            <el-input v-model="temp.telephone" />
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
          <el-input v-model="mkey" placeholder="搜索关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleSearchMaterial" />
          <el-button plain class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchMaterial">
            搜索
          </el-button>
          <el-button plain class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addRow">
            新增一行
          </el-button>
        </div>
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
              <span v-if="scope.row.type === 'new'" >{{ scope.row.material_name }}</span>
              <!-- <el-autocomplete
                v-else
                v-model="scope.row.material_name"
                value-key="material_name"
                :fetch-suggestions="querySearchMaterial"
                placeholder="请输入内容"
                @select="handleSelectMaterial(scope.row)"
                style="width: 200px;"
              /> -->
              <el-select
                v-else
                v-model="scope.row.material_name"
                filterable
                placeholder="请选择"
                @change="handleSelectMaterial(scope.row)"
              >
                <el-option
                  v-for="item in supplying_materials"
                  :key="item.material_id"
                  :label="item.material_name"
                  :value="item.material_id"
                >
                  <span style="float: left">{{ item.material_name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.specification }}</span>
                </el-option>
              </el-select>
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
              <el-button
                v-if="scope.row.can_delete===true"
                size="mini"
                type="danger"
                plain
                @click="delRow(scope.row)"
              >
                删除
              </el-button>
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
import {
  fetchCategories,
  fetchSupplyingMaterials,
   fetchMaterial
 } from '@/api/material'

export default {
  data() {
    return {
      status: undefined,
      supplier_id: undefined,
      temp: {
        supplier_name: undefined,
        contact: undefined,
        phone: undefined,
        fax: undefined,
        telephone: undefined,
        remark: undefined,
         materials: [],
        eliminate: "false",
        msg: undefined,
        address: undefined
      },
       temp_materials: [],

       mkey: undefined,
       supplying_categories: [],
       supplying_materials: [],

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
      // 先从传参找supplier_id，找不到再从store找
      var supplier_id = this.$route.params.supplier_id
      var from_store = false
      if (supplier_id === parseInt(supplier_id, 10)) {
        this.$store.dispatch('supplier/setUpdatingSupplierId', supplier_id)
      } else {
        supplier_id = this.$store.getters.updatingSupplierId
        from_store = true
      }

      // 没有供应商则返回列表页
      if (supplier_id === undefined) {
        console.log("cancel")
        this.cancel()
      } else {
        this.supplier_id = supplier_id
        // 获取订单明细
        fetchSupplierDetail({ supplier_id: this.supplier_id }).then(res => {
          this.temp = Object.assign({}, res)
          fetchSupplierMaterials({ supplier_id: this.supplier_id }).then(res => {
            this.temp_materials = this.temp.materials = res.materials
          })
        })
      }

    } else {
      this.status = 'create'
      this.temp = this.$store.getters.supplierInfo
       this.temp_materials = this.temp.materials
    }

     fetchSupplyingMaterials().then(res => {
       this.supplying_materials = res.material_list
     })
     fetchCategories().then(res => {
       this.supplying_categories = res.category_list
     })
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
       this.temp_materials.unshift(list)
     },
     delRow(row) {
       this.temp_materials.forEach((v, i) => {
         if (row.material_id === v.material_id) {
           this.temp_materials.splice(i, 1)
         }
       })
     },
     handleSearchMaterial() {
       if (typeof this.mkey === 'string' && this.mkey !== '') {
         var ret = []
         var materials = this.temp.materials
         console.log('search', materials)
         for (var i = 0; i < materials.length; i++) {
           if (materials[i].category_name.indexOf(this.mkey) !== -1 ||
               materials[i].material_name.indexOf(this.mkey) !== -1 ||
               materials[i].specification.indexOf(this.mkey) !== -1 ||
               materials[i].unit.indexOf(this.mkey) !== -1
           ) {
             console.log('here', materials[i])
             ret.push(materials[i])
           }
         }
         this.temp_materials = ret
       } else {
         this.temp_materials = this.temp.materials
         console.log('not search', this.mkey)
       }
       return this.temp_materials
     },

     querySearchMaterial(queryString, cb) {
       var materials = this.supplying_materials;
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
       fetchMaterial({material_id: row.material_name}).then(res => {
         row.category_name = res.category_name
         row.material_id = res.material_id
         row.material_name = res.material_name
         row.unit = res.unit
         row.specification = res.specification
       })
     },
    
    cancel() {
      this.$store.dispatch('tagsView/delVisitedViewByPath', '/supplier/' + this.status)
      this.$store.dispatch('supplier/clearSupplierInfo')
      this.$router.push({
        name: 'supplier'
      })
    },
    handleUpdate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var data = Object.assign({}, this.temp)
           data.materials = data.materials.filter(m => m.material_id !== undefined)
          var f = this.status === "create" ? createSupplier : updateSupplier
          f(data).then(() => {
            this.$notify({
              title: 'Success',
              message: '新增/修改供应商成功',
              type: 'success',
              duration: 2000
            })
            this.cancel()
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
