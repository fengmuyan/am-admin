<template>
  <div class="order-detail-wrap app-container">
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
            <p class="date" v-if="ac24">{{failuretime}}</p>
          </li>
          <li class="line">
            <div class="imgLine gryLine"></div>
          </li>
          <li>
            <div :class="['imgIcon', 'imgIcon4',ac4?'imgIcon4-ac':'']"></div>
            <p :class="['iconTitle',ac4?'active':'']">买家确认收货</p>
            <p class="date" v-if="ac4"></p>
          </li>
          <li class="line">
            <div class="imgLine gryLine"></div>
          </li>
          <li>
            <div :class="['imgIcon', 'imgIcon5',ac4?'imgIcon5-ac':'']"></div>
            <p :class="['iconTitle',ac4?'active':'']">完成</p>
            <p class="date" v-if="ac4"></p>
          </li>
          <li class="line" v-if="tradestate === 5">
            <div class="imgLine gryLine"></div>
          </li>
          <li v-if="tradestate === 5">
            <div class="imgIcon imgIcon6"></div>
            <p class="iconTitle">已取消</p>
            <p class="date">
              2018-03-04
              12:23:54
            </p>
          </li>
        </ul>
      </div>
      <div class="goodsList">
        <el-table :data="goodsList" class="goodsTable">
          <el-table-column label="商品信息" width="485">
            <template slot-scope="scope">
              <div class="imgBox">
                <img :src="scope.row.image" alt />
              </div>
              <div class="content">
                <h4>{{scope.row.title}}</h4>
                <p>{{scope.row.standards}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="cmdtprice" />
          <el-table-column label="数量" prop="cmdtcount" />
          <el-table-column label="优惠" prop="couponprice" />
          <el-table-column label="折扣" prop="discount" />
          <el-table-column label="总价" prop="cmdttotalprice" />
          <el-table-column label="状态" width="250px">
            <template slot-scope="scope">
              <div class="weight-box">
                <span>{{scope.row.tradestate | initTradestate}}</span>
                <el-button
                  type="text"
                  v-if="Number(scope.row.tradestate) === 10"
                  icon="el-icon-odometer"
                  @click="handelWeight(scope.row)"
                >前往称重</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="goodsFooter">
          <div class="footer-left" v-if="delivertype !==0">
            <h4>物流信息</h4>
            <p>
              <b>收货人：</b>
              <span>{{deliveryAddress.name}}</span>
            </p>
            <p>
              <b>联系方式：</b>
              <span>{{deliveryAddress.phone}}</span>
            </p>
            <p>
              <b>收获地址：</b>
              <span>{{deliveryAddress.area}}{{deliveryAddress.address}}</span>
            </p>
          </div>
          <div class="footer-left" v-if="invocetype !==0">
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
          <div class="footer-mid"></div>
          <div class="footer-right">
            <p>
              <b class="totalGoods">
                共
                <span>{{totalNum}}</span>件商品
              </b>
              <b>商品总价：</b>
              <span>￥{{totalPrice}}</span>
            </p>
            <p>
              <b>运费（快递）：</b>
              <span>+￥{{carriage}}</span>
            </p>
            <p>
              <b>应付总价：</b>
              <span>￥{{needprice}}</span>
            </p>
            <p class="total">
              <b>实付总价：</b>
              <span>￥{{realprice}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="商品称重" :visible.sync="openWeight" width="580px">
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
            商品现价：
            <b>￥{{weightForm.cmdtprice}}</b>；
          </span>
          <span>
            用户价格：
            <b>￥{{weightForm.cmdttotalprice}}</b>；
          </span>
        </div>
        <el-form-item label="称重后毛重：" prop="weighedGw">
          <el-input v-model="weightForm.weighedGw" placeholder="请输入毛重" />
        </el-form-item>
        <el-form-item label="称重后净重：" prop="weighedNw">
          <el-input v-model="weightForm.weighedNw" disabled placeholder="由计算得出" />
        </el-form-item>
        <el-form-item label="称重后价格：" prop="weighedCp">
          <el-input v-model="weightForm.weighedCp" disabled placeholder="由计算得出" />
        </el-form-item>
        <el-form-item label="称重后用户价格：" prop="weighedCtp">
          <el-input v-model="weightForm.weighedCtp" disabled placeholder="由计算得出" />
        </el-form-item>
        <el-form-item label="微调后价格：" prop="adjustedprice">
          <el-input v-model="weightForm.adjustedprice" placeholder="微调后价格" />
          <div class="tip">* 可以根据称重后用户价格微调取整，上下浮动不超于10。</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitWeightForm('weightForm')">确 定</el-button>
        <el-button @click="openWeight = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderDetail, orderWeight } from "@/api/order";
export default {
  name: "orderDetail",
  data() {
    const patter = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    const patterInt = /^\+?[1-9]\d*$/;
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
    return {
      openWeight: false,
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
        adjustedprice: ""
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
      goodsList: null,
      tradestate: "",
      totalNum: "",
      totalPrice: "",
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
      weighttime: "2019-12-28 14:29:14",
      paytime: "",
      failuretime: ""
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
      if (Number(val) === grossweight) {
        Object.assign(this.weightForm, {
          weighedNw: netweight,
          weighedCp: cmdtprice,
          weighedCtp: cmdttotalprice,
          adjustedprice: cmdttotalprice
        });
      }
      if ((val && patter.test(val), val > frameWeight)) {
        const weighedNw = Number(val) - frameWeight;
        const weighedCp = ((Number(val) - frameWeight) * unitprice).toFixed(2);
        const weighedCtp = (
          (weighedCp * discount).toFixed(2) * cmdtcount -
          couponprice
        ).toFixed(2);
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
        "",
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
    }
  },
  computed: {
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
            failuretime
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
          this.failuretime = failuretime;
          this.totalNum = cmdtOrderDetailRespList.reduce((pre, item) => {
            pre += Number(item.cmdtcount);
            return pre;
          }, 0);
          this.totalPrice = cmdtOrderDetailRespList
            .reduce((pre, item) => {
              pre += Number(item.cmdttotalprice);
              return pre;
            }, 0)
            .toFixed(2);
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
        cmdtcount
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
        unitprice: Number(cmdtprice) / Number(netweight), //单价
        frameWeight: Number(grossweight) - Number(netweight), //框重
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
    }
  }
};
</script>