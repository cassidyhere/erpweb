<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :model="temp"
      :rules="rules"
      label-width="110px"
      style="width: 800px;"
    >
      <el-form-item v-if="status==='update'" label="工程编号:" prop="engineer_code">
        <span>{{ temp.engineer_code }}</span>
      </el-form-item>
      <el-form-item label="工程名称:" prop="engineer_name">
        <el-input v-model="temp.engineer_name" />
      </el-form-item>
      <el-form-item v-if="temp.audit_status===2" label="中标情况:" prop="winner">
        <el-radio v-model="temp.winner" label="胜博" disabled>胜博</el-radio>
        <el-radio v-model="temp.winner" label="元天" disabled>元天</el-radio>
      </el-form-item>
      <!-- <el-form-item v-else label="中标情况:" prop="winner">
        <el-radio v-model="temp.winner" label="胜博" @input="handleUpdateWinner">胜博</el-radio>
        <el-radio v-model="temp.winner" label="元天" @input="handleUpdateWinner">元天</el-radio>
      </el-form-item> -->
      <el-form-item label="甲方:" prop="party_a">
        <span v-if="temp.audit_status===2">{{ temp.party_a }}</span>
        <el-input v-else v-model="temp.party_a" />
      </el-form-item>
      <el-form-item label="乙方:" prop="party_b">
        <span v-if="temp.audit_status===2">{{ temp.party_b }}</span>
        <el-input v-else v-model="temp.party_b" />
      </el-form-item>
      <el-form-item label="工程金额(元):" prop="total" label-width="120px">
        <span v-if="temp.audit_status===2">{{ strTotal }}</span>
        <el-input v-else v-model="temp.total" @input="handleUpdateTotal(temp.total)" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="签订时间:" prop="sign_time">
        <span v-if="temp.audit_status===2">{{ temp.sign_time }}</span>
        <el-date-picker
          v-else
          v-model="temp.sign_time"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item v-if="temp.audit_status===2" label="签订增项:" prop="extension">
        <el-input v-model="temp.extension" type="textarea" maxlength="128" show-word-limit />
      </el-form-item>
      <el-form-item v-if="temp.audit_status===2" label="结算价(元):" prop="settlement">
        <el-input v-model="temp.settlement" @input="handleUpdateSettlement(temp.settlement)" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input v-model="temp.remark" type="textarea" maxlength="128" show-word-limit />
      </el-form-item>
      <el-form-item label="工程类型:" prop="types" style="width: 500px;">
        <el-checkbox-group v-if="temp.audit_status===2" v-model="temp.engineer_types">
          <el-checkbox v-for="t in engineerTypes" :label="t.name" :key="t.id" disabled>{{t.name}}</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-else v-model="temp.engineer_types">
          <el-checkbox v-for="t in engineerTypes" :label="t.name" :key="t.id">{{t.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateData">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchEngineer, updateEngineer, createEngineer } from '@/api/engineer'
import { getNowTime, isNumeric, round3 } from '@/utils/common'

export default {
  data() {
    return {
      temp: {},
      rules: {
        engineer_name: [{ required: true, message: '请输入工程名称', trigger: 'change' }],
        // winner: [{ required: true, message: '请输入中标情况', trigger: 'change' }],
        total: [{ required: true, message: '请输入总金额', trigger: 'change' }],
        party_a: [{ required: true, message: '请输入甲方', trigger: 'change' }],
        party_b: [{ required: true, message: '请输入乙方', trigger: 'change' }],
        sign_time: [{ required: true, message: '请选择签订日期', trigger: 'blur' }],
        engineer_types: [{ required: true, message: '请选择至少一项工程类型', trigger: 'change' }],
      },
      engineerTypes: [
        { id: 1, name: '电房' },
        { id: 2, name: '箱变' },
        { id: 3, name: '表前' },
        { id: 4, name: '表后' }
      ]
    }
  },

  computed: {
    strTotal() {
      let v = this.temp.total
      if (typeof v === "number") return v.toFixed(3)
      return v
    }
  },

  created() {
    if (this.$route.path.endsWith('update')) {
      this.status = 'update'
      // 先从传参找inout_id，找不到再从store找
      var engineer_id = this.$route.params.engineer_id
      if (engineer_id === parseInt(engineer_id, 10)) {
        this.$store.dispatch('engineer/setEngineerId', engineer_id)
      } else {
        engineer_id = this.$store.getters.updatingEngineerId
      }
      // 没有订单则返回列表页
      if (engineer_id === undefined) {
        this.cancel()
      } else {
        this.engineer_id = engineer_id
        // 获取订单明细
        fetchEngineer({ engineer_id: engineer_id }).then(res => {
          this.temp = Object.assign({}, res)
        })
      }
    } else {
      this.status = 'create'
      // 从store找
      this.temp = this.$store.getters.engineerInfo
      if (this.temp.sign_time === undefined) {
        this.temp.sign_time = getNowTime()
      }
    }
  },

  methods: {
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var f = this.status === "update" ? updateEngineer : createEngineer
          var args = Object.assign({engineer_id: this.engineer_id}, this.temp)
          f(args).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.cancel()
          })
        }
      })
    },
    handleUpdateWinner() {
      var party_b = this.temp.party_b
      if (party_b === undefined || party_b === '' || party_b === null || party_b === '胜博' || party_b === '元天') {
        this.temp.party_b = this.temp.winner
      }
    },
    handleUpdateTotal(total) {
      if (!isNumeric(total) || Number(total) < 0) {
        this.temp.total = null
      }
    },
    handleUpdateSettlement(settlement) {
      if (!isNumeric(settlement) || Number(settlement) < 0) {
        this.temp.settlement = null
      }
    },
    cancel() {
      this.$store.dispatch('tagsView/delVisitedViewByPath', '/engineer/' + this.status, this.status + 'Engineer')
      this.$store.dispatch('engineer/clearEngineerInfo')
      this.$router.push({
        name: 'engineer'
      })
    }
  }
}
</script>

<style scoped>
.app-container{
  font-weight: 400;
}
</style>
