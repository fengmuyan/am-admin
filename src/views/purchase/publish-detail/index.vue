<template>
  <div class="pur-publish app-container">
    <div v-loading="loading">
      <div class="block">
        <h4>自然属性</h4>
        <el-form
          :model="titleForm"
          ref="titleForm"
          :rules="titleFormRules"
          label-width="110px"
          class="b-t-g m-b-20"
        >
          <el-form-item label="商品编号：" prop="producode">
            <el-input v-model="titleForm.producode" class="w-400" maxlength="30" disabled></el-input>
          </el-form-item>
          <el-form-item label="分类名称：" prop="cname">
            <el-input v-model="titleForm.cname" class="w-400" maxlength="30" disabled></el-input>
          </el-form-item>
          <el-form-item label="产地：" prop="producerName">
            <el-input v-model="titleForm.producerName" class="w-400" maxlength="30" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品名称：" prop="cmdtname">
            <el-input v-model="titleForm.cmdtname" class="w-400" maxlength="30" disabled></el-input>
          </el-form-item>
          <el-form-item label="展示分类：" prop="homepageclass">
            <el-radio-group v-model="titleForm.homepageclass">
              <el-radio
                v-for="(item,index) in homePageClasses"
                :label="item.hcode"
                :key="index"
              >{{item.hname}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="代卖商品：" prop="isAgent">
            <el-radio-group v-model="titleForm.isAgent">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="titleForm.isAgent==='Y'" label="供货商：" prop="pmercode">
            <el-select v-model="titleForm.pmercode" placeholder="请选择供货商" class="w-400">
              <el-option
                v-for="item in supplierList"
                :key="item.pmercode"
                :label="item.name"
                :value="item.pmercode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="block">
        <h4>销售属性</h4>
        <el-form
          :model="valuationForm"
          ref="valuationForm"
          :rules="valuationRules"
          label-width="110px"
          class="b-t-g m-b-20"
        >
          <el-form-item label="计价方式：" prop="pricetype">
            <el-radio-group v-model="valuationForm.pricetype" @change="pricetypeChange">
              <el-radio label="1">按数量</el-radio>
              <el-radio label="2">按重量</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="valuationForm.pricetype === '1'">
            <el-form-item label="规格：" prop="cmdtspecifications">
              <el-input
                v-model="valuationForm.cmdtspecifications"
                maxlength="20"
                class="w-400"
                placeholder="请输入规格 (如：30公斤/件)"
                clearable
              ></el-input>
            </el-form-item>
          </div>
          <div v-if="valuationForm.pricetype === '2'">
            <el-form-item label="重量单位：" prop="typeCode">
              <el-input v-model="valuationForm.typeCode" class="w-400" maxlength="30" disabled></el-input>
            </el-form-item>
            <el-form-item label="净重：" prop="netweight">
              <el-input
                v-model="valuationForm.netweight"
                maxlength="8"
                class="w-400"
                placeholder="请输入净重"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="毛重：" prop="grossweight">
              <el-input
                v-model="valuationForm.grossweight"
                maxlength="8"
                class="w-400"
                placeholder="请输入毛重"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="必须称重：" prop="requiredWeigh">
              <el-radio-group v-model="valuationForm.requiredWeigh">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <el-form-item label="折扣方式：" prop="isdiscount">
            <el-radio-group v-model="valuationForm.isdiscount">
              <el-radio label="1">有折扣</el-radio>
              <el-radio label="2">无折扣</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <dynamic-form
          v-if="formIsShow"
          v-model="saleDataInit"
          :isHaveTable="true"
          @table-show="tableShow"
          @checkbox="checkBoxChange"
          ref="dynamicFormSale"
        ></dynamic-form>
        <dynamic-table
          v-if="tableIsShow"
          :itemIdArr="itemIdArr"
          :tableArr="tableArr"
          ref="dynamicTable"
        ></dynamic-table>
      </div>
      <div class="block">
        <h4>图文描述</h4>
        <div class="upload">
          <el-form
            label-width="120px"
            :model="uploadForm"
            ref="uploadForm"
            :rules="uploadFormRules"
            style="width:100%"
          >
            <div class="b-t-g m-b-20">
              <div class="img-wrap">
                <el-form-item label="商品主图：" prop="img_one" ref="uploadElement">
                  <upload-img @add-item="addItemFir" @del-item="delItemFir" ref="imgItemFir"></upload-img>
                </el-form-item>
                <el-form-item label="商品图：" prop="img_two" class="imgs-item">
                  <upload-img ref="imgItemSec"></upload-img>
                  <upload-img ref="imgItemThree"></upload-img>
                  <upload-img ref="imgItemFour"></upload-img>
                </el-form-item>
                <el-form-item label="商品底图：" prop="img_five">
                  <upload-img ref="imgItemFive"></upload-img>
                </el-form-item>
              </div>
              <p class="tip-info">* 图片小于3MB通用格式。 * 图片建议上传750*750更好的展示效果。 * 商品图最多可传3张。</p>
            </div>
            <div class="b-t-g m-b-20">
              <el-form-item label="主图视频比例：" prop="proportion">
                <el-radio-group v-model="uploadForm.proportion">
                  <el-radio label="1">1:1</el-radio>
                  <el-radio label="2">16:9</el-radio>
                  <el-radio label="3">3:4</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="主图视频：" prop="master_video">
                <upload-video @add-item="addVideoFir" v-model="uploadForm.master_video"></upload-video>
              </el-form-item>
              <p class="tip-info">* 视频不大于10MB通用格式。 * 点击视频可更换。 * 用于商品主页展示。</p>
            </div>
            <el-form-item label="商品详情视频：" prop="baby_video">
              <upload-video @add-item="addVideoSec" v-model="uploadForm.baby_video"></upload-video>
            </el-form-item>
            <el-form-item label="手机端描述：" prop="phoneDesc" class="editor-item" ref="phoneDesc">
              <editor @input="phoneEditor" v-model="uploadForm.phoneDesc" :moduleNum="1"></editor>
            </el-form-item>
            <p class="tip-info">* 商品详情视频在商品详情页展示。</p>
          </el-form>
        </div>
      </div>
      <div class="block">
        <h4>支付信息</h4>
        <el-form :model="payForm" ref="payForm" :rules="payFormRules" label-width="110px">
          <el-form-item label="付款方式：" prop="paymethod">
            <el-radio-group v-model="payForm.paymethod">
              <el-radio label="1">普通交易</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="库存计数：" prop="stockmethod">
            <el-radio-group v-model="payForm.stockmethod">
              <el-radio label="1">买家拍下减库存</el-radio>
              <el-radio label="2">买家付款减库存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="block">
        <h4>物流信息</h4>
        <el-form
          :model="logisticsForm"
          ref="logisticsForm"
          :rules="logisticsFormRules"
          label-width="120px"
        >
          <el-form-item label="发货方式：" prop="deliverymode">
            <el-radio-group
              v-model="logisticsForm.deliverymode"
              @change="logisticsForm.issupsubstitute = false"
            >
              <el-radio label="1">自提</el-radio>
              <el-radio label="2">发货</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="logisticsForm.issupsubstitute"
              :disabled="logisticsForm.deliverymode!=='1'"
            >代发</el-checkbox>
            <span class="logistics-adr">{{`代发地址：${storeInfo.province}${storeInfo.city}。`}}</span>
            <p
              class="tip-info"
              style="line-height: 20px;padding-left: 0;"
            >* 如果客户不自提，可选择代发，即由商户代客户发物流，物流费用由客户承担。</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="block">
        <h4>售后服务</h4>
        <el-form
          :model="postSaleForm"
          ref="postSaleForm"
          :rules="postSaleFormRules"
          label-width="110px"
        >
          <el-form-item label="提供发票：" prop="invoice">
            <el-radio-group
              v-model="postSaleForm.invoice"
              @change="postSaleForm.ticketType = ['1']"
            >
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="ticketType">
            <el-checkbox-group
              v-model="postSaleForm.ticketType"
              :disabled="postSaleForm.invoice === '0'"
            >
              <el-checkbox label="1">普通发票</el-checkbox>
              <el-checkbox label="2">增值税发票</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="上架状态：" prop="state">
            <el-radio-group v-model="postSaleForm.state">
              <el-radio label="1">立即上架</el-radio>
              <el-radio label="4">定时上架</el-radio>
              <el-radio label="3">放入仓库</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="this.postSaleForm.state === '4'" label="上架时间：" prop="publishtime">
            <el-date-picker
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="postSaleForm.publishtime"
              placeholder="请输入上架时间"
              class="w-400"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <el-button type="primary" @click="formdataSubVerify">发布商品</el-button>
    </div>
  </div>
</template>
<script>
import DynamicForm from "@/components/DynamicForm";
import DynamicTable from "@/components/DynamicTable";
import UploadImg from "@/components/UploadImg";
import UploadVideo from "@/components/UploadVideo";
import Editor from "@/components/Editor";
import minHeightMix from "@/mixins/minHeight";
import {
  getProData,
  getHomePageClass,
  getSupplierList
} from "@/api/product";
import { handelPublishInit, handelPublish } from "@/api/purchase";
import {
  initFormData,
  deInitFormData,
  toCombination,
  InitTableData,
  setRowSpan,
  sortTableArr,
  deepClone,
  setTableSubData,
  initInvoiceSub
} from "@/utils";

export default {
  mixins: [minHeightMix],
  components: {
    DynamicForm,
    DynamicTable,
    UploadImg,
    UploadVideo,
    Editor
  },
  data() {
    const patter = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    const validateNetWeight = (rule, value, callback) => {
      if (!patter.test(value)) {
        callback(new Error("必须非负整数或至多保留两位小数！"));
      } else {
        if (this.valuationForm.grossweight !== "") {
          this.$refs.valuationForm.validateField("grossweight");
        }
        callback();
      }
    };
    const validateGrossWeight = (rule, value, callback) => {
      if (!patter.test(value)) {
        callback(new Error("必须非负整数或至多保留两位小数！"));
      } else if (
        !(
          Number(value) > Number(this.valuationForm.netweight) ||
          Number(value) === Number(this.valuationForm.netweight)
        )
      ) {
        callback(new Error("净重不能大于毛重！"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      saleData: [],
      saleDataInit: [],
      itemIdArr: [],
      tableArr: [],
      tableIsShow: false,
      formIsShow: true,
      homePageClasses: [], //分类类目数组
      storeInfo: {}, //地址信息
      supplierList: [],
      valuationForm: {
        isdiscount: "1",
        pricetype: "2",
        grossweight: "",
        netweight: "",
        cmdtspecifications: "",
        weightunit: "",
        requiredWeigh: "N"
      }, //商品类目表单
      postSaleForm: {
        invoice: "0",
        state: "3",
        publishtime: "",
        ticketType: ["1"]
      }, //销售属性中计价表单
      cateForm: {
        cateData: "",
        cateInputArr: []
      }, //物流信息模块
      uploadForm: {
        img_one: null,
        img_two: null,
        img_three: null,
        img_four: null,
        img_five: null,
        master_video: "",
        baby_video: "",
        zduration: "0",
        fduration: "0",
        proportion: "1",
        webDesc: "",
        phoneDesc: "",
        imgCenter: []
      }, //上传表单
      titleForm: {
        isAgent: "N",
        pmercode: "",
        cname: "",
        producerName: "",
        cmdtname: "",
        producode: "",
        homepageclass: "10000004"
      }, //自然属性中的标题表单
      payForm: {
        paymethod: "1",
        stockmethod: "1"
      }, //支付信息表单
      logisticsForm: {
        deliverymode: "1",
        issupsubstitute: false
      }, //物流信息表单
      valuationRules: {
        isdiscount: [
          { required: true, message: "请输入折扣方式", trigger: "blur" }
        ],
        pricetype: [
          { required: true, message: "请输入计价方式", trigger: "blur" }
        ],
        netweight: [
          { required: true, message: "请输入净重", trigger: "blur" },
          { validator: validateNetWeight, trigger: ["change", "blur"] }
        ],
        grossweight: [
          { required: true, message: "请输入毛重", trigger: "blur" },
          { validator: validateGrossWeight, trigger: ["change", "blur"] }
        ],
        cmdtspecifications: [
          { required: true, message: "请输入规格", trigger: "blur" }
        ],
        requiredWeigh: [
          { required: true, message: "请输入是否必须称重", trigger: "blur" }
        ]
      }, //销售属性中计价表单验证
      postSaleFormRules: {
        state: [{ required: true, message: "请输入上架状态", trigger: "blur" }],
        publishtime: [
          { required: true, message: "请输入上架时间", trigger: "blur" }
        ],
        invoice: [
          { required: true, message: "请输入是否填写发票", trigger: "blur" }
        ],
        ticketType: [
          { required: true, message: "请至少选择一项", trigger: "change" }
        ]
      }, //物流表单验证
      uploadFormRules: {
        img_one: [
          { required: true, message: "请输入商品主图", trigger: "blur" }
        ],
        phoneDesc: [
          { required: true, message: "请输入手机端描述", trigger: "blur" }
        ]
      }, //上传表单验证
      titleFormRules: {
        homepageclass: [
          { required: true, message: "请输入商品在主页中分类", trigger: "blur" }
        ],
        isAgent: [{ required: true, message: "请选择", trigger: "blur" }],
        pmercode: [
          {
            required: true,
            message: "请选择一个商户",
            trigger: ["blur", "change"]
          }
        ]
      }, //自然属性中的标题表单验证
      payFormRules: {
        paymethod: [
          { required: true, message: "请输入付款方式", trigger: "blur" }
        ],
        stockmethod: [
          { required: true, message: "请输入库存计数方式", trigger: "blur" }
        ]
      }, //支付信息表单验证
      logisticsFormRules: {
        deliverymode: [
          { required: true, message: "请输入发货方式", trigger: "blur" }
        ]
      } //物流信息表单验证
    };
  },
  created() {
    this.getHomePageClass();
  },
  methods: {
    /* 获取类目列表和产品分类*/
    async getHomePageClass() {
      try {
        this.loading = true;
        const [
          {
            data: {
              rtPurchaseProduct: {
                producode,
                producerName,
                cname,
                typeCode,
                cmdtname,
                unitWeight
              },
              storeInfo,
              salepro
            },
            code: code1
          },
          {
            data: { homePageClasses },
            code: code2
          },
          {
            data: { pmercodes },
            code: code3
          }
        ] = await Promise.all([
          handelPublishInit({ producode: this.$route.params.code }),
          getHomePageClass(),
          getSupplierList()
        ]);
        this.loading = false;
        if (code1 === 200 && code2 === 200 && code3 === 200) {
          this.storeInfo = storeInfo;
          this.titleForm.producode = producode;
          this.titleForm.producerName = producerName;
          this.titleForm.cmdtname = cmdtname;
          this.titleForm.cname = cname;

          this.valuationForm.netweight = unitWeight;
          this.valuationForm.typeCode = typeCode;
          this.saleData = JSON.parse(salepro).salepro;
          this.saleDataInit = initFormData(deepClone(this.saleData));
          this.homePageClasses = homePageClasses;
          this.supplierList = pmercodes;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },

    /* 更新动态表单清除验证*/
    async checkBoxChange(val) {
      this.formIsShow = false;
      await this.$nextTick();
      this.formIsShow = true;
    },

    /* 计价方式切换重置计价form */
    pricetypeChange(val) {
      this.$refs["valuationForm"].resetFields();
      Object.assign(this.valuationForm, {
        grossweight: "",
        netweight: "",
        cmdtspecifications: "",
        weightunit: "公斤",
        pricetype: val,
        requiredWeigh: "N"
      });
    },

    /* 添加商品主图 */
    addItemFir(val) {
      this.uploadForm.img_one = val[0];
      this.$refs["uploadElement"].clearValidate();
    },

    /* 添加商品主图 */
    delItemFir(val) {
      this.uploadForm.img_one = null;
    },

    /* 添加商品主视频*/
    addVideoFir(val) {
      this.uploadForm.master_video = val.video;
      this.uploadForm.zduration = val.duration ? val.duration : 0;
    },

    /* 添加商品详情页视频 */
    addVideoSec(val) {
      this.uploadForm.baby_video = val.video;
      this.uploadForm.fduration = val.duration ? val.duration : 0;
    },

    /* 手机端富文本输入清除验证 */
    phoneEditor() {
      this.$refs["phoneDesc"].clearValidate();
    },

    /* 处理成动态表格数据 */
    tableShow(val) {
      if (val === true) {
        this.tableIsShow = false;
        const data = deepClone(this.saleDataInit).filter(
          item => item.type === "1"
        );
        this.tableArr = InitTableData(deInitFormData(data));
        this.itemIdArr = setRowSpan(sortTableArr(toCombination(this.tableArr)));
        this.$nextTick(() => {
          this.tableIsShow = true;
        });
      } else {
        this.tableData = [];
        this.tableIsShow = false;
      }
    },

    /* 商品发布前的验证 */
    formdataSubVerify() {
      const p1 = new Promise((resolve, reject) => {
        this.$refs["titleForm"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject("err");
          }
        });
      });
      const p2 = new Promise((resolve, reject) => {
        this.$refs["valuationForm"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject("err");
          }
        });
      });
      const p3 = new Promise((resolve, reject) => {
        this.$refs["uploadForm"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject("err");
          }
        });
      });
      const p5 = new Promise((resolve, reject) => {
        this.$refs.dynamicFormSale.$refs["[object Object]"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject("err");
          }
        });
      });
      const p6 = new Promise((resolve, reject) => {
        this.$refs["postSaleForm"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject("err");
          }
        });
      });
      let validateArr = [p1, p2, p3, p5, p6];
      if (this.$refs.dynamicTable) {
        const p6 = new Promise((resolve, reject) => {
          this.$refs.dynamicTable.validatInit(valid => {
            if (valid) {
              resolve();
            } else {
              reject("err");
            }
          });
        });
        validateArr.push(p6);
      }
      Promise.all(validateArr)
        .then(() => {
          this._subTableData();
        })
        .catch(() => {
          this.$confirm("必填项未填写或格式不正确，请检查。", "系统提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "el-message-box-wran"
          });
        });
    },

    /* 商品发布验证完成后提交 */
    async _subTableData() {
      try {
        this.loading = true;
        const { code, msg } = await handelPublish(this._initFormdataSub());
        this.loading = false;
        if (code === 200) {
          this.msgSuccess("商品发布成功");
          setTimeout(() => {
            this.$router.push({ path: "/product/on-shelf" });
          }, 1000);
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },

    /* 拼装商品发布提交数据 */
    _initFormdataSub() {
      const { invoice, ticketType } = this.postSaleForm;
      const saleDataInit = deepClone(this.saleDataInit);
      let formData = new FormData();
      formData.append("producode", this.$route.params.code);
      formData.append("homepageclass", this.titleForm.homepageclass);
      formData.append("isAgent", this.titleForm.isAgent);
      formData.append("pmercode", this.titleForm.pmercode);
      formData.append(
        "salepro",
        JSON.stringify({ salepro: deInitFormData(saleDataInit) })
      );
      formData.append(
        "productPrices",
        JSON.stringify(
          setTableSubData(this.saleData, this.saleDataInit, this.itemIdArr)
        )
      );
      formData.append("isdiscount", this.valuationForm.isdiscount);
      formData.append("pricetype", this.valuationForm.pricetype);
      formData.append("requiredWeigh", this.valuationForm.requiredWeigh);
      formData.append("grossweight", this.valuationForm.grossweight);
      formData.append("netweight", this.valuationForm.netweight);
      formData.append(
        "cmdtspecifications",
        this.valuationForm.cmdtspecifications
      );
      formData.append("webDesc", this.uploadForm.webDesc);
      formData.append("phoneDesc", this.uploadForm.phoneDesc);
      formData.append("img_one", this.$refs.imgItemFir.fileList[0]);
      formData.append("img_two", this.$refs.imgItemSec.fileList[0]);
      formData.append("img_three", this.$refs.imgItemThree.fileList[0]);
      formData.append("img_four", this.$refs.imgItemFour.fileList[0]);
      formData.append("img_five", this.$refs.imgItemFive.fileList[0]);
      formData.append("proportion", this.uploadForm.proportion);
      formData.append("master_video", this.uploadForm.master_video);
      formData.append("baby_video", this.uploadForm.baby_video);
      formData.append("master_video", this.uploadForm.master_video);
      formData.append("zduration", this.uploadForm.zduration);
      formData.append("fduration", this.uploadForm.fduration);
      formData.append("paymethod", this.payForm.paymethod);
      formData.append("stockmethod", this.payForm.stockmethod);
      formData.append("invoice", initInvoiceSub(invoice, ticketType));
      formData.append("state", this.postSaleForm.state);
      formData.append(
        "issupsubstitute",
        this.logisticsForm.issupsubstitute === true ? "Y" : "N"
      );
      formData.append("deliverymode", this.logisticsForm.deliverymode);
      formData.append("province", this.storeInfo.province);
      formData.append("city", this.storeInfo.city);
      if (this.postSaleForm.state === "4") {
        formData.append("publishtime", this.postSaleForm.publishtime);
      }
      return formData;
    }
  }
};
</script>
