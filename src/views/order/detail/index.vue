<template>
  <div class="app-container">
    <div class="order-detail" :loading="loading">
      <div class="statusStep">
        <div class="statusLeft">
          <p>订单号：{{params.orderno}}</p>
          <h3>{{tradestate | initTradestate}}</h3>
          <!-- <ul>
          <li>订单号：ljk58425625255llk</li>
          <li>创建日期：2019-10-23 10:20:33</li>
          <li></li>
          </ul>-->
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
          <li class="line">
            <div class="imgLine"></div>
          </li>
          <li>
            <div class="imgIcon imgIcon6"></div>
            <p class="iconTitle">买家称重</p>
          </li>
          <li class="line">
            <div class="imgLine gryLine"></div>
          </li>
          <li>
            <div class="imgIcon imgIcon2"></div>
            <p class="iconTitle">买家付款</p>
          </li>
          <li class="line">
            <div class="imgLine gryLine"></div>
          </li>
          <li>
            <div class="imgIcon imgIcon3"></div>
            <p class="iconTitle">商家发货</p>
          </li>
          <li class="line">
            <div class="imgLine gryLine"></div>
          </li>
          <li>
            <div class="imgIcon imgIcon5"></div>
            <p class="iconTitle">买家确认收货</p>
          </li>
          <li class="line">
            <div class="imgLine gryLine"></div>
          </li>
          <li>
            <div class="imgIcon imgIcon4"></div>
            <p class="iconTitle">完成</p>
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
                  v-if="scope.row.tradestate === '6'"
                  icon="el-icon-odometer"
                  @click="handelWeight(scope.row)"
                >前往称重</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="goodsFooter">
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
    <el-dialog title="商品称重" :visible.sync="openWeight" width="500px">
      <el-form ref="weightForm" :model="weightForm" :rules="weightFormRules" label-width="90px">
        <el-form-item label="角色名称" prop="price">
          <el-input v-model="weightForm.price" />
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
    return {
      openWeight: false,
      loading: false,
      weightForm: {
        price: 0
      },
      weightFormRules: {},
      goodsList: [],
      params: {},
      tradestate: "",
      totalNum: "",
      totalPrice: ""
    };
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
        "待买家称重"
      ];
      return arr[val];
    }
  },
  created() {
    this.params = JSON.parse(decrypt(this.$route.params.code));
    this.getDetail();
  },
  methods: {
    async getDetail() {
      try {
        this.loading = true;
        const { code, data } = await getOrderDetail({
          orderno: this.params.orderno
        });
        this.loading = false;
        if (code === 200) {
          this.goodsList = data;
          this.tradestate = data[0].tradestate;
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
    submitWeightForm() {},
    handelWeight() {
      this.openWeight = true;
    }
  }
};
</script>