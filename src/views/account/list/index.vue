<template>
  <div class="account app-container">
    <div class="table-p">
      <el-table style="width: 100%" v-loading="loading" :data="passList">
        <el-table-column label="通道编号" prop="channelcode" width="100" />
        <el-table-column label="通道名称" prop="channelname" :show-overflow-tooltip="true" width="180" />
        <el-table-column label="收款户名" prop="accountname" width="220" />
        <el-table-column label="银行账号" prop="bankaccount" width="220" />
        <el-table-column label="开户行名称" prop="bankname" width="220" />
        <el-table-column label="开户行行号" prop="bankno" width="150" />
        <el-table-column label="预留手机号" prop="mobilephone" width="150" />
        <el-table-column label="注册类型" prop="registertype" width="100">
          <template slot-scope="scope">{{registertypeArr[Number(scope.row.registertype)]}}</template>
        </el-table-column>
        <el-table-column label="开通状态" prop="merstate" width="150">
          <template
            slot-scope="scope"
          >{{scope.row.merstate === null?"未开户":merstateArr[Number(scope.row.merstate)]}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-if="isShowBtn('add',scope.row.merstate)"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
            >开通账户</el-button>
            <el-button
              v-if="isShowBtn('edit',scope.row.merstate)"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              v-if="isShowBtn('verify',scope.row.merstate)"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleVerify(scope.row)"
            >验证</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="开通收款账户" :visible.sync="createOpen" width="580px">
      <el-form
        :model="accountForm"
        ref="accountForm"
        :rules="accountFormRules"
        :inline="true"
        label-width="130px"
      >
        <el-form-item label="收款户名" prop="accountname">
          <el-input
            v-model="accountForm.accountname"
            placeholder="请输入收款户名"
            clearable
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="银行帐号" prop="bankaccount">
          <el-input
            v-model="accountForm.bankaccount"
            placeholder="请输入银行账号"
            clearable
            maxlength="19"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="银行预留手机号" prop="mobilephone">
          <el-input
            v-model="accountForm.mobilephone"
            placeholder="请输入银行预留手机号"
            clearable
            maxlength="11"
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
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="收款卡类型" prop="cardtype">
          <el-select
            v-model="accountForm.cardtype"
            placeholder="请选择收款卡类型"
            style="width: 300px"
            :disabled="Number(registertype) === 1"
          >
            <el-option label="个人" value="0"></el-option>
            <el-option label="对公" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createAccount('accountForm')">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="开通验证" :visible.sync="verifyOpen" width="600px">
      <el-form
        :model="verifyForm"
        ref="verifyForm"
        :rules="verifyFormRules"
        :inline="true"
        label-width="120px"
      >
        <el-form-item
          label="手机验证码"
          prop="vercode"
          v-if="Number(accountFormData.cardtype) === 0"
          class="code-item"
        >
          <el-input
            v-model="verifyForm.vercode"
            maxlength="6"
            placeholder="输入验证码"
            class="code-input"
          ></el-input>
          <ge-code :config="config" ref="geCode" class="code-btn"></ge-code>
        </el-form-item>
        <el-form-item label="随机金额" prop="amount" v-if="Number(accountFormData.cardtype) === 1">
          <el-input v-model="verifyForm.amount" placeholder="输入随机金额" style="width:300px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="verifyConfirm('verifyForm')">确 定</el-button>
        <el-button @click="cancelVerify">取 消</el-button>
      </div>
    </el-dialog>
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
  components: {
    geCode
  },
  data() {
    var validateTel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入预留手机号"));
      } else {
        if (!/^1[345678]\d{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        }
        callback();
      }
    };
    var validateAccount = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入银行卡号"));
      } else {
        if (!/\d{15}|\d{19}/.test(value)) {
          callback(new Error("请输入正确的银行卡号"));
        }
        callback();
      }
    };
    var validateAmount = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入金额"));
      } else {
        if (!/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(value)) {
          callback(new Error("必须非负整数或至多保留两位小数！"));
        }
        callback();
      }
    };
    return {
      loading: false,
      createOpen: false,
      verifyOpen: false,
      codeLock: false,
      passList: [],
      bankArr: [],
      merstateArr: [
        "审核中",
        "审核通过",
        "审核未通过",
        "待验证",
        "解约",
        "已关闭"
      ],
      registertypeArr: ["个人", "企业", "个体工商户"],
      registertype: "",
      accountForm: {
        channelcode: "",
        accountname: "",
        bankaccount: "",
        mobilephone: "",
        bankname: "",
        bankno: "",
        cardtype: "1"
      },
      accountFormRules: {
        accountname: [
          { required: true, message: "请输入收款户名", trigger: "blur" }
        ],
        bankaccount: [
          { validator: validateAccount, required: true, trigger: "blur" }
        ],
        mobilephone: [
          { validator: validateTel, required: true, trigger: "blur" }
        ],
        bankname: [
          { required: true, message: "请输入开户行名称", trigger: "change" }
        ],
        bankno: [
          { required: true, message: "请输入开户行行号", trigger: "change" }
        ],
        cardtype: [
          { required: true, message: "请输入收款卡类型", trigger: "blur" }
        ]
      },
      verifyForm: {
        vercode: "",
        amount: ""
      },
      verifyFormRules: {
        vercode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        amount: [{ validator: validateAmount, required: true, trigger: "blur" }]
      },
      config: {
        startText: "获取验证码",
        endText: "再次获取",
        totalTime: 60, //多久一次
        tickTime: 1, //步值
        todo: async () => {
          if (!this.codeLock) {
            try {
              const { code } = await resentCode(this.accountFormData);
              if (code === 200) {
                return true;
              } else {
                this.msgError("短信发送失败！");
              }
            } catch (e) {
              this.$refs.geCode.stop(1);
              console.log(e);
            }
          }
        }, //调取方法
        computeText(num) {
          return "重新获取 " + num + "s";
        }
      }, //短信验证码配置
      accountFormData: {}
    };
  },
  computed: {
    isShowBtn() {
      return function(type, status) {
        if (type === "add") {
          if (status === null) {
            return true;
          }
        } else if (type === "edit") {
          if (Number(status) === 2) {
            return true;
          }
        } else if (type === "verify") {
          if (Number(status) === 3) {
            return true;
          }
        }
      };
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleAdd(item) {
      this.registertype = item.registertype;
      Object.assign(this.accountForm, {
        channelcode: item.channelcode,
        accountname: "",
        bankaccount: "",
        bankname: "",
        mobilephone: "",
        bankno: ""
      });
      this.createOpen = true;
    },
    cancel() {
      this.createOpen = false;
    },
    cancelVerify() {
      this.verifyOpen = false;
    },
    async getList() {
      this.bankArr = bankArr;
      this.loading = true;
      try {
        const { code, data } = await getAccountPass();
        this.loading = false;
        if (code === 200) {
          this.passList = data;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    bankChange(val) {
      this.accountForm.bankno = this.bankArr.find(item => {
        return item.bank === val;
      }).bankNum;
    },
    createAccount(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const { code } = await createAccount(this.accountForm);
            if (code === 200) {
              this.getList();
              this.accountFormData = Object.assign({}, this.accountForm);
              this.createOpen = false;
              this.verifyOpen = true;
              this.codeLock = true;
              await this.$nextTick();
              if (Number(this.accountForm.cardtype) === 0) {
                this.$refs.geCode.runtime();
              }
              this.codeLock = false;
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    handleEdit(item) {
      Object.assign(this.accountForm, {
        channelcode: item.channelcode,
        accountname: item.accountname,
        bankaccount: item.bankaccount,
        bankname: item.bankname,
        mobilephone: item.mobilephone,
        bankno: item.bankno
      });
      this.registertype = item.cardtype;
      this.createOpen = true;
    },
    async handleVerify(item) {
      Object.assign(this.accountFormData, {
        channelcode: item.channelcode,
        accountname: item.accountname,
        bankaccount: item.bankaccount,
        bankname: item.bankname,
        mobilephone: item.mobilephone,
        bankno: item.bankno,
        cardtype: item.cardtype
      });
      Object.assign(this.verifyForm, { vercode: "", amount: "" });
      this.verifyOpen = true;
    },
    async verifyConfirm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let data;
          if (Number(this.accountFormData.cardtype) === 0) {
            data = { vercode: this.verifyForm.vercode };
          } else if (Number(this.accountFormData.cardtype) === 1) {
            data = { amount: this.verifyForm.amount };
          }
          Object.assign(this.accountFormData, data);
          try {
            const { code } = await bindCardConfirm(this.accountFormData);
            if (code === 200) {
              this.getList();
              this.msgSuccess("验证成功！");
              this.verifyOpen = false;
            }
          } catch (err) {
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