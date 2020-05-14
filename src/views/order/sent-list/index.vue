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
              <el-table-column label="商品编号" prop="detailno"></el-table-column>
              <el-table-column label="商品名称" prop="cmdtname"></el-table-column>
              <el-table-column label="发货数量" prop="delivercount"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="订单号" prop="orderno"></el-table-column>
        <el-table-column label="发货字号" prop="namebrand"></el-table-column>
        <el-table-column label="发货时间" prop="fhtime"></el-table-column>
        <el-table-column label="物流公司编号" prop="expressid"></el-table-column>
        <el-table-column label="物流公司" prop="expressname"></el-table-column>
        <el-table-column label="物流单号" prop="expressno"></el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-map-location"
              @click="handleTrack(scope.row)"
            >订单跟踪</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              v-if="Number(scope.row.tradestate)===1"
            >修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="选择物流发货" :visible.sync="open" @close="clearValidate" width="550px">
      <el-form
        :model="expressForm"
        ref="expressForm"
        :rules="expressFormRules"
        v-loading="expressLoading"
        label-width="120px"
      >
        <el-form-item class="sent-wrap" label="发货信息" prop="strExpressDetailInfos">
          <div class="sent-box" v-for="(item,index) in orderDetailsList" :key="index">
            <div>
              <el-checkbox
                v-model="item.checked"
                :disabled="isDisabled(item)"
                @change="handelSentChange"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.cmdtname"
                  placement="top-start"
                >
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
            </div>
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
        <el-form-item label="物流公司" prop="expressname">
          <el-select
            v-model="expressForm.expressname"
            placeholder="请选择物流公司"
            @change="expressChange"
            style="width:350px"
          >
            <el-option
              v-for="(item,index) in expressList"
              :key="index"
              :label="item.expressname"
              :value="item.expressname"
            />
          </el-select>
        </el-form-item>
        <div v-if="expressForm.expressid === '100000001'">
          <el-form-item label="物流公司名称" prop="inexpressname">
            <el-input
              v-model="expressForm.inexpressname"
              placeholder="请输入物流公司名称"
              maxlength="30"
              style="width:350px"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="物流单号" prop="expressno">
          <el-input
            v-model="expressForm.expressno"
            placeholder="请输入物流单号"
            maxlength="20"
            style="width:350px"
          ></el-input>
        </el-form-item>
        <el-form-item label="发货字号" prop="namebrand">
          <el-input
            v-model="expressForm.namebrand"
            placeholder="请输入发货字号"
            maxlength="20"
            style="width:350px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" :loading="loadingSend" @click="submitForm('expressForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="订单跟踪" class="logistic-box" :visible.sync="openTrack" width="750px">
      <el-timeline v-loading="logisticLoading" :reverse="logisticrReverse">
        <el-timeline-item
          v-for="(activity, index) in logisticList"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.AcceptTime"
        >
          <p class="title">{{activity.title}}</p>
          {{activity.AcceptStation}}
        </el-timeline-item>
      </el-timeline>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openTrack = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getOrderExpressInfo,
  handelEditExpressInfo,
  getExpressList,
  getOrderDetailsList,
  getKdnExpressInfo,
  getAllowSentNum,
  handelSendGoods
} from "@/api/order";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    const validateExpressno = (rule, value, callback) => {
      if (value === undefined) {
        callback(new Error("请输入物流单号"));
      } else {
        if (!/^[a-zA-Z0-9]{5,20}$/.test(value)) {
          callback(new Error("请输入正确的物流单号"));
        }
        callback();
      }
    };
    return {
      loading: false,
      expressLoading: false,
      loadingSend: false,
      logisticLoading: false,
      open: false,
      openTrack: false,
      logisticrReverse: true,
      dataList: [],
      expressList: [],
      orderDetailsList: [],
      logisticList: [],
      orderDetailsList: [],
      expressForm: {
        guid: undefined,
        orderno: undefined,
        expressno: undefined,
        expressname: undefined,
        expressid: undefined,
        inexpressname: undefined,
        namebrand: undefined,
        strExpressDetailInfos: []
      },
      expressFormRules: {
        expressno: [
          { validator: validateExpressno, required: true, trigger: "blur" }
        ],
        expressname: [
          { required: true, message: "请选择物流公司", trigger: "change" }
        ],
        inexpressname: [
          { required: true, message: "请输入物流公司名称", trigger: "blur" }
        ],
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
    resetExpressForm() {
      Object.assign(this.expressForm, {
        guid: undefined,
        orderno: undefined,
        expressno: undefined,
        expressname: undefined,
        expressid: undefined,
        inexpressname: undefined,
        namebrand: undefined,
        strExpressDetailInfos: []
      });
    },
    clearValidate() {
      this.$refs.expressForm.resetFields();
    },
    expressChange(val) {
      this.expressForm.expressid = this.expressList.find(item => {
        return item.expressname === val;
      }).expressid;
    },
    handelSentChange() {
      const checkedData = this.orderDetailsList
        .filter(item => {
          return item.checked === true;
        })
        .map(v => {
          return { detailno: v.detailno, delivercount: v.sentNum };
        });
      this.expressForm.strExpressDetailInfos = checkedData;
    },
    async handleAdd() {
      this.resetExpressForm();
      Object.assign(this.expressForm, {
        orderno: this.$route.params.code,
        namebrand: this.dataList[0].namebrand || ""
      });
      this.open = true;
      try {
        this.expressLoading = true;
        const [
          { data: data1, code: code1 },
          { data: data2, code: code2 }
        ] = await Promise.all([
          getExpressList(),
          getOrderDetailsList({ orderno: this.$route.params.code })
        ]);
        this.expressLoading = false;
        if (code1 === 200 && code2 === 200) {
          this.expressList = data1;
          this.orderDetailsList = data2.map(item => {
            return Object.assign(item, {
              checked: false,
              sentNum: item.allowDelivercount
            });
          });
        }
      } catch (err) {
        this.expressLoading = false;
        console.log(err);
      }
    },
    async handleEdit(item) {
      this.resetExpressForm();
      const {
        guid,
        orderno,
        isexpressqt,
        expressid,
        expressname,
        expressno,
        namebrand
      } = item;
      this.open = true;
      Object.assign(this.expressForm, {
        guid,
        orderno,
        expressno,
        namebrand
      });
      try {
        this.expressLoading = true;
        const [
          { data: data1, code: code1 },
          { data: data2, code: code2 }
        ] = await Promise.all([getExpressList(), getAllowSentNum({ guid })]);
        this.expressLoading = false;
        if (code1 === 200 && code2 === 200) {
          this.expressList = data1;
          this.orderDetailsList = data2.map(item => {
            return Object.assign(item, {
              checked: false,
              sentNum: item.olddelivercount,
              allowDelivercount: item.olddelivercount + item.allowDelivercount
            });
          });
          if (isexpressqt === "Y") {
            Object.assign(this.expressForm, {
              expressid: "100000001",
              expressname: "其他",
              inexpressid: expressid,
              inexpressname: expressname
            });
          } else if (isexpressqt === "N") {
            Object.assign(this.expressForm, {
              expressid,
              expressname
            });
          }
        }
      } catch (err) {
        this.expressLoading = false;
        console.log(err);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loadingSend = true;
            const func =
              this.expressForm.guid === undefined
                ? handelSendGoods
                : handelEditExpressInfo;
            const { code } = await func(this.expressForm);
            this.loadingSend = false;
            if (code === 200) {
              this.msgSuccess("操作成功");
              this.open = false;
              this.getList();
            }
          } catch (err) {
            this.loadingSend = false;
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    async handleTrack(item) {
      const { expressid, expressno, fhtime } = item;
      this.openTrack = true;
      this.logisticList = [];
      this.logisticLoading = true;
      try {
        const {
          code,
          data: { Traces, State }
        } = await getKdnExpressInfo({
          expressid,
          expressno
        });
        this.logisticLoading = false;
        if (code === 200) {
          this.logisticList = [
            {
              title: "已发货",
              AcceptStation: "包裹正在等待揽收",
              AcceptTime: fhtime,
              size: "large",
              icon: "el-icon-box"
            },
            ...Traces
          ];
          const len = this.logisticList.length;
          if (State === "3") {
            Object.assign(this.logisticList[len - 1], {
              title: "已签收",
              size: "large",
              icon: "el-icon-s-claim",
              type: "success"
            });
            Object.assign(this.logisticList[len - 2], {
              title: "运输中",
              size: "large",
              icon: "el-icon-truck"
            });
            Object.assign(this.logisticList[1], {
              title: "已揽收",
              size: "large",
              icon: "el-icon-receiving"
            });
          } else if (State === "2") {
            Object.assign(this.logisticList[len - 1], {
              title: "运输中",
              size: "large",
              icon: "el-icon-truck",
              type: "success"
            });
            Object.assign(this.logisticList[1], {
              title: "已揽收",
              size: "large",
              icon: "el-icon-receiving"
            });
          } else if (State === "1") {
            Object.assign(this.logisticList[len - 1], {
              title: "已揽收",
              size: "large",
              icon: "el-icon-truck",
              type: "success"
            });
          } else if (State === "4") {
          }
        }
      } catch (err) {
        this.openTrack = false;
        this.logisticLoading = false;
        console.log(err);
      }
    }
  }
};
</script>