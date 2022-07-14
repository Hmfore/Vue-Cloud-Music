<template>
  <div class="commentlist">
    <!-- 发布评论 -->
    <div class="commentarea">
      <div class="top">
        <textarea
          class="text-area"
          ref="textAreaRef"
          v-model="commentInfo.content"
          maxlength="140"
        >
        </textarea>
        <div class="restnum" style="color: #dfcfdf">{{ restnum }}</div>
      </div>
      <div class="buttons">
        <div class="leftbtn">
          <button
            class="no-btn font-18 transparent"
            @click="commentInfo.content += '@'"
          >
            @
          </button>
          <button class="no-btn font-18 transparent" @click="addTopic">
            #
          </button>
        </div>
        <div class="rightbtn">
          <button class="btn btn-white" @click="sendComment">评论</button>
        </div>
      </div>
    </div>
    <!-- 精彩评论 -->
    <div
      class="goodcomment mtop-20 mw-760"
      v-if="hotList.length !== 0"
      ref="scrolltotop"
    >
      <div class="span font-16 font-bold">精彩评论</div>
      <CommentItem
        v-for="item in hotList"
        :key="item.commentId"
        :item="item"
        identy="hot"
        @like="handleLike"
        @reply="handleReply"
        @clickUser="toUserDetail"
      />
    </div>
    <!-- 最新评论 -->
    <div
      class="newcomment mw-760 mtop-50"
      ref="newCommentRef"
      v-if="newList.length !== 0"
    >
      <div class="span font-16 font-bold">最新评论</div>
      <CommentItem
        v-for="item in newList"
        :key="item.commentId"
        :item="item"
        identy="new"
        @like="handleLike"
        @reply="handleReply"
        @clickUser="toUserDetail"
      />
      <div class="pagination flex_center" style="margin-top: 10px">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="prev, pager, next"
          :total="newCount"
          background
        >
        </el-pagination>
      </div>
    </div>
    <div v-if="newCount === 0" style="color: #9f9f9f; text-align: center">
      还没有评论，快来抢沙发~
    </div>
  </div>
</template>

<script>
import {
  getHotComment,
  getNewComment,
  sendComment,
  likeComment,
} from "@/api/api-comment";
import { mapState } from "vuex";
import CommentItem from "./CommentItem.vue";
export default {
  data() {
    return {
      hotList: [],
      newList: [],
      newCount: 0,
      currentPage: 1,
      commentInfo: {
        /* 1评论 2回复 0删除 */
        t: 1,
        type: this.type,
        id: this.id,
        content: "",
        commentId: 0,
      },
      //用此属性去检索
      newQuery: {
        id: this.id,
        offset: 0,
        limit: 20,
        before: 0,
        type: this.type,
      },
      replyName: "",
    };
  },
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
    type: {
      type: Number,
      required: true,
      default: "body",
    },
    active: Boolean,
  },
  components: {
    CommentItem,
  },
  computed: {
    restnum() {
      return 140 - this.commentInfo.content.length;
    },
    ...mapState(["isLogin"]),
  },
  watch: {
    id(val) {
      // 监听ID，改变后重新获取数据
      if (!val) return;
      this.hotList = [];
      this.commentInfo.id = val;
      this.newQuery.id = val;
      this.clearCommentInfo();
      this.getHotCommentList();
      this.getNewCommentList();
    },
  },
  methods: {
    //切换页面
    handleCurrentChange(val) {
      console.log("被执行");
      this.currentPage = val;
      this.newQuery.offset = (val - 1) * 20;
      this.getNewCommentList();
    },
    clearCommentInfo() {
      this.replyName = "";
      this.commentInfo.content = "";
      console.log("重置评论");
      this.commentInfo.commentId = 0;
      this.commentInfo.t = 1;
    },
    addTopic() {
      this.commentInfo.content += "#输入想说的话题#";
    },
    //点击用户头像/名字
    toUserDetail(id) {
      console.log(this.type);
      if (typeof id !== "number") return;
      if (this.type === 0) this.$emit("closePlayView");
      if (this.$route.path !== "/userdetail/" + id)
        this.$router.push("/userdetail/" + id);
    },
    //点赞
    handleLike(info) {
      if (!this.isLogin) return this.$message.error("需要登录");
      console.log(info);
      let obj = { id: this.id, cid: info.cid, t: 1, type: this.type };
      if (info.liked) {
        obj.t = 0;
      }
      this.like(obj, info.identy);
    },
    //回复
    handleReply(info) {
      if (!this.isLogin) return this.$message.error("需要登录");
      console.log(info);
      this.replyName = info.name;
      this.commentInfo.content = "回复" + info.name + ":";
      this.commentInfo.commentId = info.cid;
      this.commentInfo.t = 2;

      this.$refs.newCommentRef.scrollTop = 0;

      this.$nextTick(() => {
        this.$refs.textAreaRef.focus();
      });
    },
    // 发送评论
    async sendComment() {
      if (!this.isLogin) return this.$message.error("需要登录");
      if (this.restNum < 0) return this.$message.error("字数过长");
      if (this.commentInfo.commentId !== 0) {
        this.commentInfo.content = this.commentInfo.content.replace(
          "回复" + this.replyName + ":",
          ""
        );
      }
      console.log("send");
      const res = await sendComment(this.commentInfo);
      if (res.code !== 200) return;
      this.$message.success("发送成功");
      console.log(res);
      this.commentInfo.content = "";
      this.commentInfo.t = 1;
      this.commentInfo.commentId = 0;
      console.log("刷新新列表");
      /* 当前在第一页的话，过500ms再请求更新最新列表，不然会出错 */
      if (this.newQuery.offset === 0)
        window.setTimeout(() => {
          this.getNewCommentList();
        }, 500);
      this.$refs.newCommentRef.scrollTop = 0;
    },
    //点赞回调
    async like(obj, type) {
      const res = await likeComment(obj);
      if (res.code !== 200) return;
      if (type == "new") {
        let index = this.newList.findIndex((item) => item.commentId == obj.cid);
        this.newList[index].liked = !this.newList[index].liked;
        if (obj.t) {
          this.newList[index].likedCount++;
        } else {
          this.newList[index].likedCount--;
        }
      } else if (type == "hot") {
        let index = this.hotList.findIndex((item) => item.commentId == obj.cid);
        this.hotList[index].liked = !this.hotList[index].liked;
        if (obj.t) {
          this.hotList[index].likedCount++;
        } else {
          this.hotList[index].likedCount--;
        }
      }
    },
    //获取热门评论
    async getHotCommentList() {
      if (this.hotList.length !== 0) return;
      const res = await getHotComment(this.id, this.type, 5);
      if (res.code === 200) {
        console.log(res);
        this.hotList = res.hotComments;
      }
    },
    //获取最新评论
    async getNewCommentList() {
      const res = await getNewComment(this.newQuery);
      console.log(res);
      if (res.code !== 200) return;
      this.newList = res.comments;
      this.newCount = res.total;
    },
  },
  created() {
    this.getHotCommentList();
    this.getNewCommentList();
  },
};
</script>

<style lang="less" scoped>
.commentarea {
  min-width: 760px;
  .top {
    position: relative;
    .text-area {
      width: 100%;
      height: 60px;

      outline: none;
      resize: none;
    }
    .restnum {
      position: absolute;
      bottom: 4px;
      right: 4px;
    }
  }
  .buttons {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
}
.transparent {
  background-color: transparent;
}
</style>
