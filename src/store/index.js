import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";
import actions from "./actions";
Vue.use(Vuex);
const state = {
  Ip: "",
  //播放列表
  musicList: [],
  //历史播放列表
  historyList: [],
  // 播放状态
  isPlay: false,
  // 当前播放的id
  currenMusicId: 0,
  // 当前播放的列表下标
  currenIndex: 0,
  // 播放列表抽屉的状态
  drawerMusicList: false,
  playType: "music", //music,personalFm
  // 播放音乐的总时间和当前时间
  currenMusicInfo: {
    totalTime: 0,
    currenTime: 0,
  },
  //是否登录
  isLogin: window.sessionStorage.getItem("isLogin") !== "true" ? false : true,
  // 用户信息
  profile: window.sessionStorage.getItem("profile")
    ? JSON.parse(window.sessionStorage.getItem("profile"))
    : {},
  //账号信息
  account: window.sessionStorage.getItem("account")
    ? JSON.parse(window.sessionStorage.getItem("account"))
    : {},
  //喜欢的音乐列表
  likeIdList: window.sessionStorage.getItem("likeIdList")
    ? JSON.parse(window.sessionStorage.getItem("likeIdList"))
    : [],
  //用户的歌单
  myPlayList: [],
};
const getters = {
  createPlaylist(state) {
    // 创建的歌单
    return state.isLogin
      ? state.myPlayList.filter((item) => item.userId === state.profile.userId)
      : [];
  },
  subscribePlaylist(state) {
    // 收藏的歌单
    return state.isLogin
      ? state.myPlayList.filter((item) => item.userId !== state.profile.userId)
      : [];
  },
  userId(state) {
    return state.isLogin ? state.profile.userId : 0;
  },
};
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
export default store;
