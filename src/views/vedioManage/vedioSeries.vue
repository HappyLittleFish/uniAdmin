<template>
<div class="app-container">
     <div class="filter-container">
       <el-button class="filter-item" style="float:right;margin-right: 5px;" @click="handleCreate('add')" type="primary" icon="el-icon-edit">添加</el-button>
     </div>
  <el-table
    :data="tableData"
    style="width: 100%" border fit highlight-current-row>
    <el-table-column
      label="序号"
      width="180">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.date }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="系列"
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
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleAdd(scope.$index, scope.row)">添加视频</el-button>
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          @click="handlePut(scope.$index, scope.row)">上架</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
  export default {
    name: 'vedioSeries',
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row)
      },
      handleAdd(index, row) {
        console.log(index, row)
        this.$router.push({ path: 'vedioList/' + index })
      },
      handlePut(index, row) {
        console.log(index, row)
      },
      handleCreate(index) {
        console.log(index)
        this.$router.push({ path: 'seriesDetil/' + index })
      }
    }
  }
</script>