<template>
  <div class="account app-container">
    <div class="table-p">
      <el-table style="width: 100%" v-loading="loading" :data="passList">
        <el-table-column label="通道编号" prop="channelcode" />
        <el-table-column label="收款账户" prop="channelname" />
        <el-table-column label="账户余额" prop="channelname" />
        <el-table-column label="操作">
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
import bankArr from "@/utils/bank";
import geCode from "vue-gecode";
import {
  getAccountPass,
  createAccount,
  bindCardConfirm,
  resentCode
} from "@/api/account";
export default {
  data() {
    return {
      loading: false,
      passList: [{}]
    };
  },
  created() {},
  methods: {
    handleWithdrawal(item) {
      this.$router.push({
        path: `/cash/withdrawal/53635`
      });
    }
  }
};
</script>