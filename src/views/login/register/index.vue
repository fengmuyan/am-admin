<template>
  <div class="register">
    <div class="header-top">
      <div class="center-wrap">
        <h2>
          水果电商平台
          <span>企业注册</span>
        </h2>
        <p>
          已有账号？
          <router-link class="to-login" to="/login">请登录</router-link>
        </p>
      </div>
    </div>
    <div class="center-wrap">
      <div class="mid-content">
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
              <span :class="{ac:!(actItem<0)}">验证手机号</span>
              <span :class="{ac:!(actItem<1)}">填写账号信息</span>
              <span :class="{ac:!(actItem<2)}">填写公司信息</span>
              <span :class="{ac:actItem===3}">注册成功</span>
            </div>
          </div>
        </div>
        <div>
          <div v-if="actItem === 0" class="codeForm">
            <el-form :model="codeForm" :rules="rulesCode" ref="codeForm">
              <el-form-item prop="phone" class="phone-item">
                <span>中国 +86</span>
                <el-input
                  v-model="codeForm.phone"
                  type="text"
                  maxlength="11"
                  placeholder="请填写常用手机号"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="captchaStatus === 2" prop="smsCode" class="code-item">
                <el-input v-model="codeForm.smsCode" maxlength="6" placeholder="输入验证码"></el-input>
                <ge-code :config="config" ref="geCode"></ge-code>
              </el-form-item>
              <el-form-item class="captcha-item">
                <span v-show="captchaStatus === 0" id="Captcha" ref="captcha" class="verify-btn">
                  <img src="../../../assets/image/code.png" alt="icon" />点击完成验证
                </span>
                <div v-if="captchaTip" class="el-form-item__error">请完成验证</div>
              </el-form-item>
              <el-form-item class="agreen" prop="radioVal">
                <el-checkbox-group v-model="codeForm.radioVal">
                  <el-checkbox label="0" class="autolg">我已阅读并同意</el-checkbox>
                </el-checkbox-group>
                <a class="colorGreen">《企业用户注册协议》</a>
              </el-form-item>
              <span class="submit-btn" @click="toPwFrom('codeForm')">下一步</span>
            </el-form>
          </div>
          <div v-if="actItem === 1" class="block codeForm pwFrom">
            <el-form :model="pwFrom" :rules="rulesPw" ref="pwFrom">
              <div>
                <el-form-item prop="userAccount">
                  <el-input
                    type="text"
                    maxlength="20"
                    v-model="pwFrom.userAccount"
                    placeholder="输入用户账号"
                  ></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    maxlength="20"
                    v-model="pwFrom.password"
                    placeholder="输入8到20位密码"
                  ></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item prop="confirmPw">
                  <el-input
                    type="password"
                    maxlength="20"
                    v-model="pwFrom.confirmPw"
                    placeholder="确认密码"
                  ></el-input>
                </el-form-item>
              </div>
              <el-button class="submit-btn2" :loading="loading" @click="toRealAuthFrom('pwFrom')">下一步</el-button>
            </el-form>
          </div>
          <div v-if="actItem === 2" class="block codeForm infoForm">
            <el-form
              ref="realAuthFrom"
              :model="realAuthFrom"
              :rules="rulesRealAuth"
              label-width="110px"
            >
              <el-form-item label="用户类型" prop="quality" class="radio-item">
                <el-radio-group v-model="realAuthFrom.quality">
                  <el-radio label="1">企业</el-radio>
                  <el-radio label="2">个体工商户</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="企业名称" prop="company">
                <el-input
                  v-model="realAuthFrom.company"
                  placeholder="企业名称"
                  maxlength="30"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="联系人电话" prop="contactsPhone">
                <el-input
                  v-model="realAuthFrom.contactsPhone"
                  placeholder="联系人电话"
                  maxlength="15"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="企业地址" prop="contactsAddress">
                <el-input
                  v-model="realAuthFrom.contactsAddress"
                  placeholder="企业地址"
                  maxlength="30"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="企业信用代码" prop="companyNo">
                <el-input
                  v-model="realAuthFrom.companyNo"
                  placeholder="企业信用代码"
                  maxlength="30"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item
                label="企业营业执照"
                prop="business_license"
                class="file-item"
                ref="addItemBL"
              >
                <upload-img :limit="1" @add-item="addItemBL"></upload-img>
              </el-form-item>
              <el-form-item label="法人姓名" prop="name">
                <el-input v-model="realAuthFrom.name" placeholder="填写企业名称" maxlength="30" clearable></el-input>
              </el-form-item>
              <el-form-item label="法人证件类型" prop="IDType" class="radio-item">
                <el-radio-group v-model="realAuthFrom.IDType">
                  <el-radio label="0">身份证</el-radio>
                  <el-radio label="1">护照</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="法人证件号码" prop="IDCode">
                <el-input
                  v-model="realAuthFrom.IDCode"
                  placeholder="法人证件号码"
                  maxlength="25"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="法人证件正面" prop="fr_cert_zm" class="file-item" ref="addItemFZ">
                <upload-img :limit="1" @add-item="addItemFZ"></upload-img>
              </el-form-item>
              <el-form-item label="法人证件反面" prop="fr_cert_fm" class="file-item" ref="addItemFF">
                <upload-img :limit="1" @add-item="addItemFF"></upload-img>
              </el-form-item>
              <el-button
                class="submit-btn"
                :loading="loading"
                @click="toSuccess('realAuthFrom')"
              >提 交</el-button>
            </el-form>
          </div>
          <div v-if="actItem === 3" class="block">
            <div class="suc-box">
              <img class="suc-img" src="../../../assets/image/loginsuc.png" alt="#" />
              <div class="suc-title">注册成功~</div>
              <p class="suc-text">您的企业账户已注册成功，您可以使用此平台了~</p>
              <el-button class="suc-btn" @click.native="$router.replace({path: '/'})">前往登录</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bot">企业用户注册需要填写企业名称及统一社会信用代码，请提前准备相关信息。</div>
    </div>
  </div>
