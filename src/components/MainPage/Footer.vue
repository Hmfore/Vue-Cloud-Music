<template>
  <!-- 左边歌曲封面与信息 -->
  <div class="footer-bar">
    <div class="player-container mw-760">
      <div class="songinfo">
        <div class="songcover">
          <i v-if="imgInfo.imgUrl == ''" class="iconfont default">&#xe6d0;</i>
          <img
            v-else
            class="pointer"
            :src="imgInfo.imgUrl + '?param=180y180'"
            alt=""
            @click="openPlayView"
          />
        </div>
        <div class="songdetail">
          <div class="songname pointer" @click="openPlayView">
            <span>{{ imgInfo.name }}</span>
          </div>
          <span v-if="imgInfo.author !== '未知歌手名'">
            <span
              class="author pointer artist-list"
              @click="toArtistDetail(a.id)"
              v-for="a in imgInfo.author"
              :key="a.name"
              >{{ a.name }}</span
            >
          </span>
          <span v-else>
            {{ imgInfo.author }}
          </span>
        </div>
      </div>
      <!-- 播放器 -->
      <div class="player">
        <div class="top">
          <div class="buttons">
            <i class="iconfont order">&#xe802;</i>
            <i @click="lastMusic" class="iconfont presong">&#xe63c;</i>
            <div class="state" @click="toggleIsStop">
              <i
                :class="
                  isPlay ? 'iconfont icon-zanting' : 'iconfont icon-bofang'
                "
              ></i>
            </div>
            <i class="iconfont nextsong" @click="nextMusic">&#xe63e;</i>
            <div class="like">
              <i
                :class="
                  isLiked ? 'iconfont icon-aixin1' : 'iconfont icon-aixin'
                "
                @click="toggleIsLike"
              ></i>
            </div>
          </div>
        </div>
        <div class="progress">
          <span class="time">{{
            currenMusicInfo.currenTime | timeFormat
          }}</span>

          <el-slider
            class="timeslider"
            v-model="curren"
            :show-tooltip="false"
            @change="changeCurrenTime"
          ></el-slider>

          <span class="time">{{
            (currenMusicInfo.totalTime / 1000) | timeFormat
          }}</span>
        </div>
      </div>

      <!-- 音量调节与歌单列表 -->
      <div class="right">
        <div class="volumewrap">
          <div @click="isMute = !isMute">
            <i
              v-if="volume == 0"
              class="iconfont volume icon-shengyinguanbi volume-icon pointer"
            ></i>
            <i
              v-else
              class="iconfont icon-shengyin volume-icon pointer volume"
            ></i>
          </div>
          <div class="volume-slider">
            <el-slider v-model="volume" vertical height="200px"> </el-slider>
          </div>
        </div>

        <i
          v-show="playType !== 'personalFm'"
          class="iconfont songlist pointer"
          @click="showList"
          >&#xe628;</i
        >
      </div>
    </div>
    <!-- 弹出层 -->
    <el-drawer
      :visible.sync="PlayViewDrawer"
      direction="btt"
      size="100%"
      :before-close="handleClose"
      :show-close="false"
      :modal="false"
      class="footerdrawer mw-760"
      z-index="20"
    >
      <template #title>
        <div>
          <i
            class="el-icon-arrow-down pointer"
            @click="PlayViewDrawer = false"
          ></i>
        </div>
      </template>
      <div class="play-view">
        <div class="music-info">
          <div class="music-title">{{ imgInfo.name }}</div>
          <div class="music-author">
            <span
              class="pointer artist-list"
              @click="toArtistDetail(a.id)"
              v-for="a in imgInfo.author"
              :key="a.name"
              >{{ a.name }}</span
            >
          </div>
          <div class="lyric-view">
            <div class="img-wrap">
              <div
                class="changzhen pointer"
                :class="{ 'changzhen-active': isPlay }"
                @click="pause"
              >
                <img src="@/assets/img/changzhen.png" alt="" />
              </div>
              <div class="changpian" :class="{ 'changpian-active': isPlay }">
                <div class="changpian-wrap">
                  <img :src="imgInfo.imgUrl" />
                </div>
              </div>
            </div>
            <LyricWrap
              :currenTime="currenMusicInfo.currenTime"
              :musicId="currenMusicId"
            ></LyricWrap>
          </div>
        </div>
        <div class="comment-view mtop-50">
          <CommentList
            :type="0"
            @closePlayView="PlayViewDrawer = false"
            :id="this.currenMusicId"
          ></CommentList>
        </div>
      </div>
    </el-drawer>

    <!-- 播放标签 -->
    <audio
      ref="audioRef"
      :src="musicUrl"
      autoplay
      @timeupdate="updateCurrenTime"
      @ended="nextMusic"
    ></audio>
  </div>
