<template>
<div class="roles">
  <el-breadcrumb separator-class="el-icon-arrow-right" height=100>
    <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色管理</el-breadcrumb-item>
  </el-breadcrumb>
  <el-table :data="roleList">
    <el-table-column type="expand">
      <template slot-scope="{row}">
        <span v-if="row.children.length === 0">暂无权限</span>
      <!-- 显示一级分类 -->
       <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
         <el-col :span="4">
           <el-tag @close="delRight(row,l1.id)" closable>{{l1.authName}}</el-tag>
           <i class="el-icon-arrow-right"></i>
         </el-col>
         <el-col :span="20">
           <!-- 显示二级分类 -->
           <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
             <el-col :span="4">
               <el-tag @close="delRight(row,l2.id)" closable type="success">{{l2.authName}}</el-tag>
               <i class="el-icon-arrow-right"></i>
             </el-col>
             <el-col :span="20">
               <!-- 显示3级分类 -->
               <span v-for="l3 in l2.children" :key="l3.id">
                 <el-tag @close="delRight(row,l3.id)" closable class="l3" type="warning">{{l3.authName}}</el-tag>
               </span>
             </el-col>

           </el-row>
         </el-col>
       </el-row>
      </template>
    </el-table-column>
    <el-table-column type="index" width="50"></el-table-column>
    <el-table-column label="角色名称" prop="roleName"></el-table-column>
    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
    <el-table-column label="角色操作">
      <template slot-scope = "{row}">
        <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
        <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
        <el-button type="success" plain icon="el-icon-check" @click="showAssignDialog(row)" size="mini">分配权限</el-button>
      </template>

    </el-table-column>
  </el-table>
  <!-- 树形图 -->
  <el-dialog :visible.sync="assignDialogVisible" title="分配角色" width="40%">
    <el-tree ref="tree" :data="data2"  show-checkbox node-key="id" :props="defaultProps" default-expand-all>
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="assignDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="assignRight">分 配</el-button>
  </span>
  </el-dialog>

</div>
</template>
<script>
export default {
  data() {
    return {
      roleList: [],
      assignDialogVisible: false,
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    async getRoleList() {
      let res = await this.axios.get('roles')
      console.log(res)
      this.roleList = res.data
    },
    async delRight(role, rightId) {
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      let { meta: { status }, data } = res
      if (status === 200) {
        role.children = data
        this.$message.success('取消权限成功')
      } else {
        this.$message.error('取消权限失败')
      }
    },
    async showAssignDialog(role) {
      this.roleId = role.id
      this.assignDialogVisible = true
      let res = await this.axios.get('rights/tree')
      let { meta: { status }, data } = res
      if (status === 200) {
        this.data2 = data
      }
      let ids = []
      role.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            ids.push(l3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys([105])
    },
    async assignRight() {
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      console.log(checkedKeys)
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      let rids = checkedKeys.concat(halfCheckedKeys).join()
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids
      })
      let { meta: { status } } = res
      if (status === 200) {
        this.getRoleList()
        this.assignDialogVisible = false
      } else {
        this.$message.erroe('分配权限失败了')
      }
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>
<style lang="less" scoped>
.l1 {
  margin-bottom: 10px;
  border-bottom: 1px dotted #ccc;
}
.l2 {
  margin-bottom: 10px;
}
.l3 {
  margin-left: 5px;
  margin-bottom: 5px;
}
</style>
