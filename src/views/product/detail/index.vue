<template>
  <div class="pro-publish-edit app-container">
    <div v-if="cmdtclassname" v-loading="loading">
      <div class="block">
        <h4>当前类目：{{cmdtclassname}}</h4>
      </div>
      <div class="block" v-loading="loadingNature">
        <h4>
          自然属性
          <el-button size="mini" class="f-r" type="primary" @click="editNatureproV">修改自然属性</el-button>
        </h4>
        <el-form
          :model="titleForm"
          ref="titleForm"
          :rules="titleFormRules"
          label-width="110px"
          class="b-t-g m-b-20"
        >
          <el-form-item label="商品名称：" prop="produname">
            <el-input
              v-model="titleForm.produname"
              class="w-400"
              maxlength="30"
              clearable
              placeholder="请输入商品名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品标题：" prop="title">
            <el-input
              v-model="titleForm.title"
              class="w-400"
              maxlength="30"
              clearable
              placeholder="请输入商品标题"
            ></el-input>
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
        </el-form>
        <dynamic-form v-model="naturalDataInit" ref="dynamicFormNatural"></dynamic-form>
      </div>
      <div class="block" v-loading="loadingSale">
        <h4>
          销售属性
          <el-button size="mini" class="f-r" type="primary" @click="editSaleproV">修改销售属性</el-button>
        </h4>
        <el-form
          :model="valuationForm"
          ref="valuationForm"
          :rules="valuationRules"
          label-width="110px"
          class="b-t-g m-b-20"
        >
          <el-form-item label="计价方式：" prop="pricetype">
            <el-radio-group v-model="valuationForm.pricetype">
              <el-radio label="1" disabled>按数量</el-radio>
              <el-radio label="2" disabled>按重量</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="valuationForm.pricetype === '2'">
            <el-form-item label="重量单位" prop="weightunit">
              <el-radio-group v-model="valuationForm.weightunit">
                <el-radio label="公斤" disabled>公斤</el-radio>
                <el-radio label="斤" disabled>斤</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="净重" prop="netweight">
              <el-input v-model="valuationForm.netweight" class="w-400" disabled></el-input>
            </el-form-item>
            <el-form-item label="毛重" prop="grossweight">
              <el-input v-model="valuationForm.grossweight" class="w-400" disabled></el-input>
            </el-form-item>
          </div>
          <el-form-item label="折扣方式：" prop="isdiscount">
            <el-radio-group v-model="valuationForm.isdiscount">
              <el-radio label="1" disabled>有折扣</el-radio>
              <el-radio label="2" disabled>无折扣</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <dynamic-form
          v-model="saleDataInit"
          :isHaveTable="true"
          @table-show="tableShow"
          :disabled="true"
        ></dynamic-form>
        <dynamic-table
          v-if="tableIsShow"
          :itemIdArr="itemIdArr"
          :tableArr="tableArr"
          ref="dynamicFormSale"
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
            <div v-loading="loadingUploadImg" class="b-t-g img-loading-box">
              <div v-if="imgBoxShow">
                <el-form-item label="商品主图：" prop="img_one">
                  <upload-img @del-item="delImgItem" :file="[uploadForm.img_one]" ref="imgItemFir"></upload-img>
                </el-form-item>
                <el-form-item label="商品图：" prop="img_two" class="imgs-item">
                  <upload-img @del-item="delImgItem" :file="[uploadForm.img_two]" ref="imgItemSec"></upload-img>
                  <upload-img
                    @del-item="delImgItem"
                    :file="[uploadForm.img_three]"
                    ref="imgItemThree"
                  ></upload-img>
                  <upload-img
                    @del-item="delImgItem"
                    :file="[uploadForm.img_four]"
                    ref="imgItemFour"
                  ></upload-img>
                </el-form-item>
                <el-form-item label="商品底图：" prop="img_five">
                  <upload-img
                    @del-item="delImgItem"
                    :file="[uploadForm.img_five]"
                    ref="imgItemFive"
                  ></upload-img>
                  <el-button size="mini" class="f-r" type="primary" @click="editProImg">修改商品图片</el-button>
                </el-form-item>
              </div>
            </div>
            <div v-loading="loadingUploadVideo" class="b-t-g video-loading-box">
              <div v-if="videoBoxShow">
                <el-form-item label="主图视频比例：" prop="proportion">
                  <el-radio-group v-model="uploadForm.proportion">
                    <el-radio label="1">1:1</el-radio>
                    <el-radio label="2">16:9</el-radio>
                    <el-radio label="3">3:4</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="主图视频：" prop="master_video">
                  <upload-video
                    @add-item="addVideoItemFir"
                    :file="uploadForm.master_video"
                    ref="master_video"
                  ></upload-video>
                </el-form-item>
                <el-form-item label="商品详情视频：" prop="baby_video">
                  <upload-video
                    @add-item="addVideoItemSec"
                    :file="uploadForm.baby_video"
                    ref="baby_video"
                  ></upload-video>
                  <el-button size="mini" class="f-r" type="primary" @click="editProVideo">修改商品视频</el-button>
                </el-form-item>
              </div>
            </div>
            <div v-loading="loadingUploadDec" class="dec-loading-box">
              <el-form-item label="电脑端描述：" prop="webDesc" class="editor-item" ref="webDesc">
                <editor v-model="uploadForm.webDesc" @input="webEditor" :moduleNum="2"></editor>
              </el-form-item>
              <el-form-item label="手机端描述：" prop="phoneDesc" class="editor-item" ref="phoneDesc">
                <editor v-model="uploadForm.phoneDesc" @input="phoneEditor" :moduleNum="1"></editor>
                <el-button
                  size="mini"
                  class="f-r edit-dec-btn"
                  type="primary"
                  @click="editProDecV"
                >修改商品文本描述</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div class="block" v-loading="loadingPay">
        <h4>
          支付信息
          <el-button size="mini" class="f-r" type="primary" @click="editPayInfo">修改支付信息</el-button>
        </h4>
        <el-form :model="payForm" ref="payForm" :rules="payFormRules" label-width="110px">
          <el-form-item label="付款方式：" prop="paymethod">
            <el-radio-group v-model="payForm.paymethod">
              <el-radio label="1">普通交易</el-radio>
              <el-radio label="2">预售模式</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="库存计数：" prop="stockmethod">
            <el-radio-group v-model="payForm.stockmethod">
              <el-radio label="1">卖家拍下减库存</el-radio>
              <el-radio label="2">卖家付款减库存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="block" v-loading="loadingLogistics">
        <h4>
          物流信息
          <el-button size="mini" class="f-r" type="primary" @click="editLogistics">修改支付信息</el-button>
        </h4>
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
          </el-form-item>
        </el-form>
      </div>
      <div class="block" v-loading="loadingServer">
        <h4>
          售后服务
          <el-button size="mini" type="primary" class="f-r" @click="editPostSaleV">修改售后服务</el-button>
        </h4>
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
              <el-radio label="1">上架</el-radio>
              <el-radio label="2" v-if="Number(state)!==3">下架</el-radio>
              <el-radio label="3" v-if="Number(state)!==2">放入库存</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="this.postSaleForm.state === '1'" label="上架时间：" prop="publishtime">
            <el-date-picker
              type="datetime"
              v-model="postSaleForm.publishtime"
              placeholder="请输入上架时间"
              disabled
              class="w-400"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import DynamicForm from "@/components/DynamicForm";
