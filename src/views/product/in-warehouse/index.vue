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
          <el-form-item label="发布时间" prop="dateRange">
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
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">发布商品</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mb10 f-r icon-wrap">
        <el-col :span="1.5">
          <div class="icon-box icon-box-f" @click="formShow = !formShow">
            <i class="el-icon-zoom-in"></i>
          </div>
        </el-col>
        <el-col :span="1.5">
          <div class="icon-box icon-box-s" @click="resetQuery">
            <i class="el-icon-refresh"></i>
          </div>
        </el-col>
        <el-col :span="1.5">
          <div class="icon-box icon-box-t">
            <el-dropdown trigger="click">
              <el-button type="primary">
                <i class="el-icon-menu"></i>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-checkbox
                  v-for="(item,index) in initData"
                  :key="index"
                  v-model="item.checked"
                >{{item.label}}</el-checkbox>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
      <el-table style="width: 100%" v-loading="loading" :data="productList">
        <el-table-column label="商品编码" prop="ccode" />
        <el-table-column label="商品类目" prop="cmdtclassname" />
        <el-table-column label="商品名称" prop="title" />
        <el-table-column label="付款方式" prop="voPaymethod" />
        <el-table-column label="库存计数" prop="voStockmethod" />
        <el-table-column label="上架状态" prop="vostate" />
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
        :page.sync="pageNum"
        :limit.sync="pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { getProList } from "@/api/product";
import { getToken } from "@/utils/auth";
import { MessageBox } from "element-ui";
export default {
  data() {
    return {
      loading: false,
      productList: [],
      total: 0,
      formShow: true,
      queryForm: {
        dateRange: [],
        state: 3,
        conditionParameter: undefined
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      initData: []
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
            pageResult: { content, pageNum, pageSize, totalPages, totalSize }
          }
        } = await getProList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          ...this.queryForm
        });
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
      this.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.queryForm.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleExport() {},
    handleEdit(item) {
      this.$router.push({
        path: `/publish/detail/${item.producode}`
      });
    },

    handleAdd() {
      this.$router.push({
        path: `/publish/publish`
      });
    },

    handleOnshelf(item) {
      this.$confirm("确定要上架吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let formData = new FormData();
        formData.append("moduleNum", "3");
        formData.append("producode", item.producode);
        formData.append("invoice", item.invoice);
        formData.append("state", "1");
        this.subTableData(formData);
      });
    },

    /* 拼装提交数据 */
    async subTableData(formData) {
      try {
        this.loading = true;
        const {
          data: { code, msg }
        } = await axios.post(
          `${process.env.VUE_APP_BASE_API}/mounttai/publish/modifyProductInfo`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + getToken()
            }
          }
        );
        this.loading = false;
        if (code === 200) {
          this.msgSuccess("修改成功");
          this.getList();
        } else {
          MessageBox({
            message: msg,
            type: "error",
            duration: 5 * 1000
          });
        }
      } catch (err) {
        this.loading = true;
        console.log(err);
      }
    }
  }
};
</script>