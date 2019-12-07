<template>
  <div class="box-wrap">
    <el-button @click="inputAllAc">{{!inputAll?'批量填充':'取消批量填充'}}</el-button>
    <el-form class="form-table">
      <table border="1" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th v-for="(item,index) in tableArr" :key="index">{{item.name}}</th>
            <th v-for="(item,index) in thInputData" width="170">
              <el-input
                v-if="inputAll"
                v-model="item.values"
                :placeholder="`${item.name}(${item.unit})`"
              ></el-input>
              <span v-else>{{`${item.name}(${item.unit})`}}</span>
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
              <el-form-item>
                <el-input v-model="j.values" :keyId="item.rangeArr" :placeholder="j.name"></el-input>
              </el-form-item>
            </td>
          </tr>
        </tbody>
      </table>
    </el-form>
  </div>
</template>

<script>
import { deepClone } from "@/utils";
export default {
  data() {
    return {
      inputAll: false,
      thInputData: [],
      lock: true
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
      { name: "价格", values: "", unit: "元" },
      { name: "库存", values: "", unit: "件" }
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
    }
  }
};
</script>

<style lang="scss">
.box-wrap {
  overflow-x: scroll;
  width: 1100px;
  .block {
    width: 100px;
    height: 400px;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  table {
    margin-top: 10px;
    border-color: rgb(250, 250, 250);
    min-width: 1100px;
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
  }
  .form-table {
    .el-form-item__error {
      display: none !important;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>>
