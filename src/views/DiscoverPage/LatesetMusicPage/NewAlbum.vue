<template>
  <div class="newalbum">
    <el-skeleton v-show="isLoading" :rows="6" animated />
    <div class="newalbum-list" v-show="!isLoading">
      <div class="aside-title">
        <div class="aside-title-content">本周新碟</div>
      </div>
      <div class="data-list">
        <ImgList
          @clickItem="toAlbumDetail"
          :imgList="albumList"
          type="album"
          :isLoading="isLoading"
        >
          <template v-slot="{ item }">
            <div class="text-hidden">
              {{ item.name }}
            </div>
          </template>
        </ImgList>
      </div>
    </div>
  </div>
</template>

<script>
import ImgList from "@/components/List/ImgList.vue";
import { getNewAlbum } from "@/api/api-album.js";
export default {
  data() {
    return {
      isLoading: false,
      queryInfo: {
        limit: 30,
        offset: 0,
        area: "ALL",
        type: "new",
        month: "",
        year: "",
      },
      albumList: [],
    };
  },
  components: {
    ImgList,
  },
  created() {
    this.getNewAlbum();
  },
  methods: {
    toAlbumDetail(id) {
      console.log("被点击");
      if (typeof id === "number")
        this.$router.push({ path: "/albumdetail/" + id });
    },
    async getNewAlbum() {
      this.isLoading = true;
      const res = await getNewAlbum(this.queryInfo);
      if (res.code !== 200) return;
      console.log(res);
      if (Object.hasOwnProperty.call(res, "weekData"))
        this.albumList = Object.freeze(res.weekData);
      else this.albumList = [];
      this.isLoading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.newalbum-list {
  position: relative;
  margin-left: 46px;
  .aside-title {
    position: absolute;
    left: -46px;
    width: 46px;
    font-size: 23px;
    top: 10px;
  }
}
</style>
