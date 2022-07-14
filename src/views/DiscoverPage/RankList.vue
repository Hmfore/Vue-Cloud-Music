<template>
  <div class="ranklist mw-760">
    <div class="official-list">
      <h2 class="font-bold font-20">官方榜</h2>
      <div
        class="official-list-item mtop-10"
        v-for="(item, index) in officialList"
        :key="item.id"
      >
        <div class="item-wrap">
          <!-- 左侧榜单图片 -->
          <div class="item-img">
            <!-- 图片容器 -->
            <div class="img-wrap">
              <img
                class="img pointer img-radius-8"
                @click="toSongListDetail(item.id)"
                v-lazy="item.coverImgUrl"
              />
            </div>
            <!-- 播放按钮 -->
            <div class="video-play font-12" @click="toSongListDetail(item.id)">
              <i class="iconfont play">&#xe87c;</i>
            </div>
          </div>

          <!-- 右侧榜单前五 -->

          <ul class="topfive mleft-30">
            <li
              v-for="(i, itemindex) in item.tracks"
              :key="i.id"
              class="pointer"
              @dblclick="playMusic(i.id, index, itemindex)"
            >
              <span class="mleft-12 text-hidden">{{ itemindex + 1 }}</span>
              <span class="mleft-12 songname text-hidden">{{ i.name }}</span>
              <span
                class="author artist-list text-hidden"
                @click="toArtistDetail(a.id)"
                v-for="a in i.ar"
                :key="a.name"
                >{{ a.name }}</span
              >
            </li>
          </ul>
        </div>
        <div class="mleft-200">
          <button
            class="pointer no-btn mtop-10"
            @click="toSongListDetail(item.id)"
          >
            查看全部<i class="el-icon-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="global-list" v-if="officialList.length == 4">
      <h2 class="font-bold font-20">全球榜</h2>
      <ImgList
        @clickItem="toSongListDetail"
        :imgList="globalList"
        type="playlist"
      >
        <template v-slot="{ item }">
          <div class="text-hidden">
            {{ item.name }}
          </div>
        </template>
      </ImgList>
    </div>
  </div>
</template>

<script>
import { getRankList, getPlayListDetail } from "@/api/api-songlist";
import ImgList from "@/components/List/ImgList.vue";
export default {
  data() {
    return {
      // 官方榜
      officialList: [],
      //官方榜的id
      officialListId: [],
      //全球榜
      globalList: [],
    };
  },
  components: {
    ImgList,
  },
  computed: {},
  created() {
    this.getRankList();
  },
  methods: {
    toArtistDetail(id) {
      if (typeof id === "number") this.$router.push("/singerdetail/" + id);
    },
    toSongListDetail(id) {
      if (typeof id === "number")
        this.$router.push({ path: "/songlistdetail/" + id });
    },
    //播放音乐
    playMusic(id, listIndex, index) {
      this.$store.commit("setMusicList", this.officialList[listIndex].tracks);
      this.$store.commit("setCurrenMusicId", id);
      this.$store.commit("setPlayState", true);
      this.$store.commit("setCurrenIndex", index);
    },
    // 获取到的数据数组前4便是官方榜单
    async getRankList() {
      const res = await getRankList();
      if (res.code !== 200) return;
      this.officialListId = [];
      res.list.slice(0, 4).forEach((item) => {
        this.officialListId.push(item.id);
      });
      this.globalList = Object.freeze(res.list.slice(4));
      this.officialListId.forEach((item) => {
        this.getSongListDetail(item);
      });
      // this.getSongListDetail(this.officialList)
    },
    async getSongListDetail(id) {
      this.officialList = [];
      const res = await getPlayListDetail(id);
      if (res.code !== 200) return;
      console.log(res);
      res.playlist.tracks = Object.freeze(res.playlist.tracks.slice(0, 5));
      this.officialList.push(Object.freeze(res.playlist));
    },
  },
};
</script>

<style lang="less" scoped>
.official-list-item {
  margin-bottom: 20px;
  .item-wrap {
    display: flex;
    height: 160px;
    ul {
      flex-grow: 1;
      li {
        height: 32px;
        line-height: 32px;
        color: #f00;
        background-color: #ffffff;
        &:nth-child(1) {
          background-color: #f9f9f9;
        }
        &:nth-child(3) {
          background-color: #efefef;
        }
        &:nth-child(4) {
          color: #666;
        }
        &:nth-child(5) {
          color: #666;
          background-color: #f9f9f9;
        }
        &:hover {
          background-color: #f4f4f4;
        }
        span {
          display: inline-block;
        }
        .songname {
          color: #373737;
        }
        .author {
          float: right;
          color: #9b9b9b;
        }
      }
    }
  }
}
.item-img {
  position: relative;
  height: 160px;
  width: 160px;
  background-color: skyblue;
  border-radius: 8px;
  &:hover {
    cursor: pointer;
    .video-play {
      opacity: 1;
    }
  }
  .video-play {
    position: absolute;
    border-radius: 50%;
    background-color: white;
    width: 36px;
    height: 36px;
    color: red;
    line-height: 36px;
    text-align: center;
    right: 62px;
    bottom: 62px;
    opacity: 0;
    transition: opacity 0.6s;
  }
}
.artist-list {
  &::before {
    display: inline;
    margin: 2px;
    content: "/";
  }
  &:last-child::before {
    content: "";
  }
}
</style>
