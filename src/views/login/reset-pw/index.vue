<template>
  <div class="forget">
    <div class="lignPage">
      <el-steps :active="actItem" simple>
        <el-step title="身份验证" icon="el-icon-edit"></el-step>
        <el-step title="设置新密码" icon="el-icon-setting"></el-step>
        <el-step title="完成" icon="el-icon-check"></el-step>
      </el-steps>
    </div>
    <div class="lignPage">
      <div class="lignPage_inner" v-if="actItem === 0">
        <p>请任意选择一种验证方式，验证成功后可设置新密码。</p>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-form v-if="value === 0">
          <p>验证码将发送到绑定手机号136****6450</p>
          <el-form-item prop="code" class="codeItem">
            <el-input placeholder="输入验证码"></el-input>
            <ge-code :config="config" class="codeBtn"></ge-code>
          </el-form-item>
          <el-button class="btn bgGreen" @click="identityVerified">下一步</el-button>
        </el-form>
      </div>
      <div class="lignPage_inner" v-if="actItem === 1">
        <el-form>
          <el-form-item label prop="password">
            <el-input type="password" placeholder="新密码不能与旧密码相同"></el-input>
          </el-form-item>
        </el-form>
        <el-button class="btn bgGreen" @click="setNewPw">确 定</el-button>
      </div>
      <div class="lignPage_inner" v-if="actItem === 2">
        <div class="con_r">
          <h2 class="tit01 bd_b">密码重置成功！</h2>
          <el-button class="btn bgGreen" @click.native="$router.push({path: '/login'})">重新登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import geCode from "vue-gecode";
export default {
  components: {
    geCode
  },
  data() {
    return {
      actItem: 0,
      config: {
        startText: "获取验证码",
        endText: "再次获取",
        totalTime: 10,
        tickTime: 1,
        canTodo: () => {
          let result = /^1[345678]\d{9}$/.test(13699196450);
          if (!result) {
            this.$alert("手机号格式不正确！", "提示");
          }
          return result;
        },
        todo: async () => {},
        computeText(num) {
          return "重新获取 " + num + "s";
        }
      },
      options: [
        {
          value: 0,
          label: "手机号验证"
        }
      ],
      value: ""
    };
  },
  methods: {
    // 身份验证
    identityVerified() {
      this.actItem = 1;
    },

    setNewPw(form) {
      this.actItem = 2;
    }
  }
};
</script>

<style lang="scss">
.forget {
  background: #fff;
  width: 900px;
  margin: 0 auto;
  margin-top: 100px;
  border: 1px solid #ccc;
  .lignBox_inner {
    margin: 0 auto;
    width: 310px;
    margin: 0 auto;
  }
  .codeItem {
    position: relative;
    .el-input {
      display: inline-block;
      width: 49%;
    }
    .codeBtn {
      width: 115px;
      border: 1px solid #d9dada;
      border-radius: 3px;
      cursor: pointer;
      height: 36px;
      line-height: 36px;
      display: inline-block;
      color: #868686;
      text-align: center;
      margin-left: 35px;
    }
  }
  .lignPage {
    padding: 40px 0;
  }
}
</style>