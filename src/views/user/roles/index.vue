<template>
  <div class="app-container">
    <div class="table-p">
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="10" class="mb10 f-r icon-wrap">
        <el-col :span="1.5">
          <div class="icon-box icon-box-t" @click="resetQuery">
            <i class="el-icon-refresh"></i>
          </div>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="userList">
        <el-table-column label="角色编号" prop="userId" width="120" />
        <el-table-column label="角色名称" prop="userName" />
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="680"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改（分配菜单）</el-button>
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

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="新增角色" :visible.sync="open" width="450px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="角色名称：">
          <el-input v-model="form.roleName" />
        </el-form-item>
        <el-form-item label="分配菜单：">
          <el-tree
            :data="deptOptions"
            show-checkbox
            default-expand-all
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 30,
      // 用户表格数据
      userList: [{ userId: "000123", userName: "fengsaikang777" }],
      open: false,
      // 日期范围
      dateRange: [],

      postOptions: [],
      // 角色选项
      roleOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      form: {},
      deptOptions: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  created() {},
  methods: {
    /** 查询用户列表 */
    getList() {
      this.userList = [];
      this.total = 0;
      this.loading = false;
    },
    handleQuery() {},
    resetQuery() {},
    handleAdd() {
      this.open = true;
    },
    handleUpdate() {},
    handleDelete() {},
    handleExport() {},
    submitForm() {},
    cancel() {}
  }
};
</script>