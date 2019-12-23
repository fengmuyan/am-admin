<template>
  <div class="app-container">
    <div class="table-p">
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="roleList">
        <el-table-column label="角色编号" prop="roleId" width="120" />
        <el-table-column label="角色名称" prop="roleName" />
        <el-table-column label="权限标识" prop="roleKey" />
        <el-table-column label="排序" prop="roleSort" />
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="400"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >分配菜单</el-button>
            <el-button
              v-if="scope.row.userId !== 1"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="新增角色" :visible.sync="open" width="500px">
      <el-form ref="roleForm" :model="roleForm" :rules="roleFormRules" label-width="110px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入用户名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('roleForm')">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配菜单" :visible.sync="openEdit" width="500px">
      <el-form
        ref="roleEditform"
        :model="roleEditform"
        :rules="roleEditformRules"
        label-width="90px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleEditform.roleName" />
        </el-form-item>
        <el-form-item label="菜单权限" v-loading="menuLoading">
          <el-tree
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormEdit('roleEditform')">确 定</el-button>
        <el-button @click="openEdit = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from "@/utils";
import { addRole, getRoleList } from "@/api/user";
import { delRole, updateRole, changeRoleStatus } from "@/api/system/role";
import {
  godTreeselect as treeselect,
  roleMenuTreeselect
} from "@/api/system/menu";
export default {
  data() {
    return {
      loading: false,
      menuLoading: false,
      open: false,
      openEdit: false,
      roleList: [],
      roleForm: {
        roleName: ""
      },
      roleFormRules: {
        roleName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ]
      },
      roleEditform: {
        roleName: "",
        roleId: undefined,
        roleKey: undefined,
        roleSort: 0,
        menuIds: []
      },
      roleEditformRules: {
        roleName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ]
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      menuOptions: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, data } = await getRoleList();
        this.loading = false;
        if (code === 200) {
          this.roleList = data;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    async handleUpdate(row) {
      this.resetEdit();
      Object.assign(this.roleEditform, {
        roleId: row.roleId,
        roleName: row.roleName,
        roleKey: row.roleKey,
        roleSort: row.roleSort
      });
      this.openEdit = true;
      this.menuLoading = true;
      const { data: treeData } = await treeselect();
      const { data } = await roleMenuTreeselect(row.roleId);
      this.menuOptions = treeData;
      this.$refs.menu.setCheckedKeys(data);
      this.menuLoading = false;
    },
    handleAdd() {
      this.reset();
      this.open = true;
    },
    handleDelete(row) {
      this.$confirm(
        '是否确认删除角色编号为"' + row.roleId + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "el-message-box-wran"
        }
      )
        .then(function() {
          return delRole(row.roleId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.roleName + '"角色吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "el-message-box-wran"
        }
      )
        .then(function() {
          return changeRoleStatus(row.roleId, row.status);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const { code, msg } = await addRole(this.roleForm);
            if (code === 200) {
              this.open = false;
              await this.getList();
              ELEMENT.MessageBox({
                message: "添加成功",
                type: "success",
                duration: 5 * 1000,
                customClass: "el-message-box-suc"
              });
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    submitFormEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const data = this.roleEditform;
            const { code } = await updateRole(
              Object.assign(data, {
                menuIds: this._getMenuAllCheckedKeys()
              })
            );
            if (code === 200) {
              this.msgSuccess("修改成功");
              this.openEdit = false;
              this.getList();
            }
          } catch (err) {
            console.log(err);
          }
        } else {
        }
      });
    },
    reset() {
      this.roleForm = {
        roleName: ""
      };
      this.resetForm("roleForm");
    },
    resetEdit() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.roleEditform = {
        roleName: "",
        roleId: undefined,
        roleKey: undefined,
        roleSort: 0,
        menuIds: []
      };
      this.resetForm("roleEditform");
    },
    _getMenuAllCheckedKeys() {
      let checkedKeys = this.$refs.menu.getHalfCheckedKeys();
      let halfCheckedKeys = this.$refs.menu.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    }
  }
};
</script>