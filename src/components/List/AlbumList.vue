<template>
  <!-- 歌手页热门50首组件 -->
  <div class="top-fifty-list">
    <div class="list-container">
      <div style="width: 200px">
        <img
          class="img img-radius-8"
          :style="albumInfo ? 'cursor:pointer;' : ''"
          :src="imgUrl"
          @click="imgClick"
        />
      </div>
      <div class="mleft-40 list-content">
        <div>
          <span class="font-bold">{{ title }}</span>
          <button class="no-btn mleft-20 font-20" @click="playMusicAll">
            <i class="el-icon-video-play"></i>
          </button>
        </div>
        <el-table
          :data="disList"
          style="width: 100%"
          size="mini"
          stripe
          @row-dblclick="playMusic"
        >
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column prop="name" show-overflow-tooltip label="音乐标题">
          </el-table-column>
          <el-table-column prop="dt" width="100" label="时长">
            <template v-slot="scope">
              {{ (scope.row.dt / 1000) | timeFormat }}
            </template>
          </el-table-column>
        </el-table>
        <div class="right out" v-show="!showAll & (total > 10)">
          <button class="pointer no-btn mtop-10" @click="btnClick">
            查看全部{{ total }}首<i class="el-icon-arrow-right"></i>
          </button>
        </div>
        <div class="right in" v-show="showAll">
          <button class="pointer no-btn mtop-10" @click="showAll = false">
            收起<i class="el-icon-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    list: {
      type: Array,
      required: true,
    },
    albumInfo: {
      type: Object,
      default: () => {},
    },
    title: String,
  },
  data() {
    return {
      showAll: false,
    };
  },
  computed: {
    ...mapState(["musicList"]),
    disList() {
      if (!this.showAll) {
        return this.list.slice(0, 10);
      } else {
        return this.list;
      }
    },
    total() {
      return this.list.length;
    },
    imgUrl() {
      return this.albumInfo
        ? this.albumInfo.picUrl
        : require("@/assets/img/top50.png");
    },
  },
  methods: {
    imgClick() {
      if (this.albumInfo) this.toAlbumDetail();
    },
    btnClick() {
      if (this.albumInfo) this.toAlbumDetail();
      else this.showAll = true;
    },
    toAlbumDetail() {
      this.$router.push({ path: `/albumdetail/${this.albumInfo.id}` });
    },
    disPlayAll() {
      this.showAll = true;
    },
    //  播放音乐
    playMusic(row) {
      // console.log('列表没变', this.list == this.musicList)
      this.$store.dispatch("playMusic", {
        list: this.list,
        id: row.id,
      });
    },
    /* 播放当前列表 */
    playMusicAll() {
      if (this.list.length == 0) return;
      let id = this.list[0].id;
      this.$store.dispatch("playMusic", {
        list: this.list,
        id,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.list-container {
  display: flex;
  .list-content {
    flex: 1;
  }
}
</style>
