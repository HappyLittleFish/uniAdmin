<template>
<div class="app-container">
     <div class="filter-container">
       <el-button class="filter-item" style="float:right;margin-right: 5px;" @click="dialogFormVisible = true" type="primary" icon="el-icon-edit">添加</el-button>
     </div>
  <el-table
    :data="tableData"
    style="width: 100%" border fit highlight-current-row>
    <el-table-column
      label="序号"
      width="120">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.date }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="姓名"
      width="180">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>姓名: {{ scope.row.name }}</p>
          <p>住址: {{ scope.row.address }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
     <el-table-column
      label="职位"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.position }}</span>
      </template>
    </el-table-column>
     <el-table-column
      label="账户名称"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.userName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          @click="handlePut(scope.$index, scope.row)">人员设置</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="角色添加" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="角色名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="活动区域" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单选择" :label-width="formLabelWidth">
        <el-tree
          :data="data2"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>
        <div class="buttons">
          <el-button @click="getCheckedNodes">通过 node 获取</el-button>
          <el-button @click="getCheckedKeys">通过 key 获取</el-button>
          <el-button @click="setCheckedNodes">通过 node 设置</el-button>
          <el-button @click="setCheckedKeys">通过 key 设置</el-button>
          <el-button @click="resetChecked">清空</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
  export default {
    name: 'vedioSeries',
    data() {
      return {
        tableData: [{
          date: '1',
          name: 'cly',
          address: '上海市普陀区金沙江路 1518 弄',
          userName: '122233232',
          position: '主管'
        }, {
          date: '2',
          name: 'zhw',
          address: '上海市普陀区金沙江路 1517 弄',
          userName: '112322',
          position: 'it'
        }, {
          date: '3',
          name: 'lf',
          address: '上海市普陀区金沙江路 1519 弄',
          userName: '122332',
          position: '198'
        }, {
          date: '4',
          name: 'yj',
          address: '上海市普陀区金沙江路 1516 弄',
          userName: '14412',
          position: '198'
        }],
        data2: [{
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
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dialogFormVisible: false,
        form: {
          name: '',
          region: ''
        },
        formLabelWidth: '120px'
      }
    },
    created() {
  
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row)
      },
      handleAdd(index, row) {
        console.log(index, row)
      },
      handlePut(index, row) {
        console.log(index, row)
      },
      handleCreate(index) {
        console.log(index)
      },
      // 树形选择器
      getCheckedNodes() {
        console.log(this.$refs.tree.getCheckedNodes())
      },
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys())
      },
      setCheckedNodes() {
        this.$refs.tree.setCheckedNodes([{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 9,
          label: '三级 1-1-1'
        }])
      },
      setCheckedKeys() {
        this.$refs.tree.setCheckedKeys([3])
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([])
      }
    }
  }
</script>