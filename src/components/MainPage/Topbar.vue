<template>
  <div class="top-bar">
    <!-- 网易云logo -->
    <span class="iconfont logo pointer" @click="toHomePage">&#xe602;</span>

    <div class="search">
      <!-- 左箭头 -->
      <div class="leftarrow pointer" @click="goTo(-1)">
        <span class="iconfont">&#xe685;</span>
      </div>
      <!-- 右箭头 -->
      <div class="rightarrow pointer" @click="goTo(1)">
        <span class="iconfont">&#xe665;</span>
      </div>
      <!-- 搜索框 -->
      <div class="searcharea">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          size="medium"
          ref="inputRef"
          clearable
          v-model="keywords"
          @change="toSearch"
          @input="handleInput"
          @focus="getHotSearch"
          @blur="showInfoTip = false"
        >
        </el-input>
        <transition name="el-fade-in">
          <div class="searchtip" v-show="showInfoTip">
            <div v-show="keywords === ''">
              <div class="history" v-show="historySearchList.length !== 0">
                <div class="title">
                  <span class="font-14">搜索历史</span>
                  <button class="no-btn" @click="clearHistory">
                    <i class="el-icon-delete"></i>
                  </button>
                </div>
                <div class="btns">
                  <div
                    class="btns-item"
                    v-for="item in historySearchList"
                    :key="item"
                  >
                    <button
                      class="history-item btn btn-white font-12"
                      @click="clickHot(item)"
                    >
                      {{ item }}
                    </button>
                  </div>
                </div>
              </div>
              <!-- 热搜榜 -->
              <div class="hotlist">
                <div class="hot-title font-14">热搜榜</div>
                <div class="hot-itemlist">
                  <div
                    class="hot-item pointer"
                    :class="{ 'top-item': index < 3 }"
                    v-for="(item, index) in hotList"
                    :key="index"
                    @click="clickHot(item.searchWord)"
                  >
                    <div class="index">{{ index + 1 }}</div>
                    <div class="item-info">
                      <div class="top">
                        <span class="item-name font-12">{{
                          item.searchWord
                        }}</span>
                        <span
                          style="color: #c2c1c1"
                          class="item-count font-12 mleft-10"
                          >{{ item.score }}</span
                        >
                      </div>
                      <div class="foot">
                        <div
                          class="item-content font-12"
                          style="color: #999999"
                        >
                          {{ item.content }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="keywords !== ''">
              <div class="suggest-area">
                <div class="suggest-title">
                  <span
                    >搜"{{ keywords }}"相关的内容
                    <i class="el-icon-arrow-right"></i
                  ></span>
                </div>
                <SuggestList v-if="showMusic">
                  <template #title>
                    <i class="iconfont icon-yinle font-16"></i
                    ><span class="mleft-10">单曲</span>
                  </template>
                  <template #content>
                    <div
                      class="item pointer text-hidden"
                      v-for="value in suggestInfo.songs"
                      :key="value.id"
                      @click="playMusic(value.id)"
                    >
                      {{ value.name }}-{{ AuthorList(value.artists) }}
                    </div>
                  </template>
                </SuggestList>
                <SuggestList v-if="showAlbum">
                  <template #title>
                    <i class="iconfont icon-zhuanji font-16"></i
                    ><span class="mleft-10">专辑</span>
                  </template>
                  <template #content>
                    <div
                      class="item pointer text-hidden"
                      v-for="value in suggestInfo.albums"
                      :key="value.id"
                      @click="toAlbumDetail(value.id)"
                    >
                      {{ value.name }}-{{ AuthorList(value.artist) }}
                    </div>
                  </template>
                </SuggestList>
                <SuggestList v-if="showArtist">
                  <template #title>
                    <i class="el-icon-user font-16"></i
                    ><span class="mleft-10">歌手</span>
                  </template>
                  <template #content>
                    <div
                      class="item pointer text-hidden"
                      v-for="value in suggestInfo.artists"
                      :key="value.id"
                      @click="toArtistDetail(value.id)"
                    >
                      {{ value.name }}
                    </div>
                  </template>
                </SuggestList>
                <SuggestList v-if="showPlaylist">
                  <template #title>
                    <i class="iconfont icon-gedan font-16"></i
                    ><span class="mleft-10">歌单</span>
                  </template>
                  <template #content>
                    <div
                      class="item pointer text-hidden"
                      v-for="value in suggestInfo.playlists"
                      :key="value.id"
                      @click="toPlayListDetail(value.id)"
                    >
                      {{ value.name }}
                    </div>
                  </template>
                </SuggestList>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="user pointer" @click="loginView">
      <div class="userimg">
        <el-avatar icon="el-icon-user-solid" :src="avatarUrl"></el-avatar>
      </div>
      <span @click="doLogout">{{ name ? name : "未登录" }}</span>
    </div>
    <!-- <div class="style"></div> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import "@/assets/less/Topbar.less";
import SuggestList from "../List/SuggestList.vue";
import { getHotSearch, getSuggest } from "@/api/api-other";
import { getMusicListByIds } from "@/api/api-music.js";

export default {
  data() {
    return {
      keywords: "",
      showInfoTip: false,
      hotList: [],
      historySearchList: [],
      suggestInfo: {},
    };
  },
  components: {
    SuggestList,
  },
  created() {
    this.getHistory();
    console.log(this.isLogin);
  },
  computed: {
    ...mapState(["isLogin", "isPhone", "account", "profile"]),
    name() {
      return this.isLogin ? this.profile.nickname : "未登录";
    },
    avatarUrl() {
      return this.isLogin ? this.profile.avatarUrl : "";
    },
    showMusic() {
      return Object.hasOwnProperty.call(this.suggestInfo, "songs");
    },
    showAlbum() {
      return Object.hasOwnProperty.call(this.suggestInfo, "albums");
    },
    showArtist() {
      return Object.hasOwnProperty.call(this.suggestInfo, "artists");
    },
    showPlaylist() {
      return Object.hasOwnProperty.call(this.suggestInfo, "playlists");
    },
    //获得所有歌曲作者名字
    AuthorList() {
      return function (arr) {
        if (arr instanceof Array) {
          const res = [];
          arr.forEach((item) => {
            if (item.name) res.push(item.name);
          });
          return res.join("  ");
        }
        return arr.name;
      };
    },
  },
  methods: {
    goTo(val) {
      this.$router.go(val);
    },
    doLogout() {
      this.$store.dispatch("logout");
    },
    toSearch() {
      if (this.keywords == "") return;
      this.$refs.inputRef.blur();
      console.log(this.$route.path);
      if (this.$route.path != "/search?keywords=" + this.keywords) {
        console.log(encodeURIComponent(this.keywords));
        this.$router.push(
          `/search?keywords=${encodeURIComponent(
            encodeURIComponent(this.keywords)
          )}`
        );
      }
      this.setHistory(this.keywords);
    },
    clickHot(val) {
      if (val !== "") {
        this.keywords = val;
        this.toSearch();
      }
    },
    handleInput(val) {
      // console.log(val);
      /* input事件防抖 */
      if (this.timer) {
        window.clearTimeout(this.timer);
      }
      this.timer = window.setTimeout(() => {
        // console.log(val, "timer");
        this.getSuggest(val);
      }, 1000);
    },
    async playMusic(id) {
      if (typeof id !== "number") return;
      const res = await getMusicListByIds(id);
      if (res.code !== 200 || res.songs.length === 0) return;
      this.$store.commit("setMusicList", res.songs);
      this.$store.commit("setCurrenMusicId", res.songs[0].id);
      this.$store.commit("setPlayState", true);
      this.$store.commit("setCurrenIndex", 0);
    },
    toHomePage() {
      if (this.$route.path != "/personalrecom")
        this.$router.push("/personalrecom");
    },
    toAlbumDetail(id) {
      if (typeof id === "number") {
        this.$router.push("/albumdetail/" + id);
      }
    },
    toArtistDetail(id) {
      if (typeof id === "number") {
        this.$router.push("/singerdetail/" + id);
      }
    },
    toPlayListDetail(id) {
      if (typeof id === "number") {
        this.$router.push("/songlistdetail/" + id);
      }
    },
    //清除历史记录
    clearHistory() {
      this.$confirm("确认清空历史记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          window.localStorage.removeItem("search");
          this.historySearchList = [];
          this.$message({
            type: "success",
            message: "删除成功!",
            duration: 800,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //获取搜索历史
    getHistory() {
      const history = window.localStorage.getItem("search");
      if (!history) return;
      this.historySearchList =
        JSON.parse(history) instanceof Array ? JSON.parse(history) : [];
      console.log(this.historySearchList);
    },
    //设置搜索历史
    setHistory(val) {
      if (val) {
        const olditem = this.historySearchList.findIndex(
          (item) => item === val
        );
        if (olditem !== -1) {
          this.historySearchList.splice(olditem, 1);
          this.historySearchList.unshift(val);
        } else {
          this.historySearchList.unshift(val);
        }
        this.historySearchList = this.historySearchList.slice(0, 5);
        window.localStorage.setItem(
          "search",
          JSON.stringify(this.historySearchList)
        );
      }
    },
    //登录
    loginView() {
      console.log(this.$route);
      if (!this.isLogin) this.$router.push("/login");
      else {
        if (this.$route.path === "/userdetail/" + this.account.id) return;
        this.$router.push(`/userdetail/${this.account.id}`);
      }
    },
    //获得热搜榜
    async getHotSearch() {
      console.log("获得热搜榜");
      this.showInfoTip = true;
      if (this.keywords !== "") {
        this.getSuggest(this.keywords);
      }
      if (this.hotList.length !== 0) return;
      const res = await getHotSearch();
      if (res.code !== 200) return;
      this.hotList = res.data;
      console.log(res);
    },
    async getSuggest(val) {
      if (val == "") return;
      const res = await getSuggest({ keywords: val });
      if (res.code !== 200) return;

      if (Object.keys(res.result).length !== 0) this.suggestInfo = res.result;
      console.log(this.suggestInfo);
    },
  },
};
</script>

<style lang="less" scoped></style>
