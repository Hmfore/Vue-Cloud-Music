<template>
  <div class="commentItem">
    <div class="container">
      <!-- 用户头像 -->
      <div class="userimg">
        <img
          class="img circle pointer"
          v-lazy="item.user.avatarUrl"
          @click="toUserDetail(item.user.userId)"
        />
      </div>
      <!-- 用户评论 -->
      <div class="content mleft-10">
        <span
          class="username pointer"
          style="color: #0b58b0"
          @click="toUserDetail(item.user.userId)"
          >{{ item.user.nickname }}：</span
        >
        <span class="comment font-12">{{ item.content }}</span>
        <div class="replycomment" v-if="item.beReplied.length !== 0">
          <span
            class="font-12 pointer"
            style="margin-left: 5px; color: #507daf"
            @click="toUserDetail(item.beReplied[0].user.userId)"
          >
            @{{ item.beReplied[0].user.nickname }}：</span
          >
          <span class="font-12">{{ item.beReplied[0].content }}</span>
        </div>
        <!-- 日期与按钮 -->
        <div class="bottom">
          <!-- 发布日期 -->
          <div class="datetime">{{ item.timeStr }}</div>
          <!-- 按钮 -->
          <div class="btns">
            <button class="no-btn like">
              <i
                class="iconfont icon-good"
                :class="{ isliked: item.liked }"
                @click="like(item.commentId, item.liked)"
              ></i>
              <span> {{ item.likedCount }}</span>
            </button>
            <button class="no-btn share">
              <i class="iconfont icon-fenxiang"></i>
            </button>
            <button
              class="no-btn reply"
              @click="reply(item.commentId, item.user.nickname)"
            >
              <i class="iconfont icon-pinglun"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    identy: String,
  },
  methods: {
    toUserDetail(id) {
      this.$emit("clickUser", id);
    },
    like(cid, liked) {
      this.$emit("like", { cid, liked, identy: this.identy });
    },
    reply(cid, name) {
      this.$emit("reply", { cid, name });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  align-items: center;
  margin: 10px 0;
  border-bottom: 1px solid #dfcfe7;
  .userimg {
    min-width: 40px;
    width: 40px;
  }
  .content {
    width: 100%;
    line-height: 26px;
    .comment,
    .replycomment {
      word-break: break-all;
      word-wrap: break-word;
    }
    .replycomment {
      background-color: rgba(208, 210, 212, 0.85);
      border-radius: 6px;
    }
  }
  .bottom {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
}
.isliked {
  color: red;
}
.btns {
  .like,
  .share,
  .reply {
    background-color: transparent;
  }
}
</style>
