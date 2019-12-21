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
          <div class="number-tip">将为你手机号{{numberInit}}发送验证码，请注意查收。</div>
          <el-form-item prop="smsCode" class="code-item">
            <el-input v-model="firForm.smsCode" maxlength="6" placeholder="输入验证码"></el-input>
            <ge-code :config="configSelf" ref="geCodeSelf"></ge-code>
          </el-form-item>
          <el-button class="submit-btn" :loading="loading" @click="toConfirmInfo('firForm')">下一步</el-button>
        </el-form>
      </div>
      <div v-if="actItem === 1" class="sec-form">
        <el-form :model="secForm" :rules="secFormRules" ref="secForm">
          <el-form-item prop="useraccount" class="code-item">
            <el-input v-model="secForm.useraccount" placeholder="请输入账号id"></el-input>
            <span @click="quiryInfo('secForm')">查询信息</span>
          </el-form-item>
          <el-form
            :model="checkInfoForm"
            ref="checkInfoForm"
            label-width="82px"
            v-loading="loading"
          >
            <el-form-item label="姓名：">
              <el-input v-model="checkInfoForm.username" disabled placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input v-model="checkInfoForm.phone" disabled placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="身份证号：">
              <el-input v-model="checkInfoForm.idnumber" disabled placeholder="身份证号"></el-input>
            </el-form-item>
          </el-form>
          <el-button class="submit-btn" :loading="loading" @click="toConfirmIdentity">确认信息</el-button>
        </el-form>
      </div>
      <div v-if="actItem === 2" class="thi-form">
        <el-form :model="thirdForm" :rules="thirdFormRules" ref="thirdForm">
          <div class="number-tip">对方手机号{{checkInfoForm.phone}}已发送验证码，请通知对方查收。</div>
          <el-form-item prop="smsCode" class="code-item">
            <el-input v-model="thirdForm.smsCode" maxlength="6" placeholder="输入验证码"></el-input>
            <ge-code :config="configUser" ref="geCodeUser"></ge-code>
          </el-form-item>
          <el-button class="submit-btn" :loading="loading" @click="toAuthorize('thirdForm')">下一步</el-button>
        </el-form>
      </div>
      <div v-if="actItem === 3">
        <el-form :model="fourForm" :rules="fourFormRules" ref="fourForm">
          <el-form-item prop="creditlimit">
            <el-input v-model="fourForm.creditlimit" placeholder="输入授权额度"></el-input>
          </el-form-item>
          <el-form-item prop="risklimit">
            <el-input v-model="fourForm.risklimit" placeholder="输入风控额度"></el-input>
            <span class="tip">* 经销商使用的总额度大于风控额度时风控状态为风控超额。</span>
          </el-form-item>
          <el-button
            class="submit-btn"
            :loading="loading"
            @click="confirmAuthorize('fourForm')"
          >额度授权</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import geCode from "vue-gecode";
import { MessageBox } from "element-ui";
import { mapGetters } from "vuex";
import {
  sendSmsCode,
  checkMerSmsCode,
  queryUserInfo,
  sendUserSmsCode,
  checkUserSmsCode,
  save
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
      configUser: {
        startText: "获取验证码",
        endText: "再次获取",
        totalTime: 60, //多久一次
        tickTime: 1, //步值
        todo: async () => {
          try {
            const {
              code,
              data: { session }
            } = await sendUserSmsCode({
              sessionid: this.sessionSec,
              useraccount: this.secForm.useraccount
            });
            if (code === 200) {
              this.sessionThi = session;
            } else {
              this.msgError("短信发送失败！");
            }
          } catch (e) {
            this.$refs.geCodeUser.stop(1);
            console.log(e);
          }
        }, //调取方法
        computeText(num) {
          return "重新获取 " + num + "s";
        }
      },
      checkInfoForm: {
        username: "",
        phone: "",
        idnumber: ""
      },
      firForm: { smsCode: "" },
      firFormRules: {
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      secForm: { useraccount: "" },
      secFormRules: {
        useraccount: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ]
      },
      thirdForm: { smsCode: "" },
      thirdFormRules: {
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
      sessionSec: "",
      sessionThi: "",
      sessionFour: ""
    };
  },
  computed: {
    ...mapGetters(["userNumber"]),
    numberInit() {
      const num = this.userNumber;
      return num.substring(0, 3) + "*****" + num.substring(num.length - 2);
    }
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

    quiryInfo(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true;
          try {
            const {
              code,
              data: { username, phone, idnumber, session }
            } = await queryUserInfo({
              sessionid: this.sessionFir,
              ...this.secForm
            });
            this.loading = false;
            if (code === 200) {
              Object.assign(this.checkInfoForm, {
                username,
                phone,
                idnumber
              });
              this.sessionSec = session;
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

    toConfirmIdentity(formName) {
      const { username, phone, idnumber } = this.checkInfoForm;
      if (username !== "" && phone !== "" && idnumber !== "") {
        MessageBox.confirm("确认信息已经核对完成？", "系统提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "el-message-box-wran"
        }).then(() => {
          this.actItem = 2;
        });
      } else {
        MessageBox.confirm("核对信息不能为空。", "系统提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "el-message-box-wran"
        });
      }
    },

    toAuthorize(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true;
          try {
            const {
              code,
              data: { session }
            } = await checkUserSmsCode({
              sessionid: this.sessionThi,
              useraccount: this.secForm.useraccount,
              ...this.thirdForm
            });
            this.loading = false;
            if (code === 200) {
              this.sessionFour = session;
              this.actItem = 3;
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
            const { code, data } = await save({
              sessionid: this.sessionFour,
              useraccount: this.secForm.useraccount,
              ...this.fourForm
            });
            this.loading = false;
            if (code === 200) {
              this.msgSuccess("授权成功");
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
