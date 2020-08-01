<template>
  <div class="app-container">
    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-table v-loading="loading" :data="list">
        <el-table-column label="序号" prop="order" width="60" />
        <el-table-column label="商品编码" prop="cmdtcode" />
        <el-table-column label="修改前库存" prop="beforeNum" />
        <el-table-column label="修改库存值" prop="nowNum" />
        <el-table-column label="备注" prop="remarks" width="300" show-overflow-tooltip/>
        <el-table-column label="修改人" prop="createBy" />
        <el-table-column label="修改时间" prop="createtime" />
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryForm.pageNum"
        :limit.sync="queryForm.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { getStoreEditList } from "@/api/purchase";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const {
          code,
          data: { content, totalSize }
        } = await getStoreEditList({
          rtcmdtcode: this.$route.params.code
        });
        this.loading = false;
        if (code === 200) {
          this.list = content.map((item, index) => {
            return Object.assign(item, { order: index + 1 });
          });
          this.total = totalSize;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    }
  }
};
</script>