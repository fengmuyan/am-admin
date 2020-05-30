<template>
  <div class="app-container my-shop">
    <div v-if="shopcode">
      <div class="base-info block" v-loading="loadingBase">
        <div v-if="baseBoxShow">
          <h4>
            基本信息
            <el-button
              size="mini"
              class="f-r"
              type="primary"
              @click="editBaseInfo('baseForm')"
            >修改基本信息</el-button>
          </h4>
          <el-form :model="baseForm" ref="baseForm" :rules="baseFormRules" label-width="110px">
            <el-form-item label="店铺logo：" class="upload-img">
              <el-upload
                class="avatar-uploader"
                action="#"
                list-type="picture-card"
                :show-file-list="false"
                :http-request="upload"
                :before-upload="handleBeforeUpload"
              >
                <img :src="imageUrl" class="avatar" />
                <span class="edit">点击修改</span>
              </el-upload>
              <ul class="tip-info">
                <li>* 图片尺寸要求：100*100像素。</li>
                <li>* 图片大小不大于2MB，上传格式为jpg/png等格式。</li>
              </ul>
            </el-form-item>
            <el-form-item label="店铺名称：" prop="shopname">
              <el-input
                v-model="baseForm.shopname"
                maxlength="30"
                clearable
                placeholder="请输入店铺名称"
                class="w400"
              ></el-input>
            </el-form-item>
            <el-form-item label="店铺slogan：" prop="slogan">
              <el-input
                v-model="baseForm.slogan"
                maxlength="20"
                clearable
                placeholder="请输入店铺slogan"
                class="w400"
              ></el-input>
              <div class="tip">* 显示在店铺名称下方的宣传语。</div>
            </el-form-item>
            <div class="adr-box">
              <el-form-item label="店铺地区：" prop="province" class="adr-item">
                <el-select
                  v-model="baseForm.province"
                  placeholder="请选择省份"
                  @change="provideChange"
                  filterable
                  class="w190"
                >
                  <el-option
                    v-for="item in provideArr"
                    :key="item.region_id"
                    :label="item.region_name"
                    :value="item.region_name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="city" class="city-item">
                <el-select
                  v-model="baseForm.city"
                  placeholder="请选择城市"
                  @change="cityChange"
                  filterable
                  class="w190"
                >
                  <el-option
                    v-for="item in cityArr"
                    :key="item.region_id"
                    :label="item.region_name"
                    :value="item.region_name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="area" class="area-item">
                <el-select v-model="baseForm.area" placeholder="请选择区县" filterable class="w190">
                  <el-option
                    v-for="item in areaArr"
                    :key="item.region_id"
                    :label="item.region_name"
                    :value="item.region_name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item label="详细地址：" prop="address">
              <el-input
                v-model="baseForm.address"
                maxlength="30"
                clearable
                placeholder="请输入详细地址"
                class="w400"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮政编码：" prop="zipCode">
              <el-input
                v-model="baseForm.zipCode"
                maxlength="10"
                clearable
                placeholder="请输入邮政编码"
                class="w400"
              ></el-input>
            </el-form-item>
            <el-form-item label="店铺简介：" prop="shopprofile">
              <el-input
                type="textarea"
                v-model="baseForm.shopprofile"
                placeholder="请输入店铺简介"
                maxlength="150"
                show-word-limit
                class="w400"
              ></el-input>
            </el-form-item>
            <el-form-item label="客服电话：" prop="servicephone">
              <el-input
                v-model="baseForm.servicephone"
                maxlength="11"
                clearable
                placeholder="请输入客服电话"
                class="w400"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="img-info block" v-loading="loadingImg">
        <div v-if="imgBoxShow">
          <h4>
            店铺图片
            <el-button size="mini" class="f-r" type="primary" @click="editImgInfo('imgForm')">修改店铺图片</el-button>
          </h4>
          <div class="img-box-wrap">
            <el-form :model="imgForm" ref="imgForm" :rules="imgFormRules" label-width="100px">
              <el-form-item label="店铺图片1：" prop="img_one" ref="uploadElement">
                <upload-img
                  @add-item="addItemFir"
                  @del-item="delItemFir"
                  :file="[imgForm.img_one]"
                  ref="imgItemOne"
                  v-model="imgForm.img_one"
                ></upload-img>
                <ul class="tip-info">
                  <li>* 图片尺寸要求：750*450像素。</li>
                  <li>* 图片至少传一张。</li>
                  <li>* 图片大小不大于3MB，上传格式为jpg/png等格式。</li>
                </ul>
              </el-form-item>
              <el-form-item label="店铺图片2：" prop="imgTwo">
                <upload-img @del-item="delImgItem" :file="[imgForm.img_two]" ref="imgItemTwo"></upload-img>
              </el-form-item>
              <el-form-item label="店铺图片3：" prop="imgThree">
                <upload-img @del-item="delImgItem" :file="[imgForm.img_three]" ref="imgItemThree"></upload-img>
              </el-form-item>
              <el-form-item label="店铺图片4：" prop="imgFour">
                <upload-img @del-item="delImgItem" :file="[imgForm.img_four]" ref="imgItemFour"></upload-img>
              </el-form-item>
            </el-form>
            <div class="img-box">
              <img :src="demoUrl" alt="#" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import City from "@/utils/city.js";
