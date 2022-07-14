<template>
  <div class="MusicList mw-760">
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      size="mini"
      empty-text="当前没有音乐哦"
      tooltip-effect="light"
      @row-dblclick="playMusic"
    >
      <!-- 标签，播放音乐的时候会变成小喇叭 -->
      <el-table-column type="index" width="50">
        <template v-slot="scope">
          <span class="active-color" v-if="showCurren(scope.row.id)"
            ><i v-if="isPlay" class="iconfont icon-shengyin_shiti"></i
            ><i v-else class="iconfont icon-sound"></i
          ></span>
          <span v-else style="color: #c3c3db">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!-- 喜欢与否 -->
      <el-table-column width="45" label="操作">
        <template v-slot="{ row }">
          <div class="pointer" @click="likeMusic(row.id)">
            <i v-if="!isLiked(row.id)" class="iconfont icon-aixin"></i>
            <i v-else style="color: #ec4141" class="iconfont icon-aixin1"></i>
          </div>
        </template>
      </el-table-column>
      <!-- 音乐标题、VIP标签,MV标签-->
      <el-table-column
        prop="name"
        label="音乐标题"
        show-overflow-tooltip
        class="mright-20"
      >
        <template v-slot="{ row }">
          <span class="titletags">
            <span :class="{ 'active-color': showCurren(row.id) }">
              {{ row.name }}
            </span>
            <span style="color: #969697" v-if="row.alia.length !== 0"
              >({{ row.alia[0] }})</span
            >
            <span class="tags">
              <span class="vip" v-if="row.fee == 1">
                <Tag
                  text="VIP"
                  styles="font-size:12px;padding:1px; margin-left:5px;color:#fe672e;line-height:12px"
                />
              </span>
              <span class="mv pointer" v-if="row.mv !== 0">
                <Tag
                  text=""
                  styles="font-size:12px;margin-left:5px;line-height:12px"
                >
                  MV<i class="el-icon-caret-right"></i>
                </Tag>
              </span>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ar[0].name"
        show-overflow-tooltip
        width="180"
        label="歌手"
      >
        <template v-slot="{ row }">
          <span
            class="pointer artist-list"
            @click="toArtistDetail(a.id)"
            v-for="a in row.ar"
            :key="a.name"
            >{{ a.name }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="al.name"
        label="专辑名"
        width="300"
        show-overflow-tooltip
      >
        <template v-slot="{ row }">
          <span class="pointer" @click="toAlbumDetail(row.al.id)">{{
            row.al.name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dt" label="时长" width="120">
        <template v-slot="{ row }">
          {{ (row.dt / 1000) | timeFormat }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { likeMusic } from "@/api/api-music";
import { mapState } from "vuex";
import Tag from "../Tag.vue";
export default {
  data() {
    return {};
  },
  props: {
    tableData: {
      type: Array,
      required: true,
      default: () => {},
    },
  },
  components: {
    Tag,
  },
  computed: {
    ...mapState([
      "musicList",
      "currenMusicId",
      "isPlay",
      "likeIdList",
      "isLogin",
    ]),
    // isDisplay() {
    //   return this.list ? true : false
    // },
  },
  methods: {
    // 判断是否喜欢
    isLiked(id) {
      return this.likeIdList.indexOf(id) !== -1;
    },
    // 判断是否是正在播放的歌曲
    showCurren(id) {
      return false;
    },
    // 添加或取消喜欢
    async likeMusic(id) {
      if (!this.isLogin) return this.$message.error("需要登录");
      if (typeof id !== "number") return;
      let liked = this.isLiked(id);
      const res = await likeMusic(id, !liked);
      console.log(res);
      if (res.code !== 200) return this.$message.error(res.msg);
      this.$message.success(`${liked ? "取消喜欢" : "喜欢"}成功`);
      if (liked) {
        this.$store.commit("setLikeIdList", {
          type: "remove",
          data: id,
        });
      } else {
        this.$store.commit("setLikeIdList", {
          type: "unshift",
          data: id,
        });
      }
    },
    playMusic(row) {
      // console.log('列表没变', this.tableData == this.musicList)
      this.$store.dispatch("playMusic", {
        list: this.tableData,
        id: row.id,
      });
    },
    toAlbumDetail(id) {
      if (this.$route.path === "/albumdetail/" + id) return;
      if (typeof id === "number") this.$router.push("/albumdetail/" + id);
    },
    toArtistDetail(id) {
      if (typeof id === "number") this.$router.push("/singerdetail/" + id);
    },
    // 播放当前列表
    playMusicAll() {
      if (this.tableData.length == 0) return;
      let id = this.tableData[0].id;
      this.$store.dispatch("playMusic", {
        list: this.tableData,
        id,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.titletags {
  position: relative;
  .tags {
    position: absolute;
  }
}
.artist-list {
  display: inline-block;
  &::after {
    display: inline;
    margin: 2px;
    content: "/";
  }
  &:last-child::after {
    content: " ";
  }
}
</style>
