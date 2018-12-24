<template>
<div class="user">
  <el-breadcrumb separator-class="el-icon-arrow-right" height=100>
    <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 搜索框 -->
  <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
  </el-input>
    <el-button type="primary" plain  @click="addUserDialog">添加用户</el-button>

  <el-table :data="userList">
    <el-table-column prop="username" label="姓名" width="120"></el-table-column>
    <el-table-column prop="email" label="邮箱" width="120"></el-table-column>
    <el-table-column prop="mobile" label="手机" width="120"></el-table-column>
    <el-table-column prop="mg_state" label="状态" width="120">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作" >
      <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" plain size="mini"  @click="showEditDialog(scope.row)">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" plain size="mini"  @click="delUser(scope.row.id)">删除</el-button>
        <el-button type="success" icon="el-icon-check" plain size="mini">分配角色</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <!--
    @size-change:每页条数发生了改变，会触发handleSizeCahnge
    @current-page:当前页发生改变
    current-page:当前页
    page-sizes:选择每页条数的数组
    layout:分页的控件
   -->
  <el-pagination
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[2, 4, 6, 8]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>

  <!-- 添加用户的模态框 -->
<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%">
   <el-form :model="addForm" ref="addForm" :rules="rules" label-width="80px" status-icon>
    <el-form-item label="用户名" prop="username">
      <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="addForm.password" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="addForm.mobile" placeholder="请输入手机"></el-input>
    </el-form-item>
   </el-form>
   <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
   </span>
</el-dialog>
<!-- 修改用户的模态框 -->
<el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%">
   <el-form :model="editForm" ref="editForm" :rules="rules" label-width="80px" status-icon>
    <el-form-item label="用户名" prop="username">
     <el-tag type="info">{{editForm.username}}</el-tag>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="editForm.mobile" placeholder="请输入手机"></el-input>
    </el-form-item>
   </el-form>
   <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateUser">确 定</el-button>
   </span>
</el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      /* 分页 */
      userList: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      /* 添加用户模态框隐藏 */
      addDialogVisible: false,
      /* 修改用户模态框隐藏 */
      editDialogVisible: false,

      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 2, max: 8, message: '用户名位2到8位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 12, message: '密码位6到12位', trigger: 'blur' }
        ],
        email: [{ type: 'email', message: '邮箱不能为空', trigger: 'blur' }],
        mobile: [
          { pattern: /^1\d{10}$/, message: '请输入手机号', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    async getUserList() {
      // axios如果是get/delete请求，参数要么直接拼地址栏，要么放到params中
      // 如果post/put/patch请求，参数放到data中
      // 除了login请求，其他所有的接口都必须携带token， 要求设置给请求头：Authorization
      let res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let { meta: { status }, data: { users, total } } = res
      if (status === 200) {
        this.userList = users
        this.total = total
      }
    },
    handleSizeChange(val) {
      // 修改this.pageSize
      this.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      console.log(val)
      // 把currentPage修改成val
      this.currentPage = val
      this.getUserList()
    },
    search() {
      // 搜索的时候，把当前页第一页
      this.currentPage = 1
      this.getUserList()
    },
    async delUser(id) {
      try {
        await this.$confirm('您确定要删除吗', '温馨提示', {
          type: 'warning'
        })
        // 发送ajax请求，删除数据
        let res = await this.axios({
          method: 'delete',
          url: `users/${id}`
        })
        if (res.meta.status === 200) {
          // 成功了怎么办？
          // 如果我们发现当前页只有一条数据了，应该current减1，渲染上一页
          if (this.userList.length <= 1 && this.currentPage > 1) {
            this.currentPage--
          }
          this.getUserList()
          this.$message.success('恭喜你，删除成功了')
        }
      } catch (e) {
        this.$message.info('取消删除了')
      }
    },
    async changeState({ id, mg_state: mgState }) {
      let res = await this.axios({
        method: 'put',
        url: `users/${id}/state/${mgState}`
      })
      if (res.meta.status === 200) {
        this.$message.success('修改状态成功了')
      } else {
        this.$message.error('修改状态失败了')
      }
    },
    // 显示添加对话框
    addUserDialog() {
      this.addDialogVisible = true
    },
    addUser() {
      // 1. 表单校验功能
      // 2. 发送ajax请求添加数据
      // 3. 重新渲染  关闭模态框  重置样式
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 校验成功
        let res = await this.axios({
          method: 'post',
          url: 'users',
          data: this.addForm
        })
        let { meta: { status, msg } } = res
        if (status === 201) {
          this.total++
          this.currentPage = Math.ceil(this.total / this.pageSize)
          // 重新渲染
          this.getUserList()
          // 重置表单样式
          this.$refs.addForm.resetFields()
          // 隐藏模态框
          this.addDialogVisible = false
          // 提示信息
          this.$message.success('添加成功了')
        } else {
          this.$message.error(msg)
        }
      })
    },
    showEditDialog(row) {
      // 显示对话框
      this.editDialogVisible = true
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    updateUser() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        // 发送ajax请求
        let res = await this.axios({
          method: 'put',
          url: `users/${this.editForm.id}`,
          data: this.editForm
        })
        let { meta: { status } } = res
        if (status === 200) {
          // 重新渲染
          this.getUserList()
          // 隐藏修改对话框
          this.editDialogVisible = false
          // 重置修改表单
          this.$refs.editForm.resetFields()
          // 提示消息
          this.$message.success('恭喜你，修改成功了')
        } else {
          this.$message.error('服务器异常')
        }
      })
    }
  },
  created() {
    // console.log(localStorage.getItem('token'))
    this.getUserList()
  }
}
</script>
<style>
.el-breadcrumb {
  height: 40px;
  line-height: 40px;
  background-color: #ccc;
  border-radius: 2%;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select {
  background-color: #fff;
  width: 400px;
  height: 40px;
  margin: 5px 0;
}
</style>
