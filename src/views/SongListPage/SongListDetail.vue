<template>
  <!-- 歌单详情页 -->
  <div class="mtop-20">
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
        <!-- 歌单封面与信息 -->
        <div class="songlist-detail">
          <!-- 歌单封面 -->
          <div class="songlist-cover">
            <img
              class="img img-h img-radius-8 img-border"
              v-lazy="info.coverImgUrl"
            />
          </div>
          <!-- 歌单信息 -->
          <div class="songlist-info">
            <div class="songlist-info-top">
              <!-- 标签 -->
              <Tag text="歌单" />
              <!-- 标题 -->
              <span class="mleft-12 font-20 font-bold">{{ info.name }}</span>
            </div>
            <!-- 歌单作者和创建日期 -->
            <div class="songlist-info-author">
              <!--作者头像(点击进入用户详情) -->
              <div class="author-img pointer" @click="toUserDetail(creator)">
                <img class="img img-h" v-lazy="creator.avatarUrl" alt="" />
              </div>
              <div class="author-info" @click="toUserDetail(creator)">
                <!-- 作者昵称(点击进入用户详情) -->
                <span class="mright-10 pointer" style="color: #0b58b0">{{
                  creator.nickname
                }}</span>
                <!-- 创建日期 -->
                <span class="createtime">{{
                  info.createTime | dateFormat
                }}</span>
              </div>
            </div>
            <!-- 按钮栏 -->
            <div class="buttons">
              <!-- 播放全部 -->
              <button class="btn btn-red">
                <i class="iconfont icon-bofang"></i>
                <span class="btn-text">播放全部</span>
              </button>
              <!-- 点击收藏 -->
              <span class="collection">
                <!-- 未收藏 -->
                <button
                  v-if="!collected"
                  class="btn btn-white mleft-10"
                  @click="subsongList(2)"
                  :disabled="subDisabled"
                >
                  <i class="el-icon-folder-add">&nbsp;</i>
                  <span class="btn-text"
                    >收藏({{ info.subscribedCount | countFormat }})</span
                  >
                </button>
                <!-- 已收藏 -->
                <button v-if="collected" class="btn btn-white mleft-10">
                  <i class="el-icon-folder-checked">&nbsp;</i>
                  <span class="btn-text"
                    >已收藏({{ info.subscribedCount | countFormat }})</span
                  >
                </button>
              </span>

              <!-- 点击分享(暂时无法使用)-->
              <button class="btn btn-white mleft-10">
                <i class="iconfont icon-fenxiang">&nbsp;</i>
                <span class="btn-text"
                  >分享({{ info.shareCount | countFormat }})</span
                >
              </button>
            </div>
            <!-- 标签 -->
            <div class="label" v-if="tags.length !== 0">
              <span>标签：</span>
              <span
                class="mright-5 pointer"
                style="color: #0b58b0"
                v-for="(item, index) in tags"
                :key="index"
                >{{
                  item + " " + `${index === tags.length - 1 ? "" : "/"}`
                }}</span
              >
            </div>
            <!-- 歌曲数目和播放量 -->
            <div class="songnum">
              <span>歌曲：</span>
              <span class="mright-10">{{ info.trackCount | countFormat }}</span>
              <span>播放：</span>
              <span>{{ info.playCount | countFormat }}</span>
            </div>
            <!-- 简介 -->
            <div class="font-14 brief">
              <input id="check" type="checkbox" />
              <div class="introduction sliderbar">
                <p>简介：{{ info.description }}</p>
              </div>
              <label for="check" class="check-in"
                ><i class="iconfont icon-zhankai"></i
              ></label>
              <label for="check" class="check-out"
                ><i class="iconfont icon-shouqi"></i
              ></label>
            </div>
          </div>
        </div>

        <div class="songlist-topbar">
          <!-- 导航栏 -->
          <div class="navbar">
            <TabMenu
              :menuList="['歌曲列表', `评论(${info.commentCount})`, '收藏者']"
              @menuClick="setIndex"
              defaultactive="0"
            />
          </div>
          <!-- 搜索 -->
          <div class="search" v-if="menuIndex === '0'">
            <el-input
              clearable
              placeholder="搜索音乐"
              suffix-icon="el-icon-search"
              v-model="searchKey"
            >
            </el-input>
          </div>
        </div>
        <!-- 歌单列表(未登录只能获取不完整列表) -->
        <div class="musiclist" v-show="menuIndex === '0'">
          <MusicList :tableData="list" />
        </div>
        <!-- 评论列表 -->
        <div class="comment-tab" v-show="menuIndex === '1'">
          <CommentList :id="id" :type="2" :active="menuIndex == '1'" />
        </div>
        <!-- 收藏者列表 -->
        <div class="follower" v-show="menuIndex === '2'">
          <el-skeleton v-if="isSubloading" :rows="6" animated />
          <div v-else-if="this.pageInfo.total === 0" class="flex_center">
            当前歌单没有收藏者
          </div>
          <template v-else>
            <FollowerList :datalist="followerlist" @clickImg="toUserDetail" />
            <div class="pagination flex_center" style="margin-top: 10px">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="pageInfo.currentPage"
                :page-size="30"
                layout="prev, pager, next"
                :total="pageInfo.total"
                background
              >
              </el-pagination>
            </div>
          </template>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
