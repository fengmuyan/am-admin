<template>
  <div class="account app-container">
    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-table style="width: 100%" v-loading="loading" :data="passList">
        <el-table-column label="通道编号" prop="channelcode" width="70" />
        <el-table-column label="通道名称" prop="channelname" show-overflow-tooltip />
        <el-table-column label="收款户名" prop="accountname" show-overflow-tooltip />
        <el-table-column label="银行账号" prop="bankaccount" show-overflow-tooltip />
        <el-table-column label="开户行名称" prop="bankname" show-overflow-tooltip />
        <el-table-column label="开户行行号" prop="bankno" show-overflow-tooltip />
        <el-table-column label="预留手机号" prop="mobilephone" width="100" />
        <el-table-column label="注册类型" prop="registertype" width="90">
          <template slot-scope="scope">{{registertypeArr[Number(scope.row.registertype)]}}</template>
        </el-table-column>
        <el-table-column label="开通状态" prop="merstate" width="70">
          <template slot-scope="scope">
            <span
              :class="{'warn-color':scope.row.merstate===2,'suc-color':scope.row.merstate===1}"
            >{{scope.row.merstate === null?"未开户":merstateArr[Number(scope.row.merstate)]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-if="isShowBtn('add',scope.row.merstate)"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
            >开通账户</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-if="isShowBtn('edit',scope.row.merstate)"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              v-if="isShowBtn('verify',scope.row.merstate)"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleVerify(scope.row)"
            >验证</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit-outline"
              v-if="isShowBtn('sign',scope.row.merstate)"
              @click="handleSigning(scope.row)"
            >签约</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="开通收款账户"
      custom-class="edit-table-dialog"
      :visible.sync="createOpen"
      :close-on-click-modal="false"
      @close="clearValidateAccount"
      width="878px"
    >
      <el-form
        :model="accountForm"
        ref="accountForm"
        :rules="accountFormRules"
        :inline="true"
        label-width="120px"
      >
        <div>
          <el-form-item label="银行帐号" prop="bankaccount">
          <el-input
            v-model="accountForm.bankaccount"
            placeholder="请输入银行账号"
            clearable
            maxlength="19"
            style="width: 210px"
          />
          <div class="tip">* 请使用{{abcOrIcbc}}银行账户进行收款，否则资金结算会产生手续费。</div>
        </el-form-item>
        </div>
        <el-form-item label="收款户名" prop="accountname">
          <el-input
            v-model="accountForm.accountname"
            placeholder="请输入收款户名"
            clearable
            style="width: 210px"
          />
        </el-form-item>
        <el-form-item label="预留手机号" prop="mobilephone">
          <el-input
            v-model="accountForm.mobilephone"
            placeholder="请输入银行预留手机号"
            clearable
            maxlength="11"
            style="width: 210px"
          />
        </el-form-item>
        <el-form-item label="开户行名称" prop="bankname">
          <el-select
            v-model="accountForm.bankname"
            filterable
            placeholder="请选择开户行名称"
            @change="bankChange"
            style="width: 210px"
          >
            <el-option
              v-for="item in bankArr"
              :key="item.bankNum"
              :label="item.bank"
              :value="item.bank"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户行行号" prop="bankno">
          <el-input
            v-model="accountForm.bankno"
            placeholder="由开户行带出"
            disabled
            style="width: 210px"
          />
        </el-form-item>
        <el-form-item label="开户省份" prop="bankprovince" v-if="abcOrIcbc ==='工商'">
          <el-select
            v-model="accountForm.bankprovince"
            placeholder="请选择开户省份"
            @change="provideChange"
            filterable
            style="width: 210px"
          >
            <el-option
              v-for="item in provideArr"
              :key="item.region_id"
              :label="item.region_name"
              :value="item.region_name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户城市" prop="bankcity" v-if="abcOrIcbc ==='工商'">
          <el-select
            v-model="accountForm.bankcity"
            placeholder="请选择开户城市"
            filterable
            style="width: 210px"
          >
            <el-option
              v-for="item in cityArr"
              :key="item.region_id"
              :label="item.region_name"
              :value="item.region_name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户行支行" prop="subbranch" v-if="abcOrIcbc ==='工商'">
          <el-input
            v-model="accountForm.subbranch"
            placeholder="请输入开户行支行"
            clearable
            style="width: 210px"
          />
        </el-form-item>
        <el-form-item label="邮政编码" prop="zipcode" v-if="abcOrIcbc ==='工商'">
          <el-input
            v-model="accountForm.zipcode"
            placeholder="请输入商户邮政编码"
            clearable
            style="width: 210px"
          />
        </el-form-item>
        <div class="adr-box" v-if="abcOrIcbc ==='微信' || abcOrIcbc ==='工商'">
          <el-form-item label="商户地区" prop="provincecode" class="adr-item">
            <el-select
              v-model="accountForm.provincecode"
              placeholder="请选择省份"
              @change="provideChangeSec"
              class="w190"
            >
              <el-option
                v-for="item in provideArrSec"
                :key="item.region_id"
                :label="item.region_name"
                :value="item.area_code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="citycode" class="city-item">
            <el-select
              v-model="accountForm.citycode"
              placeholder="请选择城市"
              @change="cityChangeSec"
              class="w190"
            >
              <el-option
                v-for="item in cityArrSec"
                :key="item.region_id"
                :label="item.region_name"
                :value="item.area_code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="areacode" class="area-item">
            <el-select v-model="accountForm.areacode" placeholder="请选择区县" class="w190">
              <el-option
                v-for="item in areaArrSec"
                :key="item.region_id"
                :label="item.region_name"
                :value="item.area_code"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="身份证有效期" prop="idcardvalidtime" v-if="abcOrIcbc ==='微信'">
          <el-date-picker
            v-model="accountForm.idcardvalidtime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            style="width: 210px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="详细地址" prop="address" v-if="abcOrIcbc ==='工商'">
          <el-input v-model="accountForm.address" style="width: 554px" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="收款卡类型" prop="cardtype">
          <el-select
            v-model="accountForm.cardtype"
            placeholder="请选择收款卡类型"
            style="width: 210px"
            :disabled="Number(registertype) === 1"
          >
            <el-option label="个人" value="0"></el-option>
            <el-option label="对公" value="1"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="abcOrIcbc ==='工商'">
          <el-form-item label="商品申请书1" prop="cbmsVendorApplPic1" class="file-item" ref="itemFir1" style="margin-left:7px;">
            <upload-img
              v-if="imageShow"
              @add-item="addItem($event,'cbmsVendorApplPic1','itemFir1')"
              @del-item="delItem('cbmsVendorApplPic1')"
              :file="accountForm.cbmsVendorApplPic1?[{uid:0,url:accountForm.cbmsVendorApplPic1}]:[null]"
            ></upload-img>
          </el-form-item>
          <el-form-item label="商品申请书2" prop="cbmsVendorApplPic2" class="file-item" ref="itemFir2">
            <upload-img
              v-if="imageShow"
              @add-item="addItem($event,'cbmsVendorApplPic2','itemFir2')"
              @del-item="delItem('cbmsVendorApplPic2')"
              :file="accountForm.cbmsVendorApplPic2?[{uid:0,url:accountForm.cbmsVendorApplPic2}]:[null]"
            ></upload-img>
          </el-form-item>
          <el-form-item label="商品申请书3" prop="cbmsVendorApplPic3" class="file-item" ref="itemFir3">
            <upload-img
              v-if="imageShow"
              @add-item="addItem($event,'cbmsVendorApplPic3','itemFir3')"
              @del-item="delItem('cbmsVendorApplPic3')"
              :file="accountForm.cbmsVendorApplPic3?[{uid:0,url:accountForm.cbmsVendorApplPic3}]:[null]"
            ></upload-img>
          </el-form-item>
          <el-form-item label="商品申请书4" prop="cbmsVendorApplPic4" class="file-item" ref="itemFir4">
            <upload-img
              v-if="imageShow"
              @add-item="addItem($event,'cbmsVendorApplPic4','itemFir4')"
              @del-item="delItem('cbmsVendorApplPic4')"
              :file="accountForm.cbmsVendorApplPic4?[{uid:0,url:accountForm.cbmsVendorApplPic4}]:[null]"
            ></upload-img>
          </el-form-item>
          <el-form-item label="商品申请书5" prop="cbmsVendorApplPic5" class="file-item" ref="itemFir5">
            <upload-img
              v-if="imageShow"
              @add-item="addItem($event,'cbmsVendorApplPic5','itemFir5')"
              @del-item="delItem('cbmsVendorApplPic5')"
              :file="accountForm.cbmsVendorApplPic5?[{uid:0,url:accountForm.cbmsVendorApplPic5}]:[null]"
            ></upload-img>
          </el-form-item>
          <el-form-item
            label="征信授权书1"
            prop="cbmsCreditQryAuthPic1"
            class="file-item"
            ref="itemSec1"
            style="margin-left:7px;"
          >
            <upload-img
              v-if="imageShow"
              @add-item="addItem($event,'cbmsCreditQryAuthPic1','itemSec1')"
              @del-item="delItem('cbmsCreditQryAuthPic1')"
              :file="accountForm.cbmsCreditQryAuthPic1?[{uid:0,url:accountForm.cbmsCreditQryAuthPic1}]:[null]"
            ></upload-img>
          </el-form-item>
          <el-form-item
            label="征信授权书2"
            prop="cbmsCreditQryAuthPic2"
            class="file-item"
            ref="itemSec2"
          >
            <upload-img
              v-if="imageShow"
              @add-item="addItem($event,'cbmsCreditQryAuthPic2','itemSec2')"
              @del-item="delItem('cbmsCreditQryAuthPic2')"
              :file="accountForm.cbmsCreditQryAuthPic2?[{uid:0,url:accountForm.cbmsCreditQryAuthPic2}]:[null]"
            ></upload-img>
          </el-form-item>
          <el-form-item label="开户许可证" prop="cbmsOpenAcctAuthPic1" class="file-item" ref="itemThi">
            <upload-img
              v-if="imageShow"
              @add-item="addItem($event,'cbmsOpenAcctAuthPic1','itemThi')"
              @del-item="delItem('cbmsOpenAcctAuthPic1')"
              :file="accountForm.cbmsOpenAcctAuthPic1?[{uid:0,url:accountForm.cbmsOpenAcctAuthPic1}]:[null]"
            ></upload-img>
          </el-form-item>
          <el-form-item label="调查审批表1" prop="cbmsInvestApprPic1" class="file-item" ref="itemFou1">
            <upload-img
              v-if="imageShow"
              @add-item="addItem($event,'cbmsInvestApprPic1','itemFou1')"
              @del-item="delItem('cbmsInvestApprPic1')"
              :file="accountForm.cbmsInvestApprPic1?[{uid:0,url:accountForm.cbmsInvestApprPic1}]:[null]"
            ></upload-img>
          </el-form-item>
          <el-form-item label="调查审批表2" prop="cbmsInvestApprPic2" class="file-item" ref="itemFou2">
            <upload-img
              v-if="imageShow"
              @add-item="addItem($event,'cbmsInvestApprPic2','itemFou2')"
              @del-item="delItem('cbmsInvestApprPic2')"
              :file="accountForm.cbmsInvestApprPic2?[{uid:0,url:accountForm.cbmsInvestApprPic2}]:[null]"
            ></upload-img>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createOpen = false">取 消</el-button>
        <el-button type="primary" @click="createAccount('accountForm')" :loading="loadingCreate">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="开通验证" :visible.sync="verifyOpen" @close="clearValidateVerify" width="600px">
      <el-form
        :model="verifyForm"
        ref="verifyForm"
        :rules="verifyFormRules"
        :inline="true"
        label-width="120px"
      >
        <el-form-item
          label="手机验证码"
          prop="vercode"
          v-if="Number(accountFormData.cardtype) === 0"
          class="code-item"
        >
          <el-input
            v-model="verifyForm.vercode"
            maxlength="6"
            placeholder="输入验证码"
            class="code-input"
          ></el-input>
          <ge-code :config="config" ref="geCode" class="code-btn"></ge-code>
        </el-form-item>
        <el-form-item label="随机金额" prop="amount" v-if="Number(accountFormData.cardtype) === 1">
          <el-input v-model="verifyForm.amount" placeholder="请输入绑定银行卡收到的入款金额" style="width:300px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="verifyOpen = false">取 消</el-button>
        <el-button type="primary" @click="verifyConfirm('verifyForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="签约验证码" :visible.sync="signOpen" width="500px" @close="clearTimer">
      <div style="text-align: center;">
        <span
          style="color: rgb(100,100,100);text-align: center;display: block;line-height: 18px;"
        >请使用微信扫一扫签约</span>
        <el-image :src="signImg"></el-image>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="signOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import bankArr from "@/utils/bank";
import bankWxArr from "@/utils/bank-wx";
import geCode from "vue-gecode";
import City from "@/utils/city.js";
import minHeightMix from "@/mixins/minHeight";
import UploadImg from "@/components/UploadImg";
import {
  getAccountPass,
  createAccount,
  bindCardConfirm,
  resentCode,
  handelAccountSign
} from "@/api/account";
export default {
  mixins: [minHeightMix],
  components: {
    geCode,
    UploadImg
  },
  data() {
    var validateTel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入预留手机号"));
      } else {
        if (!/^1[345678]\d{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        }
        callback();
      }
    };
    var validateAccount = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入银行卡号"));
      } else {
        if (!/\d{15}|\d{19}/.test(value)) {
          callback(new Error("请输入正确的银行卡号"));
        }
        callback();
      }
    };
    var validateAmount = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入金额"));
      } else {
        if (!/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(value)) {
          callback(new Error("必须非负整数或至多保留两位小数！"));
        }
        callback();
      }
    };
    return {
      loading: false,
      createOpen: false,
      verifyOpen: false,
      codeLock: false,
      imageShow: false,
      signOpen: false,
      loadingCreate: false,
      signImg: "",
      timer: null,
      passList: [],
      bankArr: [],
      merstateArr: [
        "审核中",
        "审核通过",
        "审核失败",
        "待验证",
        "解约",
        "已关闭",
        "待签约"
      ],
      registertypeArr: ["个人", "企业", "个体工商户"],
      registertype: "",
      provideArr: [],
      cityArr: [],
      provideArrSec: [],
      cityArrSec: [],
      areaArrSec: [],
      cityArrThi: [],
      accountForm: {
        cbmsVendorApplPic1: null,
        cbmsVendorApplPic2: null,
        cbmsVendorApplPic3: null,
        cbmsVendorApplPic4: null,
        cbmsVendorApplPic5: null,

        cbmsCreditQryAuthPic1: null,
        cbmsCreditQryAuthPic2: null,

        cbmsOpenAcctAuthPic1: null,
        cbmsInvestApprPic1: null,
        cbmsInvestApprPic2: null,

        bankprovince: undefined,
        bankcity: undefined,
        subbranch: undefined,
        channelcode: "",
        accountname: "",
        bankaccount: "",
        mobilephone: "",
        bankname: "",
        bankno: "",
        cardtype: "1",
        provincecode: undefined,
        citycode: undefined,
        areacode: undefined,
        zipcode: undefined,
        address: undefined,
        idcardvalidtime: undefined
      },
      accountFormRules: {
        accountname: [
          { required: true, message: "请输入收款户名", trigger: "blur" }
        ],
        bankaccount: [
          { validator: validateAccount, required: true, trigger: "blur" }
        ],
        mobilephone: [
          { validator: validateTel, required: true, trigger: "blur" }
        ],
        bankname: [
          {
            required: true,
            message: "请输入开户行名称",
            trigger: ["blur", "change"]
          }
        ],
        bankno: [
          {
            required: true,
            message: "请输入开户行行号",
            trigger: ["blur", "change"]
          }
        ],
        cardtype: [
          { required: true, message: "请输入收款卡类型", trigger: "blur" }
        ],
        cbmsVendorApplPic1: [
          { required: true, message: "请上传商户申请书1", trigger: "blur" }
        ],
        cbmsVendorApplPic2: [
          { required: true, message: "请上传商户申请书2", trigger: "blur" }
        ],
        cbmsVendorApplPic3: [
          { required: true, message: "请上传商户申请书3", trigger: "blur" }
        ],
        cbmsVendorApplPic4: [
          { required: true, message: "请上传商户申请书4", trigger: "blur" }
        ],
        cbmsVendorApplPic5: [
          { required: true, message: "请上传商户申请书5", trigger: "blur" }
        ],

        cbmsCreditQryAuthPic1: [
          { required: true, message: "请上传征信查询授权书1", trigger: "blur" }
        ],
        cbmsCreditQryAuthPic2: [
          { required: true, message: "请上传征信查询授权书2", trigger: "blur" }
        ],

        cbmsOpenAcctAuthPic1: [
          { required: true, message: "请上传开户许可证", trigger: "blur" }
        ],
        cbmsInvestApprPic1: [
          { required: true, message: "请上传1调查审批表1", trigger: "blur" }
        ],
        cbmsInvestApprPic2: [
          { required: true, message: "请上传1调查审批表2", trigger: "blur" }
        ],
        bankprovince: [
          { required: true, message: "请选择开户省份", trigger: "change" }
        ],
        bankcity: [
          { required: true, message: "请选择开户城市", trigger: "change" }
        ],
        subbranch: [
          { required: true, message: "请选择开户支行", trigger: "blur" }
        ],
        provincecode: [
          { required: true, message: "请选择地区", trigger: "change" }
        ],
        citycode: [
          { required: true, message: "请选择城市", trigger: "change" }
        ],
        areacode: [
          { required: true, message: "请选择区县", trigger: "change" }
        ],
        zipcode: [
          { required: true, message: "请输入邮政编码", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        idcardvalidtime: [
          { required: true, message: "身份证有效期不能为空", trigger: "blur" }
        ]
      },
      verifyForm: {
        vercode: "",
        amount: ""
      },
      verifyFormRules: {
        vercode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        amount: [{ validator: validateAmount, required: true, trigger: "blur" }]
      },
      config: {
        startText: "获取验证码",
        endText: "再次获取",
        totalTime: 60, //多久一次
        tickTime: 1, //步值
        todo: async () => {
          if (!this.codeLock) {
            try {
              const { code } = await resentCode(this.accountFormData);
              if (code === 200) {
                return true;
              } else {
                this.msgError("短信发送失败！");
              }
            } catch (e) {
              this.$refs.geCode.stop(1);
              console.log(e);
            }
          }
        }, //调取方法
        computeText(num) {
          return "重新获取 " + num + "s";
        }
      }, //短信验证码配置
      accountFormData: {}
    };
  },
  computed: {
    isShowBtn() {
      return function(type, status) {
        if (type === "add") {
          if (status === null) {
            return true;
          }
        } else if (type === "edit") {
          if (Number(status) === 2) {
            return true;
          }
        } else if (type === "verify") {
          if (Number(status) === 3) {
            return true;
          }
        } else if (type === "sign") {
          if (Number(status) === 6) {
            return true;
          }
        }
      };
    },
    abcOrIcbc() {
      if (this.accountForm.channelcode === "100001") {
        return "农行";
      } else if (this.accountForm.channelcode === "100002") {
        return "工商";
      } else if (this.accountForm.channelcode === "100003") {
        return "微信";
      }
    }
  },
  created() {
    this.getList();
  },
  mounted() {
    this.provideArr = City.provide;
    this.provideArrSec = City.provide;
  },
  methods: {
    async initAccountForm() {
      Object.assign(this.accountForm, {
        channelcode: "",
        accountname: "",
        bankaccount: "",
        bankname: "",
        mobilephone: "",
        bankno: "",

        cbmsVendorApplPic1: null,
        cbmsCreditQryAuthPic1: null,
        cbmsOpenAcctAuthPic1: null,
        cbmsInvestApprPic1: null,
        bankprovince: undefined,
        bankcity: undefined,
        subbranch: undefined,
        provincecode: undefined,
        citycode: undefined,
        areacode: undefined,
        zipcode: undefined,
        address: undefined,
        idcardvalidtime: undefined
      });
      this.cityArr = [];
      this.cityArrSec = [];
      this.areaArrSec = [];
    },

    async handleAdd(item) {
      this.imageShow = false;
      this.initAccountForm();
      await this.$nextTick();
      this.imageShow = true;
      this.registertype = item.registertype;
      Object.assign(this.accountForm, {
        channelcode: item.channelcode
      });
      this.bankArr = bankArr;
      if (item.channelcode === "100003") {
        this.bankArr = bankWxArr;
      }
      this.createOpen = true;
    },

    async getList() {
      this.bankArr = bankArr;
      this.loading = true;
      try {
        const { code, data } = await getAccountPass();
        this.loading = false;
        if (code === 200) {
          this.passList = data;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },

    bankChange(val) {
      this.accountForm.bankno = this.bankArr.find(item => {
        return item.bank === val;
      }).bankNum;
    },

    clearValidateAccount() {
      this.$refs.accountForm.resetFields();
    },

    clearValidateVerify() {
      this.$refs.verifyForm.resetFields();
    },

    createAccount(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loadingCreate = true;
          try {
            let formData = new FormData();
            formData.append("bankaccount", this.accountForm.bankaccount);
            formData.append("channelcode", this.accountForm.channelcode);
            formData.append("accountname", this.accountForm.accountname);
            formData.append("mobilephone", this.accountForm.mobilephone);
            formData.append("bankname", this.accountForm.bankname);
            formData.append("bankno", this.accountForm.bankno);
            formData.append("cardtype", this.accountForm.cardtype);
            if (this.accountForm.channelcode === "100002") {
              formData.append("bankprovince", this.accountForm.bankprovince);
              formData.append("bankcity", this.accountForm.bankcity);
              formData.append("subbranch", this.accountForm.subbranch);
              formData.append("provincecode", this.accountForm.provincecode);
              formData.append("citycode", this.accountForm.citycode);
              formData.append("areacode", this.accountForm.areacode);
              formData.append("address", this.accountForm.address);
              formData.append("zipcode", this.accountForm.zipcode);
              formData.append(
                "cbmsVendorApplPic1",
                this.accountForm.cbmsVendorApplPic1
              );
              formData.append(
                "cbmsVendorApplPic2",
                this.accountForm.cbmsVendorApplPic2
              );
              formData.append(
                "cbmsVendorApplPic3",
                this.accountForm.cbmsVendorApplPic3
              );
              formData.append(
                "cbmsVendorApplPic4",
                this.accountForm.cbmsVendorApplPic4
              );
              formData.append(
                "cbmsVendorApplPic5",
                this.accountForm.cbmsVendorApplPic5
              );

              formData.append(
                "cbmsCreditQryAuthPic1",
                this.accountForm.cbmsCreditQryAuthPic1
              );
              formData.append(
                "cbmsCreditQryAuthPic2",
                this.accountForm.cbmsCreditQryAuthPic2
              );

              formData.append(
                "cbmsOpenAcctAuthPic1",
                this.accountForm.cbmsOpenAcctAuthPic1
              );
              formData.append(
                "cbmsInvestApprPic1",
                this.accountForm.cbmsInvestApprPic1
              );
              formData.append(
                "cbmsInvestApprPic2",
                this.accountForm.cbmsInvestApprPic2
              );
            }
            if (this.accountForm.channelcode === "100003") {
              formData.append(
                "idcardvalidtime",
                this.accountForm.idcardvalidtime
              );
              formData.append("provincecode", this.accountForm.provincecode);
              formData.append("citycode", this.accountForm.citycode);
              formData.append("areacode", this.accountForm.areacode);
            }
            const { code } = await createAccount(formData);
            this.loadingCreate = false;
            if (code === 200) {
              this.getList();
              this.msgSuccess("操作成功");
              this.createOpen = false;
              if (this.accountForm.channelcode === "100001") {
                this.accountFormData = Object.assign({}, this.accountForm);
                this.verifyOpen = true;
                this.codeLock = true;
                await this.$nextTick();
                if (Number(this.accountForm.cardtype) === 0) {
                  this.$refs.geCode.runtime();
                }
                this.codeLock = false;
              }
            }
          } catch (err) {
            this.loadingCreate = false;
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },

    async handleEdit(item) {
      this.imageShow = false;
      this.initAccountForm();
      await this.$nextTick();
      this.imageShow = true;
      this.registertype = item.registertype;
      Object.assign(this.accountForm, {
        channelcode: item.channelcode,
        accountname: item.accountname,
        bankaccount: item.bankaccount,
        bankname: item.bankname,
        mobilephone: item.mobilephone,
        bankno: item.bankno
      });
      this.bankArr = bankArr;
      if (item.channelcode === "100002") {
        this.cityArr = City.getCity(item.bankprovince);
        this.cityArrSec = City.getCityforCode(item.provincecode);
        this.areaArrSec = City.getCityforCode(item.citycode);
        const imageurl = JSON.parse(item.imageurl);
        Object.assign(this.accountForm, {
          subbranch: item.subbranch,
          provincecode: item.provincecode,
          citycode: item.citycode,
          areacode: item.areacode,
          zipcode: item.zipcode,
          address: item.address,
          bankprovince: item.bankprovince,
          bankcity: item.bankcity,
          cbmsVendorApplPic1: imageurl["cbmsVendorApplPic1"],
          cbmsVendorApplPic2: imageurl["cbmsVendorApplPic2"],
          cbmsVendorApplPic3: imageurl["cbmsVendorApplPic3"],
          cbmsVendorApplPic4: imageurl["cbmsVendorApplPic4"],
          cbmsVendorApplPic5: imageurl["cbmsVendorApplPic5"],

          cbmsCreditQryAuthPic1: imageurl["cbmsCreditQryAuthPic1"],
          cbmsCreditQryAuthPic2: imageurl["cbmsCreditQryAuthPic2"],

          cbmsOpenAcctAuthPic1: imageurl["cbmsOpenAcctAuthPic1"],
          cbmsInvestApprPic1: imageurl["cbmsInvestApprPic1"],
          cbmsInvestApprPic2: imageurl["cbmsInvestApprPic2"]
        });
      } else if (item.channelcode === "100003") {
        this.cityArr = City.getCity(item.bankprovince);
        this.cityArrSec = City.getCityforCode(item.provincecode);
        this.areaArrSec = City.getCityforCode(item.citycode);
        Object.assign(this.accountForm, {
          provincecode: item.provincecode,
          citycode: item.citycode,
          areacode: item.areacode,
          idcardvalidtime: item.areacode
        });
      }
      this.createOpen = true;
    },

    async handleVerify(item) {
      Object.assign(this.accountFormData, {
        channelcode: item.channelcode,
        accountname: item.accountname,
        bankaccount: item.bankaccount,
        bankname: item.bankname,
        mobilephone: item.mobilephone,
        bankno: item.bankno,
        cardtype: item.cardtype
      });
      Object.assign(this.verifyForm, { vercode: "", amount: "" });
      this.verifyOpen = true;
    },

    async verifyConfirm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let data;
          if (Number(this.accountFormData.cardtype) === 0) {
            data = { vercode: this.verifyForm.vercode };
          } else if (Number(this.accountFormData.cardtype) === 1) {
            data = { amount: this.verifyForm.amount };
          }
          Object.assign(this.accountFormData, data);
          try {
            const { code } = await bindCardConfirm(this.accountFormData);
            if (code === 200) {
              this.getList();
              this.msgSuccess("验证成功！");
              this.verifyOpen = false;
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },

    async handleSigning(item) {
      this.clearTimer();
      try {
        const {
          data: { code: codeInner, sign_url, message },
          code
        } = await handelAccountSign({
          channelcode: item.channelcode
        });
        if (code === 200) {
          if (codeInner === "0000") {
            this.signImg = sign_url;
            this.signOpen = true;
            this.timer = setTimeout(() => {
              this.handleSigning(item);
            }, 5000);
          } else if (codeInner === "0001") {
            this.$confirm(message, `提示`, {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning",
              customClass: "el-message-box-wran"
            })
              .then(() => {
                this.signOpen = false;
                this.getList();
              })
              .catch(() => {});
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    clearTimer() {
      if (this.timer) {
        window.clearInterval(this.timer);
      }
      this.timer = null;
    },

    addItem(val, formAttr, dom) {
      this.accountForm[formAttr] = val[0];
      this.$refs[dom].clearValidate();
    },

    delItem(formAttr) {
      this.accountForm[formAttr] = null;
    },

    provideChange() {
      this.accountForm.bankcity = "";
      this.cityArr = City.getCity(this.accountForm.bankprovince);
    },

    provideChangeSec() {
      this.accountForm.citycode = "";
      this.accountForm.areacode = "";
      this.cityArrSec = City.getCityforCode(this.accountForm.provincecode);
    },

    cityChangeSec() {
      this.accountForm.areacode = "";
      this.areaArrSec = City.getCityforCode(this.accountForm.citycode);
    }
  }
};
</script>