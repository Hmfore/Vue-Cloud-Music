import Vue from "vue";
import { getIp } from "@/request";
import { getAccount, getUserPlayList, logout } from "@/api/api-user";
import { getLikeIdList, getPersonalFm } from "@/api/api-music";
export default {
  async getCusIP({ commit }) {
    try {
      const res = await getIp();
      let arr = res.data.match(/[0-9]+(\.[0-9]+)+/);
      let ip = arr ? arr[0] : "";
      console.log(ip);
      commit("setIp", ip);
    } catch (error) {
      console.log(error);
    }
  },
  async getAccount({ commit, dispatch }) {
    /* 获取登录信息 */
    const res = await getAccount();
    console.log("登录信息", res);
    if (res.code !== 200) return;
    if (res.account !== null) {
      commit("setLoginInfo", res);
      commit("setIsLogin", true);
      dispatch("getMyPlayList");
      dispatch("getLikeList");
    } else {
      commit("setLoginInfo", { account: {}, profile: {} });
      commit("setIsLogin", false);
    }
  },
  logout({ commit, state }) {
    /* 退出登录 */
    if (!state.isLogin) return Vue.prototype.$message.warning("没有登录");
    Vue.prototype
      .$confirm("将要退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(async () => {
        const res = await logout();
        if (res.code !== 200) return;
        Vue.prototype.$message.success("退出成功");
        commit("setLoginInfo", { account: null, profile: null });
        commit("setIsLogin", false);
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
        Vue.prototype.$message({
          type: "info",
          message: "已取消",
        });
      });
  },
  //获取用户歌单
  async getMyPlayList({ commit, state }) {
    if (!state.isLogin) return;
    const res = await getUserPlayList(state.profile.userId);
    console.log("歌单", res);
    if (res.code !== 200) return;
    commit("setMyPlayList", res.playlist);
  },
  //获取我喜欢的音乐
  async getLikeList({ commit, state }) {
    const res = await getLikeIdList(state.profile.userId);
    if (res.code !== 200) return;

    if (res.ids instanceof Array) {
      commit("setLikeIdList", {
        type: "get",
        data: res.ids,
      });
    }
  },
  //播放音乐 payload :{list,id}
  playMusic({ commit }, payload) {
    commit("setMusicList", payload.list);
    commit("setCurrenMusicId", payload.id);
    let index = payload.list.findIndex((item) => item.id == payload.id);
    commit("setCurrenIndex", index);
    commit("setPlayType", "music");
    commit("setPlayState", true);
  },
  //私人fm
  async personalFm({ commit, state, dispatch }, operate) {
    /* {type,id} */
    if (operate.type === "get") {
      const res = await getPersonalFm();
      if (res.code !== 200)
        return Vue.prototype.$message.error("获取私人FM失败");
      const list = [];

      res.data.forEach((item) => {
        list.push({
          id: item.id,
          name: item.name,
          fee: item.fee,
          alia: item.alias,
          ar: item.artists,
          al: item.album,
          dt: item.duration,
          mv: item.mvid,
        });
      });
      commit("setPersonalFm", { type: "set", data: list });
      commit("setPlayType", "personalFm");
      commit("setPlayState", true);
    } else if (operate.type === "next") {
      if (state.musicList.length - 1 === state.currenIndex) {
        dispatch("personalFm", { type: "get" });
      } else {
        commit("setPersonalFm", { type: "next" });
      }
    } else if (operate.type === "remove") {
      const res = await fmTrash(operate.id);
      if (res.code !== 200) return Vue.prototype.$message.error("操作失败");
      Vue.prototype.$message.success("成功移到垃圾桶");
      dispatch("personalFm", { type: "next" });
    }
  },
};
