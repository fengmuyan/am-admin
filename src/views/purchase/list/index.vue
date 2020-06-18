<template>
  <div class="app-container purchase-list">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="80px">
          <div>
            <el-form-item label="采购单号" prop="purcode">
              <el-input
                v-model="queryForm.purcode"
                placeholder="请输入采购单号"
                clearable
                size="small"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="采购员" prop="purUsercode">
              <el-select
                v-model="queryForm.purUsercode"
                placeholder="请选择"
                clearable
                size="small"
                style="width: 140px"
              >
                <el-option
                  v-for="(item,index) in puruserList"
                  :key="index"
                  :label="item.nickName"
                  :value="item.userName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="采购日期">
              <el-date-picker
                v-model="phrDateRange"
                size="small"
                style="width: 300px"
                type="datetimerange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="打税公司" prop="taxCode">
              <el-select
                v-model="queryForm.taxCode"
                placeholder="请选择"
                clearable
                size="small"
                style="width: 200px"
              >
                <el-option
                  v-for="(item,index) in taxfactoryList"
                  :key="index"
                  :label="item.cname"
                  :value="item.ccode"
                />
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="商品名称" prop="cmdtname">
              <el-input
                v-model="queryForm.cmdtname"
                placeholder="请输入商品名称"
                clearable
                size="small"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="付款状态" prop="paymentStatus">
              <el-select
                v-model="queryForm.paymentStatus"
                placeholder="请选择"
                clearable
                size="small"
                style="width: 140px"
              >
                <el-option label="已付款" value="0" />
                <el-option label="未付款" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="入库日期">
              <el-date-picker
                v-model="sentDateRange"
                size="small"
                style="width: 300px"
                type="datetimerange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
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
        <el-tab-pane label="采购中" name="0"></el-tab-pane>
        <el-tab-pane label="在途中" name="1"></el-tab-pane>
        <el-tab-pane label="已打税" name="2"></el-tab-pane>
        <el-tab-pane label="已入库" name="3"></el-tab-pane>
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
        row-key="rowkey"
        :tree-props="{children: 'rtPurchaseDetailsRespList', hasChildren: 'hasChildren'}"
        :data="orderList"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column label="序号" prop="order" width="60" />
        <el-table-column label="采购单号" prop="treePurcode" width="100" />
        <el-table-column label="采购日期" prop="treeVoPurdate" />
        <el-table-column label="采购员" prop="treePurUsername" />
        <el-table-column label="到货日期" prop="treeVoStorageDate" />
        <el-table-column label="车牌号" prop="carNum" />
        <el-table-column label="商品编号" prop="cmdtcode" width="100" />
        <el-table-column label="商品名称" prop="cmdtname" width="100" />
        <el-table-column label="工厂" prop="factoryName" width="100" />
        <el-table-column label="卖场" prop="storeName" width="100" />
        <el-table-column label="车次" prop="trainNumber" width="100" />
        <el-table-column label="产地" prop="producerName" />
        <el-table-column label="品级" prop="gradeName" />
        <el-table-column label="件数" prop="num" />
        <el-table-column label="件重" prop="initUnitWeight" />
        <el-table-column label="总重" prop="initTotalWeight" />
        <el-table-column label="单价" prop="initUnitPrice" width="100" />
        <el-table-column label="总计（外汇）" prop="initPurWhAmount" width="100" />
        <el-table-column label="当天汇率" prop="rate" />
        <el-table-column label="总计/元" prop="purAmount" />
        <el-table-column label="运费/元" prop="freightAmount" />
        <el-table-column label="打税费用/元" prop="taxAmount" />
        <el-table-column label="其他费用/元" prop="otherAmount" />
        <el-table-column label="总成本/元" prop="totalCost" />
        <el-table-column label="打税公司" prop="treeTaxName" />
        <el-table-column label="采购进度" prop="treeVoPurState" />
        <el-table-column label="实际付款" prop="treeRealprice" />
        <el-table-column label="回款人" prop="treeCollUsername" />
        <el-table-column label="付款状态" prop="treeVoPaymentStatus" />
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-if="scope.row.order"
              @click="handleDetail(scope.row)"
            >详情</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-s-finance"
              v-if="scope.row.order && scope.row.purState ==='3'"
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
import {
  getPurchaseList,
  getTaxfactoryList,
  getPuruserList,
  handelPurListExport
} from "@/api/purchase";
import { accAdd, deepClone } from "@/utils";
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
      orderList: [],
      phrDateRange: [],
      sentDateRange: [],
      taxfactoryList: [],
      puruserList: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        purcode: undefined,
        cmdtname: undefined,
        purUsercode: undefined,
        paymentStatus: undefined,
        taxCode: undefined
      }
    };
  },
  components: {
    EditTableItem
  },
  created() {
    this.getPremiseList();
    this.getList();
  },
  methods: {
    async getPremiseList() {
      try {
        const [
          { data: data1, code: code1 },
          { data: data2, code: code2 }
        ] = await Promise.all([
          getTaxfactoryList({ typeCode: 2 }),
          getPuruserList()
        ]);
        if (code1 === 200) {
          this.taxfactoryList = data1;
        }
        if (code2 === 200) {
          this.puruserList = data2;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getList() {
      try {
        this.loading = true;
        const { _initParams, queryForm } = this;
        const {
          code,
          data: { content, totalSize }
        } = await getPurchaseList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.orderList = this._initListNext(this._initList(content));
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
        path: `/purchase/edit-order/${item.purcode}`
      });
    },
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
          const { msg, code } = await handelPurListExport(
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
    clearValidate() {},
    _initParams(obj) {
      const activeName = this.activeName;
      const phrDateRange = this.phrDateRange || [];
      const sentDateRange = this.sentDateRange || [];
      Object.assign(obj, {
        purState: activeName === "-1" ? undefined : activeName,
        purdateStart: phrDateRange.length > 0 ? phrDateRange[0] : undefined,
        purdateEnd: phrDateRange.length > 0 ? phrDateRange[1] : undefined,
        storagedateStart:
          sentDateRange.length > 0 ? sentDateRange[0] : undefined,
        storagedateEnd: sentDateRange.length > 0 ? sentDateRange[1] : undefined
      });
      return obj;
    },
    _initListNext(arr) {
      return arr.map(item => {
        if (item.rtPurchaseDetailsRespList.length === 1) {
          const childItem = deepClone(item.rtPurchaseDetailsRespList[0]);
          return Object.assign(item, {
            carNum: childItem.carNum,
            voPurdate: childItem.voPurdate,
            voStorageDate: childItem.voStorageDate,
            cmdtcode: childItem.cmdtcode,
            cmdtname: childItem.cmdtname,
            factoryName: childItem.factoryName,
            storeName: childItem.storeName,
            trainNumber: childItem.trainNumber,
            producerName: childItem.producerName,
            gradeName: childItem.gradeName,
            num: childItem.num,
            initUnitWeight: childItem.initUnitWeight,
            initTotalWeight: childItem.initTotalWeight,
            initUnitPrice: childItem.initUnitPrice,
            initPurWhAmount: childItem.initPurWhAmount,
            rate: childItem.rate,
            rtPurchaseDetailsRespList: []
          });
        } else {
          return item;
        }
      });
    },
    _initList(arr) {
      return arr.map((item, index) => {
        if (item.rtPurchaseDetailsRespList) {
          item.rtPurchaseDetailsRespList.forEach((v, i) => {
            Object.assign(v, {
              rowkey: `${index + 1}-${i + 1}`,
              initUnitWeight: `${v.unitWeight}/${v.typeCode}`,
              initTotalWeight: `${v.totalWeight}`,
              initUnitPrice: `${v.unitPrice}/${v.currency}`,
              initPurWhAmount: `${v.purWhAmount}`
            });
          });
        }
        return Object.assign(item, {
          order: index + 1,
          rowkey: index + 1,
          treePurcode: item.purcode,
          treePurUsername: item.purUsername,
          treeVoPurState: item.voPurState,
          treeCollUsername: item.collUsername,
          treeVoPaymentStatus: item.voPaymentStatus,
          treeRealprice: item.realprice,
          treeTaxName: item.taxName,
          treeVoPurdate: item.voPurDate,
          treeVoStorageDate: item.voStorageDate
        });
      });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        }
        if (
          index === 1 ||
          index === 4 ||
          index === 5 ||
          index === 6 ||
          index === 15 ||
          index === 17 ||
          index === 18 ||
          index === 24 ||
          index === 27
        ) {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return accAdd(prev, curr);
            } else {
              return prev;
            }
          }, 0);
        }
      });

      return sums;
    }
  }
};
</script>