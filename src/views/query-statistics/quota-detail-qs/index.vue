<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="100px">
          <el-form-item label="经销商名称" prop="isvalid">
            <el-select
              v-model="queryForm.num"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
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
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
          >导出数据</el-button>
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
        <el-table-column label="订单号" prop="mercode" show-overflow-tooltip />
        <el-table-column label="创建日期" sortable prop="initcreatetime" />
        <el-table-column label="订单金额" sortable prop="creditlimit" />
        <el-table-column label="采购商" prop="username" />
        <el-table-column label="商品数量" prop="risklimit" />
        <el-table-column label="已还信用额" sortable prop="sumlimit" />
        <el-table-column label="未还信用额" sortable prop="sumlimit" />
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
        num: ""
      },
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1000",
          label: "北京全球通有限公司"
        },
        {
          value: "1001",
          label: "北京航宇通达管业有限公司"
        },
        {
          value: "1002",
          label: "上海交通有限公司"
        }
      ]
    };
  },
  mounted() {
    this.queryForm.num =
      /* this.$route.query.code || "" */ "北京航宇通达管业有限公司";
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
      this.queryForm.num = "";
      this.handleQuery();
    },
    handleExport() {
      this.$confirm("是否确认导出所有数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(async () => {})
        .catch(function() {});
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