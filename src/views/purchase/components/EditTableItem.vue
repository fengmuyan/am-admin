<template>
  <div>
    <div class="edit-table-item">
      <div :class="{'table-box':true,'action-table':haveAction}" v-loading="loading">
        <table cellpadding="0" cellspacing="0">
          <thead>
            <th v-for="(item,index) in thData" :key="index" :width="item.width">
              <span class="require-icon" v-if="item.isRequire === true">*</span>
              <i class="el-icon-edit-outline" v-if="item.isEdit === true"></i>
              {{item.name}}
            </th>
          </thead>
          <tbody>
            <tr v-for="(item,index) in tableData" :key="index">
              <td width="110" class="operate-btns" v-if="haveAction">
                <i class="el-icon-remove" v-if="tableData.length!==1" @click="delItem(index)"></i>
                <i class="el-icon-circle-plus" @click="addItem(index)"></i>
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
                :style="`width:${v.width}px;background-color: rgb(242, 242, 242);`"
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
                    :disabled="v.disabled"
                    :placeholder="v.placeholder"
                    :maxlength="v.maxLen"
                    :class="{'err-validate':v.validate}"
                    v-on:input="handleInput(index,i)"
                    style="width:95%"
                  ></el-input>
                  <el-checkbox
                    v-if="v.canEdit && v.inputType === 2"
                    v-model="v.value"
                    :disabled="v.disabled"
                  >已结算</el-checkbox>
                </div>
                <div v-else>
                  <span>
                    {{v.value}}
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
import { accAdd, subtr, accMull, accDiv, deepClone } from "@/utils";
export default {
  name: "edit-table-item",
  props: {
    tableInit: {
      type: Array,
      default() {
        return [];
      }
    },
    haveAction: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },

  data() {
    return {
      //表格内容模板数据
      modelTableData: {
        editAction: true,
        isSelected: false,
        content: [
          {
            idStr: "", //对应唯一标识（删除）
            key: "order",
            value: "",
            canEdit: false,
            noValidate: true, //不做验证
            width: 80, //占用宽度
            noSubmit: true
          },
          {
            key: "company",
            value: "",
            canEdit: false,
            noValidate: true, //不做验证
            width: 150
          },
          {
            key: "shouldPay",
            value: "",
            canEdit: false,
            noValidate: true //不做验证
          },
          {
            key: "name",
            value: "",
            placeholder: "已付",
            canEdit: true,
            validate: false,
            validateType: 2,
            pattern: "(^[1-9](\\d+)?(\\.\\d{1,2})?$)|(^\\d\\.\\d{1,2}$)",
            inputType: 1,
            maxLen: 30,
            errMsg: "* 必填项不能为空。"
          },
          {
            key: "isDone",
            value: "",
            canEdit: true,
            inputType: 2,
            noValidate: true //不做验证
          }
        ]
      },
      //表格标题模板数据
      thData: [
        { name: "序号", width: 80, value: "合计" },
        { name: "打税公司", width: 150 },
        { name: "应付", key: "shouldPay", value: "" },
        {
          name: "已付",
          isEdit: true,
          isRequire: true,
          key: "name",
          value: ""
        },
        { name: "打税是否已结算", isEdit: true }
      ],
      loading: false,
      errMsgArr: [],
      tableData: [],
      cateArr: [],
      subData: []
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
        this.$confirm(
          `确定要删除 ${this.tableData[index].content[3].value} 吗？`,
          "系统提示",
          {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "el-message-box-wran"
          }
        )
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
        if (this.errMsgArr.length === 0) {
          this.tableData[index].editAction = false;
          this.tableData[index].isSelected = true;
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
      this.subData = this._deinitData(this.tableData);
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
          });
          modelData.content[0].value = i + 1;
          this.tableData.push(modelData);
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
