<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-show="formShow">
        <el-form :model="queryForm" ref="queryForm" :inline="true">
          <el-form-item label="经销商名称" prop="username">
            <el-input
              v-model="queryForm.username"
              placeholder="请输入经销商名称"
              clearable
              size="small"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="是否有效" prop="isvalid">
            <el-select
              v-model="queryForm.isvalid"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="有效" value="Y" />
              <el-option label="无效" value="N" />
            </el-select>
          </el-form-item>
          <el-form-item label="授权时间" prop="dateRange">
            <el-date-picker
              v-model="queryForm.dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
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

    <div class="table-p">
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="goAuthorize">前往授权</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" size="mini">导出</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mb10 f-r icon-wrap">
        <el-col :span="1.5">
          <div class="icon-box icon-box-f" @click="formShow = !formShow">
            <i class="el-icon-zoom-in"></i>
          </div>
        </el-col>
        <el-col :span="1.5">
          <div class="icon-box icon-box-t" @click="handleQuery">
            <i class="el-icon-refresh"></i>
          </div>
        </el-col>
      </el-row>
      <el-table style="width: 100%" v-loading="loading" :data="distributorList">
        <el-table-column label="经销商名称" prop="username" width="180" />
        <el-table-column label="信用额度" prop="creditlimit" />
        <el-table-column label="已用额度" prop="usedlimit" />
        <el-table-column label="可用额度" prop="usablelimit" />
        <el-table-column label="风控额度" prop="risklimit" />
        <el-table-column label="平台总使用额度" prop="sumlimit" width="160" />
        <el-table-column label="风控状态">
          <template
            slot-scope="scope"
          >{{Number(scope.row.sumlimit)>Number(scope.row.risklimit)?'风控超额':'正常'}}</template>
        </el-table-column>
        <el-table-column label="信用额度最新使用时间" prop="latestusedtime" width="180" />
        <el-table-column label="授权额度最新更改时间" prop="latestmodifytime" width="180" />
        <el-table-column label="授权额度初始创建时间" prop="initcreatetime" width="180" />
        <el-table-column label="折扣" prop="vodiscount"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">授权</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-sold-out"
              @click="handleDiscount(scope.row)"
            >折扣</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="pageNum"
        :limit.sync="pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import { list } from "@/api/distributor";
import { parseTime } from "@/utils";
export default {
  data() {
    return {
      loading: false,
      formShow: true,
      distributorList: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        dateRange: [],
        username: undefined,
        isvalid: undefined
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
        const { _initParams, queryForm } = this;
        const {
          code,
          data: {
            pageResult: { content, totalSize }
          }
        } = await list(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.distributorList = content;
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
      this.queryForm.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    goAuthorize() {
      this.$router.push({
        path: `/distributor/authorize`
      });
    },
    handleEdit(item) {
      const { creditlimit, risklimit, uid, usercode } = item;
      this.$router.push({
        path: `/dynamic/authorize-edit/${uid}-${usercode}-${creditlimit}-${risklimit}`
      });
    },
    handleDiscount(item) {
      const { uid, discount, usercode } = item;
      this.$router.push({
        path: `/dynamic/discount/${uid}-${usercode}-${discount}`
      });
    },
    _initParams(obj) {
      const { dateRange } = obj;
      Object.assign(obj, {
        timestart: parseTime(dateRange[0]),
        timeend: parseTime(dateRange[1]),
        dateRange: null
      });
      return obj;
    }
  }
};
</script>