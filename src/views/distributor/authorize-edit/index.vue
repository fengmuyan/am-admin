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
          <div class="number-tip">将为你手机号158****4090发送验证码，请注意查收。</div>
          <el-form-item prop="smsCode" class="code-item">
            <el-input v-model="firForm.smsCode" maxlength="6" placeholder="输入验证码"></el-input>
            <ge-code :config="config" ref="geCode"></ge-code>
          </el-form-item>
          <el-button class="submit-btn" @click="toAuthorize('firForm')">下一步</el-button>
        </el-form>
      </div>
      <div v-if="actItem === 1" class="last-form">
        <el-form :model="fourForm" :rules="fourFormRules" ref="fourForm">
          <el-form-item prop="sqMoney">
            <el-input v-model="fourForm.sqMoney" placeholder="输入授权额度"></el-input>
          </el-form-item>
          <el-form-item prop="fkMoney">
            <el-input v-model="fourForm.fkMoney" placeholder="输入风控额度"></el-input>
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
import { MessageBox } from "element-ui";
import axios from "axios";
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
      config: {
        startText: "获取验证码",
        endText: "再次获取",
        totalTime: 60, //多久一次
        tickTime: 1, //步值
        canTodo: () => {}, //调取前验证
        todo: async () => {}, //调取方法
        computeText(num) {
          return "重新获取 " + num + "s";
        }
      },
      firForm: { smsCode: "" },
      firFormRules: {
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      fourForm: { sqMoney: "", fkMoney: "" },
      fourFormRules: {
        sqMoney: [{ validator: validateSq, required: true, trigger: "blur" }],
        fkMoney: [{ validator: validateFk, required: true, trigger: "blur" }]
      }
    };
  },
  mounted() {},
  methods: {
    toAuthorize(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.actItem = 1;
        } else {
          return false;
        }
      });
    },

    confirmAuthorize(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.$router.push("/distributor/list");
        } else {
          return false;
        }
      });
    }
  }
};
</script>
