<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="80px">
          <el-form-item label="经销商" prop="username">
            <el-input
              v-model="queryForm.username"
              placeholder="请输入经销商名称"
              clearable
              size="small"
              style="width: 240px"
            />
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
      <el-table style="width: 100%" v-loading="loading" :data="distributorList" :default-sort ="{prop:'usedlimit',order:'descending'}">
        <el-table-column label="经销商名称" prop="username" show-overflow-tooltip />
        <el-table-column label="已用额度" sortable prop="usedlimit" />
        <el-table-column label="授权额度" prop="creditlimit" />
        <el-table-column label="可用额度" prop="usablelimit" />
        <el-table-column label="风控额度" prop="risklimit" />
        <el-table-column label="平台总使用额度" prop="sumlimit" />
        <el-table-column label="风控状态" width="80">
          <template
            slot-scope="scope"
          >{{Number(scope.row.sumlimit)>Number(scope.row.risklimit)?'风控超额':'正常'}}</template>
        </el-table-column>
        <el-table-column label="信用额度最新使用时间" prop="latestusedtime" width="150" />
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleDetail(scope.row)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="total-wrap">
        <div class="total-data">
          已用额度合计：
          <span>￥{{totalusedlimit}}</span>
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
import { getCreditBill, handelQuotaExport } from "@/api/statistics";
import minHeightMix from '@/mixins/minHeight'
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      formShow: true,
      exportLoading: false,
      distributorList: [],
      totalusedlimit: 0,
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        username: ""
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
        const {
          code,
          data: {
            pageResult: { content, totalSize },
            totalusedlimit
          }
        } = await getCreditBill(this.queryForm);
        this.loading = false;
        if (code === 200) {
          this.distributorList = content;
          this.totalusedlimit = totalusedlimit;
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleDetail(item) {
      this.$router.push({
        name: "额度账单详情",
        params: { usercode: item.usercode}
      });
    },
    handleExport() {
      this.$confirm("是否确认导出所有数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(async () => {
          this.exportLoading = true;
          const { msg, code } = await handelQuotaExport(this.queryForm);
          if (code === 200) {
            this.download(msg);
            this.msgSuccess("导出成功");
            this.exportLoading = false;
          } else {
            this.exportLoading = false;
          }
        })
        .catch(function() {});
    }
  }
};
</script>