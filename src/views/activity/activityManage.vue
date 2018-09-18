<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" class="filter-item filter-item-wap" placeholder="活动名称" v-model="listQuery.activityName">
      </el-input>
      <!-- <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance" :placeholder="$t('table.importance')">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select> -->
      <!-- <el-select clearable class="filter-item" style="width: 10%" v-model="listQuery.type" :placeholder="$t('table.type')">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select> -->
      <!-- <el-select @change='handleFilter' class="filter-item filter-item-wap" v-model="listQuery.sort">
        <el-option class="el-input__inner_wap" v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select> -->
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 5px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
      <!-- <el-button class="filter-item" style="margin-left: 5px;" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">导出</el-button> -->
      <!-- <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">{{$t('table.reviewer')}}</el-checkbox> -->
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;">
      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="活动名称">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <!-- <el-tag>{{scope.row.type | typeFilter}}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="结束时间">
        <template slot-scope="scope">
          <span>{{scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="110px" align="center" :label="$t('table.author')">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column width="110px" v-if='showReviewer' align="center" :label="$t('table.reviewer')">
        <template slot-scope="scope">
          <span style='color:red;'>{{scope.row.reviewer}}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column width="80px" :label="$t('table.importance')">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" icon-class="star" class="meta-item__icon" :key="n"></svg-icon>
        </template>
      </el-table-column> -->
      <!-- <el-table-column align="center" :label="$t('table.readings')" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.pageviews" class="link-type" @click='handleFetchPv(scope.row.pageviews)'>{{scope.row.pageviews}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column> -->
      <el-table-column class-name="status-col" :label="$t('table.status')" width="130px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{statusOptions[scope.row.status-1].label}}</el-tag>
          <!-- <el-tag :type="scope.row.status">{{scope.row.status}}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button> -->
          <!-- <el-button v-if="scope.row.status!='edit'" size="mini" type="primary" @click="handleModifyStatus(scope.row,'published')">{{'编辑'}}
          </el-button> -->
          <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">{{'编辑'}}
          </el-button>
          <el-button size="mini" type="warning" @click="handleModifyStatus(scope.row, 4)">{{'禁用'}}
          </el-button>
          <el-button size="mini" type="info" @click="handleModifyStatus(scope.row)">{{'奖品'}}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{'删除'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
        <!-- <el-form-item :label="$t('table.type')" prop="type">
          <el-select class="filter-item" v-model="temp.type" placeholder="Please select">
            <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item required="true" :label="$t('table.title')" prop="title">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item  required label="开始时间" prop="startTime">
          <el-date-picker v-model="temp.startTime" type="datetime" value-format="timestamp" placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item required label="结束时间" prop="endTime">
          <el-date-picker v-model="temp.endTime" type="datetime" value-format="timestamp" placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item required :label="$t('table.status')" v-if="dialogStatus!=='create'">
          <el-select class="filter-item" v-model="temp.status" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item :label="$t('table.importance')">
          <el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max='3'></el-rate>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('table.remark')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.remark">
          </el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确认</el-button>
        <el-button v-else type="primary" @click="updateData">确认</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog> -->

  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
// import { updateArticle } from '@/api/article'
import { getActivityList, addActivity, updateActivity, deleteActivity } from '@/api/activity'
// import { getActivityList, addActivity, updateActivity, removeActivity } from '@/api/activity'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime, deepClone } from '@/utils'

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
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        activityName: undefined,
        activityStatus: undefined,
        // status: undefined,
        orderby: 'id',
        sort: undefined
        // title: undefined
        // importance: undefined,
      },
      // importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: '升序', key: 'asc' }, { label: '降序', key: 'desc' }],
      statusOptions: [{
        value: '1',
        label: '未开始'
      }, {
        value: '2',
        label: '进行中'
      }, {
        value: '3',
        label: '已结束'
      }, {
        value: '4',
        label: '已禁用'
      }],
      showReviewer: false,
      temp: {
        // id: undefined,
        // importance: 1,
        // remark: '',
        // timestamp: new Date(),
        startTime: '',
        endTime: '',
        title: '',
        // type: '',
        status: ''
      },
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
      // value: this.statusOptions[this.temp.status].label
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = ['info', 'success', 'danger', 'warning']
      return statusMap[status - 1]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  created() {
    this.getList()
  },
  computed: {
    // currentStatus() {
    //   return this.statusOptions[this.temp.status].label
    // }
  },
  methods: {
    getList() {
      this.listLoading = true
      console.log('请求的参数为', this.listQuery)
      getActivityList(this.listQuery).then(response => {
        console.log('list数据为', response)
        this.list = response.list
        this.total = response.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   console.log('数据列表为', this.list)

      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1.5 * 1000)
      // })
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
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        startTime: '',
        endTime: '',
        title: '',
        status: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          // console.log('新添加的数据为1', this.$refs['dataForm'])
          console.log('新添加的数据为2', this.temp)
          addActivity(this.temp).then(response => {
            if (response === null) return
            console.log('新增数据成功', response)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000,
              onClose: this.getList()
            })
          })
          // createArticle(this.temp).then(() => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '创建成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    handleUpdate(row) {
      // const rowData = row
      console.log('数据为', row)
      var rowData = deepClone(row)
      rowData.status = this.statusOptions[row.status - 1].label
      // row.status = this.statusOptions[row.status]['label']
      this.temp = Object.assign({}, rowData) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)
          const tempData = deepClone(this.temp)
          for (var i = 0; i < this.statusOptions.length; i++) {
            if (tempData.status === this.statusOptions[i].label) {
              tempData.status = this.statusOptions[i].value
            }
          }
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateActivity(tempData).then(response => {
            if (response === null) return
            console.log('修改成功', response)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000,
              onClose: this.getList()
            })
          })
        }
      })
    },
    handleDelete(row) {
      console.log('删除的数据为', row.id)
      deleteActivity({ id: row.id }).then(response => {
        if (response === null) return
        console.log('删除后', response)
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000,
          onClose: this.getList()
        })
      })
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

