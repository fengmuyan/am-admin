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
        <el-form :model="codeForm" :rules="codeFormRules" ref="codeForm">
          <el-form-item prop="smsCode" class="code-item">
            <el-input v-model="codeForm.smsCode" maxlength="6" placeholder="输入验证码"></el-input>
            <ge-code :config="config" ref="geCode"></ge-code>
          </el-form-item>
          <el-button class="submit-btn" @click="toAuthorize">下一步</el-button>
        </el-form>
      </div>
      <div v-if="actItem === 1" class="last-form">
        <el-form :model="codeForm" :rules="codeFormRules" ref="codeForm">
          <el-form-item prop="smsCode" class="code-item">
            <el-input v-model="codeForm.smsCode" maxlength="6" placeholder="输入验证码"></el-input>
            <ge-code :config="config" ref="geCode"></ge-code>
          </el-form-item>
          <el-button class="submit-btn" @click="confirmAuthorize">确认</el-button>
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
      codeForm: {
        phone: "",
        smsCode: ""
      },
      infoForm: {},
      codeFormRules: {},
      infoFormRules: {}
    };
  },
  mounted() {},
  methods: {
    toAuthorize() {
      this.actItem = 1;
    },
    confirmAuthorize() {
      this.$router.push("/distributor/list");
    }
  }
};
</script>
