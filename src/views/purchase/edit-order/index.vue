<template>
  <div class="app-container add-order">
    <div v-loading="loading">
      <div class="base-info block" style="min-height:400px">
        <h4>
          基本信息
          <el-button
            type="primary"
            :loading="loadingBase"
            size="mini"
            class="f-r"
            v-if="purState ==='0'"
            @click="editBasePro"
          >修改基本与商品信息</el-button>
        </h4>
        <el-form
          :model="baseForm"
          ref="baseForm"
          :rules="baseFormRules"
          label-width="100px"
          :inline="true"
        >
          <el-form-item label="采购进度：">
            <span class="status">{{purStateStr}}</span>
          </el-form-item>
          <el-form-item label="采购日期：" prop="purdate">
            <el-date-picker
              v-model="baseForm.purdate"
              type="date"
              size="small"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width: 200px"
              :disabled="purState !=='0'"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="采购员：" prop="purUsercode">
            <el-select
              v-model="baseForm.purUsercode"
              placeholder="请选择"
              size="small"
              style="width: 200px"
              :disabled="purState !=='0'"
            >
              <el-option
                v-for="(item,index) in puruserList"
                :key="index"
                :label="item.nickName"
                :value="item.userName"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <h4>商品信息</h4>
        <edit-table
          v-if="editTableShow"
          ref="editTable"
          :tableInit="tableData"
          :modelTableData="modelTableData"
          :thData="thData"
          :noEdit="purState !=='0'"
          :minWidth="purState!=='0'?'2600px':'2180px'"
          :gradeList="gradeList"
          :placeList="placeList"
        ></edit-table>
      </div>
      <div class="remark-info block" style="min-height:392px">
        <h4>
          备注信息
          <el-button
            type="primary"
            :loading="loadingImg"
            size="mini"
            class="f-r"
            @click="editRemarkImg"
          >修改备注与图片信息</el-button>
        </h4>
        <el-form
          :model="remarkForm"
          ref="remarkForm"
          :rules="remarkFormRules"
          label-width="100px"
          :inline="true"
        >
          <el-form-item label="采购实付：" prop="realprice">
            <el-input
              v-model="remarkForm.realprice"
              placeholder="请输入实付金额"
              size="small"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item
            label="回款人："
            prop="collUsername"
            :rules="{
            required: Number(remarkForm.realprice)>0, message: '回款人不能为空', trigger: 'blur'
          }"
          >
            <el-input
              v-model="remarkForm.collUsername"
              placeholder="请输入回款人"
              size="small"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="备注：" prop="remarks">
            <el-input
              v-model="remarkForm.remarks"
              placeholder="请输入备注"
              size="small"
              style="width: 600px"
            />
          </el-form-item>
        </el-form>
        <h4>图片信息</h4>
        <el-form
          :model="imgForm"
          ref="imgForm"
          :rules="imgFormRules"
          label-width="100px"
          :inline="true"
        >
          <el-form-item label prop="img" class="imgs-item" v-if="imgShow">
            <upload-img ref="imgItemFir" @del-item="delImgItem" :file="[imgForm.img_one]"></upload-img>
            <upload-img ref="imgItemSec" @del-item="delImgItem" :file="[imgForm.img_two]"></upload-img>
            <upload-img ref="imgItemThree" @del-item="delImgItem" :file="[imgForm.img_three]"></upload-img>
            <upload-img ref="imgItemFour" @del-item="delImgItem" :file="[imgForm.img_four]"></upload-img>
          </el-form-item>
        </el-form>
      </div>
      <div class="cost-info block" style="min-height:392px" v-if="purState!=='0'">
        <h4>
          数量/重量所占比例
          <el-button
            type="primary"
            size="mini"
            class="f-r"
            v-if="purState!=='3'"
            :loading="loadingCost"
            @click="editCoseInfo"
          >修改费用信息</el-button>
        </h4>
        <el-form :model="costForm" ref="costForm" :rules="costFormRules" label-width="100px">
          <el-form-item label="计算方式：" prop="costSharingType">
            <el-radio-group v-model="costForm.costSharingType" :disabled="purState ==='3'">
              <el-radio label="1">按数量所占比例</el-radio>
              <el-radio label="2">按重量所占比例</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <h4>添加运费</h4>
        <edit-table-item
          ref="editTableFreight"
          v-if="editTableShow"
          :modelTableData="modelTableDataFreight"
          :thData="thDataFreight"
          :needCompute="true"
          :tableInit="freightsData"
          :noEdit="purState==='3'"
        />
        <h4>添加打税费用</h4>
        <edit-table-item
          ref="editTableTax"
          v-if="editTableShow"
          :modelTableData="modelTableDataTax"
          :thData="thDataTax"
          :maxLen="1"
          :tableInit="taxsData"
          :noEdit="purState==='3'"
        />
        <h4>添加其他费用</h4>
        <edit-table-item
          ref="editTableExtra"
          v-if="editTableShow"
          :modelTableData="modelTableDataExtra"
          :thData="thDataExtra"
          :tableInit="otherCostsData"
          :noEdit="purState==='3'"
        />
      </div>
      <div class="btns">
        <el-button
          type="primary"
          @click="addPurOrder"
          :loading="loadingAdd"
          v-if="purState ==='0'"
        >添加采购单</el-button>
        <el-button
          type="primary"
          @click="purOrderSent"
          :loading="loadingSent"
          v-if="purState ==='2'"
        >采购单入库</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import EditTable from "../components/EditTable";