import "@/assets/less/SongListDetail.less";
import Tag from "@/components/Tag.vue";
import TabMenu from "@/components/Tabmenu.vue";
import MusicList from "@/components/List/MusicList.vue";
import CommentList from "@/components/comment/CommentList.vue";
import FollowerList from "@/components/List/FollowerList.vue";
import { getPlayListDetail, getFollowerList } from "@/api/api-songlist";
import { mapState } from "vuex";
export default {
  data() {
    return {
      isLoading: true,
      isSubloading: "",
      collected: false,
      searchKey: "",
      menuIndex: "0",
      playList: [],
      tags: [],
      followerlist: [],
      info: {},
      creator: {},
      pageInfo: {
        currentPage: 1,
        total: 0,
      },
    };
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    Tag,
    TabMenu,
    MusicList,
    CommentList,
    FollowerList,
  },
  created() {
    this.getSongListDetail();
  },
  watch: {
    id() {
      this.getSongListDetail();
      if (this.menuIndex === "2") {
        this.isSubloading = true;
        this.getFollowerList();
      }
    },
  },
  computed: {
    ...mapState(["isLogin", "profile"]),
    list() {
      let reg = new RegExp(this.searchKey.trim(), "ig");
      return this.playList.filter((item) => {
        return item.name.match(reg);
      });
    },
    subDisabled() {
      if (this.isLogin) return this.info.userId === this.profile.userId;
      else return false;
    },
  },
  methods: {
    // 页面切换
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      // document.querySelector(".main-right").scrollTop = 0;
      this.getFollowerList();
    },
    setIndex(index) {
      console.log(index);
      this.menuIndex = index;
      if (this.menuIndex === "2") {
        this.isSubloading = true;
        this.getFollowerList();
      }
    },
    toUserDetail(item) {
      if (typeof item === "object")
        this.$router.push("/userdetail/" + item.userId);
    },
    // 收藏/取消收藏
    async subsongList(type) {
      if (!this.isLogin) return this.$message.warning("需要登录");
      let cancel = false;
      if (this.subscribed)
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
      const res = await setPlaylistSub(this.id, type);
      if (res.code !== 200) return;
      this.subscribed = !this.subscribed;
      if (type == 1) this.$message.success("收藏成功");
      else this.$message.success("取消收藏成功");
      this.$store.dispatch("getMyPlayList");
    },
    //获取歌单详情
    async getSongListDetail() {
      this.isLoading = true;
      const res = await getPlayListDetail(this.id);
      if (res.code !== 200) return;
      console.log(res);
      this.info = res.playlist;
      this.tags = Object.freeze(res.playlist.tags);
      this.creator = res.playlist.creator;
      this.playList = res.playlist.tracks;
      this.isLoading = false;
    },
    //获取歌单收藏者
    async getFollowerList() {
      const res = await getFollowerList({
        id: this.id,
        offset: (this.pageInfo.currentPage - 1) * 30,
      });
      if (res.code !== 200) return;
      console.log("follower");
      console.log(res);
      this.followerlist = res.subscribers;
      this.pageInfo.total = res.total;
      this.isSubloading = false;
    },
  },
};
</script>

<style lang="less" scoped></style>
