<template>
  <div class="followerlist mw-760">
    <ul class="followerlist-ul">
      <li class="follower" v-for="item in datalist" :key="item.userId">
        <div class="userimg pointer" @click="clickImg(item)">
          <img class="img img-h" v-lazy="item.avatarUrl" />
        </div>
        <div class="right mleft-10">
          <span
            class="username mright-10 text-hidden pointer"
            @click="clickImg(item)"
            >{{ item.nickname }}</span
          >
          <span class="gender">
            <i
              v-if="item.gender == 1"
              style="color: #3da1d1"
              class="el-icon-male"
            ></i>
            <i
              v-else-if="item.gender == 2"
              style="color: #ea5a95"
              class="el-icon-female"
            ></i>
          </span>
          <div class="brief mtop-10 text-hidden">{{ item.signature }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    datalist: {
      type: Array,
      required: true,
      default: () => {},
    },
  },
  methods: {
    clickImg(item) {
      this.$emit("clickImg", item);
    },
  },
};
</script>

<style lang="less" scoped>
.followerlist-ul {
  display: grid;
  grid-template-columns: repeat(3, calc(33% - 16px));
  row-gap: 20px;
  .follower {
    display: flex;
    align-items: center;
    min-width: 230px;
    .userimg {
      min-width: 100px;
      width: 100px;
      height: 100px;
      img {
        border-radius: 50%;
      }
    }
    .right {
      min-width: 120px;
    }
  }
}
</style>
