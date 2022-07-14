<template>
  <div class="imglist">
    <ul
      class="img-container mw-760"
      v-infinite-scroll="load"
      :infinite-scroll-disabled="disabled"
      infinite-scroll-delay="300"
    >
      <li class="img-item" v-for="item in imgList" :key="item.id">
        <div class="img-wrap" @click="imgitemClick(item.id)">
          <div class="video-play font-12" v-if="showPlayBtn">
            <i class="iconfont play">&#xe87c;</i>
          </div>
          <div class="playcount" v-if="item.playCount">
            <i class="iconfont icon-24gl-play"></i>
            {{ item.playCount | countFormat }}
          </div>
          <div class="image">
            <img class="img img-radius-8 img-border" v-lazy="picUrl(item)" />
          </div>
        </div>

        <slot :item="item"></slot>
      </li>
    </ul>
    <div class="loading-wrap" v-show="isLoading">
      <i class="el-icon-loading"></i>加载中
    </div>
    <div class="loading-wrap" v-if="noMore">没有更多了</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    imgList: {
      type: Array,
      required: true,
      default: () => [],
    },
    hasMore: {
      type: Boolean,
      default: false,
    },
    infinite: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    /* 无限滚动禁用 */
    disabled() {
      return !this.infinite || !this.hasMore || this.isLoading;
    },
    showPlayBtn() {
      return this.type === "playlist" || this.type === "album";
    },
    noMore() {
      return this.infinite && !this.hasMore;
    },
  },
  methods: {
    picUrl(item) {
      if (this.type === "playlist")
        return `${item.picUrl ? item.picUrl : item.coverImgUrl}?param=300y300`;
      else if (this.type === "artist") {
        return `${item.img1v1Url}?param=300y300`;
      } else if (this.type === "album") {
        return `${item.picUrl}?param=300y300`;
      }
    },
    imgitemClick(id) {
      // console.log(id);
      this.$emit("clickItem", id);
    },
    load() {
      if (this.hasMore) this.$emit("loadMore", this.imgList.length);
    },
  },
};
</script>

<style lang="less" scoped>
.img-container {
  padding: 10px 0;
  display: grid;
  grid-template-columns: repeat(5, calc(20% - 16px));

  column-gap: 20px;
  row-gap: 20px;
  .img-item {
    .img-wrap {
      position: relative;
      &:hover {
        cursor: pointer;
        .video-play {
          opacity: 1;
        }
      }
      .playcount {
        position: absolute;
        right: 10px;
        top: 10px;
        color: white;
        text-shadow: 0 0 2px #000;
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
        right: 10px;
        bottom: 15px;
        opacity: 0;
        transition: opacity 0.6s;
      }
      .text-wrap {
        overflow: hidden;
        // white-space: nowrap;
        // text-overflow: ellipsis;
      }
    }
  }
}
.loading-wrap {
  font-size: 16px;
  height: 50px;
  text-align: center;
}
</style>
