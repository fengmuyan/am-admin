<template>
  <div class="uploadImg">
    <el-upload
      :class="{'upload-demo':true,'can-add':!isShow}"
      action
      :http-request="upload"
      :on-remove="handleRemove"
      :before-upload="handleBeforeUpload"
      list-type="picture-card"
      :limit="limit"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>
<script>
export default {
  name: "uploadImg",
  data() {
    return {
      isShow: true,
      uploadImg: []
    };
  },
  props: {
    limit: {
      type: Number,
      required: true
    }
  },
  methods: {
    handleRemove(file, fileList) {
      const index = this.uploadImg.findIndex(item => {
        return file.uid === item.uid;
      });
      this.uploadImg.splice(index, 1);
      if (this.uploadImg.length < this.limit) {
        this.isShow = true;
      }
      this.$emit("add-item", this.uploadImg);
    },

    handleBeforeUpload(file) {
      const typeArr = ["image/jpeg", "image/png"];
      const isType = typeArr.includes(file.type);
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isType) {
        this.$message.error("请上传图片格式jpg/jpeg/png!");
      }
      if (!isLt3M) {
        this.$message.error("上传图片大小不能超过 3MB!");
      }
      return isType && isLt3M;
    },

    upload(file) {
      this.uploadImg.push(file.file);
      if (this.uploadImg.length === this.limit) {
        this.isShow = false;
      }
      this.$emit("add-item", this.uploadImg);
    }
  }
};
</script>

