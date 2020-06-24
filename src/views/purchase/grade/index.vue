<template>
  <div class="app-container">
    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增品级</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="gradeList">
        <el-table-column label="序号" prop="order" width="80" />
        <el-table-column label="品级名称" prop="dictName" />
        <el-table-column label="排序" prop="serial" />
        <el-table-column label="创建日期" prop="createtime" />
        <el-table-column label="操作" align="center" width="400">
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

    <el-dialog title="新增品级" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="formRules" label-width="90px">
        <el-form-item label="品级名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入品级名称" />
        </el-form-item>
        <el-form-item label="排序" prop="serial">
          <el-input v-model="form.serial" placeholder="请输入排序序号" />
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
import { getDictList, handelDelDict, handelSaveDict } from "@/api/purchase";
export default {
  mixins: [minHeightMix],
  data() {
    const validateOrder = (rule, value, callback) => {
      if (value === "" || /^[0-9]*$/.test(value)) {
        callback();
      } else {
        callback(new Error("排序序号为数字！"));
      }
    };
    return {
      loading: false,
      loadingForm: false,
      open: false,
      gradeList: [],
      form: {
        uid: undefined,
        typeCode: 2,
        dictName: "",
        serial: ""
      },
      formRules: {
        dictName: [
          { required: true, message: "品级名称不能为空", trigger: "blur" }
        ],
        serial: [{ validator: validateOrder, trigger: "blur" }]
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
        const { code, data } = await getDictList({ typeCode: 2 });
        this.loading = false;
        if (code === 200) {
          this.gradeList = data.map((item, index) => {
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
        dictName: "",
        serial: ""
      });
    },
    async handleAdd() {
      this.resetForm();
      this.title = "新增品级";
      await this.$nextTick();
      this.open = true;
    },
    async handleEdit(item) {
      this.resetForm();
      this.title = "修改品级";
      Object.assign(this.form, {
        uid: item.uid,
        dictName: item.dictName,
        serial: item.serial
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
            const { code } = await handelSaveDict(this.form);
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
      this.$confirm(`是否确认删除 ${row.dictName} ?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(async () => {
          const { code } = await handelDelDict({
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