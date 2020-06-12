<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="80px">
          <div>
            <el-form-item label="订单编号" prop="orderno">
              <el-input
                v-model="queryForm.orderno"
                placeholder="请输入订单编号"
                clearable
                size="small"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="采购员" prop="paytype">
              <el-select
                v-model="queryForm.paytype"
                placeholder="请选择"
                clearable
                size="small"
                style="width: 140px"
              >
                <el-option label="货币支付" value="0" />
                <el-option label="信用额度支付" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="采购工厂" prop="paytype">
              <el-input
                v-model="queryForm.orderno"
                placeholder="请输入采购工厂"
                clearable
                size="small"
                style="width: 140px"
              />
            </el-form-item>
            <el-form-item label="采购日期" prop="ordersource">
              <el-date-picker
                v-model="queryForm.ordersource"
                type="date"
                clearable
                size="small"
                placeholder="选择日期"
                style="width: 200px"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="商品名称" prop="orderno">
              <el-input
                v-model="queryForm.orderno"
                placeholder="请输入商品名称"
                clearable
                size="small"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="付款状态" prop="ordersource">
              <el-select
                v-model="queryForm.ordersource"
                placeholder="请选择"
                clearable
                size="small"
                style="width: 140px"
              >
                <el-option label="PC" value="0" />
                <el-option label="Android" value="1" />
                <el-option label="ios" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="打税公司" prop="ordersource">
              <el-select
                v-model="queryForm.ordersource"
                placeholder="请选择"
                clearable
                size="small"
                style="width: 140px"
              >
                <el-option label="PC" value="0" />
                <el-option label="Android" value="1" />
                <el-option label="ios" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="到货日期" prop="ordersource">
              <el-date-picker
                v-model="queryForm.ordersource"
                type="date"
                clearable
                size="small"
                placeholder="选择日期"
                style="width: 200px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item style="padding-left:11px">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-collapse-transition>

    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部采购单" name="-1"></el-tab-pane>
        <el-tab-pane label="已保存" name="1"></el-tab-pane>
        <el-tab-pane label="在途中" name="2"></el-tab-pane>
        <el-tab-pane label="已打税" name="3"></el-tab-pane>
        <el-tab-pane label="已入库" name="4"></el-tab-pane>
      </el-tabs>
      <el-row :gutter="10" class="export2-btn icon-wrap" style="right:-65px">
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
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          style="margin-left:10px"
        >导出数据</el-button>
      </el-row>
      <el-table
        style="width: 100%"
        v-loading="loading"
        row-key="orderId"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :data="orderList"
      >
        <el-table-column label="序号" prop="order" width="60" />
        <el-table-column label="订单号" prop="orderno" />
        <el-table-column label="车牌号" prop="orderamount" />
        <el-table-column label="采购日期" prop="createtime" />
        <el-table-column label="到货日期" prop="createtime" />
        <el-table-column label="采购员" prop="createtime" />
        <el-table-column label="商品编号" prop="createtime" />
        <el-table-column label="商品名称" prop="createtime" />
        <el-table-column label="操作" width="160">
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
              icon="el-icon-s-finance"
              @click="handleTaxation(scope.row)"
            >税费补充</el-button>
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

    <el-dialog :title="title" :visible.sync="open" @close="clearValidate" width="900px">
      <div v-loading="loadingTaxation" style="min-height:300px">
        <edit-table-item />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" :loading="loadingTaxationAction">税费补充</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getOrderList, orderExport } from "@/api/order";
import EditTableItem from "../components/EditTableItem";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      exportLoading: false,
      loadingTaxation: false,
      loadingTaxationAction: false,
      open: false,
      title: "税费补充",
      formShow: true,
      activeName: "-1",
      orderList: [
        {
          order: 1,
          orderId: 1,
          orderno: "720631812900003840",
          children: [
            {
              orderId: 11,
              orderamount: "京QJ9527",
              createtime: "2020-06-11 13:33:33"
            }
          ]
        },
        {
          order: 2,
          orderId: 2,
          orderno: "720631812900003844",
          children: [
            {
              orderId: 21,
              orderamount: "京QJ9527",
              createtime: "2020-06-11 13:33:33"
            },
            {
              orderId: 22,
              orderamount: "京QJ9527",
              createtime: "2020-06-11 13:33:33"
            }
          ]
        },
        {
          order: 3,
          orderId: 3,
          orderno: "720631812900003848",
          orderamount: "京QJ9527",
          createtime: "2020-06-11 13:33:33"
        },
        {
          order: 4,
          orderId: 4,
          orderno: "720631812900003850",
          orderamount: "京QJ9527",
          createtime: "2020-06-11 13:33:33"
        },
        {
          order: 5,
          orderId: 5,
          orderno: "720631812900003852",
          orderamount: "京QJ9527",
          createtime: "2020-06-11 13:33:33"
        }
      ],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        tradestate: undefined,
        orderno: undefined,
        username: undefined,
        paytype: undefined,
        ordersource: undefined,
        paystate: undefined,
        orderstate: undefined
      }
    };
  },
  components: {
    EditTableItem
  },
  filters: {
    initTradestate(val) {
      const arr = [
        "待付款",
        "待发货",
        "已发货",
        "物流派件中",
        "已完成",
        "已关闭",
        "已失效",
        "",
        "",
        "",
        "待称重",
        "已称重，待付"
      ];
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
        } = await getOrderList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          /* this.orderList = content.map((v, i) => {
            return Object.assign(v, { order: i + 1 });
          }); */
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
    handleDetail(item) {},
    handleTaxation(item) {
      this.title = `税费补充 -- ${item.orderno}`;
      this.open = true;
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
          this.exportLoading = true;
          const { msg, code } = await orderExport(_initParams(queryForm));
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
    clearValidate() {},
    _initParams(obj) {
      const activeName = this.activeName;
      Object.assign(obj, {
        tradestate: activeName === "-1" ? undefined : activeName
      });
      return obj;
    }
  }
};
</script>