<template>
  <div class="songsheet">
    <div class="boutique" v-if="hasTopInfo">
      <img :src="topInfo.coverImgUrl" class="back-img" />
      <img :src="topInfo.coverImgUrl" class="img-80" />
      <div class="boutique-info">
        <div>
          <button class="circle-btn">
            <i class="iconfont icon-huiyuanhuangguanguanjun-xianxing"></i>
            精品歌单
          </button>
        </div>
        <div class="mtop-10">
          <span>欧美|我们听过的那首歌,原来采样了它</span>
        </div>
      </div>
    </div>
    <div class="songsheet-tag mtop-10">
      <!-- 标签弹出层容器 -->
      <div class="left">
        <!-- 按钮 -->
        <button class="circle-btn tag-btn pointer" @click="openlayer">
          华语 <i class="el-icon-arrow-right"></i>
        </button>
        <!-- 标签弹出层 -->
        <div class="layer" v-show="showLayer" ref="layerRef">
          <div class="h-80">全部歌单</div>
          <div class="div-line"></div>
          <div class="tag-list" v-for="(item, index) in allCats" :key="index">
            <div class="tag-title">
              <template v-if="index === 0">
                <i class="iconfont icon-diqiuquanqiu font-24"></i
                ><span class="mleft-6">语种</span>
              </template>
              <template v-if="index === 1">
                <i class="iconfont icon-fengge font-24"></i
                ><span class="mleft-6">风格</span>
              </template>
              <template v-if="index === 2">
                <i class="iconfont icon-xiazai47 font-24"></i
                ><span class="mleft-6">场景</span>
              </template>
              <template v-if="index === 3">
                <i class="iconfont icon-smiling font-24"></i
                ><span class="mleft-6">情感</span>
              </template>
              <template v-if="index === 4">
                <i class="iconfont icon-zhuti font-24"></i>
                <span class="mleft-6">主题</span>
              </template>
            </div>
            <ul>
              <li v-for="cat in item" :key="cat.name">
                <button
                  @click="changefromAll(cat.name)"
                  class="no-btn"
                  :class="{ isActive: cat.isActive }"
                >
                  {{ cat.name }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 热门标签 -->
      <div class="songsheet-tag-right">
        <ul>
          <li
            class="mright-10 font-12"
            v-for="item in hotCats"
            :key="item.id"
            :class="{ isActive: item.isActive }"
            @click="changeCat(item.name)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="songsheet-list">
      <ImgList
        v-loading="isLoading"
        element-loading-text="拼命加载中"
        :imgList="playList"
        @clickItem="toSongListDetail"
        type="playlist"
      >
        <template v-slot="{ item }">
          <div class="text-hidden">
            {{ item.name }}
          </div>
        </template>
      </ImgList>
      <div
        class="pagination flex_center"
        style="margin-top: 10px; width: 100%"
        v-show="!isLoading"
      >
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pageInfo.currentPage"
          :page-size="50"
          layout="prev, pager, next"
          :total="pageInfo.total"
          background
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAllCat,
  getHotCat,
  getBoutique,
  getPlayListByCat,
} from "@/api/api-songlist";
import ImgList from "@/components/List/ImgList.vue";
export default {
  data() {
    return {
      showLayer: false,
      hasTopInfo: true,
      isLoading: true,
      hotCats: [],
      allCats: [],
      playList: [],
      tagBtn: "华语",
      topInfo: {},
      queryInfo: {
        limit: 50,
        order: "hot",
        cat: "华语",
        offset: 0,
      },
      pageInfo: {
        total: 0,
        currentPage: 1,
      },
    };
  },
  components: {
    ImgList,
  },
  created() {
    this.getHotCats();
    this.getSongSheet();
  },
  methods: {
    //若不使用异步将 触发关闭事件绑定到window 给包含,会导致点击按钮直接触发关闭.
    openlayer() {
      if (this.showLayer) return;
      this.getAllCats();
      this.showLayer = true;
      setTimeout(() => {
        window.addEventListener("click", this.closeLayer);
      }, 10);
    },
    closeLayer(e) {
      if (!this.$refs.layerRef) return;
      if (!this.$refs.layerRef.contains(e.target)) {
        console.log("触发关闭");
        this.showLayer = false;
        window.removeEventListener("click", this.closeLayer);
      }
    },
    //从弹出层点击标签
    changefromAll(name) {
      this.changeCat(name);
      this.showLayer = false;
      window.removeEventListener("click", this.closeLayer);
    },
    //热门点击标签
    changeCat(name) {
      this.queryInfo.offset = 0;
      this.pageInfo.currentPage = 1;
      this.queryInfo.cat = name;
      this.tagBtn = name;
      this.hotCats.forEach((item) => {
        if (item.isActive) item.isActive = false;
        if (item.name === name) item.isActive = true;
      });
      this.getSongSheet();
    },
    toSongListDetail(id) {
      if (typeof id === "number")
        this.$router.push({ path: "/songlistdetail/" + id });
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.queryInfo.offset = (val - 1) * 50;
      document.querySelector(".body").scrollTop = 0;
      this.getSongSheet();
    },
    //获得热门歌单类型
    async getHotCats() {
      const res = await getHotCat();
      if (res.code !== 200) return;
      res.tags.forEach((item) => {
        item.isActive = false;
        if (this.tagBtn === item.name) item.isActive = true;
      });
      this.hotCats = res.tags;
    },
    //获得所有歌单分类
    async getAllCats() {
      const res = await getAllCat();
      if (res.code !== 200) return;
      this.allCats = [];
      res.sub.forEach((item) => {
        item.isActive = false;
        if (this.tagBtn === item.name) item.isActive = true;
      });
      for (let i = 0; i < 5; i++) {
        this.allCats.push(
          Object.freeze(res.sub.filter((item) => item.category === i))
        );
      }
    },
    //根据分类获取歌单
    async getSongSheet() {
      this.isLoading = true;
      this.getTopSongSheet(this.queryInfo.cat);
      const res = await getPlayListByCat(this.queryInfo);
      if (res.code !== 200) return;
      this.playList = Object.freeze(res.playlists);
      console.log(this.playList);
      this.pageInfo.total = res.total;
      this.isLoading = false;
    },
    //获取精品歌单
    async getTopSongSheet(val) {
      const res = await getBoutique(val, 1);
      if (res.code !== 200) return;
      if (res.playlists.length === 0) {
        this.topInfo = {};
        this.hasTopInfo = false;
        return;
      }
      this.topInfo = Object.freeze(res.playlists[0]);
      this.hasTopInfo = true;
    },
  },
};
</script>