import DynamicTable from "@/components/DynamicTable";
import UploadImg from "@/components/UploadImg";
import UploadVideo from "@/components/UploadVideo";
import Editor from "@/components/Editor";
import {
  getProCate,
  getProData,
  getHomePageClass,
  getProDetail,
  proPublishSubEdit
} from "@/api/product";
import {
  initFormData,
  deInitFormData,
  toCombination,
  InitTableData,
  setRowSpan,
  sortTableArr,
  deepClone,
  setTableSubData,
  initTableInputData,
  subTableInputData,
  initInvoice,
  initInvoiceSub
} from "@/utils";

export default {
  components: {
    DynamicForm,
    DynamicTable,
    UploadImg,
    UploadVideo,
    Editor
  },
  data() {
    const patter = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/; //数字价格类型验证
    const validateNetWeight = (rule, value, callback) => {
      if (!patter.test(value)) {
        callback(new Error("必须非负整数或至多保留两位小数！"));
      } else {
        if (this.valuationForm.grossweight !== "") {
          this.$refs.valuationForm.validateField("grossweight");
        }
        callback();
      }
    }; //净重验证
    const validateGrossWeight = (rule, value, callback) => {
      if (!patter.test(value)) {
        callback(new Error("必须非负整数或至多保留两位小数！"));
      } else if (!(value > this.valuationForm.netweight)) {
        callback(new Error("毛重必须大于净重"));
      } else {
        callback();
      }
    }; //毛重验证
    return {
      loading: false, //初始页面loading
      loadingNature: false, //自然属性模块loading
      loadingSale: false, //销售属性模块loading
      loadingUploadImg: false, //上传图片模块loading
      loadingUploadVideo: false, //上传视频模块loading
      loadingUploadDec: false, //图文描述模块loading
      loadingPay: false, //支付信息模块loading
      loadingServer: false, //售后服务模块loading
      loadingLogistics: false,
      imgBoxShow: true, //修改成功后初始化图片内容
      videoBoxShow: true, //修改成功后初始化视频内容
      cmdtclassname: "", //页面显示的商品类目
      producode: "", //商品编码（修改需要提交）
      uid: "", //商品uid（修改需要提交）
      storeInfo: {},
      naturalData: [], //自然属性原始数据
      naturalDataInit: [], //自然属性处理后的数据（供动态表单使用）
      saleData: [], //销售属性原始数据
      saleDataInit: [], //销售属性处理后的数据（供动态表单使用）
      cmdtProductPrices: [], //动态表格原始数据
      itemIdArr: [], //处理后的销售属性（供动态表格使用）
      tableArr: [], //
      tableIsShow: false, //动态表格显示与否开关
      homePageClasses: [], // 产品展示分类关联数组
      productImgs: [], //关联图片数组（用于图片提交）
      productVideos: [], //关联视频数组（用于视频提交）
      state: "", //上架状态初始值（判断哪些状态显示）
      cateForm: {
        cateData: "",
        cateInputArr: []
      }, //商品类目表单
      valuationForm: {
        isdiscount: "1",
        pricetype: "2",
        grossweight: "",
        netweight: "",
        weightunit: "公斤"
      }, //销售属性中计价表单
      postSaleForm: {
        invoice: "0",
        state: "3",
        publishtime: "",
        ticketType: ["1"]
      }, //物流信息模块
      uploadForm: {
        img_one: null,
        img_two: null,
        img_three: null,
        img_four: null,
        img_five: null,
        master_video: null,
        baby_video: null,
        zduration: "0",
        fduration: "0",
        proportion: "",
        webDesc: "",
        phoneDesc: ""
      }, //上传表单
      titleForm: {
        produname: "",
        title: "",
        homepageclass: ""
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
        weightunit: [
          { required: true, message: "请输入重量单位", trigger: "blur" }
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
        webDesc: [
          { required: true, message: "请输入电脑端描述", trigger: "blur" }
        ],
        phoneDesc: [
          { required: true, message: "请输入手机端描述", trigger: "blur" }
        ]
      }, //上传表单验证
      titleFormRules: {
        produname: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入商品标题", trigger: "blur" }],
        homepageclass: [
          { required: true, message: "请输入商品在主页中分类", trigger: "blur" }
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
      } //服务表单验证
    };
  },
  async created() {
    const codeArr = this.$route.params.code.split("-");
    this.producode = codeArr[0];
    this.uid = codeArr[1];
    await this.getDetailData();
  },
  methods: {
    /* 删除图片匹配去掉productImgs中uid */
    delImgItem(uid) {
      const idx = this.productImgs.findIndex(item => {
        return item.uid === uid;
      });
      if (idx !== -1) {
        this.productImgs.splice(idx, 1);
      }
    },

    /* 删除主视频匹配去掉productVideos中uid */
    addVideoItemFir(val) {
      const idx = this.productVideos.findIndex(item => {
        return Number(item.serial) === 1;
      });
      if (idx !== -1) {
        this.productVideos.splice(idx, 1);
      }
      this.uploadForm.zduration = val.duration ? val.duration : 0;
    },

    /* 删除详情视频匹配去掉productVideos中uid */
    addVideoItemSec(val) {
      const idx = this.productVideos.findIndex(item => {
        return Number(item.serial) === 2;
      });
      if (idx !== -1) {
        this.productVideos.splice(idx, 1);
      }
      this.uploadForm.fduration = val.duration ? val.duration : 0;
    },

    /* 电脑端描述输入后清除验证 */
    webEditor() {
      this.$refs["webDesc"].clearValidate();
    },

    /* 手机端描述输入后清除验证  */
    phoneEditor() {
      this.$refs["phoneDesc"].clearValidate();
    },

    /* 获取本页详情信息数据 */
    async getDetailData() {
      try {
        const { producode, uid } = this;
        const [
          {
            code: code1,
            data: {
              cmdtProduct: {
                cmdtclassname,
                produname,
                title,
                homepageclass,
                pricetype,
                weightunit,
                grossweight,
                netweight,
                isdiscount,
                naturepro,
                salepro,
                invoice,
                state,
                publishtime,
                paymethod,
                stockmethod,
                issupsubstitute,
                deliverymode,
                shippingcity: city,
                shippingprovince: province,
                shoplocation: address
              },
              cmdtProductDescriptions,
              cmdtProductImages,
              cmdtProductPrices,
              productVideos
            }
          },
          {
            data: { homePageClasses },
            code: code2
          }
        ] = await Promise.all([
          getProDetail({ producode, uid }),
          getHomePageClass()
        ]);
        if (code1 === 200) {
          this.cmdtclassname = cmdtclassname;
          this.titleForm.produname = produname;
          this.titleForm.title = title;
          this.titleForm.homepageclass = homepageclass;
          this.valuationForm.pricetype = String(pricetype);
          this.valuationForm.weightunit = weightunit;
          this.valuationForm.grossweight = grossweight;
          this.valuationForm.netweight = netweight;
          this.valuationForm.isdiscount = String(isdiscount);
          this.naturalData = JSON.parse(naturepro).naturepro;
          this.naturalDataInit = initFormData(deepClone(this.naturalData));
          this.saleData = JSON.parse(salepro).salepro;
          this.saleDataInit = initFormData(deepClone(this.saleData));
          this.cmdtProductPrices = cmdtProductPrices;
          this.tableShow(true);
          this.postSaleForm.state = String(state);
          this.postSaleForm.publishtime = publishtime;
          Object.assign(this.postSaleForm, initInvoice(invoice));
          this.payForm.paymethod = String(paymethod);
          this.payForm.stockmethod = String(stockmethod);
          this.logisticsForm.issupsubstitute =
            issupsubstitute === "Y" ? true : false;
          this.logisticsForm.deliverymode = String(deliverymode);
          this.uploadForm.webDesc = cmdtProductDescriptions.find(
            item => item.xtype === 2
          ).xdesc;
          this.uploadForm.phoneDesc = cmdtProductDescriptions.find(
            item => item.xtype === 1
          ).xdesc;
          const imgData = cmdtProductImages.map(item => {
            return Object.assign(item, { url: item.image });
          });
          const imgOne = imgData.find(item => item.serial === 1);
          const imgTwo = imgData.find(item => item.serial === 2);
          const imgThree = imgData.find(item => item.serial === 3);
          const imgFour = imgData.find(item => item.serial === 4);
          const imgFive = imgData.find(item => item.serial === 5);
          this.uploadForm.img_one = imgOne ? imgOne : null;
          this.uploadForm.img_two = imgTwo ? imgTwo : null;
          this.uploadForm.img_three = imgThree ? imgThree : null;
          this.uploadForm.img_four = imgFour ? imgFour : null;
          this.uploadForm.img_five = imgFive ? imgFive : null;
          const masterVideo = productVideos.find(item => item.serial === 1);
          const babyVideo = productVideos.find(item => item.serial === 2);
          this.uploadForm.master_video = masterVideo ? masterVideo : null;
          this.uploadForm.baby_video = babyVideo ? babyVideo : null;
          this.uploadForm.proportion = masterVideo
            ? String(masterVideo.proportion)
            : "";
          this.productImgs = cmdtProductImages.map(item => {
            return { serial: item.serial, uid: item.uid };
          });
          this.productVideos = productVideos.map(item => {
            return { serial: item.serial, uid: item.uid };
          });
          this.state = String(state);
          this.storeInfo = {
            province,
            city,
            address
          };
          this._loadingCancel();
        }
        if (code2 === 200) {
          this.homePageClasses = homePageClasses;
        }
      } catch (err) {
        console.log(err);
      }
    },

    /* 监听销售属性判断动态表格显示与否 */
    tableShow(val) {
      if (val === true) {
        this.tableIsShow = false;
        const data = deepClone(this.saleDataInit).filter(
          item => item.type === "1"
        );
        this.tableArr = InitTableData(deInitFormData(data));
        this.itemIdArr = initTableInputData(
          this.cmdtProductPrices,
          setRowSpan(sortTableArr(toCombination(this.tableArr))),
          deepClone(this.saleData)
        );
        this.$nextTick(() => {
          this.tableIsShow = true;
        });
      } else {
        this.tableData = [];
        this.tableIsShow = false;
      }
    },

    /* 自然属性提交验证 */
    editNatureproV() {
      const p1 = new Promise((resolve, reject) => {
        this.$refs["titleForm"].validate(valid => {
          if (valid) resolve();
        });
      });
      const p2 = new Promise((resolve, reject) => {
        this.$refs.dynamicFormNatural.$refs["[object Object]"].validate(
          valid => {
            if (valid) resolve();
          }
        );
      });
      Promise.all([p1, p2]).then(() => {
        this.editNaturepro();
      });
    },

    /* 自然属性formData组装 */
    editNaturepro() {
      this.loadingNature = true;
      let formData = new FormData();
      formData.append("moduleNum", "1");
      formData.append("produname", this.titleForm.produname);
      formData.append("title", this.titleForm.title);
      formData.append("homepageclass", this.titleForm.homepageclass);
      formData.append(
        "naturepro",
        JSON.stringify({ naturepro: deInitFormData(this.naturalDataInit) })
      );
      this.subTableData(formData);
    },

    /* 销售属性提交验证 */
    editSaleproV() {
      const p1 = new Promise((resolve, reject) => {
        this.$refs.dynamicFormSale.validatInit(valid => {
          if (valid) resolve();
        });
      }).then(() => {
        this.editSalepro();
      });
    },

    /* 销售属性formData组装 */
    editSalepro() {
      this.loadingSale = true;
      let formData = new FormData();
      formData.append("moduleNum", "7");
      formData.append(
        "productPrices",
        JSON.stringify(subTableInputData(this.itemIdArr))
      );
      this.subTableData(formData);
    },

    /* 商品图片提交验证 */
    editProImgV() {},

    /* 商品图片formData组装 */
    editProImg() {
      this.loadingUploadImg = true;
      this.imgBoxShow = false;
      let formData = new FormData();
      const cloneData = deepClone(this.productImgs);
      formData.append("moduleNum", "4");
      formData.append(
        "productImgs",
        JSON.stringify(
          cloneData.map(item => {
            return item.uid;
          })
        )
      );
      formData.append("img_one", this.$refs.imgItemFir.fileList[0]);
      formData.append("img_two", this.$refs.imgItemSec.fileList[0]);
      formData.append("img_three", this.$refs.imgItemThree.fileList[0]);
      formData.append("img_four", this.$refs.imgItemFour.fileList[0]);
      formData.append("img_five", this.$refs.imgItemFive.fileList[0]);
      this.productImgs.forEach(item => {
        if (Number(item.serial) === 1) {
          formData.delete("img_one");
        } else if (Number(item.serial) === 2) {
          formData.delete("img_two");
        } else if (Number(item.serial) === 3) {
          formData.delete("img_three");
        } else if (Number(item.serial) === 4) {
          formData.delete("img_four");
        } else if (Number(item.serial) === 5) {
          formData.delete("img_five");
        }
      });
      this.subTableData(formData);
    },

    /* 商品视频formData组装 */
    editProVideo() {
      this.loadingUploadVideo = true;
      this.videoBoxShow = false;
      let formData = new FormData();
      formData.append("moduleNum", "5");
      formData.append(
        "productVideos",
        JSON.stringify(
          this.productVideos.map(item => {
            return item.uid;
          })
        )
      );
      formData.append("master_video", this.$refs.master_video.video);
      formData.append("baby_video", this.$refs.baby_video.video);
      formData.append("zduration", this.uploadForm.zduration);
      formData.append("fduration", this.uploadForm.fduration);
      this.productVideos.forEach(item => {
        if (Number(item.serial) === 1) {
          formData.delete("master_video");
          formData.delete("zduration");
        } else if (Number(item.serial) === 2) {
          formData.delete("baby_video");
          formData.delete("fduration");
        }
      });
      formData.append("proportion", this.uploadForm.proportion);
      this.subTableData(formData);
    },

    /* 商品文本描述验证提交 */
    editProDecV() {
      new Promise((resolve, reject) => {
        this.$refs["uploadForm"].validate(valid => {
          if (valid) resolve();
        });
      }).then(() => {
        this.editProDec();
      });
    },

    /* 商品文本描述formData组装 */
    editProDec() {
      this.loadingUploadDec = true;
      let formData = new FormData();
      formData.append("moduleNum", "6");
      formData.append("webDesc", this.uploadForm.webDesc);
      formData.append("phoneDesc", this.uploadForm.phoneDesc);
      this.subTableData(formData);
    },

    /* 支付信息formData组装 */
    editPayInfo() {
      this.loadingPay = true;
      let formData = new FormData();
      formData.append("moduleNum", "2");
      formData.append("paymethod", this.payForm.paymethod);
      formData.append("stockmethod", this.payForm.stockmethod);
      this.subTableData(formData);
    },

    /* 售后服务验证提交 */
    editPostSaleV() {
      new Promise((resolve, reject) => {
        this.$refs["postSaleForm"].validate(valid => {
          if (valid) resolve();
        });
      }).then(() => {
        this.editPostSale();
      });
    },

    /* 售后服务formData组装 */
    editPostSale() {
      this.loadingServer = true;
      const { invoice, ticketType } = this.postSaleForm;
      let formData = new FormData();
      formData.append("moduleNum", "3");
      formData.append("invoice", initInvoiceSub(invoice, ticketType));
      formData.append("state", this.postSaleForm.state);
      this.subTableData(formData);
    },

    /* 物流信息formData组装 */
    editLogistics() {
      this.loadingLogistics = true;
      let formData = new FormData();
      formData.append("moduleNum", "8");
      formData.append(
        "issupsubstitute",
        this.logisticsForm.issupsubstitute === true ? "Y" : "N"
      );
      formData.append("deliverymode", this.logisticsForm.deliverymode);
      formData.append("province", this.storeInfo.province);
      formData.append("city", this.storeInfo.city);
      this.subTableData(formData);
    },

    /* 提交数据接口 */
    async subTableData(formData) {
      try {
        formData.append("producode", this.producode);
        formData.append("uid", this.uid);
        const { code, msg } = await proPublishSubEdit(formData);
        if (code === 200) {
          await this.getDetailData();
          this._loadingCancel();
          ELEMENT.MessageBox({
            message: "修改成功",
            type: "success",
            duration: 5 * 1000,
            customClass: "el-message-box-suc"
          });
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
      this.loadingNature = false;
      this.loadingSale = false;
      this.loadingUploadImg = false;
      this.loadingUploadVideo = false;
      this.loadingUploadDec = false;
      this.loadingPay = false;
      this.loadingServer = false;
      this.loadingLogistics = false;
      this.imgBoxShow = true;
      this.videoBoxShow = true;
    }
  }
};
</script>