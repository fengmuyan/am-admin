<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-show="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="75px">
          <el-form-item label="申请货主" prop="thearchyname">
            <el-select
              v-model="queryForm.thearchyname"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="双方都" value="1" />
              <el-option label="京东商城" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态" prop="state">
            <el-select
              v-model="queryForm.state"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="审核中" value="1" />
              <el-option label="审核失败" value="2" />
              <el-option label="审核通过" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 260px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加申请</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mb10 f-r icon-wrap">
        <el-col :span="1.5">
          <div class="icon-box icon-box-f" @click="formShow = !formShow">
            <i class="el-icon-zoom-in" v-show="!formShow"></i>
            <i class="el-icon-zoom-out" v-if="formShow"></i>
          </div>
        </el-col>
        <el-col :span="1.5">
          <div class="icon-box icon-box-t" @click="handleQuery">
            <i class="el-icon-refresh"></i>
          </div>
        </el-col>
      </el-row>
      <el-table style="width: 100%" v-loading="loading" :data="shipperList">
        <el-table-column label="记录编号" prop="uid" width="100px" show-overflow-tooltip />
        <el-table-column label="申请货主" prop="thearchyname" show-overflow-tooltip />
        <el-table-column label="货主联系方式" prop="phone" show-overflow-tooltip />
        <el-table-column label="备注" prop="remarks" show-overflow-tooltip />
        <el-table-column label="审核状态" prop="status" show-overflow-tooltip />
        <el-table-column label="拒绝原因" prop="reson" show-overflow-tooltip />
        <el-table-column label="申请时间" prop="createtime" show-overflow-tooltip />
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-message" @click="handleApply(scope.row)">申请</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDel(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="true || total>0"
        :total="total"
        :page.sync="queryForm.pageNum"
        :limit.sync="queryForm.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 添加或修改消息对话框 -->
    <el-dialog :title="title" :visible.sync="open" @close="clearValidate" width="550px">
      <el-form ref="form" :model="form" :rules="rules" :inline="true" label-width="110px">
        <el-form-item label="货主名称" prop="thearchyname">
          <el-select
              v-model="form.thearchyname"
              placeholder="请选择"
              style="width: 320px"
            >
              <el-option label="双方都" value="1" />
              <el-option label="京东商城" value="2" />
            </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" style="width:320px" placeholder="由货主带出" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="form.remark"
            placeholder="请输入备注"
            maxlength="255"
            show-word-limit
            style="width:320px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button :loading="loadingForm" type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList, addRole, handelShipperDel } from "@/api/user";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    const validateTel = (rule, value, callback) => {
      console.log(value);
      if (value === "" || value === undefined) {
        callback();
      } else {
        if (!/^1[345678]\d{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        }
        callback();
      }
    };
    return {
      loading: false,
      formShow: true,
      loadingForm: false,
      dateRange: [],
      shipperList: [
        {
          uid: 10255200,
          thearchyname: "北京万果企业有限公司",
          phone: 13699196450,
          remarks: "电话沟通过的",
          status: "审核中",
          reson: "",
          createtime:"2020-02-10 20:00:00"
        },
        {
          uid: 10255200,
          thearchyname: "北京万果企业有限公司",
          phone: 13699196450,
          remarks: "电话沟通过的",
          status: "审核失败",
          reson: "不同意",
          createtime:"2020-02-10 20:00:00"
        }
      ],
      total: 0,
      title: "添加申请",
      open: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        thearchyname: undefined
      },
      form: {
        guid: undefined,
        thearchyname: undefined,
        phone: undefined,
        remark: undefined
      },
      rules: {
        thearchyname: [
          { required: true, message: "请输入货主名称", trigger: "blur" }
        ],
        phone: [{ validator: validateTel, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const {
          code,
          data: { content, totalSize }
        } = await getShipperList(this.queryForm);
        this.loading = false;
        if (code === 200) {
          this.shipperList = content;
          this.total = totalSize;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    handleQuery() {
      this.queryForm.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    resetShipperForm() {
      Object.assign(this.form, {
        guid: undefined,
        thearchyname: undefined,
        userAccount: undefined,
        phone: undefined,
        email: undefined,
        remark: undefined
      });
    },
    async handleAdd() {
      this.resetShipperForm();
      this.title = "添加申请";
      await this.$nextTick();
      this.open = true;
    },
    async handleEdit(item) {
      this.resetShipperForm();
      this.title = "修改申请记录";
      Object.assign(this.form, {
        guid: item.guid,
        thearchyname: item.thearchyname,
        userAccount: item.userName,
        phone: item.phonenumber,
        email: item.email,
        remark: item.remark
      });
      await this.$nextTick();
      this.open = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loadingForm = true;
            const { code } = await handelShipperEdit(this.form);
            this.loadingForm = false;
            this.open = false;
            if (code === 200) {
              this.msgSuccess("操作成功");
              this.getList();
            }
          } catch (err) {
            this.loadingForm = false;
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.open = false;
    },
    clearValidate() {
      this.$refs.form.resetFields();
    },
    handleDel(item) {
      this.$confirm("确定要删除吗？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(async () => {
          try {
            const { code } = await handelShipperDel({ guid: item.guid });
            this.loading = false;
            if (code === 200) {
              this.msgSuccess("删除成功");
              this.getList();
            }
          } catch (err) {
            this.loading = false;
            console.log(err);
          }
        })
        .catch(err => {});
    },
    handleApply(item){
      this.$confirm("确定要申请吗？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(async () => {
          try {
            const { code } = await handelShipperDel({ guid: item.guid });
            this.loading = false;
            if (code === 200) {
              this.msgSuccess("删除成功");
              this.getList();
            }
          } catch (err) {
            this.loading = false;
            console.log(err);
          }
        })
        .catch(err => {});
    },
    _initParams(obj) {
      const dateRange = this.dateRange;
      Object.assign(obj, {
        beginTime: dateRange.length > 0 ? dateRange[0] : null,
        endTime: dateRange.length > 0 ? dateRange[1] : null
      });
      return obj;
    }
  }
};
</script>