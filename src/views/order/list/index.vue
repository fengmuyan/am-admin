<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="70px">
          <div>
            <el-form-item label="订单号" prop="orderno">
              <el-input
                v-model="queryForm.orderno"
                placeholder="请输入订单号"
                clearable
                size="small"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="支付类型" prop="paytype">
              <el-select
                v-model="queryForm.paytype"
                placeholder="请选择"
                clearable
                size="small"
                style="width: 130px"
              >
                <el-option label="货币支付" value="0" />
                <el-option label="信用额度支付" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="订单来源" prop="ordersource">
              <el-select
                v-model="queryForm.ordersource"
                placeholder="请选择"
                clearable
                size="small"
                style="width: 130px"
              >
                <el-option label="PC" value="0" />
                <el-option label="Android" value="1" />
                <el-option label="ios" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="下单时间">
              <el-date-picker
                v-model="createDateRange"
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
          </div>
          <div>
            <el-form-item label="采购商" prop="username">
              <el-input
                v-model="queryForm.username"
                placeholder="请输入采购商名称"
                clearable
                size="small"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="订单状态" prop="orderstate">
              <el-select
                v-model="queryForm.orderstate"
                placeholder="请选择"
                clearable
                size="small"
                style="width: 130px"
              >
                <el-option label="正常" value="Y" />
                <el-option label="删除" value="N" />
              </el-select>
            </el-form-item>
            <el-form-item label="支付状态" prop="paystate">
              <el-select
                v-model="queryForm.paystate"
                placeholder="请选择"
                clearable
                size="small"
                style="width: 130px"
              >
                <el-option label="支付未完成" value="0" />
                <el-option label="支付完成" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="支付时间">
              <el-date-picker
                v-model="payDateRange"
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
          </div>
        </el-form>
      </div>
    </el-collapse-transition>

    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部订单" name="-1"></el-tab-pane>
        <el-tab-pane label="待称重" name="10"></el-tab-pane>
        <el-tab-pane label="待付款" name="0"></el-tab-pane>
        <el-tab-pane label="待发货" name="1"></el-tab-pane>
        <el-tab-pane label="已发货" name="2"></el-tab-pane>
        <el-tab-pane label="已完成" name="4"></el-tab-pane>
        <el-tab-pane label="已关闭" name="5"></el-tab-pane>
        <el-tab-pane label="已失效" name="6"></el-tab-pane>
      </el-tabs>
      <el-row :gutter="10" class="export2-btn icon-wrap">
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
          @click="handleExport2"
          style="margin-left:10px"
        >快递模板</el-button>
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          style="margin-left:10px"
        >导出数据</el-button>
      </el-row>
      <el-table style="width: 100%" v-loading="loading" :data="orderList">
        <el-table-column label="订单号" prop="orderno" width="150" show-overflow-tooltip />
        <el-table-column label="创建时间" sortable prop="createtime" width="150" />
        <el-table-column label="订单金额" sortable prop="orderamount" width="130" />
        <el-table-column label="经销商" prop="username" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              :title="scope.row.username"
              width="220"
              trigger="hover"
            >
              <div>
                <p style="margin:0;line-height:22px">经销商编号：{{scope.row.usercode}}</p>
              </div>
              <span slot="reference">{{scope.row.username}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="cmdtcount" width="60" />
        <el-table-column label="应收款" prop="needprice" width="70" />
        <el-table-column label="实收款" prop="realprice" width="70" />
        <el-table-column label="发货类型" prop="delivertype" width="70">
          <template slot-scope="scope">{{scope.row.delivertype | inDelivertype }}</template>
        </el-table-column>
        <el-table-column label="发票类型" prop="invocetype" width="70">
          <template slot-scope="scope">{{scope.row.invocetype | initInvocetype }}</template>
        </el-table-column>
        <el-table-column label="交易状态" prop="tradestate" width="120">
          <template slot-scope="scope">{{scope.row.tradestate | initTradestate}}</template>
        </el-table-column>
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
              icon="el-icon-truck"
              v-if="Number(scope.row.tradestate) === 1 && Number(scope.row.delivercount === 0)"
              @click="handleSent(scope.row)"
            >发货</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-s-order"
              v-if="isSentBtn(scope.row)"
              @click="handleToSentList(scope.row)"
            >发货列表</el-button>
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

    <el-dialog title="选择物流发货" :visible.sync="open" @close="clearValidate" width="600px">
      <el-form
        :model="expressForm"
        ref="expressForm"
        :rules="expressFormRules"
        v-loading="expressLoading"
        label-width="120px"
      >
        <el-form-item class="sent-wrap" label="发货信息" prop="strExpressDetailInfos">
          <div class="sent-box" v-for="(item,index) in orderDetailsList" :key="index">
            <div>
              <el-checkbox
                v-model="item.checked"
                :disabled="isDisabled(item)"
                @change="handelSentChange"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.cmdtname"
                  placement="top-start"
                >
                  <el-button>{{item.cmdtname}}</el-button>
                </el-tooltip>
              </el-checkbox>
              <el-input-number
                v-model="item.sentNum"
                :disabled="isDisabled(item)"
                @change="handelSentChange"
                size="small"
                :min="0"
                :max="item.allowDelivercount"
              ></el-input-number>
            </div>
            <div style="line-height:10px">
              <span class="sent-info sent-info-done" v-if="isNoAllowNum(item)">* 已发货。</span>
              <span class="sent-info sent-info-err" v-if="isNoAllowRefunded(item)">* 已退款。</span>
              <span
                class="sent-info sent-info-err"
                v-if="isNoAllowRefunding(item)"
              >* 退款处理中（{{item.refund | initRefund}}）。</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="物流公司" prop="expressname">
          <el-select
            v-model="expressForm.expressname"
            placeholder="请选择物流公司"
            @change="expressChange"
            style="width:350px"
          >
            <el-option
              v-for="(item,index) in expressList"
              :key="index"
              :label="item.expressname"
              :value="item.expressname"
            />
          </el-select>
        </el-form-item>
        <div v-if="expressForm.expressid === '100000001'">
          <el-form-item label="物流公司名称" prop="inexpressname">
            <el-input
              v-model="expressForm.inexpressname"
              placeholder="请输入物流公司名称"
              maxlength="30"
              style="width:350px"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="发货字号" prop="namebrand">
          <el-input
            v-model="expressForm.namebrand"
            placeholder="请输入发货字号"
            maxlength="20"
            style="width:350px"
          ></el-input>
        </el-form-item>
        <el-form-item label="物流单号" prop="expressno">
          <el-input
            v-model="expressForm.expressno"
            placeholder="请输入物流单号"
            maxlength="20"
            style="width:350px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" :loading="loadingSend" @click="submitForm('expressForm')">发 货</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择发货信息" :visible.sync="openSelf" @close="clearValidateSelf" width="600px">
      <el-form
        :model="selfForm"
        ref="selfForm"
        :rules="selfFormRules"
        v-loading="selfLoading"
        label-width="120px"
      >
        <el-form-item class="sent-wrap" label="发货信息" prop="strExpressDetailInfos">
          <div class="sent-box" v-for="(item,index) in orderDetailsList" :key="index">
            <el-checkbox
              v-model="item.checked"
              :disabled="isDisabled(item)"
              @change="handelSentChange"
            >
              <el-tooltip class="item" effect="dark" :content="item.cmdtname" placement="top-start">
                <el-button>{{item.cmdtname}}</el-button>
              </el-tooltip>
            </el-checkbox>
            <el-input-number
              v-model="item.sentNum"
              :disabled="isDisabled(item)"
              @change="handelSentChange"
              size="small"
              :min="0"
              :max="item.allowDelivercount"
            ></el-input-number>
            <div style="line-height:10px">
              <span class="sent-info sent-info-done" v-if="isNoAllowNum(item)">* 已发货。</span>
              <span class="sent-info sent-info-err" v-if="isNoAllowRefunded(item)">* 已退款。</span>
              <span
                class="sent-info sent-info-err"
                v-if="isNoAllowRefunding(item)"
              >* 退款处理中（{{item.refund | initRefund}}）。</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openSelf = false">取 消</el-button>
        <el-button type="primary" :loading="loadingSelf" @click="submitSelfForm('selfForm')">发 货</el-button>
      </div>
    </el-dialog>

    <el-dialog title="快递模板导出" :visible.sync="exportOpen" @close="clearValidateExport" width="950px">
      <div v-loading="loadingExportContent" style="min-height:500px">
        <el-form :model="exportForm" ref="exportForm" :rules="exportFormRules" label-width="100px">
          <el-form-item label="物流公司" prop="expressid">
            <el-select v-model="exportForm.expressid" placeholder="请选择快递公司" style="width:300px">
              <el-option
                v-for="(item,index) in expressExportList"
                :key="index"
                :label="item.expressname"
                :value="item.expressid"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="table-p" style="box-shadow:none;padding:0">
          <el-table
            ref="multipleTable"
            :data="expressExportOrderList"
            tooltip-effect="dark"
            style="width: 100%"
            height="500"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column label="订单号" prop="orderno" width="150" show-overflow-tooltip />
            <el-table-column label="创建时间" prop="createtime" width="150" />
            <el-table-column label="订单金额" prop="orderamount" width="130" />
            <el-table-column label="经销商" prop="username" />
            <el-table-column label="数量" prop="cmdtcount" width="60" />
            <el-table-column label="应收款" prop="needprice" width="70" />
            <el-table-column label="实收款" prop="realprice" width="70" />
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exportOpen = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="loadingExport"
          @click="submitExportForm('exportForm')"
        >导出模板</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getOrderList,
  orderToSent,
  orderExport,
  getExpressList,
  handelSendGoods,
  getOrderDetailsList,
  getExpressModelList,
  getDeliverOrderList,
  handelExportExpress
} from "@/api/order";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    const validateExpressno = (rule, value, callback) => {
      if (value === undefined) {
        callback(new Error("请输入物流单号"));
      } else {
        if (!/^[a-zA-Z0-9]{5,20}$/.test(value)) {
          callback(new Error("请输入正确的物流单号"));
        }
        callback();
      }
    };
    return {
      loading: false,
      exportLoading: false,
      selfLoading: false,
      loadingExport: false,
      loadingExportContent: false,
      expressLoading: false,
      loadingSend: false,
      loadingSelf: false,
      formShow: true,
      activeName: "-1",
      orderList: [],
      total: 0,
      open: false,
      exportOpen: false,
      openSelf: false,
      expressList: [],
      orderDetailsList: [],
      payDateRange: [],
      createDateRange: [],
      multipleSelection: [],
      expressExportList: [],
      expressExportOrderList: [],
      isSelfSent: false,
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
      },
      expressForm: {
        uid: undefined,
        orderno: undefined,
        expressno: undefined,
        expressname: undefined,
        expressid: undefined,
        inexpressname: undefined,
        namebrand: undefined,
        strExpressDetailInfos: []
      },
      selfForm: {
        uid: undefined,
        orderno: undefined,
        strExpressDetailInfos: []
      },
      expressFormRules: {
        expressno: [
          { validator: validateExpressno, required: true, trigger: "blur" }
        ],
        expressname: [
          { required: true, message: "请选择物流公司", trigger: "change" }
        ],
        inexpressname: [
          { required: true, message: "请输入物流公司名称", trigger: "blur" }
        ],
        strExpressDetailInfos: [
          {
            type: "array",
            required: true,
            message: "发货信息不能为空！",
            trigger: "blur"
          }
        ]
      },
      selfFormRules: {
        strExpressDetailInfos: [
          {
            type: "array",
            required: true,
            message: "发货信息不能为空！",
            trigger: "blur"
          }
        ]
      },
      exportForm: {
        expressid: ""
      },
      exportFormRules: {
        expressid: [
          { required: true, message: "请选择快递公司", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    isSentBtn() {
      return function(item) {
        const { delivercount } = item;
        return Number(delivercount) > 0;
      };
    },
    isDisabled() {
      return function(item) {
        const { refund, allowDelivercount } = item;
        return (
          Number(refund) === 1 ||
          Number(refund) === 3 ||
          Number(refund) === 4 ||
          Number(allowDelivercount) === 0
        );
      };
    },
    isNoAllowNum() {
      return function(item) {
        const { allowDelivercount } = item;
        return Number(allowDelivercount) === 0;
      };
    },
    isNoAllowRefunding() {
      return function(item) {
        const { refund } = item;
        return Number(refund) === 1 || Number(refund) === 3;
      };
    },
    isNoAllowRefunded() {
      return function(item) {
        const { refund } = item;
        return Number(refund) === 4;
      };
    }
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
    },
    initPaystate(val) {
      const arr = ["支付未完成", "支付完成"];
      return arr[val];
    },
    initOrderstate(val) {
      if (val === "Y") {
        return "正常";
      } else if (val === "N") {
        return "删除";
      }
    },
    inDelivertype(val) {
      const arr = ["自提", "代发"];
      return arr[val];
    },
    initInvocetype(val) {
      const arr = ["不开发票", "开发票"];
      return arr[val];
    },
    initRefund(val) {
      const arr = [
        "正常",
        "审核中",
        "审核失败",
        "退款中",
        "已退款",
        "退款失败"
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
          this.orderList = content;
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
      this.createDateRange = [];
      this.payDateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleDetail(item) {
      this.$router.push({
        path: `/order-detail/detail/${item.orderno}`
      });
    },
    handleClick() {
      this.queryForm.pageNum = 1;
      this.getList();
    },
    async handleSent(item) {
      const { uid, orderno, namebrand } = item;
      if (Number(item.delivertype) === 0) {
        this.isSelfSent = true;
        this.resetSelfForm();
        Object.assign(this.selfForm, {
          uid,
          orderno
        });
        this.openSelf = true;
        try {
          this.selfLoading = true;
          const { data, code } = await getOrderDetailsList({ orderno });
          this.selfLoading = false;
          if (code === 200) {
            this.orderDetailsList = data.map(item => {
              return Object.assign(item, {
                checked: false,
                sentNum: item.allowDelivercount
              });
            });
          }
        } catch (err) {
          this.selfLoading = false;
          console.log(err);
        }
      } else if (Number(item.delivertype) === 1) {
        this.isSelfSent = false;
        this.resetExpressForm();
        Object.assign(this.expressForm, {
          uid,
          orderno,
          namebrand
        });
        this.open = true;
        try {
          this.expressLoading = true;
          const [
            { data: data1, code: code1 },
            { data: data2, code: code2 }
          ] = await Promise.all([
            getExpressList(),
            getOrderDetailsList({ orderno })
          ]);
          this.expressLoading = false;
          if (code1 === 200) {
            this.expressList = data1;
          }
          if (code2 === 200) {
            this.orderDetailsList = data2.map(item => {
              return Object.assign(item, {
                checked: false,
                sentNum: item.allowDelivercount
              });
            });
          }
        } catch (err) {
          this.expressLoading = false;
          console.log(err);
        }
      }
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
    async handleExport2() {
      this.exportOpen = true;
      try {
        this.loadingExportContent = true;
        const [
          { data: data1, code: code1 },
          { data: data2, code: code2 }
        ] = await Promise.all([getExpressModelList(), getDeliverOrderList()]);
        this.loadingExportContent = false;
        if (code1 === 200) {
          this.expressExportList = data1;
        }
        if (code2 === 200) {
          this.expressExportOrderList = data2;
        }
      } catch (err) {
        this.loadingExportContent = false;
        console.log(err);
      }
    },
    resetExpressForm() {
      Object.assign(this.expressForm, {
        uid: undefined,
        orderno: undefined,
        expressno: undefined,
        expressname: undefined,
        expressid: undefined,
        inexpressname: undefined,
        namebrand: undefined,
        strExpressDetailInfos: []
      });
    },
    resetSelfForm() {
      Object.assign(this.selfForm, {
        uid: undefined,
        orderno: undefined,
        strExpressDetailInfos: []
      });
    },
    clearValidate() {
      this.$refs.expressForm.resetFields();
    },
    clearValidateExport() {
      this.multipleSelection = [];
      this.$refs.exportForm.resetFields();
    },
    clearValidateSelf() {
      this.$refs.selfForm.resetFields();
    },
    expressChange(val) {
      this.expressForm.expressid = this.expressList.find(item => {
        return item.expressname === val;
      }).expressid;
    },
    handelSentChange() {
      const checkedData = this.orderDetailsList
        .filter(item => {
          return item.checked === true;
        })
        .map(v => {
          return { detailno: v.detailno, delivercount: v.sentNum };
        });
      if (this.isSelfSent) {
        this.selfForm.strExpressDetailInfos = checkedData;
      } else {
        this.expressForm.strExpressDetailInfos = checkedData;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loadingSend = true;
            const { code } = await handelSendGoods(this.expressForm);
            this.loadingSend = false;
            if (code === 200) {
              this.msgSuccess("发货成功");
              this.open = false;
              this.getList();
            }
          } catch (err) {
            this.loadingSend = false;
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    submitSelfForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loadingSelf = true;
            const { code } = await handelSendGoods(this.selfForm);
            this.loadingSelf = false;
            if (code === 200) {
              this.msgSuccess("发货成功");
              this.openSelf = false;
              this.getList();
            }
          } catch (err) {
            this.loadingSelf = false;
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    handleToSentList(item) {
      const { orderno, delivertype } = item;
      if (Number(delivertype) === 0) {
        this.$router.push({
          path: `/order/sent-self-list/${orderno}`
        });
      } else if (Number(delivertype) === 1) {
        this.$router.push({
          path: `/order/sent-list/${orderno}`
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    submitExportForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.multipleSelection.length > 0) {
            try {
              this.loadingExport = true;
              const { code, msg } = await handelExportExpress(
                Object.assign(this.exportForm, {
                  orderNos: this.multipleSelection
                    .map(item => item.orderno)
                    .join(",")
                })
              );
              this.loadingExport = false;
              if (code === 200) {
                this.download(msg);
                this.msgSuccess("导出成功");
                this.exportOpen = false;
              }
            } catch (err) {
              this.loadingExport = false;
              console.log(err);
            }
          } else {
            this.$confirm("导出选择订单不能为空。", "系统提示", {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning",
              customClass: "el-message-box-wran"
            });
          }
        } else {
          return false;
        }
      });
    },
    _initParams(obj) {
      const activeName = this.activeName;
      const payDateRange = this.payDateRange || [];
      const createDateRange = this.createDateRange || [];
      Object.assign(obj, {
        tradestate: activeName === "-1" ? null : activeName,
        paytimestart: payDateRange.length > 0 ? payDateRange[0] : null,
        paytimeend: payDateRange.length > 0 ? payDateRange[1] : null,
        createtimestart: createDateRange.length > 0 ? createDateRange[0] : null,
        createtimeend: createDateRange.length > 0 ? createDateRange[1] : null
      });
      return obj;
    }
  }
};
</script>