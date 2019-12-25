<template>
  <div class="order-detail-wrap app-container">
    <div class="order-detail" :loading="loading">
      <div class="statusStep">
        <div class="statusLeft">
          <p>订单号：{{params.orderno}}</p>
          <h3>{{tradestate | initTradestate}}</h3>
        </div>
        <ul class="statusRight">
          <li>
            <div class="imgIcon"></div>
            <p class="iconTitle active">买家下单</p>
            <p class="date">
              2018-03-04
              12:23:54
            </p>
          </li>
          <li class="line" v-if="ac10">
            <div class="imgLine"></div>
          </li>
          <li v-if="ac10">
            <div class="imgIcon imgIcon1"></div>
            <p class="iconTitle">买家称重</p>
            <p class="date" v-if="false">
              2018-03-04
              12:23:54
            </p>
          </li>
          <li class="line">
            <div class="imgLine gryLine"></div>
          </li>
          <li>
            <div :class="['imgIcon', 'imgIcon2',ac124?'imgIcon2-ac':'']"></div>
            <p :class="['iconTitle',ac124?'active':'']">买家付款</p>
            <p class="date" v-if="ac124">
              2018-03-04
              12:23:54
            </p>
          </li>
          <li class="line">
            <div class="imgLine gryLine"></div>
          </li>
          <li>
            <div :class="['imgIcon', 'imgIcon2',ac24?'imgIcon3-ac':'']"></div>
            <p :class="['iconTitle',ac24?'active':'']">商家发货</p>
            <p class="date" v-if="ac24">
              2018-03-04
              12:23:54
            </p>
          </li>
          <li class="line">
            <div class="imgLine gryLine"></div>
          </li>
          <li>
            <div :class="['imgIcon', 'imgIcon2',ac4?'imgIcon3-ac':'']"></div>
            <p :class="['iconTitle',ac4?'active':'']">买家确认收货</p>
            <p class="date" v-if="ac4">
              2018-03-04
              12:23:54
            </p>
          </li>
          <li class="line">
            <div class="imgLine gryLine"></div>
          </li>
          <li>
            <div class="imgIcon imgIcon5"></div>
            <p class="iconTitle">完成</p>
            <p class="date" v-if="tradestate === 4">
              2018-03-04
              12:23:54
            </p>
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
            <template>
              <div class="imgBox">
                <img src="@/assets/image/pro.png" alt />
              </div>
              <div class="content">
                <h4>
                  Disney米奇缤纷乐园保鲜盒超值两件套保鲜盒超值两
                  件套保鲜盒超值两
                </h4>
                <p>规格参数：300mm×240mm×2010mm</p>
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
          <div class="footer-left">
            <h4>物流信息</h4>
            <p>
              <b>收货人：</b>
              <span>岳云鹏</span>
            </p>
            <p>
              <b>联系方式：</b>
              <span>15810664988</span>
            </p>
            <p>
              <b>收获地址：</b>
              <span>北京市宣武区牛街183号3层406北京市</span>
            </p>
          </div>
          <div class="footer-left">
            <h4>发票信息</h4>
            <p>
              <b>发票名称：</b>
              <span>北京市宣武区牛街183号3层406北京市</span>
            </p>
            <p>
              <b>发票类型：</b>
              <span>增值税发票</span>
            </p>
            <p>
              <b>发票内容：</b>
              <span>北京市宣武</span>
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
              <span>+￥{{this.params.carriage}}</span>
            </p>
            <p>
              <b>应付总价：</b>
              <span>￥{{this.params.needprice}}</span>
            </p>
            <p class="total">
              <b>实付总价：</b>
              <span>￥{{this.params.realprice}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="商品称重" :visible.sync="openWeight" width="530px">
      <el-form ref="weightForm" :model="weightForm" :rules="weightFormRules" label-width="140px">
        <div class="goods-info">
          <span>
            商品毛重：
            <b>{{weightForm.grossweight}}{{weightForm.unit}}</b>；
          </span>
          <span>
            商品净重：
            <b>{{weightForm.netweight}}{{weightForm.unit}}</b>；
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitWeightForm('weightForm')">确 定</el-button>
        <el-button @click="openWeight = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderDetail } from "@/api/order";
import { decrypt } from "@/utils";
export default {
  name: "orderDetail",
  data() {
    const patter = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
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
    return {
      openWeight: false,
      loading: false,
      weightForm: {
        grossweight: "", //毛重
        netweight: "", //净重
        unit: "", //单位
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
        weighedCtp: "" //称重后用户价格（称重后商品价格*折扣*商品数量-优惠金额）
      },
      weightFormRules: {
        weighedGw: [{ validator: validateWeight, trigger: ["blur", "change"] }],
        weighedNw: [{ validator: validateOther, trigger: ["blur", "change"] }],
        weighedCp: [{ validator: validateOther, trigger: ["blur", "change"] }],
        weighedCtp: [{ validator: validateOther, trigger: ["blur", "change"] }]
      },
      goodsList: [],
      params: {},
      tradestate: "",
      totalNum: "",
      totalPrice: ""
    };
  },
  watch: {
    "weightForm.weighedGw"(val) {
      const {
        unitprice,
        frameWeight,
        discount,
        couponprice,
        cmdtcount
      } = this.weightForm;
      const patter = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
      if ((val && patter.test(val), val > frameWeight)) {
        Object.assign(this.weightForm, {
          weighedNw: (Number(val) - frameWeight).toFixed(2),
          weighedCp: ((Number(val) - frameWeight) * unitprice).toFixed(2),
          weighedCtp: (
            (Number(val) - frameWeight) * unitprice * discount * cmdtcount -
            couponprice
          ).toFixed(2)
        });
      } else {
        Object.assign(this.weightForm, {
          weighedNw: "",
          weighedCp: "",
          weighedCtp: ""
        });
      }
    }
  },
  filters: {
    initTradestate(val) {
      const arr = [
        "待买家付款",
        "待商家发货",
        "待买家确认收货",
        "物流派件中",
        "交易成功",
        "交易关闭",
        "",
        "",
        "",
        "",
        "待买家称重"
      ];
      return arr[val];
    }
  },
  computed: {
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
    this.params = JSON.parse(decrypt(this.$route.params.code));
    this.getDetail();
  },
  methods: {
    reset() {
      Object.assign(this.weightForm, {
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
        weighedCtp: "" //称重后用户价格（称重后商品价格*折扣*商品数量-优惠金额）
      });
    },
    async getDetail() {
      try {
        this.loading = true;
        const { code, data } = await getOrderDetail({
          orderno: this.params.orderno
        });
        this.loading = false;
        if (code === 200) {
          this.goodsList = data;
          this.tradestate = Number(data[0].tradestate);
          this.totalNum = data.reduce((pre, item) => {
            pre += Number(item.cmdtcount);
            return pre;
          }, 0);
          this.totalPrice = data.reduce((pre, item) => {
            pre += Number(item.cmdttotalprice);
            return pre;
          }, 0);
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    handelWeight() {
      const item = {
        grossweight: "30", //毛重
        netweight: "20", //净重
        unit: "kg",
        cmdtprice: "100", //商品现价
        cmdttotalprice: "150", //用户价格（商品总价格）
        discount: "0.8", //折扣
        couponprice: "10", //优惠金额
        cmdtcount: "2" //数量
      };
      this.reset();
      const {
        grossweight,
        netweight,
        unit,
        cmdtprice,
        cmdttotalprice,
        discount,
        couponprice,
        cmdtcount
      } = item;
      Object.assign(this.weightForm, {
        grossweight: Number(grossweight), //毛重
        netweight: Number(netweight), //净重
        cmdtprice: Number(cmdtprice), //商品现价
        cmdttotalprice: Number(cmdttotalprice), //用户价格（商品总价格）
        discount: Number(discount), //折扣
        couponprice: Number(couponprice), //优惠金额
        cmdtcount: Number(cmdtcount), //数量
        unitprice: Number(cmdtprice) / Number(netweight), //单价
        frameWeight: Number(grossweight) - Number(netweight), //框重
        unit,
        weighedGw: "", //称重后毛重
        weighedNw: "", //称重后净重（毛重-框重）
        weighedCp: "", //称重后商品价格（净重*单价）
        weighedCtp: "" //称重后用户价格（称重后商品价格*折扣*商品数量-优惠金额）
      });
      this.openWeight = true;
      this.$refs["weightForm"].clearValidate();
    },
    submitWeightForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loading = true;
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