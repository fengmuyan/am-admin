<template>
  <el-form-item :label="`${item.name}：`" :rules="rules" :prop="item.name">
    <el-checkbox-group v-if="item.type==='1'" v-bind="$attrs" v-on="$listeners">
      <el-checkbox v-for="(v, i) in item.valList" :label="v" :key="i">{{v}}</el-checkbox>
    </el-checkbox-group>
    <el-radio-group v-if="item.type==='2'" v-bind="$attrs" v-on="$listeners">
      <el-radio v-for="(v, i) in item.valList" :label="v" :key="i">{{v}}</el-radio>
    </el-radio-group>
    <el-input
      v-if="item.type==='3'"
      v-bind="$attrs"
      v-on="$listeners"
      :placeholder="'请输入'+item.name"
      clearable
      style="width:400px"
    ></el-input>
    <el-date-picker
      v-if="item.type==='4'"
      v-bind="$attrs"
      v-on="$listeners"
      type="date"
      placeholder="选择日期"
      style="width:400px"
      format="yyyy-MM-dd"
    ></el-date-picker>
  </el-form-item>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    item: {
      type: Object,
      required: true
    },
    rules: {
      type: Array,
      required: true
    }
  }
};
</script>