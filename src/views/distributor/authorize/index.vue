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
          <span :class="{ac:!(actItem<1)}">核对对方信息</span>
          <span :class="{ac:!(actItem<2)}">验证对方身份</span>
          <span :class="{ac:actItem===3}">信用额度</span>
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
          <el-button class="submit-btn" @click="toConfirmInfo('firForm')">下一步</el-button>
        </el-form>
      </div>
      <div v-if="actItem === 1" class="sec-form">
        <el-form :model="secForm" :rules="secFormRules" ref="secForm">
          <el-form-item prop="number" class="code-item">
            <el-input v-model="secForm.number" placeholder="请输入账号id"></el-input>
            <span @click="quiryInfo('secForm')">查询信息</span>
          </el-form-item>
          <el-form :model="checkInfoForm" ref="checkInfoForm" label-width="82px">
            <el-form-item label="姓名：">
              <el-input v-model="checkInfoForm.name" disabled placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input v-model="checkInfoForm.number" disabled placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="身份证号：">
              <el-input v-model="checkInfoForm.idCode" disabled placeholder="身份证号"></el-input>
            </el-form-item>
          </el-form>
          <el-button class="submit-btn" @click="toConfirmIdentity">确认信息</el-button>
        </el-form>
      </div>
      <div v-if="actItem === 2" class="thi-form">
        <el-form :model="thirdForm" :rules="thirdFormRules" ref="thirdForm">
          <div class="number-tip">对方手机号158****4090已发送验证码，请通知对方查收。</div>
          <el-form-item prop="smsCode" class="code-item">
            <el-input v-model="thirdForm.smsCode" maxlength="6" placeholder="输入验证码"></el-input>
            <ge-code :config="config" ref="geCode"></ge-code>
          </el-form-item>
          <el-button class="submit-btn" @click="toAuthorize('thirdForm')">下一步</el-button>
        </el-form>
      </div>
      <div v-if="actItem === 3">
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
        }else {
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
      checkInfoForm: {
        name: "马方圆",
        number: "158*****4988",
        idCode: "1305**********1212"
      },
      firForm: { smsCode: "" },
      firFormRules: {
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      secForm: { number: "" },
      secFormRules: {
        number: [{ required: true, message: "请输入账号", trigger: "blur" }]
      },
      thirdForm: { smsCode: "" },
      thirdFormRules: {
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
    quiryInfo(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
        } else {
          return false;
        }
      });
    },

    toConfirmInfo(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.actItem = 1;
        } else {
          return false;
        }
      });
    },
    toConfirmIdentity(formName) {
      MessageBox.confirm("信息核对确认完成。", "系统提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(() => {
          this.actItem = 2;
        })
        .catch(() => {});
    },
    toAuthorize(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.actItem = 3;
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
