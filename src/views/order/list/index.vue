<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-show="formShow">
        <el-form :model="queryForm" ref="queryForm" :inline="true">
          <el-form-item label="模糊搜索" prop="conditionParameter">
            <el-input
              v-model="queryForm.conditionParameter"
              placeholder="请输入订单号/商品名称/买家昵称"
              clearable
              size="small"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="交易类型" prop="conditionParameter">
            <el-select v-model="queryForm.conditionParameter" placeholder="请选择">
              <el-option
                v-for="item in []"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成交时间" prop="dateRange">
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
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部订单" name="first"></el-tab-pane>
        <el-tab-pane label="待买家付款" name="second"></el-tab-pane>
        <el-tab-pane label="代发货" name="third"></el-tab-pane>
        <el-tab-pane label="已发货" name="fourth"></el-tab-pane>
        <el-tab-pane label="已成功订单" name="five"></el-tab-pane>
        <el-tab-pane label="已取消订单" name="six"></el-tab-pane>
      </el-tabs>
      <el-table style="width: 100%" v-loading="loading" :data="orderList">
        <el-table-column label="订单号" prop="aa" />
        <el-table-column label="创建时间" prop="bb" />
        <el-table-column label="订单金额" prop="cc" />
        <el-table-column label="买家昵称" prop="dd" />
        <el-table-column label="实收款" prop="ee" />
        <el-table-column label="售后服务" prop="ff" />
        <el-table-column label="交易状态" prop="gg" />
        <el-table-column label="订单状态" prop="hh" />
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleDetail(scope.row)"
            >详情</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-truck"
              @click="handleEdit(scope.row)"
            >发货</el-button>
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
import { getProList } from "@/api/product";
import { MessageBox } from "element-ui";
export default {
  data() {
    return {
      loading: false,
      activeName: "first",
      orderList: [
        {
          aa: "ljk58425625255llk",
          bb: "2019-10-13 20:32:33",
          cc: "5863.32",
          dd: "mafangyuan",
          ee: "5863.32",
          ff: "开发票",
          gg: "交易完成",
          hh: "未付款"
        },
        {
          aa: "ljk58425625255llk",
          bb: "2019-10-13 20:32:33",
          cc: "5863.32",
          dd: "mafangyuan",
          ee: "5863.32",
          ff: "开发票",
          gg: "交易完成",
          hh: "未付款"
        },
        {
          aa: "ljk58425625255llk",
          bb: "2019-10-13 20:32:33",
          cc: "5863.32",
          dd: "mafangyuan",
          ee: "5863.32",
          ff: "开发票",
          gg: "交易完成",
          hh: "未付款"
        }
      ],
      formShow: true,
      total: 20,
      queryForm: {
        dateRange: [],
        state: 2,
        conditionParameter: undefined
      },
      pageNum: 1,
      pageSize: 10
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {},
    handleQuery() {
      this.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.queryForm.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleExport() {},
    handleEdit() {},
    handleAdd() {},
    handleDetail() {
      this.$router.push({
        path: `/orderDetail/detail/ljk58425625255llk`
      });
    },
    handleClick() {}
  }
};
</script>