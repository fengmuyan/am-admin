<template>
  <div class="login-container">
    <div class="login-center">
      <el-form
        class="login-form"
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">系 统 运 营 管 理 平 台</h3>
        </div>
        <div class="content">
          <el-form-item prop="username">
            <div class="tip">账号</div>
            <el-input
              name="username"
              auto-complete="off"
              type="text"
              v-model="loginForm.username"
              placeholder="用户名"
            />
          </el-form-item>
          <el-form-item class="pw-item" prop="password">
            <div class="tip">密码</div>
            <el-input
              name="password"
              type="password"
              auto-complete="off"
              v-model="loginForm.password"
              placeholder="密码"
            />
          </el-form-item>
          <div class="extra-item">
            <router-link :to="'forget-pw'">忘记密码？</router-link>
            <router-link class="register" :to="'register'">立即注册</router-link>
          </div>
          <el-form-item>
            <el-button class="verify-btn" id="Captcha">
              <span :class="['verify-box',captchaStatus === 2 ? 'ac-verify-box' : '']">
                <img v-if="captchaStatus === 0" src="../assets/image/index02.png" alt="icon" />
                <img v-if="captchaStatus === 2" src="../assets/image/index01.png" alt="icon" />
                点击完成验证
              </span>
              <div v-if="captchaTip" class="el-form-item__error">请完成验证</div>
            </el-button>
          </el-form-item>
        </div>
        <el-button type="primary" class="submit" :loading="loading" @click="handleLogin">登 录</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "admin123"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [{ required: true, trigger: "blur", message: "密码不能为空" }]
      },
      loading: false,
      redirect: undefined,
      captchaStatus: 0,
      randstr: "",
      ticket: "",
      captchaTip: false
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
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
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid && this.captchaStatus === 2) {
          this.loading = true;
          const {
            randstr,
            ticket,
            loginForm: { username, password }
          } = this;
          this.$store
            .dispatch("Login", { randstr, ticket, username, password })
            .then(() => {
              this.loading = false;
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.captchaStatus = 0;
              this.loading = false;
            });
        } else {
          this.captchaTip = true;
          return false;
        }
      });
    },
    tencentCaptchaInit() {
      new TencentCaptcha(
        document.getElementById("Captcha"),
        "2075840643",
        async ({ ret, randstr, ticket }) => {
          if (ret === 0) {
            this.captchaStatus = 2;
            this.captchaTip = false;
            this.randstr = randstr;
            this.ticket = ticket;
          }
        }
      );
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: fixed;
  height: 100%;
  width: 100%;
  background: url("../assets/image/login-bg1.png") center center no-repeat;
  background-attachment: fixed;
  background-size: cover;
  .login-center {
    width: 500px;
    height: 555px;
    overflow: hidden;
    background-attachment: fixed;
    background-color: rgba(255, 255, 255, 0.75);
    display: flex;
    flex-direction: column;
    align-items: center;
    .title-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        margin: 0;
        font-size: 32px;
        color: #5570c5;
        height: 130x;
        line-height: 130px;
        text-align: center;
        font-weight: bolder;
      }
    }
    .content {
      .el-form-item {
        margin-bottom: 30px;
        .tip {
          font-size: 16px;
          height: 16px;
          line-height: 16px;
        }
        .el-input {
          font-size: 20px;
          .el-input__inner {
            padding: 0;
            border-color: transparent;
            background-color: transparent;
            height: 58px;
            line-height: 58px;
            color: #5570c5;
            border-bottom-color: #5570c5;
            border-radius: 0;
          }
        }
      }
      .pw-item {
        margin-bottom: 0;
        .el-input {
          .el-input__inner {
            height: 50px;
            line-height: 50px;
          }
        }
      }
      .extra-item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        padding: 0 3px;
        .register {
          color: #5570c5;
        }
        margin-bottom: 10px;
      }
    }
    .submit {
      width: 392px;
      height: 60px;
      font-size: 18px;
      color: #fff;
      border-color: #6287fd;
      background-color: #6287fd;
      border-radius: 8px;
      box-shadow: 0 0 5px rgba(60, 60, 60, 0.5);
    }
    .verify-box {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      width: 120px;
      justify-content: space-between;
    }
    .ac-verify-box {
      color: #5570c5;
    }
    .verify-btn {
      width: 390px;
      height: 60px;
      background-color: #eff0f2;
      border-radius: 8px;
      font-size: 14px;
      color: #666;
    }
    .verify-btn-done {
      color: #5570c5;
    }
  }
  input {
    text-fill-color: #fff;
    -webkit-text-fill-color: #5570c5;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-transition-delay: 99999s;
    -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
  }
}
</style>
