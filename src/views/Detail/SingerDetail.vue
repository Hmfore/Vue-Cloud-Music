<template>
  <div class="singerdetail mtop-20 mw-760">
    <el-skeleton :loading="isLoading" animated>
      <!-- 加载界面 -->
      <template slot="template" class="mw-760">
        <el-skeleton-item variant="image" style="width: 180px; height: 180px" />
        <div style="padding-top: 14px">
          <el-skeleton-item variant="text" style="width: 50%" />
          <div
            style="
              display: flex;
              align-items: center;
              justify-items: space-between;
              margin-top: 16px;
              height: 16px;
            "
          >
            <el-skeleton-item variant="text" style="margin-right: 16px" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </div>
        </div>
      </template>
      <template>
        <div class="singer-detail">
          <!-- 歌手封面 -->
          <div class="singer-cover">
            <img class="img img-h img-radius-8 img-border" v-lazy="imgUrl" />
          </div>
          <!-- 歌手信息 -->
          <div class="singer-info">
            <div class="singer-info-top">
              <!-- 歌手名称 -->
              <span class="font-24 font-bold">{{ artistInfo.name }}</span>
            </div>
            <!-- 按钮栏 -->
            <div class="buttons">
              <!-- 点击收藏 -->
              <span class="collection">
                <!-- 未收藏 -->
                <button v-if="!isSub" class="btn btn-white">
                  <i class="el-icon-folder-add">&nbsp;</i>
                  <span class="btn-text">收藏</span>
                </button>
                <!-- 已收藏 -->
                <button v-if="isSub" class="btn btn-white mleft-10">
                  <i class="el-icon-folder-checked">&nbsp;</i>
                  <span class="btn-text">已收藏</span>
                </button>
                <button
                  class="btn btn-white mleft-10"
                  v-if="showPriMsg"
                  @click="toUserDetail"
                >
                  <i class="el-icon-user"></i>
                  个人主页
                </button>
              </span>
            </div>
            <div class="songnum">
              <span class="mright-10">单曲数：{{ artistInfo.musicSize }}</span>

              <span class="mright-10">专辑数：{{ artistInfo.albumSize }}</span>

              <span class="mright-10">MV数：{{ artistInfo.mvSize }}</span>
            </div>
          </div>
        </div>

        <div class="albumlist-topbar">
          <!-- 导航栏 -->
          <div class="navbar">
            <TabMenu
              :menuList="['专辑', 'MV', '歌手详情', '相似歌手']"
              @menuClick="setIndex"
              :defaultactive="tabIndex"
            />
          </div>
        </div>
        <!-- 专辑 -->
        <div v-show="tabIndex === '0'">
          <div style="height: 200px" v-if="isLoading" v-loading="isLoading">
            加载中...
          </div>
          <template v-else>
            <AlbumList
              :list="topList"
              v-if="topList.length !== 0"
              title="热门50首"
              style="margin-bottom: 50px"
            />
            <AlbumList
              style="margin-bottom: 50px"
              v-for="(item, index) in albumList"
              :key="index"
              :albumInfo="item.album"
              :list="item.songs"
              :title="item.name"
            />
          </template>
        </div>
        <!-- MV -->
        <div v-show="tabIndex === '1'">
          <div style="height: 200px" v-if="isLoading" v-loading="isLoading">
            加载中...
          </div>
          <div v-else-if="mvList.length === 0">没有MV</div>
          <MvList
            v-else
            :disabled="true"
            :dataList="mvList"
            :isLoading="mvLoading"
          >
            <template v-slot="{ item }">
              <div class="text-wrap">
                {{ item.name }}
              </div>
            </template>
          </MvList>
        </div>
        <!-- 歌手详情 -->
        <div v-show="tabIndex === '2'">
          <div style="height: 200px" v-if="isLoading" v-loading="isLoading">
            加载中...
          </div>
          <div v-else-if="introduction.length === 0">没有歌手详情</div>
          <template v-else>
            <div class="mtop-20" v-for="text in introduction" :key="text.ti">
              <h2 class="font-bold font-14">{{ text.ti }}</h2>
              <div
                class="my-pre font-14"
                v-for="(t, index) in text.txt"
                :key="index"
              >
                <p>{{ t }}</p>
              </div>
            </div>
          </template>
        </div>
        <!-- 相似歌手 -->
        <div v-show="tabIndex === '3'">
          <div style="height: 200px" v-if="isLoading" v-loading="isLoading">
            加载中...
          </div>
          <div v-else-if="sameArtistList.length === 0">没有相似歌手</div>
          <ImgList
            v-else
            @clickItem="toArtistDetail"
            :imgList="sameArtistList"
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
    </el-skeleton>
  </div>
</template>