import UploadImg from "@/components/UploadImg";
import { getShopDetail, editBaseImgInfo } from "@/api/shop";
import { deepClone } from "@/utils";

export default {
  components: {
    UploadImg
  },
  data() {
    const validateTel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客服电话"));
      } else {
        if (!/^1[3|4|5|7|8][0-9]{9}$|^0\d{2,3}-?\d{7,8}$/.test(value)) {
          callback(new Error("请输入正确的客服电话"));
        }
        callback();
      }
    };
    return {
      loading: false,
      loadingBase: false,
      loadingImg: false,
      baseBoxShow: true,
      imgBoxShow: true,
      shopcode: "",
      baseForm: {
        shopname: "",
        slogan: "",
        shoplogo: "",
        province: "",
        city: "",
        area: "",
        provinceCode: "",
        cityCode: "",
        areaCode: "",
        address: "",
        zipCode: "",
        shopprofile: "",
        servicephone: ""
      },
      baseFormRules: {
        shopname: [
          { required: true, message: "请输入店铺名称", trigger: "blur" }
        ],
        province: [
          { required: true, message: "请选择地区", trigger: "blur" }
        ],
        city: [{ required: true, message: "请选择城市", trigger: "blur" }],
        area: [{ required: true, message: "请选择区县", trigger: "blur" }],
        address: [
          { required: true, message: "请输入详细地区", trigger: "blur" }
        ],
        zipCode: [
          { required: true, message: "请输入邮政编码", trigger: "blur" }
        ],
        shopprofile: [
          { required: true, message: "请输入商铺简介", trigger: "blur" }
        ],
        servicephone: [
          { validator: validateTel, required: true, trigger: "blur" }
        ],
        slogan: [
          { required: true, message: "请输入商铺slogan", trigger: "blur" }
        ]
      },
      imgForm: {
        img_one: null,
        img_two: null,
        img_three: null,
        img_four: null
      },
      imgFormRules: {
        img_one: [
          { required: true, message: "第一张图片不能为空", trigger: "blur" }
        ]
      },
      productImgs: [],
      provideArr: [],
      cityArr: [],
      areaArr: [],
      imageUrl: "",
      demoUrl: require("@/assets/image/demo.png")
    };
  },
  created() {
    this.getDetail();
  },
  mounted() {
    this.provideArr = City.provide;
  },
  methods: {
    async getDetail() {
      try {
        const {
          data: {
            storeImages,
            storeInfo: {
              shopname,
              shopprofile,
              servicephone,
              shoplogo,
              slogan,
              shopcode,
              province,
              city,
              area,
              provinceCode,
              cityCode,
              areaCode,
              zipcode,
              shoplocation
            }
          },
          code
        } = await getShopDetail();
        if (code === 200) {
          this.imageUrl = shoplogo
            ? shoplogo
            : "https://mounttai.oss-cn-beijing.aliyuncs.com/store/logo/logo.png";
          this.shopcode = shopcode;
          this.productImgs = storeImages.map(item => {
            return { serial: item.serial, uid: item.uid };
          });
          this.baseForm.shopname = shopname ? shopname : "";
          this.baseForm.slogan = slogan ? slogan : "";
          this.baseForm.shopprofile = shopprofile ? shopprofile : "";
          this.baseForm.servicephone = servicephone ? servicephone : "";
          this.baseForm.province = province;
          this.baseForm.city = city;
          this.baseForm.area = area;
          this.baseForm.provinceCode = provinceCode;
          this.baseForm.cityCode = cityCode;
          this.baseForm.areaCode = areaCode;
          this.baseForm.zipCode = zipcode;
          this.baseForm.address = shoplocation;
          this.cityArr = City.getCity(province);
          this.areaArr = City.getCity(city);
          const imgData = storeImages.map(item => {
            return Object.assign(item, { url: item.image });
          });
          const img_one = imgData.find(item => item.serial === 1);
          const img_two = imgData.find(item => item.serial === 2);
          const img_three = imgData.find(item => item.serial === 3);
          const img_four = imgData.find(item => item.serial === 4);
          Object.assign(this.imgForm, {
            img_one: img_one ? img_one : null,
            img_two: img_two ? img_two : null,
            img_three: img_three ? img_three : null,
            img_four: img_four ? img_four : null
          });
        }
      } catch (err) {
        console.log(err);
      }
    },

    provideChange() {
      this.baseForm.city = "";
      this.baseForm.area = "";
      this.cityArr = City.getCity(this.baseForm.province);
    },

    cityChange() {
      this.baseForm.area = "";
      this.areaArr = City.getCity(this.baseForm.city);
    },

    /* 删除图片匹配去掉productImgs中uid */
    delImgItem(uid) {
      const idx = this.productImgs.findIndex(item => {
        return item.uid === uid;
      });
      if (idx !== -1) {
        this.productImgs.splice(idx, 1);
      }
    },

    addItemFir(val) {
      this.imgForm.img_one = val[0];
      this.$refs["uploadElement"].clearValidate();
    },

    delItemFir(val) {
      this.imgForm.img_one = null;
      this.delImgItem(val);
    },

    upload(file) {
      let _this = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.file);
      reader.onload = function(e) {
        var newUrl = this.result;
        _this.imageUrl = newUrl;
      };
      this.baseForm.shoplogo = file.file;
    },

    handleBeforeUpload(file) {
      const isType = /^image\/(jpeg|png|jpg|tiff)$/.test(file.type);
      const isLt1M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error("请上传图片格式jpg/jpeg/png!");
      }
      if (!isLt1M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isType && isLt1M;
    },

    editBaseInfo(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loadingBase = true;
          this.baseBoxShow = false;
          let formData = new FormData();
          formData.append("moduleNum", "1");
          formData.append("shopname", this.baseForm.shopname);
          formData.append("shoplogo", this.baseForm.shoplogo);
          formData.append("slogan", this.baseForm.slogan);

          formData.append("province", this.baseForm.province);
          formData.append("city", this.baseForm.city);
          formData.append("area", this.baseForm.area);
          formData.append("provinceCode", City.getCode(this.baseForm.province));
          formData.append("cityCode", City.getCode(this.baseForm.city));
          formData.append("areaCode", City.getCode(this.baseForm.area));
          formData.append("zipCode", this.baseForm.zipCode);

          formData.append("address", this.baseForm.address);
          formData.append("shopprofile", this.baseForm.shopprofile);
          formData.append("servicephone", this.baseForm.servicephone);
          if (!this.baseForm.shoplogo) {
            formData.delete("shoplogo");
          }
          this.subData(formData);
        } else {
          return false;
        }
      });
    },

    editImgInfo(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loadingImg = true;
          this.imgBoxShow = false;
          const cloneData = deepClone(this.productImgs);
          let formData = new FormData();
          formData.append("moduleNum", "2");
          formData.append(
            "storeEventImages",
            JSON.stringify(
              cloneData.map(item => {
                return item.uid;
              })
            )
          );
          formData.append("img_one", this.$refs.imgItemOne.fileList[0]);
          formData.append("img_two", this.$refs.imgItemTwo.fileList[0]);
          formData.append("img_three", this.$refs.imgItemThree.fileList[0]);
          formData.append("img_four", this.$refs.imgItemFour.fileList[0]);
          this.productImgs.forEach(item => {
            if (Number(item.serial) === 1) {
              formData.delete("img_one");
            } else if (Number(item.serial) === 2) {
              formData.delete("img_two");
            } else if (Number(item.serial) === 3) {
              formData.delete("img_three");
            } else if (Number(item.serial) === 4) {
              formData.delete("img_four");
            }
          });
          this.subData(formData);
        } else {
          return false;
        }
      });
    },

    /* 提交数据接口 */
    async subData(formData) {
      try {
        const { code, msg } = await editBaseImgInfo(formData);
        if (code === 200) {
          await this.getDetail();
          this._loadingCancel();
          this.msgSuccess("修改成功");
        } else {
          this._loadingCancel();
        }
      } catch (err) {
        this._loadingCancel();
        console.log(err);
      }
    },

    /*清楚loading  */
    _loadingCancel() {
      this.loadingBase = false;
      this.loadingImg = false;
      this.baseBoxShow = true;
      this.imgBoxShow = true;
    }
  }
};
</script>