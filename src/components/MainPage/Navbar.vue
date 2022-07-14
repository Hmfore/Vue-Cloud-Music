<template>
  <div class="aside-navbar">
    <el-row>
      <el-col :span="24">
        <el-menu
          :default-active="activeMenu"
          active-text-color="#040404"
          @select="asideSelect"
        >
          <el-menu-item
            :index="item.path"
            v-for="item in commenList"
            :key="item.path"
            :disabled="item.Login && !isLogin"
          >
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
          <el-menu-item-group>
            <template slot="title">我的音乐</template>
            <el-menu-item
              :index="item.path"
              v-for="item in myList"
              :key="item.path"
              :disabled="item.Login && !isLogin"
              ><span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group v-if="isLogin">
            <template slot="title">创建的歌单</template>
            <el-menu-item
              :index="subPath(item.id)"
              v-for="(item, index) in createPlaylist"
              :key="item.id"
              ><div slot="title" class="text-hidden">
                <i v-if="index === 0" class="iconfont icon-aixin"></i>
                <i v-else class="iconfont icon-gedan"></i>{{ item.name }}
              </div>
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group v-if="isLogin">
            <template slot="title">收藏的歌单</template>
            <el-menu-item
              :index="subPath(item.id)"
              v-for="item in subscribePlaylist"
              :key="item.id"
              ><div slot="title" class="text-hidden">
                <i class="iconfont icon-gedan"></i>{{ item.name }}
              </div>
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      activeMenu: "/personalrecom",
      menuList: [
        { path: "/personalrecom", title: "发现音乐", Login: false, type: 0 },
        { path: "/dailyrecom", title: "每日推荐", Login: true, type: 1 },
        { path: "/personalfm", title: "私人FM", Login: true, type: 0 },
        { path: "/historyplay", title: "最近播放", Login: false, type: 1 },
        { path: "/subscribe", title: "我的收藏", Login: true, type: 1 },
      ],
    };
  },
  methods: {
    asideSelect(index) {
      // this.$emit("TabItemClick", index);
      if (window.sessionStorage.getItem("navActive") !== index) {
        window.sessionStorage.setItem("navActive", index);

        return this.$router.push(index);
      }
      return;
    },
    subPath(id) {
      if (typeof id === "number") return `/songlistdetail/${id}`;
      else return "/404";
    },
  },
  created() {
    if (window.sessionStorage.getItem("navActive"))
      this.activeMenu = window.sessionStorage.getItem("navActive");
    this.$store.dispatch("getMyPlayList");
  },
  watch: {
    /* 监听route,改变激活项 */
  },
  computed: {
    ...mapState([
      // 'musicList',
      // 'drawerMusicList',
      // 'currenMusicId',
      "isLogin",
      // 'currenIndex',
      // 'isPlay',
      "profile",
    ]),
    ...mapGetters(["createPlaylist", "subscribePlaylist", "userId"]),
    commenList() {
      return this.menuList.filter((item) => item.type == 0);
    },
    /* 我的菜单 */
    myList() {
      return this.menuList.filter((item) => item.type == 1);
    },
  },
};
</script>

<style lang="less" scoped>
.aside-navbar {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 199px;
  width: 200px;
  overflow-y: auto;
  .is-active {
    font-size: 17px;
    font-weight: bold;
  }
}
</style>
