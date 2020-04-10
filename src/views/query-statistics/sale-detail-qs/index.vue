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
          <el-form-item label="商品类型" prop="isagent">
            <el-select
              v-model="queryForm.isagent"
              placeholder="请选择"
              size="small"
              style="width: 200px"
            >
              <el-option label="全部" value />
              <el-option label="代卖" value="Y" />
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
      <el-table style="width: 100%" v-loading="loading" :data="orderList">
        <el-table-column label="日期" prop="paytime" width="150" />
        <el-table-column label="订单号" prop="orderno" width="150" show-overflow-tooltip />
        <el-table-column label="货主" prop="supplier" width="150" show-overflow-tooltip />
        <el-table-column label="经销商" prop="username" show-overflow-tooltip />
        <el-table-column label="经销商编号：" prop="usercode" width="150" show-overflow-tooltip />
        <el-table-column label="商品编号" prop="cmdtcode" width="120" show-overflow-tooltip />
        <el-table-column label="商品名称" prop="title" show-overflow-tooltip />
        <el-table-column label="产地" prop="area" width="80" />
        <el-table-column label="商标" prop="trademark" width="80" />
        <el-table-column label="级别" prop="level" width="80" />
        <el-table-column label="品类" prop="varieties" width="80" />
        <el-table-column label="商品数量" prop="cmdtcount" width="80" />
        <el-table-column label="毛重" prop="splitgrossweight" width="80" />
        <el-table-column label="净重" prop="splitnetweight" width="80" />
        <el-table-column label="价格/件" prop="discountprice" width="80" />
        <el-table-column label="优惠" prop="couponprice" />
        <el-table-column label="抹零" prop="dispelprice" />
        <el-table-column label="抹账" prop="wipeaccountsprice" width="80" />
        <el-table-column label="总价" prop="cmdttotalprice" width="80" />
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
import { getSaleProDetailList, SaleProDetailExport } from "@/api/statistics";
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
      dateRange: [],
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        isagent: ""
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
            pageResult: { content, totalSize }
          }
        } = await getSaleProDetailList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.orderList = content;
          this.total = totalSize;
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
      this.resetForm("queryForm");
      this.queryForm.isagent = "";
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
          const { msg, code } = await SaleProDetailExport(
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