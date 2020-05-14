<template>
  <div class="account app-container">
    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-table style="width: 100%" v-loading="loading" :data="passList">
        <el-table-column label="通道名称" prop="channelname" />
        <!-- <el-table-column label="微信D1结算金额" prop="wxd1amount">
          <template slot-scope="scope">{{Number(scope.row.wxd1amount)}}</template>
        </el-table-column>
        <el-table-column label="二级账户余额" prop="balance" /> -->
        <el-table-column label="账户余额" prop="accountamount" />
        <el-table-column label="可用金额" prop="usableamount" />
        <el-table-column label="冻结金额" prop="frozenamount" />
        <el-table-column label="累计提现" prop="totalcash" />
        <el-table-column label="累计收入" prop="totalincome" />
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleWithdrawal(scope.row)"
            >余额提现</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { withdrawalAccountList as list } from "@/api/account";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      passList: [{}]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, data } = await list();
        this.loading = false;
        if (code === 200) {
          this.passList = data;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },

    handleWithdrawal(item) {
      const { uid, usercode, usableamount } = item;
      const params = window.btoa(`${uid}-${usercode}-${usableamount}`);
      if (Number(usableamount) > 0) {
        this.$router.push({
          path: `/cash/withdrawal/${params}`
        });
      } else {
        this.msgError("可用余额为0不能提现");
      }
    }
  }
};
</script>