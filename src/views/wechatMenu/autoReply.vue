<template>
  <div class="wrap">
    <!-- <h3>{{titleName}}</h3> -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- <el-tab-pane label="关键字回复" name="first"> -->
        <div class="content">
           <h4>自动回复</h4>
  
          <el-row :gutter="10">
            <el-col :span="118"> 
               <el-input v-model="input1" placeholder="用户发送内容" style="width:300px;" >
               </el-input>
                <el-input v-model="input2" placeholder="规则名称" style="width:300px;" >
               </el-input>
               <el-button type="success" @click="search">搜索</el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="success" @click="addReply">添加回复</el-button>
            </el-col>
          </el-row>
           <div class="line"></div>
        </div>

        <div class="footer" v-if="show">
          <el-table
            :data="tableData"
            style="width: 100%"
            max-height="800">
            <el-table-column
              fixed
              prop="requestContent"
              label="用户发送内容"
              width="200">
            </el-table-column>
             <el-table-column
              prop="title"
              label="公众号回复内容"
              width="450">
            </el-table-column>

            <el-table-column
              prop="replyTypeStr"
              label="回复类型"
              min-width="80">
            </el-table-column>

            <el-table-column
              prop="url"
              label="超链接"
              min-width="200">
            </el-table-column>
           
            <el-table-column
              fixed="right"
              label="操作"
              width="300">
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
        </div>
      
      <!-- </el-tab-pane> -->

      <!-- <el-tab-pane label="收到消息回复" name="second">

      </el-tab-pane> -->

      <!-- <el-tab-pane label="被关注回复" name="third">

      </el-tab-pane> -->
    </el-tabs>
<!-- // 弹窗 -->
            <el-dialog title="" :visible.sync="dialogFormVisible" >
                <el-form :model="form" :rules="rules" ref="form">

                 <el-form-item label="用户输入内容" :label-width="formLabelWidth" prop="requestContent">
                    <el-input v-model="form.requestContent" auto-complete="off" ></el-input>
                  </el-form-item>

                  <el-form-item label="公众号回复内容" :label-width="formLabelWidth" prop="title">
                    <el-input v-model="form.title" auto-complete="off"></el-input>
                  </el-form-item>
              
                   <el-form-item label="回复类型" :label-width="formLabelWidth" prop="value">
                      <template slot-scope="scope">
                      <el-select v-model="form.value" clearable placeholder="请选择" >
                        <el-option
                          v-for="item in server"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                        </el-select>
                      </template>
                  </el-form-item>

                <el-form-item label="网页链接" :label-width="formLabelWidth" prop="url">
                    <el-input v-model="form.url" auto-complete="off"></el-input>
                  </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="addList" v-if="condition==='add'">确 定</el-button>
                  <el-button type="primary" @click="updateList('form')" v-else>确 定</el-button>

                </div>
              </el-dialog>

  </div>
</template>

<script>
import { wechatMsgReplyList, wechatMsgReplyUpdate, wechatMsgReplyDel, wechatMsgReplyAdd } from '@/api/autoReply'

export default {
  created() {
    this.getList()
  },
  data() {
    return {
      activeName: 'first',
      titleName: '关键字回复',
      value1: true,
      value2: true,
      input1: '',
      input2: '',
      show: true,
      tableData: [
        {
          id: '1',
          messageType: '',
          url: '',
          title: '',
          requestContent: '',
          replyType: 1,
          createTime: 1534992116000,
          delFlag: false,
          replyTypeStr: ''
        }
      ],
      server: [
        { value: 1, label: '超链接文本' },
        { value: 2, label: '文本内容' }
      ],
      value: '',
      total: 0,
      pageNo: 1,
      dialogFormVisible: false,
      form: {
        title: '',
        url: '',
        requestContent: '',
        replyType: '',
        messageType: 'text',
        id: '',
        value: ''
      },
      ids: [],
      formLabelWidth: '120px',
      condition: 'add',
      rules: {
        title: [{ required: true, message: '回复内容不能为空', trigger: 'change' }],
        url: [{ required: false, message: '请输入网页链接', trigger: 'change' }],
        requestContent: [{ required: true, message: '用户输入内容不能为空', trigger: 'change' }],
        value: [{ required: true, message: '请选择回复类型', trigger: 'change' }]
      }
    }
  },
  methods: {
    selectOption(row) {
      console.log('row', row)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.getList()
    },
    handleSelectionChange(val) {
      console.log(val)
      this.ids = []
      for (const key in val) {
        this.ids.push(val[key].id)
      }
    },
    addList() {
      console.log('添加回复')
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.value === 1) {
            this.form.replyType = 1
          } else {
            this.form.replyType = 2
          }
          wechatMsgReplyAdd(this.form).then(response => {
            this.dialogFormVisible = false
            this.tableData = response.list
            this.total = response.total
            this.getList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    updateList(form) {
      console.log('修改列表')

      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.value === 1) {
            this.form.replyType = 1
          } else {
            this.form.replyType = 2
          }
          wechatMsgReplyUpdate(this.form).then(response => {
            this.dialogFormVisible = false
            this.tableData = response.list
            this.total = response.total
            this.getList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    handleEdit(index, row) {
      console.log(index, row)
      this.condition = 'update'
      this.dialogFormVisible = true
      this.form.id = row.id
      this.form.title = row.title
      this.form.url = row.url
      this.form.requestContent = row.requestContent
      this.form.replyType = row.replyType
      this.form.messageType = row.messageType
      if (this.form.replyType === 1) {
        this.form.value = '超文本链接'
      } else {
        this.form.value = '文本内容'
      }
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.ids = [row.id]
      if (this.ids.length === 0) return
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        wechatMsgReplyDel(this.ids).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    search() {
      console.log('搜索')
      wechatMsgReplyList({ pageNo: this.pageNo, pageSize: 10, requestContent: this.input1, title: this.input2 }).then(response => {
        this.tableData = response.list
        this.total = response.total
        this.tableData.forEach(element => {
          if (element.replyType === 1) {
            element.replyTypeStr = '超链接文本'
          } else {
            element.replyTypeStr = '文本内容'
          }
        })
      })
    },
    getList() {
      wechatMsgReplyList({ pageNo: this.pageNo, pageSize: 10 }).then(response => {
        this.tableData = response.list
        this.total = response.total
        this.tableData.forEach(element => {
          if (element.replyType === 1) {
            element.replyTypeStr = '超链接文本'
          } else {
            element.replyTypeStr = '文本内容'
          }
        })
      })
    },
    handleClick(tab, event) {
      console.log('tab-content', tab)
      console.log('tab-event', event)
      this.titleName = tab.$options.propsData.label
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    addReply() {
      this.condition = 'add'
      this.dialogFormVisible = true
      this.$refs['form'].resetFields()
      this.clearFormData()
      this.form.messageType = 'view'
    },

    clearFormData() {
      for (const key in this.form) {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = ''
        }
      }
    }

  }
}
</script>

<style scoped>
.wrap {
  padding: 0px 20px;
}
p {
  color: #7b7b7b;
  font-size: 14px;
}
.line{
  background-color: #dedede;
  height: 1px;
  margin: 10px 0px;
}
a {
color: #3f4d77;
}


</style>