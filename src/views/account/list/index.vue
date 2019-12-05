<template>
  <div class="app-container">
    <div class="table-p">
      <el-table style="width: 100%" v-loading="loading" :data="passList">
        <el-table-column label="通道编号" prop="channelcode" width="180" />
        <el-table-column label="通道名称" prop="channelname" :show-overflow-tooltip="true" width="180" />
        <el-table-column label="是否有效" prop="isvalid" width="150" />
        <el-table-column label="开通状态" prop="status" width="150" />
        <el-table-column label="创建时间" prop="createtime" width="200">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createtime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              :disabled="scope.row.status === '已开通'"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
            >添加账户</el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="开通二级账户" :visible.sync="createOpen" width="550px">
      <el-form :model="accountForm" ref="accountForm" :inline="true" label-width="130px">
        <el-form-item label="收款户名" prop="roleName">
          <el-input
            v-model="accountForm.accountname"
            placeholder="请输入收款户名"
            clearable
            size="small"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="银行帐号" prop="bankaccount">
          <el-input
            v-model="accountForm.bankaccount"
            placeholder="请输入银行账号"
            clearable
            size="small"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="银行预留手机号" prop="mobilephone">
          <el-input
            v-model="accountForm.mobilephone"
            placeholder="请输入银行预留手机号"
            clearable
            size="small"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="开户行名称" prop="bankname">
          <el-select
            v-model="accountForm.bankname"
            filterable
            placeholder="请选择开户行名称"
            @change="bankChange"
            style="width: 300px"
          >
            <el-option
              v-for="item in bankArr"
              :key="item.bankNum"
              :label="item.bank"
              :value="item.bank"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户行行号" prop="bankno">
          <el-input
            v-model="accountForm.bankno"
            placeholder="由开户行带出"
            disabled
            size="small"
            style="width: 300px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createAccount">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="开通验证" :visible.sync="verifyOpen" width="550px">
      <el-form :model="verifyForm" ref="verifyForm" :inline="true" label-width="130px">
        <el-form-item label="手机验证码" prop="vercode">
          <el-input v-model="verifyForm.vercode" maxlength="6" placeholder="输入验证码"></el-input>
          <ge-code :config="config" ref="geCode"></ge-code>
        </el-form-item>
        <el-form-item label="随机金额" prop="amount">
          <el-input v-model="verifyForm.amount" placeholder="输入随机金额"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createAccount">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import bankArr from "@/utils/bank";
import {
  getAccountPass,
  createAccount,
  bindCardConfirm,
  resentCode
} from "@/api/account";
import geCode from "vue-gecode";
import { mapGetters } from "vuex";
export default {
  components: {
    geCode
  },
  data() {
    return {
      loading: false,
      createOpen: false,
      verifyOpen: false,
      passList: [],
      accountForm: {
        accountname: "",
        bankaccount: "",
        mobilephone: "",
        bankname: "",
        bankno: ""
      },
      config: {
        startText: "获取验证码",
        endText: "再次获取",
        totalTime: 60, //多久一次
        tickTime: 1, //步值
        todo: async () => {
          try {
            const { code } = await resentCode();
            if (code === 200) {
              return;
            }
          } catch (e) {
            console.log(e);
          }
        }, //调取方法
        computeText(num) {
          return "重新获取 " + num + "s";
        }
      }, //短信验证码配置
      verifyForm: { code: "" },
      bankArr: []
    };
  },
  async created() {
    this.bankArr = bankArr;
    try {
      const { code, data } = await getAccountPass();
      if (code === 200) {
        this.passList = data;
      }
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    handleAdd() {
      this.createOpen = true;
    },
    cancel() {
      this.createOpen = false;
    },

    bankChange(val) {
      this.accountForm.bankno = this.bankArr.find(item => {
        return item.bank === val;
      }).bankNum;
    },
    async createAccount() {
      this.verifyOpen = true;
      /* try {
        const { code } = await createAccount(
          Object.assign(this.accountForm, { channelcode: 100001 })
        );
        if (code === 200) {
          this.verifyOpen = true;
        }
      } catch (err) {
        console.log(err);
      } */
    }
  }
};
</script>