export default {
  setIp(state, ip) {
    state.ip = ip;
  },
  setIsLogin(state, isLogin) {
    state.isLogin = isLogin;
    if (isLogin) {
      window.sessionStorage.setItem("isLogin", true);
    } else {
      window.sessionStorage.removeItem("isLogin");
    }
  },
  //设置播放列表
  setMusicList(state, musicList) {
    state.musicList = musicList;
  },
  //播放状态
  setPlayState(state, isPlay) {
    state.isPlay = isPlay;
  },
  // 正在播放id
  setCurrenMusicId(state, currenMusicId) {
    state.currenMusicId = currenMusicId;
  },
  //正在播放索引
  setCurrenIndex(state, currenIndex) {
    state.currenIndex = currenIndex;
  },
  //播放类型
  setPlayType(state, playType) {
    if (playType === "music" || playType === "personalFm") {
      state.playType = playType;
    }
  },
  //用户歌单
  setMyPlayList(state, list) {
    state.myPlayList = list;
  },
  //展开播放列表
  setDrawerMusicList(state, drawerMusicList) {
    state.drawerMusicList = drawerMusicList;
  },
  //歌曲总时长
  setTotalTime(state, totalTime) {
    state.currenMusicInfo.totalTime = totalTime;
  },
  //当前播放时间
  setCurrenTime(state, currenTime) {
    state.currenMusicInfo.currenTime = currenTime;
  },
  //登录信息
  setLoginInfo(state, loginInfo) {
    state.account = loginInfo.account;
    state.profile = loginInfo.profile;
    window.sessionStorage.setItem("account", JSON.stringify(state.account));
    window.sessionStorage.setItem("profile", JSON.stringify(state.profile));
  },
  //历史播放
  setHistoryList(state, payload) {
    if (payload.type === "unshift") {
      const index = state.historyList.findIndex(
        (item) => item.id == payload.data.id
      );
      if (index !== -1) {
        state.historyList.splice(index, 1);
        state.historyList.unshift(payload.data);
        return;
      }
      state.historyList.unshift(payload.data);
      if (state.historyList.length > 50) {
        state.historyList.splice(-1, 1);
        console.log(state.historyList.length);
      }

      window.localStorage.setItem(
        "historylist",
        JSON.stringify(state.historyList)
      );
      return;
    } else if (payload.type === "get") {
      state.historyList = payload.data;
      return;
    } else if (payload.type === "clear") {
      state.historyList = [];
      window.localStorage.removeItem("historylist");
      return;
    }
  },

  //我喜欢的音乐
  setLikeIdList(state, payload) {
    if (payload.type === "get") {
      state.likeIdList = payload.data;
    } else if (payload.type === "unshift") {
      state.likeIdList.unshift(payload.data);
    } else if (payload.type === "remove") {
      state.likeIdList.splice(state.likeIdList.indexOf(payload.data), 1);
    }
    window.sessionStorage.setItem(
      "likeIdList",
      JSON.stringify(state.likeIdList)
    );
  },
  setPersonalFm(state, payload) {
    if (payload.type === "set") {
      state.musicList = payload.data;
      state.currenIndex = 0;
      state.currenMusicId = payload.data[0].id;
    } else if (payload.type === "next") {
      state.currenIndex++;
      state.currenMusicId = state.musicList[state.currenIndex].id;
    }
  },
};
