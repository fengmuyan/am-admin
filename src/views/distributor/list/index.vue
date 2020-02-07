<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
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
          <el-form-item label="授权时间">
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
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="goAuthorize">前往授权</el-button>
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
      <el-table style="width: 100%" v-loading="loading" :data="distributorList">
        <el-table-column label="经销商名称" prop="username" show-overflow-tooltip/>
        <el-table-column label="已用额度" prop="usedlimit" width="90"/>
        <el-table-column label="授权额度" prop="creditlimit" width="90"/>
        <el-table-column label="可用额度" prop="usablelimit" width="90"/>
        <el-table-column label="风控额度" prop="risklimit" width="90"/>
        <el-table-column label="平台总使用额度" prop="sumlimit" width="100" />
        <el-table-column label="风控状态" width="80">
          <template
            slot-scope="scope"
          >{{Number(scope.row.sumlimit)>Number(scope.row.risklimit)?'风控超额':'正常'}}</template>
        </el-table-column>
        <el-table-column label="信用额度最新使用时间" prop="latestusedtime" width="150" />
        <el-table-column label="授权额度最新更改时间" prop="latestmodifytime" width="150" />
        <el-table-column label="授权额度初始创建时间" prop="initcreatetime" width="150" />
        <el-table-column label="折扣" prop="vodiscount" width="60"/>
        <el-table-column label="操作" width="130">
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
        :page.sync="queryForm.pageNum"
        :limit.sync="queryForm.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import { list } from "@/api/distributor";
import minHeightMix from '@/mixins/minHeight'
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      formShow: true,
      distributorList: [],
      total: 0,
      dateRange: [],
      queryForm: {
        pageNum: 1,
        pageSize: 10,
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    goAuthorize() {
      this.$router.push({
        path: `/distributor/authorize`
      });
    },
    handleEdit(item) {
      const { creditlimit, risklimit, uid, usercode, usedlimit } = item;
      const params = window.btoa(
        `${uid}-${usercode}-${creditlimit}-${risklimit}-${usedlimit}`
      );
      this.$router.push({
        path: `/dynamic/authorize-edit/${params}`
      });
    },
    handleDiscount(item) {
      const { uid, discount, usercode } = item;
      const params = window.btoa(`${uid}-${usercode}-${discount}`);
      this.$router.push({
        path: `/dynamic/discount/${params}`
      });
    },
    _initParams(obj) {
      const dateRange = this.dateRange;
      Object.assign(obj, {
        timestart: dateRange.length > 0 ? dateRange[0] : null,
        timeend: dateRange.length > 0 ? dateRange[1] : null
      });
      return obj;
    }
  }
};
</script>