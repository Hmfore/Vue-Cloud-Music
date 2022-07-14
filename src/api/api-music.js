import { get } from "../request";
//获取每日推荐歌单
export const getRecommendSong = () => get("/recommend/songs");
//获取新歌速递
export const getTopSong = (type) => get("/top/song", { type });
//喜欢音乐(需要登录)
export const likeMusic = (id, like = true) =>
  get("/like?", { id, like, timestamp: Date.now() });
//获取我喜欢的音乐列表
export const getLikeIdList = (uid) =>
  get("/likelist", { uid, timestamp: Date.now() });
//获取 歌曲url
export const getMusicUrl = (id) => get("/song/url", { id });
//获取歌词
export const getLyric = (id) => get("/lyric", { id });
//获取音乐详情
export const getMusicListByIds = (ids) => get("/song/detail", { ids });
//获取私人fm
export const getPersonalFm = () =>
  get("/personal_fm", { timestamp: Date.now() });
//退出登录
export const logout = () => get("/logout", { timestamp: Date.now() });