</template>

<script>
import geCode from "vue-gecode";
import UploadImg from "@/components/UploadImg";
import {
  validateCapt,
  submitCapt,
  submitAccountInfo,
  submitRealAuth,
  submitRealInfo
} from "@/api/login";
export default {
  components: {
    geCode,
    UploadImg
  },
  data() {
    const IdCardNumberReg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
    const PassportNumberReg = /^1[45][0-9]{7}$|(^[P|p|S|s]\d{7}$)|(^[S|s|G|g|E|e]\d{8}$)|(^[Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|(^[H|h|M|m]\d{8,10}$)/;
    const validateTel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else {
        if (!/^1[345678]\d{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        }
        callback();
      }
    }; //验证手机号格式
    const validatePw = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (value.length > 20 || value.length < 8) {
          callback(new Error("请输入8到20密码"));
        }
        if (this.pwFrom.confirmPw !== "") {
          this.$refs.pwFrom.validateField("confirmPw");
        }
        callback();
      }
    }; //验证密码格式
    const validateConfirmPw = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.pwFrom.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    }; //验证两次密码一致
    const validateTelP = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入联系人电话"));
      } else {
        if (!/^1[3|4|5|7|8][0-9]{9}$|^0\d{2,3}-?\d{7,8}$/.test(value)) {
          callback(new Error("请输入正确的联系人电话"));
        }
        callback();
      }
    };
    return {
      actItem: 0, //当前进行的step
      loading: false, //下一步按钮loading
      captchaStatus: 0, //腾讯验证标志 0未验证 2已验证
      codeForm: {
        phone: "",
        smsCode: "",
        radioVal: ["0"]
      }, //手机号验证对应表单
      pwFrom: {
        password: "",
        userAccount: "",
        confirmPw: ""
      }, //账号信息对应表单
      realAuthFrom: {
        quality: "1", // 用户性质  0个人、1企业、2个体工商户
        name: "", // 姓名/法人姓名
        IDType: "0", // 0身份证 1护照
        IDCode: "", // 证件号码/法人证件号码
        fr_cert_zm: "", //法人证件正面,
        fr_cert_fm: "", //法人证件反面
        company: "", //企业名称
        companyNo: "", // 企业社会统一信用代码
        contactsPhone: "", //联系人电话
        contactsAddress: "", // 企业地址
        business_license: "" //营业执照
      }, //公司信息对应表单
      config: {
        startText: "获取验证码",
        endText: "再次获取",
        totalTime: 60, //多久一次
        tickTime: 1, //步值
        canTodo: () => {
          if (this.isFirst) {
            return true;
          } else {
            this.$refs.captcha.click();
            return false;
          }
        }, //调取前验证
        todo: async () => {}, //调取方法
        computeText(num) {
          return "重新获取 " + num + "s";
        }
      }, //短信验证码配置
      rulesCode: {
        phone: [
          {
            validator: validateTel,
            required: true,
            trigger: ["change", "blur"]
          }
        ],
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        radioVal: [
          {
            type: "array",
            required: true,
            message: "请阅读并同意协议",
            trigger: ""
          }
        ]
      }, //验证手机号验证
      rulesPw: {
        userAccount: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        password: [{ validator: validatePw, required: true, trigger: "blur" }],
        confirmPw: [
          { validator: validateConfirmPw, required: true, trigger: "blur" }
        ]
      }, //账号信息验证
      rulesRealAuth: {
        quality: [
          { required: true, message: "请输入用户类型", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入法人姓名", trigger: "blur" }],
        IDType: [
          { required: true, message: "请输入证件类型", trigger: "blur" }
        ],
        IDCode: [
          { required: true, message: "请输入证件号码", trigger: "blur" }
        ],
        company: [
          { required: true, message: "请输入企业名称", trigger: "blur" }
        ],
        companyNo: [
          { required: true, message: "请输入企业信用代码", trigger: "blur" }
        ],
        contactsPhone: [
          {
            validator: validateTelP,
            required: true,
            trigger: ["change", "blur"]
          }
        ],
        contactsAddress: [
          { required: true, message: "请输入企业地址", trigger: "blur" }
        ],
        business_license: [
          { required: true, message: "请上传营业执照", trigger: "change" }
        ],
        fr_cert_zm: [
          { required: true, message: "请上传法人证件正面", trigger: "change" }
        ],
        fr_cert_fm: [
          { required: true, message: "请上传法人证件反面", trigger: "change" }
        ]
      }, //公司信息验证
      isFirst: true, //是否第一次调用腾讯滑动
      firSession: "", //下一步标识
      secSession: "", //下一步标识
      captchaTip: false //滑动验证el验证
    };
  },
  mounted() {
    if (typeof window.TencentCaptcha !== "function") {
      const URL = "https://ssl.captcha.qq.com/TCaptcha.js";
      const scriptHeat = document.createElement("script");
      scriptHeat.type = "text/javascript";
      scriptHeat.src = URL;
      document.body.appendChild(scriptHeat);
      scriptHeat.onload = () => {
        this.tencentCaptchaInit();
      };
    } else {
      this.tencentCaptchaInit();
    }
  },
  methods: {
    /* 验证手机号验证码 */
    toPwFrom(form) {
      this.$refs[form].validate(async valid => {
        if (valid && this.captchaStatus === 2) {
          const { phone, smsCode } = this.codeForm;
          try {
            const {
              code,
              data: { session }
            } = await submitCapt({ phone, smsCode });
            if (code === 200) {
              this.actItem = 1;
              this.firSession = session;
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          this.captchaTip = this.captchaStatus !== 2;
          return false;
        }
      });
    },

    /* 验证账号和密码 */
    toRealAuthFrom(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          this.loading = true;
          const {
            firSession: sessionId,
            pwFrom: { password, userAccount }
          } = this;
          try {
            const {
              code,
              data: { session }
            } = await submitAccountInfo({
              sessionId,
              password,
              userAccount
            });
            if (code === 200) {
              this.loading = false;
              this.secSession = session;
              this.actItem = 2;
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

    /* 提交公司信息认证 */
    toSuccess(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          this.loading = true;
          let formData = new FormData();
          formData.append("quality", Number(this.realAuthFrom.quality));
          formData.append("IDType", Number(this.realAuthFrom.IDType));
          formData.append("name", this.realAuthFrom.name);
          formData.append("IDCode", this.realAuthFrom.IDCode);
          formData.append("company", this.realAuthFrom.company);
          formData.append("companyNo", this.realAuthFrom.companyNo);
          formData.append("contactsPhone", this.realAuthFrom.contactsPhone);
          formData.append("contactsAddress", this.realAuthFrom.contactsAddress);
          formData.append(
            "business_license",
            this.realAuthFrom.business_license
          );
          formData.append("fr_cert_zm", this.realAuthFrom.fr_cert_zm);
          formData.append("fr_cert_fm", this.realAuthFrom.fr_cert_fm);
          formData.append("sessionId", this.secSession);
          try {
            const { code, msg } = await submitRealInfo(formData);
            if (code === 200) {
              this.loading = false;
              this.actItem = 3;
            } else {
              this.loading = false;
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

    /* 调腾讯滑动验证*/
    tencentCaptchaInit() {
      new TencentCaptcha(
        document.getElementById("Captcha"),
        "2075840643",
        ({ ret, randstr, ticket }) => {
          if (ret === 0) {
            this.$refs["codeForm"].validate(async valid => {
              if (valid) {
                const phone = this.codeForm.phone;
                const { code } = await validateCapt({
                  phone,
                  captcha: {
                    randstr,
                    ticket
                  }
                });
                if (code === 200) {
                  this.captchaStatus = 2;
                  this.captchaTip = false;
                  await this.$nextTick();
                  if (this.isFirst === false) {
                    this.isFirst = true;
                  }
                  this.$refs.geCode.runtime();
                  this.isFirst = false;
                }
              } else {
                return false;
              }
            });
          }
        }
      );
    },

    /* 企业营业执照上传更新form数据*/
    addItemBL(val) {
      this.realAuthFrom.business_license = val[0];
      this.$refs["addItemBL"].clearValidate();
    },

    /* 法人身份证正面上传更新form数据*/
    addItemFZ(val) {
      this.realAuthFrom.fr_cert_zm = val[0];
      this.$refs["addItemFZ"].clearValidate();
    },

    /* 法人身份证反面上传更新form数据*/
    addItemFF(val) {
      this.realAuthFrom.fr_cert_fm = val[0];
      this.$refs["addItemFF"].clearValidate();
    }
  }
};
</script>
