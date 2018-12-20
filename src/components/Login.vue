<template>
<div class="login">
 <el-form ref="form" :status-icon='true' :rules="rules" :model="form" label-width="80px">
  <img src="@/assets/snoopy.jpg" alt="">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="form.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="form.password"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type = "primary" @click = "login">登录</el-button>
    <el-button @click="reset">重置</el-button>
  </el-form-item>
</el-form>
</div>
</template>
<script>
// 导入axios
import axios from 'axios'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      // 验证格式
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    login() {
      // 让整个表单校验
      this.$refs.form.validate(valid => {
        if (valid) {
          axios({
            url: 'http://localhost:8888/api/private/v1/login',
            method: 'post',
            data: this.form
          }).then(res => {
            console.log(res.data)
            if (res.data.meta.status === 200) {
              localStorage.setItem('token', res.data.data.token)
              this.$router.push('/Home')
            } else {
              this.$message({
                message: res.data.meta.msg
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang= "less">
.login {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #2d434c;
  .el-form {
    width: 400px;
    margin: 150px auto;
    padding: 75px 40px 15px;
    background-color: #fff;
    border-radius: 20px;
    position: relative;
    img {
      height: 100px;
      width: 100px;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: -50px;
      transform: translateX(-50%);
    }
  }
}
</style>
