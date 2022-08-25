<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :model="temp"
      :rules="rules"
      label-width="110px"
      style="width: 800px;"
    >
      <el-form-item label="工程名称:" prop="engineer_name">
        <el-input v-model="temp.engineer_name" />
      </el-form-item>
      <el-form-item label="中标情况:" prop="winner">
        <el-radio v-model="temp.winner" label="胜博">胜博</el-radio>
        <el-radio v-model="temp.winner" label="元天">元天</el-radio>
      </el-form-item>
      <el-form-item label="甲方:" prop="party_a">
        <el-input v-model="temp.party_a" />
      </el-form-item>
      <el-form-item label="乙方:" prop="party_b">
        <el-input v-model="temp.party_b" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="工程金额(元):" prop="total">
        <el-input v-model="temp.total" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="签订时间:" prop="sign_time">
        <el-date-picker
          v-model="temp.sign_time"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input v-model="temp.remark" type="textarea" maxlength="128" show-word-limit />
      </el-form-item>
      <el-form-item label="工程类型:" prop="types" style="width: 500px;">
        <el-checkbox-group v-model="temp.engineer_types">
          <el-checkbox v-for="t in engineerTypes" :label="t.name" :key="t.id">{{t.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createData">立即创建</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createEngineer } from '@/api/engineer'

export default {
  data() {
    return {
      rules: {
        engineer_name: [{ required: true, message: '请输入工程名称', trigger: 'change' }],
        winner: [{ required: true, message: '请输入中标情况', trigger: 'change' }],
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

  created() {
    this.temp = this.$store.getters.engineerInfo
    if (this.temp.status === 0) {
      this.getNowTime()
    }
  },

  methods: {
    getNowTime() {
      var now = new Date()
      var year = now.getFullYear() // 得到年份
      var month = now.getMonth() // 得到月份
      var date = now.getDate() // 得到日期
      month = month + 1
      month = month.toString().padStart(2, '0')
      date = date.toString().padStart(2, '0')
      var defaultDate = `${year}-${month}-${date}`
      this.$set(this.temp, 'sign_time', defaultDate)
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createEngineer(this.temp).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.$store.dispatch('tagsView/delVisitedViewByPath', '/engineer/create', 'createEngineer')
            this.$store.dispatch('engineer/clearEngineerInfo')
            this.$router.push({
              name: 'engineer'
            })
          })
        }
      })
    },
    cancel() {
      this.$store.dispatch('tagsView/delVisitedViewByPath', '/engineer/create', 'createEngineer')
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
