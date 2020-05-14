<template>
  <div class="app-container">
    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">补发货</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="dataList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.detailInfos" class="expand-table">
              <el-table-column label="商品名称" prop="cmdtname"></el-table-column>
              <el-table-column label="明细编号" prop="detailno"></el-table-column>
              <el-table-column label="发货数量" prop="delivercount"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="订单号" prop="orderno"></el-table-column>
        <el-table-column label="发货号" prop="guid"></el-table-column>
        <el-table-column label="发货时间" prop="fhtime"></el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              :disabled="Number(scope.row.tradestate)!==1"
              @click="handleEdit(scope.row)"
            >修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="选择发货信息" :visible.sync="openSelf" @close="clearValidateSelf" width="600px">
      <el-form
        :model="selfForm"
        ref="selfForm"
        :rules="selfFormRules"
        v-loading="selfLoading"
        label-width="120px"
      >
        <el-form-item class="sent-wrap" label="发货信息" prop="strExpressDetailInfos">
          <div class="sent-box" v-for="(item,index) in orderDetailsList" :key="index">
            <el-checkbox
              v-model="item.checked"
              :disabled="isDisabled(item)"
              @change="handelSentChange"
            >
              <el-tooltip class="item" effect="dark" :content="item.cmdtname" placement="top-start">
                <el-button>{{item.cmdtname}}</el-button>
              </el-tooltip>
            </el-checkbox>
            <el-input-number
              v-model="item.sentNum"
              :disabled="isDisabled(item)"
              @change="handelSentChange"
              size="small"
              :min="0"
              :max="item.allowDelivercount"
            ></el-input-number>
            <div style="line-height:10px">
              <span class="sent-info sent-info-done" v-if="isNoAllowNum(item)">* 已发货。</span>
              <span class="sent-info sent-info-err" v-if="isNoAllowRefunded(item)">* 已退款。</span>
              <span
                class="sent-info sent-info-err"
                v-if="isNoAllowRefunding(item)"
              >* 退款处理中（{{item.refund|initRefund}}）。</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openSelf = false">取 消</el-button>
        <el-button type="primary" :loading="loadingSelf" @click="submitSelfForm('selfForm')">发 货</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getOrderExpressInfo,
  handelEditExpressInfo,
  getOrderDetailsList,
  handelSendGoods,
  getAllowSentNum
} from "@/api/order";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      selfLoading: false,
      loadingSelf: false,
      openSelf: false,
      dataList: [],
      expressList: [],
      orderDetailsList: [],
      selfForm: {
        guid: undefined,
        orderno: undefined,
        strExpressDetailInfos: []
      },
      selfFormRules: {
        strExpressDetailInfos: [
          {
            type: "array",
            required: true,
            message: "发货信息不能为空！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  filters: {
    initRefund(val) {
      const arr = [
        "正常",
        "审核中",
        "审核失败",
        "退款中",
        "已退款",
        "退款失败"
      ];
      return arr[val];
    }
  },
  computed: {
    isDisabled() {
      return function(item) {
        const { refund, allowDelivercount } = item;
        return (
          Number(refund) === 1 ||
          Number(refund) === 3 ||
          Number(refund) === 4 ||
          Number(allowDelivercount) === 0
        );
      };
    },
    isNoAllowNum() {
      return function(item) {
        const { allowDelivercount } = item;
        return Number(allowDelivercount) === 0;
      };
    },
    isNoAllowRefunding() {
      return function(item) {
        const { refund } = item;
        return Number(refund) === 1 || Number(refund) === 3;
      };
    },
    isNoAllowRefunded() {
      return function(item) {
        const { refund } = item;
        return Number(refund) === 4;
      };
    }
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const orderno = this.$route.params.code;
        const { code, data } = await getOrderExpressInfo({ orderno });
        this.loading = false;
        if (code === 200) {
          this.dataList = data;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    resetSelfForm() {
      Object.assign(this.selfForm, {
        guid: undefined,
        orderno: undefined,
        strExpressDetailInfos: []
      });
    },
    clearValidateSelf() {
      this.$refs.selfForm.resetFields();
    },

    handelSentChange() {
      const checkedData = this.orderDetailsList
        .filter(item => {
          return item.checked === true;
        })
        .map(v => {
          return { detailno: v.detailno, delivercount: v.sentNum };
        });
      this.selfForm.strExpressDetailInfos = checkedData;
    },

    async handleAdd() {
      this.resetSelfForm();
      Object.assign(this.selfForm, {
        orderno: this.$route.params.code
      });
      this.openSelf = true;
      try {
        this.selfLoading = true;
        const { data, code } = await getOrderDetailsList({
          orderno: this.$route.params.code
        });
        this.selfLoading = false;
        if (code === 200) {
          this.orderDetailsList = data.map(item => {
            return Object.assign(item, {
              checked: false,
              sentNum: item.allowDelivercount
            });
          });
        }
      } catch (err) {
        this.selfLoading = false;
        console.log(err);
      }
    },
    async handleEdit(item) {
      this.resetSelfForm();
      Object.assign(this.selfForm, {
        guid: item.guid,
        orderno: this.$route.params.code
      });
      this.openSelf = true;
      try {
        this.selfLoading = true;
        const { data, code } = await getAllowSentNum({
          guid: item.guid
        });
        this.selfLoading = false;
        if (code === 200) {
          this.orderDetailsList = data.map(item => {
            return Object.assign(item, {
              checked: false,
              sentNum: item.olddelivercount,
              allowDelivercount: item.olddelivercount + item.allowDelivercount
            });
          });
        }
      } catch (err) {
        this.selfLoading = false;
        console.log(err);
      }
    },
    submitSelfForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loadingSelf = true;
            const func =
              this.selfForm.guid === undefined
                ? handelSendGoods
                : handelEditExpressInfo;
            const { code } = await func(this.selfForm);
            this.loadingSelf = false;
            if (code === 200) {
              this.msgSuccess("操作成功");
              this.openSelf = false;
              this.getList();
            }
          } catch (err) {
            this.loadingSelf = false;
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