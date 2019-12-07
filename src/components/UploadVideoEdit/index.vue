<template>
  <div class="uploadImg">
    <el-upload
      :class="{'upload-demo':true,'can-add':!isShow}"
      action
      :http-request="upload"
      list-type="picture-card"
      :before-upload="beforeUploadVideo"
      :show-file-list="false"
    >
      <video v-if="video !==''" :src="video" controls="controls" class="video">您的浏览器不支持视频播放</video>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: true,
      video: ""
    };
  },
  props: {
    file: {
      type: Object
    }
  },
  created() {
    this.video = this.file.video;
  },
  methods: {
    beforeUploadVideo(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb"
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过10MB哦!");
        return false;
      }
    },
    upload(file) {
      this.video = file.file;
    }
  }
};
</script>