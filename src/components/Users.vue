<template>
<div class="user">
  <el-breadcrumb separator-class="el-icon-arrow-right" height=100>
    <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 搜索框 -->
  <el-input placeholder="请输入内容" v-model="input5" class="input-with-select">
    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    <el-button type="primary"></el-button>
  </el-input>
  <el-table :data="userList">
    <el-table-column prop="username" label="姓名" width="120"></el-table-column>
    <el-table-column prop="email" label="邮箱" width="120"></el-table-column>
    <el-table-column prop="mobile" label="手机" width="120"></el-table-column>
    <el-table-column prop="mg_state" label="状态" width="120">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作" >
      <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
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
</div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      /* 分页 */
      userList: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      /* 搜索框参数 */
      input3: '',
      input4: '',
      input5: '',
      select: ''
    }
  },

  methods: {
    getUserList() {
      axios({
        method: 'get',
        url: 'http://localhost:8888/api/private/v1/users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        },
        // 在请求头中获取token
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.meta.status === 200) {
          this.userList = res.data.data.users
          this.total = res.data.data.total
          console.log(this.userList)
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUserList()
    },
    search() {
      this.currentPage = 1
      this.getUserList()
    },
    delUser(id) {
      this.$confirm('您确定要删除吗', '温馨提示', {
        type: 'warning'
      })
        .then(() => {
          axios({
            method: 'delete',
            url: `http://localhost:8888/api/private/v1/users/${id}`,
            header: {
              Authorization: localStorage.getItem('token')
            }
          }).then(res => {
            if (res.data.meta.status === 200) {
              if (this.userList.length <= 1 && this.currentPage > 1) {
                this.currentPage--
              }
              this.getUserList()
              this.$message.success('恭喜')
            }
          })
        })
        .catch(() => {
          this.$message.info('取消删除了')
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
