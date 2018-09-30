<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" class="filter-item filter-item-wap" placeholder="请输入手机号" v-model="listQuery.mobile">
      </el-input>
      <!-- <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance" :placeholder="$t('table.importance')">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select> -->
      <!-- <el-select clearable class="filter-item" style="width: 10%" v-model="listQuery.type" :placeholder="$t('table.type')">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select> -->
      <el-select @change='handleFilter' class="filter-item filter-item-wap" v-model="listQuery.sort">
        <el-option class="el-input__inner_wap" v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 5px;" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">导出</el-button>
      <!-- <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">{{$t('table.reviewer')}}</el-checkbox> -->
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="手机号">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.mobile}}</span>
          <!-- <el-tag>{{scope.row.type | typeFilter}}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{scope.row.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="提现金额">
        <template slot-scope="scope">
          <span>{{scope.row.withdrawAmount / 100 | formatMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="提现时间">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="110px" align="center" label="操作">
        <template slot-scope="scope">
          <span>{{scope.row.withdrawStatus}}</span>
        </template>
      </el-table-column> -->
      <el-table-column class-name="status-col" label="操作" width="130px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.withdrawStatus | statusFilter">{{statusOptions[scope.row.withdrawStatus-1].label}}</el-tag>
          <!-- <el-tag :type="scope.row.status">{{scope.row.status}}</el-tag> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
// import { updateArticle } from '@/api/article'
// import { getActivityList, addActivity, updateActivity, deleteActivity } from '@/api/activity'
import { getWechatWithdrawList } from '@/api/wechatWithdraw'
// import { getWechatWithdrawList, confirmWithdraw } from '@/api/wechatWithdraw'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime, formatMoney } from '@/utils'
// import { parseTime, deepClone } from '@/utils'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      // importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: '升序', key: 'asc' }, { label: '降序', key: 'desc' }],
      statusOptions: [{
        value: '1',
        label: '待审核'
      }, {
        value: '2',
        label: '通过'
      }, {
        value: '3',
        label: '驳回'
      }],
      listQuery: { withdrawStatusList: [2, 3] },
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = ['info', 'success', 'danger']
      return statusMap[status - 1]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    formatMoney(money) {
      return formatMoney(money, 2, '', '', '.')
    }
  },
  created() {
    this.getList()
  },
  computed: {
  },
  methods: {
    getList() {
      this.listLoading = true
      // console.log('请求的参数为', this.listQuery)
      getWechatWithdrawList(JSON.stringify(this.listQuery)).then(response => {
        this.list = response.list
        // this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    // handleFetchPv(pv) {
    //   fetchPv(pv).then(response => {
    //     this.pvData = response.data.pvData
    //     this.dialogPvVisible = true
    //   })
    // },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const tHeader = ['title', 'startTime', 'endTime', 'status']
        const filterVal = ['title', 'startTime', 'endTime', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.$route.meta.title
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'startTime' || j === 'endTime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style>
.filter-item {
  width: 130px;
}
@media (min-width: 320px) and (max-width: 640px) {
  .filter-item {
    font-size: 12px;
    width: 60px;
    padding:  10px 6px;
    margin: 0px;
  }
  .filter-item-wap {
    width: 60px ;
    padding: 0px;
    margin: 0;
  }
  .el-button {
    margin: 0px;
  }
  .el-button--primary {
    margin: 0px;
  }
  .el-input__inner {
    width: 60px;
    /* height: 30px; */
    font-size: 12px;
    text-align: center;
    padding: 0px 4px;
    margin: 0;
  } 
  .el-input__inner_wap {
    /* width: 60px; */
    padding: 0 12px;
  }
}
</style>

