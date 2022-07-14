<template>
  <div class="imglist">
    <ul
      class="img-container mw-760"
      v-infinite-scroll="load"
      :infinite-scroll-disabled="disabled"
      infinite-scroll-delay="300"
    >
      <li class="img-item" v-for="item in dataList" :key="item.id">
        <div class="img-wrap" @click="toMvDetail(item.id)">
          <div class="duration font-12">
            {{ (item.duration / 1000) | timeFormat }}
          </div>
          <div class="playcount" v-if="item.playCount">
            <i class="iconfont icon-24gl-play"></i>
            {{ item.playCount | countFormat }}
          </div>
          <div class="image">
            <img
              class="img img-radius-8 img-border"
              v-lazy="item.cover + '?param=320y180'"
            />
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
    dataList: {
      type: Array,
      required: true,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    noMore: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    imgitemClick(id) {
      // console.log(id);
      this.$emit("clickItem", id);
    },
    load() {
      if (this.hasMore) this.$emit("loadMore", this.imgList.length);
    },
    toMvDetail(id) {
      // this.$router.push('/videodetail/mv/' + id)
    },
  },
};
</script>

<style lang="less" scoped>
.img-container {
  padding: 10px 0;
  display: grid;
  grid-template-columns: repeat(4, calc(25% - 16px));
  column-gap: 20px;
  row-gap: 20px;
  .img-item {
    .img-wrap {
      position: relative;
      &:hover {
        cursor: pointer;
      }
      .playcount {
        position: absolute;
        right: 10px;
        top: 10px;
        color: white;
        text-shadow: 0 0 2px #000;
      }
      .duration {
        position: absolute;
        color: white;
        right: 10px;
        bottom: 10px;
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
