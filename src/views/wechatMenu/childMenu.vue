<template>
  <div class="wrap">
  <el-button type="primary" @click="addList">添加</el-button>
  <el-button type="danger" @click="delList(ids)">删除</el-button>

    <el-table
        :data="tableData4"
        style="width: 100%"
        max-height="500"
        @selection-change="handleSelectionChange"
        >
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
      
        
        <el-table-column
          prop="name"
          label="菜单标题"
          width="240">
        </el-table-column>
      
        <el-table-column
          prop="url"
          label="网页链接"
          width="300">
        </el-table-column>
      
    
          <el-table-column
          prop="sort"
          label="排序"
          width="240">
        </el-table-column>
    
        <el-table-column
          fixed="right"
          label="操作"
          min-width="240">
          <template slot-scope="scope">
            <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
             <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNo"
        :page-size="10"
        background
        layout="prev, pager, next"
        :total="total">
      </el-pagination>

       <el-dialog title="" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules" ref="form">
        
          <el-form-item label="菜单标题" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
        
          <el-form-item label="网页链接" :label-width="formLabelWidth" prop="url">
            <el-input v-model="form.url" auto-complete="off"></el-input>
          </el-form-item>
        
          <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
            <el-input v-model="form.sort" auto-complete="off" type="number"></el-input>
          </el-form-item>
      
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMenu" v-if="condition==='add'">确 定</el-button>
          <el-button type="primary" @click="updateList('form')" v-else>确 定</el-button>

        </div>
      </el-dialog>

  </div>
</template>

<script>
import { getWechatMenuList, addWechatMenuList, updateWechatMenuList, delWechatMenuList } from '@/api/wechatMenu'
export default {
  created() {
    this.getData()
  },
  methods: {
    updateList(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          updateWechatMenuList(this.form).then(response => {
            console.log('打印数据' + response)
            this.getData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addList() {
      this.dialogFormVisible = true
      this.$refs['form'].resetFields()
      this.clearFormData()
    },
    delList(ids) {
      if (ids.length === 0) return
      this.$confirm('此操作将删除子菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogFormVisible = false
        delWechatMenuList(ids).then(response => {
          console.log('打印数据' + response)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    addMenu() {
      // 默认添加的type是view
      this.form.type = 'view'
      this.form.parentId = this.$route.params.id
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addWechatMenuList(this.form).then(response => {
            console.log('打印数据' + response)
            this.dialogFormVisible = false

            this.getData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getData() {
      getWechatMenuList({ pageNo: this.pageNo, pageSize: 10, parentId: this.$route.params.id }).then(response => {
        console.log('list数据为', response)
        // console.log('list数据是什么', this.list)
        // this.total = response.data.total
        console.log('route', this.$route)

        this.tableData4 = response.list
        this.total = response.total
        // Just to simulate the time of the requests
        setTimeout(() => {
        }, 0.5 * 1000)
      })
    },
    handleEdit(index, row) {
      console.log(index, row)
      this.dialogFormVisible = true
      this.condition = 'update'
      this.form.id = row.id
      this.form.name = row.name
      this.form.url = row.url
      this.form.sort = row.sort
      this.form.key = row.key
      this.form.mediaId = row.mediaId
      this.form.parentId = row.parentId
      this.form.type = row.type
    },
    handleDelete(index, row) {
      console.log(index, row)
      var ids = [row.id]
      this.delList(ids)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.getData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.getData()
    },
    handleSelectionChange(val) {
      console.log(val)
      this.ids = []
      for (const key in val) {
        this.ids.push(val[key].id)
      }
    },
    clearFormData() {
      for (const key in this.form) {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = ''
        }
      }
    }
  },
  data() {
    return {
      tableData4: [],
      total: 0,
      pageNo: 1,
      dialogFormVisible: false,
      form: {
        name: '',
        type: this.$route.params.type,
        key: '',
        url: '',
        mediaId: '',
        parentId: this.$route.params.id,
        sort: 0,
        id: 0
      },
      formLabelWidth: '120px',
      condition: 'add',
      ids: [],
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'change' }
        ],
        url: [{ required: true, message: '请输入网页链接', trigger: 'change' }],
        sort: [{ required: true, message: '请输入排序id', trigger: 'change' }]
      }
    }
  }
}
</script>

<style scoped>
.wrap{
padding: 20px;
}
</style>




