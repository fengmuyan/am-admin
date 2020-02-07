<template>
  <div class="app-container set-reply">
    <div class="base-info block" v-loading="loading" v-if="form" :style="{ 'min-height': parseInt(minHeight)-10+'px'  }">
      <div>
        <h4>
          客服回复信息设置
          <el-button size="mini" class="f-r" type="primary" setReply @click="setReply('form')">回复设置</el-button>
        </h4>
        <el-form :model="form" ref="form" :rules="formRules" label-width="110px">
          <el-form-item label="机器人回复：" prop="shopname">
            <el-switch v-model="form.rebot" style="margin-left:20px"></el-switch>
          </el-form-item>
          <el-form-item label="回复内容：" prop="rebotreply" v-if="form.rebot">
            <el-input
              type="textarea"
              v-model="form.rebotreply"
              placeholder="请输入回复内容"
              maxlength="150"
              show-word-limit
              style="width:400px"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { getReplyList, setReply } from "@/api/customer";
import minHeightMix from '@/mixins/minHeight'
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      replyList: [],
      form: null,
      formRules: {
        rebotreply: [
          { required: true, message: "请输入回复内容", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const {
          code,
          data: { rebot, rebotreply }
        } = await getReplyList();
        this.loading = false;
        let rebotInit;
        if (rebot === "Y") {
          rebotInit = true;
        } else if (rebot === "N") {
          rebotInit = false;
        }
        if (code === 200) {
          this.form = Object.assign(
            {},
            {
              rebotreply,
              rebot: rebotInit
            }
          );
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },

    async setReply(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loading = true;
            const { code } = await setReply({
              rebotreply: this.form.rebotreply,
              rebot: this.form.rebot === true ? "Y" : "N"
            });
            this.loading = false;
            if (code === 200) {
              this.msgSuccess("设置成功");
              this.getList();
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