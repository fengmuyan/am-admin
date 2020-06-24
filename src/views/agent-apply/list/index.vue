<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-show="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="75px">
          <el-form-item label="申请货主" prop="thearchyname">
            <el-input
              v-model="queryForm.thearchyname"
              placeholder="请输入申请货主"
              clearable
              size="small"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="审核状态" prop="state">
            <el-select
              v-model="queryForm.state"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="审核中" value="0" />
              <el-option label="审核失败" value="1" />
              <el-option label="审核通过" value="2" />
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
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">申请添加货主</el-button>
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
      <el-table style="width: 100%" v-loading="loading" :data="applyList">
        <el-table-column label="申请货主" prop="thearchyname" show-overflow-tooltip />
        <el-table-column label="货主联系方式" prop="phonenumber" show-overflow-tooltip />
        <el-table-column label="备注" prop="remark" show-overflow-tooltip />
        <el-table-column label="审核状态" prop="voState" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              :class="{'warn-color':scope.row.state===1,'suc-color':scope.row.state===2}"
            >{{scope.row.voState}}</span>
          </template>
        </el-table-column>
        <el-table-column label="拒绝原因" prop="reason" show-overflow-tooltip />
        <el-table-column label="申请时间" prop="createtime" show-overflow-tooltip />
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
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
        v-show="total>0"
        :total="total"
        :page.sync="queryForm.pageNum"
        :limit.sync="queryForm.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 添加或修改消息对话框 -->
    <el-dialog :title="title" :visible.sync="open" @close="clearValidate" width="550px">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :inline="true"
        v-loading="loadingDialog"
        label-width="110px"
      >
        <el-form-item label="货主名称" prop="guid">
          <el-select
            v-model="form.guid"
            filterable
            placeholder="试试搜索：北京"
            style="width: 320px"
            @change="thearchyChange"
          >
            <el-option
              v-for="item in shipperList"
              :key="item.guid"
              :label="item.thearchyname"
              :value="item.guid"
            />
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
import {
  getApplyList,
  handelApply,
  handelApplyDel,
  getShipperList
} from "@/api/shipper";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      formShow: true,
      loadingForm: false,
      loadingDialog: false,
      dateRange: [],
      applyList: [],
      shipperList: [],
      total: 0,
      title: "申请添加货主",
      open: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        thearchyname: undefined
      },
      form: {
        guid: undefined,
        phone: "",
        remark: undefined
      },
      rules: {
        guid: [{ required: true, message: "请选择货主", trigger: "change" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const { _initParams, queryForm } = this;
      try {
        this.loading = true;
        const {
          code,
          data: {
            pageResult: { content, totalSize }
          }
        } = await getApplyList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.applyList = content;
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
    async handleAdd() {
      this.title = "申请添加货主";
      this.open = true;
      try {
        this.loadingDialog = true;
        const { data, code } = await getShipperList();
        this.loadingDialog = false;
        if (code === 200) {
          this.shipperList = data;
        }
      } catch (err) {
        this.loadingDialog = false;
        console.log(err);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loadingForm = true;
            const { code } = await handelApply(this.form);
            this.loadingForm = false;
            this.open = false;
            if (code === 200) {
              this.msgSuccess("申请成功");
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
            const { code } = await handelApplyDel({ guid: item.guid });
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
    thearchyChange(val) {
      const phone = this.shipperList.find(item => item.guid === val);
      this.form.phone = phone.phonenumber;
    },
    _initParams(obj) {
      const dateRange = this.dateRange || [];
      Object.assign(obj, {
        beginTime: dateRange.length > 0 ? dateRange[0] : null,
        endTime: dateRange.length > 0 ? dateRange[1] : null
      });
      return obj;
    }
  }
};
</script>