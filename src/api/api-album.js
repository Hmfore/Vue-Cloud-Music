import { get } from "@/request";
//新碟上架
export const getNewAlbum = ({ limit, offset, area, type, year, month }) =>
  get("/top/album", { limit, offset, area, type, year, month });
// 获取专辑内容
export const getAlbumDetail = (id) => get("/album", { id });

//获取专辑动态内容，评论收藏等
export const getAlbumDynamic = (id) =>
  get("/album/detail/dynamic", { id, timestamp: Date.now() });

//获取收藏的专辑
export const getSubAlbum = (offset = 0, limit = 25) =>
  get("/album/sublist", { offset, limit, timestamp: Date.now() });
//收藏专辑
export const setAlbumSub = (id, t) =>
  get("/album/sub", { id, t, timestamp: Date.now() });
