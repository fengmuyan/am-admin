<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-description">
          <div class="card-panel-text">今日新订单</div>
          <count-to :start-val="0" :end-val="32" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel card-panel02" @click="handleSetLineChartData('messages')">
        <div class="card-panel-description">
          <div class="card-panel-text">付款订单数</div>
          <count-to :start-val="0" :end-val="21" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel card-panel03" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-description">
          <div class="card-panel-text">信用额度付款</div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel card-panel04" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-description">
          <div class="card-panel-text">资金付款</div>
          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 150px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    background: url("../../assets/image/bg01.png") center center no-repeat;
    padding-left: 20px;
    background-size: cover;

    .card-panel-description {
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 20px;
        font-size: 19px;
        margin-bottom: 15px;
      }

      .card-panel-num {
        font-size: 38px;
        font-weight: 600;
      }
    }
  }

  .card-panel02 {
    background: url("../../assets/image/bg02.png") center center no-repeat;
    background-size: cover;
  }

  .card-panel03 {
    background: url("../../assets/image/bg03.png") center center no-repeat;
    background-size: cover;
  }

  .card-panel04 {
    background: url("../../assets/image/bg04.png") center center no-repeat;
    background-size: cover;
  }
}
</style>
