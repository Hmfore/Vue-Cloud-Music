<template>
  <div class="main">
    <!-- 顶部导航栏 -->

    <div class="header">
      <TopBar />
    </div>
    <!-- 主体内容 -->
    <div class="content">
      <!-- 侧边导航栏 -->
      <div class="aside sliderbar">
        <NavBar @TabItemClick="ItemClick" />
      </div>

      <!-- 内容 -->
      <div class="body sliderbar" ref="scrollref">
        <div class="view-main">
          <transition name="el-fade-in">
            <router-view />
          </transition>
        </div>
      </div>
    </div>
    <!-- 播放歌曲列表弹出层 -->
    <el-drawer
      title="当前播放"
      :visible.sync="drawerMusicList"
      :before-close="handMusicListClose"
    >
      <div class="flex-around">
        <div class="font-12 mleft-12">总 {{ length }} 首</div>
        <div class="font-12 mleft-12">
          <span v-show="length !== 0">当前播放第 {{ currenIndex + 1 }} 首</span>
          <span v-show="length === 0">没有在播放哦</span>
        </div>
      </div>
      <el-divider></el-divider>
      <el-table
        :data="musicList"
        style="width: 100%"
        size="mini"
        stripe
        @row-dblclick="playMusic"
        empty-text="快去播放音乐吧！"
        tooltip-effect="light"
      >
        <el-table-column type="index" width="50">
          <template v-slot="scope">
            <span style="color: red" v-if="showCurren(scope.row.id)"
              ><i v-if="isPlay" class="iconfont icon-shengyin_shiti"></i
              ><i v-else class="iconfont icon-sound"></i
            ></span>

            <span v-else>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="音乐标题">
        </el-table-column>
        <el-table-column prop="ar[0].name" show-overflow-tooltip label="歌手">
        </el-table-column>
        <el-table-column prop="dt" label="时长">
          <template v-slot="{ row }">
            {{ (row.dt / 1000) | timeFormat }}
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
    <!-- 底部栏 -->
    <div class="footer">
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Footer from "@/components/MainPage/Footer.vue";
import TopBar from "../components/MainPage/Topbar.vue";
import NavBar from "../components/MainPage/Navbar.vue";

export default {
  data() {
    return {};
  },
  components: {
    TopBar,
    NavBar,
    Footer,
  },
  computed: {
    ...mapState([
      "musicList",
      "drawerMusicList",
      "currenMusicId",
      "isLogin",
      "currenIndex",
      "isPlay",
    ]),
    length() {
      return this.musicList.length;
    },
  },
  methods: {
    ItemClick(key) {
      this.$refs.scrollref.scrollTop = 0;
      window.sessionStorage.setItem("activeMenu", key);
    },
    handMusicListClose() {
      this.$store.commit("setDrawerMusicList", false);
    },
    showCurren(id) {
      return this.currenMusicId === id;
    },
    playMusic(row) {
      // console.log('列表没变', this.tableData == this.musicList)
      this.$store.dispatch("playMusic", {
        list: this.musicList,
        id: row.id,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  .header {
    position: absolute;
    height: 60px;
    width: 100%;
    top: 0;
  }

  .content {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 80px;
    height: auto;
    width: auto;
    .aside {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 200px;
      height: 100%;
      overflow-x: hidden;
    }
    .body {
      position: absolute;
      left: 200px;
      top: 0;
      bottom: 0;
      right: 0;
      height: 100%;
      width: auto;
      overflow-y: auto;
      overflow-x: hidden;
      .view-main {
        width: 90%;
        margin: 0 auto;
        max-width: 1200px;
      }
    }
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 80px;
    width: 100%;
  }
}
.el-divider--horizontal {
  margin: 10px 0 5px;
}
</style>
