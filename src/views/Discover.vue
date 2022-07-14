<template>
  <div class="personalrecom">
    <div class="discover">
      <div class="router-list">
        <Tabmenu
          :menuList="routerList"
          mode="router"
          :defaultactive="activeMenu"
        />
      </div>
      <div class="personal-recom-content">
        <router-view />
      </div>
    </div>
  </div>
</template>
s
<script>
import Tabmenu from "../components/Tabmenu.vue";

export default {
  data() {
    return {
      activeMenu: "/personalrecom",
      routerList: [
        { path: "/personalrecom", title: "个性推荐" },
        { path: "/songsheet", title: "歌单" },
        { path: "/ranklist", title: "排行榜" },
        { path: "/singer", title: "歌手" },
        { path: "/latestmusic", title: "最新音乐" },
      ],
    };
  },
  components: {
    Tabmenu,
  },
};
</script>

<style lang="less" scoped>
.personalrecom {
  margin-top: 60px;
  .discover {
    .tabmenu {
      position: fixed;
      height: 60px;
      width: 100%;
      left: 200px;
      top: 60px;
      padding-left: 30px;
      z-index: 19;
    }
  }
}
</style>