import EditTableItem from "../components/EditTableItem";
import UploadImg from "@/components/UploadImg";

import { proPublishSub } from "@/api/product";
import { getProCate } from "@/api/product";
import { deepClone } from "@/utils";

import {
  getDictList,
  getPuruserList,
  handelSaveOrder,
  getPurDetail,
  handelEditPur,
  handelSaveEditOrder,
  getTaxfactoryList
} from "@/api/purchase";

export default {
  name: "add-order",
  components: {
    EditTable,
    EditTableItem,
    UploadImg
  },
  data() {
    const patter = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    const validatePay = (rule, value, callback) => {
      if (value === "" || patter.test(value)) {
        callback();
      } else {
        callback(new Error("非负整数或至多保留两位小数！"));
      }
    };
    return {
      loading: false,
      loadingBase: false,
      loadingCost: false,
      loadingImg: false,
      loadingAdd: false,
      loadingSent: false,
      editTableShow: true,
      imgShow: true,
      purStateStr: "",
      purState: "",
      cateList: [],
      puruserList: [],
      placeList: [],
      gradeList: [],
      taxfactoryList: [],
      priceUnitList: [
        {
          value: "1001",
          label: "越南盾"
        },
        {
          value: "1002",
          label: "泰铢"
        },
        {
          value: "1003",
          label: "元"
        }
      ],
      weightUnitList: [
        {
          value: "公斤",
          label: "公斤"
        },
        {
          value: "斤",
          label: "斤"
        }
      ],
      baseForm: { purdate: "", purUsercode: "" },
      baseFormRules: {
        purdate: [
          { required: true, message: "请输入采购日期", trigger: "blur" }
        ],
        purUsercode: [
          {
            required: true,
            message: "请选择采购员",
            trigger: ["blur", "change"]
          }
        ]
      },
      remarkForm: {
        realprice: "",
        collUsername: "",
        remarks: ""
      },
      remarkFormRules: {
        realprice: { validator: validatePay, trigger: "blur" }
      },
      costForm: {
        costSharingType: "2"
      },
      costFormRules: {
        costSharingType: [
          { required: true, message: "请选择计算方式", trigger: "change" }
        ]
      },
      imgForm: {},
      imgFormRules: {},
      modifyImages: [],
      tableData: [],
      taxsData: [],
      freightsData: [],
      otherCostsData: []
    };
  },
  computed: {
    modelTableData() {
      return {
        editAction: true,
        isSelected: false,
        isSent: false,
        content: [
          {
            idStr: "", //对应唯一标识（删除）
            key: "order",
            value: "",
            canEdit: false,
            noValidate: true, //不做验证
            width: 80, //占用宽度
            noSubmit: true
          },
          {
            key: "cmdtcode",
            value: "",
            canEdit: false,
            noValidate: true, //不做验证
            width: 100 //占用宽度
          },
          {
            key: "producode",
            value: "",
            canEdit: false,
            noValidate: true, //不做验证
            hidden: true
          },
          {
            key: "ccode", //对应键值
            labelKey: "cname",
            value: "", //val值
            labelValue: "",
            placeholder: "商品分类", //占位符
            canEdit: true, //是否可编辑
            validate: false, //是否验证通过（默认false）
            validateType: 1, //验证类型（1：不能为空，2：不能为空且遵守正则，3：可以为空，不为空的时候须遵守正则）
            inputType: 6, //元素类型（1：select选择框，2：input输入框，3：radio单选框，4：checkBox多选框，5：input + select，6：多联选择，7：总重，总价带单位，8：可供匹配的inout）
            width: 170,
            inputOptions: this.cateList,
            dataFilterFn: (node, keyword) => {
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
            sentAttr: true, //是否仓库中属性
            errMsg: "* 必填项不能为空。" //错误提示
          },
          {
            key: "cmdtname",
            value: "",
            placeholder: "名称",
            canEdit: true,
            validate: false,
            validateType: 1,
            inputType: 1,
            maxLen: 30,
            width: 160, //占用宽度
            sentAttr: true, //是否仓库中属性
            errMsg: "* 必填项不能为空。"
          },
          {
            key: "factoryName",
            value: "",
            labelValue: "",
            placeholder: "工厂",
            canEdit: true,
            noValidate: true, //不做验证
            inputType: 1,
            maxLen: 30
          },
          {
            key: "storeName",
            value: "",
            placeholder: "卖场",
            canEdit: true,
            noValidate: true, //不做验证
            inputType: 1,
            maxLen: 30
          },
          {
            key: "trainNumber",
            value: "",
            placeholder: "车次",
            canEdit: true,
            noValidate: true, //不做验证
            inputType: 1,
            maxLen: 30
          },
          {
            key: "carNum",
            value: "",
            placeholder: "车牌号",
            canEdit: true,
            validate: false,
            validateType: 1,
            inputType: 1,
            maxLen: 30,
            errMsg: "* 必填项不能为空。"
          },
          {
            key: "driverPhone",
            value: "",
            placeholder: "司机联系方式",
            canEdit: true,
            validate: false,
            validateType: 2,
            pattern: "^[0-9]\\d{6,15}$",
            inputType: 1,
            maxLen: 15,
            width: 150, //占用宽度
            errMsg: "* 联系电话格式不正确！"
          },
          {
            key: "producerCode",
            labelKey: "producerName",
            value: "",
            labelValue: "",
            placeholder: "产地",
            canEdit: true,
            validate: false,
            validateType: 1,
            inputType: 2,
            inputOptions: this.placeList,
            sentAttr: true, //是否仓库中属性
            errMsg: "* 必填项不能为空。"
          },
          {
            key: "gradeCode",
            labelKey: "gradeName",
            value: "",
            labelValue: "",
            placeholder: "品级",
            canEdit: true,
            validate: false,
            validateType: 1,
            inputType: 2,
            inputOptions: this.gradeList,
            sentAttr: true, //是否仓库中属性
            errMsg: "* 必填项不能为空。"
          },
          {
            key: "num",
            value: "",
            placeholder: "件数",
            canEdit: true,
            validate: false,
            validateType: 2,
            pattern: "^[1-9]\\d*$",
            inputType: 1,
            maxLen: 10,
            errMsg: "* 件数为大于0的整数。"
          },
          {
            key: "unitWeight",
            selectKey: "type",
            selectLabelKey: "typeCode",
            value: "",
            placeholder: "件重",
            canEdit: true,
            validate: false,
            validateType: 2,
            pattern: "(^[1-9](\\d+)?(\\.\\d{1,2})?$)|(^\\d\\.\\d{1,2}$)",
            inputType: 5,
            selectValue: "公斤",
            selectLabelValue: "公斤",
            selectOptions: this.weightUnitList,
            maxLen: 10,
            width: 160,
            sentAttr: true, //是否仓库中属性
            errMsg: "* 件重为大于0且至多两位小数。"
          },
          {
            key: "tWeight",
            value: "",
            inputType: 7,
            labelValue: "",
            noValidate: true, //不做验证
            width: 70, //占用宽度
            canEdit: false,
            noSubmit: true
          },
          {
            key: "unitPrice",
            selectKey: "currencyCode",
            selectLabelKey: "currency",
            value: "",
            placeholder: "单价",
            canEdit: true,
            validate: false,
            validateType: 2,
            pattern: "(^[1-9](\\d+)?(\\.\\d{1,2})?$)|(^\\d\\.\\d{1,2}$)",
            inputType: 5,
            selectValue: "1001",
            selectLabelValue: "越南盾",
            selectOptions: this.priceUnitList,
            maxLen: 10,
            width: 160,
            errMsg: "* 单价为大于0且至多两位小数"
          },
          {
            key: "purPrice",
            value: "",
            inputType: 7,
            labelValue: "",
            canEdit: false,
            noValidate: true, //不做验证
            width: 90, //占用宽度
            noSubmit: true
          },
          {
            key: "rate",
            value: "",
            placeholder: "当天汇率",
            canEdit: true,
            validate: false,
            validateType: 3,
            pattern: "(^[1-9](\\d+)?(\\.\\d{1,2})?$)|(^\\d\\.\\d{1,2}$)",
            inputType: 1,
            maxLen: 10,
            errMsg: "* 汇率为大于0且至多两位小数。"
          },
          {
            key: "purPriceYuan",
            value: "",
            canEdit: false,
            noValidate: true, //不做验证
            width: 90, //占用宽度
            noSubmit: true
          },

          {
            key: "freightAmount",
            hidden: this.purState === "0",
            value: "",
            inputType: 1,
            noValidate: true, //不做验证
            canEdit: false,
            noSubmit: true
          },
          {
            key: "taxAmount",
            hidden: this.purState === "0",
            value: "",
            inputType: 1,
            noValidate: true, //不做验证
            canEdit: false,
            noSubmit: true
          },
          {
            key: "otherAmount",
            hidden: this.purState === "0",
            value: "",
            inputType: 1,
            noValidate: true, //不做验证
            canEdit: false,
            noSubmit: true
          },
          {
            key: "totalCost",
            hidden: this.purState === "0",
            value: "",
            inputType: 1,
            noValidate: true, //不做验证
            canEdit: false,
            noSubmit: true
          },
          {
            key: "unitCost",
            hidden: this.purState === "0",
            value: "",
            inputType: 1,
            noValidate: true, //不做验证
            canEdit: false,
            noSubmit: true
          }
        ]
      };
    },
    thData() {
      return [
        { name: "", width: 120, hidden: this.purState !== "0" },
        { name: "序号", width: 80, value: "合计" },
        { name: "商品编号", width: 100 },
        { name: "商品分类", isEdit: true, isRequire: true, width: 170 },
        { name: "名称", isEdit: true, isRequire: true, width: 160 },
        { name: "工厂", isEdit: true },
        { name: "卖场", isEdit: true },
        { name: "车次", isEdit: true },
        { name: "车牌号", isEdit: true, isRequire: true },
        { name: "司机电话", isEdit: true, isRequire: true, width: 150 },
        { name: "产地", isEdit: true, isRequire: true },
        { name: "品级", isEdit: true, isRequire: true },
        { name: "件数", isEdit: true, isRequire: true, key: "num", value: "0" },
        { name: "件重", isEdit: true, isRequire: true, width: 160 },
        { name: "总重", width: 70, key: "tWeight", value: "" },
        { name: "单价", isEdit: true, isRequire: true, width: 160 },
        { name: "总价/外汇", width: 90, key: "purPrice", value: "" },
        { name: "当天汇率", isEdit: true },
        { name: "总价/元", width: 90, key: "purPriceYuan", value: "" },
        {
          name: "运费金额/元",
          key: "freightAmount",
          value: "",
          hidden: this.purState === "0"
        },
        {
          name: "打税金额/元",
          key: "taxAmount",
          value: "",
          hidden: this.purState === "0"
        },
        {
          name: "其他金额/元",
          key: "otherAmount",
          value: "",
          hidden: this.purState === "0"
        },
        {
          name: "总成本/元",
          key: "totalCost",
          value: "",
          hidden: this.purState === "0"
        },
        {
          name: "均摊后单价/元",
          hidden: this.purState === "0"
        }
      ];
    },
    modelTableDataFreight() {
      return {
        editAction: true,
        isSelected: false,
        content: [
          {
            idStr: "", //对应唯一标识（删除）
            key: "order",
            value: "",
            canEdit: false,
            noValidate: true, //不做验证
            width: 80, //占用宽度
            noSubmit: true
          },
          {
            key: "preWhAmount",
            selectKey: "preCurrencyCode",
            selectLabelKey: "preCurrency",
            value: "",
            placeholder: "预付金额",
            canEdit: true,
            validate: false,
            validateType: 3,
            pattern: "(^[1-9](\\d+)?(\\.\\d{1,2})?$)|(^\\d\\.\\d{1,2}$)",
            inputType: 5,
            selectValue: "1001",
            selectLabelValue: "越南盾",
            selectOptions: this.priceUnitList,
            maxLen: 10,
            errMsg: "* 金额为大于0且至多两位小数"
          },
          {
            key: "preRate",
            value: "",
            placeholder: "当天汇率",
            canEdit: true,
            validate: false,
            validateType: 3,
            pattern: "(^[1-9](\\d+)?(\\.\\d{1,2})?$)|(^\\d\\.\\d{1,2}$)",
            inputType: 1,
            maxLen: 10,
            errMsg: "* 汇率为大于0且至多两位小数。"
          },
          {
            key: "prePayYuan",
            value: "",
            inputType: 7,
            noValidate: true,
            labelValue: "",
            canEdit: false,
            noSubmit: true,
            errMsg: "* 预付或实付运费计算错误。"
          },
          {
            key: "whAmount",
            selectKey: "currencyCode",
            selectLabelKey: "currency",
            value: "",
            placeholder: "实付金额",
            canEdit: true,
            validate: false,
            validateType: 3,
            pattern: "(^[1-9](\\d+)?(\\.\\d{1,2})?$)|(^\\d\\.\\d{1,2}$)",
            inputType: 5,
            selectValue: "1001",
            selectLabelValue: "越南盾",
            selectOptions: this.priceUnitList,
            maxLen: 10,
            errMsg: "* 金额为大于0且至多两位小数"
          },
          {
            key: "rate",
            value: "",
            placeholder: "当天汇率",
            canEdit: true,
            validate: false,
            validateType: 3,
            pattern: "(^[1-9](\\d+)?(\\.\\d{1,2})?$)|(^\\d\\.\\d{1,2}$)",
            inputType: 1,
            maxLen: 10,
            errMsg: "* 汇率为大于0且至多两位小数。"
          },
          {
            key: "actualPayYuan",
            value: "",
            inputType: 7,
            noValidate: true,
            labelValue: "",
            canEdit: false,
            noSubmit: true,
            errMsg: "* 预付或实付运费计算错误。"
          }
        ]
      };
    },
    thDataFreight() {
      return [
        { name: "", width: 110, hidden: this.purState === "3" },
        { name: "序号", width: 80, value: "合计" },
        { name: "预付运费", isEdit: true },
        { name: "当天汇率（预付）", isEdit: true },
        { name: "预付运费（元）", key: "prePayYuan", value: "" },
        { name: "实付运费", isEdit: true },
        { name: "当天汇率（实付）", isEdit: true },
        { name: "实付运费（元）", key: "actualPayYuan", value: "" }
      ];
    },
    modelTableDataTax() {
      return {
        editAction: true,
        isSelected: false,
        content: [
          {
            idStr: "", //对应唯一标识（删除）
            key: "order",
            value: "",
            canEdit: false,
            noValidate: true, //不做验证
            width: 80, //占用宽度
            noSubmit: true
          },
          {
            key: "taxCode",
            labelKey: "taxName",
            value: "",
            labelValue: "",
            placeholder: "打税公司",
            canEdit: true,
            validate: false,
            validateType: 1,
            inputType: 2,
            inputOptions: this.taxfactoryList,
            errMsg: "* 必填项不能为空。"
          },
          {
            key: "needAmount",
            value: "",
            placeholder: "应付金额",
            canEdit: true,
            validate: false,
            validateType: 2,
            pattern: "(^[1-9](\\d+)?(\\.\\d{1,2})?$)|(^\\d\\.\\d{1,2}$)",
            inputType: 1,
            maxLen: 10,
            errMsg: "* 应付金额大于0且至多两位小数。"
          },
          {
            key: "realAmount",
            value: "",
            placeholder: "已付金额",
            canEdit: true,
            validate: false,
            validateType: 3,
            pattern: "(^[1-9](\\d+)?(\\.\\d{1,2})?$)|(^\\d\\.\\d{1,2}$)",
            inputType: 1,
            maxLen: 10,
            errMsg: "* 已付金额大于0且至多两位小数。"
          },
          {
            key: "iscomplete",
            value: "",
            labelValue: "",
            canEdit: true,
            inputType: 3,
            noValidate: true //不做验证
          }
        ]
      };
    },
    thDataTax() {
      return [
        { name: "", width: 110, hidden: this.purState === "3" },
        { name: "序号", width: 80, value: "合计" },
        { name: "打税公司", isEdit: true, isRequire: true },
        {
          name: "应付（元）",
          isEdit: true,
          isRequire: true,
          key: "needAmount",
          value: ""
        },
        { name: "已付（元）", isEdit: true, key: "realAmount", value: "" },
        { name: "打税是否已结算", isEdit: true }
      ];
    },
    modelTableDataExtra() {
      return {
        editAction: true,
        isSelected: false,
        content: [
          {
            idStr: "", //对应唯一标识（删除）
            key: "order",
            value: "",
            canEdit: false,
            noValidate: true, //不做验证
            width: 80, //占用宽度
            noSubmit: true
          },
          {
            key: "costName",
            value: "",
            placeholder: "费用名称",
            canEdit: true,
            validate: false,
            validateType: 1,
            inputType: 1,
            maxLen: 30,
            errMsg: "* 必填项不能为空。"
          },
          {
            key: "amount",
            value: "",
            placeholder: "费用金额",
            canEdit: true,
            validate: false,
            validateType: 2,
            pattern: "(^[1-9](\\d+)?(\\.\\d{1,2})?$)|(^\\d\\.\\d{1,2}$)",
            inputType: 1,
            maxLen: 10,
            errMsg: "* 已付金额大于0且至多两位小数。"
          },
          {
            key: "remarks",
            value: "",
            placeholder: "备注",
            canEdit: true,
            validate: false,
            validateType: 1,
            inputType: 1,
            maxLen: 30,
            width: 700,
            errMsg: "* 必填项不能为空。"
          }
        ]
      };
    },
    thDataExtra() {
      return [
        { name: "", width: 110, hidden: this.purState === "3" },
        { name: "序号", width: 80, value: "合计" },
        { name: "费用名称", isEdit: true, isRequire: true },
        {
          name: "费用金额（元）",
          isEdit: true,
          isRequire: true,
          key: "amount",
          value: ""
        },
        { name: "备注", width: 700, isEdit: true, isRequire: true }
      ];
    }
  },
  async created() {
    this.getPremiseList();
  },
  methods: {
    async getPremiseList() {
      try {
        this.loading = true;
        this.editTableShow = false;
        this.imgShow = false;
        const [
          {
            data: {
              cmdtClassTree: { children }
            },
            code: code1
          },
          { data: data2, code: code2 },
          { data: data3, code: code3 },
          { data: data4, code: code4 },
          { data: data5, code: code5 },
          {
            data: {
              cmdtDetailsInitResps,
              purdate,
              purUsercode,
              realprice,
              collUsername,
              remarks,
              purchaseImages,
              purState,
              voPurState,
              taxs,
              otherCosts,
              freights,
              typecode
            },
            code: code6
          }
        ] = await Promise.all([
          getProCate({}),
          getPuruserList(),
          getDictList({ typeCode: 1 }),
          getDictList({ typeCode: 2 }),
          getTaxfactoryList({ typeCode: 2 }),
          getPurDetail({ purcode: this.$route.params.code })
        ]);
        this.loading = false;
        if (
          code1 === 200 &&
          code2 === 200 &&
          code3 === 200 &&
          code4 === 200 &&
          code5 === 200 &&
          code6 === 200
        ) {
          this.cateList = this._initDataArr(this._delEmptyVal(children));
          this.puruserList = data2;
          this.placeList = data3;
          this.gradeList = data4;
          this.taxfactoryList = data5;

          this.purStateStr = voPurState;
          this.purState = purState;
          this.baseForm.purdate = purdate;
          this.baseForm.purUsercode = purUsercode;
          this.remarkForm.realprice = realprice || "";
          this.remarkForm.collUsername = collUsername;
          this.remarkForm.remarks = remarks;
          this.modifyImages = purchaseImages.map(item => {
            return { serial: item.serial, uid: item.uid };
          });
          const imgData = purchaseImages.map(item => {
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
          this.tableData = cmdtDetailsInitResps;
          this.costForm.costSharingType = typecode || "2";
          this.taxsData = taxs;
          this.otherCostsData = otherCosts;
          this.freightsData = freights;
          await this.$nextTick();
          this.editTableShow = true;
          this.imgShow = true;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },

    editBasePro() {
      const p1 = new Promise((resolve, reject) => {
        this.$refs["baseForm"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject("err");
          }
        });
      });
      const p3 = new Promise((resolve, reject) => {
        this.$refs["editTable"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject("err");
          }
        });
      });
      Promise.all([p1, p3])
        .then(() => {
          this.subBasePro();
        })
        .catch(() => {
          this.$confirm(
            "必填项为空或格式不正确或商品信息数量等于零，请检查。",
            "系统提示",
            {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning",
              customClass: "el-message-box-wran"
            }
          )
            .then(() => {})
            .catch(() => {});
        });
    },

    async subBasePro() {
      let formData = new FormData();
      formData.append("typeCode", 1);
      formData.append("purcode", this.$route.params.code);
      formData.append("purdate", this.baseForm.purdate);
      formData.append("purUsercode", this.baseForm.purUsercode);
      const purUsername = this.puruserList.find(item => {
        return item.userName === this.baseForm.purUsercode;
      }).nickName;
      formData.append("purUsername", purUsername);
      formData.append(
        "purchaseCmdtDetails",
        JSON.stringify(this.$refs.editTable.creatOrder())
      );
      try {
        this.loadingCost = true;
        const { code, msg } = await handelEditPur(formData);
        this.loadingCost = false;
        if (code === 200) {
          this.msgSuccess("修改成功");
          this.getPremiseList();
        }
      } catch (err) {
        this.loadingCost = false;
        console.log(err);
      }
    },

    editRemarkImg() {
      const p2 = new Promise((resolve, reject) => {
        this.$refs["remarkForm"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject("err");
          }
        });
      });
      Promise.all([p2])
        .then(() => {
          this.subRemarkImg();
        })
        .catch(() => {});
    },

    async subRemarkImg() {
      const cloneData = deepClone(this.modifyImages);
      let formData = new FormData();
      formData.append("typeCode", 2);
      formData.append("purcode", this.$route.params.code);
      formData.append(
        "modifyImages",
        JSON.stringify(
          cloneData.map(item => {
            return item.uid;
          })
        )
      );
      formData.append("realprice", this.remarkForm.realprice);
      formData.append("collUsername", this.remarkForm.collUsername);
      formData.append("remarks", this.remarkForm.remarks);
      formData.append("img_one", this.$refs.imgItemFir.fileList[0]);
      formData.append("img_two", this.$refs.imgItemSec.fileList[0]);
      formData.append("img_three", this.$refs.imgItemThree.fileList[0]);
      formData.append("img_four", this.$refs.imgItemFour.fileList[0]);
      this.modifyImages.forEach(item => {
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
      try {
        this.loadingImg = true;
        const { code, msg } = await handelEditPur(formData);
        this.loadingImg = false;
        if (code === 200) {
          this.msgSuccess("修改成功");
          this.getPremiseList();
        }
      } catch (err) {
        this.loadingImg = false;
        console.log(err);
      }
    },

    addPurOrder() {
      new Promise((resolve, reject) => {
        this.$refs["editTable"].validateRate(valid => {
          if (valid) {
            resolve();
          } else {
            reject("err");
          }
        });
      })
        .then(() => {
          this.$confirm(`添加前请核对汇率及采购金额是否正确！`, `添加采购单`, {
            confirmButtonText: "已核对",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "el-message-box-wran"
          })
            .then(async () => {
              this.loadingAdd = true;
              const { code } = await handelSaveEditOrder({
                purcode: this.$route.params.code
              });
              this.loadingAdd = false;
              if (code === 200) {
                this.msgSuccess("采购单添加成功");
                setTimeout(() => {
                  this.$router.push({ path: "/purchase/list" });
                }, 1000);
              }
            })
            .catch(() => {
              this.loadingAdd = false;
            });
        })
        .catch(() => {
          this.$confirm(`商品汇率不能为空！`, `添加采购单`, {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "el-message-box-wran"
          })
            .then(() => {})
            .catch(() => {});
        });
    },

    async editCoseInfo() {
      let formData = new FormData();
      formData.append("typeCode", 3);
      formData.append("purcode", this.$route.params.code);
      formData.append("costSharingType", this.costForm.costSharingType);
      if (this.$refs.editTableFreight.creatOrder().length !== 0) {
        formData.append(
          "freights",
          JSON.stringify(this.$refs.editTableFreight.creatOrder())
        );
      }
      if (this.$refs.editTableTax.creatOrder().length !== 0) {
        formData.append(
          "taxs",
          JSON.stringify(this.$refs.editTableTax.creatOrder())
        );
      }
      if (this.$refs.editTableExtra.creatOrder().length !== 0) {
        formData.append(
          "otherCosts",
          JSON.stringify(this.$refs.editTableExtra.creatOrder())
        );
      }
      try {
        this.loadingBase = true;
        const { code, msg } = await handelEditPur(formData);
        this.loadingBase = false;
        if (code === 200) {
          this.msgSuccess("修改成功");
          this.getPremiseList();
        }
      } catch (err) {
        this.loadingBase = false;
        console.log(err);
      }
    },

    async purOrderSent() {
      let formData = new FormData();
      formData.append("typeCode", 4);
      formData.append("purcode", this.$route.params.code);
      try {
        this.loadingSent = true;
        const { code, msg } = await handelEditPur(formData);
        this.loadingSent = false;
        if (code === 200) {
          this.msgSuccess("入库成功");
          setTimeout(() => {
            this.$router.push({ path: "/purchase/list" });
          }, 1000);
        }
      } catch (err) {
        this.loadingSent = false;
        console.log(err);
      }
    },

    /* 删除图片匹配去掉modifyImages中uid */
    delImgItem(uid) {
      const idx = this.modifyImages.findIndex(item => {
        return item.uid === uid;
      });
      if (idx !== -1) {
        this.modifyImages.splice(idx, 1);
      }
    },

    /* 递归查找类目中的标签项添加标签数组 */
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
    },

    /* children数组为空赋值null*/
    _delEmptyVal(arr) {
      return arr.map(item => {
        if (item.children && item.children.length === 0) {
          return Object.assign(item, { children: null });
        } else {
          this._delEmptyVal(item.children);
          return item;
        }
      });
    }
  }
};
</script>