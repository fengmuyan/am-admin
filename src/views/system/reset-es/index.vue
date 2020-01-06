<template>
  <div class="dashboard-editor-container">
    <el-button :loading="loading" style="margin:20px 30px" @click="resetEs">重置es</el-button>
  </div>
</template>

<script>
import { handelEsReset } from "@/api/reset-es";

export default {
  name: "Index",
  data() {
    return {
      loading: false
    };
  },

  methods: {
    async resetEs() {
      try {
        this.loading = true;
        const { code } = await handelEsReset();
        this.loading = false;
        if (code === 200) {
          this.msgSuccess("重置成功");
        }
      } catch (err) {
        console.log(err);
        this.loading = false;
      }
    }
  }
};
</script>