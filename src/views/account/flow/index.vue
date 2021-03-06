<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="80px">
          <el-form-item label="通道名称" prop="channelcode">
            <el-select
              v-model="queryForm.channelcode"
              placeholder="请选择"
              size="small"
              style="width: 200px"
            >
              <el-option label="农行综合收银台" value="100001" />
            </el-select>
          </el-form-item>
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
          <el-form-item label="变动类型" prop="changetype">
            <el-select
              v-model="queryForm.changetype"
              placeholder="请选择"
              size="small"
              style="width: 200px"
            >
              <el-option label="收款" value="0" />
              <el-option label="提现" value="1" />
              <el-option label="退款" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
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
      <el-table style="width: 100%" v-loading="loading" :data="flowList">
        <el-table-column label="序号" prop="order" width="60" />
        <el-table-column label="通道名称" prop="channelname" />
        <el-table-column label="变动前账户金额" prop="beforeamount" />
        <el-table-column label="变动金额" prop="changeamount" />
        <el-table-column label="变动类型" prop="changetype">
          <template slot-scope="scope">{{scope.row.changetype | initChangetype }}</template>
        </el-table-column>
        <el-table-column label="变动后账户金额" prop="afteramount" />
        <el-table-column label="变动时间" prop="createtime" />
        <el-table-column label="备注" prop="remarks" />
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
import { getAccountFlowList, handelAccountFlowExport } from "@/api/account";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      exportLoading: false,
      formShow: true,
      total: 0,
      flowList: [],
      dateRange: [],
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        channelcode: undefined,
        changetype: undefined
      }
    };
  },
  filters: {
    initChangetype(val) {
      const arr = ["收款", "提现", "退款"];
      return arr[val];
    }
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
        } = await getAccountFlowList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.flowList = content.map((item, index) => {
            return Object.assign(item, { order: index + 1 });
          });
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
          const { msg, code } = await handelAccountFlowExport(
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
        createtimestart: dateRange.length > 0 ? dateRange[0] : null,
        createtimeend: dateRange.length > 0 ? dateRange[1] : null
      });
      return obj;
    }
  }
};
</script>