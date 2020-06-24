<template>
  <div>
    <div class="edit-table-item">
      <div :class="{'table-box':true}" v-loading="loading">
        <table cellpadding="0" cellspacing="0">
          <thead>
            <th v-for="(item,index) in thData" v-if="!item.hidden" :key="index" :width="item.width">
              <span class="require-icon" v-if="item.isRequire === true">*</span>
              <i class="el-icon-edit-outline" v-if="item.isEdit === true"></i>
              {{item.name}}
            </th>
          </thead>
          <tbody>
            <tr v-for="(item,index) in tableData" :key="index">
              <td width="110" class="operate-btns" v-if="!noEdit">
                <i class="el-icon-remove" v-if="tableData.length!==1" @click="delItem(index)"></i>
                <i
                  class="el-icon-circle-plus"
                  v-if="tableData.length !== maxLen"
                  @click="addItem(index)"
                ></i>
                <i
                  class="el-icon-success"
                  @click="updateItem(index)"
                  v-if="item.editAction === true"
                ></i>
                <i
                  class="el-icon-edit-outline"
                  @click="updateItem(index)"
                  v-if="item.editAction === false"
                ></i>
              </td>
              <td
                v-for="(v,i) in item.content"
                :key="i"
                v-if="!v.hidden"
                :style="`width:${v.width}px;background-color: #F5F7FA;`"
              >
                <div v-if="item.editAction">
                  <span v-if="v.canEdit === false">
                    {{v.value}}
                    <i
                      class="el-icon-success"
                      v-if="item.isSelected && i === 0"
                      style="color:#83d496;font-size:16px;"
                    />
                  </span>
                  <el-input
                    v-if="v.canEdit && v.inputType === 1"
                    v-model="v.value"
                    :disabled="v.disabled || noEdit"
                    :placeholder="v.placeholder"
                    :maxlength="v.maxLen"
                    :class="{'err-validate':v.validate}"
                    v-on:input="handleInput(index,i)"
                    style="width:95%"
                  ></el-input>
                  <el-select
                    v-if="v.canEdit && v.inputType === 2"
                    v-model="v.value"
                    :placeholder="v.placeholder"
                    :class="{'err-validate':v.validate}"
                    @change="selectChange(index,i)"
                    style="width:97%"
                  >
                    <el-option
                      v-for="(item,index) in v.inputOptions"
                      :key="index"
                      :label="item.cname"
                      :value="item.ccode"
                    ></el-option>
                  </el-select>
                  <el-checkbox
                    v-if="v.canEdit && v.inputType === 3"
                    v-model="v.value"
                    true-label="Y"
                    false-label="N"
                    @change="radioChange($event,index,i)"
                  >已结算</el-checkbox>
                  <el-input
                    v-if="v.canEdit && v.inputType === 5"
                    v-model="v.value"
                    :disabled="v.disabled || noEdit"
                    :placeholder="v.placeholder"
                    :maxlength="v.maxLen"
                    :class="{'input-with-select':true,'err-validate':v.validate}"
                    v-on:input="handleInput(index,i)"
                    style="width:97%"
                  >
                    <el-select
                      v-model="v.selectValue"
                      slot="append"
                      placeholder="请选择"
                      :disabled="v.disabled || noEdit"
                      @change="innerSelectChange(index,i)"
                    >
                      <el-option
                        v-for="(item,index) in v.selectOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-input>
                </div>
                <div v-else>
                  <span>
                    {{v|inputTypeInit}}
                    <i
                      class="el-icon-success"
                      v-if="item.isSelected && i === 0"
                      style="color:#83d496;font-size:16px;"
                    />
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td
                v-for="(item,index) in thData"
                v-if="!item.hidden"
                :key="index"
                :width="item.width"
                style="padding:12px 0;height:39px"
              >{{item.value}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { accAdd, accDiv, deepClone } from "@/utils";
export default {
  name: "edit-table-item",
  props: {
    tableInit: {
      type: Array,
      default() {
        return [];
      }
    },
    modelTableData: {
      type: Object,
      default() {
        return {};
      }
    },
    thData: {
      type: Array,
      default() {
        return [];
      }
    },
    noEdit: {
      type: Boolean,
      default() {
        return false;
      }
    },
    maxLen: {
      type: Number,
      default() {
        return 20;
      }
    },
    needCompute: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },

  filters: {
    inputTypeInit(val) {
      if (
        val.inputType === 6 ||
        val.inputType === 2 ||
        val.inputType === 7 ||
        val.inputType === 3
      ) {
        return val.labelValue;
      } else if (val.inputType === 5) {
        if (val.value) {
          return `${val.value}${val.selectLabelValue}`;
        } else {
          return "";
        }
      } else {
        return val.value;
      }
    }
  },

  data() {
    return {
      loading: false,
      errMsgArr: [],
      tableData: []
    };
  },

  created() {
    this._initTableData();
  },

  methods: {
    /* 表格新增一行 */
    addItem(index) {
      const model = deepClone(this.modelTableData);
      model.content[0].idStr = this._generateStr(15);
      this.tableData.splice(index + 1, 0, model);
      this._reSort(this.tableData);
    },

    /* 表格删除某项操作 */
    delItem(index) {
      if (this.tableData[index].isSelected === true) {
        this.$confirm(`确定要删除吗？`, "系统提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "el-message-box-wran"
        })
          .then(() => {
            this._delItem(this.tableData[index]);
          })
          .catch(() => {});
      } else {
        this._delItem(this.tableData[index]);
      }
    },

    /* 表格中保存修改操作 */
    updateItem(index) {
      const editAction = this.tableData[index].editAction;
      if (editAction === true) {
        this.errMsgArr = [];
        const content = this.tableData[index].content.filter(item => {
          return item.noValidate !== true;
        });
        content.forEach(item => {
          this._validate(item);
        });
        if (this.needCompute) {
          const idxPrePay = content.findIndex(item => {
            return item.key === "preWhAmount";
          });
          const idxPreRate = content.findIndex(item => {
            return item.key === "preRate";
          });
          const idxActualPay = content.findIndex(item => {
            return item.key === "whAmount";
          });
          const idxActualRate = content.findIndex(item => {
            return item.key === "rate";
          });
          const computeArr = [
            Number(content[idxPrePay].value) /
              Number(content[idxPreRate].value),
            Number(content[idxActualPay].value) /
              Number(content[idxActualRate].value)
          ].filter(k => {
            return Boolean(k) && k !== Infinity;
          });
          if (computeArr.length === 0) {
            this.errMsgArr.push("* 预付或实付至少填写一个。");
          }
        }
        if (this.errMsgArr.length === 0) {
          this.tableData[index].editAction = false;
          this.tableData[index].isSelected = true;
          if (this.needCompute) {
            this._handelPrice(this.tableData[index]);
          }
          this._handelTotolNum();
        } else {
          const h = this.$createElement;
          this._confirmModel(
            h(
              "ul",
              {
                style:
                  "list-style:none;line-height:28px;margin:0;padding:0;font-size:16px"
              },
              [
                h("li", null, this.errMsgArr[0]),
                h("li", null, this.errMsgArr[1]),
                h("li", null, this.errMsgArr[2]),
                h("li", null, this.errMsgArr[3])
              ]
            )
          );
        }
      } else {
        this.tableData[index].editAction = !editAction;
      }
    },

    /* 表格中input输入事件监听触发验证 */
    handleInput(index, i) {
      const item = this.tableData[index].content[i];
      this._validate(item, false);
    },

    /* 模拟提交展示提交数据*/
    creatOrder() {
      return this._deinitData(this.tableData);
    },

    radioChange(val, index, i) {
      const item = this.tableData[index].content;
      item[i].labelValue = val === "Y" ? "已结算" : "未结算";
    },

    selectChange(index, i) {
      const item = this.tableData[index].content;
      item[i].validate = false;
      item[i].labelValue = item[i].inputOptions.find(v => {
        return v.ccode === item[i].value;
      }).cname;
    },

    innerSelectChange(index, i) {
      const item = this.tableData[index].content;
      item[i].selectLabelValue = item[i].selectOptions.find(v => {
        return v.value === item[i].selectValue;
      }).label;
    },

    /* 根据项标识删除项 */
    _delItem(operateItem) {
      const idStr = this.tableData.findIndex(item => {
        if (item.content[0].idStr) {
          return item.content[0].idStr === operateItem.content[0].idStr;
        }
      });
      if (idStr !== -1) {
        this.tableData.splice(idStr, 1);
        this._reSort(this.tableData);
        this._handelTotolNum();
      }
    },

    /* 每次保存计算 */
    _handelPrice(operateItem) {
      const idxPrePay = operateItem.content.findIndex(item => {
        return item.key === "preWhAmount";
      });
      const idxPreRate = operateItem.content.findIndex(item => {
        return item.key === "preRate";
      });
      const idxActualPay = operateItem.content.findIndex(item => {
        return item.key === "whAmount";
      });
      const idxActualRate = operateItem.content.findIndex(item => {
        return item.key === "rate";
      });
      const idxPrePayYuan = operateItem.content.findIndex(item => {
        return item.key === "prePayYuan";
      });
      const idxActualPayYuan = operateItem.content.findIndex(item => {
        return item.key === "actualPayYuan";
      });
      operateItem.content[idxPrePayYuan].value =
        accDiv(
          Number(operateItem.content[idxPrePay].value),
          Number(operateItem.content[idxPreRate].value)
        ) || "";
      operateItem.content[idxPrePayYuan].labelValue =
        operateItem.content[idxPrePayYuan].value || "";
      operateItem.content[idxActualPayYuan].value =
        accDiv(
          Number(operateItem.content[idxActualPay].value),
          Number(operateItem.content[idxActualRate].value)
        ) || "";
      operateItem.content[idxActualPayYuan].labelValue =
        operateItem.content[idxActualPayYuan].value || "";
    },

    /* 每次保存计算总计 */
    _handelTotolNum() {
      this.thData
        .filter(val => {
          return val.key;
        })
        .forEach(item => {
          const value = this.tableData
            .filter(v => {
              return v.isSelected === true;
            })
            .reduce((preV, v) => {
              preV = accAdd(
                preV,
                Number(
                  v.content.find(k => {
                    return k.key === item.key;
                  }).value
                )
              );
              return preV;
            }, 0);
          Object.assign(item, {
            value: value || ""
          });
        });
    },

    /* 初始后端返回数据 */
    _initTableData() {
      if (this.tableInit.length === 0) {
        this.addItem();
      } else {
        this.tableInit.forEach((v, i) => {
          const modelData = deepClone(this.modelTableData);
          modelData.editAction = false;
          modelData.isSelected = true;
          modelData.content[0].idStr = this._generateStr(15);
          modelData.content.forEach(k => {
            k.value = v[k.key] || "";
            if (k.inputType === 5) {
              k.selectValue = v[k.selectKey] || v[k.selectLabelKey];
              k.selectLabelValue = v[k.selectLabelKey];
            } else if (k.inputType === 2) {
              k.labelValue = v[k.labelKey];
            } else if (k.inputType === 3) {
              k.labelValue = v[k.key] === "Y" ? "已结算" : "未结算";
            }
          });
          modelData.content[0].value = i + 1;
          this.tableData.push(modelData);
          if (this.needCompute) {
            this._handelPrice(modelData);
          }
          this._reSort(this.tableData);
        });
        this._handelTotolNum();
      }
    },

    /* 处理成后端想要数据 */
    _deinitData(operateItem) {
      return operateItem
        .filter(v => {
          return v.isSelected === true;
        })
        .map(k => {
          return k.content
            .filter(y => {
              return y.noSubmit !== true;
            })
            .reduce((pre, j) => {
              Object.assign(pre, { [j.key]: j.value });
              if (j.inputType === 2) {
                Object.assign(pre, {
                  [`${j.labelKey}`]: j.labelValue
                });
              }
              if (j.inputType === 5) {
                Object.assign(pre, {
                  [`${j.selectKey}`]: j.selectValue,
                  [`${j.selectLabelKey}`]: j.selectLabelValue
                });
              }
              return pre;
            }, {});
        });
    },

    /* 表格数据保存验证  */
    _validate(item, addMsg = true) {
      if (item.validateType === 1) {
        if (item.value !== "" && item.value !== undefined) {
          item.validate = false;
        } else {
          item.validate = true;
          if (addMsg && !this.errMsgArr.includes(item.errMsg))
            this.errMsgArr.push(item.errMsg);
        }
      } else if (item.validateType === 2) {
        if (item.value !== "" && new RegExp(item.pattern).test(item.value)) {
          item.validate = false;
        } else {
          item.validate = true;
          if (addMsg && !this.errMsgArr.includes(item.errMsg))
            this.errMsgArr.push(item.errMsg);
        }
      } else if (item.validateType === 3) {
        if (item.value === "" || new RegExp(item.pattern).test(item.value)) {
          item.validate = false;
        } else {
          item.validate = true;
          if (addMsg && !this.errMsgArr.includes(item.errMsg))
            this.errMsgArr.push(item.errMsg);
        }
      }
    },

    /* 表格数据排序 */
    _reSort(val) {
      val.forEach((item, index) => {
        item.content[0].value = index + 1;
      });
    },

    /* confirmBox封装  */
    _confirmModel(msg, confirmButtonText = "确定", confirmFn, cancelFn) {
      this.$confirm(msg, "系统提示", {
        confirmButtonText,
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(() => {
          if (confirmFn) {
            confirmFn.call(this);
          }
        })
        .catch(() => {
          if (cancelFn) {
            cancelFn.call(this);
          }
        });
    },

    /* 生成唯一标识id  */
    _generateStr(len) {
      var len = len || 32;
      var $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var maxPos = $chars.length;
      var pwd = "";
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    }
  }
};
</script>
