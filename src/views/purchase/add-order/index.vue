<template>
  <div class="app-container add-order">
    <div class="base-info block">
      <h4>基本信息</h4>
      <el-form
        :model="baseForm"
        ref="baseForm"
        :rules="baseFormRules"
        label-width="100px"
        :inline="true"
      >
        <el-form-item label="采购日期：" prop="time">
          <el-date-picker
            v-model="baseForm.time"
            type="date"
            size="small"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            style="width: 200px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="采购员" prop="man">
          <el-select v-model="baseForm.man" placeholder="请选择" size="small" style="width: 200px">
            <el-option label="采购员01" value="0" />
            <el-option label="采购员02" value="1" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="pro-info block">
      <h4>商品信息</h4>
      <edit-table ref="editTable"></edit-table>
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
        <el-form-item label="采购实付" prop="phrPay">
          <el-input
            v-model="remarkForm.phrPay"
            placeholder="请输入实付金额"
            size="small"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item
          label="回款人"
          prop="payMan"
          :rules="{
            required: Number(remarkForm.phrPay)>0, message: '回款人不能为空', trigger: 'blur'
          }"
        >
          <el-input
            v-model="remarkForm.payMan"
            placeholder="请输入回款人"
            size="small"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="remarkForm.remark"
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
      <el-button type="primary" style="margin-right:15px" @click="saveOrderVerify">保存采购单</el-button>
      <el-button type="primary">添加采购单</el-button>
    </div>
  </div>
</template>

<script>
import EditTable from "../components/EditTable";
import UploadImg from "@/components/UploadImg";
import { proPublishSub } from "@/api/product";

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
      baseForm: { time: "", man: "" },
      baseFormRules: {
        time: [{ required: true, message: "请输入采购日期", trigger: "blur" }],
        man: [
          {
            required: true,
            message: "请选择采购员",
            trigger: ["blur", "change"]
          }
        ]
      },
      remarkForm: {
        phrPay: "",
        payMan: "",
        remark: ""
      },
      remarkFormRules: {
        phrPay: { validator: validatePay, trigger: "blur" }
      },
      imgForm: {},
      imgFormRules: {}
    };
  },
  created() {},
  methods: {
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
      Promise.all([p1, p2, p3])
        .then(() => {
          this.saveOrder();
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
    async saveOrder() {
      try {
        const { code, msg } = await proPublishSub(this._initOrderData());
        if (code === 200) {
        }
      } catch (err) {
        console.log(err);
      }
    },
    _initOrderData() {
      let formData = new FormData();
      formData.append("time", this.baseForm.time);
      formData.append("man", this.baseForm.man);

      formData.append("phrPay", this.remarkForm.phrPay);
      formData.append("payMan", this.remarkForm.payMan);
      formData.append("remark", this.remarkForm.remark);

      formData.append("img_one", this.$refs.imgItemFir.fileList[0]);
      formData.append("img_two", this.$refs.imgItemSec.fileList[0]);
      formData.append("img_three", this.$refs.imgItemThree.fileList[0]);
      formData.append("img_four", this.$refs.imgItemFour.fileList[0]);

      formData.append("proData", JSON.stringify(this.$refs.editTable.creatOrder()));

      return formData;
    }
  }
};
</script>