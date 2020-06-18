<template>
  <div class="app-container">
    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="userList">
        <el-table-column label="用户编号" prop="userId" width="80" />
        <el-table-column label="用户名称" prop="userName" />
        <el-table-column label="用户昵称" prop="nickName" />
        <el-table-column label="角色" prop="roleNames"/>
        <el-table-column label="状态" prop="status" width="80">
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
          width="200"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-key"
              @click="handleResetPwd(scope.row)"
            >重置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="新增用户" :visible.sync="open" width="500px">
      <el-form ref="userForm" :model="userForm" :rules="userFormRules" label-width="110px">
        <el-form-item label="用户账号" prop="userName">
          <el-input v-model="userForm.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="userForm.password" placeholder="请输入用户密码" type="password" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="userForm.nickName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户角色" prop="roleIds">
          <el-select v-model="userForm.roleIds" multiple style="width:340px" placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.roleId"
              :value="item.roleId"
              :label="item.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('userForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="openEdit" width="500px">
      <el-form
        ref="userEditForm"
        :model="userEditForm"
        :rules="userEditFormRules"
        label-width="110px"
      >
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="userEditForm.userName" style="width:320px" disabled placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="userEditForm.nickName" style="width:320px" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-select v-model="userEditForm.status" style="width:320px" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.status"
              :value="item.status"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleIds">
          <el-select v-model="userEditForm.roleIds" multiple style="width:320px" placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.roleId"
              :value="item.roleId"
              :label="item.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openEdit = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('userEditForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addUser, getUserList, getRoleList } from "@/api/user";
import { delUser, resetUserPwd, changeUserStatus } from "@/api/system/user";
import { deepClone } from "@/utils";
import minHeightMix from '@/mixins/minHeight'
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      open: false,
      openEdit: false,
      total: 0,
      userList: [],
      userForm: {
        userName: "",
        password: "",
        nickName: "",
        roleIds: []
      },
      userEditForm: {
        userName: "",
        userId: "",
        status: "",
        nickName: "",
        roleIds: []
      },
      userFormRules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        roleIds: [
          { required: true, message: "用户角色不能为空", trigger: "change" }
        ]
      },
      userEditFormRules: {
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        roleIds: [
          { required: true, message: "用户角色不能为空", trigger: "change" }
        ],
        status: [
          { required: true, message: "用户状态不能为空", trigger: "change" }
        ]
      },
      roleOptions: [],
      statusOptions: [
        { status: "0", label: "正常" },
        { status: "1", label: "停用" }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, data } = await getUserList();
        this.loading = false;
        if (code === 200) {
          this.userList = data;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    reset() {
      this.userForm = {
        userName: "",
        password: "",
        nickName: "",
        roleIds: []
      };
      this.resetForm("userForm");
    },
    async handleAdd() {
      this.reset();
      const { msg, data } = await getRoleList();
      this.roleOptions = data.map(item => {
        return { roleId: item.roleId, roleName: item.roleName };
      });
      this.open = true;
    },
    async handleUpdate(item) {
      Object.assign(this.userEditForm, {
        userId: item.userId,
        userName: item.userName,
        status: item.status,
        nickName: item.nickName,
        roleIds: item.roles.map(v => v.roleId)
      });
      const { msg, data } = await getRoleList();
      this.roleOptions = data.map(item => {
        return { roleId: item.roleId, roleName: item.roleName };
      });
      this.openEdit = true;
    },
    submitForm(formName) {
      let data =
        formName === "userForm"
          ? deepClone(this.userForm)
          : deepClone(this.userEditForm);
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const { code, msg } = await addUser(
              Object.assign(data, {
                roleIds: data.roleIds.join(",")
              })
            );
            this.open = false;
            this.openEdit = false;
            await this.getList();
            if (code === 200) {
              this.msgSuccess("操作成功");
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.userName + '"用户吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "el-message-box-wran"
        }
      )
        .then(function() {
          return changeUserStatus(row.userId, row.status);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    handleDelete(row) {
      this.$confirm(
        '是否确认删除用户编号为"' + row.userId + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "el-message-box-wran"
        }
      )
        .then(function() {
          return delUser(row.userId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          resetUserPwd(row.userId, value).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功，新密码是：" + value);
            } else {
              this.msgError(response.msg);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>