<template>
  <div class="pro-publish-edit app-container">
    <div v-if="producode" v-loading="loading">
      <div class="block">
        <h4>当前类目：{{cmdtclassname}}</h4>
      </div>
      <div class="block" v-loading="loadingNature">
        <h4>
          自然属性
          <el-button size="mini" class="f-r" @click="editNaturepro">修改自然属性</el-button>
        </h4>
        <el-form
          :model="titleForm"
          ref="titleForm"
          :rules="titleFormRules"
          label-width="110px"
          class="b-t-g m-b-20"
        >
          <el-form-item label="商品名称：" prop="produname">
            <el-input v-model="titleForm.produname" class="w-300"></el-input>
          </el-form-item>
          <el-form-item label="商品标题：" prop="title">
            <el-input v-model="titleForm.title" class="w-300"></el-input>
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
        <dynamic-form v-model="naturalDataInit"></dynamic-form>
      </div>
      <div class="block" v-loading="loadingSale">
        <h4>
          销售属性
          <el-button size="mini" class="f-r" @click="editSalepro">修改销售属性</el-button>
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
              <el-input v-model="valuationForm.netweight" class="w-300" disabled></el-input>
            </el-form-item>
            <el-form-item label="毛重" prop="grossweight">
              <el-input v-model="valuationForm.grossweight" class="w-300" disabled></el-input>
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
        <dynamic-table v-if="tableIsShow" :itemIdArr="itemIdArr" :tableArr="tableArr"></dynamic-table>
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
                <el-form-item label="宝贝主图：" prop="img_one">
                  <upload-img @del-item="delImgItem" :file="[uploadForm.img_one]" ref="imgItemFir"></upload-img>
                </el-form-item>
                <el-form-item label="宝贝图：" prop="img_two" class="imgs-item">
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
                <el-form-item label="宝贝底图：" prop="img_five">
                  <upload-img
                    :limit="1"
                    @del-item="delImgItem"
                    :file="[uploadForm.img_five]"
                    ref="imgItemFive"
                  ></upload-img>
                  <el-button size="mini" class="f-r" @click="editProImg">修改宝贝图片</el-button>
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
                <el-form-item label="宝贝视频：" prop="baby_video">
                  <upload-video
                    @add-item="addVideoItemSec"
                    :file="uploadForm.baby_video"
                    ref="baby_video"
                  ></upload-video>
                  <el-button size="mini" class="f-r" @click="editProVideo">修改宝贝视频</el-button>
                </el-form-item>
              </div>
            </div>
            <div v-loading="loadingUploadDec" class="dec-loading-box">
              <el-form-item label="电脑端描述：" prop="webDesc" class="editor-item">
                <editor v-model="uploadForm.webDesc"></editor>
              </el-form-item>
              <el-form-item label="手机端描述：" prop="phoneDesc" class="editor-item">
                <editor v-model="uploadForm.phoneDesc"></editor>
                <el-button size="mini" class="f-r edit-dec-btn" @click="editProDec">修改宝贝文本描述</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div class="block" v-loading="loadingPay">
        <h4>
          支付信息
          <el-button size="mini" style="float:right" @click="editPayInfo">修改支付信息</el-button>
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
      <div class="block">
        <h4>物流信息</h4>
        <el-form
          :model="logisticsForm"
          ref="logisticsForm"
          :rules="logisticsFormRules"
          label-width="120px"
        >
          <el-form-item label="是否支持代发：" prop="issupsubstitute">
            <el-radio-group v-model="logisticsForm.issupsubstitute">
              <el-radio label="Y" disabled>是</el-radio>
              <el-radio label="N" disabled>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="block" v-loading="loadingServer">
        <h4>
          售后服务
          <el-button size="mini" class="f-r" @click="editPostSale">修改售后服务</el-button>
        </h4>
        <el-form
          :model="postSaleForm"
          ref="postSaleForm"
          :rules="postSaleFormRules"
          label-width="110px"
        >
          <el-form-item label="提供发票：" prop="invoice">
            <el-radio-group v-model="postSaleForm.invoice">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
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
              class="w-300"
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
import UploadImg from "@/components/UploadImgEdit";
import UploadVideo from "@/components/UploadVideoEdit";
import Editor from "@/components/Editor";
import axios from "axios";
import { getToken } from "@/utils/auth";
import { MessageBox } from "element-ui";
import {
  getProCate,
  getProData,
  getHomePageClass,
  getProDetail
} from "@/api/product";
import {
  initFormData,
  deInitFormData,
  toCombination,
  InitTableData,
  setRowSpan,
  sortTableArr,
  deepClone,
  parseTime,
  setTableSubData,
  initTableInputData,
  subTableInputData
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
    return {
      loading: false,
      loadingNature: false,
      loadingSale: false,
      loadingUploadImg: false,
      loadingUploadVideo: false,
      loadingUploadDec: false,
      loadingPay: false,
      loadingServer: false,
      imgBoxShow: true,
      videoBoxShow: true,
      cmdtclassname: "",
      producode: "",
      naturalData: [],
      naturalDataInit: [],
      saleData: [],
      saleDataInit: [],
      cmdtProductPrices: [],
      itemIdArr: [],
      tableArr: [],
      tableIsShow: false,
      homePageClasses: [],
      productImgs: [],
      productVideos: [],
      cversion: "",
      state: "",
      cateForm: {
        cateData: "",
        cateInputArr: []
      },
      valuationForm: {
        isdiscount: "1",
        pricetype: "2",
        grossweight: "",
        netweight: "",
        weightunit: "公斤"
      },
      postSaleForm: {
        invoice: "Y",
        state: "",
        publishtime: ""
      },
      uploadForm: {
        img_one: "",
        img_two: "",
        img_three: "",
        img_four: "",
        img_five: "",
        master_video: null,
        baby_video: null,
        proportion: "",
        webDesc: "",
        phoneDesc: ""
      },
      titleForm: {
        produname: "",
        title: "",
        homepageclass: ""
      },
      payForm: {
        paymethod: "1",
        stockmethod: "1"
      },
      logisticsForm: {
        issupsubstitute: "Y"
      },
      valuationRules: {
        isdiscount: [
          { required: true, message: "请输入折扣方式", trigger: "blur" }
        ],
        pricetype: [
          { required: true, message: "请输入计价方式", trigger: "blur" }
        ],
        grossweight: [
          { required: true, message: "请输入毛重", trigger: "blur" }
        ],
        netweight: [{ required: true, message: "请输入净重", trigger: "blur" }],
        weightunit: [
          { required: true, message: "请输入重量单位", trigger: "blur" }
        ]
      },
      postSaleFormRules: {
        state: [{ required: true, message: "请输入上架状态", trigger: "blur" }],
        publishtime: [
          { required: true, message: "请输入上架时间", trigger: "blur" }
        ],
        invoice: [
          { required: true, message: "请输入是否填写发票", trigger: "blur" }
        ]
      },
      uploadFormRules: {
        img_one: [
          { required: true, message: "请输入商品主图", trigger: "blur" }
        ],
        img_two: [
          { required: true, message: "请输入商品图片", trigger: "blur" }
        ],
        img_five: [
          { required: true, message: "请输入商品底图", trigger: "blur" }
        ],
        master_video: [
          { required: true, message: "请输入商品主视频", trigger: "blur" }
        ],
        baby_video: [
          { required: true, message: "请输入宝贝视频", trigger: "blur" }
        ],
        proportion: [
          { required: true, message: "请输入视频比例", trigger: "blur" }
        ],
        webDesc: [
          { required: true, message: "请输入电脑端描述", trigger: "blur" }
        ],
        phoneDesc: [
          { required: true, message: "请输入手机端描述", trigger: "blur" }
        ]
      },
      titleFormRules: {
        produname: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入商品标题", trigger: "blur" }],
        homepageclass: [
          { required: true, message: "请输入商品在主页中分类", trigger: "blur" }
        ]
      },
      payFormRules: {
        paymethod: [
          { required: true, message: "请输入付款方式", trigger: "blur" }
        ],
        stockmethod: [
          { required: true, message: "请输入库存计数方式", trigger: "blur" }
        ]
      },
      logisticsFormRules: {
        issupsubstitute: [
          { required: true, message: "请输入是否支持代发", trigger: "blur" }
        ]
      }
    };
  },

  async created() {
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

    /* 删除视频匹配去掉productVideos中uid */
    addVideoItemFir() {
      const idx = this.productVideos.findIndex(item => {
        return Number(item.serial) === 1;
      });
      if (idx !== -1) {
        this.productVideos.splice(idx, 1);
      }
    },

    /* 删除视频匹配去掉productVideos中uid */
    addVideoItemSec() {
      const idx = this.productVideos.findIndex(item => {
        return Number(item.serial) === 2;
      });
      if (idx !== -1) {
        this.productVideos.splice(idx, 1);
      }
    },

    /* 获取详情信息 */
    async getDetailData() {
      const producode = this.$route.params.code;
      try {
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
                issupsubstitute
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
          getProDetail({ producode }),
          getHomePageClass()
        ]);
        if (code1 === 200) {
          this.producode = producode;
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
          this.postSaleForm.invoice = invoice;
          this.postSaleForm.state = String(state);
          this.postSaleForm.publishtime = publishtime;
          this.payForm.paymethod = String(paymethod);
          this.payForm.stockmethod = String(stockmethod);
          this.logisticsForm.issupsubstitute = issupsubstitute;
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
          this._loadingCancel();
        }
        if (code2 === 200) {
          this.homePageClasses = homePageClasses;
        }
      } catch (err) {
        console.log(err);
      }
    },

    /* 处理成动态表格数据 */
    tableShow(val) {
      if (val === true) {
        this.tableIsShow = false;
        const data = deepClone(this.saleDataInit).filter(
          item => item.type === "1"
        );
        this.tableArr = InitTableData(deInitFormData(data));
        this.itemIdArr = initTableInputData(
          this.cmdtProductPrices,
          setRowSpan(sortTableArr(toCombination(this.tableArr)))
        );
        this.$nextTick(() => {
          this.tableIsShow = true;
        });
      } else {
        this.tableData = [];
        this.tableIsShow = false;
      }
    },

    /* 自然属性formData */
    editNaturepro() {
      const naturalDataInit = JSON.parse(JSON.stringify(this.naturalDataInit));
      this.loadingNature = true;
      let formData = new FormData();
      formData.append("moduleNum", "1");
      formData.append("producode", this.producode);
      formData.append("produname", this.titleForm.produname);
      formData.append("title", this.titleForm.title);
      formData.append("homepageclass", this.titleForm.homepageclass);
      formData.append(
        "naturepro",
        JSON.stringify({ naturepro: deInitFormData(naturalDataInit) })
      );
      this.subTableData(formData);
    },

    /* 销售属性formData */
    editSalepro() {
      this.loadingSale = true;
      let formData = new FormData();
      formData.append("moduleNum", "7");
      formData.append("producode", this.producode);
      formData.append(
        "productPrices",
        JSON.stringify(subTableInputData(this.itemIdArr))
      );
      this.subTableData(formData);
    },

    /* 商品图片formData */
    editProImg() {
      this.loadingUploadImg = true;
      this.imgBoxShow = false;
      let formData = new FormData();
      const cloneData = deepClone(this.productImgs);
      formData.append("moduleNum", "4");
      formData.append("producode", this.producode);
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

    /* 商品视频formData */
    editProVideo() {
      this.loadingUploadVideo = true;
      this.videoBoxShow = false;
      let formData = new FormData();
      formData.append("moduleNum", "5");
      formData.append("producode", this.producode);
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
      this.productVideos.forEach(item => {
        if (Number(item.serial) === 1) {
          formData.delete("master_video");
        } else if (Number(item.serial) === 2) {
          formData.delete("baby_video");
        }
      });
      formData.append("proportion", this.uploadForm.proportion);
      this.subTableData(formData);
    },

    /* 商品文本描述formData */
    editProDec() {
      this.loadingUploadDec = true;
      let formData = new FormData();
      formData.append("moduleNum", "6");
      formData.append("producode", this.producode);
      formData.append("webDesc", this.uploadForm.webDesc);
      formData.append("phoneDesc", this.uploadForm.phoneDesc);
      this.subTableData(formData);
    },

    /* 支付信息formData */
    editPayInfo() {
      this.loadingPay = true;
      let formData = new FormData();
      formData.append("moduleNum", "2");
      formData.append("producode", this.producode);
      formData.append("paymethod", this.payForm.paymethod);
      formData.append("stockmethod", this.payForm.stockmethod);
      this.subTableData(formData);
    },

    /* 售后服务formData */
    editPostSale() {
      this.loadingServer = true;
      let formData = new FormData();
      formData.append("moduleNum", "3");
      formData.append("producode", this.producode);
      formData.append("invoice", this.postSaleForm.invoice);
      formData.append("state", this.postSaleForm.state);
      this.subTableData(formData);
    },

    /* 拼装提交数据 */
    async subTableData(formData) {
      try {
        const {
          data: { code, msg }
        } = await axios.post(
          `${process.env.VUE_APP_BASE_API}/mounttai/publish/modifyProductInfo`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + getToken()
            }
          }
        );
        if (code === 200) {
          await this.getDetailData();
          this.msgSuccess("修改成功");
          this._loadingCancel();
        } else {
          MessageBox({
            message: msg,
            type: "error",
            duration: 5 * 1000
          });
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
      this.imgBoxShow = true;
      this.videoBoxShow = true;
    }
  }
};
</script>