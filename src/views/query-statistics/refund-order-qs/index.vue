<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="80px">
          <el-form-item label="查询时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              :clearable="false"
              style="width: 360px"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="排序方式" prop="sortfield">
            <el-select
              v-model="queryForm.sortfield"
              placeholder="请选择"
              size="small"
              style="width: 200px"
            >
              <el-option label="订单数排序" value="0" />
              <el-option label="退款金额排序" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

    <div class="table-p" :style="{ 'min-height': minHeight }">
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
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
            style="margin-left:10px"
          >导出数据</el-button>
        </el-col>
      </el-row>
      <el-table
        style="width: 100%"
        v-loading="loading"
        :data="orderList"
        :default-sort="{prop:'usedlimit',order:'descending'}"
      >
        <el-table-column label="经销商" prop="username">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              :title="scope.row.username"
              width="220"
              trigger="hover"
            >
              <div>
                <p style="margin:0;line-height:22px">经销商编号：{{scope.row.usercode}}</p>
              </div>
              <span slot="reference">{{scope.row.username}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="退款订单数" sortable prop="ordercount" />
        <el-table-column label="已退款订单数" prop="paycount" />
        <el-table-column label="商品数量" prop="cmdtcount" />
        <el-table-column label="退款订单金额" sortable prop="paymoney" />
        <el-table-column label="信用额度退款" sortable prop="creditprice" />
        <el-table-column label="资金退款" sortable prop="realprice" />
      </el-table>
      <div class="total-wrap">
        <div class="total-data">
          订单金额合计：
          <span style="margin-right:35px">￥{{totalpaymoney}}</span>
          资金退款合计：
          <span style="margin-right:35px">￥{{totalrealprice}}</span>
          信用额度退款合计：
          <span>￥{{totalcreditprice}}</span>
        </div>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryForm.pageNum"
          :limit.sync="queryForm.pageSize"
          @pagination="getList"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { getRefundList, handelRefundExport } from "@/api/statistics";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      exportLoading: false,
      formShow: true,
      orderList: [],
      total: 0,
      totalpaymoney: 0,
      totalrealprice: 0,
      totalcreditprice: 0,
      dateRange: [],
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        sortfield: "0"
      }
    };
  },
  created() {
    this.resetTime();
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
            pageResult: { content, totalSize },
            totalpaymoney,
            totalrealprice,
            totalcreditprice
          }
        } = await getRefundList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.orderList = content;
          this.total = totalSize;
          this.totalpaymoney = totalpaymoney;
          this.totalrealprice = totalrealprice;
          this.totalcreditprice = totalcreditprice;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    resetTime() {
      this.dateRange = [
        `${this.parseTime(new Date().getTime(), "{y}-{m}-{d}")} 00:00:00`,
        `${this.parseTime(
          new Date().getTime() + 24 * 60 * 60 * 1000,
          "{y}-{m}-{d}"
        )} 00:00:00`
      ];
    },
    handleQuery() {
      this.queryForm.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetTime();
      this.queryForm.sortfield = "0";
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleExport() {
      const { _initParams, queryForm } = this;
      this.$confirm("是否确认导出所有数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(async () => {
          this.exportLoading = true;
          const { msg, code } = await handelRefundExport(
            _initParams(queryForm)
          );
          if (code === 200) {
            this.download(msg);
            this.msgSuccess("导出成功");
            this.exportLoading = false;
          } else {
            this.exportLoading = false;
          }
        })
        .catch(function() {});
    },
    _initParams(obj) {
      const dateRange = this.dateRange || [];
      Object.assign(obj, {
        timestart: dateRange.length > 0 ? dateRange[0] : null,
        timeend: dateRange.length > 0 ? dateRange[1] : null
      });
      return obj;
    }
  }
};
</script>