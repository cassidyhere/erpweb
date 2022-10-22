<template>
  <el-dropdown trigger="click" @command="handleSetTheme">
    <div>
      <svg-icon class-name="theme-icon" icon-class="theme" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item of ThemeOptions" :key="item.value" :disabled="theme===item.value" :command="item.value">
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
      ThemeOptions: [
        { label: '默认', value: 'default' },
        { label: '灰色', value: 'gery' }
      ]
    }
  },
  computed: {
    theme() {
      return this.$store.getters.theme
    }
  },
  methods: {
    handleSetTheme(theme) {
      this.$ELEMENT.theme = theme
      this.$store.dispatch('app/setTheme', theme)
      this.refreshView()
      this.$message({
        message: 'Switch Theme Success',
        type: 'success'
      })
    },
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('tagsView/delAllCachedViews', this.$route)

      const { fullPath } = this.$route

      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }

}
</script>
