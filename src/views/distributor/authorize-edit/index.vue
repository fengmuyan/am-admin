<template>
  <div class="authorize-edit">
    <div class="step-wrap">
      <div class="step-top">
        <div class="step-icon">
          <span :class="{ac:!(actItem<0)}">1</span>
          <i :class="{ac_i:actItem>0}"></i>
          <span :class="{ac:actItem===1}">2</span>
        </div>
        <div class="step-title">
          <span :class="{ac:!(actItem<0)}">验证身份</span>
          <span :class="{ac:actItem===1}">授权信用额度</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div v-if="actItem === 0" class="fir-form">
        <el-form :model="firForm" :rules="firFormRules" ref="firForm">
          <div class="number-tip">将为你手机号{{numberInit}}发送验证码，请注意查收。</div>
          <el-form-item prop="smsCode" class="code-item">
            <el-input v-model="firForm.smsCode" maxlength="6" placeholder="输入验证码"></el-input>
            <ge-code :config="configSelf" ref="geCodeSelf"></ge-code>
          </el-form-item>
          <el-button class="submit-btn" :loading="loading" @click="toConfirmInfo('firForm')">下一步</el-button>
        </el-form>
      </div>
      <div v-if="actItem === 1" class="last-form">
        <el-form :model="fourForm" :rules="fourFormRules" ref="fourForm">
          <el-form-item prop="creditlimit">
            <el-input v-model="fourForm.creditlimit" placeholder="输入授权额度"></el-input>
          </el-form-item>
          <el-form-item prop="risklimit">
            <el-input v-model="fourForm.risklimit" placeholder="输入风控额度"></el-input>
            <span class="tip">* 经销商使用的总额度大于风控额度时风控状态为风控超额。</span>
          </el-form-item>
          <el-button class="submit-btn" @click="confirmAuthorize('fourForm')">确认</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import geCode from "vue-gecode";
import { mapGetters } from "vuex";
import {
  sendSmsCode,
  checkMerSmsCode,
  updateCreditLimit
} from "@/api/distributor";
export default {
  components: {
    geCode
  },
  data() {
    const patter = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    const validateSq = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入授权额度"));
      } else {
        if (!patter.test(value)) {
          callback(new Error("必须非负整数或至多保留两位小数！"));
        } else {
          callback();
        }
      }
    };
    const validateFk = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入风控额度"));
      } else {
        if (!patter.test(value)) {
          callback(new Error("必须非负整数或至多保留两位小数！"));
        } else {
          callback();
        }
      }
    };
    return {
      actItem: 0, //当前进行的step
      loading: false, //下一步按钮loading
      configSelf: {
        startText: "获取验证码",
        endText: "再次获取",
        totalTime: 60, //多久一次
        tickTime: 1, //步值
        todo: async () => {
          try {
            const { code } = await sendSmsCode();
            if (code === 200) {
              return true;
            } else {
              this.msgError("短信发送失败！");
            }
          } catch (e) {
            this.$refs.geCodeSelf.stop(1);
            console.log(e);
          }
        }, //调取方法
        computeText(num) {
          return "重新获取 " + num + "s";
        }
      },
      firForm: { smsCode: "" },
      firFormRules: {
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      fourForm: { creditlimit: "", risklimit: "" },
      fourFormRules: {
        creditlimit: [
          { validator: validateSq, required: true, trigger: "blur" }
        ],
        risklimit: [{ validator: validateFk, required: true, trigger: "blur" }]
      },
      sessionFir: "",
      uid: "",
      usercode: ""
    };
  },
  computed: {
    ...mapGetters(["userNumber"]),
    numberInit() {
      return (
        this.userNumber.substring(0, 3) +
        "*****" +
        this.userNumber.substring(this.userNumber.length - 2)
      );
    }
  },
  created() {
    const codeArr = this.$route.params.code.split("-");
    this.uid = codeArr[0];
    this.usercode = codeArr[1];
    this.fourForm.creditlimit = codeArr[2];
    this.fourForm.risklimit = codeArr[3];
  },
  methods: {
    toConfirmInfo(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loading = true;
            const {
              code,
              data: { session }
            } = await checkMerSmsCode(this.firForm);
            this.loading = false;
            if (code === 200) {
              this.actItem = 1;
              this.sessionFir = session;
            }
          } catch (err) {
            this.loading = false;
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },

    confirmAuthorize(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true;
          try {
            const { uid, usercode, sessionFir: sessionid } = this;
            const { code, data } = await updateCreditLimit({
              uid,
              usercode,
              sessionid,
              ...this.fourForm
            });
            this.loading = false;
            if (code === 200) {
              this.msgSuccess("修改成功");
              this.$router.push("/distributor/list");
            }
          } catch (err) {
            this.loading = false;
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
