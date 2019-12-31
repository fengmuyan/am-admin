<template>
  <div class="dashboard-editor-container" v-loading="loading" v-if="isShow">
    <panel-group :itemData="topPanelData" @handleSetLineChartData="handleSetLineChartData" />

    <el-row class="line-box">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <referer-chart :itemData="botLeftData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :itemData="botMidData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart2 :itemData="botRightData" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from "./dashboard/PanelGroup";
import LineChart from "./dashboard/LineChart";
import PieChart from "./dashboard/PieChart";
import PieChart2 from "./dashboard/PieChart2";
import RefererChart from "./dashboard/RefererChart";
import { mapState } from "vuex";
import { getHomePageData } from "@/api/index";

export default {
  name: "Index",
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    PieChart2,
    RefererChart
  },
  data() {
    return {
      loading: false,
      isShow: false,
      activeItem: "topFir",
      lineChartDataAll: {
        topFir: {
          title: "今日新订单",
          preWeek: [0, 0, 0, 0, 0, 0, 0],
          curWeek: []
        },
        topSec: {
          title: "付款订单数",
          preWeek: [0, 0, 0, 0, 0, 0, 0],
          curWeek: []
        },
        topThi: {
          title: "信用额度付款",
          preWeek: [0, 0, 0, 0, 0, 0, 0],
          curWeek: []
        },
        topLast: {
          title: "资金付款",
          preWeek: [0, 0, 0, 0, 0, 0, 0],
          curWeek: []
        }
      },
      topPanelData: [0, 0, 0, 0, 0, 0],
      botLeftData: [
        { value: 0, name: "待称重", tradestate: 10 },
        { value: 0, name: "待付款", tradestate: 0 },
        { value: 0, name: "待发货", tradestate: 1 },
        { value: 0, name: "已发货", tradestate: 2 },
        { value: 0, name: "已完成", tradestate: 4 },
        { value: 0, name: "已关闭", tradestate: 5 }
      ],
      botRightData: [
        { value: 0, name: "已使用额度" },
        { value: 0, name: "未使用额度" }
      ],
      botMidData: [
        { value: 0, name: "信用额度付款" },
        { value: 0, name: "资金付款" }
      ]
    };
  },

  computed: {
    ...mapState({
      isReal: state => state.user.isReal,
      isOpenAccount: state => state.user.isOpenAccount
    }),
    lineChartData() {
      return this.lineChartDataAll[this.activeItem];
    }
  },

  created() {
    const isReal = Number(this.isReal);
    const isOpenAccount = this.isOpenAccount;
    if (isReal === 3 && isOpenAccount === true) {
      this.getData();
    } else {
      this.isShow = true;
    }
  },
  methods: {
    async getData() {
      try {
        this.loading = true;
        const {
          code,
          data: {
            statisticsNewOrderRespList: topLeft,
            statisticsPayCountRespList: topMid,
            statisticsPayMoneyRespList: topRight,
            statisticsCreditLimitResp: botRight,
            statisticsTodayOrderStateRespList: botLeft
          }
        } = await getHomePageData();
        this.loading = false;
        if (code === 200) {
          this.isShow = true;
          const {
            botRightData,
            botMidData,
            topPanelData,
            lineChartDataAll: { topFir, topSec, topThi, topLast }
          } = this;
          if (botLeft && botLeft.length > 0) {
            botLeft.forEach(item => {
              const selectItem = this.botLeftData.find(v => {
                return Number(v.tradestate) === item.tradestate;
              });
              if (selectItem) {
                Object.assign(selectItem, { value: item.newcount });
              }
            });
          }
          if (botRight) {
            botRightData[0].value = botRight.usedlimit;
            botRightData[1].value = botRight.usablelimit;
          }
          this._topPanelInit(botMidData[0].value, topMid, "creditprice");
          this._topPanelInit(botMidData[1].value, topMid, "currencyamount");

          this._topPanelInit(topPanelData[0], topLeft, "newcount");
          this._topPanelInit(topPanelData[1], topMid, "paycount");
          this._topPanelInit(topPanelData[2], topMid, "creditprice");
          this._topPanelInit(topPanelData[3], topRight, "totalmoney");
          this._topPanelInit(topPanelData[4], topRight, "paymoney");
          this._topPanelInit(topPanelData[5], topRight, "repaymoney");

          this._weekDataInit(topFir, topLeft, "newcount");
          this._weekDataInit(topSec, topMid, "paycount");
          this._weekDataInit(topThi, topMid, "creditprice");
          this._weekDataInit(topLast, topRight, "totalmoney");
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },

    handleSetLineChartData(type) {
      this.activeItem = type;
    },

    _topPanelInit(operateData, httpData, httpItem) {
      operateData = httpData[httpData.length - 1][httpItem];
    },

    _weekDataInit(operateData, httpData, httpItem) {
      operateData.preWeek = httpData.slice(0, 7).map(item => item[httpItem]);
      operateData.curWeek = httpData.slice(7).map(item => item[httpItem]);
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 25px 40px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
    border-radius: 8px;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  }
  .line-box {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
    border-radius: 8px;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
