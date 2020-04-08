<template>
  <div class="order-detail-wrap app-container wipe">
    <div class="order-detail" v-loading="loading" v-if="goodsList">
      <div class="statusStep">
        <div class="statusLeft">
          <p>订单号：{{orderno}}</p>
          <h3>{{tradestate | initTradestate}}</h3>
        </div>
        <ul class="statusRight">
          <li>
            <div class="imgIcon"></div>
            <p class="iconTitle active">买家下单</p>
            <p class="date">{{createtime}}</p>
          </li>
          <ul class="f-l" v-if="!ac5 && !ac6">
            <li class="line" v-if="ordertype===1">
              <div class="imgLine"></div>
            </li>
            <li v-if="ordertype===1">
              <div :class="['imgIcon', 'imgIcon1',ac12411?'imgIcon1-ac':'']"></div>
              <p :class="['iconTitle',ac12411?'active':'']">商家称重</p>
              <p class="date" v-if="ac12411">{{weighttime}}</p>
            </li>
            <li class="line">
              <div class="imgLine gryLine"></div>
            </li>
            <li>
              <div :class="['imgIcon', 'imgIcon2',ac124?'imgIcon2-ac':'']"></div>
              <p :class="['iconTitle',ac124?'active':'']">买家付款</p>
              <p class="date" v-if="ac124">{{paytime}}</p>
            </li>
            <li class="line">
              <div class="imgLine gryLine"></div>
            </li>
            <li>
              <div :class="['imgIcon', 'imgIcon3',ac24?'imgIcon3-ac':'']"></div>
              <p :class="['iconTitle',ac24?'active':'']">商家发货</p>
              <p class="date" v-if="ac24">{{deliverytime}}</p>
            </li>
            <li class="line">
              <div class="imgLine gryLine"></div>
            </li>
            <li class="lang-item">
              <div :class="['imgIcon', 'imgIcon4',ac4?'imgIcon4-ac':'']"></div>
              <p :class="['iconTitle',ac4?'active':'']">买家确认收货</p>
              <p class="date" v-if="ac4">{{receivetime}}</p>
            </li>
            <li class="line">
              <div class="imgLine gryLine"></div>
            </li>
            <li>
              <div :class="['imgIcon', 'imgIcon5',ac4?'imgIcon5-ac':'']"></div>
              <p :class="['iconTitle',ac4?'active':'']">完成</p>
              <p class="date" v-if="ac4">{{finaltime}}</p>
            </li>
          </ul>
          <ul class="f-l" v-if="ac5">
            <li class="line" v-if="ordertype===1 && weighttime">
              <div class="imgLine"></div>
            </li>
            <li v-if="ordertype===1 && weighttime">
              <div class="imgIcon imgIcon1 imgIcon1-ac"></div>
              <p class="iconTitle active">商家称重</p>
              <p class="date">{{weighttime}}</p>
            </li>
            <li class="line">
              <div class="imgLine gryLine"></div>
            </li>
            <li>
              <div class="imgIcon imgIcon6-ac"></div>
              <p class="iconTitle active">已关闭</p>
              <p class="date">{{finaltime}}</p>
            </li>
          </ul>
          <ul class="f-l" v-if="ac6">
            <li class="line" v-if="ordertype===1 && weighttime">
              <div class="imgLine"></div>
            </li>
            <li v-if="ordertype===1 && weighttime">
              <div class="imgIcon imgIcon1 imgIcon1-ac"></div>
              <p class="iconTitle active">商家称重</p>
              <p class="date">{{weighttime}}</p>
            </li>
            <li class="line">
              <div class="imgLine gryLine"></div>
            </li>
            <li>
              <div class="imgIcon imgIcon7-ac"></div>
              <p class="iconTitle active">已失效</p>
              <p class="date">{{failuretime}}</p>
            </li>
          </ul>
        </ul>
      </div>
      <div class="goodsList">
        <el-table :data="goodsList" class="goodsTable">
          <el-table-column label="商品信息" width="460">
            <template slot-scope="scope">
              <div class="imgBox">
                <img :src="scope.row.image" alt />
              </div>
              <div class="content">
                <h4>{{scope.row.title}}</h4>
                <p>
                  <span class="agent-pro" v-if="scope.row.isagent==='Y'">代卖商品，</span>
                  {{scope.row.standards.substring(0,scope.row.standards.length-1)}}。
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="价格/件" prop="cmdtprice" />
          <el-table-column label="数量" prop="cmdtcount" />
          <el-table-column label="折扣" prop="discount">
            <template slot-scope="scope">{{scope.row.discount | initDiscount}}</template>
          </el-table-column>
          <el-table-column label="优惠" prop="couponprice" />
          <el-table-column label="抹零" prop="dispelprice" />
          <el-table-column label="抹账" prop="wipeaccountsprice">
            <template slot-scope="scope">
              <el-popover placement="top-start" title="抹账" width="220" trigger="hover">
                <div>
                  <p style="margin:0;line-height:22px">已还：{{scope.row.payamount}}</p>
                  <p style="margin:0;line-height:22px">备注：{{scope.row.remarks}}</p>
                </div>
                <span slot="reference">{{scope.row.wipeaccountsprice}}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="总价" prop="cmdttotalprice" />
          <el-table-column label="状态" width="120px">
            <template slot-scope="scope">
              <span>{{scope.row.tradestate | initTradestate}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220px" v-if="isShowAction">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="Number(scope.row.tradestate)===10"
                icon="el-icon-odometer"
                style="margin-right:4px"
                @click="handelWeight(scope.row)"
              >前往称重</el-button>
              <el-button
                type="text"
                v-if="Number(scope.row.tradestate)===0 || Number(scope.row.tradestate)===10 || Number(scope.row.tradestate)===11"
                icon="el-icon-edit-outline"
                @click="handelAdjust(scope.row)"
              >调价</el-button>
              <el-button
                type="text"
                v-if="wipeAction"
                icon="el-icon-edit-outline"
                @click="handelWipe(scope.row)"
              >抹账</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="goodsFooter">
          <div class="footer-right">
            <p>
              <b class="totalGoods">
                共
                <span>{{totalNum}}</span>件商品
              </b>
              <b>商品总价：</b>
              <span>￥{{orderamount}}</span>
            </p>
            <p>
              <b>总优惠金额：</b>
              <span>￥{{totalAdjustPrice}}</span>
            </p>
            <p>
              <b>总抹零金额：</b>
              <span>￥{{totalWeightPrice}}</span>
            </p>
            <p>
              <b>总抹账金额：</b>
              <span>￥{{totalWipePrice}}</span>
            </p>
            <p>
              <b>运费（快递）：</b>
              <span>￥{{carriage}}</span>
            </p>
            <p>
              <b>应付总价：</b>
              <span>￥{{needprice}}</span>
            </p>
            <p>
              <b>已支付：</b>
              <span>￥{{ac1234?needprice:0}}</span>
            </p>
            <p class="total">
              <b>资金付款：</b>
              <span>￥{{realprice}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="footer-left" v-if="delivertype !==0">
          <h4>收货人信息</h4>
          <p>
            <b>收货人：</b>
            <span>{{deliveryAddress.name}}</span>
          </p>
          <p>
            <b>联系方式：</b>
            <span>{{deliveryAddress.phone}}</span>
          </p>
          <p>
            <b>收货地址：</b>
            <span>{{deliveryAddress.province}}{{deliveryAddress.city}}{{deliveryAddress.area}}{{deliveryAddress.address}}</span>
          </p>
        </div>
        <div class="footer-left" style="border:none" v-if="invocetype !==0">
          <h4>发票信息</h4>
          <p>
            <b>发票抬头：</b>
            <span>{{Number(invoceInfo.owner === 1)?invoceInfo.name:invoceInfo.company}}</span>
          </p>
          <p>
            <b>发票类型：</b>
            <span>{{invoceInfo.type | initInvoce}}</span>
          </p>
          <p>
            <b>发票税号：</b>
            <span>{{invoceInfo.taxno}}</span>
          </p>
        </div>
      </div>
    </div>
    <el-dialog title="商品称重" :visible.sync="openWeight" width="600px">
      <el-form :model="weightForm" ref="weightForm" :rules="weightFormRules" label-width="140px">
        <div class="goods-info">
          <span>
            商品毛重（{{weightForm.weightunit}}）：
            <b>{{weightForm.grossweight}}</b>；
          </span>
          <span>
            商品净重（{{weightForm.weightunit}}）：
            <b>{{weightForm.netweight}}</b>；
          </span>
          <span>
            商品单价：
            <b>￥{{weightForm.cmdtprice}}</b>；
          </span>
          <span>
            折扣：
            <b>{{weightForm.discount | initDiscount}}</b>；
          </span>
          <span>
            数量：
            <b>{{weightForm.cmdtcount}}</b>；
          </span>
          <span>
            商品总价：
            <b>￥{{weightForm.cmdttotalprice}}</b>；
          </span>
          <span>
            优惠价格：
            <b>￥{{weightForm.couponprice}}</b>；
          </span>
        </div>
        <el-form-item label="称重后毛重：" prop="weighedGw">
          <el-input maxlength="6" v-model="weightForm.weighedGw" placeholder="请输入毛重" />
        </el-form-item>
        <el-form-item label="称重后净重：" prop="weighedNw">
          <el-input v-model="weightForm.weighedNw" disabled placeholder="由计算得出" />
        </el-form-item>
        <el-form-item label="商品总价：" prop="weighedCp">
          <el-input v-model="weightForm.weighedCp" disabled placeholder="由计算得出" />
        </el-form-item>
        <el-form-item label="称重后订单总价：" prop="weighedCtp">
          <el-input v-model="weightForm.weighedCtp" disabled placeholder="由计算得出" />
        </el-form-item>
        <el-form-item label="订单确认总价：" prop="adjustedprice">
          <el-input maxlength="6" v-model="weightForm.adjustedprice" placeholder="确认价格" />
          <div class="tip">* 确认价格可抹零，与称重后用户价格上下相差不能超过10元</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openWeight = false">取 消</el-button>
        <el-button type="primary" @click="submitWeightForm('weightForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="抹账" :visible.sync="openWipe" @close="clearValidateWipe" width="550px">
      <el-form :model="wipeForm" ref="wipeForm" :rules="wipeFormRules" label-width="120px">
        <el-form-item label="抹账金额" prop="wipeAccounts">
          <el-input
            v-model="wipeForm.wipeAccounts"
            :placeholder="`抹账金额（最大可抹账：${this.wipeForm.pendingAmount}）`"
            maxlength="20"
            style="width:330px"
          ></el-input>
        </el-form-item>
        <div
          style="line-height: 35px;color: rgb(200,200,200);padding-left: 120px;"
        >将为你手机号{{numberInit}}发送验证码，请注意查收。</div>
        <el-form-item label="短信验证" prop="smsCode" class="code-item">
          <el-input v-model="wipeForm.smsCode" maxlength="6" placeholder="输入验证码" class="code-input"></el-input>
          <ge-code :config="configSelf" ref="geCodeSelf" class="code-btn"></ge-code>
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input
            type="textarea"
            v-model="wipeForm.remarks"
            placeholder="请输入备注"
            maxlength="255"
            show-word-limit
            style="width:330px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openWipe = false">取 消</el-button>
        <el-button type="primary" :loading="loadingWipe" @click="submitWipeForm('wipeForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderDetail,
  orderWeight,
  handelEditPrice,
  handelWipeSendCode,
  handelWipeAccounts
} from "@/api/order";
import { accMull, subtr, accAdd } from "@/utils";
import geCode from "vue-gecode";
import { mapGetters } from "vuex";
export default {
  name: "orderDetail",
  components: {
    geCode
  },
  data() {
    const patter = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    const patterInt = /^\+?[1-9]\d*$/;
    const patterAmount = /(^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/;

    const validateWeight = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("毛重不能为空！"));
      }
      if (!patter.test(value)) {
        callback(new Error("必须非负整数或至多保留两位小数！"));
      } else if (!(value > this.weightForm.frameWeight)) {
        callback(new Error("毛重必须大于筐重"));
      } else {
        callback();
      }
    };
    const validateOther = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("选项不能为空！"));
      }
      if (!patter.test(value)) {
        callback(new Error("必须非负整数或至多保留两位小数！"));
      } else {
        callback();
      }
    };
    const validateAdjust = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("调整后价格不能为空！"));
      }
      if (value === this.weightForm.weighedCtp) {
        callback();
      }
      if (!patterInt.test(value)) {
        callback(new Error("价格调整后必须为整数！"));
      } else {
        if (Math.abs(value - this.weightForm.weighedCtp) > 10) {
          callback(new Error("上下浮动不能大于10！"));
        }
        callback();
      }
    };
    const validateAmount = (rule, value, callback) => {
      if (!patterAmount.test(value)) {
        callback(new Error("最多保留两位小数！"));
      } else if (Number(value) > Number(this.wipeForm.pendingAmount)) {
        callback(
          new Error(
            `抹账金额不能大于最大抹账金额（${this.wipeForm.pendingAmount}）！`
          )
        );
      } else {
        callback();
      }
    };
    return {
      openWeight: false,
      openWipe: false,

      loadingWipe: false,
      loading: false,
      weightForm: {
        uid: "",
        orderno: "",
        detailno: "",
        weightunit: "", //单位
        grossweight: "", //毛重
        netweight: "", //净重
        cmdtprice: "", //商品现价
        cmdttotalprice: "", //用户价格（商品总价格）
        discount: "", //折扣
        couponprice: "", //优惠金额
        cmdtcount: "", //数量
        unitprice: "", //单价
        frameWeight: "", //筐重
        weighedGw: "", //称重后毛重
        weighedNw: "", //称重后净重（毛重-筐重）
        weighedCp: "", //称重后商品价格（净重*单价）
        weighedCtp: "", //称重后用户价格（称重后商品价格*折扣*商品数量-优惠金额）
        adjustedprice: "" //取整后价格
      },
      weightFormRules: {
        weighedGw: [
          {
            required: true,
            validator: validateWeight,
            trigger: ["blur", "change"]
          }
        ],
        weighedNw: [
          {
            required: true,
            validator: validateOther,
            trigger: ["blur", "change"]
          }
        ],
        weighedCp: [
          {
            required: true,
            validator: validateOther,
            trigger: ["blur", "change"]
          }
        ],
        weighedCtp: [
          {
            required: true,
            validator: validateOther,
            trigger: ["blur", "change"]
          }
        ],
        adjustedprice: [
          {
            required: true,
            validator: validateAdjust,
            trigger: ["blur", "change"]
          }
        ]
      },

      configSelf: {
        startText: "获取验证码",
        endText: "再次获取",
        totalTime: 60,
        tickTime: 1,
        todo: async () => {
          try {
            const { orderno, wipeAccounts } = this.wipeForm;
            const { code } = await handelWipeSendCode({
              orderno,
              wipeAccounts
            });
            if (code === 200) {
              return true;
            } else {
              this.msgError("短信发送失败！");
            }
          } catch (e) {
            this.$refs.geCodeSelf.stop(1);
            console.log(e);
          }
        },
        computeText(num) {
          return "重新获取 " + num + "s";
        }
      },

      wipeForm: {
        orderno: undefined,
        detailno: undefined,
        pendingAmount: undefined,
        wipeAccounts: undefined,
        smsCode: undefined,
        remarks: undefined
      },
      wipeFormRules: {
        wipeAccounts: [
          { validator: validateAmount, required: true, trigger: "blur" }
        ],
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },

      goodsList: null,
      tradestate: "",
      paytype: "",
      paystate: "",
      totalNum: "",
      orderno: "",
      carriage: "",
      needprice: "",
      realprice: "",
      ordertype: "",
      invocetype: "",
      delivertype: "",
      deliveryAddress: null,
      invoceInfo: null,
      createtime: "",
      weighttime: "",
      paytime: "",
      deliverytime: "",
      receivetime: "",
      finaltime: "",
      failuretime: "",
      orderamount: 0,
      totalAdjustPrice: 0,
      totalWeightPrice: 0,
      totalWipePrice: 0
    };
  },
  watch: {
    "weightForm.weighedGw"(val) {
      const {
        grossweight,
        netweight,
        cmdtprice,
        cmdttotalprice,
        unitprice,
        frameWeight,
        discount,
        couponprice,
        cmdtcount
      } = this.weightForm;
      const patter = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
      if (val && patter.test(val) && val > frameWeight) {
        const weighedNw = subtr(Number(val), frameWeight);
        const weighedCp = accMull(weighedNw, unitprice);
        const weighedCtp = subtr(
          accMull(accMull(weighedCp, discount), cmdtcount),
          couponprice
        );
        Object.assign(this.weightForm, {
          weighedNw,
          weighedCp,
          weighedCtp,
          adjustedprice: weighedCtp
        });
      } else {
        Object.assign(this.weightForm, {
          weighedNw: "",
          weighedCp: "",
          weighedCtp: "",
          adjustedprice: ""
        });
      }
    }
  },
  filters: {
    initTradestate(val) {
      const arr = [
        "待付款",
        "待发货",
        "待确认收货",
        "物流派件中",
        "已完成",
        "已关闭",
        "已失效",
        "",
        "",
        "",
        "待称重",
        "已称重，待付款"
      ];
      return arr[val];
    },
    initInvoce(type) {
      const arr = ["", "普通发票", "增值税发票"];
      return arr[type];
    },
    initDiscount(val) {
      if (!val) return "";
      if (val === 1) {
        return "无折扣";
      } else {
        return `${Number(val) * 100}折`;
      }
    }
  },
  computed: {
    ...mapGetters(["userNumber"]),
    numberInit() {
      return (
        this.userNumber.substring(0, 3) +
        "*****" +
        this.userNumber.substring(this.userNumber.length - 2)
      );
    },
    ac12411() {
      const tradestate = this.tradestate;
      return (
        tradestate === 11 ||
        tradestate === 1 ||
        tradestate === 2 ||
        tradestate === 4
      );
    },
    ac124() {
      const tradestate = this.tradestate;
      return tradestate === 1 || tradestate === 2 || tradestate === 4;
    },
    ac24() {
      const tradestate = this.tradestate;
      return tradestate === 2 || tradestate === 4;
    },
    ac4() {
      return this.tradestate === 4;
    },
    ac10() {
      return this.tradestate === 10;
    },
    ac5() {
      return this.tradestate === 5;
    },
    ac6() {
      return this.tradestate === 6;
    },
    ac01011() {
      const tradestate = this.tradestate;
      return tradestate === 0 || tradestate === 10 || tradestate === 11;
    },
    ac23() {
      return this.tradestate === 2 || this.tradestate === 3;
    },
    ac1234() {
      const tradestate = this.tradestate;
      return (
        tradestate === 1 ||
        tradestate === 2 ||
        tradestate === 3 ||
        tradestate === 4
      );
    },
    wipeAction() {
      const { tradestate, paytype, paystate } = this;
      return (
        Number(paytype) === 1 &&
        Number(paystate) === 0 &&
        (Number(tradestate) === 1 ||
          Number(tradestate) === 2 ||
          Number(tradestate) === 3 ||
          Number(tradestate) === 4)
      );
    },
    isShowAction() {
      const { tradestate, paystate } = this;
      return !(
        Number(tradestate) === 5 ||
        Number(tradestate) === 6 ||
        Number(paystate) === 1
      );
    }
  },
  created() {
    this.orderno = this.$route.params.code;
    this.getDetail();
  },
  methods: {
    reset() {
      Object.assign(this.weightForm, {
        uid: "",
        orderno: "",
        detailno: "",
        weightunit: "",
        grossweight: "", //毛重
        netweight: "", //净重
        cmdtprice: "", //商品现价
        cmdttotalprice: "", //用户价格（商品总价格）
        discount: "", //折扣
        couponprice: "", //优惠金额
        cmdtcount: "", //数量
        unitprice: "", //单价
        frameWeight: "", //筐重
        weighedGw: "", //称重后毛重
        weighedNw: "", //称重后净重（毛重-筐重）
        weighedCp: "", //称重后商品价格（净重*单价）
        weighedCtp: "", //称重后用户价格（称重后商品价格*折扣*商品数量-优惠金额）
        adjustedprice: ""
      });
    },
    async getDetail() {
      try {
        this.loading = true;
        const {
          code,
          data: {
            tradestate,
            cmdtOrderDetailRespList,
            carriage,
            needprice,
            realprice,
            ordertype,
            invocetype,
            delivertype,
            orderDeliveryAddressResp: deliveryAddress,
            orderInvoceResp: invoceInfo,
            createtime,
            paytime,
            deliverytime,
            weighttime,
            receivetime,
            finaltime,
            failuretime,
            orderamount,
            paytype,
            paystate
          }
        } = await getOrderDetail({
          orderno: this.orderno
        });
        this.loading = false;
        if (code === 200) {
          this.goodsList = cmdtOrderDetailRespList;
          this.tradestate = tradestate;
          this.carriage = carriage;
          this.needprice = needprice;
          this.realprice = realprice;
          this.ordertype = Number(ordertype);
          this.invocetype = Number(invocetype);
          this.delivertype = Number(delivertype);
          this.deliveryAddress = deliveryAddress;
          this.invoceInfo = invoceInfo;
          this.createtime = createtime;
          this.paytime = paytime;
          this.deliverytime = deliverytime;
          this.weighttime = weighttime;
          this.receivetime = receivetime;
          this.finaltime = finaltime;
          this.failuretime = failuretime;
          this.orderamount = orderamount;
          this.paytype = paytype;
          this.paystate = paystate;

          this.totalNum = cmdtOrderDetailRespList.reduce((pre, item) => {
            pre += Number(item.cmdtcount);
            return pre;
          }, 0);

          this.totalAdjustPrice = cmdtOrderDetailRespList.reduce(
            (pre, item) => {
              pre = accAdd(pre, Number(item.couponprice));
              return pre;
            },
            0
          );

          this.totalWeightPrice = cmdtOrderDetailRespList.reduce(
            (pre, item) => {
              pre = accAdd(pre, Number(item.dispelprice));
              return pre;
            },
            0
          );

          this.totalWipePrice = cmdtOrderDetailRespList.reduce((pre, item) => {
            pre = accAdd(pre, Number(item.wipeaccountsprice));
            return pre;
          }, 0);

          cmdtOrderDetailRespList.forEach(item => {
            Object.assign(item, {
              standards: JSON.parse(item.saleprovalue).salepro.reduce(
                (pre, v) => {
                  if (typeof v.values === "object") {
                    pre += `${v.name}：${v.values.value}，`;
                  } else if (typeof v.values === "string") {
                    pre += `${v.name}：${v.values}，`;
                  }
                  return pre;
                },
                ""
              )
            });
          });
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    handelWeight(item) {
      this.reset();
      const {
        uid,
        orderno,
        detailno,
        weightunit,
        grossweight,
        netweight,
        cmdtprice,
        cmdttotalprice,
        discount,
        couponprice,
        cmdtcount,
        unitprice
      } = item;
      Object.assign(this.weightForm, {
        uid,
        orderno,
        detailno,
        weightunit,
        grossweight: Number(grossweight), //毛重
        netweight: Number(netweight), //净重
        cmdtprice: Number(cmdtprice), //商品现价
        cmdttotalprice: Number(cmdttotalprice), //用户价格（商品总价格）
        discount: Number(discount), //折扣
        couponprice: Number(couponprice), //优惠金额
        cmdtcount: Number(cmdtcount), //数量
        unitprice: Number(unitprice), //单价
        frameWeight: subtr(Number(grossweight), Number(netweight)), //框重
        weighedGw: "", //称重后毛重
        weighedNw: "", //称重后净重（毛重-框重）
        weighedCp: "", //称重后商品价格（净重*单价）
        weighedCtp: "" //称重后用户价格（称重后商品价格*折扣*商品数量-优惠金额）
      });
      this.openWeight = true;
      if (this.$refs["weightForm"]) {
        this.$refs["weightForm"].resetFields();
      }
    },
    resetWipeForm() {
      Object.assign(this.wipeForm, {
        orderno: undefined,
        needprice: undefined,
        wipeAccounts: undefined,
        smsCode: undefined,
        remarks: undefined
      });
    },
    clearValidateWipe() {
      this.$refs.wipeForm.resetFields();
    },
    handelWipe(item) {
      this.resetWipeForm();
      if (this.$refs.geCodeSelf) {
        this.$refs.geCodeSelf.stop(1);
      }
      Object.assign(this.wipeForm, {
        orderno: item.orderno,
        detailno: item.detailno,
        pendingAmount: item.pendingAmount,
        remarks: item.remarks
      });
      this.openWipe = true;
    },
    submitWipeForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loadingWipe = true;
            const {
              orderno,
              detailno,
              wipeAccounts,
              smsCode,
              remarks
            } = this.wipeForm;
            const { code } = await handelWipeAccounts({
              orderno,
              detailno,
              wipeAccounts,
              smsCode,
              remarks
            });
            this.loadingWipe = false;
            if (code === 200) {
              this.getDetail();
              this.openWipe = false;
              this.msgSuccess("抹账成功");
            }
          } catch (err) {
            this.loadingWipe = false;
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    submitWeightForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loading = true;
            const {
              uid,
              orderno,
              detailno,
              weighedGw: grossweight,
              weighedNw: netweight,
              weighedCp: cmdtprice,
              weighedCtp: cmdttotalprice,
              adjustedprice
            } = this.weightForm;
            const { code } = await orderWeight({
              uid,
              orderno,
              detailno,
              grossweight,
              netweight,
              cmdtprice,
              cmdttotalprice,
              adjustedprice
            });
            this.loading = false;
            if (code === 200) {
              this.getDetail();
              this.openWeight = false;
              this.msgSuccess("称重成功");
            }
          } catch (err) {
            this.loading = false;
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    handelAdjust(item) {
      const { cmdttotalprice, detailno, orderno } = item;
      this.$prompt("请输入优惠价格", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: val => {
          if (val === "" || val === null) {
            return "价格不能为空";
          } else {
            if (!/(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/.test(val)) {
              return "价格为大于零且最多保留两位小数的数字";
            } else if (Number(val) > Number(cmdttotalprice)) {
              return "价格不能大于商品总价";
            } else {
              return true;
            }
          }
        }
      })
        .then(async ({ value }) => {
          try {
            const { code } = await handelEditPrice({
              detailno,
              orderno,
              couponprice: value
            });
            if (code === 200) {
              this.getDetail();
              this.msgSuccess("调价成功");
            }
          } catch (err) {
            console.log(err);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>