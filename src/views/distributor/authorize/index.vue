<template>
  <div class="authorize">
    <div class="step-wrap">
      <div class="step-top">
        <div class="step-icon">
          <span :class="{ac:!(actItem<0)}">1</span>
          <i :class="{ac_i:actItem>0}"></i>
          <span :class="{ac:!(actItem<1)}">2</span>
          <i :class="{ac_i:actItem>1}"></i>
          <span :class="{ac:!(actItem<2)}">3</span>
          <i :class="{ac_i:actItem>2}"></i>
          <span :class="{ac:actItem===3}">4</span>
        </div>
        <div class="step-title">
          <span :class="{ac:!(actItem<0)}">验证身份</span>
          <span :class="{ac:!(actItem<1),'span-two':true}">核对经销商信息</span>
          <span :class="{ac:!(actItem<2)}">验证经销商身份</span>
          <span :class="{ac:actItem===3}">授权信用额度</span>
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
          <el-button class="submit-btn" @click="toConfirmInfo">下一步</el-button>
        </el-form>
      </div>
      <div v-if="actItem === 1" class="sec-form">
        <el-form :model="infoForm" :rules="infoFormRules" ref="codeForm">
          <el-form-item prop="smsCode" class="code-item">
            <el-input v-model="codeForm.smsCode" maxlength="6" placeholder="请输入账号id"></el-input>
            <span>查询信息</span>
          </el-form-item>
          <el-button class="submit-btn" @click="toConfirmIdentity">确认信息</el-button>
        </el-form>
      </div>
      <div v-if="actItem === 2" class="thi-form">
        <el-form :model="codeForm" :rules="codeFormRules" ref="codeForm">
          <el-form-item prop="smsCode" class="code-item">
            <el-input v-model="codeForm.smsCode" maxlength="6" placeholder="输入验证码"></el-input>
            <ge-code :config="config" ref="geCode"></ge-code>
          </el-form-item>
          <el-button class="submit-btn" @click="toAuthorize">下一步</el-button>
        </el-form>
      </div>
      <div v-if="actItem === 3">
        <el-form :model="codeForm" :rules="codeFormRules" ref="codeForm">
          <el-form-item prop="smsCode">
            <el-input v-model="codeForm.smsCode" maxlength="6" placeholder="输入授权额度"></el-input>
          </el-form-item>
          <el-form-item prop="smsCode">
            <el-input v-model="codeForm.smsCode" maxlength="6" placeholder="输入风控额度"></el-input>
            <span class="tip">* 经销商使用的总额度大于风控额度时风控状态为风控超额。</span>
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
    toConfirmInfo() {
      this.actItem = 1;
    },
    toConfirmIdentity() {
      this.actItem = 2;
    },
    toAuthorize() {
      this.actItem = 3;
    },
    confirmAuthorize() {
      this.$router.push("/distributor/list");
    }
  }
};
</script>
