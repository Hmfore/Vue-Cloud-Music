<template>
  <div class="latestmusic mw-760">
    <div class="new-music-head">
      <div class="head-btn-wrap">
        <button
          class="btn-newmusic"
          :class="{ 'btn-newmusic_active': menuIndex === 0 }"
          @click="changeCompo(0)"
        >
          新歌速递
        </button>
        <button
          class="btn-newmusic"
          :class="{ 'btn-newmusic_active': menuIndex === 1 }"
          @click="changeCompo(1)"
        >
          新碟上架
        </button>
      </div>
    </div>
    <div class="latestmusic-view">
      <component :is="compo" />
    </div>
  </div>
</template>

<script>
import NewMusic from "./LatesetMusicPage/NewMusic.vue";
import NewAlbum from "./LatesetMusicPage/NewAlbum.vue";

export default {
  data() {
    return {
      subCompon: ["NewMusic", "NewAlbum"],
      menuIndex: 0,
    };
  },
  components: {
    NewMusic,
    NewAlbum,
  },
  computed: {
    compo() {
      return this.subCompon[this.menuIndex];
    },
  },
  methods: {
    changeCompo(index) {
      this.menuIndex = index;
    },
  },
};
</script>

<style lang="less" scoped>
.new-music-head {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  .head-btn-wrap {
    width: 202px;
    height: 32px;
    border: 1px solid #bbbbbb;
    border-radius: 16px;
    .btn-newmusic {
      width: 100px;
      height: 30px;
      outline: 0;
      border: 0;
      border-radius: 15px;
      box-sizing: border-box;
      color: #373737;
      background-color: #fff;
      transition: all 0.5s;
      &:hover {
        background-color: #f4f4f4;
      }
    }
    .btn-newmusic_active {
      background-color: #bbbbbb;
      color: #fff;
      &:hover {
        background-color: #bbbbbb;
      }
    }
  }
}
</style>
