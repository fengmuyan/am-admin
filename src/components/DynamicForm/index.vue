<template>
  <el-form label-width="110px" :model="dynamicForm" :ref="dynamicForm">
    <dynamic-form-item
      v-for="item in value"
      :key="item.name"
      :item="item"
      :value="item.values"
      v-on:input="handleInput($event,item.name,item.type)"
      :rules="item.required === 'Y'?initRules(item.type,item.name,item.validexp):[]"
      :disabled="disabled"
    />
  </el-form>
</template>

<script>
import DynamicFormItem from "@/components/DynamicFormItem";

export default {
  inheritAttrs: false,
  components: {
    DynamicFormItem
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    isHaveTable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dynamicForm: {}
    };
  },
  created() {
    this.dynamicForm = this.value.reduce((pre, item) => {
      return Object.assign(pre, { [item.name]: item.values });
    }, {});
  },
  methods: {
    handleInput(val, name, type) {
      const { value, isHaveTable } = this;
      const idx = value.findIndex(item => item.name === name);
      this.dynamicForm[name] = val;
      value[idx].values = val;
      if (isHaveTable) {
        const isTable =
          value
            .filter(item => {
              return item.type === "1";
            })
            .findIndex(item => item.values.length === 0) === -1;
        this.$emit("table-show", isTable);
      }
      if (Number(type) === 1) {
        this.$emit("checkbox", value);
      }
      this.$emit("input", value);
    },

    initRules(type, name, validexp) {
      if (type === "3") {
        return [
          { required: true, message: `请输入${name}`, trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              let patter = new RegExp(validexp);
              if (!patter.test(value)) {
                callback(new Error("请输入正确格式！"));
              } else {
                callback();
              }
            },
            trigger: ["change", "blur"]
          }
        ];
      } else if (type === "2") {
        return [
          { required: true, message: `请选择${name}`, trigger: "change" }
        ];
      } else if (type === "1") {
        return [
          {
            type: "array",
            required: true,
            message: `请至少选择一个${name}`,
            trigger: "change"
          }
        ];
      } else if (type === "4") {
        return [
          {
            type: "string",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ];
      }
    }
  }
};
</script>
