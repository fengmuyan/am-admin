<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="82px">
          <el-form-item label="经销商" prop="usercode">
              <el-select
                v-model="queryForm.usercode"
                placeholder="请选择经销商"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option v-for="(item, index) in usernameList" :v-key="index" :label="item.username" :value="item.usercode" />
              </el-select>
            </el-form-item>
          <el-form-item label="数据状态" prop="state">
            <el-select
              v-model="queryForm.state"
              placeholder="请选择"
              @change="stateChange"
              size="small"
              style="width: 240px"
            >
              <el-option label="全部" value="all" />
              <el-option label="预警" value="warn" />
            </el-select>
          </el-form-item>
          <el-form-item label="超X日未还" prop="warndays" v-if="queryForm.state === 'warn'">
            <el-input-number
              v-model="queryForm.warndays"
              :min="1"
              :max="9999"
              label="超X日未还"
              size="small"
            ></el-input-number>
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
      <el-table style="width: 100%" v-loading="loading" :data="distributorList">
        <el-table-column label="订单号" prop="orderno" show-overflow-tooltip />
        <el-table-column label="创建日期" sortable prop="paytime" />
        <el-table-column label="订单金额" sortable prop="orderamount" />
        <el-table-column label="采购商" prop="username" />
        <el-table-column label="商品数量" prop="cmdtcount" />
        <el-table-column label="已还信用额" sortable prop="realprice" />
        <el-table-column label="未还信用额" sortable prop="debt" />
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
import { getCreditBillDetail, handelQuotaDetailExport, getUsernameList } from "@/api/statistics";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      exportLoading: false,
      formShow: true,
      distributorList: [],
      total: 0,
      usernameList:[],
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        usercode: undefined,
        state: "all",
        warndays: undefined
      }
    };
  },
  async created(){
    const { usercode } = this.$route.params;
    if(usercode){
      this.queryForm.usercode = usercode;
    }
    try{
      const { data }  = await getUsernameList();
      this.usernameList = data;
    } catch(err) {
      consol.log(err)
    }   
  },

  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const {
          code,
          data: {
            pageResult: { content, totalSize }
          }
        } = await getCreditBillDetail(this.queryForm);
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
      this.resetForm("queryForm");
      this.queryForm.state = "all";
      this.queryForm.warndays = undefined;
      this.queryForm.usercode = undefined;
      this.handleQuery();
    },
    stateChange(val){
      if(val === "all"){
        this.queryForm.warndays = undefined;
      }else if(val === "warn"){
        this.queryForm.warndays = "30";
      }
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
          const { msg, code } = await handelQuotaDetailExport(this.queryForm);
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