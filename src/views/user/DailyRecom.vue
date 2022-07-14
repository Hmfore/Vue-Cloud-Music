<template>
  <div class="dailyrecom mw-760">
    <div class="info">
      <div class="img-wrap">
        <div class="day font-bold">{{ today }}</div>
      </div>
      <div class="text mleft-30 mtop-20">
        <div class="font-24 font-bold title">每日歌曲推荐</div>
        <div class="desc">根据你的音乐口味生成，每天6:00更新</div>
      </div>
    </div>
    <div class="btn-wrap">
      <button class="btn btn-red" @click="playAll">
        <i class="iconfont icon-bofang"></i> 播放全部
      </button>
      <button class="btn btn-white mleft-12" @click="openAddDialog">
        <i class="el-icon-folder-add"></i> 收藏全部
      </button>
    </div>
    <div class="div-line mtop-20"></div>
    <MusicList v-if="showList" ref="listRef" :tableData="list" />
    <el-skeleton class="mtop-10" v-else :rows="8" animated />
    <!-- <AddMusicDialog ref="addDialog" :musicIdList="idList" /> -->
  </div>
</template>

<script>
import MusicList from "@/components/List/MusicList.vue";
import { getRecommendSong } from "@/api/api-music.js";
export default {
  data() {
    return {
      list: [],
    };
  },
  components: {
    MusicList,
  },
  created() {
    this.getRecommendSong();
    this.getToday();
  },
  computed: {
    showList() {
      return this.list.length !== 0 ? true : false;
    },
  },
  methods: {
    async getRecommendSong() {
      const res = await getRecommendSong();
      if (res.code !== 200) return;
      this.list = Object.freeze(res.data.dailySongs);
    },
    getToday() {
      let day = new Date().getDate();
      day = day < 10 ? "0" + day : "" + day;
      this.today = day;
    },
    openAddDialog() {},
    playAll() {},
  },
};
</script>

<style lang="less" scoped>
.info {
  display: flex;
}
.img-wrap {
  height: 100px;
  width: 100px;
  background: url("@/assets/img/calendar.png") 0 0/100% no-repeat;
  line-height: 40px;
  .day {
    width: 100px;
    height: 40px;
    font-size: 40px;
    color: #ec4141;
    margin-top: 30px;
    text-align: center;
  }
}
.text {
  .title {
    font-size: 24px;
  }
  .desc {
    margin-top: 20px;
    font-size: 12px;
    color: #676767;
  }
}
.btn-wrap {
  i {
    font-size: 14px;
  }
}
</style>