<style lang="less" scoped>
.boutique {
  background-color: rgba(0, 0, 0, 0);
  height: 200px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  .back-img {
    position: absolute;
    top: -400px;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    width: 100%;
    filter: blur(45px);
  }

  .img-80 {
    margin: 0 20px;
    border-radius: 6px;
    z-index: 2;
  }

  .boutique-info {
    z-index: 2;
  }
}
/* 标签激活的样式 */
.isActive {
  background-color: #fdf5f5;
  color: #ec4141;
  border-radius: 13px;
}

/* 打开全部标签的按钮 */
.tag-btn {
  color: #343434;
  border-color: #d8d8d8;
  padding: 0 30px;

  &:hover {
    background-color: #f2f2f2;
  }
}
.songsheet-tag {
  display: flex;
  justify-content: space-between;
  .left {
    position: relative;
    .layer {
      position: absolute;
      width: 720px;
      min-height: 400px;
      top: 40px;
      left: 0px;
      background-color: #fff;
      z-index: 99;
      box-shadow: 0 0 8px #e5e5e5;
      border-radius: 4px;
      font-size: 14px;
      .h-80 {
        line-height: 80px;
        padding-left: 20px;
      }
      .tag-list {
        display: flex;
        line-height: 26px;
        margin: 10px 0px 30px 0;

        .tag-title {
          width: 120px;
          height: 26px;
          color: #cfcfcf;
          margin: 0 40px 0 20px;

          .iconfont {
            color: #b1b1b1;
          }
        }
        ul {
          display: flex;
          flex-wrap: wrap;
          width: 500px;
          li {
            width: 100px;
            height: 26px;

            .no-btn {
              cursor: pointer;
              padding: 4px 10px;

              &:hover {
                color: #ec4141;
              }
            }
          }
        }
      }
    }
  }
  .songsheet-tag-right {
    ul {
      display: flex;
      align-items: center;
      height: 26px;
      li {
        height: 26px;
        line-height: 26px;
        padding: 0 5px;
        cursor: pointer;
      }
    }
  }
}
</style>