<script>
import TabMenu from "@/components/Tabmenu.vue";
import MvList from "@/components/List/MvList.vue";
import AlbumList from "@/components/List/AlbumList.vue";
import ImgList from "@/components/List/ImgList.vue";
import { getAlbumDetail } from "@/api/api-album";
import {
  getArtistDetail,
  getIntro,
  getArtistTop,
  getArtistAlbum,
  getArtistMv,
  getArtistSame,
} from "@/api/api-singer";
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    TabMenu,
    AlbumList,
    ImgList,
    MvList,
  },
  data() {
    return {
      artistInfo: {
        //歌手的信息
        name: "",
        cover: "",
        briefDesc: "",
        albumSize: 0,
        musicSize: 0,
        mvSize: 0,
      },
      showPriMsg: false,
      topList: [], //热门50首
      albumList: [], //专辑信息
      introduction: [], //歌手详细描述,
      userId: 0, //歌手用户ID
      mvList: [], //歌手MV列表
      sameArtistList: [], //相似歌手
      isLoading: false,
      mvLoading: true,
      subList: [], //收藏的歌手列表
      tabIndex: "0", //tab页的索引值
    };
  },
  computed: {
    imgUrl() {
      return this.artistInfo.cover
        ? this.artistInfo.cover + "?param=300y300"
        : "";
    },
    isSub() {
      return this.subList.findIndex((item) => item.id == this.id) !== -1;
    },
  },
  created() {
    this.getInfo();
    this.getTop();
    this.getAlbum();
  },
  watch: {
    id() {
      this.getInfo();
      /* 在相似歌手页切换歌手，重置前三个tab的数据，且重新获取相似歌手 */
      this.getSame();
      this.topList = [];
      this.albumList = [];
      this.introduction = [];
      this.mvList = [];
    },
  },
  methods: {
    toUserDetail() {
      if (this.userId !== 0 && this.showPriMsg)
        this.$router.push("/userdetail/" + this.userId);
    },
    setIndex(index) {
      this.tabIndex = index;
      if (index === "2") {
        if (this.introduction.length !== 0) return;
        console.log("desc");
        this.isLoading = true;
        this.getIntroduction();
      } else if (index === "0") {
        console.log("album");
        if (this.albumList.length !== 0) return;
        this.isLoading = true;
        this.getTop();
        this.getAlbum();
      } else if (index === "1") {
        console.log("mv");
        if (this.mvList.length !== 0) return;
        this.isLoading = true;
        this.getArtistMv();
      } else if (index === "3") {
        console.log("same");
        if (this.sameArtistList.length !== 0) return;
        this.isLoading = true;
        this.getSame();
      }
    },
    toArtistDetail(id) {
      if (typeof id === "number")
        this.$router.push({ path: "/singerdetail/" + id });
    },
    //获取歌手信息
    async getInfo() {
      const res = await getArtistDetail(this.id);
      if (res.code !== 200) return;
      console.log("歌手信息", res);
      this.artistInfo = Object.freeze(res.data.artist);
      this.showPriMsg = Object.freeze(res.data.showPriMsg);
      if (this.showPriMsg) this.userId = res.data.user.userId;
    },
    //获取热门50首
    async getTop() {
      const res = await getArtistTop(this.id);
      if (res.code !== 200) return;
      this.topList = Object.freeze(res.songs);
      this.isLoading = false;
    },
    // 获取歌手发布的专辑列表
    async getAlbum() {
      const res = await getArtistAlbum(this.id);
      if (res.code !== 200) return;
      console.log("专辑列表", res);
      this.albumList = [];
      res.hotAlbums.forEach((item) => {
        this.getAlbumDetail(item.id, item.name);
      });
    },
    // 获取专辑详情
    async getAlbumDetail(id, name) {
      const res = await getAlbumDetail(id);
      if (res.code !== 200) return;
      res.name = name;
      this.albumList.push(Object.freeze(res));
    },
    //获取歌手MV
    async getArtistMv() {
      this.mvLoading = true;
      const res = await getArtistMv(this.id);
      if (res.code !== 200) return;
      console.log("MV", res);
      res.mvs.forEach((item) => {
        item.cover = item.imgurl;
      });
      this.mvList = Object.freeze(res.mvs);
      this.mvLoading = false;
      this.isLoading = false;
    },
    //获取歌手详情
    async getIntroduction() {
      const res = await getIntro(this.id);
      if (res.code !== 200) return;
      console.log(res);
      res.introduction.forEach((item) => {
        item.txt = item.txt.split("\n");
      });
      console.log(res.introduction);
      if (res.briefDesc)
        res.introduction.unshift({
          ti: "个人简介",
          txt: [res.briefDesc],
        });
      this.introduction = Object.freeze(res.introduction);
      this.isLoading = false;
    },
    //获取相似歌手(需要登录)
    async getSame() {
      const res = await getArtistSame(this.id);
      if (res.code !== 200) return;
      console.log(res);
      this.sameArtistList = res.artists;
      this.isLoading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.singer-detail {
  display: flex;
  .singer-cover {
    width: 180px;
    min-width: 180px;
    height: 180px;
  }
  .singer-info {
    margin-left: 20px;
    .buttons {
      margin: 15px 0;
    }
  }
}
.text-wrap {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.my-pre {
  text-indent: 2em;
}
</style>
