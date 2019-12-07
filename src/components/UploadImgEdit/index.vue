<template>
  <div class="uploadImg">
    <el-upload
      :class="{'upload-demo':true,'can-add':!isShow}"
      action
      :http-request="upload"
      :on-remove="handleRemove"
      :before-upload="handleBeforeUpload"
      list-type="picture-card"
      :file-list="fileList"
      :limit="1"
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
      fileList: []
    };
  },
  props: {
    file: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  created() {
    this.fileList = this.file;
    this._hiddenPlus();
  },
  methods: {
    handleRemove(file, fileList) {
      this.$emit("del-item", file.uid);
      this.fileList = [];
      this._hiddenPlus();
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
      this.fileList[0] = file.file;
      this._hiddenPlus()
    },

    _hiddenPlus() {
      if (this.fileList.length === 1) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    }
  }
};
</script>

