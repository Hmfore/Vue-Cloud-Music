<template>
  <!-- 收藏页父路由 -->
  <div class="subscribe-view">
    <div class="router-list">
      <TabMenu
        :menuList="subRouteList"
        mode="router"
        :defaultactive="activeMenu"
      />
    </div>
    <div class="sub-main mtop-60">
      <transition name="el-fade-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import TabMenu from "@/components/Tabmenu";
export default {
  components: { TabMenu },
  data() {
    return {
      activeMenu: "/sub-album",
      subRouteList: [
        { path: "/sub-album", title: "专辑" },
        { path: "/sub-artists", title: "歌手" },
        { path: "/sub-mv", title: "视频" },
      ],
    };
  },
};
</script>
