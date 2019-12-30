<template>
  <div class="dashboard-editor-container" v-if="isShow">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row class="line-box">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <referer-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart2 />
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
import { getHomePageData } from "@/api/index";

const lineChartData = {
  newVisitis: {
    expectedData: [12, 36, 14, 24, 26, 58, 32],
    actualData: [14, 20, 35, 22, 52, 0, 0]
  },
  messages: {
    expectedData: [11, 21, 12, 19, 22, 42, 26],
    actualData: [12, 18, 29, 15]
  },
  purchases: {
    expectedData: [2256.32, 3689.5, 895.66, 7896.32, 10110.8, 2568.3, 1528.36],
    actualData: [1658.58, 2589.5, 788.25, 6489.32, 9856.8]
  },
  shoppings: {
    expectedData: [2256.32, 3689.5, 895.66, 7896.32, 10110.8],
    actualData: [2256.32, 3689.5, 895.66, 7896.32, 10110.8]
  }
};

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
      isShow: true,
      lineChartData: lineChartData.newVisitis
    };
  },

  async created() {
    this.getData()
  },
  methods: {
    async getData() {
      const {code} = await getHomePageData();
      if(code === 200){}
    },

    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
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
