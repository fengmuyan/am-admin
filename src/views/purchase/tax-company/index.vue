<template>
  <div class="app-container">
    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增打税公司</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="companyList">
        <el-table-column label="序号" prop="order" width="80" />
        <el-table-column label="公司名称" prop="cname" width="180" show-overflow-tooltip />
        <el-table-column label="公司地址" prop="address" width="240" show-overflow-tooltip />
        <el-table-column label="联系人" prop="contacts" />
        <el-table-column label="联系方式" prop="phone" />
        <el-table-column label="创建时间" prop="createtime" />
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="新增打税公司" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="formRules" label-width="90px">
        <el-form-item label="公司名称" prop="cname">
          <el-input v-model="form.cname" maxlength="30" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="form.address" maxlength="80" placeholder="请输入公司地址" />
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.contacts" maxlength="30" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="form.phone" maxlength="11" placeholder="请输入联系方式" />
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
import minHeightMix from "@/mixins/minHeight";
import {
  getTaxfactoryList,
  handelDelTaxfactory,
  handelSaveTaxfactory
} from "@/api/purchase";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      loadingForm: false,
      open: false,
      companyList: [],
      form: {
        uid: undefined,
        typeCode: 2,
        cname: undefined,
        address: undefined,
        contacts: undefined,
        phone: undefined
      },
      formRules: {
        cname: [
          { required: true, message: "公司名称不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "公司地址不能为空", trigger: "blur" }
        ],
        contacts: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "联系方式不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { code, data } = await getTaxfactoryList({ typeCode: 2 });
        this.loading = false;
        if (code === 200) {
          this.companyList = data.map((item, index) => {
            return Object.assign(item, { order: index + 1 });
          });
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    resetForm() {
      Object.assign(this.form, {
        uid: undefined,
        typeCode: 2,
        cname: undefined,
        address: undefined,
        contacts: undefined,
        phone: undefined
      });
    },
    async handleAdd() {
      this.resetForm();
      this.title = "新增打税公司";
      await this.$nextTick();
      this.open = true;
    },
    async handleEdit(item) {
      this.resetForm();
      this.title = "修改打税公司";
      Object.assign(this.form, {
        uid: item.uid,
        cname: item.cname,
        address: item.address,
        contacts: item.contacts,
        phone: item.phone
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
            const { code } = await handelSaveTaxfactory(this.form);
            this.loadingForm = false;
            this.open = false;
            if (code === 200) {
              this.msgSuccess("操作成功");
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
    },
    handleDelete(row) {
      this.$confirm(`是否确认删除 ${row.cname} ?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(async () => {
          const { code } = await handelDelTaxfactory({
            uid: row.uid,
            typeCode: 2
          });
          if (code === 200) {
            this.msgSuccess("删除成功");
            this.getList();
          }
        })
        .catch(function() {});
    }
  }
};
</script>