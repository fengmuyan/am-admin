<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-show="formShow">
        <el-form :model="queryForm" ref="queryForm" :inline="true">
          <el-form-item label="模糊搜索" prop="conditionParameter">
            <el-input
              v-model="queryForm.conditionParameter"
              placeholder="请输入商品名称或标题"
              clearable
              size="small"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              format="yyyy-MM-dd"
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
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">发布商品</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mb10 f-r icon-wrap">
        <el-col :span="1.5">
          <div class="icon-box icon-box-f" @click="formShow = !formShow">
            <i class="el-icon-zoom-in"></i>
          </div>
        </el-col>
        <el-col :span="1.5">
          <div class="icon-box icon-box-t" @click="resetQuery">
            <i class="el-icon-refresh"></i>
          </div>
        </el-col>
      </el-row>
      <el-table style="width: 100%" v-loading="loading" :data="productList">
        <el-table-column label="商品编码" prop="ccode" />
        <el-table-column label="商品类目" prop="cmdtclassname" />
        <el-table-column label="商品名称" prop="title" />
        <el-table-column label="付款方式" prop="voPaymethod" />
        <el-table-column label="付款方式" prop="voPaymethod" />
        <el-table-column label="库存计数" prop="voStockmethod" />
        <el-table-column label="上架状态" prop="vostate" />
        <el-table-column label="上架时间" prop="publishtime" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-sell"
              @click="handleOnshelf(scope.row)"
            >上架</el-button>
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
import { getProList, proPublishSubEdit } from "@/api/product";
export default {
  data() {
    return {
      loading: false,
      productList: [],
      formShow: true,
      total: 0,
      dateRange: [],
      queryForm: {
        state: 3,
        pageNum: 1,
        pageSize: 10,
        conditionParameter: undefined
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
        } = await getProList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.productList = content;
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

    handleEdit(item) {
      this.$router.push({
        path: `/publish/detail/${item.producode}-${item.uid}`
      });
    },

    handleAdd() {
      this.$router.push({
        path: `/product/publish`
      });
    },

    handleOnshelf(item) {
      this.$confirm("确定要上架吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      }).then(() => {
        let formData = new FormData();
        formData.append("moduleNum", "3");
        formData.append("producode", item.producode);
        formData.append("uid", item.uid);
        formData.append("invoice", item.invoice);
        formData.append("state", "1");
        this.subTableData(formData);
      });
    },

    /* 拼装提交数据 */
    async subTableData(formData) {
      try {
        this.loading = true;
        const { code, msg } = await proPublishSubEdit(formData);
        this.loading = false;
        if (code === 200) {
          this.msgSuccess("修改成功");
          this.getList();
        }
      } catch (err) {
        this.loading = true;
        console.log(err);
      }
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