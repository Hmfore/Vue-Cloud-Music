// 路由懒加载
//首页 发现音乐 个人推荐
const Main = () => import("../views/Main.vue");
const Discover = () => import("../views/Discover.vue");
const PersonalRecom = () => import("../views/DiscoverPage/PersonalRecom.vue");
//登录和404
const Login = () => import("../views/Login.vue");
const NotFound = () => import("../views/NotFound.vue");

//发现页子页(歌单、排行榜、歌手、最新音乐)
const SongSheet = () => import("../views/DiscoverPage/SongSheet.vue");
const RankList = () => import("../views/DiscoverPage/RankList.vue");
const Singer = () => import("../views/DiscoverPage/Singer.vue");
const LatestMusic = () => import("../views/DiscoverPage/LatestMusic.vue");
//需要登录
const DailyRecom = () => import("../views/user/DailyRecom.vue");
const PersonalFm = () => import("../views/user/PersonalFm.vue");
const Subscribe = () => import("../views/user/subscribe/Subscribe.vue");
const SubAlbum = () => import("../views/user/subscribe/SubAlbum.vue");
const SubArtists = () => import("../views/user/subscribe/SubArtists.vue");
const SubMv = () => import("../views/user/subscribe/SubMv.vue");
//历史页面
const HistoryPlay = () => import("../views/HistoryPlay.vue");
//搜索
const SearchList = () => import("../views/SearchList.vue");
//详情页(歌单详情，专辑详情，歌手详情，用户详情)
const SongListDetail = () => import("../views/SongListPage/SongListDetail.vue");
const AlbumDetail = () => import("../views/Detail/AlbumDetail.vue");
const SingerDetail = () => import("../views/Detail/SingerDetail.vue");
const UserDetail = () => import("../views/Detail/UserDetail.vue");

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
    redirect: "discover",
    children: [
      {
        path: "/discover",
        name: "discover",
        redirect: "/personalrecom",
        component: Discover,
        children: [
          {
            path: "/personalrecom",
            name: "personalrecom",
            component: PersonalRecom,
          },
          {
            path: "/songsheet",
            name: "songsheet",
            component: SongSheet,
          },
          {
            path: "/ranklist",
            name: "ranklist",
            component: RankList,
          },
          {
            path: "/singer",
            name: "singer",
            component: Singer,
          },
          {
            path: "/latestmusic",
            name: "latestmusic",
            component: LatestMusic,
          },
        ],
      },
      //收藏页
      {
        path: "subscribe",
        component: Subscribe,
        redirect: "/sub-album",
        meta: { check: true },
        children: [
          {
            path: "/sub-album",
            component: SubAlbum,
            meta: { check: true, title: "收藏的专辑" },
          },
          {
            path: "/sub-artists",
            component: SubArtists,
            meta: { check: true, title: "收藏的歌手" },
          },
          {
            path: "/sub-mv",
            component: SubMv,
            meta: { check: true, title: "收藏的MV" },
          },
        ],
      },
      {
        path: "/dailyrecom",
        name: "dailyrecom",
        meta: { check: true, title: "每日推荐" },
        component: DailyRecom,
      },
      {
        path: "/songlistdetail/:id",
        name: "songlistdetail",
        component: SongListDetail,
        props: true,
        meta: { title: "歌单" },
      },

      {
        path: "/albumdetail/:id",
        name: "albumdetail",
        props: true,
        component: AlbumDetail,
      },
      {
        path: "/singerdetail/:id",
        name: "singerdetail",
        props: true,
        component: SingerDetail,
        meta: { title: "专辑" },
      },
      {
        path: "userdetail/:id",
        component: UserDetail,
        props: true,
        meta: { title: "用户主页" },
      },
      {
        path: "/historyplay",
        component: HistoryPlay,
        meta: { title: "最近播放" },
      }, //最近播放页
      {
        path: "search",
        component: SearchList,
        props: (route) => ({ keywords: route.query.keywords }),
        meta: { title: "搜索结果" },
      }, // 搜索展示页
      {
        path: "personalfm",
        component: PersonalFm,
        meta: { check: true, title: "私人FM" },
      }, //私人FM歌曲页
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { check: false, title: "登录" },
  },
  {
    path: "*",
    redirect: {
      name: "login",
    },
  },
  { path: "*", component: NotFound, meta: { title: "NotFound" } }, //404
];
export default routes;
