<template>
  <div class="personalrecom mw-760">
    <div class="ratitaionChart">
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="item in swiperList" :key="item.imageUrl">
          <img
            :src="item.imageUrl"
            class="medium img img-h"
            @click="open(item.url)"
          />
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="song-list">
      <h2 class="font-20 font-bold pointer" @click="$router.push('/songsheet')">
        热门推荐 <i class="iconfont icon-arrow-right"></i>
      </h2>
      <ImgList
        :imgList="imageList"
        @clickItem="toSongListDetail"
        type="playlist"
      >
        <template v-slot="{ item }">
          <div class="text-wrap">
            {{ item.name }}
          </div>
        </template>
      </ImgList>
    </div>
  </div>
</template>

<script>
import ImgList from "@/components/List/ImgList.vue";
import { getBanner } from "@/api/api-other";
import { getPersonalized } from "@/api/api-songlist";
export default {
  data() {
    return {
      swiperList: [],
      imageList: [],
    };
  },
  methods: {
    async getSwiperList() {
      const res = await getBanner();
      if (res.code !== 200) return;
      this.swiperList = Object.freeze(res.banners);
    },
    async getImgList(limit) {
      const res = await getPersonalized(limit);
      if (res.code !== 200) return;
      console.log(res);
      this.imageList = Object.freeze(res.result);
    },
    open(url) {
      console.log(url);
      if (url !== null) window.open(url);
    },
    toSongListDetail(id) {
      if (typeof id === "number")
        this.$router.push({ path: "/songlistdetail/" + id });
    },
  },
  components: {
    ImgList,
  },
  created() {
    window.sessionStorage.setItem("navActive", "/personalrecom");
    this.getSwiperList();
    this.getImgList(10);
  },
};
</script>

<style lang="less" scoped>
.ratitaionChart {
  max-width: 1100px;

  margin: 0 auto;
  .el-carousel__container {
    display: flex;
    overflow: hidden;
  }
  .el-carousel__item {
    border-radius: 8px;
  }
  .el-carousel__item--card.is-active {
    width: 550px;
  }
}
</style>
