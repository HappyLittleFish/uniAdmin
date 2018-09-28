<template>
  <div class="wrap">
    <el-table
        :data="tableData4"
        style="width: 100%"
        max-height="500"
        @selection-change="handleSelectionChange"
        >
        <!-- <el-table-column
        type="selection"
        width="55">
        </el-table-column> -->
  
        <el-table-column
          prop="name"
          label="菜单标题"
          width="240">
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
            <!-- <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
             <el-button
            size="mini"
            type="primary"
            @click="handleDelete(scope.$index, scope.row)">查看子菜单</el-button>
          </template>
        </el-table-column>
      </el-table>

        <el-button id="publishBtn" type="success" @click="publish">发布</el-button>
     
       <el-dialog title="" :visible.sync="dialogFormVisible">
        <el-form :model="form">
       
          <el-form-item label="菜单标题" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
     
          <el-form-item label="排序" :label-width="formLabelWidth">
            <el-input v-model="form.sort" auto-complete="off" type="number"></el-input>
          </el-form-item>
      
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMenu" v-if="condition==='add'">确 定</el-button>
          <el-button type="primary" @click="updateList" v-else>确 定</el-button>

        </div>
      </el-dialog>

  </div>
</template>

<script>
import { getWechatMenuList, addWechatMenuList, updateWechatMenuList, delWechatMenuList, initMenu } from '@/api/wechatMenu'
export default {
  created() {
    this.getData()
  },
  methods: {
    publish() {
      this.$confirm('是否发布', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        initMenu().then(response => {
          this.$message({
            type: 'info',
            message: '发布成功'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        })
      })
    },

    updateList() {
      this.dialogFormVisible = false
      updateWechatMenuList(this.form).then(response => {
        console.log('打印数据' + response)
        this.getData()
      })
    },

    delList(ids) {
      if (ids.length === 0) return
      this.dialogFormVisible = false
      delWechatMenuList(ids).then(response => {
        console.log('打印数据' + response)
        this.getData()
      })
    },

    addMenu() {
      this.dialogFormVisible = false

      addWechatMenuList(this.form).then(response => {
        console.log('打印数据' + response)
        this.getData()
      })
    },
    getData() {
      getWechatMenuList({ pageNo: this.pageNo, pageSize: 10, parentId: 0 }).then(response => {
        console.log('list数据为', response)
        // console.log('list数据是什么', this.list)
        // this.total = response.data.total
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
    },
    handleDelete(index, row) {
      console.log(index, row)
      // this.$router.push({ path: `/wechatMenu/childMenu/${row.id}` })
      this.$router.push({ name: 'childMenu', params: { id: row.id, type: row.type }})

      // var ids = [row.id]
      // this.delList(ids)
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
        type: '',
        key: '',
        url: '',
        mediaId: '',
        parentId: 0,
        sort: 0,
        id: 0
      },
      formLabelWidth: '120px',
      condition: 'add',
      ids: []
    }
  }
}
</script>

<style scoped>
.wrap{
padding: 20px;
}
#publishBtn {
margin:30px;
float: right;
}
</style>