<template>
  <div class="app-container add-order">
    <div v-loading="loading">
      <div class="base-info block">
        <h4>基本信息</h4>
        <el-form
          :model="baseForm"
          ref="baseForm"
          :rules="baseFormRules"
          label-width="100px"
          :inline="true"
        >
          <el-form-item label="采购日期：" prop="purdate">
            <el-date-picker
              v-model="baseForm.purdate"
              type="date"
              size="small"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width: 200px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="采购员" prop="purUsercode">
            <el-select
              v-model="baseForm.purUsercode"
              placeholder="请选择"
              size="small"
              style="width: 200px"
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
      </div>
      <div class="pro-info block">
        <h4>商品信息</h4>
        <edit-table
          ref="editTable"
          v-if="editTableShow"
          :modelTableData="modelTableData"
          :thData="thData"
          :gradeList="gradeList"
          :placeList="placeList"
        ></edit-table>
      </div>
      <div class="remark-info block">
        <h4>备注信息</h4>
        <el-form
          :model="remarkForm"
          ref="remarkForm"
          :rules="remarkFormRules"
          label-width="80px"
          :inline="true"
        >
          <el-form-item label="采购实付" prop="realprice">
            <el-input
              v-model="remarkForm.realprice"
              placeholder="请输入实付金额"
              size="small"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item
            label="回款人"
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
          <el-form-item label="备注" prop="remarks">
            <el-input
              v-model="remarkForm.remarks"
              placeholder="请输入备注"
              size="small"
              style="width: 600px"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="img-info block">
        <h4>图片信息</h4>
        <el-form
          :model="imgForm"
          ref="imgForm"
          :rules="imgFormRules"
          label-width="100px"
          :inline="true"
        >
          <el-form-item label prop="img" class="imgs-item">
            <upload-img ref="imgItemFir"></upload-img>
            <upload-img ref="imgItemSec"></upload-img>
            <upload-img ref="imgItemThree"></upload-img>
            <upload-img ref="imgItemFour"></upload-img>
          </el-form-item>
        </el-form>
      </div>
      <div class="btns">
        <el-button type="primary" style="margin-right:15px" @click="savePurOrder">保存采购单</el-button>
        <el-button type="primary" @click="addPurOrder">添加采购单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import EditTable from "../components/EditTable";
import UploadImg from "@/components/UploadImg";
import { proPublishSub } from "@/api/product";
import { getProCate } from "@/api/product";
import { getDictList, getPuruserList, handelSaveOrder } from "@/api/purchase";

export default {
  name: "add-order",
  components: {
    EditTable,
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
      editTableShow: false,
      cateList: [],
      puruserList: [],
      placeList: [],
      gradeList: [],
      typeCode: "1",
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
        },
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
      imgForm: {},
      imgFormRules: {}
      //表格内容模板数据
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
          }
        ]
      };
    },
    thData() {
      return [
        { name: "", width: 120 },
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
        { name: "总价/元", width: 90, key: "purPriceYuan", value: "" }
      ];
    }
  },
  created() {
    this.getPremiseList();
  },
  methods: {
    async getPremiseList() {
      this.loading = true;
      try {
        const [
          {
            data: {
              cmdtClassTree: { children }
            },
            code: code1
          },
          { data: data2, code: code2 },
          { data: data3, code: code3 },
          { data: data4, code: code4 }
        ] = await Promise.all([
          getProCate({}),
          getPuruserList(),
          getDictList({ typeCode: 1 }),
          getDictList({ typeCode: 2 })
        ]);
        this.loading = false;
        if (code1 === 200 && code2 === 200 && code3 === 200 && code4 === 200) {
          this.editTableShow = false;
          this.cateList = this._initDataArr(this._delEmptyVal(children));
          this.puruserList = data2;
          this.placeList = data3;
          this.gradeList = data4;
          await this.$nextTick();
          this.editTableShow = true;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },

    saveOrderVerify() {
      const p1 = new Promise((resolve, reject) => {
        this.$refs["baseForm"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject("err");
          }
        });
      });
      const p2 = new Promise((resolve, reject) => {
        this.$refs["remarkForm"].validate(valid => {
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
      let arr = [p1, p2, p3];
      if (this.typeCode === "2") {
        const p4 = new Promise((resolve, reject) => {
          this.$refs["editTable"].validateRate(valid => {
            if (valid) {
              console.log(2,54546);

              resolve();
            } else {
              reject("err");
            }
          });
        });
        arr.push(p4);
      }
      Promise.all(arr)
        .then(() => {
          this.saveOrder();
        })
        .catch(() => {
          this.$confirm(
            `必填项为空或格式不正确或商品信息数量等于零，${
              this.typeCode === "2"
                ? "（添加采购单时，汇率不为空，请核对商品汇率和总价金额！）"
                : ""
            } 请检查。`,
            `${this.typeCode === "2" ? "添加采购单" : "保存采购单"}`,
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

    async saveOrder() {
      try {
        this.loading = true;
        const { code, msg } = await handelSaveOrder(this._initOrderData());
        this.loading = false;
        if (code === 200) {
          this.msgSuccess("采购单保存成功");
          setTimeout(() => {
            this.$router.push({ path: "/purchase/list" });
          }, 1000);
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },

    savePurOrder() {
      this.typeCode = "1";
      this.saveOrderVerify();
    },

    addPurOrder() {
      this.typeCode = "2";
      this.saveOrderVerify();
    },

    _initOrderData() {
      let formData = new FormData();
      formData.append("typeCode", this.typeCode);
      formData.append("purdate", this.baseForm.purdate);
      formData.append("purUsercode", this.baseForm.purUsercode);
      const purUsername = this.puruserList.find(item => {
        return item.userName === this.baseForm.purUsercode;
      }).nickName;
      formData.append("purUsername", purUsername);
      formData.append("realprice", this.remarkForm.realprice);
      formData.append("collUsername", this.remarkForm.collUsername);
      formData.append("remarks", this.remarkForm.remarks);
      formData.append("img_one", this.$refs.imgItemFir.fileList[0]);
      formData.append("img_two", this.$refs.imgItemSec.fileList[0]);
      formData.append("img_three", this.$refs.imgItemThree.fileList[0]);
      formData.append("img_four", this.$refs.imgItemFour.fileList[0]);
      formData.append(
        "purchaseCmdtDetails",
        JSON.stringify(this.$refs.editTable.creatOrder())
      );
      return formData;
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