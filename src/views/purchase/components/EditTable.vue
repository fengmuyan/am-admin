<template>
  <div style="position: relative">
    <el-button
      @click="sentSelect"
      size="mini"
      type="primary"
      style="position: absolute;top: -55px;left: 79px;"
    >仓库中选择</el-button>
    <div class="edit-table">
      <div class="table-box action-table" v-loading="loading">
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
              <td width="110" class="operate-btns">
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
                    {{v.labelValue || v.value}}
                    <i
                      class="el-icon-success"
                      v-if="item.isSelected && i === 0"
                      style="color:#83d496;font-size:16px;"
                    />
                  </span>
                  <el-input
                    v-if="v.canEdit && v.inputType === 1"
                    v-model="v.value"
                    :disabled="item.isSent && v.sentAttr"
                    :placeholder="v.placeholder"
                    :maxlength="v.maxLen"
                    :class="{'err-validate':v.validate}"
                    v-on:input="handleInput(index,i)"
                    style="width:97%"
                  ></el-input>
                  <el-select
                    v-if="v.canEdit && v.inputType === 2"
                    :disabled="item.isSent && v.sentAttr"
                    v-model="v.value"
                    :placeholder="v.placeholder"
                    :class="{'err-validate':v.validate}"
                    @change="selectChange(index,i)"
                    style="width:97%"
                  >
                    <el-option
                      v-for="(item,index) in v.inputOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-input
                    v-if="v.canEdit && v.inputType === 5"
                    v-model="v.value"
                    :disabled="item.isSent && v.sentAttr"
                    :placeholder="v.placeholder"
                    :maxlength="v.maxLen"
                    :class="{'input-with-select':true,'err-validate':v.validate}"
                    v-on:input="handleInput(index,i)"
                    style="width:97%"
                  >
                    <el-select
                      v-model="v.selectVal"
                      slot="append"
                      placeholder="请选择"
                      :disabled="item.isSent && v.sentAttr"
                    >
                      <el-option
                        v-for="(item,index) in v.selectOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-input>
                  <el-cascader
                    v-if="v.canEdit && v.inputType === 6"
                    :disabled="item.isSent && v.sentAttr"
                    placeholder="试搜索：苹果 / pg"
                    :filter-method="_dataFilter"
                    :options="cateArr"
                    @change="handelCascader($event,index,i)"
                    v-model="v.value"
                    filterable
                    :props="{emitPath:false}"
                    :class="{'err-validate':v.validate}"
                    :ref="`elCascader${index}`"
                  ></el-cascader>
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
                :key="index"
                :width="item.width"
                style="padding:12px 0;height:39px"
              >{{item.value}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 添加或修改套餐组 -->
    <el-dialog title="选择商品" :visible.sync="open" width="980px" custom-class="edit-table-dialog">
      <div style="min-height:400px">
        <div class="form-p">
          <el-form :model="form" ref="form" label-width="40px" :inline="true">
            <el-form-item label="名称" prop="proName">
              <el-input
                v-model="form.proName"
                placeholder="请输入商品名称"
                clearable
                style="width: 180px"
              />
            </el-form-item>
            <el-form-item label="产地" prop="address">
              <el-select
                v-model="form.address"
                placeholder="请选择"
                clearable
                size="small"
                style="width: 120px"
              >
                <el-option label="老挝" value="0" />
                <el-option label="越南" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="品级" prop="pinji">
              <el-select
                v-model="form.pinji"
                placeholder="请选择"
                clearable
                size="small"
                style="width: 120px"
              >
                <el-option label="特级" value="0" />
                <el-option label="一级" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="table-p" style="padding:0;min-height:490px;">
          <el-table
            ref="multipleTable"
            :data="proList"
            tooltip-effect="dark"
            style="width: 100%"
            height="490"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column label="序号" prop="orderBy" width="40" />
            <el-table-column label="商品编号" prop="procode" />
            <el-table-column label="分类" prop="cateName" />
            <el-table-column label="名称" prop="name" />
            <el-table-column label="产地" prop="voAddress" />
            <el-table-column label="品级" prop="voPinji" />
            <el-table-column label="件重" prop="weight" />
            <el-table-column label="单位" prop="weightUnit" />
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { accAdd, subtr, accMull, accDiv, deepClone } from "@/utils";
import { getProCate } from "@/api/product";
export default {
  name: "edit-table",
  props: {
    tableInit: {
      type: Array,
      default() {
        /* return [
          {
            cate: "02000020", //商品分类code
            cateName: "橙橘柚柑 / 柑", //商品分类名称
            name: "测试名称01", //商品名称
            gongchang: "1", //工厂code
            maichang: "测试卖场", //卖场
            car: "测试车次", //车次
            address: "1", //产地code
            pinji: "1", //品级code
            num: "10", //件数
            weight: "100", //件重
            weightUnit: "公斤", //件重单位
            price: "20.32", //单价
            priceUnit: "越盾", //单价单位
            huilv: "1.23" //汇率
          },
          {
            cate: "02000020",
            cateName: "橙橘柚柑 / 柑",
            name: "测试名称02",
            gongchang: "2",
            maichang: "测试卖场02",
            car: "测试车次02",
            address: "2",
            pinji: "2",
            num: "15",
            weight: "106.32",
            weightUnit: "斤",
            price: "30.32",
            priceUnit: "泰铢",
            huilv: "1.03"
          },
          {
            cate: "02000020",
            cateName: "橙橘柚柑 / 柑",
            name: "测试名称03",
            gongchang: "2",
            maichang: "测试卖场03",
            car: "测试车次03",
            address: "2",
            pinji: "2",
            num: "15",
            weight: "106.32",
            weightUnit: "斤",
            price: "56.32",
            priceUnit: "泰铢",
            huilv: "1.13"
          }
        ]; */
        return [];
      }
    }
  },

  filters: {
    inputTypeInit(val) {
      if (val.inputType === 6 || val.inputType === 2 || val.inputType === 7) {
        return val.labelValue;
      } else if (val.inputType === 5) {
        return `${val.value}${val.selectVal}`;
      } else {
        return val.value;
      }
    }
  },

  data() {
    return {
      //表格内容模板数据
      modelTableData: {
        editAction: true,
        isSelected: false,
        isSent: false,
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
            key: "procode",
            value: "",
            canEdit: false,
            noValidate: true, //不做验证
            width: 100 //占用宽度
          },
          {
            key: "cate", //对应键值
            value: "", //val值
            labelValue: "",
            placeholder: "商品分类", //占位符
            canEdit: true, //是否可编辑
            validate: false, //是否验证通过（默认false）
            validateType: 1, //验证类型（1：不能为空，2：不能为空且遵守正则，3：可以为空，不为空的时候须遵守正则）
            inputType: 6, //元素类型（1：select选择框，2：input输入框，3：radio单选框，4：checkBox多选框，5：input + select，6：多联选择，7：总重，总价带单位，8：可供匹配的inout）
            width: 170,
            sentAttr: true, //是否仓库中属性
            errMsg: "* 必填项不能为空。" //错误提示
          },
          {
            key: "name",
            value: "",
            placeholder: "名称",
            canEdit: true,
            validate: false,
            validateType: 1,
            inputType: 1,
            maxLen: 30,
            width: 160, //占用宽度
            sentAttr: true, //是否仓库中属性
            errMsg: "* 必填项不能为空。"
          },
          {
            key: "gongchang",
            value: "",
            labelValue: "",
            placeholder: "工厂",
            canEdit: true,
            noValidate: true, //不做验证
            inputType: 1,
            maxLen: 30
          },
          {
            key: "maichang",
            value: "",
            placeholder: "卖场",
            canEdit: true,
            noValidate: true, //不做验证
            inputType: 1,
            maxLen: 30
          },
          {
            key: "car",
            value: "",
            placeholder: "车次",
            canEdit: true,
            noValidate: true, //不做验证
            inputType: 1,
            maxLen: 30
          },
          {
            key: "carNum",
            value: "",
            placeholder: "车牌号",
            canEdit: true,
            validate: false,
            validateType: 1,
            inputType: 1,
            maxLen: 30,
            errMsg: "* 必填项不能为空。"
          },
          {
            key: "carPhone",
            value: "",
            placeholder: "司机联系方式",
            canEdit: true,
            validate: false,
            validateType: 2,
            pattern: "^[0-9]\\d{6,15}$",
            inputType: 1,
            maxLen: 15,
            width: 150, //占用宽度
            errMsg: "* 联系电话格式不正确！"
          },
          {
            key: "address",
            value: "",
            labelValue: "",
            placeholder: "产地",
            canEdit: true,
            validate: false,
            validateType: 1,
            inputType: 2,
            inputOptions: [
              {
                value: "1",
                label: "越南"
              },
              {
                value: "2",
                label: "老挝"
              }
            ],
            sentAttr: true, //是否仓库中属性
            errMsg: "* 必填项不能为空。"
          },
          {
            key: "pinji",
            value: "",
            labelValue: "",
            placeholder: "品级",
            canEdit: true,
            validate: false,
            validateType: 1,
            inputType: 2,
            inputOptions: [
              {
                value: "1",
                label: "特级"
              },
              {
                value: "2",
                label: "一级"
              }
            ],
            sentAttr: true, //是否仓库中属性
            errMsg: "* 必填项不能为空。"
          },
          {
            key: "num",
            value: "",
            placeholder: "件数",
            canEdit: true,
            validate: false,
            validateType: 2,
            pattern: "^[1-9]\\d*$",
            inputType: 1,
            maxLen: 10,
            errMsg: "* 件数为大于0的整数。"
          },
          {
            key: "weight",
            value: "",
            placeholder: "件重",
            canEdit: true,
            validate: false,
            validateType: 2,
            pattern: "(^[1-9](\\d+)?(\\.\\d{1,2})?$)|(^\\d\\.\\d{1,2}$)",
            inputType: 5,
            selectVal: "公斤",
            selectOptions: [
              {
                value: "公斤",
                label: "公斤"
              },
              {
                value: "斤",
                label: "斤"
              }
            ],
            maxLen: 10,
            width: 160,
            sentAttr: true, //是否仓库中属性
            errMsg: "* 件重为大于0且至多两位小数。"
          },
          {
            key: "tWeight",
            value: "",
            inputType: 7,
            labelValue: "",
            noValidate: true, //不做验证
            width: 70, //占用宽度
            canEdit: false,
            noSubmit: true
          },
          {
            key: "price",
            value: "",
            placeholder: "单价",
            canEdit: true,
            validate: false,
            validateType: 2,
            pattern: "(^[1-9](\\d+)?(\\.\\d{1,2})?$)|(^\\d\\.\\d{1,2}$)",
            inputType: 5,
            selectVal: "越盾",
            selectOptions: [
              {
                value: "越盾",
                label: "越盾"
              },
              {
                value: "泰铢",
                label: "泰铢"
              }
            ],
            maxLen: 10,
            width: 160,
            errMsg: "* 单价为大于0且至多两位小数"
          },
          {
            key: "purPrice",
            value: "",
            inputType: 7,
            labelValue: "",
            canEdit: false,
            noValidate: true, //不做验证
            width: 90, //占用宽度
            noSubmit: true
          },
          {
            key: "huilv",
            value: "",
            placeholder: "当天汇率",
            canEdit: true,
            validate: false,
            validateType: 3,
            pattern: "(^[1-9](\\d+)?(\\.\\d{1,2})?$)|(^\\d\\.\\d{1,2}$)",
            inputType: 1,
            maxLen: 10,
            errMsg: "* 汇率为大于0且至多两位小数。"
          },
          {
            key: "purPriceYuan",
            value: "",
            canEdit: false,
            noValidate: true, //不做验证
            width: 90, //占用宽度
            noSubmit: true
          }
        ]
      },
      //表格标题模板数据
      thData: [
        { name: "", width: 120 },
        { name: "序号", width: 80, value: "合计" },
        { name: "商品编号", width: 100 },
        { name: "商品分类", isEdit: true, isRequire: true, width: 170 },
        { name: "名称", isEdit: true, isRequire: true, width: 160 },
        { name: "工厂", isEdit: true },
        { name: "卖场", isEdit: true },
        { name: "车次", isEdit: true },
        { name: "车牌号", isEdit: true, isRequire: true },
        { name: "司机电话", isEdit: true, isRequire: true, width: 150 },
        { name: "产地", isEdit: true, isRequire: true },
        { name: "品级", isEdit: true, isRequire: true },
        { name: "件数", isEdit: true, isRequire: true, key: "num", value: "0" },
        { name: "件重", isEdit: true, isRequire: true, width: 160 },
        { name: "总重", width: 70, key: "tWeight", value: "" },
        { name: "单价", isEdit: true, isRequire: true, width: 160 },
        { name: "总价/外汇", width: 90, key: "purPrice", value: "" },
        { name: "当天汇率", isEdit: true },
        { name: "总价/元", width: 90, key: "purPriceYuan", value: "" }
      ],
      errMsgArr: [],
      tableData: [],
      cateArr: [],
      subData: [],
      proList: [],
      selectSent: [],
      loading: false,
      open: false,
      form: {
        proName: ""
      }
    };
  },

  created() {
    this.cateList();
    this._initTableData();
  },

  methods: {
    async cateList() {
      try {
        const {
          data: {
            cmdtClassTree: { children }
          },
          code
        } = await getProCate({});
        if (code === 200) {
          this.cateArr = this._initDataArr(this._delEmptyVal(children));
        }
      } catch (err) {
        console.log(err);
      }
    },

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
          this._handelPrice(this.tableData[index]);
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
                h("li", null, this.errMsgArr[3]),
                h("li", null, this.errMsgArr[4]),
                h("li", null, this.errMsgArr[5])
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

    /* 表格中select选择触发验证 */
    selectChange(index, i) {
      const item = this.tableData[index].content;
      item[i].validate = false;
      item[i].labelValue = item[i].inputOptions.find(v => {
        return v.value === item[i].value;
      }).label;
    },

    /* 联动select赋值*/
    async handelCascader(val, index, i) {
      const item = this.tableData[index].content;
      item[i].validate = false;
      item[i].value = val;
      await this.$nextTick();
      item[i].labelValue = this.$refs[`elCascader${index}`][0]["presentText"];
    },

    /* 模拟提交展示提交数据*/
    creatOrder() {
      return this._deinitData(this.tableData);
    },

    sentSelect() {
      this.selectSent = [];
      const procodeArr = this.tableData.map(v => {
        return v.content[1].value;
      });
      this.proList = [
        {
          orderBy: 1,
          procode: "115541999",
          cate: "02000020",
          cateName: "橙橘柚柑 / 柑",
          name: "越南精品芒果",
          address: "2",
          voAddress: "老挝",
          pinji: "1",
          voPinji: "特级",
          weight: "121",
          weightUnit: "公斤"
        },
        {
          orderBy: 2,
          procode: "115541922",
          cate: "02000020",
          cateName: "橙橘柚柑 / 柑",
          name: "越南精品芒果22",
          address: "1",
          voAddress: "越南",
          pinji: "2",
          voPinji: "一级",
          weight: "86",
          weightUnit: "斤"
        },
        {
          orderBy: 3,
          procode: "115541582",
          cate: "02000020",
          cateName: "橙橘柚柑 / 柑",
          name: "越南精品芒果33",
          address: "1",
          voAddress: "越南",
          pinji: "2",
          voPinji: "一级",
          weight: "89",
          weightUnit: "斤"
        },
        {
          orderBy: 4,
          procode: "115541989",
          cate: "02000020",
          cateName: "橙橘柚柑 / 柑",
          name: "越南精品芒果44",
          address: "1",
          voAddress: "越南",
          pinji: "2",
          voPinji: "一级",
          weight: "88",
          weightUnit: "斤"
        }
      ].filter(item => {
        return !procodeArr.includes(item.procode);
      });

      this.open = true;
    },

    handleQuery() {},

    resetQuery() {},

    handleSelectionChange(val) {
      this.selectSent = val;
    },

    submitForm() {
      this._addSentItem(this.selectSent);
      this.open = false;
    },

    validate(fn) {
      fn.call(this, this._deinitData(this.tableData).length > 0);
    },

    /* 添加仓库中项 */
    _addSentItem(operateItem) {
      operateItem.forEach((v, i) => {
        const modelData = deepClone(this.modelTableData);
        modelData.editAction = true;
        modelData.isSelected = false;
        modelData.isSent = true;
        modelData.content[0].idStr = this._generateStr(15);
        modelData.content.forEach(k => {
          k.value = v[k.key] || "";
          if (k.inputType === 5) {
            if (v[`${k.key}Unit`]) {
              k.selectVal = v[`${k.key}Unit`];
            }
          } else if (k.inputType === 2) {
            const selectItem = k.inputOptions.find(j => {
              return j.value === v[k.key];
            });
            k.labelValue = selectItem ? selectItem.label : "";
          } else if (k.inputType === 6) {
            k.labelValue = v[`${k.key}Name`];
          }
        });
        this.tableData.unshift(modelData);
        this._reSort(this.tableData);
      });
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

    /* 每次保存计算总重，金额 */
    _handelPrice(operateItem) {
      const idxNum = operateItem.content.findIndex(item => {
        return item.key === "num";
      });
      const idxWeight = operateItem.content.findIndex(item => {
        return item.key === "weight";
      });
      const idxTWeight = operateItem.content.findIndex(item => {
        return item.key === "tWeight";
      });
      const idxPrice = operateItem.content.findIndex(item => {
        return item.key === "price";
      });
      const idxHuilv = operateItem.content.findIndex(item => {
        return item.key === "huilv";
      });
      const idxPurPrice = operateItem.content.findIndex(item => {
        return item.key === "purPrice";
      });
      const idxPurPriceYuan = operateItem.content.findIndex(item => {
        return item.key === "purPriceYuan";
      });
      operateItem.content[idxTWeight].value = accMull(
        Number(operateItem.content[idxNum].value),
        Number(operateItem.content[idxWeight].value)
      );
      operateItem.content[
        idxTWeight
      ].labelValue = `${operateItem.content[idxTWeight].value}${operateItem.content[idxWeight].selectVal}`;
      operateItem.content[idxPurPrice].value = accMull(
        Number(operateItem.content[idxPrice].value),
        Number(operateItem.content[idxTWeight].value)
      );
      operateItem.content[
        idxPurPrice
      ].labelValue = `${operateItem.content[idxPurPrice].value}${operateItem.content[idxPrice].selectVal}`;
      if (operateItem.content[idxHuilv].value !== "") {
        operateItem.content[idxPurPriceYuan].value = accDiv(
          Number(operateItem.content[idxPurPrice].value),
          Number(operateItem.content[idxHuilv].value)
        );
      } else {
        operateItem.content[idxPurPriceYuan].value = "";
      }
    },

    /* 每次保存计算总计 */
    _handelTotolNum() {
      const weightUnitArr = this.tableData
        .filter(v => {
          return v.isSelected === true;
        })
        .map(k => {
          return k.content.find(j => {
            return j.key === "weight";
          }).selectVal;
        });
      const priceUnitArr = this.tableData
        .filter(v => {
          return v.isSelected === true;
        })
        .map(k => {
          return k.content.find(j => {
            return j.key === "price";
          }).selectVal;
        });
      const weightUnitArrInit = Array.from(new Set(weightUnitArr));
      const priceUnitArrInit = Array.from(new Set(priceUnitArr));
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
          if (item.key === "tWeight") {
            Object.assign(item, {
              value:
                weightUnitArrInit.length === 1
                  ? `${value}${weightUnitArrInit[0]}`
                  : ""
            });
          } else if (item.key === "purPrice") {
            Object.assign(item, {
              value:
                priceUnitArrInit.length === 1
                  ? `${value}${priceUnitArrInit[0]}`
                  : ""
            });
          } else {
            Object.assign(item, {
              value: value || ""
            });
          }
        });
    },

    /* 初始后端返回数据 */
    _initTableData() {
      if (this.tableInit.length === 0) {
        for (let i = 0; i < 3; i++) {
          this.addItem();
        }
      } else {
        this.tableInit.forEach((v, i) => {
          const modelData = deepClone(this.modelTableData);
          modelData.editAction = false;
          modelData.isSelected = true;
          modelData.content[0].idStr = this._generateStr(15);
          modelData.content.forEach(k => {
            k.value = v[k.key] || "";
            if (k.inputType === 5) {
              k.selectVal = v[`${k.key}Unit`];
            } else if (k.inputType === 2) {
              const selectItem = k.inputOptions.find(j => {
                return j.value === v[k.key];
              });
              k.labelValue = selectItem ? selectItem.label : "";
            } else if (k.inputType === 6) {
              k.labelValue = v[`${k.key}Name`];
            }
          });
          modelData.content[0].value = i + 1;
          this.tableData.push(modelData);
          this._handelPrice(modelData);
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
              if (j.inputType === 5) {
                Object.assign(pre, { [`${j.key}Unit`]: j.selectVal });
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
    },

    /* 类目搜索过滤 */
    _dataFilter(node, keyword) {
      if (
        node.data.enlabel.includes(keyword) ||
        node.data.enlabel.includes(keyword.toLowerCase()) ||
        node.data.label.includes(keyword)
      ) {
        return true;
      } else {
        return false;
      }
    },

    /* 递归查找类目中的标签项添加标签数组 */
    _initDataArr(arr) {
      return arr.map(item => {
        const idx =
          item.children &&
          item.children.findIndex(v => {
            return v.istag === "Y";
          });
        if (idx === null) {
          return item;
        }
        if (idx !== -1) {
          const tagArr = item.children.map(j => {
            return Object.assign(j, { inputVal: "" });
          });
          return Object.assign(item, { tagArr, children: null });
        } else {
          this._initDataArr(item.children);
          return item;
        }
      });
    },

    /* children数组为空赋值null*/
    _delEmptyVal(arr) {
      return arr.map(item => {
        if (item.children && item.children.length === 0) {
          return Object.assign(item, { children: null });
        } else {
          this._delEmptyVal(item.children);
          return item;
        }
      });
    }
  }
};
</script>
