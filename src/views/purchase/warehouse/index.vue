<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="80px">
          <el-form-item label="商品名称" prop="cmdtname">
            <el-input
              v-model="queryForm.cmdtname"
              placeholder="请输入商品名称"
              clearable
              size="small"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="商品产地" prop="producerCode">
            <el-select
              v-model="queryForm.producerCode"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 200px"
            >
              <el-option
                v-for="(item,index) in placeList"
                :key="index"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="商品品级" prop="gradeCode">
            <el-select
              v-model="queryForm.gradeCode"
              placeholder="请选择"
              clearable
              size="small"
              style="width: 200px"
            >
              <el-option
                v-for="(item,index) in gradeList"
                :key="index"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-row :gutter="10" class="mb10 f-r icon-wrap">
        <el-col :span="1.5">
          <div class="icon-box icon-box-f" @click="formShow = !formShow">
            <i class="el-icon-zoom-in" v-show="!formShow"></i>
            <i class="el-icon-zoom-out" v-if="formShow"></i>
          </div>
        </el-col>
        <el-col :span="1.5">
          <div class="icon-box icon-box-t" @click="resetQuery">
            <i class="el-icon-refresh"></i>
          </div>
        </el-col>
      </el-row>
      <el-table style="width: 100%" v-loading="loading" :data="productList">
        <el-table-column label="序号" prop="order" width="60" />
        <el-table-column label="商品编码" prop="cmdtcode" />
        <el-table-column label="商品分类" prop="cname" />
        <el-table-column label="商品名称" prop="cmdtname" />
        <el-table-column label="商品产地" prop="producerName" />
        <el-table-column label="商品品级" prop="gradeName" />
        <el-table-column label="库存" prop="storenum" />
        <el-table-column label="件重">
          <template slot-scope="scope">{{scope.row.unitWeight}}/{{scope.row.typeCode}}</template>
        </el-table-column>
        <el-table-column label=" 成本单价（元）" prop="unitCost" />
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document"
              @click="handleDetail(scope.row)"
            >修改明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryForm.pageNum"
        :limit.sync="queryForm.pageSize"
        @pagination="getList"
      />
    </div>

    <el-dialog title="修改库存" :visible.sync="open" width="500px" @close="clearValidate">
      <el-form ref="form" :model="form" :rules="formRules" label-width="90px">
        <el-form-item label="库存" prop="rtStoreNum">
          <el-input v-model="form.rtStoreNum" maxlength="6" placeholder="请输入修改库存" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remarks">
          <el-input
            type="textarea"
            v-model="form.remarks"
            placeholder="请输入备注信息"
            maxlength="150"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" :loading="loadingForm" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getStorePageCmdtList,
  getDictList,
  handelEditStore
} from "@/api/purchase";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    const validateNum = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error("库存数量不能为空！"));
      } else {
        if (!/^\+?[0-9]\d*$/.test(value)) {
          callback(new Error("库存数量为大于或等于零的整数！"));
        }
        callback();
      }
    };
    return {
      loading: false,
      loadingForm: false,
      open: false,
      productList: [],
      placeList: [],
      gradeList: [],
      formShow: true,
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        cmdtname: undefined,
        producerCode: undefined,
        gradeCode: undefined
      },
      form: {
        cmdtcode: undefined,
        rtStoreNum: undefined,
        remarks: undefined
      },
      formRules: {
        rtStoreNum: [
          { required: true, validator: validateNum, trigger: "blur" }
        ],
        remarks: [{ required: true, message: "备注信息", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getPremiseList();
    this.getList();
  },
  methods: {
    async getPremiseList() {
      this.loading = true;
      try {
        const [
          { data: data1, code: code1 },
          { data: data2, code: code2 }
        ] = await Promise.all([
          getDictList({ typeCode: 1 }),
          getDictList({ typeCode: 2 })
        ]);
        if (code1 === 200) {
          this.placeList = data1;
        }
        if (code2 === 200) {
          this.gradeList = data2;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    async getList() {
      try {
        this.loading = true;
        const {
          code,
          data: { content, totalSize }
        } = await getStorePageCmdtList(this.queryForm);
        this.loading = false;
        if (code === 200) {
          this.productList = content.map((item, index) => {
            return Object.assign(item, { order: index + 1 });
          });
          this.total = totalSize;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    handleQuery() {
      this.queryForm.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    resetForm() {
      Object.assign(this.form, {
        cmdtcode: undefined,
        rtStoreNum: undefined,
        remarks: undefined
      });
    },
    handleDetail(item) {
      this.$router.push({
        path: `/purchase/warehouse/${item.cmdtcode}`
      });
    },
    async handleEdit(item) {
      this.resetForm();
      Object.assign(this.form, {
        cmdtcode: item.cmdtcode,
        rtStoreNum: item.rtStoreNum,
        remarks: item.remarks
      });
      await this.$nextTick();
      this.open = true;
    },
    clearValidate() {
      this.$refs.form.resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loadingForm = true;
            const { code } = await handelEditStore(this.form);
            this.loadingForm = false;
            this.open = false;
            if (code === 200) {
              this.msgSuccess("修改成功");
              this.getList();
            }
          } catch (err) {
            this.loadingForm = false;
            console.log(err);
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>