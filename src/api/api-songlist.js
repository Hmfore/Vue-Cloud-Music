import { get, post } from "../request";
//获取未登录时候的推荐歌单
export const getPersonalized = (limit) => get("/personalized", { limit });
//获取歌单详情
export const getPlayListDetail = (id) =>
  get("/playlist/detail", { id, timestamp: Date.now() });
//获取歌单收藏者
export const getFollowerList = ({ id, limit = 30, offset }) =>
  get("/playlist/subscribers", { id, limit, offset });
//获取歌单分类
export const getAllCat = () => get("/playlist/catlist");
//获取热门歌单分类
export const getHotCat = () => get("/playlist/hot");
//根据分类获取歌单
export const getPlayListByCat = ({ limit, order, cat, offset }) =>
  get("/top/playlist", { limit, order, cat, offset });
//获取精品歌
export const getBoutique = (cat, limit, before) =>
  get("/top/playlist/highquality", { cat, limit, before });
//获取排行榜
export const getRankList = () => get("/toplist");

//获取每日推荐歌单
export const getRecommendSong = () => get("/recommend/songs");
//添加到自己的歌单或创建新的歌单
export const MusicToPlaylist = ({ op, pid, tracks }) =>
  get("/playlist/tracks", { op, pid, tracks });
