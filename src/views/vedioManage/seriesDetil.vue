<template>
<div class="app-container">
     <div class="filter-container">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="系列名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="背景图片" required>
            <el-form-item prop="date1">
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList2"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
        </el-form-item>
       <el-form-item label="课程介绍" prop="courseDesc">
          <el-input type="textarea" v-model="ruleForm.courseDesc"></el-input>
        </el-form-item>
        <el-form-item label="讲师介绍" prop="lecturerDesc">
          <el-input type="textarea" v-model="ruleForm.lecturerDesc"></el-input>
        </el-form-item>
        <el-form-item label="课程特色" prop="feature">
          <el-input type="textarea" v-model="ruleForm.feature"></el-input>
        </el-form-item>
        <el-form-item label="购买须知" prop="notes">
          <el-input type="textarea" v-model="ruleForm.notes"></el-input>
        </el-form-item>
         <el-form-item label="价格" size="mini">
            <el-form-item label="ios" prop="iosPrice" size="mini">
            <el-input type="number" v-model="ruleForm.iosPrice" style="width:15%"></el-input>
          </el-form-item>
          <el-form-item label="安卓" prop="androidPrice" size="mini">
            <el-input type="number" v-model="ruleForm.androidPrice" style="width:15%"></el-input>
          </el-form-item>
        </el-form-item>
         <el-form-item label="研值优惠" >
            <el-col :span="11">
            <el-form-item label="研值" prop="researchValue" size="mini">
              <el-input type="number" v-model="ruleForm.researchValue" style="width:15%"></el-input> - 
            </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="价格" prop="price" size="mini">
              <el-input type="number" v-model="ruleForm.price" style="width:15%"></el-input>
              </el-form-item>
            </el-col>     
          <el-form-item label="研值兑换" prop="convert">
            <el-input type="number" v-model="ruleForm.convert" style="width:15%" size="mini"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
     </div>
</div>
</template>
<script>
  export default {
    data() {
      return {
        fileList2: [],
        ruleForm: {
          name: '',
          region: '',
          resource: '',
          desc: '',
          courseDesc: '',
          lecturerDesc: '',
          feature: '',
          notes: '',
          iosPrice: '',
          androidPrice: '',
          researchValue: '',
          convert: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          courseDesc: [
            { required: true, message: '请填写内容', trigger: 'blur' }
          ],
          lecturerDesc: [
            { required: true, message: '请填写内容', trigger: 'blur' }
          ],
          feature: [
            { required: true, message: '请填写内容', trigger: 'blur' }
          ],
          notes: [
            { required: true, message: '请填写内容', trigger: 'blur' }
          ],
          iosPrice: [
            { required: true, message: '请填写内容', trigger: 'blur' }
          ],
          androidPrice: [
            { required: true, message: '请填写内容', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      }
    }
  }
</script>