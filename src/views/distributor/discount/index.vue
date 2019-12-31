<template>
  <div class="discount">
    <div class="step-wrap">
      <div class="step-top">
        <div class="step-icon">
          <span :class="{ac:!(actItem<0)}">1</span>
          <i :class="{ac_i:actItem>0}"></i>
          <span :class="{ac:actItem===1}">2</span>
        </div>
        <div class="step-title">
          <span :class="{ac:!(actItem<0)}">验证身份</span>
          <span :class="{ac:actItem===1}">调整折扣率</span>
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
          <el-form-item prop="discount">
            <el-input v-model="fourForm.discount" placeholder="输入折扣率"></el-input>
            <span class="tip">* 单位为%，1-100之间整数。</span>
          </el-form-item>
          <el-button class="submit-btn" @click="confirmDiscount('fourForm')">确认</el-button>
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
  updateDiscount
} from "@/api/distributor";
export default {
  components: {
    geCode
  },
  data() {
    const patter = /^(1|([1-9]\d{0,1})|100)$/;
    const validateDis = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入折扣率"));
      } else {
        if (!patter.test(value)) {
          callback(new Error("1-100之间整数！"));
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
      fourForm: { discount: "" },
      fourFormRules: {
        discount: [{ validator: validateDis, required: true, trigger: "blur" }]
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
    const codeArr = window.atob(this.$route.params.code).split("-");
    this.uid = codeArr[0];
    this.usercode = codeArr[1];
    this.fourForm.discount = Number(codeArr[2]) * 100;
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
    confirmDiscount(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true;
          try {
            const { uid, usercode, sessionFir: sessionid } = this;
            const { code, data } = await updateDiscount({
              sessionid,
              uid,
              usercode,
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
