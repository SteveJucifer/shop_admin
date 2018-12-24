<template>
<div class="login">
 <el-form ref="form" :status-icon='true' :rules="rules" :model="form" label-width="80px">
  <img src="@/assets/snoopy.jpg" alt="">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="form.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="form.password" @keyup.enter.native="login"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type = "primary" @click = "login">登录</el-button>
    <el-button @click="reset">重置</el-button>
  </el-form-item>
</el-form>
</div>
</template>
<script>
/* export default {
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
      // 获取到整个表单组件，重置
      this.$refs.form.resetFields()
    },
    login() {
      // 让整个表单校验
      this.$refs.form.validate(async valid => {
        if (!valid) return false
        let res = await this.axios({
          method: 'post',
          url: 'login',
          data: this.form
        })
        console.log(res)

        let { meta: { status, msg }, data: { token } } = res
        if (status === 200) {
          alert('登录成功')
          this.$message.success('登录成功')
          localStorage.setItem('token', token)
          this.$router.push('/home')
        } else {
          // 失败的消息  this.$message: 弹出一个消息提示
          this.$message({
            message: msg,
            type: 'error',
            duration: 1000
          })
        }
      })
    }
  }
} */
export default {
  data() {
    return {
      // 收集表单数据
      form: {
        username: '',
        password: ''
      },
      // 表单的校验规则
      rules: {
        // 用户名的校验规则
        username: [
          // 非空校验 trigger： blur  change
          { required: true, message: '用户名不能为空', trigger: 'change' },
          {
            min: 3,
            max: 9,
            message: '用户长度在 3 到 9 个字符',
            trigger: 'change'
          }
        ],
        password: [
          // 非空校验
          { required: true, message: '密码不能为空', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '用户长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    reset() {
      // 获取到整个表单组件，重置
      this.$refs.form.resetFields()
    },
    login() {
      // 让整个表单校验
      this.$refs.form.validate(async valid => {
        // valid如果为true，就表示通过 否则不通过
        if (!valid) return false
        // 发送ajax请求，进行登录
        let res = await this.axios({
          method: 'post',
          url: 'login',
          data: this.form
        })
        let { meta: { status, msg }, data: { token } } = res
        if (status === 200) {
          // alert('登录成功')
          this.$message.success('登录成功')
          // 把后台颁发的token存起来
          localStorage.setItem('token', token)
          // 跳转到Home组件
          // 参数：跳转的路径
          // 类似于location.href
          this.$router.push('/home')
        } else {
          // 失败的消息  this.$message: 弹出一个消息提示
          this.$message({
            message: msg,
            type: 'error',
            duration: 1000
          })
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
