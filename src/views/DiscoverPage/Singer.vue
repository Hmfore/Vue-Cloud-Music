<template>
  <div class="singer mw-760">
    <div class="options">
      <div class="radio-list">
        <span class="w-60">语种：</span>
        <el-radio-group v-model="queryInfo.area">
          <el-radio :label="ar.id" v-for="ar in artistData.area" :key="ar.id">{{
            ar.value
          }}</el-radio>
        </el-radio-group>
      </div>
      <div class="radio-list">
        <span class="w-60">分类：</span>
        <el-radio-group v-model="queryInfo.type">
          <el-radio :label="tp.id" v-for="tp in artistData.type" :key="tp.id">{{
            tp.value
          }}</el-radio>
        </el-radio-group>
      </div>
      <div class="radio-list">
        <span class="w-60">筛选：</span>
        <el-radio-group v-model="queryInfo.initial">
          <el-radio
            :label="it.id"
            v-for="it in artistData.initial"
            :key="it.id"
            >{{ it.value }}</el-radio
          >
        </el-radio-group>
      </div>
    </div>
    <ImgList
      @loadMore="load"
      @clickItem="toArtistDetail"
      :infinite="true"
      :imgList="artistList"
      :hasMore="hasMore"
      type="artist"
      :isLoading="isLoading"
    >
      <template v-slot="{ item }">
        <div class="text-hidden">
          {{ item.name }}
        </div>
      </template>
    </ImgList>
  </div>
</template>

<script>
import ImgList from "@/components/List/ImgList.vue";
const artistData = require("@/assets/json/singerData");
import { getArtistList } from "@/api/api-singer";
export default {
  data() {
    return {
      queryInfo: {
        limit: 30,
        area: -1,
        offset: 0,
        type: -1,
        initial: "-1",
      },
      hasMore: true,
      artistData,
      artistList: [],
      isLoading: false,
      mode: "first",
    };
  },
  components: {
    ImgList,
  },
  created() {
    this.getArtistList();
  },
  watch: {
    queryInfo: {
      deep: true,
      handler() {
        this.getArtistList();
      },
    },
  },
  methods: {
    async getArtistList() {
      this.isLoading = true;
      if (this.mode == "first") this.queryInfo.offset = 0;
      const res = await getArtistList(this.queryInfo);
      if (res.code !== 200) return;
      if (this.mode === "first") {
        this.artistList = res.artists;
      } else {
        this.artistList.push(...res.artists);
      }
      this.hasMore = res.more;
      if (this.mode === "first") {
        this.isLoading = false;
      } else {
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      }
    },
    //无限滚动条触发事件节流
    load(num) {
      if (this.isLoading) return;
      if (!this.hasMore) return this.$message.error("已经到底了");
      this.mode = "more";
      this.queryInfo.offset = num + 30;
    },

    toArtistDetail(id) {
      if (typeof id === "number")
        this.$router.push({ path: "/singerdetail/" + id });
    },
  },
};
</script>

<style lang="less" scoped>
.radio-list {
  display: flex;
  flex-wrap: wrap;
  line-height: 20px;
  margin-top: 10px;
  span {
    height: 30px;
    line-height: 30px;
  }
  .el-radio-group {
    width: 80%;
    .el-radio {
      width: 60px;
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
