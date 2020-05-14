<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="70px">
          <el-form-item label="退款单号" prop="guid">
            <el-input
              v-model="queryForm.guid"
              placeholder="请输入退款单号"
              clearable
              size="small"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="经销商" prop="username">
            <el-input
              v-model="queryForm.username"
              placeholder="请输入经销商名称"
              clearable
              size="small"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 360px"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item style="padding-left:11px">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="-1"></el-tab-pane>
        <el-tab-pane label="审核中" name="1"></el-tab-pane>
        <el-tab-pane label="审核失败" name="2"></el-tab-pane>
        <el-tab-pane label="退款中" name="3"></el-tab-pane>
        <el-tab-pane label="已退款" name="4"></el-tab-pane>
        <el-tab-pane label="已取消" name="5"></el-tab-pane>
      </el-tabs>
      <el-row :gutter="10" class="export2-btn icon-wrap" style="right:-150px">
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
        <!-- <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          style="margin-left:10px"
        >导出数据</el-button> -->
      </el-row>
      <el-table style="width: 100%" v-loading="loading" :data="refundList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="[scope.row]" class="expand-table">
              <el-table-column label="申请时间" prop="sqRefundTime" width="150" />
              <el-table-column
                label="申请原因"
                prop="dyRefundReason"
                width="150"
                show-overflow-tooltip
              />
              <el-table-column
                label="具体描述"
                prop="sqRefundReason"
                width="150"
                show-overflow-tooltip
              />
              <el-table-column label="退款信用额" prop="refundCreditAmount" />
              <el-table-column label="退款现金" prop="refundAmount" />
              <el-table-column label="审核失败原因" prop="shResult" width="150" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.shResult===null?"--":scope.row.shResult}}</template>
              </el-table-column>
              <el-table-column label="审核时间" prop="shTime" width="150">
                <template slot-scope="scope">{{scope.row.shTime===null?"--":scope.row.shTime}}</template>
              </el-table-column>
              <el-table-column label="银行响应时间" prop="finshTime" width="150">
                <template slot-scope="scope">{{scope.row.finshTime===null?"--":scope.row.finshTime}}</template>
              </el-table-column>
              <el-table-column
                label="银行响应信息"
                prop="yhErrorMessage"
                width="150"
                show-overflow-tooltip
              >
                <template
                  slot-scope="scope"
                >{{scope.row.yhErrorMessage===null?"--":scope.row.yhErrorMessage}}</template>
              </el-table-column>
              <el-table-column label="操作" width="150" v-if="Number(scope.row.refund)===1">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-s-release"
                    @click="handleNoExamine(scope.row)"
                  >拒绝</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-s-claim"
                    @click="handleAgree(scope.row)"
                  >同意</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" v-if="Number(scope.row.refund)===3">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-bank-card"
                    @click="handelRefund(scope.row)"
                  >退款</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-s-release"
                    @click="handleNoExamine(scope.row)"
                  >拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>

        <el-table-column label="序号" prop="order" width="50" />
        <el-table-column label="退款单号" prop="guid" width="150" show-overflow-tooltip />
        <el-table-column label="经销商" prop="username" width="150" show-overflow-tooltip />
        <el-table-column label="订单号" prop="orderno" width="150" show-overflow-tooltip />
        <el-table-column label="商品名称" prop="title" width="150" show-overflow-tooltip />
        <el-table-column label="单价" prop="unitprice" />
        <el-table-column label="数量" prop="cmdtcount" />
        <el-table-column label="折扣" prop="discount" />
        <el-table-column label="优惠" prop="couponprice" />
        <el-table-column label="抹零" prop="dispelprice" />
        <el-table-column label="抹账" prop="wipeaccountsprice" />
        <el-table-column label="退款状态" prop="refund">
          <template slot-scope="scope">
            <span
              :class="{'warn-color':scope.row.refund===2,'suc-color':scope.row.refund===3}"
            >{{scope.row.refund | initRefundState }}</span>
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
import {
  getRefundList,
  handelRefuseRefund,
  handelAgreeRefund,
  handelRefund
} from "@/api/refund";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      exportLoading: false,
      formShow: true,
      activeName: "-1",
      refundList: [],
      total: 0,
      dateRange: [],
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        guid: undefined,
        username: undefined
      }
    };
  },
  filters: {
    initRefundState(val) {
      const arr = ["正常", "审核中", "审核失败", "退款中", "已退款", "已取消"];
      return arr[val];
    }
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
        } = await getRefundList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.refundList = content.map((item, index) => {
            return Object.assign(item, { order: index + 1 });
          });
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
    handleClick() {
      this.queryForm.pageNum = 1;
      this.getList();
    },
    handleExport() {
      const { _initParams, queryForm } = this;
      this.$confirm("是否确认导出所有订单数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(async () => {
          /* this.exportLoading = true;
          const { msg, code } = await orderExport(_initParams(queryForm));
          if (code === 200) {
            this.download(msg);
            this.msgSuccess("导出成功");
            this.exportLoading = false;
          } else {
            this.exportLoading = false;
          } */
        })
        .catch(function() {});
    },
    handleNoExamine(item) {
      this.$prompt("请输入拒绝原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: value => {
          if (value === "" || value === null) {
            return "拒绝原因不能为空！";
          } else {
            return true;
          }
        }
      })
        .then(async ({ value }) => {
          try {
            this.loading = true;
            const { code } = await handelRefuseRefund({
              guid: item.guid,
              refuseReason: value
            });
            this.loading = false;
            if (code === 200) {
              this.msgSuccess("审核成功");
              this.getList();
            }
          } catch (err) {
            this.loading = false;
            console.log(err);
          }
        })
        .catch(() => {});
    },
    handleAgree(item) {
      this.$confirm("确定要同意审核吗？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(async () => {
          try {
            const { code } = await handelAgreeRefund({
              guid: item.guid
            });
            this.loading = false;
            if (code === 200) {
              this.msgSuccess("操作成功");
              this.getList();
            }
          } catch (err) {
            this.loading = false;
            console.log(err);
          }
        })
        .catch(err => {});
    },
    handelRefund(item) {
      this.$confirm("确定要退款吗？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran",
        closeOnClickModal: false
      })
        .then(async () => {
          try {
            const { code } = await handelRefund({
              guid: item.guid
            });
            this.loading = false;
            if (code === 200) {
              this.msgSuccess("退款成功");
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
      const activeName = this.activeName;
      const dateRange = this.dateRange || [];
      Object.assign(obj, {
        refund: activeName === "-1" ? undefined : activeName,
        timestart: dateRange.length > 0 ? dateRange[0] : undefined,
        timeend: dateRange.length > 0 ? dateRange[1] : undefined
      });
      return obj;
    }
  }
};
</script>