<template>
  <div class="real-authorize">
    <div class="header-top">
      <div class="center-wrap">
        <h2>
          好多果平台
          <span>企业信息认证</span>
        </h2>
      </div>
    </div>
    <div class="center-wrap">
      <div class="mid-content">
        <div class="block codeForm infoForm">
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
              <el-input v-model="realAuthFrom.company" placeholder="企业名称" maxlength="30" clearable></el-input>
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
            <el-form-item label="企业营业执照" prop="business_license" class="file-item" ref="addItemBL">
              <upload-img @add-item="addItemBL" @del-item="delItemBL"></upload-img>
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
            <el-form-item label="法人证件号码" prop="IDCode" :rules="idCodeInit">
              <el-input v-model="realAuthFrom.IDCode" placeholder="法人证件号码" maxlength="25" clearable></el-input>
            </el-form-item>
            <el-form-item label="法人证件正面" prop="fr_cert_zm" class="file-item" ref="addItemFZ">
              <upload-img @add-item="addItemFZ" @del-item="delItemFZ"></upload-img>
            </el-form-item>
            <el-form-item label="法人证件反面" prop="fr_cert_fm" class="file-item" ref="addItemFF">
              <upload-img @add-item="addItemFF" @del-item="delItemFF"></upload-img>
            </el-form-item>
            <el-button class="submit-btn" :loading="loading" @click="toSuccess('realAuthFrom')">提 交</el-button>
          </el-form>
        </div>
      </div>
      <div class="footer-bot">企业用户注册需要填写企业名称及统一社会信用代码，请提前准备相关信息。</div>
    </div>
  </div>
</template>

<script>
import { realNameAuth } from "@/api/login";
import UploadImg from "@/components/UploadImg";
export default {
  components: {
    UploadImg
  },
  data() {
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
      loading: false, //下一步按钮loading
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
      rulesRealAuth: {
        quality: [
          { required: true, message: "请输入用户类型", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入法人姓名", trigger: "blur" }],
        IDType: [
          { required: true, message: "请输入证件类型", trigger: "blur" }
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
      } //公司信息验证
    };
  },
  computed: {
    idCodeInit() {
      const type = this.realAuthFrom.IDType;
      if (Number(type) === 0) {
        const IdCardNumberReg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
        return [
          { required: true, message: `请输入身份证号码`, trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (!IdCardNumberReg.test(value)) {
                callback(new Error("请输入正确格式的身份证号码！"));
              } else {
                callback();
              }
            },
            trigger: ["change", "blur"]
          }
        ];
      } else if (Number(type) === 1) {
        return [{ required: true, message: `请输入护照号码`, trigger: "blur" }];
      }
    }
  },
  methods: {
    /* 提交公司信息认证 */
    toSuccess(form) {
      console.log(this.realAuthFrom);
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
          try {
            const { code, msg } = await realNameAuth(formData);
            this.loading = false;
            if (code === 200) {
              this.msgSuccess("提交成功，请等候实名信息审核。");
              setTimeout(() => {
                this.$store.dispatch("GetInfo").then(res => {
                  this.$router.push({ path: "/" });
                });
              }, 1500);
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
    },

    /* 企业营业执照上传更新form数据*/
    delItemBL(val) {
      this.realAuthFrom.business_license = null;
    },

    /* 法人身份证正面上传更新form数据*/
    delItemFZ(val) {
      this.realAuthFrom.fr_cert_zm = null;
    },

    /* 法人身份证反面上传更新form数据*/
    delItemFF(val) {
      this.realAuthFrom.fr_cert_fm = null;
    }
  }
};
</script>
