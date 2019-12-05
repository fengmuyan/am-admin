<template>
  <div class="pro-publish app-container">
    <div v-if="!haveCateData" class="block top-select">
      <el-form ref="cateForm" :inline="true" :model="cateForm" label-width="100px">
        <el-form-item
          label="产品分类："
          prop="cateData"
          :rules="{
            required: true, message: '分类选项不能为空', trigger: 'blur'
          }"
        >
          <el-cascader
            placeholder="试试搜索：苹果"
            :options="proOptionsInit"
            v-model="cateForm.cateData"
            filterable
            :filter-method="dataFilter"
            :props="{emitPath:false}"
            ref="elCascader"
            @change="cateChange"
            style="width:360px"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          v-for="(item,index) in cateForm.cateInputArr"
          :key="index"
          :label="item.label+'：'"
          :prop="'cateInputArr.' + index + '.inputVal'"
          :rules="{
            required: true, message: `${item.label}不能为空`, trigger: 'blur'
          }"
        >
          <el-input v-model="item.inputVal" style="width:260px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="proPublish('cateForm')">确认提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="haveCateData">
      <div class="block">
        <h4>当前类目：{{cateDataText}}</h4>
        <el-button @click="switchCate">切换类目</el-button>
      </div>
      <div class="block">
        <h4>自然属性</h4>
        <el-form
          :model="titleForm"
          ref="titleForm"
          :rules="titleFormRules"
          label-width="110px"
          style="border-bottom: 1px solid #f3f4f5;margin-bottom:20px"
        >
          <el-form-item label="商品名称：" prop="produname">
            <el-input v-model="titleForm.produname" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="商品标题：" prop="title">
            <el-input v-model="titleForm.title" style="width:300px"></el-input>
          </el-form-item>
        </el-form>
        <dynamic-form v-model="naturalDataInit"></dynamic-form>
      </div>
      <div class="block">
        <h4>销售属性</h4>
        <el-form
          :model="valuationForm"
          ref="valuationForm"
          :rules="valuationRules"
          label-width="110px"
          style="border-bottom: 1px solid #f3f4f5;margin-bottom:20px"
        >
          <el-form-item label="计价方式：" prop="pricetype">
            <el-radio-group v-model="valuationForm.pricetype">
              <el-radio label="1">按数量</el-radio>
              <el-radio label="2">按重量</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="valuationForm.pricetype === '2'">
            <el-form-item label="重量单位" prop="weightunit">
              <el-radio-group v-model="valuationForm.weightunit">
                <el-radio label="公斤">公斤</el-radio>
                <el-radio label="斤">斤</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="净重" prop="netweight">
              <el-input v-model="valuationForm.netweight" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="毛重" prop="grossweight">
              <el-input v-model="valuationForm.grossweight" style="width:300px"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="折扣方式：" prop="isdiscount">
            <el-radio-group v-model="valuationForm.isdiscount">
              <el-radio label="1">有折扣</el-radio>
              <el-radio label="2">无折扣</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <dynamic-form v-model="saleDataInit" :isHaveTable="true" @table-show="tableShow"></dynamic-form>
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
          >
            <el-form-item label="宝贝主图：" prop="img_one">
              <upload-img :limit="1" @add-item="addItemFir" v-model="uploadForm.img_one"></upload-img>
            </el-form-item>
            <el-form-item label="宝贝图：" prop="img_two">
              <upload-img :limit="3" @add-item="addItemCenter" v-model="uploadForm.img_two"></upload-img>
            </el-form-item>
            <el-form-item label="宝贝底图：" prop="img_five">
              <upload-img :limit="1" @add-item="addItemLast" v-model="uploadForm.img_five"></upload-img>
            </el-form-item>
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
            <el-form-item label="宝贝视频：" prop="baby_video">
              <upload-video @add-item="addVideoSec" v-model="uploadForm.baby_video"></upload-video>
            </el-form-item>
            <el-form-item label="电脑端描述：" prop="webDesc" class="editor-item">
              <editor v-model="uploadForm.webDesc"></editor>
            </el-form-item>
            <el-form-item label="手机端描述：" prop="phoneDesc" class="editor-item">
              <editor v-model="uploadForm.phoneDesc"></editor>
            </el-form-item>
            <el-form-item label="展示分类：" prop="homepageclass">
              <el-radio-group v-model="uploadForm.homepageclass">
                <el-radio
                  v-for="(item,index) in homePageClasses"
                  :label="item.hcode"
                  :key="index"
                >{{item.hname}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="block">
        <h4>支付信息</h4>
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
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
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
            <el-radio-group v-model="postSaleForm.invoice">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上架状态：" prop="state">
            <el-radio-group v-model="postSaleForm.state">
              <el-radio label="1">立即上架</el-radio>
              <el-radio label="4">定时上架</el-radio>
              <el-radio label="2">下架</el-radio>
              <el-radio label="3">放入库存</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="this.postSaleForm.state === '4'" label="上架时间：" prop="publishtime">
            <el-date-picker
              type="datetime"
              v-model="postSaleForm.publishtime"
              placeholder="请输入上架时间"
              style="width:300px"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <el-button @click="subTableData">发布提交</el-button>
    </div>
    <div v-loading="loading" class="block empty-block" v-else>请先选择一个分类。</div>
  </div>
</template>
<script>
import DynamicForm from "@/components/DynamicForm";
import DynamicTable from "@/components/DynamicTable";
import UploadImg from "@/components/UploadImg";
import UploadVideo from "@/components/UploadVideo";
import Editor from "@/components/Editor";
import { getProCate, getProData, getHomePageClass } from "@/api/product";
import md5 from "js-md5";
import axios from "axios";
import { getToken } from "@/utils/auth";
import {
  initFormData,
  deInitFormData,
  toCombination,
  InitTableData,
  setRowSpan,
  sortTableArr,
  deepClone,
  parseTime,
  setTableSubData
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
      proOptions: [],
      proOptionsInit: [],
      haveCateData: false,
      naturalData: [],
      naturalDataInit: [],
      saleData: [],
      saleDataInit: [],
      itemIdArr: [],
      tableArr: [],
      tableIsShow: false,
      homePageClasses: [],
      cateDataText: "",
      cversion: "",

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
      cateForm: {
        cateData: "",
        cateInputArr: []
      },
      uploadForm: {
        img_one: "",
        img_two: "",
        img_three: "",
        img_four: "",
        img_five: "",
        master_video: "",
        baby_video: "",
        proportion: "",
        webDesc: "",
        phoneDesc: "",
        homepageclass: "",
        imgCenter: []
      },
      titleForm: {
        produname: "",
        title: ""
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
        ],
        homepageclass: [
          { required: true, message: "请输入商品在主页中分类", trigger: "blur" }
        ]
      },
      titleFormRules: {
        produname: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入商品标题", trigger: "blur" }]
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
    try {
      const [
        {
          data: {
            cmdtClassTree: { children }
          },
          code: code1
        },
        {
          data: { homePageClasses },
          code: code2
        }
      ] = await Promise.all([getProCate({}), getHomePageClass()]);
      if (code1 === 200) {
        this.proOptionsInit = this._initDataArr(this._delEmptyVal(children));
      }
      if (code1 === 200) {
        this.homePageClasses = homePageClasses;
      }
    } catch (err) {
      console.log(err);
    }
  },

  methods: {
    addItemFir(val) {
      this.uploadForm.img_one = val[0];
    },
    addItemLast(val) {
      this.uploadForm.img_five = val[0];
    },
    addItemCenter(val) {
      this.uploadForm.imgCenter = val;
    },
    addVideoFir(val) {
      this.uploadForm.master_video = val;
    },
    addVideoSec(val) {
      this.uploadForm.baby_video = val;
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

    dataFilter(node, keyword) {
      if (
        node.data.enlabel.includes(keyword) ||
        node.data.enlabel.includes(keyword.toLowerCase()) ||
        node.data.label.includes(keyword)
      ) {
        return true;
      } else {
        return false;
      }
    },

    cateChange(val) {
      this.cateForm.cateInputArr = [];
      this._selectCode(this.proOptionsInit, val);
    },

    proPublish(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true;
          const { cateData: ccode } = this.cateForm;
          try {
            const {
              code,
              data: { naturepro, salepro, cversion }
            } = await getProData({ ccode });
            if (code === 200) {
              this.loading = false;
              this.haveCateData = true;
              this.cversion = cversion;
              this.cateDataText = this.$refs.elCascader.inputValue;
              this.naturalData = JSON.parse(naturepro).naturepro;
              this.saleData = JSON.parse(salepro).salepro;
              this.naturalDataInit = initFormData(deepClone(this.naturalData));
              this.saleDataInit = initFormData(deepClone(this.saleData));
            } else {
              this.loading = false;
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

    switchCate() {
      this.haveCateData = false;
    },

    /* 拼装提交数据 */
    async subTableData() {
      try {
        const {
          data: { code, msg }
        } = await axios.post(
          `${process.env.VUE_APP_BASE_API}/mounttai/publish/publish`,
          this._initFormdataSub(),
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + getToken()
            }
          }
        );
        if (code === 200) {
        }
      } catch (err) {
        console.log(err);
      }
    },

    _initFormdataSub() {
      const tags = this.cateForm.cateInputArr.reduce((pre, item) => {
        Object.assign(pre, { [item.label]: item.inputVal });
        return pre;
      }, {});
      const naturalDataInit = JSON.parse(JSON.stringify(this.naturalDataInit));
      const saleDataInit = JSON.parse(JSON.stringify(this.saleDataInit));
      let formData = new FormData();
      formData.append("ccode", this.cateForm.cateData);
      formData.append("cversion", this.cversion);
      formData.append("produname", this.titleForm.produname);
      formData.append("title", this.titleForm.produname);
      formData.append(
        "naturepro",
        JSON.stringify({ naturepro: deInitFormData(naturalDataInit) })
      );
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
      formData.append("tags", JSON.stringify(tags));
      formData.append("isdiscount", this.valuationForm.isdiscount);
      formData.append("pricetype", this.valuationForm.pricetype);
      formData.append("grossweight", this.valuationForm.grossweight);
      formData.append("netweight", this.valuationForm.netweight);
      formData.append("weightunit", this.valuationForm.weightunit);
      formData.append("homepageclass", this.uploadForm.homepageclass);
      formData.append("webDesc", this.uploadForm.webDesc);
      formData.append("phoneDesc", this.uploadForm.phoneDesc);
      formData.append("img_one", this.uploadForm.img_one);
      formData.append("img_two", this.uploadForm.imgCenter[0]);
      formData.append("img_three", this.uploadForm.imgCenter[1]);
      formData.append("img_four", this.uploadForm.imgCenter[2]);
      formData.append("img_five", this.uploadForm.img_five);
      formData.append("proportion", this.uploadForm.proportion);
      formData.append("master_video", this.uploadForm.master_video);
      formData.append("baby_video", this.uploadForm.baby_video);
      formData.append("paymethod", this.payForm.paymethod);
      formData.append("stockmethod", this.payForm.stockmethod);
      formData.append("invoice", this.postSaleForm.invoice);
      formData.append("state", this.postSaleForm.state);
      formData.append("issupsubstitute", this.logisticsForm.issupsubstitute);
      if (this.postSaleForm.state === "4") {
        formData.append(
          "publishtime",
          parseTime(this.postSaleForm.publishtime, "{y}-{m}-{d} {h}:{i}:{s}")
        );
      }
      return formData;
    },

    _selectCode(arr, val) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === val && arr[i].tagArr) {
          return (this.cateForm.cateInputArr = deepClone(arr[i].tagArr));
        } else {
          if (arr[i].children) {
            this._selectCode(arr[i].children, val);
          }
        }
      }
    },

    _delEmptyVal(arr) {
      return arr.map(item => {
        if (item.children && item.children.length === 0) {
          return Object.assign(item, { children: null });
        } else {
          this._delEmptyVal(item.children);
          return item;
        }
      });
    },

    _initDataArr(arr) {
      return arr.map(item => {
        const idx =
          item.children &&
          item.children.findIndex(v => {
            return v.istag === "Y";
          });
        if (idx === null) {
          return item;
        }
        if (idx !== -1) {
          const tagArr = item.children.map(j => {
            return Object.assign(j, { inputVal: "" });
          });
          return Object.assign(item, { tagArr, children: null });
        } else {
          this._initDataArr(item.children);
          return item;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.pro-publish {
  .block {
    border: 1px solid #ccc;
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    h4 {
      width: 100%;
      border-bottom: 1px solid #ddd;
      height: 40px;
      line-height: 40px;
      margin: 0;
      margin-bottom: 20px;
    }
    .upload {
      display: flex;
      flex-direction: row;
    }
    .editor-item {
      margin-bottom: 70px;
      .avatar-uploader {
        display: none;
      }
    }
  }
  .empty-block {
    height: 600px;
    line-height: 600px;
    text-align: center;
    color: #999;
    .el-loading-spinner {
      top: 0;
    }
  }
}
</style>

