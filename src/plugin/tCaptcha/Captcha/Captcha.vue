<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import axios from "axios";
import { log } from "util";
export default {
  name: "Captcha",
  props: {
    parm: {
      type: Object,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    scene: {
      type: String,
      required: true
    }
  },
  data() {
    return {};
  },
  created() {
    console.log(validateCapt)
  },
  mounted() {
    this.init();
  },
  methods: {
    // 验证失败
    error(res) {
      this.$emit("callback", 0, res);
    },
    // 验证成功
    success(res) {
      this.$emit("callback", 1, res);
    },
    // 验证中
    loading(res) {
      this.$emit("callback", 2, res);
    },
    init() {
      // 腾讯验证码
      if (typeof window.TencentCaptcha !== "function") {
        const URL = "https://ssl.captcha.qq.com/TCaptcha.js";
        const scriptHeat = document.createElement("script");
        scriptHeat.type = "text/javascript";
        scriptHeat.src = URL;
        document.body.appendChild(scriptHeat);
        scriptHeat.onload = () => {
          this.TencentCaptchaInit();
        };
      } else {
        this.TencentCaptchaInit();
      }
    },
    TencentCaptchaInit() {
      const t = this;
      new TencentCaptcha(document.getElementById(t.id), t.parm.appid, function(
        res
      ) {
        if (res.ret === 0) {
          t.loading(res);
          const params = {
            tel: t.parm.tel,
            scene: t.scene,
            ticket: res.ticket,
            randstr: res.randstr,
            bizState: res.bizState
          };
          // 成功
          axios
            .post(t.url, params)
            .then(response => {
              if (response.data.code == 1) {
                t.success(response.data);
              } else {
                t.error(response.data);
              }
            })
            .catch(function(error) {
              t.error(error);
            });
        } else {
          t.error(res);
        }
      });
    }
  }
};
</script>
