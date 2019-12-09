<template>
  <div class="box-wrap">
    <!-- <el-button @click="inputAllAc">{{!inputAll?'批量填充':'取消批量填充'}}</el-button> -->
    <el-form class="form-table">
      <table border="1" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th v-for="(item,index) in tableArr" :key="index">{{item.name}}</th>
            <th v-for="(item,index) in thInputData" :width="`${item.width}`">
              <el-input v-if="inputAll" v-model="item.values" :placeholder="`${item.name}`"></el-input>
              <span v-else>{{`${item.name}`}}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in itemIdArr" :key="index">
            <td
              v-for="(v,i) in item.rangeArr"
              :key="i"
              v-if="item.rowSpanArr[i]!==0"
              :rowspan="item.rowSpanArr[i]"
            >{{getItemName(i,item.rangeArr)}}</td>
            <td v-for="(j,k) in item.input">
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
    </el-form>
    <button @click="validatInit">验证</button>
  </div>
</template>

<script>
import { deepClone } from "@/utils";
export default {
  data() {
    return {
      inputAll: false,
      thInputData: [],
      lock: true,
      tableForm: {}
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
  watch: {
    thInputData: {
      deep: true,
      handler(val) {
        if (!this.lock) {
          this.itemIdArr.map((item, index) => {
            item.input.map((v, i) => {
              v.values = this.thInputData[i].values;
            });
          });
        }
      }
    }
  },
  created() {
    this.thInputData = [
      { name: "现价", values: "", unit: "元", width: 110 },
      { name: "原价", values: "", unit: "元", width: 110 },
      { name: "库存", values: "", unit: "", width: 110 },
      { name: "标题", values: "", unit: "", width: 320 },
      { name: "特色描述", values: "", unit: "", width: 280 }
    ];
  },
  methods: {
    getItemName(index, rangeArr) {
      const itemName = this.tableArr[index].values.find(
        j => j.itemId === rangeArr[index]
      );
      return itemName.value;
    },

    inputAllAc() {
      this.lock = false;
      this.inputAll = !this.inputAll;
    },

    validate() {
      this.$emit("valid", "wf");
    },

    validatInit() {
      this.itemIdArr.forEach(item => {
        item.input.forEach(v => {
          this._validat(v.validateType, v, v.values);
        });
      });
    },

    handleInput(val, itemId, key, validateType) {
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
        if (!patter.test(val)) {
          item.validate = true;
        } else {
          item.validate = false;
        }
      } else if (validateType === "text") {
        if (val === "") {
          item.validate = true;
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
  .block {
    width: 100px;
    height: 400px;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .el-form {
    overflow-x: scroll;
    table {
      margin-top: 10px;
      border-color: rgb(250, 250, 250);
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
  }
}
</style>>
