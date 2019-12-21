
<template>
  <div class="app-container order-detail">
    <div class="statusStep">
      <div class="statusLeft">
        <h3>待买家付款</h3>
        <!-- <ul>
          <li>订单号：ljk58425625255llk</li>
          <li>创建日期：2019-10-23 10:20:33</li>
          <li></li>
        </ul> -->
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
      <el-table :data="[{},{}]" class="goodsTable">
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
        <el-table-column label="单价">￥606,868.00</el-table-column>
        <el-table-column label="数量">×15</el-table-column>
        <el-table-column label="优惠">￥602.00</el-table-column>
        <el-table-column label="总价">￥606,868.00</el-table-column>
        <el-table-column label="状态">未付款（5时38分）</el-table-column>
      </el-table>
      <div class="goodsFooter">
        <p>
          <b class="totalGoods">
            共
            <span>15</span>件商品
          </b>
          <b>产品总价：</b>
          <span>￥6756.00</span>
        </p>
        <p>
          <b>优惠：</b>
          <span>-￥500.00</span>
        </p>
        <p>
          <b>运费：</b>
          <span>+￥100.00</span>
        </p>
        <p class="total">
          <b>实付总价：</b>
          <span>￥84,356.00</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "orderDetail",
  data() {
    return {};
  },
  methods: {}
};
</script>