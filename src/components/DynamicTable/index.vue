<template>
  <div class="box-wrap">
    <div class="table-box">
      <table border="1" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th v-for="item in tableArr" :key="item.code">{{item.name}}</th>
            <th v-for="(item,index) in thInputData" :key="index" :width="item.width">{{item.name}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in itemIdArr" :key="index">
            <td
              v-for="(v,i) in item.rangeArr"
              :key="v"
              v-if="item.rowSpanArr[i]!==0"
              :rowspan="item.rowSpanArr[i]"
            >{{getItemName(i,item.rangeArr)}}</td>
            <td v-for="j in item.input" :key="j.key" v-if="!j.hidden">
              <el-input
                v-model="j.values"
                :keyId="item.rangeArr"
                :placeholder="j.name"
                :class="{'err-validate':j.validate}"
                v-on:input="handleInput($event,item.rangeArr,j.key,j.validateType)"
                :maxlength="j.validateType === 'num'?8:20"
              ></el-input>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="tip-info-table">1.表格中的内容均为必填项，现价、原价必须大于0，最多两位小数，库存必须为整数。</p>
      <p class="tip-info-table">2.当计价方式为按数量时现价、原价指每件商品的总价格。</p>
      <p
        class="tip-info-table"
      >3.当计价方式为按重量时现价、原价指每件商品的单位重量价格，例如芒果：按重量销售，每件毛重31公斤，净重30公斤，每公斤4元，选择计价方式为按重量，输入相应的毛重和净重，这里的现价、原价输入每公斤的价格。</p>
    </div>
  </div>
</template>

<script>
import { deepClone } from "@/utils";
export default {
  data() {
    return {
      thInputData: [
        { name: "现价", values: "", unit: "元", width: 110 },
        { name: "原价", values: "", unit: "元", width: 110 },
        { name: "库存", values: "", unit: "", width: 110 },
        { name: "起售数量", values: "", unit: "", width: 110 },
        { name: "标题", values: "", unit: "", width: 400 },
        { name: "特色描述", values: "", unit: "", width: 320 }
      ],
      allRight: false
    };
  },
  props: {
    itemIdArr: {
      type: Array,
      required: true
    },
    tableArr: {
      type: Array,
      required: true
    }
  },
  methods: {
    getItemName(index, rangeArr) {
      const itemName = this.tableArr[index].values.find(
        j => j.itemId === rangeArr[index]
      );
      return itemName.value;
    },
    validatInit(fn) {
      this.allRight = true;
      this.itemIdArr.forEach(item => {
        item.input
          .filter(k => {
            return k.hidden !== true;
          })
          .forEach(v => {
            this._validat(v.validateType, v, v.values);
          });
      });
      fn.call(this, this.allRight);
    },
    handleInput(val, itemId, key, validateType) {
      this.allRight = true;
      const select = this.itemIdArr.find(item => {
        return itemId.join(",") === item.rangeArr.join(",");
      });
      const selectItem = select.input.find(item => {
        return key === item.key;
      });
      this._validat(validateType, selectItem, val);
    },
    _validat(validateType, item, val) {
      if (validateType === "num") {
        const patter = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
        if (val === "" || !patter.test(val)) {
          item.validate = true;
          this.allRight = false;
        } else {
          item.validate = false;
        }
      } else if (validateType === "text") {
        if (val === "") {
          item.validate = true;
          this.allRight = false;
        } else {
          item.validate = false;
        }
      } else if (validateType === "integer") {
        const patter = /^\+?[0-9]\d*$/;
        if (val === "" || !patter.test(val)) {
          item.validate = true;
          this.allRight = false;
        } else {
          item.validate = false;
        }
      }
    }
  }
};
</script>

<style lang="scss">
.box-wrap {
  padding-left: 40px;
  .table-box {
    overflow-x: scroll;
    table {
      margin-top: 10px;
      border-color: rgb(250, 250, 250);
      width: 100%;
      min-width: 1500px;
      td,
      th {
        text-align: center;
      }
      th {
        font-size: 15px;
        color: #666;
        padding: 6px;
        background-color: rgb(250, 250, 250);
      }
      td {
        font-size: 14px;
        background-color: #fff;
        padding: 5px 6px;
      }
      .err-validate {
        input {
          color: #ef6776;
          border-color: #ef6776;
        }
      }
    }
    .tip-info-table {
      color: #ef6776;
      margin: 7px 0;
      font-size: 14px;
      line-height: 18px;
    }
  }
}
</style>