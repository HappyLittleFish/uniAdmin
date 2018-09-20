<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" class="filter-item filter-item-wap" placeholder="角色名称" v-model="listQuery.activityName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 5px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;">
      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="用户名称">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" label="拥有角色">
        <template slot-scope="scope">
          <span>{{scope.row.roles}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="$t('table.status')" width="130px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.available | statusFilter">{{statusOptions[scope.row.available-1].label}}</el-tag>
          <!-- <el-tag :type="scope.row.status">{{scope.row.status}}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="400" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button  size="small" type="primary" @click="handleUpdate(scope.row)">{{'编辑'}}
          </el-button>
          <el-button  size="small" type="primary" @click="handleforbid(scope.row)">{{'禁用'}}
          </el-button>
          <el-button  size="small" type="warning" @click="handleDelete(scope.row)">{{'删除'}}
          </el-button>
          <el-button size="small" type="danger" @click="handleResetPassword(scope.row)">{{'重置密码'}}
          </el-button>
          <el-button size="small" type="danger" @click="handleConfigRole(scope.row)">{{'配置角色'}}
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
        <el-form-item required="true" label="用户名" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item  required label="密码" prop="password">
          <el-input v-model="temp.password"></el-input>
        </el-form-item>
        <el-form-item  required label="赋予角色" prop="password">
          <el-checkbox-group v-model="temp.roles">
            <el-checkbox label="管理员"></el-checkbox>
            <el-checkbox label="超级管理员"></el-checkbox>
            <el-checkbox label="普通管理员"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确认</el-button>
        <el-button v-else type="primary" @click="updateData">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getUserList, getPermissionList, addUser, delUser, updateRole } from '@/api/permission'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

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
      permissionlist: null,
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
        label: '已启用'
      }, {
        value: '2',
        label: '已禁用'
      }],
      showReviewer: false,
      temp: {
        // id: undefined,
        // importance: 1,
        // remark: '',
        // timestamp: new Date(),
        name: '',
        // roleState: '',
        password: '',
        roles: []
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
      downloadLoading: false,
      props: {
        label: 'name'
        // children: 'children'
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = ['success', 'info']
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
      getUserList(this.listQuery).then(response => {
        console.log('list数据为', response)
        this.list = response.list
        this.total = response.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getPermissionList() {
      getPermissionList(this.listQuery).then(response => {
        console.log('list数据为', response)
        this.permissionlist = response.data
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
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        name: '',
        password: '',
        roles: []
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
          addUser(this.temp).then(response => {
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
        }
      })
    },
    handleUpdate(row) {
      // const rowData = row
      console.log('数据为', row)
      this.temp = row
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$refs.tree.setCheckedKeys(row.permissionIds)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)

          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateRole(this.temp).then(response => {
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
      this.$confirm('此操作将永久删除权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser({ ids: [row.id] }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            onClose: this.getList()
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
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
    margin: 0px 10px;
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