</template>

<script>
import CommentList from "@/components/comment/CommentList.vue";
import { mapState } from "vuex";
import { getMusicUrl, likeMusic } from "@/api/api-music";
import LyricWrap from "../LyricWrap.vue";
import "@/assets/less/Footer.less";
export default {
  data() {
    return {
      musicUrl: "",
      volume: 24, //音量
      saveVolume: 25, //静音前保存的音量
      curren: 0, //进度条的百分比
      imgInfo: {
        //img区域信息，图片，歌名，歌手
        imgUrl: "",
        name: "未知歌名",
        author: "未知歌手名",
      },
      isMute: false, //是否是静音
      PlayViewDrawer: false,
    };
  },
  components: {
    CommentList,
    LyricWrap,
  },
  computed: {
    ...mapState([
      "isPlay",
      "currenMusicId",
      "currenIndex",
      "musicList",
      "currenMusicInfo",
      "historyList",
      "likeIdList",
      "isLogin",
      "playType",
      "account",
      "profile",
    ]),
    isLiked: {
      get() {
        return this.likeIdList.indexOf(this.currenMusicId) !== -1;
      },
      set(val) {
        console.log(this.isLiked);
        if (this.isLiked) {
          this.$store.commit("setLikeIdList", {
            type: "remove",
            data: val,
          });
        } else {
          this.$store.commit("setLikeIdList", {
            type: "unshift",
            data: val,
          });
        }
      },
    },
  },
  watch: {
    isPlay(val) {
      /* 由于misicUrl第一次是状态改变后获取，所以第一次改变不要进入监听 */
      if (this.musicUrl === "") return;
      if (val) {
        this.$refs.audioRef.play();
      } else {
        this.$refs.audioRef.pause();
      }
    },
    isMute(val) {
      if (val) {
        this.saveVolume = this.volume;
        this.volume = 0;
      } else {
        this.volume = this.saveVolume;
      }
    },
    /* 监听音量的改变 */
    volume() {
      this.changeVolume();
    },
    currenMusicId() {
      console.log("播放的歌曲改变了");
      this.getMusicUrl();
      if (this.PlayViewDrawer) {
        document.querySelector(".footer-bar .el-drawer__body ").scrollTop = 0;
      }
    },
  },
  created() {
    this.getHistory();
    this.volume = 25;
  },
  methods: {
    handleClose() {
      console.log("close");
      this.PlayViewDrawer = false;
    },
    pause() {
      if (this.musicUrl.length === 0) return;
      this.$store.commit("setPlayState", !this.isPlay);
    },
    toArtistDetail(id) {
      console.log("被调用了");
      if (typeof id === "number") {
        this.PlayViewDrawer = false;
        this.$router.push("/singerdetail/" + id);
      }
    },
    openPlayView() {
      if (this.musicUrl == "") return;
      if (this.playType === "music") {
        if (!this.PlayViewDrawer) {
          this.PlayViewDrawer = true;
          this.$nextTick(() => {
            document.querySelector(
              ".footer-bar .el-drawer__body"
            ).scrollTop = 0;
          });
        } else return (this.PlayViewDrawer = !this.PlayViewDrawer);
      } else if (this.playType === "personalFm") {
        if (this.$route.path !== "/personalfm")
          this.$router.push("/personalfm");
      }
    },
    //播放与暂停
    toggleIsStop() {
      if (this.musicUrl.length === 0) return;
      this.$store.commit("setPlayState", !this.isPlay);
    },
    //改变音量
    changeVolume() {
      this.$refs.audioRef.volume = this.volume / 100;
    },
    //获取历史播放
    getHistory() {
      if (!window.localStorage.getItem("historylist")) return;
      this.$store.commit("setHistoryList", {
        type: "get",
        data: JSON.parse(window.localStorage.getItem("historylist")),
      });
    },
    //更新历史播放
    setHistory() {
      this.$store.commit("setHistoryList", {
        type: "unshift",
        data: this.musicList[this.currenIndex],
      });
    },
    async toggleIsLike() {
      if (!this.isLogin) return this.$message.warning("需要登录");
      if (this.currenMusicId === 0 || typeof this.currenMusicId === "undefined")
        return;
      const res = await likeMusic(this.currenMusicId, !this.isLiked);
      if (res.code !== 200) return;
      this.$message.success(`${this.isLiked ? "取消喜欢" : "喜欢"}成功`);
      this.isLiked = this.currenMusicId; //改变isliked 触发了set
    },
    getImgInfo() {
      if (this.musicList[this.currenIndex].al.picUrl) {
        this.imgInfo.imgUrl = this.musicList[this.currenIndex].al.picUrl;
      } else {
        this.imgInfo.imgUrl = "";
      }
      this.imgInfo.author = this.musicList[this.currenIndex].ar;
      this.imgInfo.name = this.musicList[this.currenIndex].name;
      console.log(this.imgInfo.author);
      this.setHistory();
      console.log(this.account, this.profile);
    },
    //获得歌曲时长
    getToltime() {
      this.$store.commit("setTotalTime", this.musicList[this.currenIndex].dt);
    },
    //更新播放时间
    updateCurrenTime() {
      if (!this.$refs.audioRef) return;
      // 通过audio对象的方法获取当前时间
      let time = this.$refs.audioRef.currentTime;

      time = Math.floor(time);
      // 同步进度条
      if (time != this.currenMusicInfo.currenTime) {
        this.$store.commit("setCurrenTime", time);
        let percent =
          ((this.currenMusicInfo.currenTime * 1000) /
            this.currenMusicInfo.totalTime) *
          100;
        percent = Math.floor(percent);
        this.curren = percent;
      }
    },
    showList() {
      this.$store.commit("setDrawerMusicList", true);
    },
    changeCurrenTime(val) {
      console.log(val);
      let time = ((val / 100) * this.currenMusicInfo.totalTime) / 1000;
      this.$refs.audioRef.currentTime = time;
    },
    lastMusic() {
      console.log("上一首");
      if (this.playType == "music") {
        if (this.currenIndex != 0) {
          this.$store.commit("setCurrenIndex", this.currenIndex - 1);
          this.$store.commit(
            "setCurrenMusicId",
            this.musicList[this.currenIndex].id
          );
        } else {
          this.$store.commit("setPlayState", false);
          this.$message.error("已经是第一首了");
        }
      } else if (this.playType == "personalFm") {
        return false;
      }
    },
    nextMusic() {
      console.log("下一首");
      if (this.playType === "music") {
        if (this.currenIndex != this.musicList.length - 1) {
          this.$store.commit("setCurrenIndex", this.currenIndex + 1);
          this.$store.commit(
            "setCurrenMusicId",
            this.musicList[this.currenIndex].id
          );
        } else {
          this.$store.commit("setPlayState", false);
          this.$message.error("已经是最后一首了！");
        }
      } else if (this.playType === "personalFm") {
        this.$store.dispatch("personalFm", { type: "next" });
      }
    },
    async getMusicUrl() {
      this.getImgInfo();
      this.getToltime();
      const res = await getMusicUrl(this.currenMusicId);
      console.log("musicURL", res);
      if (res.code !== 200) return this.$message.error("播放失败");
      if (!res.data[0].url) {
        const h = this.$createElement;
        this.$notify({
          title: "当前歌曲暂无音源",
          message: h(
            "i",
            { style: "color: teal" },
            "因版权方要求，该资源暂时无法播放，我们正在争取歌曲回归"
          ),
        });
        this.musicUrl = "";
        this.$store.commit("setPlayState", false);
        return;
      }
      this.musicUrl = res.data[0].url;
    },
  },
};
</script>
<style lang="less" scoped></style>
