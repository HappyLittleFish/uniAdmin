<template>
<div class="tree-container">
  <div class="custom-tree-container">
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
    <!-- <div class="block">
      <p>使用 render-content</p>
      <el-tree
        :data="data4"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :render-content="renderContent"
        ref="tree2">
      </el-tree>
    </div> -->
    <div class="block">
      <el-tree
        :data="list"
        :props="props"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :check-on-click-node="true"
        :highlight-current="true"
        ref="tree2">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="() => append(data)">
              新增
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => edit(data)">
              编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(data)">
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <!-- name	String	权限名称（资源名称）
    resourceType	String	资源类型[menu,button]
    url	String	资源路径
    permissions	String	权限字符串,menu例子：role:*，button例子：role:create,role:update,role:delete,role:view
    parentId	integer	父编号
    parentIds	integer	父编号列表
    available	integer	默认值为false -->
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
        <el-form-item required label="权限名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item required label="资源类型">
          <el-select class="filter-item" v-model="temp.resourceType" placeholder="请选择">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item required label="资源路径" prop="url">
          <el-input v-model="temp.url"></el-input>
        </el-form-item>
        <el-form-item required label="权限描述" prop="permission">
          <el-input v-model="temp.permission"></el-input>
        </el-form-item>
        <el-form-item required label="父编号" prop="parentId">
          <el-input v-model="temp.parentId"></el-input>
        </el-form-item>
        <el-form-item required label="是否启用">
          <el-select class="filter-item" v-model="temp.available" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData">确认</el-button>
        <el-button v-else type="primary" @click="updateData">确认</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script>
// import { getPermissionList, permissionAdd, permissionUpdate, permissionDel } from '@/api/permission'
import { getPermissionList, permissionAdd, permissionUpdate, permissionDel } from '@/api/permission'
// var id = 1000
export default {
  data() {
    return {
      filterText: '',
      temp: {
        name: '',
        resourceType: '',
        url: '',
        permission: '',
        parentId: '',
        // parentIds: '',
        available: ''
      },
      listQuery: {},
      list: [],
      props: {
        label: 'name'
        // children: 'children'
      },
      dialogFormVisible: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogStatus: '',
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      typeOptions: [{
        value: 'menu',
        label: '菜单'
      }, {
        value: 'button',
        label: '按钮'
      }],
      statusOptions: [{
        value: true,
        label: '启用'
      }, {
        value: false,
        label: '禁用'
      }]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      console.log('请求的参数为', this.listQuery)
      getPermissionList(this.listQuery).then(response => {
        console.log('list数据为', response)
        this.list = response.data
        // for (let i = 0; i < this.list.length; i++) {
        // this.list[i].label = this.list[i].name
        // this.list[i].children = this.list[i].child
        // this.checkHasChildrenOrNot(this.list[i])
        // if (this.list[i].hasOwnProperty('children') && this.list[i].children.length) {
        //   for (let n = 0; n < this.list[i].children.length; n++) {
        //     this.list[i].children[n].label = this.list[i].children[n].name
        //   }
        // }
        // }
        // this.total = response.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    checkHasChildrenOrNot(el) {
      if (el.hasOwnProperty('children') && el.children.length > 0) {
        for (let i = 0; i < el.children.length; i++) {
          el.children[i].label = el.children[i].name
          this.checkHasChildrenOrNot(el.children[i])
        }
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('新添加的数据为', this.temp)
          permissionAdd(this.temp).then(response => {
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
        } else {
          console.log('输入不合法')
        }
      })
    },
    updateData() {
      console.log('更新数据')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('新添加的数据为', this.temp)
          permissionUpdate(this.temp).then(response => {
            if (response === null) return
            console.log('更新数据成功', response)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000,
              onClose: this.getList()
            })
          })
        } else {
          console.log('输入不合法')
        }
      })
    },
    // 新增权限
    append(data) {
      this.dialogStatus = 'create'
      console.log('当前节点数据为', data)
      this.temp.parentId = data.id
      this.temp.url = data.url
      this.dialogFormVisible = true
      // const newChild = { id: id++, label: 'testtest', children: [] }
      // if (!data.children) {
      //   this.$set(data, 'children', [])
      // }
      // data.children.push(newChild)
    },
    // 编辑权限
    edit(data) {
      console.log('编辑的数据为', data)
      this.dialogStatus = 'edit'
      this.temp = data
      this.dialogFormVisible = true
    },
    // 删除权限
    remove(data) {
      // const parent = node.parent
      // const children = parent.data.children || parent.data
      // const index = children.findIndex(d => d.id === data.id)
      // children.splice(index, 1)
      this.$confirm('此操作将永久删除权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        permissionDel([data.id])
        this.$message({
          type: 'success',
          message: '删除成功!',
          onClose: this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    resetTemp() {
      this.temp = {
        name: '',
        resourceType: '',
        url: '',
        permission: '',
        parentId: '',
        // parentIds: '',
        available: ''
      }
    },

    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tree-container {
  display: flex;
  flex-direction: row;
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    width: 300px;
  }
  .tree-content {
    flex-grow: 1
  }
  .el-form-item {
    margin-bottom: 16px;
  }
}
</style>