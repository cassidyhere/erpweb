<template>
  <div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :max-height="tableHeight"
      stripe
      :header-cell-style="{background:'#F1F3F7', color: 'black', 'font-size': '16px', padding: '3px'}"
      :cell-style="{'padding': '0.5px', 'color': 'black', 'font-size': '16px', 'font-weight': 600}"
      :default-sort="{prop: 'id', order: 'descending'}"
      @sort-change="sortChange"
    >
      <template v-for="(item, index) in columns">
        <el-table-column
          :show-overflow-tooltip="true"
          v-if="item.show != false" 
          :key="index"
          :sortable="item.sortable"
          :prop="item.prop"
          :label="item.label"
          :align="item.align ? item.align : 'left'"
          :width="item.width"
        >
        </el-table-column>
      </template>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>

export default {
  name: 'CustomTable',
  props: {
    tableData: Array,
  },
  data: {
    loading: false,
    tableHeight: "100px"
  },
  computed: {
  
  },
  created() {
    this.getList()
  },
  mounted() {
    this.getAutoHeight()
    const self = this;
    window.onresize = function() {
      self.getAutoHeight();
    };
  },
  methods: {
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
</style>