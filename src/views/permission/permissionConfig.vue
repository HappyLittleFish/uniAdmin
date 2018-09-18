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
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        ref="tree2">
        <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
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
              @click="() => remove(node, data)">
              删除
            </el-button>
          </span>
        </span> -->
      </el-tree>
    </div>
  </div>
  <div class="tree-content" style="height:600px;width:800px;">
    <el-form ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
        <el-form-item required="true" label="url" prop="url">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item  required label="权限名称" prop="startTime">
          <el-date-picker v-model="temp.startTime" type="datetime" value-format="timestamp" placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item required label="权限编码" prop="endTime">
          <el-date-picker v-model="temp.endTime" type="datetime" value-format="timestamp" placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
  </div>
  </div>
</template>

<script>
// import { getPermissionList, permissionAdd, permissionUpdate, permissionDel } from '@/api/permission'
import { getPermissionList } from '@/api/permission'
var id = 1000
export default {
  data() {
    const data = [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    }, {
      id: 2,
      label: '一级 2',
      children: [{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        label: '二级 2-2'
      }]
    }, {
      id: 3,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }]
    return {
      // data4: JSON.parse(JSON.stringify(data)),
      data5: JSON.parse(JSON.stringify(data)),
      filterText: '',
      temp: {},
      listQuery: {},
      list: []
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
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].label = this.list[i].name
          this.list[i].children = this.list[i].child
        }
        // this.total = response.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    append(data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
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
    width: 500px;
  }
  .tree-content {
    flex-grow: 1
  }
}
</style>