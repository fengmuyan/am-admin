<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-show="formShow">
        <el-form :model="queryForm" ref="queryForm" :inline="true">
          <el-form-item label="模糊搜索" prop="conditionParameter">
            <el-input
              v-model="queryForm.conditionParameter"
              placeholder="请输入商户编号或用户编号"
              clearable
              size="small"
              style="width: 240px"
            />
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
            <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini">重置</el-button>
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
          <div class="icon-box icon-box-t">
            <i class="el-icon-refresh"></i>
          </div>
        </el-col>
      </el-row>
      <el-table style="width: 100%" v-loading="loading" :data="distributorList">
        <el-table-column label="商户编号" prop="aa" />
        <el-table-column label="信用额度" prop="aa" />
        <el-table-column label="已用额度" prop="bb" />
        <el-table-column label="可用额度" prop="cc" />
        <el-table-column label="风控额度" prop="cc" />
        <el-table-column label="信用额度最新使用时间" prop="dd" width="240" />
        <el-table-column label="授权额度最新更改时间" prop="ee" width="240" />
        <el-table-column label="授权额度初始创建时间" prop="ff" width="240" />
        <el-table-column label="折扣" prop="cc" />
        <el-table-column label="风控状态" prop="hh" />
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">授权</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-sell"
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
import axios from "axios";
import { getToken } from "@/utils/auth";
import { MessageBox } from "element-ui";
export default {
  data() {
    return {
      loading: false,
      formShow: true,
      distributorList: [
        {
          aa: 50,
          bb: 20,
          cc: 30,
          dd: "2019-10-12 20:12:23",
          ee: "2019-8-12 20:12:23",
          ff: "2019-1-01 20:12:23",
          hh: "风控超额"
        }
      ],
      queryForm: {
        dateRange: [],
        state: 2,
        conditionParameter: undefined
      },
      pageNum: 1,
      pageSize: 10,
      total: 10
    };
  },
  created() {},
  methods: {
    getList() {},
    goAuthorize() {
      this.$router.push({
        path: `/distributor/authorize`
      });
    },
    handleEdit(item) {
      this.$router.push({
        path: `/dynamic/authorize-edit/023000023`
      });
    },
    handleDiscount() {
      this.$router.push({
        path: `/dynamic/discount/023000023`
      });
    }
  }
};
</script>