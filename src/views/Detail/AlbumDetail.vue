<template>
  <div class="albumdetail mtop-20 mw-760">
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
        <div class="Album-detail">
          <!-- 歌单封面 -->
          <div class="Album-cover">
            <img class="img img-h img-radius-8 img-border" v-lazy="imgUrl" />
          </div>
          <!-- 专辑信息 -->
          <div class="Album-info">
            <div class="Album-info-top">
              <!-- 标签 -->
              <Tag text="专辑" />
              <!-- 标题 -->
              <span class="mleft-12 font-20 font-bold">{{
                albumInfo.name
              }}</span>
            </div>
            <!-- 按钮栏 -->
            <div class="buttons">
              <!-- 播放全部 -->
              <button class="btn btn-red" @click="playAll">
                <i class="iconfont icon-bofang"></i>
                <span class="btn-text">播放全部</span>
              </button>
              <!-- 点击收藏 -->
              <span class="collection">
                <!-- 未收藏 -->
                <button
                  v-if="!isSub"
                  class="btn btn-white mleft-10"
                  @click="subAlbum(1)"
                >
                  <i class="el-icon-folder-add">&nbsp;</i>
                  <span class="btn-text"
                    >收藏({{ subCount | countFormat }})</span
                  >
                </button>
                <!-- 已收藏 -->
                <button
                  v-if="isSub"
                  class="btn btn-white mleft-10"
                  @click="subAlbum(0)"
                >
                  <i class="el-icon-folder-checked">&nbsp;</i>
                  <span class="btn-text"
                    >已收藏({{ subCount | countFormat }})</span
                  >
                </button>
              </span>

              <!-- 点击分享(暂时无法使用)-->
              <button class="btn btn-white mleft-10">
                <i class="iconfont icon-fenxiang">&nbsp;</i>
                <span class="btn-text"
                  >分享({{ shareCount | countFormat }})</span
                >
              </button>
            </div>

            <div class="author">
              <span>歌手：</span>
              <span
                class="pointer author-name"
                v-for="a in albumInfo.artists"
                :key="a.id"
                @click="toArtistDetail(a.id)"
                >{{ a.name }}
              </span>
            </div>
            <div class="publishtime">
              <span>播放：</span>
              <span class="createtime">{{
                albumInfo.publishTime | dateFormat
              }}</span>
            </div>
          </div>
        </div>
        <div class="albumlist-topbar">
          <!-- 导航栏 -->
          <div class="navbar">
            <TabMenu
              :menuList="['歌曲列表', `评论(${commentCount})`, '专辑详情']"
              @menuClick="setIndex"
              defaultactive="0"
            />
          </div>
        </div>
        <div class="musiclist" v-if="menuIndex === '0'">
          <MusicList :tableData="list" ref="listRef" />
        </div>
        <div class="comment-tab" v-if="menuIndex === '1'">
          <CommentList :id="id" :type="3" />
        </div>
        <div v-if="menuIndex === '2'">
          <div class="font-bold">专辑介绍</div>
          <div class="description" v-if="description.length !== 0">
            <p v-for="(item, index) in description" :key="index">
              {{ item }}
            </p>
          </div>
          <div v-else style="text-align: center">没有专辑详情</div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getAlbumDetail, getAlbumDynamic, setAlbumSub } from "@/api/api-album";
import Tag from "@/components/Tag.vue";
import TabMenu from "@/components/Tabmenu.vue";
import MusicList from "@/components/List/MusicList.vue";
import CommentList from "@/components/comment/CommentList.vue";
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      isSub: false,
      menuIndex: "0",
      list: [],
      albumInfo: {},
      shareCount: 0,
      commentCount: 0,
      subCount: 0,
    };
  },
  created() {
    this.getAlbumDetail();
    this.getAlbumDynamic();
  },
  components: {
    Tag,
    TabMenu,
    MusicList,
    CommentList,
  },
  computed: {
    ...mapState(["isLogin"]),
    imgUrl() {
      return this.albumInfo.picUrl
        ? this.albumInfo.picUrl + "?param=300y300"
        : "";
    },
    description() {
      return this.albumInfo.description
        ? this.albumInfo.description.split("\n")
        : [];
    },
  },
  methods: {
    playAll() {
      this.$refs.listRef.playMusicAll();
    },
    setIndex(index) {
      console.log(index);
      this.menuIndex = index;
    },
    async getAlbumDetail() {
      const res = await getAlbumDetail(this.id);
      if (res.code !== 200) return;
      console.log(res);
      this.list = Object.freeze(res.songs);
      this.albumInfo = Object.freeze(res.album);
    },
    async getAlbumDynamic() {
      const res = await getAlbumDynamic(this.id);
      if (res.code !== 200) return;
      this.isSub = res.isSub;
      this.shareCount = res.shareCount;
      this.commentCount = res.commentCount;
      this.subCount = res.subCount;
    },
    toArtistDetail(id) {
      if (typeof id === "number")
        this.$router.push({ path: "/singerdetail/" + id });
    },
    //收藏和取消收藏
    async subAlbum(type) {
      if (!this.isLogin) return this.$message.warning("需要登录");
      let cancel = false;
      if (this.isSub)
        await this.$confirm("确认取消收藏吗？", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确认",
          cancelButtonText: "放弃",
        })
          .then(() => {
            cancel = false;
          })
          .catch((action) => {
            cancel = true;
            this.$message({
              type: "info",
              message: action === "cancel" ? "取消" : "出错",
            });
          });
      if (cancel) return;
      const res = await setAlbumSub(this.id, type);
      if (res.code !== 200) return;
      this.isSub = !this.isSub;
      if (type == 1) this.$message.success("收藏成功");
      else this.$message.success("取消收藏成功");
    },
  },
};
</script>

<style lang="less" scoped>
.Album-detail {
  display: flex;
  .Album-cover {
    width: 180px;
    min-width: 180px;
    height: 180px;
  }
  .Album-info {
    margin-left: 20px;
    .buttons {
      margin: 5px 0;
    }
    .author {
      margin: 25px 0;
      display: flex;
      height: 20px;
      .author-name {
        color: #3771dd;
        &::after {
          display: inline;
          color: #000;
          margin: 4px;
          content: "/";
        }
        &:last-child::after {
          content: "";
        }
      }
    }
  }
}
.description {
  text-indent: 2em;
  white-space: pre-line;
}
</style>
