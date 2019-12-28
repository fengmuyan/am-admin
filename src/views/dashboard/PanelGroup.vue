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
          <count-to :start-val="0" :end-val="9280.89" decimals="2" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel card-panel04" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-description">
          <div class="card-panel-text">资金付款</div>
          <el-popover popper-class="popover-p" placement="bottom-start" title="付款明细" width="200" trigger="hover">
            <div class="popover-content">
              <p>订单付款金额：<span>895.00</span> 。</p>
              <p>还款金额：<span>235.00</span> 。</p>
            </div>
            <count-to
              slot="reference"
              :start-val="0"
              :end-val="1360.23"
              decimals="2"
              :duration="2000"
              class="card-panel-num"
            />
          </el-popover>
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
